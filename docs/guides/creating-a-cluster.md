## Cluster creation

Before we can connect other machines to the cluster (or 'grow it', as we say here at Monk), we need to create it first. Start with issuing this command:

    monk cluster new

It will ask you to set up the name for your new cluster. Follow the instructions and wait for it to complete. The output should look similar to this:

    Your cluster has been created successfully.

We are now in a new cluster. Currently, the cluster contains only your machine - the one you ran the command on. You can verify this by running:

    monk cluster peers

The list should be empty indicating that there are no remote peers connected:

    ✔ Got the list of peers
    ID          Name          Tag        Cloud ID  Provider  Containers  IP              Started At   Active
    local       local                              unknown   0           127.0.0.1       25s          true

In the next steps, we will see how to expand the new cluster to other machines.

### Configuring GCP provider

Monk requires a Service Account Key to access GCP's APIs and configure the required resources on your behalf.

#### Obtaining the Service Account Key

See [GCP Documentation](https://cloud.google.com/iam/docs/creating-managing-service-account-keys) and learn how to obtain a Service Account Key in JSON format. Save this file on your machine as it will be needed in the next step.

#### Configuring Monk

Run the following command:

    monk cluster provider add --provider=gcp --service-account-file=<path to Service Acc Key>

Pass the path to your **Service Account Key JSON file** as shown above. From now on, Monk can communicate with GCP on your behalf.

!!! warning

    Service Account Key is sensitive information. You can remove the file from your machine once you configure Monk. The credentials are now stored in an encrypted storage in the `monkd` database.

### Configuring AWS provider

Monk uses the same set of credentials as the `aws` CLI to communicate with AWS management APIs. This means that you have to pass the AWS Access Key ID and AWS Secret Access Key to Monk.

#### Obtaining the credentials

Follow the [AWS Documentation](https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-files.html) to obtain AWS Access Key ID and AWS Secret Access Key.

#### Configuring Monk

Run the following command:

    monk cluster provider add --provider=aws

You will be prompted for the **AWS Access Key ID** and **AWS Secret Access Key**. Paste them and confirm. From now on, Monk can communicate with AWS on your behalf.

## Growing the cluster

We'll now create two instances on both supported clouds.

Obviously, you can try to run your two instances (or any number of them in fact) in one cloud if you don't have both cloud providers configured.

Let's create a new **GCP** instance. Monk has an aptly named `grow` command for doing this:

    monk cluster grow --provider=gcp --name=my-gcp-instance-1 --tag=mytag --instance-type=g1-small --region=europe-west4

!!! note

    If you omit flags, `monk cluster grow` will ask you interactively for all the required details.

It sometime takes several minutes to bootstrap a new instance so do not be alarmed if the command takes some time to execute.

Adding an **AWS** instance is equally simple:

    monk cluster grow --provider=aws --name=my-aws-instance-1 --tag=mytag --instance-type=t2.micro --region=eu-central-1

!!! note

    Passing the `--tag` flag tags the new peers upon their creation so they can be addressed using their tags later on. See [Running templates in a cluster](running-templates-cluster.md) to find out how to use tags to indicate where to run the template.

Running the above commands will create two new peers:

-   `my-gcp-instance-1` on GCP
-   `my-aws-instance` on AWS

Both of those peers are now available to run Monk workloads in the cluster. You can verify this with the cluster peers command like so:

```bash
monk cluster peers
```

    ID            Name               Provider    Containers     IP            Active
    local         local              unknown     0              127.0.0.1     true
    ...           my-aws-instance-1  aws         0              ...           true
    ...           my-gcp-instance-1  gcp         0              ...           true

!!! success

    You are all set to [Run templates in a cluster](running-templates-cluster.md)!

!!! warning

    The instances created by Monk using `grow` are essentially black boxes - the user is not supposed to change their configuration by hand or even log into them via ssh. Attempting to reconfigure such instance by other means than Monk may render it unstable or unusable.

## Adding peers manually

In addition to recommended Automatic provisioning, there is an option to add new peers manually. This operation can be performed by hand or automated by some custom scripting. You can use this method, for instance, to plug on-premise bare metal servers into your existing Monk cluster or even bootstrap an entire cluster from such machines.

The process to add new peer is relatively simple thanks to _Monkcodes_ and can be used to put almost any linux machine under Monk's control.

First, install Monk on a machine of your choice (let's call it **New Machine**). Check [Getting Monk](../get-monk.md) for instructions for **New Machine's** OS.

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

!!! warning

    Monkcodes are sensitive information, protect them with great care.

Then, on the **New Machine** run the following command:

    monk cluster switch -m "<Monkcode goes here>"

After running this command New Machine will join **Your Machine's** cluster. You can now leave **New Machine** alone and operate the cluster from **Your Machine**.

The Monkcode can be reused to add more machines in the same manner as long as there are active peers in the cluster. It is a good idea to run `monk cluster info` whenever you need a Monkcode in order to get a fresh one that includes up-to-date cluster coordinates.

## Shrinking the cluster

If you wish to stop the instances you've created you can use the `cluster shrink` command.

The invocation is simple:

    monk cluster shrink

Upon running this command, Monk will look for idle (not running any containers) instances in the cluster and terminate them.

!!! warning
Monk will not back up the storage of the instances it terminates. Use `shrink` with caution and make sure that you've backed up your data first if you'd like to keep it.

## Destroying the cluster

If you wish to get rid of your entire cluster and all associated resources, you can use the cluster nuke command.

    monk cluster nuke

Upon running this command, Monk will irreversibly destroy the entire cluster and delete all associated cloud resources and data. This is a nuclear option.

!!! warning

    Monk will not back up the storage of the instances it terminates. Use `nuke` with caution and make sure that you've backed up your data first if you'd like to keep it.

## Conclusion

We have learned how to create and grow a cluster. The whole point of having a Monk cluster is being able to run templates on it. Continue to the next guide to see how to run a template in your new cluster.
