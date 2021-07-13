---
title: Publish your templates
---
# Publisher & Certified Content Program (Alpha)

Monk is a new alternative to Kubernetes and Terraform-based deployment flows. We make it possible to orchestrate entire stacks, rather than just containers, on any cloud or on-premise cluster, saving months of DevOps overhead.

This vision wouldn't be possible without publishers: developers who build and maintain stack Templates. We invite you to become one for fun, exposure and a host of other benefits.

## Publishers create Monk Templates

Monk is based on powerful master manifests, called Templates. You can use them to specify and provision system configurations down to the workload level. This makes these templates incredibly easy to deploy, manage and migrate on any infrastructure.

Templates are released on [MonkHub.io](https://monkhub.io) by community Publishers, who include open source developers, software vendors, and enterprises. In our open beta, we collected over 300+ templates, ranging from single software components to fully integrated stack blueprints. We are always on the lookout for thrill-seeking devs to build more templates and push this new boundary of orchestration with us.

​[Apply here](https://monk-io.typeform.com/to/SCkHZKPE) to start publishing, or read on for details.

## How templates work

Think of Monk templates as no-Kubernetes Helm charts on overdrive, defining entire system requirements from machines to workload provisioning. They’re written in Monk Script, an easy and powerful flavor of YAML that is:

* **Composable**: Import, reuse and modify existing configurations as you would with regular code libraries.

* **Scriptable**: Extend the capabilities of the containers and your system with our programmable control plane.

* **Portable**: Templates can be reproduced on any cloud or on-premise cluster that runs Monk within minutes.

This means you can tweak and share single components (e.g. Nginx) as easily as an entire off-the-shelf stack (e.g. the entire data science workflow your startup runs on AWS + GCP), or even better, combine these and more to build something entirely new. Here's a [simple example](basic-app.md).

## Benefits for Publishers

This flexibility makes Monk templates an excellent distribution choice for open-source developers and proprietary software vendors. As a fast-growing Silicon Valley startup we are actively exploring publishing models that you, our community, will love and benefit from.

Monk is a new paradigm in orchestration. It makes it easy for your users to run your software anywhere while giving you visibility into a growing new community:

### Grow your software

* **Reduced barrier of entry for your users**<br/>
Your users can deploy and operate your software with just a few commands, on their own cloud of choice.

* **New distribution channel for your software**<br/>
Gain exposure to Monk’s rapidly growing user base, increase visibility with Monk Hub, and reduce friction.

* **Offer seamless updates and upgrades**<br/>
Monk users can subscribe to your releases and update their current stack with a simple `monk update your-stack/latest`

* **Rich adoption metrics**<br/>
Go beyond download count and GitHub stars. See how many CPUs your software runs on at any given moment, across cloud providers and cluster sizes. Learn how developers are composing your software within their stacks (e.g. which databases they use it with) and get a clear picture of Cloud Native industry trends.

:::note

The architecture of Monk and Monk Hub is primed for visibility. We're exploring, building and testing these and more models for adoption metrics.

:::

### Grow as a developer

* **Share the love** <br/>
Be one of the pioneers of entire-stack orchestration

* **Contribute to your community** <br/>
Become a core maintainer of the official Monk template for your favorite open-source software.

### Unlock new revenue

We are in the early stages of exploring these revenue models for our publishers, and would love your opinion!

* **Template marketplace** <br/>
Sell your own software or build in-demand stack templates.

* **On-demand stacks** <br/>
Build and maintain specific stacks for enterprises on request, sometimes alongside the Monk team.

## How to become a Publisher?

1. Apply by filling the [application form](https://monk-io.typeform.com/to/SCkHZKPE), it only takes a minute or two
2. We will review your application and get in touch to start onboarding.
3. Onboarding includes setting up your publisher account, linking your code repository, and configuring the publishing pipeline for your templates.
4. Publish your templates on Monk Hub for other developers to use!
5. Access rich usage insights and update your templates seamlessly

## Publishing: a primer

Once your application is successful and you are onboarded as a Publisher you can start pushing templates on Monk Hub via your own code repository or one maintained by Monk.

Your published templates will appear in the Monk Hub and the stack wizard, as well as by running `monk list` in the CLI.

![Monk Hub Website view](/img/docs/publishers1.png)

![Monk Hub CLI view](/img/docs/publishers2.png)

Each change to your Monk template triggers our deployment pipeline and publishes an updated or new version of your components to Monk Hub.

Creating a template is easy and takes only a few lines of YAML. You decide how much detail you want to include:

-   metadata describing your system
-   public or private containers
-   public Monk components available in the Hub - by inheriting and customizing them within your own system
-   instance provisioning and affinity if you want to make the system cloud (or multi-cloud) provider-specific. Monk currently supports GCP, AWS, Azure and Digital Ocean with more coming soon
-   additional cloud resources such as volume claims, cloud load balancers, etc.

![](/img/docs/publishers3.png)

You will feel right at home with MonkScript, YAML inspired by `docker-compose` but with quite a few scriptable tricks up its sleeve. View them all in [Features](features.md) and inside the [Reference](monkscript).

## How can I join?

Let us know that you are interested in joining our Publisher Program by filling this [application form](https://monk-io.typeform.com/to/SCkHZKPE).

We’d also be thrilled to have you on our [Discord](https://discord.gg/2YGryc5) and answer all your questions!
