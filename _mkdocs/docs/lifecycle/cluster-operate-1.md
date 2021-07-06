## Inspecting the cluster

If you wish to see all the peers in your cluster:

    monk cluster peers

This will display a list of peers in your cluster.

## Stopping peers

If you wish to remove a particular node from the cluster:

    monk cluster peer-remove <peer-name>

This will stop the peer and detach it from the cluster.

!!! warning

    The instance will be terminated.

    Monk will not back up the storage of the instances it terminates. Use `peer-remove` with caution and make sure that you've backed up your data first if you'd like to keep it.

## Shrinking the cluster

If you wish to stop the instances you've created you can use the `cluster shrink` command.

The invocation is simple:

    monk cluster shrink

Upon running this command, Monk will look for idle (not running any containers) instances in the cluster and terminate them.

!!! warning

    The instances will be terminated.

    Monk will not back up the storage of the instances it terminates. Use `shrink` with caution and make sure that you've backed up your data first if you'd like to keep it.

## Destroying the cluster

If you wish to get rid of your entire cluster and all associated resources, you can use the cluster nuke command.

    monk cluster nuke

Upon running this command, Monk will irreversibly destroy the entire cluster and delete all associated cloud resources and data.

This will also log you out from Monk CLI.

!!! warning

    The instances and all associated resources will be terminated.

    Monk will not back up the storage of the instances it terminates. Use `nuke` with caution and make sure that you've backed up your data first if you'd like to keep it.
