---
sidebar_position: 5
title: "Add Dynamic Configuration"
---

Monk offers a convenient way to pass arbitrary text files (such as config files) to any container from the template level. Such files can be generated on the fly at container startup making it easy to create dynamic configuration for services based on Monk variables.

## Nginx example

Let's take an nginx template as an example an analyze how nginx configuration is passed to the container:

```yaml title="nginx.yaml" linenums="1"
namespace: nginx
reverse-proxy:
    defines: runnable

    containers:
        defines: containers
        nginx-reverse-proxy:
            image-tag: latest
            ports: <- `0.0.0.0:${listen-port}:${listen-port}/tcp`
            image: bitnami/nginx

    variables:
        defines: variables
        server-name: www.example.com
        listen-port: 8080
        proxy-target-host: google.com
        proxy-target-port: 80

    files:
        defines: files
        server-def:
            container: nginx-reverse-proxy
            path: /opt/bitnami/nginx/conf/server_blocks/reverse_proxy.conf
            mode: 511
            contents: |
                server {
                    listen 0.0.0.0:{{ v "listen-port" }};
                    server_name {{ v "server-name" }};
                    location / {
                        proxy_pass http://{{ v "proxy-target-host" }}:{{ v "proxy-target-port" }};
                    }
                }
```

Above example defines a basic nginx container that doesn't have any specific config inside by default.

In order to insert the config file `/opt/bitnami/nginx/conf/server_blocks/reverse_proxy.conf` defining a reverse proxy configuration, one could prepare a new container image based on `bitnami/nginx` and have the file set up as a part of the image. This approach comes with a disadvantage of having to prepare and build the image, which in turn means that all the values have to be known at build time.

Monk solves this issue by allowing to specify a `files` section in any `runnable`.

### File definition

In the above example we have defined one file `server-def` which specifies:

`container`
put the file in `nginx-reverse-proxy` of the runnable,

`path`
put the file under `/opt/bitnami/nginx/conf/server_blocks/reverse_proxy.conf` path **within** the container,

`mode`
set the file permissions to octal `511`,

### File contents

The `content` field contains what will be the file contents once it is created inside the container. Those contents could be any static text which would be put into the file verbatim, or some text templating can be used as shown in the above example.

### Templating

Monk currently uses a very simple templating syntax which allows for placing

    {{ v "variable-name" }}

blocks anywhere in the file contents. These blocks are replaced with variable contents **at runtime** when the container specified in the file definition is starting.

For example the line:

    listen 0.0.0.0:{{ v "listen-port" }};

will turn into:

    listen 0.0.0.0:8080;

as the `listen-port` variable specified in the `variables` section of the runnable currently has value of `8080`.

## Overriding configuration contents

### Re-using the templated contents

Assuming you'd like to run nginx reverse proxy with custom settings, you could just override variables like so:

```yaml title="my-proxy.yaml" linenums="1"
namespace: guides

my-proxy:
    defines: runnable
    inherits: nginx/reverse-proxy
    variables:
        server-name: my-service
        proxy-target-host: <- get-hostname("guides/database", "database")
        proxy-target-port: 9090
```

Running this template would result in having an nginx container with the following configuration in its `reverse_proxy.conf`:

```conf title="reverse_proxy.conf" linenums="1"
server {
    listen 0.0.0.0:8080;
    server_name myservice.com
    location / {
        proxy_pass http://10.1.0.23:9090;
    }
}
```

Notice how the proxy target address was computed dynamically and placed into the right place in the configuration. This is a very powerful feature allowing for re-use of config files at the template level.

### Re-defining the contents

Let's say you need to provide more tweaks to the provided reverse-proxy config file. It can be easily achieved by overriding the `contents` field.

Let's add websocket support to the reverse proxy template we have:

```yaml title="my-nginx.yaml" linenums="1"
namespace: my-nginx

reverse-proxy-with-sockets:
    defines: runnable
    inherits: nginx/reverse-proxy
    files:
        server-def:
            contents: |
                server {
                    listen 0.0.0.0:{{ v "listen-port" }};
                    server_name {{ v "server-name" }};
                    location / {
                        proxy_pass http://{{ v "proxy-target-host" }}:{{ v "proxy-target-port" }};

                        proxy_http_version 1.1;
                        proxy_set_header Upgrade $http_upgrade;
                        proxy_set_header Connection "Upgrade";
                        proxy_set_header Host $host;

                    }
                }
```

We've just extended the configuration by replacing the file contents with new contents containing nginx options to allow for proxying websocket connections. The rest of the `reverse-proxy-with-sockets` is identical to the `nginx/reverse-proxy` and can be used in place of it.

## Conclusion

Working with configuration files at template level gives a lot of control over configuration contents and enables re-use of common configuration patterns.
