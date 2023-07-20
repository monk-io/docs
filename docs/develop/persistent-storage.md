---
title: "Add Persistent Storage"
---

MonkOS is capable of creating and maintaining persistent volumes in your cloud environment. For example, you can create
a volume usable by all containers in its region. This guide shows how to provision and mount such volume.

Persistent volumes are created close to the workloads, meaning that they will end up in the same region as the MonkOS
node running the runnable or group in which the volume was specified.

## Prerequisites

You need a MonkOS cluster with at least two nodes running in your chosen cloud to be able to try this out.

## Step 1: Preparing the Kit

We will write a simple `mongodb` Kit to illustrate how the database could be stored on a persistent volume.

### Basic Kit

```yaml title="database.yaml" linenums="1"
namespace: guides

database:
  defines: runnable
  containers:
    mongodb:
      image: mongo
      image-tag: latest
```

Now add volume and mount definitions to the Kit:

```yaml title="database.yaml" linenums="1"
namespace: guides

database:
  defines: runnable
  containers:
    mongodb:
      image: mongo
      image-tag: latest
      mounted-volumes:
        important-data:
          path: /data/db
  volumes:
    important-data:
      kind: local
```

It is perfectly fine to run with:

    monk load database.yaml
    monk run guides/database

The MongoDB database will use its local volume to store the data. This means that the data will be stored on the disk of
the instance that is running this Kit.

In `mounted-volumes` for a container we chose to mount the volume in `/data/db` because that's the default path where
MongoDB stores its data in `mongo` image. You can also add optional `subdir` property to mount the subdirectory
of the referenced volume instead of root.

On host side, meaning that the instance with runnable and volume attached, the volume will be mounted in MonkOS volumes
directory, you can change it by setting `path` for a `volume`.

```yaml title="database.yaml" linenums="1"
...
database:
  defines: runnable
  containers:
    mongodb:
      image: mongo
      image-tag: latest
      mounted-volumes:
        important-data:
          path: /data/db
          subdir: data
volumes:
  important-data:
    kind: local
    path: <- `${monk-volume-path}/mongodb`
```

This will mount the volume in `/root/.monk/volumes/mongodb/data` on the host to `/data/db` in the container.

### Extend Kit with Cloud Volume

Let's extend `database.yaml` with a cloud volume definition:

```yaml title="database.yaml" linenums="1"
namespace: guides

database:
  defines: runnable
  containers:
    mongodb:
      image: mongo
      image-tag: latest
      mounted-volumes:
        important-data:
          path: /data/db
  volumes:
    important-data:
      kind: SSD
      size: 60
      name: mongodb-volume
```

We've added `size` and changed `kind` for our volume. The `size` is expressed in Gigabytes so our
new volume will have 60GB. The `kind` is `SSD` - you can pick between `HDD` or `SSD` depending on your needs, some cloud
providers have more volume types.

We've also added `name` for our volume. This is the name that will be used to create the volume in the cloud. If you do
not specify a name, MonkOS will use the same name as volume reference (here `important-data`).

## Step 2: Running the Kit

```yaml title="database.yaml" linenums="1"
namespace: guides

database:
  defines: runnable
  containers:
    mongodb:
      image: mongo
      image-tag: latest
      mounted-volumes:
        important-data:
          path: /data/db
  volumes:
    important-data:
      kind: SSD
      size: 10
      name: mongodb-volume
```

Save this file as `database.yaml` and run with:

    monk load database.yaml
    monk run guides/database

Pick a `tag` that will place the workload in some cloud environment (this will not work when running locally).

The output should look similar to:

    ? Select tag to run on: sometag
    ✔ Starting the job... DONE
    ✔ Preparing nodes DONE
    ✔ Checking/pulling images DONE
    ✔ Started guides/database
    ✨ All done!
    🔩 guides/database
    └─🧊 Peer QmPVzBzu94DgqrKp2uQGZLyXaC9zoYpDL3idXs24b8R6vU
        └─📦 templates-local-guides-database-database
        ├─🧩 mongo:latest
        ├─💾 /root/.monk/volumes/mongodb -> /data/db
        └─🔌 open 174.138.39.138:27017 -> 27017
    💡 You can inspect and manage your above stack with these commands:
        monk logs (-f) guides/database - Inspect logs
        monk shell     guides/database - Connect to the container's shell
        monk do        guides/database/action_name - Run defined action (if exists)
    💡 Check monk help for more!

## Step 3: Confirming the data was written to the volume

To confirm that the right volume was mounted:

    monk shell guides/database

This will open a shell in the database container. Check if the mountpoint exists:

    df -h

    Filesystem      Size  Used Avail Use% Mounted on
    overlay          25G  1.8G   23G   8% /
    tmpfs            64M     0   64M   0% /dev
    tmpfs           497M     0  497M   0% /sys/fs/cgroup
    /dev/sda        9.8G  337M  9.0G   4% /data/db          <--- our volume
    /dev/vda1        25G  1.8G   23G   8% /data/configdb
    shm              64M     0   64M   0% /dev/shm
    tmpfs           497M     0  497M   0% /proc/acpi
    tmpfs           497M     0  497M   0% /proc/scsi
    tmpfs           497M     0  497M   0% /sys/firmware

There should be some files present there already, check with:

    ls /data/db

    WiredTiger	   _mdb_catalog.wt		       index-1-641850887836602971.wt  lost+found
    WiredTiger.lock    collection-0-641850887836602971.wt  index-3-641850887836602971.wt  mongod.lock
    WiredTiger.turtle  collection-2-641850887836602971.wt  index-5-641850887836602971.wt  sizeStorer.wt
    WiredTiger.wt	   collection-4-641850887836602971.wt  index-6-641850887836602971.wt  storage.bson
    WiredTigerHS.wt    diagnostic.data		       journal

If you see similar output, it means that the cloud provided volume is mounted to the container ans stores the database.

## Volume backups

MonkOS can back up any defined cloud volume using volume snapshots. To enable backups at any point you can add the
following definition inside your volume (here `important-data`):

```
backup:
    rotation-days: 10
    every: 1
    kind: week
    start-time: 00:00
    start-day: MONDAY
```

This can be read as follows: _At all times keep backups from last 10 days making a backup every week at midnight on
Monday._

Times must be in `HH:MM` format, weekdays are one
of `MONDAY`, `TUESDAY`, `WEDNESDAY`, `THURSDAY`, `FRIDAY`, `SATURDAY`, `SUNDAY`. The field `kind` sets the interval and
can be one of `day`, `hour`, `week`.

MonkOS delegates the backup process to the cloud it's running on and the backups can be managed via the cloud console
and won't disappear even if MonkOS fails or gets removed from your cloud account.

## Full example of volumes with backup's usage

```
namespace: /postgres
postgres:
  defines: runnable
  containers:
    postgres:
      image: bitnami/postgresql
      mounted-volumes:
        postgres:
          path: /var/lib/postgresql/data
          subdir: data
  volumes:
    postgres:
      size: 2
      kind: HDD
      backup:
        rotation-days: 10
        every: 1
        kind: hour
        start-time: 00:00
        start-day: MONDAY
```

## Conclusion

You are now running a MongoDB database which stores its data on a persistent volume. In case the workload fails or the
instance running the database container ceases to exist your database contents will be safe on the persistent volume.
This mechanism can be applied to any workload or group of workloads with one or many separate volumes.
