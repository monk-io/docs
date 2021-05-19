Let's see how to create and run a basic app that uses MongoDB and Nginx, entirely from Monk.

This tutorial requires you to have Monk installed locally, which you can do [just like this](../get-monk.md).

## What we're building

We're preparing a small application for deployment. It's a simple guestbook written in Node.js, where we store entries in MongoDB and use a basic Nginx reverse proxy in front of the app to secure it.

We will prepare a Monk template for a small system composed of these three elements. The code of the app itself is not the focus of this tutorial and will be provided.

</br>

<figure>
  <img src="/assets/system-basic.png" />
  <figcaption>An artist's rendering of the system we're building</figcaption>
</figure>

## The app

Our App is just a simple piece of code that requires a Mongo database and exposes an HTTP endpoint by means of the Express framework.

Let's grab the source from GitHub:

    git clone https://github.com/oaknode/tutorial.git

!!! Note

    Oaknode is the repo of the company behind Monk. We're migrating to Monk's Github in steps.

### Preparing the container

Monk runs containers so our App needs to be containerized before we can start handling it. We will use Docker in this tutorial as it is the easiest way to obtain a container image from the App's source code.

Open the folder containing the source and inspect the Dockerfile that we have prepared:

=== "Dockerfile"

    ```dockerfile linenums="1"

    FROM node:alpine

    WORKDIR /usr/src/app

    COPY package.json ./

    RUN npm install

    COPY . .

    EXPOSE 8080
    CMD ["node", "index.js"]
    ```

This is a pretty standard Node.js Dockerfile without any bells and whistles and it's good enough for our small App. Let's build and publish the image:

    docker build -t yourname/tutorial:latest .
    docker push yourname/tutorial:latest

This will give us the container image for our App. Your local docker instance now knows about the `yourname/tutorial:latest` image, and in the next step we will wrap it in a Monk template.

!!! note

    We only use Docker in this tutorial to build the image so that Monk becomes aware of our app by caching its container image. Monk will run and orchestrate containers spawned from any OCI-compliant container image; Docker is one way of obtaining those.

### Preparing a Monk manifest

Let's start writing a template that will describe where to get the app, how to configure it and how to run it in the right context. Start a new file called `app.yaml` and put the following contents there:

=== "app.yaml"

    ```yaml linenums="1"
    namespace: /yourname

    app:
        defines: runnable
        version: 0.0.1
        containers:
            defines: containers
            app:
                image: yourname/tutorial:latest
    ```

!!! note

    You can look at the `tutorial.yaml` file in the App's repo to see the full example at any time.

We have provided the simplest description of the container image to be run and Monk is already capable of starting it. The `namespace` field tells Monk where to put the description of `app` - it will be under `yourname/app`. The `defines` field is important as it tells Monk how to interpret parts of the YAML tree - all the names are free form so this is the way to "type" the YAML.

You could run your new template with:

    monk load app.yaml
    monk run yourname/app

!!! note

    To do this, you should have the cluster already set-up.
    Also, `monk stop yourname/app` to stop the template.

However, the template is not complete. Much like with `docker-compose`, in order to prepare a good runtime environment, we must understand what are the App's requirements.

By inspecting the `index.js` file we can see that the app requires three environment variables to be set before it runs:

=== "index.js"

    ```js linenums="1"
    //...
    const PORT = process.env.PORT;
    const DB_HOST = process.env.DB_HOST;
    const DB_PORT = process.env.DB_PORT;
    //...
    ```

This has to be reflected in our template by telling the container to use the right environment variables and also bringing them out into the Monk namespace. This will allow us to alter the variables later when composing the system.

First, let's define the variables in our `runnable`. Add the following `variables` section below the `containers` section:

=== "app.yaml"

    ```yaml linenums="1"
    namespace: /yourname

    app:
        # ...
        variables:
            defines: variables
            port:
                type: int
                value: 8080
            db-host:
                type: string
            db-port:
                type: int
                value: 27017
    ```

This tells Monk that we have a set of values associated with our runnable for the app. Now let's pass the values to the container by adding the following `environment` section to `app/containers/app`:

=== "app.yaml"

```yaml linenums="1"
app:
    containers:
        app:
            # ... image
            environment:
                - <- `PORT=${port}`
                - <- `DB_HOST=${db-host}`
                - <- `DB_PORT=${db-port}`
```

Here we see a small example of Monk's powerful language. The YAML values starting with `<-` will be calculated at runtime. In this case, we just interpolate environment variables from the variables we have defined in the namespace.

!!! note

    The syntax for string interpolation in MonkScript is inspired by JavaScript's string template literals. Learn more about [Arrow scripts](../monkscript/scripting-index.md).

Your `app.yaml` manifest should now look like this:

=== "app.yaml"

    ```yaml linenums="1"

    namespace: /yourname

    app:
        defines: runnable
        version: 0.0.1
        containers:
            defines: containers
            app:
                image: yourname/tutorial:latest
                ports:
                    - <- `${port}:${port}`
                environment:
                    - <- `PORT=${port}`
                    - <- `DB_HOST=${db-host}`
                    - <- `DB_PORT=${db-port}`
        variables:
            defines: variables
            port:
                type: int
                value: 8080
            db-host:
                type: string
                value: localhost
            db-port:
                type: int
                value: 27017
    ```

Now run the following to make Monk aware of your new template:

    monk load app.yaml

And that's it! It's very easy to wrap any containerized application into a Monk template. You could publish this template now for everyone to run with a simple `monk run yourname/app` or use it in composition with other templates.

We are going to deploy it ourselves though, so publishing won't be necessary.

## 3rd party services

One of the most interesting facts about Monk is that we don't have to work from scratch when it comes to deploying 3rd party services such as Mongo and Nginx. We can simply take them off the shelf and focus on our app.

You'll see in a second. We will use pre-made templates for Mongo and Nginx and simply include them in our system composition. Which means this step... is not really a step after all 😎

## Composing the system

Now it's time to compose our app's template with the third party services, and make another template out of that. This way, you will be able to run the same composition on any Monk cluster on any cloud.

</br>

<figure>
  <img src="/assets/system-full.png" />
  <figcaption>Template architecture for the system we're building</figcaption>
</figure>

If you were to publish your composed template, other people would also be able to run this same setup in seconds or compose it further with their own services. That's what our [Publisher program](../publishers.md) is there for, by the way.

### Creating a template of templates

First, create a new manifest file called `system.yaml` and add the following contents:

=== "system.yaml"

    ```yaml linenums="1"
    namespace: /yourname

    tutorial-app:
        defines: runnable
        inherits: ./app
        variables:
            port:
                value: 8080

    system:
        defines: process-group
        runnable-list:
            - /yourname/tutorial-app
            - /yourname/tutorial-mongo
            - /yourname/tutorial-nginx
    ```

We have already defined the `yourname/app` runnable inside `app.yaml` and now we're instantiating it as `yourname/tutorial-app`. Since `app` lives in the same namespace, we can just refer to it as `./app`. The `inherits` keyword tells Monk to put the sub-tree from the target path in the new path (here: `yourname/tutorial-app`) and override it with whatever comes next.

There are two other runnables which we will define in a moment. Also notice that the file uses the same `namespace`, which means that Monk will put `system` together with the `app` in the same namespace tree. This is important because it allows you to keep your definition files in separate repositories but still retain order within your own namespace.

Finally, `process-group` is like a `runnable` consisting of other runnables. This allows us to group them and tell Monk that we want these things to be run together in a single cluster.

### Adding Mongo

Great, now let's define the missing `yourname/tutorial-mongo` runnable in terms of the existing MongoDB template. Add this to the `system.yaml` file:

=== "system.yaml"

    ```yaml linenums="1"
    namespace: /yourname

    # ...

    tutorial-mongo:
        defines: runnable
        inherits: mongodb/latest
    ```

And we're all good. We will use MongoDB from the `mongodb/latest` template that has been published to the shared namespace. That's all we need, since the app is simple and we don't want to change any defaults that the database template comes with.

Let's update `tutorial-app` so it knows how to find the database. Add the `db-host` section to the `tutorial-app/variables`:

=== "system.yaml"

    ```yaml linenums="1"
    namespace: /yourname

    tutorial-app:
        # ...
        variables:
            # ...
            db-host:
                value: <- get-hostname("yourname/tutorial-mongo", "db")
    ```

### Adding Nginx

Nginx is next. The process is similar to MongoDB, but we want to get Nginx configured as a reverse proxy, so we'll have to tell it where to connect to:

=== "system.yaml"

    ```yaml linenums="1"
    namespace: /yourname

    # ...

    tutorial-nginx:
        defines: runnable
        inherits: nginx/reverse-proxy
        variables:
            listen-port:
                value: 9090
            proxy-target-host:
                value: <- get-hostname("yourname/tutorial-app", "app")
            proxy-target-port:
                value: 8080
    ```

And that's pretty much it. Just changing those two variables is enough for the Nginx template to generate a config file for itself and behave as a reverse proxy for our purposes.

We could change any of the Nginx settings here or even enable Let's Encrypt, which is already available in the Nginx template, but let's keep it simple for now.

## Our app is ready

In the previous steps we've composed all parts of our app. Your `system.yaml` file should look like this now:

=== "system.yaml"

    ```yaml linenums="1"

    namespace: /yourname

    tutorial-mongo:
        defines: runnable
        inherits: mongodb/latest

    tutorial-app:
        defines: runnable
        inherits: ./app
        variables:
            port: 9090
            db-host: <- get-hostname("yourname/tutorial-mongo", "database")

    tutorial-nginx:
        defines: runnable
        inherits: nginx/reverse-proxy
        variables:
            server-name: tutorial-app.moncc.io
            listen-port: 8080
            proxy-target-host: <- get-hostname("yourname/tutorial-app", "app")
            proxy-target-port: 9090

    system:
        defines: process-group
        runnable-list:
            - /yourname/tutorial-mongo
            - /yourname/tutorial-app
            - /yourname/tutorial-nginx
    ```

Let's load the system definition with:

    monk load system.yaml

You can now run your system locally using the following command:

    monk run yourname/system

And everything should be working like a charm. You can now visit <http://localhost:9090> to verify that the app is in fact running and functioning correctly.

To stop it, use:

    monk stop yourname/system

## Conclusion

This concludes our basic app tutorial. We have learned how to compose 3rd party software with our own containerized service and how to run it all as an ensemble using Monk.

The next step would be to run your app on different clouds. To that end, you can head back to the [Creating a cluster](../lifecycle/cluster-create-1.md) and [Running templates in a cluster](running-templates-cluster.md) guides to see them with a fresh perspective.

Or better yet, continue to [Connecting runnables](connecting-runnables.md) to see how we can make our services talk to each other.
