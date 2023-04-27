---
title: "Porting Apps from K8s"
---

This guide will show you how easy it os to port Kubernetes apps to Monk.

To demonstrate this, we'll use [YELB](https://github.com/mreferre/yelb), a simple microservice oriented web application.

## YELB Design

YELB's design is well documented [here](https://github.com/mreferre/yelb#yelb-architecture).

A quick glance at the architecture tells us we'll need to create definitions for four [runnables](monkscript/yaml/runnables/) and one [process group](monkscript/yaml/groups) group them all together.

## Digging In

To speed things up, we can cheat a bit since YELB (as with many other Kubernetes applications) provides YAML definitions for the containers and environment configuration.

A specific YAML definition that contains all necessary service definitions and deployments is located on [this page](https://github.com/mreferre/yelb/blob/master/deployments/platformdeployment/Kubernetes/yaml/yelb-k8s-minikube-nodeport.yaml).

## YELB Deployments

Deployments in Monk are very similar to Kubernetes [(see runnables for more info)](monkscript/yaml/runnables/). We have four deployments defined in the Kubernetes YAML, which we'll now port to Monk.

We'll start with porting the YELB deployments, then try to run them and see what problems need to be resolved to get it up and running. With most microservice apps, we will have to port Kubernetes Services configurations so the app can communicate between its components.

### yelb-ui

We'll start with UI. The YAML spec looks like this:

```yaml title="Kubernetes"
apiVersion: apps/v1
kind: Deployment
metadata:
    name: yelb-ui
spec:
    replicas: 1
    selector:
        matchLabels:
            app: yelb-ui
            tier: frontend
    template:
        metadata:
            labels:
                app: yelb-ui
                tier: frontend
        spec:
            containers:
                - name: yelb-ui
                image: mreferre/yelb-ui:0.7
                ports:
                    - containerPort: 80
```

The most interesting part for us is the container spec:

```yaml title="Kubernetes"
spec:
    containers:
        - name: yelb-ui
        image: mreferre/yelb-ui:0.7
        ports:
            - containerPort: 80
```

We need something similar in Monk to run the application component. Lets define our [runnable](monkscript/yaml/runnables/) and put that information in. It will look like this:

```yaml title="Monk"
namespace: /yelb

ui:
    defines: runnable
    containers:
        yelb-ui:
            image-tag: "0.7"
            image: mreferre/yelb-ui
```

That should be enough for the component to start.

:::note

We've deliberately skipped `containerPort`, but we'll get to that part later. For now, we want to try to start every single component (or not).

:::

### yelb-appserver

We'll do the same with appserver. It's YAML spec looks like:

```yaml title="Kubernetes"
apiVersion: apps/v1
kind: Deployment
metadata:
    name: yelb-appserver
spec:
    replicas: 1
    selector:
        matchLabels:
            app: yelb-appserver
            tier: middletier
    template:
        metadata:
            labels:
                app: yelb-appserver
                tier: middletier
        spec:
            containers:
                - name: yelb-appserver
                image: mreferre/yelb-appserver:0.5
                ports:
                    - containerPort: 4567
```

Again, we will look at containers spec, and produce similar YAML:

```yaml title="Monk"
namespace: /yelb

appserver:
    defines: runnable
    containers:
        yelb-appserver:
            image-tag: "0.5"
            image: mreferre/yelb-appserver
```

### yelb-db

We'll do the same with db server. It's YAML spec looks like:

```yaml title="Kubernetes"
apiVersion: apps/v1
kind: Deployment
metadata:
    name: yelb-db
spec:
    replicas: 1
    selector:
        matchLabels:
            app: yelb-db
            tier: backenddb
    template:
        metadata:
            labels:
                app: yelb-db
                tier: backenddb
        spec:
            containers:
                - name: yelb-db
                image: mreferre/yelb-db:0.5
                ports:
                    - containerPort: 5432
```

Again, we'll reference the containers spec and produce similar YAML:

```yaml title="Monk"
namespace: /yelb

db:
    defines: runnable
    containers:
        yelb-db:
            image-tag: "0.5"
            image: mreferre/yelb-db
```

### redis-server

We will do the same with redis server. It's YAML spec looks like:

```yaml title="Kubernetes"
apiVersion: apps/v1
kind: Deployment
metadata:
    name: redis-server
spec:
    replicas: 1
    selector:
        matchLabels:
            app: redis-server
            tier: cache
    template:
        metadata:
            labels:
                app: redis-server
                tier: cache
        spec:
            containers:
                - name: redis-server
                image: redis:4.0.2
                ports:
                    - containerPort: 6379
```

Referencing the contianer spec, we'll write similar YAML:

```yaml title="Monk"
namespace: /yelb

redis:
    defines: runnable
    containers:
        redis-server:
            image-tag: "4.0.2"
            image: redis
```

## Starting YELB in Monk for the First Time

Since we have all runnable defitions completed, it's time to try to run them.

### Loading Kits into Monk

First we need to load them into monk, we can achieve this by running:

```bash
$ monk load *yaml
```

If all goes well, we'll see:

```
✔ Read files successfully
✔ Loaded yelb-appserver.yaml successfully
✔ Loaded yelb-db.yaml successfully
✔ Loaded yelb-redisserver.yaml successfully
✔ Loaded yelb-ui.yaml successfully

Loaded 4 runnables, 0 process groups and 0 services in 4 files with 0 errors and 0 warnings
✨ Loaded:
 └─🔩 Runnables:
    ├─🧩 yelb/appserver
    ├─🧩 yelb/db
    ├─🧩 yelb/redis
    └─🧩 yelb/ui

✔ All templates loaded successfully
```

### Running Workloads

Since we have the definitions loaded, we can now start them individually.

:::note

Later, we'll create a [process group](monkscript/yaml/groups) that will allow us to start all of them at the same time.

:::

```bash
$ monk run yelb/appserver
(...)
$ monk run yelb/db
(...)
$ monk run yelb/redis
(...)
$ monk run yelb/ui
(...)
```

Let's check status of the workloads:

```bash
$ monk ps
✔ Got state
Group/Runnable/Containers                            Uptime   Peer   Ports
🔩 local/yelb/redis
 └─📦 templates-local-yelb-redis-redis-server        1m 28s   local
🔩 local/yelb/appserver
 └─📦 templates-local-yelb-appserver-yelb-appserver  3m 10s   local
🔩 local/yelb/ui
 └─📦 templates-local-yelb-ui-yelb-ui                33s      local
🔩 local/yelb/db
 └─📦 templates-local-yelb-db-yelb-db                2m 25s   local
```

### Checking Logs

Once everything is running, we can check logs from the running containers.

##### yelb-db logs

```bash
$ monk logs yelb/db
(...)
PostgreSQL init process complete; ready for start up.
2021-05-15 10:51:52.492 UTC [1] LOG:  listening on IPv4 address "0.0.0.0", port 5432
2021-05-15 10:51:52.492 UTC [1] LOG:  listening on IPv6 address "::", port 5432
2021-05-15 10:51:52.567 UTC [1] LOG:  listening on Unix socket "/var/run/postgresql/.s.PGSQL.5432"
2021-05-15 10:51:52.918 UTC [67] LOG:  database system was shut down at 2021-05-15 10:51:52 UTC
2021-05-15 10:51:53.017 UTC [1] LOG:  database system is ready to accept connections

```

We can see `database system is ready to accept connections` message which means our database is running properly.

##### yelb-redis logs

```bash
$ monk logs yelb/redis
(...)
1:M 15 May 14:42:26.180 # Server initialized
1:M 15 May 14:42:26.180 # WARNING overcommit_memory is set to 0! Background save may fail under low memory condition. To fix this issue add 'vm.overcommit_memory = 1' to /etc/sysctl.conf and then reboot or run the command 'sysctl vm.overcommit_memory=1' for this to take effect.
1:M 15 May 14:42:26.181 # WARNING you have Transparent Huge Pages (THP) support enabled in your kernel. This will create latency and memory usage issues with Redis. To fix this issue run the command 'echo never > /sys/kernel/mm/transparent_hugepage/enabled' as root, and add it to your /etc/rc.local in order to retain the setting after a reboot. Redis must be restarted after THP is disabled.
1:M 15 May 14:42:26.181 * Ready to accept connections
```

The `Ready to accept connections` message means our [Redis](https://redis.io/) server is running properly.

##### yelb-ui logs

```bash
$ monk logs yelb/ui
(...)
2021/05/15 14:43:20 [emerg] 12#12: host not found in upstream "yelb-appserver" in /etc/nginx/conf.d/default.conf:5
nginx: [emerg] host not found in upstream "yelb-appserver" in /etc/nginx/conf.d/default.conf:5
```

We'll have to fix the `host not found` issue.

##### yelb-appserver logs

```bash
$ monk logs yelb/appserver
[2021-05-15 14:40:43] INFO  WEBrick 1.3.1
[2021-05-15 14:40:43] INFO  ruby 2.4.2 (2017-09-14) [x86_64-linux]
== Sinatra (v2.0.5) has taken the stage on 4567 for production with backup from WEBrick
[2021-05-15 14:40:43] INFO  WEBrick::HTTPServer#start: pid=7 port=4567
```

The `WEBrick::HTTPServer#start` message indicates the app server is running properly.

### Checking Connectivity

Now we need to check to see if we can open our application. Since this is web app, it should listen on port 80. We can test this with `curl`:

```bash
$ curl localhost
curl: (7) Failed to connect to localhost port 80: Connection refused
```

The connection refused message means we didn't expose our application properly.

## Fixing Problems

So far we've identified two problems: both related to UI. We can't connect to the web page and there's a problem with a configuration setting that points towards an incorrect appserver container hostname. We know this because we've seen a Service defined called `yelb-appserver` in the Kubernetes manifests.

### Connectivity

Let's take a quick look at the original YAML for Kubernetes.

```bash title="Kubernetes"
apiVersion: v1
kind: Service
metadata:
name: yelb-ui
labels:
    app: yelb-ui
    tier: frontend
spec:
type: NodePort
ports:
- port: 80
    protocol: TCP
    targetPort: 80
    # nodePort: 32777 <- if not specified, the system will generate a nodePort value
selector:
    app: yelb-ui
    tier: frontend
```

We can see that `Service` listens and redirects requests to port 80. Lets amend our `yelb/ui` spec to match that. To do that, we simply need to add a `ports` section to our manifest.

```bash title="Monk"
namespace: /yelb

ui:
defines: runnable
containers:
    yelb-ui:
    image-tag: "0.7"
    image: mreferre/yelb-ui
    ports:
        - 80:80
```

Now we need to update the Kit and our workload:

```bash
$ monk load yelb-ui.yaml
✔ Read files successfully
✔ Loaded yelb-ui.yaml successfully

Loaded 1 runnables, 0 process groups and 0 services in 1 files with 0 errors and 0 warnings
✨ Loaded:
 └─🔩 Runnables:
    └─🧩 yelb/ui

✔ All templates loaded successfully
```

```bash
$ monk update yelb/ui
✔ Starting job... DONE
✔ Preparing nodes DONE
✔ Checking/pulling images DONE
✔ Updating containers DONE
✔ Updating templates-local-yelb-ui-yelb-ui DONE
✔ Stopping old templates-local-yelb-ui-yelb-ui DONE
✔ Removing old templates-local-yelb-ui-yelb-ui DONE
✔ Starting new templates-local-yelb-ui-yelb-ui DONE
✔ ✨yelb/ui updated successfully
🔩 yelb/ui
 └─🧊 local
    └─📦 templates-local-yelb-ui-yelb-ui
       ├─🧩 mreferre/yelb-ui:0.7
       └─🔌 open localhost:80 -> 80
```

Now we can see our port redirection definition worked (via the `open localhost:80 -> 80` message in the output). However, a `curl` test might still fail due to an incorrect nginx configuration as we've seen previously.

### Nginx Configuration

The application is configured to automatically redirect requests to appserver listening on the `yelb-appserver` address. We can check if there's any possibility that we can overwrite this by using some environment variables or perhaps a startup parameter. To check that, we will simply use the `docker inspect` command on the image that the ui uses.

```bash
$ docker image ls | grep ui
mreferre/yelb-ui                0.7           959bb4605293   9 months ago    167MB

$ docker inspect 959bb4605293^C
(...)
            "Env": [
                "PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin",
                "NGINX_VERSION=1.17.10",
                "NJS_VERSION=0.3.9",
                "PKG_RELEASE=1~buster",
                "UI_ENV=prod"
            ],
            "Cmd": [
                "./startup.sh"
            ],
...
```

Unfortunately, in this case, there's no environment variables that we could overwrite. Let's see what's in the startup script. We can check it by trying to start container with a command to check the contents of the startup script or by going to the GitHub repository and opening the corresponding file.

1. Check the file [here](https://github.com/mreferre/yelb/blob/master/yelb-ui/startup.sh).
2. Run `docker run 959bb4605293 cat /startup.sh` command.

We need to update `proxy_pass http://yelb-appserver:4567/api;` with the real name of docker container running our `yelb-appserver`.

We will utilise three the Monk features here:

1. `bash` [option](monkscript/yaml/runnables#container) that will overwrite our docker command.
2. `get-hostname` [function](monkscript/scripting/operators/network#get-hostname-get-container-ip), as Monk sometimes changes the name of the container.
3. `variables` [section](monkscript/yaml/runnables#variables) of the YAML definition.

Lets combine all the information into our YAML file:

```bash title="Monk"
namespace: /yelb

ui:
defines: runnable
containers:
    yelb-ui:
    image-tag: "0.7"
    image: mreferre/yelb-ui
    ports:
        - 80:80
    bash: <- `sed -e "s/yelb-appserver/${yelb-appserver-addr}/g" -i /startup.sh &&
        /startup.sh`

variables:
    port: 80
    yelb-appserver-addr:
    type: string
    # get-hostname syntax is "namespace/runnable", "container_name"
    value: <- get-hostname("yelb/appserver", "yelb-appserver")
```

We should now update our Kit and workload.

```bash
$ monk load yelb-ui.yaml
(...)
$ monk update yelb/ui
(...)
$ monk logs -f yelb/ui
(...)
```

The `monk logs -f yelb/ui` will tail the logs. Now, launch a web browser and try open the page. Some logs should start appearing.

```bash
(...)
192.168.0.90 - - [15/May/2021:15:50:30 +0000] "GET //api/outback HTTP/1.1" 500 30 "http://monk03.lan/" "Mozilla/5.0 (X11; Linux x86_64; rv:88.0) Gecko/20100101 Firefox/88.0" "-"
192.168.0.90 - - [15/May/2021:15:50:30 +0000] "GET //api/getvotes HTTP/1.1" 500 30 "http://monk03.lan/" "Mozilla/5.0 (X11; Linux x86_64; rv:88.0) Gecko/20100101 Firefox/88.0" "-"
```

Judging by the logs while trying to 'Vote' on the page, we can see the functionaly is still broken.

### Fixing appserver

We know the /api functionality is being proxied to our yelb-appserver by examining the nginx configuration of the UI. Let's check its logs:

```bash
$ monk logs yelb/appserver
(...)
172.23.0.5 - - [15/May/2021:15:50:25 UTC] "GET /api/getstats HTTP/1.1" 500 30
http://monk03.lan/ -> /api/getstats
2021-05-15 15:50:26 - PG::ConnectionBad - could not translate host name "yelb-db" to address: Name or service not known
(...)
172.23.0.5 - - [15/May/2021:15:50:25 UTC] "GET /api/getvotes HTTP/1.1" 500 30
http://monk03.lan/ -> /api/getvotes
2021-05-15 15:50:25 - Redis::CannotConnectError - Error connecting to Redis on redis-server:6379 (SocketError):
(...)
```

We have similar problem like we had with our UI--the application looks for its components on predefined addresses. We will have to update appserver as well, so it can connect to proper containers. Again, we will have a look at our container.

Let's check our appserver image, similar way like we did with UI:

```bash
$ docker image ls | grep appserver
mreferre/yelb-appserver         0.5           94e995994d78   23 months ago   429MB

$ docker inspect 94e995994d78
(...)
            "Env": [
                "PATH=/opt/bitnami/ruby/bin:/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin",
                "BITNAMI_APP_NAME=ruby",
                "BITNAMI_IMAGE_VERSION=2.4.2-r1",
                "LANG=en_us.UTF-8",
                "LC_ALL=C.UTF-8",
                "RACK_ENV=production"
            ],
            "Cmd": [
                "./startup.sh"
            ],
```

There seems to be nothing that would allow us to change easily those two. Let's check what's in the `startup.sh` script by either:

1. Checking its [file in github](https://github.com/mreferre/yelb/blob/master/yelb-appserver/startup.sh), or
2. Running `docker run 94e995994d78 cat /startup.sh`.

Now we know it basically runs `/app/yelb-appserver.rb`. Again, we will have to check the contents of the file to see if we can sort out the problems we're having. We can see that part of the file consists partially static configuration:

```bash
  set :redishost, "redis-server"
  set :port, 4567
  set :yelbdbhost => "yelb-db"
  set :yelbdbport => 5432
  set :yelbddbrestaurants => ENV['YELB_DDB_RESTAURANTS']
  set :yelbddbcache => ENV['YELB_DDB_CACHE']
  set :awsregion => ENV['AWS_REGION']
```

Unfortunately, the options we would like to change are hardcoded into application. We need to modify the file again and overwrite `Cmd` in our docker container. Keeping all this in mind, let's prepare our new appserver manifest by using [arrow script](monkscript/yaml#arrow-scripts), `get-hostname` [function](monkscript/scripting/operators/network/) and `variables` [section](monkscript/yaml/runnables#variables).

Our YAML should look like:

```yaml title="Monk"
namespace: /yelb

appserver:
    defines: runnable
    containers:
        yelb-appserver:
            image-tag: "0.5"
            image: mreferre/yelb-appserver
            bash:
                <- `sed -e "s/yelb-db/${yelb-db-addr}/g" -i /app/yelb-appserver.rb &&
                sed -e "s/redis-server/${yelb-redis-addr}/g" -i /app/yelb-appserver.rb &&
                /startup.sh`

    variables:
        port: 4567
        yelb-db-addr:
            type: string
            value: <- get-hostname("yelb/db", "yelb-db")

        yelb-redis-addr:
            type: string
            value: <- get-hostname("yelb/redis", "redis-server")
```

We should update our Kit and workload.

```bash
$ monk load yelb-appserver.yaml
(...)
$ monk update yelb/appserver
(...)
$ monk logs -f yelb/appserver
(...)
```

We can now open the webpage again. It should now work correctly.

## Process Groups

Now that we have everything working together without any problems, we can 'beutify' our configuration a bit. We'll start by removing our workload to demonstrate how having predefined templates lets us start of our workloads all at once.

```bash
$ monk purge local/yelb/db
(...)
$ monk purge local/yelb/appserver
(...)
$ monk purge local/yelb/ui
(...)
$ monk purge local/yelb/redis
(...)
```

To define a [process group](monkscript/yaml/groups), we'll have to create YAML with list of runnables that will be part of our group. It will look like:

```yaml title="Monk"
namespace: /yelb

# We will call our group 'application'
application:
    defines: process-group

    # And we will put a list of runnables that will consist of this group
    runnable-list:
        - /yelb/appserver
        - /yelb/db
        - /yelb/ui
        - /yelb/redis
```

This will create a group called `application` which we can operate via `yelb/application` syntax.

Let's load it and try to start it.

```bash
$ monk load yelb-group.yaml
✔ Read files successfully
✔ Loaded yelb-group.yaml successfully

Loaded 0 runnables, 1 process groups and 0 services in 1 files with 0 errors and 0 warnings
✨ Loaded:
 └─🔗 Process groups:
    └─🧩 yelb/application

✔ All templates loaded successfully
```

```bash
$ monk run yelb/application
✔ Starting the job... DONE
✔ Preparing nodes DONE
✔ Checking/pulling images DONE
✔ Starting containers DONE
✔ New container templates-local-yelb-appserver-yelb-appserver created DONE
✔ New container templates-local-yelb-db-yelb-db created DONE
✔ New container templates-local-yelb-ui-yelb-ui created DONE
✔ Started yelb/application

✨ All done!

🔩 yelb/application
 └─🧊 local
    ├─📦 templates-local-yelb-db-yelb-db
    │  └─🧩 mreferre/yelb-db:0.5
    ├─📦 templates-local-yelb-ui-yelb-ui
    │  ├─🧩 mreferre/yelb-ui:0.7
    │  └─🔌 open localhost:80 -> 80
    ├─📦 templates-local-yelb-appserver-yelb-appserver
    │  └─🧩 mreferre/yelb-appserver:0.5
    └─📦 templates-local-yelb-redis-redis-server
       └─🧩 redis:4.0.2

💡 You can inspect and manage your above stack with these commands:
        monk logs (-f) yelb/application - Inspect logs
        monk shell     yelb/application - Connect to the container shell
        monk do        yelb/application/action_name - Run defined action (if exists)
💡 Check monk help for more!
```

```bash
$ monk ps
✔ Got state
Group/Runnable/Containers                               Uptime   Peer   Ports
🔗 local/yelb/application
   🔩 local/yelb/appserver
    └─📦 templates-local-yelb-appserver-yelb-appserver  48s      local
   🔩 local/yelb/db
    └─📦 templates-local-yelb-db-yelb-db                38s      local
   🔩 local/yelb/ui
    └─📦 templates-local-yelb-ui-yelb-ui                25s      local  80:80
   🔩 local/yelb/redis
    └─📦 templates-local-yelb-redis-redis-server        12s      local
```

All our components have been started at once!

Our application should be running exactly the same as previously, but this gives us more flexibility and makes for a lot less work in the future as we can operate on the whole group or individual components.

## Using Inheritance to Spawn Multiple Copies of YELB

Monk is very powerful. We can spawn multiple instances of the same app via inheritence with existing Kits.

### Our Development Environment

We can safely assume that we were working on our development environment. So the last command we have executed `monk run yelb/application` spawned our YELB dev app.

### Moving to Production

To spawn another instance of the YELB app for production, we will use Monk's [inheritance](http://localhost:8000monkscript/yaml/overview#inheritance) feature. This allows us to inherit a predefined Kit and only update the parts we want to change.

Let's define our namespace and add our db and redis [runnable](monkscript/yaml/runnables/) components in the Kit.

```yaml title="Monk"
namespace: /yelb-production

db:
    defines: runnable
    inherits: yelb/db

redis:
    defines: runnable
    inherits: yelb/redis
```

In this example, we're defining a new namespace for production and adding two [runnables](monkscript/yaml/runnables/). Each runnable inherits from existing Kits via the `inherits` parameter.

Now we will have to add our appserver and ui. We'll need to do a bit more as we had to use some workarounds in development mode. Fortunately, the inheritance will make this task easier.

Lets start with appserver. We need to:

1. Add the `image-tag` option.
2. Add new `variables` to reflect the proper namespace in our `get-hostname` functions.

Our `appserver` definition will look like that:

```yaml title="Monk"
appserver:
    defines: runnable
    # We are inheriting main runnable yelb/appserver
    inherits: yelb/appserver
    containers:
        # We will overwrite our image-tag here, all other definition of the runnable will stay the same
        yelb-appserver:
            image-tag: "0.4"

    # Update the namespace in our variables, changing it from yelb to yelb-production
    variables:
        yelb-db-addr:
            type: string
            value: <- get-hostname("yelb-production/db", "yelb-db")

        yelb-redis-addr:
            type: string
            value: <- get-hostname("yelb-production/redis", "redis-server")
```

Finally, we will look at UI, which will be less problematic. For that, we'll just need to update its varliables.

```yaml title="Monk"
ui:
    defines: runnable
    # Inherit yelb/ui
    inherits: yelb/ui

    variables:
        # Update our appserver hostname here with production version
        yelb-appserver-addr:
            type: string
            value: <- get-hostname("yelb-production/appserver", "yelb-appserver")
```

The final YAML should look like this:

```yaml title="Monk"
namespace: /yelb-production

db:
    defines: runnable
    inherits: yelb/db

redis:
    defines: runnable
    inherits: yelb/redis

appserver:
    defines: runnable
    inherits: yelb/appserver
    containers:
        yelb-appserver:
            image-tag: "0.4"

    variables:
        yelb-db-addr:
            type: string
            value: <- get-hostname("yelb-production/db", "yelb-db")

        yelb-redis-addr:
            type: string
            value: <- get-hostname("yelb-production/redis", "redis-server")

ui:
    defines: runnable
    inherits: yelb/ui

    variables:
        yelb-appserver-addr:
            type: string
            value: <- get-hostname("yelb-production/appserver", "yelb-appserver")

application:
    defines: process-group

    runnable-list:
        - /yelb-production/appserver
        - /yelb-production/db
        - /yelb-production/ui
        - /yelb-production/redis
```

Since this is our production Kit, it might be good idea to run it on some public cloud services. To do this, you'll need to have a cloud provider added. To learn more, please see ["Monk in 10 minutes" guide](monk-in-10#creating-a-monk-cluster).

Assuming we have AWS as the provider, we can simply run:

**Grow our Cluster**

```yaml
$ monk cluster grow -p aws -n monkNode -t aws -i t2.medium -r us-east-1 -d 15 -m 1
(...)
```

**Run our Workload**

```bash
$ monk run -t aws yelb-production/application
(...)
```

**Testing**

Simply open a browser with the address returned by Monk.
