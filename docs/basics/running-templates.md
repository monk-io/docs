---
title: "Run locally"
---

Running existing Kits with MonkOS is very straightforward. Running them locally is useful for testing and one-off deployments on single machines.

This short tutorial shows how to run Kits locally. We'll run MongoDB on MonkOS. Make sure you have MonkOS installed and `monkd` running. If not, follow [this guide &#8594;
](get-monk.md)

---

## Browsing available Kits

There are many Kits to choose from, they're all available in the Monk Hub.

To find interesting packages, browse the [MonkHub.io](https://monkhub.io) GUI, or run:

    monk list

to see a list of available ones. You can narrow down search with the following arguments:

```
monk list --help

USAGE:
   monk list [command options] [arguments...]

OPTIONS:
       --runnables, -r  (default: false)
       --groups, -g     (default: false)
       --local, -l      (default: false)
       --help, -h       show help (default: false)
```

In this example we use a MongoDB Kit published by MonkOS. It is based on Bitnami's MongoDB container image. You can pick any other Kit from the available ones of course.

To install MongoDB, simply run:

    monk run mongodb/mongodb

That's it! MongoDB is running on your machine. You can connect to `localhost:27017` and put some data in it.

## Updating

Let's suppose that a new version of MongoDB came out. The maintainer of `mongodb/mongodb` will update their Kit to a new version and publish it to the Monk Hub.

In order to update the already running Kit to its newest available version you just have to do:

    monk update mongodb/mongodb

That's it! The containers will be updated and re-spawned from the newest images, the storage associated with the Kit will be preserved.

## Stopping

In order to stop the Kit do:

    monk stop mongodb/mongodb

This will stop the Kit but it will not touch its storage so if you decide to run `mongodb/mongodb` again, the data will be there.

## Conclusion

We have learned how to run, update and stop Kits locally and how to browse the available ones. MonkOS will happily run even the largest system on your laptop if you want but its true value lies in clusters. Move to the next guide to learn how to create a MonkOS cluster.
