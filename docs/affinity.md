---
title: "Add Placement Constraints"
---

# How to constrain containers to certain instances in monk cluster

Monk provides a mechanism to constrain runnables to certain instances or groups of instances within a cluster. This mechanism ensures that your containers will not run where they don't belong.

Each runnable has an _affinity_ - by default this affinity is set to any instance but can be easily overriden. Additionally, in case of restart Monk will remember where each of the runnables were and restarts them in place so they don't change instances unless they are forced to do so. This feature is perfect for stateful workloads and we say that in Monk the workloads are _sticky_.

## Prerequisites

You should have a Monk cluster with several instances and tags running in order to follow this guide.

## Step 1: Basic template

Let's define a basic template:

```yaml title="dummy.yaml" linenums="1"
namespace: guide

foo:
    defines: runnable
    containers:
        defines: containers
        utils:
            image: amouat/network-utils
            image-tag: latest
            entrypoint: <- `sleep 36000`
```

This just defines an utility container which will stay up for a long time. While the container doesn't do much, it will help us to demonstrate the affinity. Load this template by:

    monk load dummy.yaml

# Step 2: Node affinity

Let's extend the template by adding `affinity` section:

```yaml title="dummy2.yaml" linenums="1"
namespace: guide

foo-on-node:
    defines: runnable
    inherits: guide/foo
    affinity:
        defines: affinity
        name: <<name of one of your nodes>> # <----
```

The new `affinity` section tells monk to put `foo-on-node` on a specific node which is looked up by `name`. Use:

    monk cluster peers

to see the names of the nodes, pick one and place this name in the template above instead of `<<name of one of your nodes>>`.

Try loading and running this template:

    monk load dummy2.yaml
    monk run guide/foo-on-node

Once the template is up, check its placement with:

    monk describe guide/foo-on-node

It should show that `guide/foo-on-node` lives on the node you've specified.

# Step 3: Tag affinity

Let's create another template with a different `affinity` section:

```yaml title="dummy3.yaml" linenums="1"
namespace: guide

foo-on-tag:
    defines: runnable
    inherits: guide/foo
    affinity:
        defines: affinity
        tag: <<your tag>> # <----
```

The new `affinity` section tells monk to put `foo-on-tag` on a any node with a specific `tag`. Use:

    monk cluster peers

to see available tags, pick one and place this name in the template above instead of `<<your tag>>`.

Try loading and running this template:

    monk load dummy3.yaml
    monk run guide/foo-on-tag

Once the template is up, check its placement with:

    monk describe guide/foo-on-tag

It should show that `guide/foo-on-tag` lives on a node having a tag you've specified.

## Step 3: Resident affinity

Both tag and node affinity are very useful to put certain workloads on certain nodes. What if we would like to have a runnable that takes up entire instance for itself?

This is where `resident` afinity comes into play. With `resident` affinity it is possible to tell Monk to put a runnable on a certain node and make sure that no other runnables will be started on it as long as the resident runnable is present.

Let's stop the runnable from Step 2 with:

    monk stop guide/foo-on-node

Then, let's copy the template from Step 2 and make a subtle change:

```yaml title="dummy4.yaml" linenums="1"
namespace: guide

foo-on-node-resident:
    defines: runnable
    inherits: guide/foo
    affinity:
        defines: affinity
        name: <<name of one of your nodes>> # <---- use the same name as in Step 2
        resident: true                      # <---- add this
```

Now let's load an run the template:

    monk load dumy4.yaml
    monk run guide/foo-on-node-resident

Confirm that `guide/foo-on-node-resident` lives on the right node and try running the one from Step 2:

    monk run guide/foo-on-node

This will fail as the node is now occupied by the resident `guide/foo-on-node-resident`.

:::note

Resident affinity works when either `name` or `tag` are specified. If you don't specify any of them, Monk will pick first empty instance and place the resident runnable there.

:::

## Conclusion

You've learned how to pin workloads to particular instances. This feature is very useful for making sure that resource hungry workloads are placed on the nodes that can provide these resources. With careful naming and partitioning your cluster with tags it is possible to achieve fine grained control over how different parts of your system are distributed.
