Monk is capable of creating and maintaining persistent volumes in your cloud environment. For example, you can create an EBS volume usable by all containers in its region. This guide shows how to provision and mount such volume.

Persistent volumes are created close to the workloads, meaning that they will end up in the same region as the Monk node running the runnable or group in which the volume was specified.

## Prerequisites

You need a Monk cluster with at least two nodes running in your chosen cloud to be able to try this out.

## Step 1: Preparing the Kit

We will use a simple `mongodb` Kit to illustrate how the database could be stored on a persistent volume.

### Basic Kit

=== "database.yaml"

    ```yaml linenums="1"
    namespace: guides

    database:
        defines: runnable
        inherits: mongodb/latest
    ```

It is perfectly fine to run with:

    monk load database.yaml
    monk run guides/database

The MongoDB database will use its default local volume to store the data. This means that the data will be stored on the disk of the instance that is running this Kit.

### Extended Kit

Let's extend `database.yaml` with a `volume` definition:

=== "database.yaml"

    ```yaml linenums="1"
    namespace: guides

    database:
        defines: runnable
        inherits: mongodb/latest
        volumes:
            defines: volumes
            important-data:
                size: 60
                kind: SSD
                path: <- `${monk-volume-path}/mongodb`
    ```

We've added a volume named `important-data` in the new `volumes` section. The `size` is expressed in Gigabytes so our new volume will have 60GB. The `kind` is `SSD` - you can pick between `HDD` or `SSD` depending on your needs.

The `path` tells Monk where to mount the volume on **host** meaning that the instance with this volume attached will see the persistent volume under the path specified here. In this case, the host will mount the volume in `${monk-volume-path}/mongodb`.

Since we have the volume defined, now it's time to mount it inside the container. Let's extend the Kit again:

=== "database.yaml"

    ```yaml linenums="1"
    namespace: guides

    database:
        defines: runnable
        inherits: mongodb/latest
        volumes:
            defines: volumes
            important-data:
                size: 60
                kind: SSD
                path: <- $volume-data
    ```

We have just replaced the `${monk-volume-path}/mongodb` because `database` inherits from `mongodb/latest` which defines a variable `volume-data`. By looking at the `mongodb/latest` Kit we can see that the database container mounts `$volume-data` in `/data/db`:

=== "mongodb/latest"

        ```yaml linenums="1"
        containers:
            defines: containers
            database:
                image: mongo:latest
                ports: 27017:27017
                paths: <- `${volume-data}:/data/db` # <-----
        ```

This means it is sufficient to just provide the `volume-data` in the `volumes` section so that `important-data` will get mounted in a place where the mongodb container expects to save its state.

## Step 2: Running the Kit

=== "database.yaml"

    ```yaml linenums="1"
    namespace: guides

    database:
        defines: runnable
        inherits: mongodb/latest
        volumes:
            defines: volumes
            important-data:
                size: 60
                kind: SSD
                path: <- $volume-data
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

## Conclusion

You are now running a MongoDB database which stores its data on a persistent volume. In case the workload fails or the instance running the database container ceases to exist your database contents will be safe on the persistent volume. This mechanism can be applied to any workload or group of workloads with one or many separate volumes.
