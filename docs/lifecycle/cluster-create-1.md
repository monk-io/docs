---
title: "Create Clusters"
---

## Cluster creation

Before we can connect other machines to the cluster (or 'grow it', as we say here at Monk), we need to create it first. Start with issuing this command:

    monk cluster new

It will ask you to set up the name for your new cluster. Follow the instructions and wait for it to complete. The output should look similar to this:

    Your cluster has been created successfully.

We are now in a new cluster. Currently, the cluster contains only your local machine - the one you ran the command on. You can verify this by running:

    monk cluster peers

The list should be empty indicating that there are no remote peers connected:

    ✔ Got the list of peers
    ID          Name          Tag        Cloud ID  Provider  Containers  IP              Started At   Active
    local       local                              unknown   0           127.0.0.1       25s          true

In the next steps, we will see how to expand the new cluster to other machines.

## Automatic provisioning

Automatic provisioning is the recommended way of creating your Monk clusters. Currently, Monk features integration with AWS, GCP, Azure and DigitalOcean. This means that Clusters can be grown automatically by just specifying instances by their type on any of those clouds. One cluster can have peers in both clouds at the same time if you set up both providers for the cluster beforehand.

### Adding cloud providers

In order to _grow_ your new cluster onto your cloud(s) you need to add your cloud credentials to Monk first.

:::note Info

Follow [How to add cloud provider to monk &#8594;
](../cloud-provider)

:::

### Growing the cluster

We'll now create two instances on GCP to demonstrate how easy it is to grow a Monk cluster.

Obviously, you can try to run your two instances (or any number of them in fact) in multiple clouds.

:::note Info

See [How to add cloud provider to monk](../multi-cloud) to learn how to provision multi-cloud clusters in detail.

:::

Let's create a new **GCP** instance. Monk has an aptly named `grow` command for doing this:

    monk cluster grow --provider=gcp --name=my-gcp-instance --tag=mytag --instance-type=g1-small --region=europe-west4 -m 2

:::note Info

If you omit flags, `monk cluster grow` will ask you interactively for all the required details.

:::

It sometime takes several minutes to bootstrap a new instance so do not be alarmed if the command takes some time to execute.

:::note Info

Passing the `--tag` flag tags the new peers upon their creation so they can be addressed using their tags later on. See [Running templates in a cluster](running-templates-cluster) to find out how to use tags to indicate where to run the template.

:::

Running the above commands will create two new peers on GCP:

-   `my-gcp-instance-1`
-   `my-gcp-instance-2`

Both of those peers are now available to run Monk workloads in the cluster. You can verify this with the cluster peers command like so:

```bash
monk cluster peers
```

    ID            Name               Provider    Containers     IP            Active
    local         local              unknown     0              127.0.0.1     true
    ...           my-gcp-instance-1  gcp         0              ...           true
    ...           my-gcp-instance-2  gcp         0              ...           true

:::tip success

You are all set to [Run templates in a cluster](running-templates-cluster)!

:::

:::caution warning

The instances created by Monk using `grow` are essentially black boxes - the user is not supposed to change their configuration by hand or even log into them via ssh. Attempting to reconfigure such instance by other means than Monk may render it unstable or unusable.

:::

## Adding peers manually

In addition to recommended Automatic provisioning, there is an option to add new peers manually. This operation can be performed by hand or automated by some custom scripting. You can use this method, for instance, to plug on-premise bare metal servers into your existing Monk cluster or even bootstrap an entire cluster from such machines.

The process to add new peer is relatively simple thanks to _Monkcodes_ and can be used to put almost any linux machine under Monk's control.

:::note Info

See [How to add cloud provider to monk](./cluster-switch-1#monkcodes) to learn more about Monkcodes.

:::

First, install Monk on a machine of your choice (let's call it **New Machine**). Check [Getting Monk](get-monk.md) for instructions for **New Machine's** OS.

Assuming you have created your cluster on **Your Machine**, run the following command to get the cluster's _Monkcode_:

    monk cluster info

This will display information about the currently selected cluster.

    Node ID: QmatuhBJjjMTU8d6Q7CjhhC4gII26r2Nppg58S3AUtbY6Q

    Token: 490a25b3-f65e-58fe-847c-60ad3f497992

    Node addresses: /p2p-circuit/p2p/QmatuhBJjjMTU8d6Q7CjhhC4gII26r2Nppg58S3AUtbY6Q, /ip4/127.0.0.1/tcp/44001/p2p/QmatuhBJjjMTU8d6Q7CjhhC4gII26r2Nppg58S3AUtbY6Q, /ip4/192.168.1.101/tcp/44001/p2p/QmatuhBJjjMTU8d6Q7CjhhC4gII26r2Nppg58S3AUtbY6Q

    Monkcode: H4sIAAAAAABA/6TMva7CIBQA4Be88xwOIsVRu5FoQrSDI9Kk/MTkhLWWhzc+grp90+eevvV4sjmfb5OZtRvGHOOoFmulrvLCvOzNdXec2uOu3TZ39qWzX1NJa/XFb8iS/0Oqoaf2Nn42/mFihSQHEAAAsAVGpYSg76+DBNIGCEj89r0CAAD//8oRarscAQAA

Find `Monkcode` in the output and copy it as it will be needed for the next step.

Your Monkcode should look more or less like this:

    H4sIAAAAAABA/6TMva7CIBQA4Be88xwOIsVRu5FoQrSDI9Kk/MTkhLWWhzc
    +grp90+eevvV4sjmfb5OZtRvGHOOoFmulrvLCvOzNdXec2uOu3TZ39qWzX1
    NJa/XFb8iS/0Oqoaf2Nn42/mFihSQHEAAAsAVGpYSg76+DBNIGCEj89r0CA
    AD//8oRarscAQAA

It can be longer or shorter based on how big your cluster is - that's because the Monkcode is just a minified set of credentials and node addresses that allow new peers find your cluster on the Internet.

:::caution warning

Monkcodes are sensitive information, protect them with great care. Even though it's impossible to join a cluster without being added as an admin, it's still best to keep Monkcodes away from prying eyes.

:::

Then, on the **New Machine** run the following command:

    monk cluster switch -m "<Monkcode goes here>"

After running this command New Machine will join **Your Machine's** cluster. You can now leave **New Machine** alone and operate the cluster from **Your Machine**.

The Monkcode can be reused to add more machines in the same manner as long as there are active peers in the cluster. It is a good idea to run `monk cluster info` whenever you need a Monkcode in order to get a fresh one that includes up-to-date cluster coordinates.

## Conclusion

We have learned how to create and grow a cluster. The whole point of having a Monk cluster is being able to run templates on it. Continue to the next guide to see how to run a template in your new cluster.
