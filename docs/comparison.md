# Monk vs other software

As a new startup kid on the stack block, we often get compared to other services, and those who ask usually have their assumptions all wrong 🚨

Let's fix that, starting with two common misconceptions:

-   **Not built on Kubernetes**: Monk doesn't enhance, add to or require K8s. In fact, we replace it altogether.
-   **Not a managed service/IaaS**: deploy anywhere and however you want. Monk simply helps you compose and provision your stack with minimal overhead.

Monk is a new paradigm and approach to orchestration: a control plane sitting between application and infrastructure that lets you interact with both, touching only what matters to you, while the rest 'just works'.

!!! Paradigm

    No matter how complex they get, stacks should be as easy to 'install' and 'run' as mobile apps. Since Monk templates work seamlessly everywhere, **you as a developer offload all undue complexity** to (1) us, who make sure `monk` and `monkd` work with both infra and containers, and to (2) template publishers, who optimize stacks and components for particular app/infra combinations.

---

## Kubernetes

Plain and simple, Monk was built to be the next-gen Kubernetes alternative. We realized that with K8s's power came great complexity and overhead, so we went ahead and built something simpler but no less powerful. In fact, we built Monk to make our own lives easier in our previous startup, which dealt with a lot of decentralized applications (where staying lean and flexible is key).

Both Monk and Kubernetes orchestrate containers, provision workloads and reduce hardware footprint. However, Kubernetes being a monumental solution, it requires highly specialized engineers and a sophisticated DevOps setup. Monk bypasses this complexity by abstracting the vast majority of orchestration and infrastructure-side operations into an efficient single workflow:

-   **Fast onboarding**: familiar YAML, easy to customize templates and a logic mimicking `docker-compose` make it easy to deploy your first app with Monk in less than 2 hours.

-   **Seamless production flow**: develop locally and move to staging and production with zero friction. Monk templates work the same anywhere there's a `monkd` instance running.

-   **Low overhead**: lean teams can manage very complex applications. Monk is easy to use, and [developers who maintain templates](publishers.md) significantly reduce overhead for end users.

-   **Built-in Engine**: in most use cases, especially for smaller teams, K8s requires managed services such as EKS, AKS or GKE, which add extra steps and scaling pains. Monk Engine, which runs a new kind of [peer-to-peer clusters](./guides/creating-a-cluster.md), is a native part of the [ecosystem](key-concepts.md) and offers load balancing, auto-scaling and much more out of the box. See [Features](features.md) for a complete list.

Also note that Monk integrates natively with popular [CI/CD providers](./guides/ci-cd.md). Overall, Monk is meant to be a single solution that maintains the power of K8s where it shines, but without the extra steps of setting up DevOps or using external IaaS, managed engines, or Helm. And speaking of...

## Helm

You could think of Monk templates as superpowered Helm charts. Yet unlike Helm, Monk is built from the ground up to integrate template language and package management into one:

-   _All in one_: Helm was supposed to be a package manager for K8s definitions, but it also doubles as a templating language. Doing more things at once increases complexity and errors.

-   _Better language_: Helm's language relies on imperative templating, which makes it verbose and prone to mistakes. [MonkScript YAML](../monkscript/) is declarative and composable, which makes it less verbose and supportive of the DRY principle. It also has a friendlier syntax.

-   _Native package manager_: Artifact Hub is a package manager built on top of Helm, whereas Monk Hub is native to the [ecosystem](key-concepts.md). Our template language is also seamlessly integrated with the rest of the internals and decoupled from package management, which makes Monk templates really portable across workflows and systems.

-   _Unified Execution_: in Helm, composition happens at compile-time, and runtime scripting happens through other mechanisms that depend on k8s, which complicates workflow and troubleshooting. Monk presents a unified execution model for template programming, so all scripts and one-liners execute at the time when they're needed without a pre-processing phase. It's much simpler and more powerful to have everything under control using a single grammar.

In short, Monk offers a similar value proposition to Helm, but it's easier to use, implemented better, and ready to go out of the box.

## Nomad

Like Nomad, Monk is designed for simplicity, which means we keep the number of moving parts low and make setup and onboarding easy. Nomad is more powerful and reliable than Monk at very large scales, but Monk excels at saving time and reducing complexity in the vast majority of use cases.

-   **Native multi-infrastructure**: like Nomad, Monk supports multi-cloud, multi-region and on-prem deployments. But Monk doesn't need additional tools (e.g. Terraform) to set up clusters, since clusters are a native feature.

-   **Integrated Hub**: Just as with Helm, a Hub that's directly integrated with the workflow offers considerable benefits. Nomad doesn't have a hub, so you always need to start from scratch and it's hard to reuse workloads on different infrastructures.

-   **No hyperscale**: however, Nomad excels at high scales and when fine-grained workload optimization is needed. Monk isn't yet capable of that, but most of our users don't need to orchestrate hundreds of thousands of containers (and those who do usually rock advanced DevOps processes).

-   **More specialized in scope**: Nomad supports orchestrating applications of different kinds, including Windows, Java, VMs and others. Monk currently works only with Docker (see next section) but the architecture can easily support any other OCI-compliant containerization solutions.

In short, both Monk and Nomad make it easy and efficient to orchestrate applications across regions and infrastructures. Monk is easier to use and offers a stable, efficient single workflow, while Nomad works better and offers more reliability at the highest scale and scope.

## Docker-compose

In general principle and syntax, Monk is similar to Docker Compose: you define and run multi-container applications with YAML manifest. In fact, if you've ever written a `docker-compose.yml` you'll feel right at home using MonkScript (see the [MonkScript primer](monkscript/index.md)).

However, Monk adds an invaluable extra layer of control to your manifests, making them truly independent of environment, and bypassing the need for a Dockerfile in most cases.

-   **Environment definition**: with Compose you need to specify a particular environment in your Dockerfile, and make manual changes to it when needed. Monk lets you do that inside your single MonkScript manifest, and switch environments (staging, production, CI/CD etc.) and infrastructure (cloud, multi-cloud or bare metal) in one place with just a few lines of code.
-   **Scriptable actions**: you can execute code in your containers and communicate with your cloud provider directly from Monk, without a Dockerfile or even your cloud CLI. All you need is your template's manifest and the Monk [command line](cli/monk.md).

Think of Monk as a docker-compose for herds of docker-composes, which also sets up and manages your infra in addition to containers.

!!! note
    Monk works seamlessly with Docker, and in fact to [install Monk](get-monk.md) at this point in time you'll need to have Docker installed and running.

## Terraform

Terraform specializes in the provisioning/infrastructure level. Monk has that covered, but also deals with the application side of things. Think of it as if Kubernetes and Terraform had a baby, with much nicer syntax:

-   **More than provisioning**: Monk templates can contain both infrastructure elements and service definitions (containers).

-   **Complete system definitions**: since infrastructure components and service components are unified on Monk, it's possible to share a complete system – e.g. a Kafka cluster with a lot of moving parts – and put it on any Monk cluster in the world. All with a single YAML file.

-   **Simple and efficient**: starting a new Monk cluster, without even having Monk installed, only takes three commands: `apt install monk` && `monk cluster new` && `monk provider add`. Even without writing any templates you get to deploy full systems with e.g. `monk run gitlab/latest` pulled straight from the Hub.

-   **Declarative templating**: like MonkScript, Terraform uses declarative configuration files that work predictably in testing, staging, and production environments. However, MonkScript is arguably easier to learn than HCL (HashiCorp Configuration Language) and provides a more unified workflow thanks to [scriptable actions](./monkscript/scripting-index.md) and more unique features.

Therefore, a bit like Nomad, Terraform is a feature-packed solution that offers value at large scale and complexity, while Monk is a leaner out-of-the box solution that offers great efficiency at a much lower threshold of complexity.

---

## Conclusion

Monk pushes forward a new paradigm in orchestration. Main functionalities are comparable to popular solutions you might be familiar with, but the whole package is more complete and straightforward than any other piece of software that's currently out there.

If you haven't already, [get Monk](get-monk.md) to see it in action, or dive into [Features](features.md) to see what's on the plate.
