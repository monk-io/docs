---
title: "Overview"
---

# MonkOS Deployments

MonkOS Engine is a new gen container orchestrator that implements masterless cluster architecture. This means that under any workload you want to deploy, there is a MonkOS Cluster that talks to the underlying hosts and facilitates orchestration.

## MonkOS Clusters

![Example MonkOS cluster](/img/docs/cluster.png)

MonkOS Clusters work as bunch of `monkd` instances (peers) connected together via P2P network. These instances can reside on any machine, anywhere on the internet.

Peers communicate and coordinate using an encrypted peer-to-peer protocol and, in addition, provide a virtual LAN for the workloads running within the cluster. This way, the workloads can transparently communicate with each other, no matter where they are in the cluster.

:::note Info

Learn more about networking here: [Connecting runnables &#8594;](../develop/connecting-runnables.md)

:::

The Cluster can be automatically grown within cloud environments without any work from its operator. This chapter shows how to create MonkOS Clusters and manage the peers.

## Lifecycle

### Creation

MonkOS clusters are very easy to create since MonkOS can bootstrap itself onto your existing cloud environment with minimal to no configuration required beforehand. This allows for creating temporary clusters for testing and development, as well as long running production clusters while the methods always stay the same.

Once created, MonkOS Clusters can be expanded in two ways:

-   automatically on AWS and GCP and Azure and DigitalOcean
-   manually by installing MonkOS on any set of machines and passing the right configuration

These two methods can be combined seemlessly: MonkOS clusters can span across clouds and on-premise machines or other bare metal.

:::note Info

See [Create](cluster-create-1.md) to learn how to create a MonkOS cluster.

:::

### Cluster operations

:::note Info

See [Operate](cluster-operate-1.md) to learn how to inspect, troubleshoot, shrirnk and destroy MonkOS clusters.

:::

### Switching clusters

It is possible to operate an unlimited number of separate MonkOS clusters at once. In order to assume control of a cluster, operator must join the cluster with their operator machine. This process is called _switching_.

:::note Info

See [Switch](cluster-switch-1.md) to learn how to switch between multiple MonkOS clusters.

:::
