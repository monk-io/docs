---
title: "Multi-Cloud Deployments"
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

Monk clusters are capable of spanning across multiple cloud environments while Monk handles all cloud specific aspects of such setup.

## Prerequisites

You need a cluster with at least two cloud providers added.
See: [how to add cloud providers](01-cloud-provider.md).

Pick a pair of clouds you have credentials for eg. let **cloud A** be **AWS** and **cloud B** be **GCP**. The instructions apply to any pair of clouds and you can always add more than two if you wish.

## Step 1: Add instances on cloud A

We will start by provisioning two nodes on one of the clouds:

    monk cluster grow

Monk will ask several questions about new instances, see example answers below:

<Tabs
  defaultValue="gcp"
  values={[
    {label: 'GCP', value: 'gcp'},
    {label: 'AWS', value: 'aws'},
    {label: 'Azure', value: 'azure'},
    {label: 'Digital Ocean', value: 'do'},
  ]}
>

<TabItem value="gcp">

    ? Cloud provider gcp
    ? Name for the new instance gcp-example
    ? Tags (split by whitespace) gcp-tag
    ? Instance region (gcp) us-central1
    ? Instance zone (gcp) us-central1-a
    ? Instance type (gcp) n1-standard-1
    ? Disk Size (GBs) 10
    ? Number of instances (or press ENTER to use default = 1) 2

</TabItem>

<TabItem value="aws">

    ? Cloud provider aws
    ? Name for the new instance aws-example
    ? Tags (split by whitespace) aws-tag
    ? Instance region (aws) eu-west-1
    ? Instance type (aws) t2.medium
    ? Disk Size (GBs) 10
    ? Number of instances (or press ENTER to use default = 1) 2

</TabItem>

<TabItem value="azure">

    ? Cloud provider azure
    ? Name for the new instance azure-example
    ? Tags (split by whitespace) azure-tag
    ? Instance region (azure) us-central1
    ? Instance zone (azure) us-central1-a
    ? Instance type (azure) n1-standard-1
    ? Disk Size (GBs) 10
    ? Number of instances (or press ENTER to use default = 1) 2

</TabItem>

<TabItem value="do">

    ? Cloud provider digitalocean
    ? Name for the new instance digitalocean-example
    ? Tags (split by whitespace) digitalocean-tag
    ? Instance region (digitalocean) us-central1
    ? Instance zone (digitalocean) us-central1-a
    ? Instance type (digitalocean) n1-standard-1
    ? Disk Size (GBs) 10
    ? Number of instances (or press ENTER to use default = 1) 2

</TabItem>

</Tabs>

After completing the survey, Monk will create instances according to your choices. Output from a successful run looks like this:

    ✔ Creating a new instance(s) on gcp... DONE
    ✔ Creating node: gcp-example-1 DONE
    ✔ Creating node: gcp-example-2 DONE
    ✔ Initializing node: gcp-example-1 DONE
    ✔ Initializing node: gcp-example-2 DONE
    ✔ Connecting: gcp-example-1 DONE
    ✔ Syncing peer: gcp-example-1 DONE
    ✔ Connecting: gcp-example-2 DONE
    ✔ Syncing peer: gcp-example-2 DONE
    ✔ Syncing nodes DONE
    ✔ Cluster grown successfully

The output will be similar for each cloud environment.

## Step 2: Add instances on cloud B

Go back to [Step 1](#step-1-add-peers-on-cloud-a) and repeat the process for your second cloud.

## Step 3: Check the cluster's layout

After completing above steps, you should have a multi-cloud Monk cluster running. To confirm that all nodes were started issue the following command:

    monk cluster peers

The output should look similar to:

    ✔ Got the list of peers
    ID                                              Name           Tag  Cloud ID  Provider  Containers  IP             Started At  Active
    QmQZLKddAoPFJedJu3MCoEm4Xhf56kWBmpM3siQUb7C6rW  gcp-example-1                 gcp       0           35.225.9.50    7m 59s      true
    QmRY6n5riCmD7u6xAtTrWXmfYfJ4Kga8u8SmnPshy63SYT  aws-example-1                 aws       0           52.18.236.209  14s         true
    QmSfRGKwTuGwJkGE2jWcUrshfasUNX155uQBfWC9L4838y  gcp-example-2                 gcp       0           34.122.16.154  7m 49s      true
    QmZ7nxemDrgqg5ZCUD3KxzB7oNKKSwoEoACevPPVZN16PS  aws-example-2                 aws       0           3.249.243.60   23s         true
    local                                           local                         unknown   0           127.0.0.1      46m 42s     true

Note the contents of `Provider` column, both **cloud A** and **cloud B** should be present.

## Conclusion

You are now running a Monk cluster spanning across two clouds. This cluster will behave as any other Monk cluster as Monk manages all supported cloud environments in a transparent manner. This new cluster is capable of running any Monk template and the workloads will be distributed to all instances available.
