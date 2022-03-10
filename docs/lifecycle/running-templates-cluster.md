---
title: "Run Kits in a Cluster"
---

Running Kits in a cluster isn't much different from running them locally from the operator's point of view. You can view running things locally as running them on a cluster with just one (local) machine in it.

Thanks to Monk's developer-centric design, the main focus is on services and their description in the Kits. The operator does not have to be concerned with the details of provisioning, orchestration or container image publishing.

---

## Preparation

In order to run a Kit in a cluster, we need to be in a cluster context. Run:

    monk cluster info

to check whether you're in a cluster. If not, [create a new cluster](./cluster-create-1.md) or join an existing one.

## Running a single Kit
Once you're in a cluster it is almost the same as when [running locally](running-templates.md):

    monk run -t mytag mongodb/latest

The `-t` flag tells Monk to only pick cluster members with `mytag` tag. Tags are specified when [growing the cluster](./cluster-create-1.md).

:::note

Monk makes all runnables stick to the node they were ran on initially. If you have been running mongodb/latest on your local machine it will always go to your local machine.

In order to un-stick the workload use the `--force-move` flag like this:

    monk run -t mytag --force-move mongodb/latest

:::

### Orchestration

Monk will pick the least busy machine in the cluster tagged with `mytag` tag and put MongoDB there. There is no way to instruct Monk to put particular containers on particular machines yet.

### Auto-recovery

Monk will restart crashed containers on the same instance they were occupying previously.

In case of instance outage, Monk will re-provision the same type of instance and re-create the containers that were affected by the outage. During this process, containers will be distributed across healthy instances for the time it takes to re-provision the missing instance.

## Running more than one instance of a Kit
Currently there are two ways to run multiple copies of one Kit in a single cluster. They are described below.

### Proxy Kits

Another option is to write a small proxy Kit to rename the thing we want to run. Let's suppose we want to run two independent copies of mongodb/latest.

Create `mongos.yaml` file:

```yaml linenums="1"
namespace: mynamespace

mongo1:
    defines: runnable
    inherits: mongodb/latest

mongo2:
    defines: runnable
    inherits: mongodb/latest
```

Now load it with:

    monk load mongos.yaml

To obtain two independent MongoDBs you can now do:

    monk run -t mytag mynamespace/mongo1
    monk run -t mytag mynamespace/mongo2

This method is useful when you expect to modify the configuration of each Kit: having your own Kits inheriting from a single one allows you to make adjustments and see differences at a glance in the new Kit file.

This is the recommended way of dealing with multiple workloads of the same type.

### Groups

If we want to have all instances of the Kit as a group, we can create a process group instantiating the proxy Kits.

Create a `mongos.yaml` file:

```yaml title="mongos.yaml" linenums
namespace: mynamespace

#define proxy Kits
mongo1:
    defines: runnable
    inherits: mongodb/latest

mongo2:
    defines: runnable
    inherits: mongodb/latest

mongo3:
    defines: runnable
    inherits: mongodb/latest

mongo4:
    defines: runnable
    inherits: mongodb/latest

#create process group
many-mongos:
    defines: process-group
    runnable-list:
        - mynamespace/mongo1
        - mynamespace/mongo2
        - mynamespace/mongo3
        - mynamespace/mongo4
```

Load and run it:

    monk load mongos.yaml
    monk run -t mytag mynamespace/many-mongos

This will result in four instances of `mongodb/latest` starting in your cluster. This approach works well for stateless Kits that are to be run in great numbers of exact copies.

## Updating and Stopping

Updating and stopping Kits in a cluster work the same as their [local counterparts](running-templates.md).

## Conclusion

We have learned that running workloads in a cluster is almost as simple as running them locally. Uncomplicated workloads like MongoDB are not that interesting on their own as Monk can compose multiple different Kits into reusable system Kits. Head to the next guide to learn how to build a small system with Monk.
