---
title: MonkOS
---

## MonkOS as a Cloud Operating System 

**Conceptually:** MonkOS is a cloud operating system. Cloud operating system here does not mean Linux on a VM at a cloud provider. We use the term to mean an operating system atop the cloud infrastructure. Unlike Linux which works with primitives like CPU, RAM, and disk; MonkOS works with primitives like compute clusters, API endpoints and cloud storage.

**Technically:** MonkOS is a distributed resource manager. Unlike tools such as Kubernetes or Terraform, MonkOS employs a single, distributed control plane for all cloud resources, containers and APIs that make up your application. This means that MonkOS constantly keeps track of your infrastructure and services running on top of that infrastructure. 

**MonkOS** has many functions:

- It is **multi-cloud** by default; a typical MonkOS cluster can span across cloud providers and even on-premise machines.  MonkOS boots up in minutes rather than hours. 
- It **deploys container workloads** and provisions needed infrastructure.
- It has a **built-in package manager** for fully portable packages called Kits. 
- It **composes** these packages into higher order Kits by utilizing a powerful definition language ([monkScript](/about/monkscript.md)) that supports inheritance and composition. 
- It **standardized common infrastructure** components across clouds by providing an unified API to all resources under its control (for example, you can swap AWS EBS for a GCP volume easily).
- It **automates operations**, upgrades, multi-stage deployments, backups, scaling workloads and clusters up and down, migrating from one cloud to another. 
- It **orchestrates containers but also all other kinds of resources**, including its own clusters.
- It **secures itself and your workloads** by employing 0-config KMS-backed secret storage, network encryption and isolation, access control etc,

