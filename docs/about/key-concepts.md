# MonkOS Ecosystem

MonkOS is a new infrastructure platform that makes it easy to deploy and manage container-based applications in any environment. It works as a highly customizable abstraction layer between containers and infrastructure, and it's based on three key technologies:

- **MonkOS** a distributed resource manages that manages workloads and infrastructure

- **MonkScript** composable YAML for describing workloads and infrastructure in one place

- **Monk Hub** a globally accessible repository where Kits are stored

With this "trinity" working together, you can define your entire stack with a single master manifest (_written in MonkScript_) composed from other developers' Kits (_on Monk Hub_). You can then deploy said stack on your infrastructure of choice without needing to define provisioning somewhere else (_thanks to MonkOS Engine_).

Pretty nifty, right? Let's take a closer look at each component.

---

## MonkOS

MonkOS is the central piece of the solution. It is a new distributed resource manager that implements a masterless cluster architecture.

The Engine was designed from the ground up to be independent of existing tools like Kubernetes and Terraform, but aims to provide similar functionality with notable improvements:

-   it provisions itself onto the chosen underlying infrastructure without the need for additional provisioning steps,
-   has a programmable control plane that "understands" the workloads on both the container and system level, and can be extended in MonkScript,
-   provides its own secure network overlay allowing for clusters to span between multiple clouds and/or on-premise sites without additional work.

All of those features exist in a self-contained binary (`monkd`) that can be installed on almost any machine, be it a cloud instance or a single board computer. Read more about `monkd` [here](cli/monkd.md).

### MonkOS Clusters

MonkOS Clusters are groups of machines running the MonkOS. Particular instances of the Engine are called Peers.

The clusters can be created by manually connecting the Peers between a group of machines, or they can be "grown" from a single machine by bootstrapping the engine onto other machines automatically.

Once created, a Cluster will work autonomously to keep itself and the workloads online. You can run one big cluster, even spanning multiple cloud providers, and run all your workloads there. Alternatively, you can run multiple smaller clusters, for example, one for each of your projects or customers. Thanks to Monk's architecture, all of the clusters will behave and scale the same way starting from one instance to hundreds of them.

Check out [Creating a cluster](lifecycle/cluster-create-1.md) to learn more about how clusters work.

### Multi-site Presence

MonkOS Clusters span a coordination layer between their members and create an encrypted overlay network between the peers. This design is a result of Monk's early mission to run anywhere without assuming anything about the underlying network environment.

Thanks to this approach, MonkOS Clusters can seemlessly run workloads in which part of the services is running on GCP, another one on AWS, and a third one is deployed on-premise.

Running one system on multiple clouds has many advantages, some of them being:

-   Ability to locate services in more geographies than one provider would have,
-   Ability to optimize costs or performance by easily moving workloads to cheaper or better infrastructure.
-   Rock-solid reliability in case one of the cloud providers experiences a failure.

:::note note

MonkOS currently supports automatic Cluster provisioning on AWS, GCP and DigitalOcean. We are working to add more cloud providers in the near future.
:::

Dive deeper into the provisioning side of things in the [Guides](../basics/running-templates).

### Programmable Control Plane

MonkOS undersands workloads natively. The Engine contains a programmable control plane that can be precisely tuned to any piece of software running on MonkOS. By moving computation from manifest pre-processing (e.g. Helm) to runtime, we have given MonkOS the ability to perform user-defined scripted actions on any level of the workload.

Starting from a single container, all the way to the entire system, actions and variables can be used to control and query the workloads across the whole cluster.

This mechanism can be used to abstract away any workload-specific task or enhance existing software with additional functions in an unobtrusive way.

## MonkScript

_MonkScript_ is Monk's Kit definition language. It is easy to understand as it takes inspiration from well-known products like [docker-compose](https://docs.docker.com/compose/). At the same time, MonkScript is more expressive than similar definition languages thanks to inline scripting and composability.

The Kits are not just Docker Images, they are defined in MonkScript and contain all the information that is needed to obtain, configure, and run described software in one command.

Additionally, Kits can describe actions and variables particular to the software they describe, making it easy to define custom strategies for custom software.

Think about docker-composing docker-composes, this is what MonkScript is about.

Learn everything about MonkScript in the [Reference](../monkscript/index.md).

## Monk Hub

_Monk Hub_ ([monkhub.io](https://monkhub.io)) is the place to find pre-built Monk Kits.

Kits on the Hub can be either Components, such as popular databases and services, or compositions thereof, defining things like entire data pipelines that can be run off the shelf.

Furthermore, thanks to MonkScript, each Kit can be composed from other Kits. The resulting Kit can be published to the Hub for others to use.

:::note note

Monk Kits can be instantiated from Monk Hub at any moment, without needing to download them, since every MonkOS instance knows the contents of the Hub at all times.

:::

You'll learn more about how Kits can help you improve your workflow in the next section, [Why Monk](use-cases.md). And if you like the idea of publishing entire stack blueprints on a community repo, take a closer look at our [Publisher program](../community/publishers.md) here in the docs.
