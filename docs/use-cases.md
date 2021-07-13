# Why Monk?

Orchestrating containers and infrastructure together gets tedious really quick. Monk is a flexible piece of middleware that frees your time and restores your sanity by letting you control both these layers with a single, streamlined workflow.

This page will give you an idea of what you can accomplish with Monk, and hopefully give you a nudge towards [giving it a try](get-monk.md).

---

## The Problem Monk Solves

As software becomes more sophisticated and performance requirements get steeper, container orchestration is becoming increasingly complex, time-consuming, and mission critical.

Developer teams are spending a lot of time managing (a.k.a. de-spaghettifying) infrastructure and less building product. This is especially true for teams without the scale and resources to justify internal DevOps or wide-scope enteprise tools.

Monk removes most of the overhead, scope and headaches from today's orchestration:

-   **Months of DevOps**, From hiring specialists to DIYing an efficient CI/CD pipeline.<br/> &#8594;
    _With Monk you can get well-configured stacks up & runnuing in minutes_. See [Monk in 10 minutes &#8594;
    ](monk-in-10.md)

-   **Devtools creep**: Using Kubernetes? Brush up on your Helm syntax, sign up to Terraform and get their EKS module, then repeat for the GCP portion of your app.<br/> &#8594;
    _Monk is one solution: compose with Hub templates, deploy from a single manifest, manage with the built-in Engine_. See [Monk ecosystem &#8594;
    ](key-concepts.md)

-   **Cloud provider lock-in**: Managed services or manual deployments force you into specific providers, make future migration a pain, or make multi-cloud deployments simply too much of a hassle.<br/> &#8594;
    \_Monk lets you use any combination of infrastructure and switch gears whenever you want.

-   **Moving clouds?** Simply add your new cloud's credentials with* `monk cluster provider add --provider=` \_and run your templates there.* See [Monk vs. other software &#8594;
    ](comparison.md)

## 1. Find Inspiration for Your Stack

Whatever you're building, there's a chance someone somewhere made a similar stack work for them in the past. Why not piggyback on their experience and build on more solid ground?

That's the idea behind Monk Templates: infinitely composable system blueprints, complete with provisioning instructions, that can get entire systems up and running anywhere.

We're growing [Monk Hub](https://monkhub.io) into a repository not only for containers and components, but entire systems you can pick, tweak and make yours.

## 2. Build Your Stack with Ready Components

Templates are written in MonkScript, a composable and scriptable flavor of YAML that lets you define your stack at any complexity level, with just a few lines of code:

**Single containers** pick ready-to-compose databases, APIs and services from the Hub. These are classified as `runnable` templates:

```
❯ monk list | grep runnable
✔ Got the list
Type      Template                       Repository    Version        Tags
...
runnable  mysql/latest                   monk          -              database
runnable  mysql/v5.7                     monk          -              database
...
```

**Parts of your stack** the `group` type on Monk Hub defines pre-composed systems, such as a backend or data pipeline. When you find the right group, you can compose it with the rest of your application with minimal config work:

```
monk list | grep group
✔ Got the list
Type      Template                                    Repository    Version       Tags
...
group     apache-kafka/cluster-1-zookeeper-2-brokers  monk          -             streaming, data, analytics, integration
...
```

**Entire off-the-shelf stacks** plug and play an entire application, extend it with third party components and tune functionalities with custom overrides. All template definitions are composable.

```
❯ monk list | grep elk
✔ Got the list
Type      Template                       Repository    Version           Tags
...
group     elk/stack                      monk          -                 -
...
```

See how it works in this guide: [Running a small system](basic-app.md).

## 3. Manage Infra in One Place

Since Monk sits between your infra and application, the CLI that can communicate directly with your cloud providers. It's packed with functionality, meaning you'll be able to perform the majority of infrastructure-side work without ever leaving Monk. See the [CLI reference](cli/monk.md).

More importantly, Monk is multi-cloud by design, enabling you to deploy your application across environment with minimal custom work.

Also note that Monk Engine can take care of [provisioning](provisioning-via-templates) natively, supports [load balancers](load-balancers.md), integrates with popular [CI/CD platforms](ci-cd.md), and much more.

## 4. Share & Maintain Your Stack

Monk Hub is a new distribution system for open-source components and pre-build stacks. It features over 300 entries, with more being added constantly by our team and the community.

You could help your favorite software gain traction by becoming a maintainer of the Hub repo. Or you could share your application's templates for stars, exposure, and possibly revenue (we're exploring a marketplace model for paid templates). Learn more about our [Publisher program](publishers.md).

## 5. Save Time and Sanity

Our mission is to make composing, deploying, and managing applications almost as easy as installing mobile apps. With Monk, you can save time to market by starting from ready-made stack templates. Your life will be much easier because you'll be able to keep deployments inside a single workflow.

Scroll to the next page to learn about Monk's key technologies – the "trinity" of Engine, Script and Hub – or [Install Monk](get-monk.md) to see them in action.
