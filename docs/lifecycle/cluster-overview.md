---
title: "Overview"
---

# Monk Deployments

Monk Engine is a new gen container orchestrator that implements masterless cluster architecture. This means that under any workload you want to deploy, there is a Monk Cluster that talks to the underlying hosts and facilitates orchestration.

## Monk Clusters

![Example Monk cluster](/img/docs/cluster.png)

Monk Clusters work as bunch of `monkd` instances (peers) connected together via P2P network. These instances can reside on any machine, anywhere on the internet.

Peers communicate and coordinate using an encrypted peer-to-peer protocol and, in addition, provide a virtual LAN for the workloads running within the cluster. This way, the workloads can transparently communicate with each other, no matter where they are in the cluster.

:::note Info

Learn more about networking here: [Connecting runnables &#8594;
](../connecting-runnables.md)

:::

The Cluster can be automatically grown within cloud environments without any work from its operator. This chapter shows how to create Monk Clusters and manage the peers.

## Lifecycle

### Creation

Monk clusters are very easy to create since Monk can bootstrap itself onto your existing cloud environment with minimal to no configuration required beforehand. This allows for creating temporary clusters for testing and development, as well as long running production clusters while the methods always stay the same.

Once created, Monk Clusters can be expanded in two ways:

-   automatically on AWS and GCP and Azure and DigitalOcean
-   manually by installing Monk on any set of machines and passing the right configuration

These two methods can be combined seemlessly: Monk clusters can span across clouds and on-premise machines or other bare metal.

:::note Info

See [Create](cluster-create-1.md) to learn how to create a Monk cluster.

:::

### Cluster operations

:::note Info

See [Operate](cluster-operate-1.md) to learn how to inspect, troubleshoot, shrirnk and destroy Monk clusters.

:::

### Switching clusters

It is possible to operate an unlimited number of separate Monk clusters at once. In order to assume control of a cluster, operator must join the cluster with their operator machine. This process is called _switching_.

:::note Info

See [Switch](cluster-switch-1.md) to learn how to switch between multiple Monk clusters.

:::
