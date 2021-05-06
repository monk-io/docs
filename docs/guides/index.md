# Guides

Ready to learn all about using Monk? In this section you'll find several guides explaining how you can achieve the most critical deployment tasks using nothing but Monk's YAML and CLI.

---

## Getting started

All guides assume that you already have a working Monk setup on your machine. If you don't have Monk installed yet see the [installation guide](../get-monk.md) for details, or [Monk in 10 minutes](../monk-in-10.md) for more context.

---

## Basics

Get familiar with Monk by learning simple scenarios for common taks you'll encounter in your setup and day to day:

: [Running templates locally](running-templates.md): test deployments on your machine
: [Creating a cluster](/lifecycle/cluster-create-1): create and deploy p2p clusters on GCP and AWS
: [Running templates in a cluster](running-templates-cluster): run single `runnable` and `group` templates

---

## Tutorials

Tutorials are more involved guides taking you through the process of creating a concrete piece of infrastructure with Monk. Follow these to learn more about ways to work with Monk.

: [Running a small system](basic-app.md): compose a MongoDB and Nginx app and run it
: [Connecting runnables](connecting-runnables.md): simplify networking and service discovery with `<-` arrow scripts
: [Using load balancers](load-balancers.md): TCP, UDP, HTTP(s) and Elastic IP on GCP & AWS
: [Provisioning via templates](provisioning-via-templates.md): grow your cluster automagically from manifest
: [Deploy templates from CI/CD](ci-cd.md): easy, with GitHub Actions, GitLab, and CircleCI templates
: [Passing secrets in templates](passing-secrets.md): work with SOPS-encrypted templates
: [Using Hooks](hooks.md): unleash the power of scriptable actions right from your manifest
: [Inspecting your workloads](inspecting-workloads.md): find, log and shell into your running containers
