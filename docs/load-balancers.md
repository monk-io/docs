---
title: "Add Load Balancers"
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

Load balancers are important components of any modern cloud setup. They provide a reliable ingress point for any system. Monk creates and manages load balancers for you so that you can focus on your services.

---

## Cloud Load Balancers

Monk currently supports TCP, UDP, HTTP(s) and Elastic IP type balancers on AWS, GCP, Azure and Digital Ocean. It doesn't matter on which cloud you're running as long as the balanced portion of the workload stays on the same cloud.

:::note

We are actively working on removing this limitation and enabling multi-cloud load balancing.

:::

## Load balancing with Monk

Let's suppose we have the following Kit:

```yaml linenums="1"
namespace: /lbs

service-1:
    defines: runnable
    inherits: nginx/latest
    variables:
        listen-port: 8080
        proxy-target-host: www.exmple.com

service-2:
    defines: runnable
    inherits: nginx/latest
    variables:
        listen-port: 8080
        proxy-target-host: www.exmple.com

services:
    defines: process-group
    runnable-list:
        - lbs/service-1
        - lbs/service-2
```

`service-1` and `service-2` are identical web services listening on port 8080 for incoming HTTP traffic.

:::warning

We're just using `nginx/latest` here to illustrate the point. There is little sense in load balancing a bunch of nginx instances but the methods apply to any kind of service.

:::

### HTTP

In order to create a load balancer that will balance the traffic between those two services, we just need to add the balancers section to the `services` group:

```yaml linenums="1"
namespace: /lbs

services:
    defines: process-group

    balancers:
        app-balancer:
            type: http
            port: 8080
            instances:
                - lbs/service-1
                - lbs/service-2

    runnable-list:
        - lbs/service-1
        - lbs/service-2
```

This defines the `app-balancer` - a `http` load balancer that targets port `8080` on the instances, which are members of the `services` group.

Running this group will show the load balancer in the run output together with its IP address. The HTTP load balancer listens on the port `80` by default. You can point your domain to its IP address and clients will reach either `service-1` or `service-2`.

:::warning

For a `http` load balancer to work a healthcheck against the runnable needs to pass. By default the `/` endpoint is called and `200` status code is expected in return. If your services handle healthchecks differently you can override it using [custom healthchecks](#custom-health-checks).

:::

### HTTPS

Load balancers are often used to terminate TLS so that the underlying services aren't concerned by such matters. Upgrading an HTTP balancer to an HTTPS-enabled balancer is very simple with Monk.

In order to tell `app-balancer` to use HTTPS, all we need to do is pass our certificates to it:

```yaml linenums="1"
namespace: /lbs

services:
    defines: process-group

    balancers:
        app-balancer:
            type: http
            domain: mystuff.com
            tls-certificate: |
                -----BEGIN CERTIFICATE-----
                ...
                -----END CERTIFICATE-----
            tls-chain: |
                -----BEGIN CERTIFICATE-----
                ...
                -----END CERTIFICATE-----
            tls-key: |
                -----BEGIN PRIVATE KEY-----
                ...
                -----END PRIVATE KEY-----
            port: 8080
            instances:
                - lbs/service-1
                - lbs/service-2

    runnable-list:
        - lbs/service-1
        - lbs/service-2
```

:::warning

Certificates are sensitive information. Learn how to store them in Kits securely: [Passing secrets in templates](passing-secrets.md).

:::

It's useful to also include domain: in this definition to immediately know what's going on just by looking at the Kit.

The `app-balancer` will listen on both port `80` and port `443` by default. It behaves the same way as the HTTP balancer but is capable of terminating TLS connections.

### TCP and UDP

A TCP and UDP load balancers can be used to balance TCP and UDP connections over a group of services.

<Tabs
defaultValue="tcp"
values={[
{label: 'TCP', value: 'tcp'},
{label: 'UDP', value: 'udp'},
]}>

<TabItem value="tcp">

```yaml linenums="1"
namespace: /lbs

services:
    defines: process-group

    balancers:
        app-balancer:
            type: tcp
            port: 8080
            instances:
                - lbs/service-1
                - lbs/service-2

    runnable-list:
        - lbs/service-1
        - lbs/service-2
```

:::warning

For a `tcp` load balancer to work a healthcheck against the runnable needs to pass. By default it just tries to open connection to the `port`. If your services handle healthchecks differently you can override it using [custom healthchecks](#custom-health-checks).

:::

</TabItem>

<TabItem value="udp">

```yaml linenums="1"
namespace: /lbs

services:
    defines: process-group

    balancers:
        app-balancer:
            type: udp
            port: 8080
            instances:
                - lbs/service-1
                - lbs/service-2

    runnable-list:
        - lbs/service-1
        - lbs/service-2
```

</TabItem>

</Tabs>

Such balancers are listening on the specified port and are connecting on the same port to the underlying services.

:::warning

UDP load balancers are not available for Digital Ocean, since Digital Ocean is not supporting that service.

:::


### Elastic IP

The Elastic IP type of balancer creates a static IP address and attaches it to a healthy instance carrying the target service. Once the instance becomes unavailable due to a failure, the balancer will attach the static IP to another healthy instance until the primary one comes back.

No configuration is required here. All ports exposed on the target instance will be available when reaching the balancer IP.

```yaml linenums="1"
namespace: /lbs

services:
    defines: process-group

    balancers:
        app-balancer:
            type: elastic-ip
            instances:
                - lbs/service-1
                - lbs/service-2

    runnable-list:
        - lbs/service-1
        - lbs/service-2
```

## Custom health checks

Monk can configure the load balancers to perform custom health checks on the target services in order to switch between them in case they fail. Health checks can be applied to any type of load balancer, regardless of its type.

### HTTP

HTTP health checks are GET requests sent to at the specified `interval` (in seconds) to the `url` with specified `request` contents. The `response` field specifies the contents of the expected response. If the service fails to respond or the contents of the response are not matching - the balancer will mark that service as faulty and route traffic to its other instances.

```yaml linenums="1"
namespace: /lbs

services:
    defines: process-group

    balancers:
        app-balancer:
            port: 8080
            type: http
            health-check:
                kind: http
                url: /some/path
                interval: 5
                request: "request body"
                response: "expected response"
            instances:
                - lbs/service-1
                - lbs/service-2

    runnable-list:
        - lbs/service-1
        - lbs/service-2
```

### TCP

TCP health checks work in a similar manner except for the `url`. The following definition will make the balancer connect to the service, send `"something"` and expect a response matching the `"expected response"`. This is useful for services speaking a different protocol than HTTP.

```yaml linenums="1"
namespace: /lbs

services:
    defines: process-group

    balancers:
        app-balancer:
            port: 8080
            type: http
            health-check:
                kind: tcp
                interval: 5
                request: "something"
                response: "expected response"
            instances:
                - lbs/service-1
                - lbs/service-2

    runnable-list:
        - lbs/service-1
        - lbs/service-2
```

You now know how to easily set up different load balancers directly from your manifests. Let's now dig deeper into the provisioning side of things – again, without leaving our trusty YAML.
