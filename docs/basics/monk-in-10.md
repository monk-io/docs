import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# MonkOS in 10 Minutes

This is a super-quick guide to get some containers running within your own MonkOS cluster, from start to finish.

---

## Prerequisites

-   A computer with **Linux** or **macOS** installed (+ Homebrew on macOS)
-   An account with your favorite **cloud provider**
-   **10 minutes** of your time

## Getting Monk

Install Monk for your OS. For more detailed instructions see [Getting Monk](../get-started/get-monk.md).

<Tabs
defaultValue="macOS"
values={[
{label: 'macOS', value: 'macOS'},
{label: 'Ubuntu and Debian', value: 'mainLinux'},
{label: 'Red Hat Enteprise Linux 8', value: 'rpmLinux'},
{label: 'Other Linux Systems', value: 'otherLinux'},
]}>

<TabItem value="macOS">

    brew install monk-io/monk/monk

</TabItem>

<TabItem value="mainLinux">

    curl https://apt.monk.io/repo-signing-key.pgp | sudo apt-key add
    echo "deb [arch=amd64] https://apt.monk.io stable main" | sudo tee -a  /etc/apt/sources.list.d/monk.list
    sudo apt update
    sudo apt install monk

:::note

You might need to log out and log back in on your system to be able to use `monk` without `sudo`. Alternatively, use `su - <your-username>`.

:::

</TabItem>

<TabItem value="rpmLinux">

    yum install https://dl.fedoraproject.org/pub/epel/epel-release-latest-8.noarch.rpm
    yum subscription-manager repos --enable codeready-builder-for-rhel-8-$(arch)-rpms
    yum copr enable jdoss/wireguard

    sudo tee -a /etc/yum.repos.d/artifact-registry.repo << EOF
    [monk-repo]
    name=Monk Repository
    baseurl=https://us-east1-yum.pkg.dev/projects/monk-releases/monk-releases-rpm
    enabled=1
    repo_gpgcheck=0
    gpgcheck=0
    EOF

    yum install monk

:::note

You might need to log out and log back in on your system to be able to use `monk` without `sudo`. Alternatively, use `su - <your-username>`.

:::

</TabItem>

<TabItem value="otherLinux">

If you're running Linux that does not have APT see [Getting Monk](../get-started/get-monk.md) and come back ⏪

</TabItem>

</Tabs>

## Running Monk

:::caution warning

**You always need to have `monkd` running in order to use MonkOS CLI. Fire it up to continue this guide.**

:::

Ensure that Docker or Podman is running on your system. Both of either Docker or Podman and `monkd` have to be running when using Monk.

<Tabs
defaultValue="macOS"
values={[
{label: 'macOS', value: 'macOS'},
{label: 'Ubuntu and Debian', value: 'mainLinux'},
{label: 'Red Hat Enterprise Linux 8', value: 'rpmLinux'},
{label: 'Other Linux Systems', value: 'otherLinux'},
]}>

<TabItem value="macOS">

Initialize a new monk VM that will run `monkd` in the background:

    monk machine init

Monk machine is a lightweight Linux VM that runs `monkd` on your mac.
After this step you don't have to start `monkd` by hand.

</TabItem>

<TabItem value="mainLinux">

If you installed `monkd` using APT it should be running after installation.

You can confirm that `monkd` is running by using this command:

    systemctl status monkd.service

The output should be similar to:

    ● monkd.service - Monk daemon
    Loaded: loaded (/lib/systemd/system/monk.service; enabled; vendor preset: enabled)
    Active: active (running) since Wed 2020-10-07 17:53:20 CEST; 10s ago
    Main PID: 10526 (monkd)
        Tasks: 16 (limit: 4667)
    CGroup: /system.slice/monkd.service
            └─10526 /usr/bin/monkd
    oct 07 17:53:20 foo systemd[1]: Started Monk daemon.
    oct 07 17:53:20 foo monkd[10526]:    Monk v3.10.1
    oct 07 17:53:20 foo monkd[10526]:    © 2018-2023 MonkOS Inc. All rights reserved.
    oct 07 17:53:20 foo monkd[10526]:    https://monk.io
    oct 07 17:53:20 foo monkd[10526]: Please stand by while monkd is starting...
    oct 07 17:53:20 foo monkd[10526]: generating 2048-bit RSA keypair...done
    oct 07 17:53:20 foo monkd[10526]: peer identity: ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓
    oct 07 17:53:23 foo monkd[10526]: Local containers will not be broadcasted to the cluster
    oct 07 17:53:23 foo monkd[10526]: Initialization complete. monkd is ready

If for some reason it's not running - just start it with the following command:

    monkd

Keep the terminal open while using `monk`, or use `systemctl` to start the service so it is running at all times.

</TabItem>

<TabItem value="rpmLinux">

If you installed `monkd` using RPM it should be running after installation.

You can confirm that `monkd` is running by using this command:

    systemctl status monkd.service

The output should be similar to:

    ● monkd.service - Monk daemon
    Loaded: loaded (/lib/systemd/system/monk.service; enabled; vendor preset: enabled)
    Active: active (running) since Wed 2020-10-07 17:53:20 CEST; 10s ago
    Main PID: 10526 (monkd)
        Tasks: 16 (limit: 4667)
    CGroup: /system.slice/monkd.service
            └─10526 /usr/bin/monkd
    oct 07 17:53:20 foo systemd[1]: Started Monk daemon.
    oct 07 17:53:20 foo monkd[10526]:    Monk v3.9.0
    oct 07 17:53:20 foo monkd[10526]:    © 2018-2023 MonkOS Inc. All rights reserved.
    oct 07 17:53:20 foo monkd[10526]:    https://monk.io
    oct 07 17:53:20 foo monkd[10526]: Please stand by while monkd is starting...
    oct 07 17:53:20 foo monkd[10526]: generating 2048-bit RSA keypair...done
    oct 07 17:53:20 foo monkd[10526]: peer identity: ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓
    oct 07 17:53:23 foo monkd[10526]: Local containers will not be broadcasted to the cluster
    oct 07 17:53:23 foo monkd[10526]: Initialization complete. monkd is ready

If for some reason it's not running - just start it with the following command:

    monkd

Keep the terminal open while using `monk`, or use `systemctl` to start the service so it is running at all times.

</TabItem>

<TabItem value="otherLinux">

Run `monkd` in a new Terminal window and don't close it:

    monkd

Wait for it to initialize, you should see this:

    Monk v3.10.1
    © 2018-2023 MonkOS Inc. All rights reserved.
    https://monk.io

    Please stand by while monkd is starting...
    Initialization complete. monkd is ready

:::note

`monkd` has to be running at all times when using `monk` or running any workloads via Monk. You might consider adding monkd to your service management daemon configuration so that it stays running as a service.

:::
</TabItem>

</Tabs>

## Creating Your MonkOS Account

Setting up the account takes 10 seconds. We use accounts to securely match users with their Monk clusters and for licensing and analytics purposes. 

Use this command to create your MonkOS account:

    monk register

You will be asked to verify your email address before logging in. Check your email!

## Signing In

Once `monkd` is running and you have confirmed your email address do:

    monk login

Use your MonkOS account email and password:

    ? Email greatest@hacker.me
    ? Password ***** ***
    ✔ Logged in.

:::success

**MonkOS is 100% ready to roll at this point.** You will not be asked to log in very often but some commands will require your MonkOS account credentials.

:::

## Creating a MonkOS Cluster

Now to the exciting part! MonkOS cluster is where your workloads will run. Clusters are created once and they serve as a runtime environment that can be grown or shrunk on demand. Let's create a cluster with 3 short commands.

You'll need your service account credentials handy. Here's a reminder on how to get them:

<Tabs
defaultValue="gcp"
values={[
{label: 'GCP', value: 'gcp'},
{label: 'AWS', value: 'aws'},
{label: 'Azure', value: 'azure'},
{label: 'Digital Ocean', value: 'do'},
]}>

<TabItem value="gcp">

1. Create a new project in your GCP console,
2. In the new project, go to **IAM** &#8594; **Service Accounts** &#8594; **CREATE SERVICE ACCOUNT**,
3. Assign the **Admin** role on the project to the account,
4. On the account list, click **three dots** and create a **JSON Key** for the account,
5. Save the file on your machine eg. in `key.json`

:::caution warning

Make sure that **Compute Engine is enabled on your project**.
See [https://cloud.google.com/apis/docs/getting-started#enabling_apis](https://cloud.google.com/apis/docs/getting-started#enabling_apis) if you're not sure how.

Make sure that your account has **compute resources admin access**.

:::

</TabItem>

<TabItem value="aws">

If you're running the AWS CLI, you should be able to locate the credentials in the `~/.aws/credentials` on your machine, i.e.:

    [default]
    aws_access_key_id=F0FAXXXXXEXAMPLE
    aws_secret_access_key=wJXXXXXXEEMI/XXXXX/bPxRfiCYEXAMPLEKEY

Note those values down.

If you don't have that file, consult the [AWS Documentation](https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-files.html).

:::caution warning

Make sure that your account has **AmazonEC2FullAccess policy**.

:::

</TabItem>

<!-- <TabItem value="azure">

Assuming you're using Azure CLI, issue the following command:

    az ad sp create-for-rbac --role Contributor --sdk-auth > azurekey.json

This will produce JSON file containing your access key.

:::caution warning

Azure Access Key is sensitive information. You can remove the file from your machine once you configure Monk. The credentials are now stored in an encrypted storage in the `monkd` database.

:::

</TabItem> -->

<TabItem value="do">

1. Go to [https://cloud.digitalocean.com/account/api/tokens](https://cloud.digitalocean.com/account/api/tokens)
2. Create a new Personal Access Token
3. Note down the Token for future use

:::caution warning

DigitalOcean API Token is sensitive information. Take care to store it securely.

:::

</TabItem>

</Tabs>

:::note

**It's alright if you want to skip cluster creation for now.** You can run things locally and create a cluster later. You can still follow this guide but remember that stuff will happen on your machine and not in the cloud. To skip ahead, head to [Running Kits locally](../basics/running-templates.md).

:::

To create a new cluster:

    monk cluster new

You'll be asked to choose a name for the new cluster. Now we'll attach your cloud credentials to the new cluster:

<Tabs
defaultValue="gcp"
values={[
{label: 'GCP', value: 'gcp'},
{label: 'AWS', value: 'aws'},
{label: 'Azure', value: 'azure'},
{label: 'Digital Ocean', value: 'do'},
]}>

<TabItem value="gcp">

In order to add your Service Account key to MonkOS do:

    monk cluster provider add -p gcp -f <<path/to/your-key.json>>

where `<<path/to/your-key.json>>` is an absolute path to your Service Account **JSON Key**.

For example:

    monk cluster provider add -p gcp -f ~/myproject/key.json

Successful invocation will result in:

    ✔ Provider added successfully

</TabItem>

<TabItem value="aws">

In order to add your AWS credentials to MonkOS do:

    monk cluster provider add -p aws

MonkOS will look for AWS credentials in your AWS CLI config folder `~/.aws/credentials`:

    AWS config /Users/me/.aws/credentials detected, multiple profiles present - pick one.
    ? AWS profile  [Use arrows to move, type to filter]
    > default
        profile eb-cli

:::info

If `~/.aws/credentials` file is not present, MonkOS will prompt you for **Access** and **Secret Keys**.

:::

Select or enter the credentials and confirm with ENTER.

Successful invocation will result in:

    ✔ Provider added successfully

</TabItem>

<TabItem value="azure">

In order to add your SDK authentication JSON file to MonkOS do:

    monk cluster provider add -p azure -f <<path/to/your-sdk-file.json>>

where `<<path/to/your-sdk-file.json>>` is an absolute path to your SDK authentication file in JSON format.

For example:

    monk cluster provider add -p azure -f ~/myproject/azure.json

Successful invocation will result in:

    ✔ Provider added successfully

</TabItem>

<TabItem value="do">

In order to add your Digital Ocean Personal Access Token to MonkOS do:

    monk cluster provider add -p digitalocean

You will be prompted for your Digital Ocean Personal Access Token:

    ? Digitalocean Token *******************

Enter or paste your token and confirm with ENTER.

Successful invocation will result in:

    ✔ Provider added successfully

</TabItem>

</Tabs>

:::note

If you have more cloud accounts you can add all of them. MonkOS is great at managing singular clusters across cloud providers out of the box.

:::

:::important

You don't need to touch, or even have your `gcloud` or `aws` CLI installed locally. MonkOS will work without them being present.

:::

:::success

**That's it!** We now have a brand new cluster. Its only member is your own machine at the moment.

:::

## Growing Your New Cluster

The cluster is there _logically_. Now we have to expand it _physically_. Fortunately, we don't have to go back to the cloud console or resort to other tools like Terraform. We will just tell MonkOS to bootstrap it for us:

    monk cluster grow

This command, like all `monk` commands, can either take arguments or prompt interactively. You will be asked about how many instances you want to spin up - we went with **three n1-standard-1**. It's generally a good idea to have **at least two** in your cluster in order to ensure that the cluster remains stable in case of failure of a single node.

Next up, you will be prompted for some information. All fields are required:

    ? Cloud provider gcp
    ? Name for the new instance foobar
    ? Tag <your-cluster-tag>
    ? Instance region (gcp) us-central1
    ? Instance type (gcp) n1-standard-1
    ? Disk Size (GBs) 20
    ? Number of instances (or press ENTER to use default = 1) 3
    ⠏ Creating a new instance(s) on gcp...

**`Tag` is important** – replace `<your-cluster-tag>` with a name of your choice and write it down.
**MonkOS requires all machines in the cluster to be tagged with at least one tag.** We will be referring to the new machines by their tag shortly.

:::caution warning

Your cloud account may have some quotas on CPU and instance types depending on the region. You may see an error if you hit a quota or choose an unavailable instance-region combination. Try choosing a different region or machine type.

:::

It should take 1–3 minutes to bootstrap all 3 instances. After `grow` is done, check with:

    monk cluster peers

You should get a similar output:

    ID     Name      Tag  Cloud ID  Provider  Containers  IP         Started At  Active
    local  local                    unknown   0           127.0.0.1  52m 3s      true
    ...    foobar-1                 gcp       0           ...        2m 3s       true
    ...    foobar-2                 gcp       0           ...        2m 53s      true
    ...    foobar-3                 gcp       0           ...        3m 1s       true

:::note

Sometimes, depending on your network conditions, the peers might appear on the list with a slight delay. Repeat `monk cluster peers` if you don't see all 3 instances immediately.

:::

:::success

You now have a fully operational 3 machine MonkOS cluster running in your cloud 🎉

:::

## Deploying a Kit
Now that we have a working cluster, it's high time to run something on it.

Use the following command to see what's immediately available:

    monk list

Then just pick one of those Kits, or just try with `mongodb/mongodb`:

    monk run -t <your-cluster-tag> mongodb/mongodb

Remember to replace `<your-cluster-tag>` with the one you've chosen during `monk cluster new`!

:::note

Skip `-t <your-cluster-tag>` if you skipped the cluster creation step. The invocation will look like this:

    monk run mongodb/mongodb

:::

MonkOS will work for a moment and then display a summary showing the current workload layout and some useful hints.

:::success

That's it! You're now running stuff, in the cloud, with MonkOS 🎉

:::

## Cleaning Up

If you don't want to use the cluster anymore just do:

    monk cluster nuke

This will destroy the cluster and all associated resources. **Be careful! MonkOS will not back up the storage of the instances it terminates**.

In case you'd like to create another cluster, follow this guide again or see: [Creating a cluster](../lifecycle/cluster-create-1.md).

## What's Next?

Our newly formed cluster has 3 machines and can do much more than just running one simple workload. Having your cluster up and running is enough to start trying [everything that Monk has to offer](../about/features.md).

If you'd like to try a more advanced setup including a database, HTTP server, and a self-made service, continue to our first A-Z tutorial: [Running a small system](../develop/basic-app.md).
