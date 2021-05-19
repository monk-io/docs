Developers are wondering how hard is to port Kubernetes apps to Monk. With this guide we will try to show that's not anything complicated.  
For this purpose we will use [YELB](https://github.com/mreferre/yelb) which is a simple microservice oriented web application.

## YELB design

Design of the application is well documented on its own page [here](https://github.com/mreferre/yelb#yelb-architecture).

By quickly looking at the architecture, we can see we will need to create definition for four [runnables](/monkscript/yaml/runnables/) and one [process group](/guides/groups/) to start them/group all of them together.

## Starting our work

To slightly speed things up, we can cheat a little bit. As YELB (and many other Kubernetes applications) provides YAML definitions for the containers and environment configuration. We will use that to our advantage.

One specific YAML definition that contains all of services definitions and deployments is located on [this page](https://github.com/mreferre/yelb/blob/master/deployments/platformdeployment/Kubernetes/yaml/yelb-k8s-minikube-nodeport.yaml).

## YELB Deployments

Deployments in Kubernetes are very similar to to Monk [runnables](/monkscript/yaml/runnables/). We have four deployments defined in the Kubernetes YAML, which we will port now to Monk.

We will need to port all of YELB deployments first, try to run them first and check what problems we might need to solve to get it all up and running. Most likely as it is microservice defined app we will have to port Kubernetes Services configuration so app will be able to communicate between each of its components.

### yelb-ui

We will start with UI. YAML spec looks like this:

=== "Kubernetes"

    ```yaml
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

The most interesting part for us will be the container spec:

=== "Kubernetes"

    ```yaml
    spec:
        containers:
            - name: yelb-ui
            image: mreferre/yelb-ui:0.7
            ports:
                - containerPort: 80
    ```

We need to have something similar in Monk to make application component run. Lets define our [runnable](/monkscript/yaml/runnables/) and put that information in. It will look like this:

=== "Monk"

    ```yaml
    namespace: /yelb

    ui:
        defines: runnable
        containers:
            defines: containers
            yelb-ui:
                image-tag: "0.7"
                image: mreferre/yelb-ui
    ```

Which is simple as that and should be enough for the following component to start.

!!! note

    We've deliberately skipped `containerPort`, but we'll get to that part later. For now we want to try to start every single component (or not).

### yelb-appserver

We will do the same with appserver. It's YAML spec looks like:

=== "Kubernetes"

    ```yaml
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

=== "Monk"

    ```yaml
    namespace: /yelb

    appserver:
        defines: runnable
        containers:
            defines: containers
            yelb-appserver:
                image-tag: "0.5"
                image: mreferre/yelb-appserver
    ```

### yelb-db

We will do the same with db server. It's YAML spec looks like:

=== "Kubernetes"

    ```yaml
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

Again, we will look at containers spec, and produce similar YAML:

=== "Monk"

    ```yaml
    namespace: /yelb

    db:
        defines: runnable
        containers:
            defines: containers
            yelb-db:
                image-tag: "0.5"
                image: mreferre/yelb-db
    ```

### redis-server

We will do the same with redis server. It's YAML spec looks like:

=== "Kubernetes"

    ```yaml
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

Again, we will look at containers spec, and produce similar YAML:

=== "Monk"

    ```yaml
    namespace: /yelb

    redis:
        defines: runnable
        containers:
            defines: containers
            redis-server:
                image-tag: "4.0.2"
                image: redis
    ```

## Starting YELB in Monk for the first time

Since we now have all runnable definitions compiled, it's now time to try to run them.

### Loading templates into Monk

First we need to load them into monk, we can achieve this by doing(assuming we're in the directory where YAML files are saved):

```bash
$ monk load *yaml
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

### Running workloads

Now that we have definitions loaded, we will be able to start them individually.

!!! note

    We will later create a [process group](/guides/groups/) that will allow us to start all of them in one go.

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

And we will check status of the workloads:

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

### Checking logs

With everything running in we can check logs from running containers by using:

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

We can see `database system is ready to accept connections` message which means everything is fine, and our database is running properly.

##### yelb-redis logs

```bash
$ monk logs yelb/redis
(...)
1:M 15 May 14:42:26.180 # Server initialized
1:M 15 May 14:42:26.180 # WARNING overcommit_memory is set to 0! Background save may fail under low memory condition. To fix this issue add 'vm.overcommit_memory = 1' to /etc/sysctl.conf and then reboot or run the command 'sysctl vm.overcommit_memory=1' for this to take effect.
1:M 15 May 14:42:26.181 # WARNING you have Transparent Huge Pages (THP) support enabled in your kernel. This will create latency and memory usage issues with Redis. To fix this issue run the command 'echo never > /sys/kernel/mm/transparent_hugepage/enabled' as root, and add it to your /etc/rc.local in order to retain the setting after a reboot. Redis must be restarted after THP is disabled.
1:M 15 May 14:42:26.181 * Ready to accept connections
```

We can see `Ready to accept connections` message which means everything is fine, and our [Redis](https://redis.io/) is running properly.

##### yelb-ui logs

```bash
$ monk logs yelb/ui
(...)
2021/05/15 14:43:20 [emerg] 12#12: host not found in upstream "yelb-appserver" in /etc/nginx/conf.d/default.conf:5
nginx: [emerg] host not found in upstream "yelb-appserver" in /etc/nginx/conf.d/default.conf:5
```

As we can see, there's `host not found` that we will have to fix.

##### yelb-appserver logs

```bash
$ monk logs yelb/appserver
[2021-05-15 14:40:43] INFO  WEBrick 1.3.1
[2021-05-15 14:40:43] INFO  ruby 2.4.2 (2017-09-14) [x86_64-linux]
== Sinatra (v2.0.5) has taken the stage on 4567 for production with backup from WEBrick
[2021-05-15 14:40:43] INFO  WEBrick::HTTPServer#start: pid=7 port=4567
```

We can see `WEBrick::HTTPServer#start` message which means everything is fine, and our application server should be running properly.

### Checking connectivity

And as a final step we will test connectivity and check if we can open our application. Since this is web application it should listen on standard port 80, we can check it by simply doing `curl` test:

```bash
$ curl localhost
curl: (7) Failed to connect to localhost port 80: Connection refused
```

Which might mean that we didn't expose our application properly.

## Fixing problems

So far we've identified two problems. Both of them are related to UI. First one is lack of connectivity to the webpage, second one is a problem with a configuration setting that points towards 'bad' appserver container hostname(we know this because we've seen Service defined called yelb-appserver in Kubernetes manifests).

### Connectivity

If we will have a look quickly at original YAML for Kubernetes we can see that UI had defined service:

=== "Kubernetes"

    ```yaml
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

We can see that `Service` listens and redirects requests to port 80. Lets amend our `yelb/ui` spec to match that. To do that, we just simply need to add `ports` section to our manifest.

    === "Monk"

    ```yaml
    namespace: /yelb

    ui:
    defines: runnable
    containers:
        defines: containers
        yelb-ui:
        image-tag: "0.7"
        image: mreferre/yelb-ui
        ports:
            - 80:80
    ```

Now we need to update template and our workload:

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

We can see now that our port redirection definition worked(`open localhost:80 -> 80` message in the output). `curl` test might still fail due to the wrong nginx configuration as we've seen previously.

### Nginx configuration

Application is configured to automatically redirect requests to appserver listening on the `yelb-appserver` address. We can quickly check if there's any chance we can overwrite this by using some environment variables or maybe startup parameter. To check that, we will simply use `docker inspect` command on the image that ui uses.

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

We can see unfortunately there's no environment variables that we could overwrite, but we can check what's in startup script. We can check it by simply trying to start container with a command to check the contents of the startup script or just by going to the github repository, and opening corresponding file.

1. Check the file [here](https://github.com/mreferre/yelb/blob/master/yelb-ui/startup.sh).
2. Run `docker run 959bb4605293 cat /startup.sh` command.

We can see that we need to update `proxy_pass http://yelb-appserver:4567/api;` with the real name of docker container running our `yelb-appserver`.

We will utilise three of the Monk features here:

1. `bash` [option](/monkscript/yaml/runnables/#container) that will overwrite our docker Cmd.
2. `get-hostname` [function](/monkscript/operators/network/.#get-hostname-get-container-ip), due to the nature of Monk sometimes name of the container will change.
3. `variables` [section](/monkscript/yaml/runnables/#variables) of the YAML definition.

Lets combine all of the information into our YAML file:

    === "Monk"

    ```yaml
    namespace: /yelb

    ui:
    defines: runnable
    containers:
        defines: containers
        yelb-ui:
        image-tag: "0.7"
        image: mreferre/yelb-ui
        ports:
            - 80:80
        bash: <- `sed -e "s/yelb-appserver/${yelb-appserver-addr}/g" -i /startup.sh &&
            /startup.sh`

    variables:
        defines: variables
        port: 80
        yelb-appserver-addr:
        type: string
        # get-hostname syntax is "namespace/runnable", "container_name"
        value: <- get-hostname("yelb/appserver", "yelb-appserver")
    ```

We should update now our template and workload. Lets try to do this:

```bash
$ monk load yelb-ui.yaml
(...)
$ monk update yelb/ui
(...)
$ monk logs -f yelb/ui
(...)
```

Last command will tail the logs, open web browser and try open the page, some logs should start appearing.

```bash
(...)
192.168.0.90 - - [15/May/2021:15:50:30 +0000] "GET //api/outback HTTP/1.1" 500 30 "http://monk03.lan/" "Mozilla/5.0 (X11; Linux x86_64; rv:88.0) Gecko/20100101 Firefox/88.0" "-"
192.168.0.90 - - [15/May/2021:15:50:30 +0000] "GET //api/getvotes HTTP/1.1" 500 30 "http://monk03.lan/" "Mozilla/5.0 (X11; Linux x86_64; rv:88.0) Gecko/20100101 Firefox/88.0" "-"
```

Judging by the logs and while trying to 'Vote' on the page, we can see that the functionaly is still broken.

### Fixing appserver

From earlier(we've seen it in the nginx configuration of the ui) we know that /api functionality is being proxied to our yelb-appserver. Lets check its logs:

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

We can see that we have similar problem like we had with our UI - application looks for its components on predefined addresses. We will have to update appserver as well, so it can connect to proper containers. Again we will have a look at our container.

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

There seems to be nothing that would allow us to change easily those two. Lets check what's in startup.sh script by either:

1. Checking its [file in github](https://github.com/mreferre/yelb/blob/master/yelb-appserver/startup.sh).
2. Doing `docker run 94e995994d78 cat /startup.sh`.

Now we know that it basically starts up `/app/yelb-appserver.rb`. Again, we will have to check the contents of the file to see if we can somehow sort out the problems we're having. We can see that part of the file consists partially static configuration:

```bash
  set :redishost, "redis-server"
  set :port, 4567
  set :yelbdbhost => "yelb-db"
  set :yelbdbport => 5432
  set :yelbddbrestaurants => ENV['YELB_DDB_RESTAURANTS']
  set :yelbddbcache => ENV['YELB_DDB_CACHE']
  set :awsregion => ENV['AWS_REGION']
```

And unfortunately options that we would like to change are hardcoded into application. We need modify the file again and overwrite `Cmd` in our docker container. Knowing all this let's prepare our new appserver manifest by using [arrow script](/monkscript/yaml/#arrow-scripts), `get-hostname` [function](/monkscript/operators/network/) and `variables` [section](/monkscript/yaml/runnables/#variables).

Our YAML should look like:

=== "Monk"

    ```yaml
    namespace: /yelb

    appserver:
        defines: runnable
        containers:
            defines: containers
            yelb-appserver:
                image-tag: "0.5"
                image: mreferre/yelb-appserver
                bash:
                    <- `sed -e "s/yelb-db/${yelb-db-addr}/g" -i /app/yelb-appserver.rb &&
                    sed -e "s/redis-server/${yelb-redis-addr}/g" -i /app/yelb-appserver.rb &&
                    /startup.sh`

        variables:
            defines: variables
            port: 4567
            yelb-db-addr:
                type: string
                value: <- get-hostname("yelb/db", "yelb-db")

            yelb-redis-addr:
                type: string
                value: <- get-hostname("yelb/redis", "redis-server")
    ```

We should update now our template and workload. Lets try to do this:

```bash
$ monk load yelb-appserver.yaml
(...)
$ monk update yelb/appserver
(...)
$ monk logs -f yelb/appserver
(...)
```

We can now open the webpage again - which should now properly work.

## Process groups

Now since we have everything working all together without any problems, we can 'beutify' it a little bit. We will start by removing our workload to demonstrate how by having predefined templates we can start of our workloads in one go. We will do this by:

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

To define a [process group](/guides/groups/) we will have to create YAML with list of runnables that will be part of our group. It will simply look like:

=== "Monk"

    ```yaml
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

This will create a group called `application` which we will be able to operate just via `yelb/application` syntax.

As usual we will load and try to start it up:

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
        monk shell     yelb/application - Connect to the container's shell
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

We can see that all of our components have been started with one go! Our application should be running exactly the same as previously, but this gives us more flexibility and less work as we can operate on whole group or individual components.

## Using inheritance to spawn multiple copies of YELB

Monk is very powerful and by using already existing templates we can spawn multiple instances of the same app just by using inheritance.

### Our development environment

We can safely assume that during our work here we were working on our development environment. So last command we have executed `monk run yelb/application` spawned our YELB dev app.

### Moving to production

To spawn another instance of YELB app for example production we will use one of Monk features called [inheritance](http://localhost:8000/monkscript/yaml/overview/#inheritance). This allows us to simply inherit already predefined template and update just parts that we want to have changed.

We will start simple. We will define our namespace and put our db and redis [runnable](/monkscript/yaml/runnables/) in. We do this by creating template like that:

=== "Monk"

    ```yaml
    namespace: /yelb-production

    db:
        defines: runnable
        inherits: yelb/db

    redis:
        defines: runnable
        inherits: yelb/redis
    ```

And as we can see we're defining new namespace for it, we're also creating two [runnables](/monkscript/yaml/runnables/) that will inherit from already existing templates. Simple as that.

Now we will have to add our appserver and ui. With those two we will do a little bit more as they had some workarounds in previously and to demonstrate how we can change few parts of inherited template we will update image-tag too.

Lets start with appserver. We need to:

1. Add `image-tag` option.
2. Put new `variables` in to reflect proper namespace in our `get-hostname` functions.

To do that, our `appserver` definition will look like that:

=== "Monk"

    ```yaml
    appserver:
        defines: runnable
        # We are inheriting main runnable yelb/appserver
        inherits: yelb/appserver
        containers:
            defines: containers
            # We will overwrite our image-tag here, all other definition of the runnable will stay the same
            yelb-appserver:
                image-tag: "0.4"

        # As final thing we will update namespace in our variables and we will change it from yelb to yelb-production(as this is what we will using for prod deployment)
        variables:
            defines: variables
            yelb-db-addr:
                type: string
                value: <- get-hostname("yelb-production/db", "yelb-db")

            yelb-redis-addr:
                type: string
                value: <- get-hostname("yelb-production/redis", "redis-server")
    ```

Finally we will look at UI, which will be a little bit less problematic. We just need to update its variables. We will do it similiarly to appserver:

=== "Monk"

    ```yaml
    ui:
        defines: runnable
        # Inherit yelb/ui
        inherits: yelb/ui

        variables:
            defines: variables
            # Update our appserver hostname here with production version
            yelb-appserver-addr:
                type: string
                value: <- get-hostname("yelb-production/appserver", "yelb-appserver")
    ```

This should result in final YAML looking like this:

=== "Monk"

    ```yaml
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
            defines: containers
            yelb-appserver:
                image-tag: "0.4"

        variables:
            defines: variables
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
            defines: variables
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

As this is our production template it might be good idea to run it on some public cloud services. To do that you need to have cloud provider added, please follow ["Monk in 10 minutes" guide](/monk-in-10/#creating-a-monk-cluster).

Assuming we have AWS provider added we can now simply:

**Grow our cluster**

```yaml
$ monk cluster grow -p aws -n monkNode -t aws -i t2.medium -r us-east-1 -d 15 -m 1
(...)
```

**Run our workload**

```bash
$ monk run -t aws yelb-production/application
(...)
```

**Test by opening your browser with address returned by Monk**
