---
title: "Add Infrastructure"
---

With Monk you can [grow your cluster manually](lifecycle/cluster-create-1) by issuing the `grow` command. This is not the only way to add instances to your cluster as the Kits can also carry instructions instance definitions. Monk will create instances when running a Kit containing such a definition.

---

## Requirements

You need to create a cluster or join already existing cluster in order to deploy your runnable with embedded instances.

:::note

Please follow [this guide](lifecycle/cluster-create-1) if you need to create a new cluster.

:::

## Defining nodes

Any runnable can define `nodes` like this:

```yaml linenums="1"
namespace: foos

foo:
    defines: runnable

    nodes:
        defines: nodes
        my-node:
            provider: gcp
            tag: my-magical-cluster
            instance-type: n1-standard-1
            region: us-central1
            disk-size: 128

    affinity:
        defines: affinity
        name: my-node

    containers:
        defines: containers
        some-service:
            image: some/image
            image-tag: latest
```

When running `foos/foo`, Monk will create an instance named `my-node` using the GCP provider if it's available. The `some-service` container will be then scheduled to run on that new instance thanks to the `affinity` directive.

### Nodes section

The `nodes` definition is applicable in any `runnable`.

```yaml linenums="1"
my-node:
    provider: gcp
    tag: auto-grown
    instance-type: n1-standard-1
    region: us-central1
    disk-size: 128
```

The fields here match the arguments in the [`monk grow` command](cli/monkd.md).

## Instance affinity

Use `affinity` field in runnable definition in order to tell Monk where to start this runnable.

```yaml linenums="1"
affinity:
    name: my-instance
```

Using `name` will look for a concrete instance by name and pin the runnable there so it always run on that instance.

```yaml linenums="1"
affinity:
    tag: some-tag
```

Using `tag` will look for any instance with the specified tag and pin the runnable on that instance.
Both can be used at the same time but `name` takes precedence.
