---
title: Working with MonkScript
---

# Working with MonkScript

This document describes basic ideas and workflow behind authoring Monk Kits. Check the reference in order to understand MonkScript itself.

:::note

See the [MonkScript YAML](./yaml) reference.

:::

## Manifest files and project structure

Monk keeps all its data, including Kits in an internal tree-like data structure. Kits are stored as individual parts of that tree. YAML files are a human-friendly way to express tree-like structures and thus, we have used YAML as our primary input format.

It is important to remember that since Monk doesn't work with those files directly, their source of origin and layout in the filesystem tree is arbitrary. This gives a lot of flexibility to the user and allows the user to choose the best organization strategy for a particular use case.

Each manifest file must start with a `namespace` declaration - it allows Monk to put data coming from many files into a common root in its database. The logic here is that each file merely contains a set of trees that should be attached to some root. `namespace` declaration instructs the loader to add the file contents under a specific root.

## Picking a namespace

A good name for a [`namespace`](./yaml#namespaces) is unique and short. Suitable candidates are:

-   your name,
-   name of your company,
-   name of your project.

Any of those will do as long as they don't clash with an existing namespace available via the hub - in case of name collision, your namespace will shadow the existing one.

## Storing manifests

The notion of the namespace eliminates the need to keep all the files pertaining to one project in one place. A Monk cluster could, for instance, load many files describing particular services, from their git repositories and do so asynchronously. They will still end up grouped together in Monk's internal database.

## Loading manifests

In order for Monk to be aware of a Kit, the file containing the Kit must be loaded. This is achieved by using the `load` command.

    monk load mystuff.yaml

Remember to reload (use the load command again) any file that has been changed in order for Monk to acknowledge the changes. This is very important when developing the Kits as forgetting to reload a Kit often leads to confusion.

Example development flow:

1. Create a manifest: `mystuff.yaml`
2. Load the manifest for the first time: `monk load mystuff.yaml`
3. Find out you've made a mistake
4. Edit the manifest
5. Go to step 2 😀
