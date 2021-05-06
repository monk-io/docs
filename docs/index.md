# Welcome to Monk

Welcome to [Monk](https://monk.io), the stack orchestration platform. Monk lets you compose, deploy, and manage your entire stack, on your own infrastructure, with nearly zero DevOps overhead.

Think of Monk as a Kubernetes and Terraform rolled into one tool: **a new orchestrator that lets you take control of both the application and provisioning layers in one place** by (1) writing feature-packed YAML manifests, and (2) using the CLI to interact directly with your containers and cloud provider(s) of choice. [Get Monk](get-monk.md) to see how it works in practice.

We're a startup on a mission to make stacks stupid-easy to build and manage. We've built everything from scratch, engine included, and don't rely on any 3rd party platforms except Docker.

!!!note

    Monk was formerly known as Moncc (moncc.io). Same power, better name.

---

## Key features at a glance

-   **Next-gen manifests**: compose your application _and_ provision workloads with composable and scriptable YAML manifests known as Monk Templates.
-   **Ready stack components**: Easily combine and customize containers or entire pre-composed stacks from the Monk Hub repository.
-   **Masterless P2P clusters**: deploy on any combination of GCP, AWS, Azure, Digital Ocean, bare metal or even single board computers.
-   **One CLI, two levels**: Control containers and environment in one place. Monk's CLI talks directly to your cloud provider, and the built-in Engine can provision workloads without 3rd party services (e.g. GKE, EKS, AKS).
-   **Orchestration on your terms**: Monk only saves you time and sanity composing and orchestrating your stack; you bring your own cloud and CI/CD workflow.

Explore all features on the [Features](features.md) page.

## Docs overview

These docs should have everything you need to get acquainted with Monk and start using it in minutes. Head out to the next page, [Why Monk](use-cases.md), to ease into the ecosystem, or dive right in:

-   [Install Monk](get-monk.md) and compose your first stack in 10 minutes
-   Learn Monk's inner workings from [Guides](./guides/index.md) and the [Reference](./monkscript/index.md)
-   Explore templates on [monkhub.io](https://monkhub.io) and learn how and why you may want to [Publish your own](publishers.md)

If at any time you need help or want to share feedback, we'd love to hear from you! Find all our contacts and resources on the [Support](support.md) page to find our contacts, or join us directly on [Discord](https://discord.gg/WxDzaKe).

**The best way to experience what Monk has to offer is to dive in and try it. We put great care into making everything simple and efficient. You should be able to get some containers running in a cluster, on a cloud, within 10 minutes from reading this sentence. [See for yourself -->](monk-in-10.md)**

## Experimental features

As it goes with any software, you might encounter some bugs, but the core functionality is stable. See the [Features](features.md) page to check which ones are stable and which ones are in the experimental stage.

!!!important

    We invite you to try everything, but remember that using the experimental features in production might not be a good idea at this point. Check back anytime to see which features are being promoted to stable.
