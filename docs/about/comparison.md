# MonkOS vs Other Software

import ComparisonTable from "../../src/components/comparisonTable";

As a new startup kid on the stack block, we often get compared to other services. Those who ask usually have their assumptions all wrong 🚨

Let's fix that, starting with two common misconceptions:

-   **MonkOS is not built on Kubernetes**: MonkOS doesn't enhance, add to or require K8s. In fact, we replace it altogether.
-   **MonkOS is not a managed service/IaaS**: Deploy anywhere and however you want. MonkOS helps you compose and provision your stack with minimal overhead.

MonkOS is a new paradigm and approach to orchestration: a control plane sitting between application and infrastructure that lets you interact with both, touching only what matters to you, while the rest 'just works'.

:::note Paradigm

No matter how complex they get, stacks should be as easy to 'install' and 'run' as mobile apps. Since Monk Kits work seamlessly everywhere, **you as a developer offload all undue complexity** to (1) us, who make sure `monk` and `monkd` work with both infra and containers, and to (2) Kitp ublishers, who optimize stacks and components for particular app/infra combinations.
:::

---

## Kubernetes

MonkOS was built to be the next-gen Kubernetes alternative. We realized that with K8s's power came great complexity and overhead, so we built something simpler but just as powerful. In fact, we built MonkOS to make our own lives easier with a startup that dealt with a lot of decentralized applications (where staying lean and flexible is key).

Both MonkOS and Kubernetes orchestrate containers, provision workloads and reduce hardware footprint. However, Kubernetes being a monumental solution, requires highly specialized engineers and a sophisticated DevOps setup. MonkOS bypasses this complexity by abstracting the vast majority of orchestration and infrastructure-side operations into an efficient single workflow.

-   **Fast onboarding**: familiar YAML, easy to customize Kits and a logic no more complicated than `docker-compose` make it easy to deploy your first app with MonOS in less than 2 hours.

-   **Seamless production flow**: develop locally and move to staging and production with zero friction. MonkOS Kits work the same anywhere there's a `monkd` instance running.

-   **Low overhead**: lean teams can manage very complex applications. MonkOS is easy to use, and developers who maintain Kits significantly reduce overhead for end users.

-   **Self-contained Engine**: in most use cases, especially for smaller teams, K8s requires managed services such as EKS, AKS or GKE, which add extra steps and scaling pains. MonkOS runs a new kind of [peer-to-peer clusters](/docs/lifecycle/cluster-create-1.md), is a native part of the [ecosystem](key-concepts.md) and offers load balancing, auto-scaling and much more out of the box. See [Features](./features.md) for a complete list.

Also note that MonkOS integrates natively with popular [CI/CD providers](../improve/ci-cd/). Overall, MonkOS is meant to be a single solution that maintains the power of K8s where it shines, but without the extra steps of setting up DevOps or using external IaaS, managed engines, or Helm. And speaking of...

## Helm

You could think of Monk Kits as superpowered Helm charts. Yet unlike Helm, MonkOS is built from the ground up to integrate Kitlanguage and package management into one.

-   _All in one_: Helm was supposed to be a package manager for K8s definitions, but it also doubles as a templating language. Doing more things at once increases complexity and errors.

-   _Better language_: Helm's language relies on imperative templating, which makes it verbose and prone to mistakes. [MonkScript YAML](../monkscript) is declarative and composable, which makes it less verbose and supportive of the DRY principle. It also has a friendlier syntax.

-   _Native package manager_: Artifact Hub is a package manager built on top of Helm, whereas Monk Hub is native to the [ecosystem](key-concepts.md). Our Kitlanguage is also seamlessly integrated with the rest of the internals and decoupled from package management, which makes Monk Kits really portable across workflows and systems.

-   _Unified Execution_: in Helm, composition happens at compile-time, and runtime scripting happens through other mechanisms that depend on k8s, which complicates workflow and troubleshooting. MonkOS presents a unified execution model for Kitprogramming, so all scripts and one-liners execute at the time when they're needed without a pre-processing phase. It's much simpler and more powerful to have everything under control using a single grammar.

In short, MonkOS offers a similar value proposition to Helm, but it's easier to use, implemented better, and ready to go out of the box.

## Nomad

Like Nomad, MonkOS is designed for simplicity, which means we keep the number of moving parts low and make setup and onboarding easy. Nomad is more powerful and reliable than MonkOS at very large scales, but MonkOS excels at saving time and reducing complexity in the vast majority of use cases.

-   **Native multi-infrastructure**: like Nomad, MonkOS supports multi-cloud, multi-region and on-prem deployments. But MonkOS doesn't need additional tools (e.g. Terraform) to set up clusters, since clusters are a native feature.

-   **Integrated Hub**: Just as with Helm, a Hub that's directly integrated with the workflow offers considerable benefits. Nomad doesn't have a hub, so you always need to start from scratch and it's hard to reuse workloads on different infrastructures.

-   **No hyperscale**: however, Nomad excels at high scales and when fine-grained workload optimization is needed. MonkOS isn't yet capable of that, but most of our users don't need to orchestrate hundreds of thousands of containers (and those who do usually rock advanced DevOps processes).

-   **More specialized in scope**: Nomad supports orchestrating applications of different kinds, including Windows, Java, VMs and others. MonkOS currently works with Podman but the architecture can easily support any other OCI-compliant containerization solutions.

In short, both MonkOS and Nomad make it easy and efficient to orchestrate applications across regions and infrastructures. MonkOS is easier to use and offers a stable, efficient single workflow, while Nomad offers more reliability at the highest scale and scope.

## Docker-compose

In general principle and syntax, MonkScript is similar to Docker Compose: you define and run multi-container applications with YAML manifest. In fact, if you've ever written a `docker-compose.yml` you'll feel right at home using MonkScript (see the [MonkScript primer](/docs/monkscript/index.md)).

However, MonkOS adds an invaluable extra layer of control to your manifests, making them truly independent of environment, and bypassing the need for a Dockerfile in most cases.

-   **Environment definition**: With Compose, you need to specify a particular environment in your Dockerfile, and make manual changes to it when needed. MonkOS lets you do that inside your single MonkScript file, and switch environments (staging, production, CI/CD etc.) and infrastructure (cloud, multi-cloud or bare metal) in one place with just a few lines of code.
-   **Scriptable actions**: You can execute code in your containers and communicate with your cloud provider directly from MonkOS, without a Dockerfile or even your cloud CLI. All you need is your Kit's file and MonkOS' [command line](/docs/cli/monk.md).

Think of Monk as a docker-compose for herds of docker-composes, which also sets up and manages your infra in addition to containers.

:::note

Monk works seamlessly with Docker, and in fact to [install Monk](../get-started/get-monk.md) at this point in time you'll need to have Docker installed and running.

:::

## Terraform

Terraform specializes in the provisioning/infrastructure level. MonkOS has that covered, but also deals with the application side of things. Think of it as if Kubernetes and Terraform had a baby, with much nicer syntax:

-   **More than provisioning**: Monk Kits can contain both infrastructure elements and service definitions (containers).

-   **Complete system definitions**: Since infrastructure components and service components are unified on MonkOS, it's possible to share a complete system – e.g. a Kafka cluster with a lot of moving parts – and put it on any MonkOS cluster in the world. All with a single YAML file.

-   **Simple and efficient**: Starting a new MonkOS cluster, without even having MonkOS installed, only takes three commands: `apt install monk` && `monk cluster new` && `monk provider add`. Even without writing any Kits you get to deploy full systems with e.g. `monk run gitlab/latest` pulled straight from the Hub.

-   **Declarative templating**: like MonkScript, Terraform uses declarative configuration files that work predictably in testing, staging, and production environments. However, MonkScript is arguably easier to learn than HCL (HashiCorp Configuration Language) and provides a more unified workflow thanks to [scriptable actions](../monkscript/scripting) and more unique features.

Therefore, a bit like Nomad, Terraform is a feature-packed solution that offers value at large scale and complexity, while MonkOS is a leaner out-of-the box solution that offers great efficiency at a much lower threshold of complexity.

---

## Conclusion

MonkOS pushes forward a new paradigm in orchestration. Main functionalities are comparable to popular solutions you might be familiar with, but the whole package is more complete and straightforward than any other piece of software that's currently out there.

If you haven't already, [get Monk](../get-started/get-monk.md) to see it in action, or dive into [Features](features.md) to see what's on the plate.

<ComparisonTable />
