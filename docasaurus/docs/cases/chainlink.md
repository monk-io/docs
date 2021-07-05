---
title: "Chainlink Nodes"
---

This guide will show you how to easily deploy Chainlink-based system.

## Templates

Each of the components is published in Monk Hub (<https://monkhub.io/>) or can be loaded locally from the repository.

You can browse Monk Hub via the CLI:

```
➜ monk list chainlink
✔ Got the list
Type      Template                Repository  Version  Tags
runnable  chainlink/chainlink-1   moncc       -        blockchain
runnable  chainlink/chainlink-2   moncc       -        blockchain
runnable  chainlink/chainlink-db  moncc       -        -
runnable  chainlink/common        moncc       -        blockchain
runnable  chainlink/latest        moncc       latest   blockchain
group     chainlink/system        moncc       -        -
```

## Start

Install Monk with our [quick start guide](../monk-in-10.md).

Then start Monk in a separate terminal with `monkd -d` if it's not running already. The `-d` flag is for debugging, which writes logs to stdout.

## Deploy Locally

To quickly deploy the stack locally run:

    ➜ monk run chainlink/system

Once done you should see similar output:

```
➜ monk run chainlink/system
✔ Starting the job... DONE
✔ Preparing nodes DONE
✔ Preparing containers DONE
✔ Checking/pulling images DONE
✔ Starting containers DONE
✔ New container f2e9264a6b1b0f67d3e186c7e9fca26b77bc2be43031ef4982aa0e1cbdce0c77 created DONE
✔ New container f6bcb3fd514264ad278d8c73eedb6288900600a4cb7b8a02199dcf8f8bd2955b created DONE
✔ New container a7a77f8829b85d3e9528d968f24e85debbe94d9a5bb63eeb408d648504f16b2b created DONE
✔ Started chainlink/system

✨ All done!

🔩 chainlink/system
 └─🧊 local
    ├─📦 templates-monk-chainlink-chainlink-1-chainlink-node
    │  ├─🧩  smartcontract/chainlink:latest
    │  ├─💾 /Users/toymachine/.monk/volumes/chainlink -> /chainlink
    │  └─🔌 open localhost:6688 (0.0.0.0:6688) -> 6688
    ├─📦 templates-monk-chainlink-chainlink-2-chainlink-node
    │  ├─🧩  smartcontract/chainlink:latest
    │  ├─💾 /Users/toymachine/.monk/volumes/chainlink -> /chainlink
    │  └─🔌 open localhost:6689 (0.0.0.0:6689) -> 6688
    └─📦 templates-monk-chainlink-chainlink-db-postgres
       ├─🧩  postgres:12-alpine
       ├─💾 /Users/toymachine/.monk/volumes/db_data -> /var/lib/postgresql/data
       └─🔌 open localhost:5432 (0.0.0.0:5432) -> 5432
```

## Deploy to Cloud

:::note

If you are running locally running chainlink/system stop and remove it first by typing

```
➜ monk purge chainlink/system
✔ Templates purged
```

:::

### Create a Monk Cluster

Create new cluster. `CLUSTER_NAME` is your internal name for the cluster

    ➜ monk cluster new --name=<CLUSTER_NAME>

:::note

If you are using CI pipeline i.e GitLab, you will need to save Monkcode for GitLab runner to connect to the cluster. It will be shown at the bottom of the `monk cluster info` output. Learn more about [CI/CD with Monk](ci-cd.md).

:::

#### Prepare cloud credentials

You should already have your cloud credentials ready from the [Monk in 10 minutes](../monk-in-10.md) Guide.

-   GCP service account key `/usr/local/etc/key.json` with full Compute access role.

        ➜ monk cluster provider add -p gcp -f /usr/local/etc/key.json

-   AWS IAM role with full EC2 access role and save your secret keys under `~/.aws/credentials` - Monk will automatically source from [default]

    ```
    [default]
    aws_access_key_id=<aws_access_key_id>
    aws_secret_access_key=<aws_secret_access_key>
    ```

        ➜ monk cluster provider add -p aws

#### Provision cluster nodes

To provision new instances for your cluster monk cluster grow and follow the instance creation wizard.

-   Depending on which cloud provider you are using select either GCP or AWS.
-   Choose base name for your instances - this will the name you can find your instances by in the cloud provider interface. They will also get an incremental suffix (i.e `name-1`, `name-2`) if you provision more than one.
-   Choose Tags for your instances - a tag is used as a deployment target for your systems, and you can have multiple tags in a cluster as well as multiple tags attached to each instance.

Once the wizard is complete the provisioning on the cloud provider will start.

```
➜ monk cluster grow
? Cloud provider gcp
? Name for the new instance link
? Tags (split by whitespace) chainlink-cluster
? Instance region (gcp) europe-west4
? Instance zone (gcp) europe-west4-a
? Instance type (gcp) n2-standard-2
? Disk Size (GBs) 10
? Number of instances (or press ENTER to use default = 1) 2
✔ Creating a new instance(s) on gcp... DONE
✔ Creating node: link-1 DONE
✔ Initializing node: link-1 DONE
✔ Creating node: link-2 DONE
✔ Initializing node: link-2 DONE
✔ Connecting: link-1 DONE
✔ Syncing peer: link-1 DONE
✔ Connecting: link-2 DONE
✔ Syncing peer: link-2 DONE
✔ Syncing nodes DONE
✔ Cluster grown successfully
```

Check current cluster state:

```
➜ monk cluster peers
✔ Got the list of peers
ID                                              Name    Tag                Provider  Containers  IP             Started At  Active
QmSAacpzxqurAnDC76HwVvoXcwXagvQkC3hyiNee96BY4a  link-2  chainlink-cluster  gcp       0           34.90.154.32   2m9s        true
QmUUEUcLg31yeUPEMG8wNkdNtyRBodrFSkSFsTqXU3UNay  link-1  chainlink-cluster  gcp       0           35.204.16.218  3m5s        true
local                                           local                      unknown   0           127.0.0.1      7m7s        true
```

#### Deploy

To deploy select chosen template and specify your tag in cluster created above.

```
➜ monk run chainlink/system
? Select tag to run on:  [Use arrows to move, type to filter]
> chainlink-cluster
  local

...
? Select tag to run on: chainlink-cluster
✔ Starting the job... DONE
✔ Preparing nodes DONE
✔ Preparing containers DONE
✔ Checking/pulling images DONE
✔ Starting containers DONE
✔ Started chainlink/system

✨ All done!

🔩 chainlink/system
 ├─🧊 Peer QmSAacpzxqurAnDC76HwVvoXcwXagvQkC3hyiNee96BY4a
 │  └─📦 templates-monk-chainlink-chainlink-db-postgres
 │     ├─🧩  postgres:12-alpine
 │     ├─💾 /Users/toymachine/.monk/volumes/db_data -> /var/lib/postgresql/data
 │     └─🔌 open 34.90.154.32:5432 (0.0.0.0:5432) -> 5432
 └─🧊 Peer QmUUEUcLg31yeUPEMG8wNkdNtyRBodrFSkSFsTqXU3UNay
    ├─📦 templates-monk-chainlink-chainlink-2-chainlink-node
    │  ├─🧩  smartcontract/chainlink:latest
    │  ├─💾 /Users/toymachine/.monk/volumes/chainlink -> /chainlink
    │  └─🔌 open 35.204.16.218:6689 (0.0.0.0:6689) -> 6688
    └─📦 templates-monk-chainlink-chainlink-1-chainlink-node
       ├─🧩  smartcontract/chainlink:latest
       ├─💾 /Users/toymachine/.monk/volumes/chainlink -> /chainlink
       └─🔌 open 35.204.16.218:6688 (0.0.0.0:6688) -> 6688
```

### Inspecting your system

#### Cluster contents

You can easily inspect your cluster and container contents from a high level up to the container shell level.

To list containers in your cluster run `monk ps -a` which will show all running and non-running workloads.

```
➜ monk ps -a
✔ Got containers
Template                Container                                            Uptime  Peer ID                                         Status
chainlink/chainlink-1   templates-monk-chainlink-chainlink-1-chainlink-node  1m15s   QmUUEUcLg31yeUPEMG8wNkdNtyRBodrFSkSFsTqXU3UNay  running
chainlink/chainlink-2   templates-monk-chainlink-chainlink-2-chainlink-node  1m4s    QmUUEUcLg31yeUPEMG8wNkdNtyRBodrFSkSFsTqXU3UNay  running
chainlink/chainlink-db  templates-monk-chainlink-chainlink-db-postgres       1m31s   QmSAacpzxqurAnDC76HwVvoXcwXagvQkC3hyiNee96BY4a  running
```

#### Container logs and shell

To show logs from each container use the workload namespace name i.e `chainlink/chainlink-1` and execute `monk logs -l 100 -f` where `-l` is line output limit and `-f` is to follow the logs in real-time.

```
➜  monk logs -l 100 -f chainlink/chainlink-1
2021-01-27T12:10:53Z [DEBUG] eth.Client#BalanceAt(...)                          eth/client.go:276                account=0x9B6D11F71861DD50412b7B0533D665332F964fe2 blockNumber=<nil>
2021-01-27T12:10:58Z [DEBUG] Received new head #11737753 (0xb31a99)             services/head_tracker.go:331     blockHash=0x299dd3160defbf55455b0a21cebb50d48db24888f5d59ee7e6c516940223b880 blockHeight=11737753
2021-01-27T12:11:08Z [DEBUG] HeadTracker: finished callback 2 in 11.839µs       services/head_tracker.go:528     blockNumber=11737755 callbackIdx=2 callbackType=*services.jobSubscriber id=head_tracker time=0.000011839
2021-01-27T12:10:58Z [DEBUG] HeadTracker initiating callbacks                   services/head_tracker.go:494     chainLength=50 headNum=11737753 numCallbacks=6
```

To inspect container from its shell level use monk shell and select the target workload.

```
➜  ~ monk shell chainlink/chainlink-1
# ls -l /chainlink
total 256
-rw-r--r-- 1 root root 253153 Jan 27 12:14 log.json
drwx------ 2 root root   4096 Jan 27 12:04 tempkeys
-rw------- 1 root root     44 Jan 27 12:04 secret
```

### GUI

You can also use the embedded GUI and perform the same operations to deploy and operate your Chainlink system.

![](/img/docs/gui-chainlink.png)

If that looks neat, we and the folks at Chainlink wholeheartedly agree. You can learn more about the [Monk GUI](../gui/index.md), or find more general answers on the next page.
