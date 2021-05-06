# Monk in 10 minutes

This is a super-quick guide to get some containers running within your own Monk cluster, from start to finish.

---

## Prerequisites

-   A computer with **Linux** or **macOS** installed,
-   If you're behind a firewall: open ports **44001** and **44002** for ingress/egress,
-   **Docker** installed and running,
-   An account with your favorite **cloud provider**,
-   **10 minutes** of your time.

## Getting a Monk account

Chances are that you already have one but in case you don't, [sign up on our website](https://monk.io/join) now.

Monk currently won't work without an account, but it takes a grand total of 10 seconds to get one.

## Getting Monk

Install Monk for your OS. For more detailed instructions see [Getting Monk](get-monk.md).

=== "macOS"

        brew install monk-io/monk/monk

=== "Ubuntu/Debian"

        curl -s https://apt.monk.io/Release.gpg | sudo apt-key add -
        sudo echo "deb [arch=amd64] https://apt.monk.io/ stable main" | sudo tee /etc/apt/sources.list.d/monk.list
        sudo apt update
        sudo apt install monk

    !!! note
        You might need to log out and log back in on your system to be able to use `monk` without `sudo`. Alternatively, use `su - <your-username>`.

=== "Other Linux Distros"

    If you're running Linux that does not have APT see [Getting Monk](get-monk.md) and come back ⏪

## Running Monk

Ensure that Docker is running on your system. Both Docker and `monkd` have to be running when using Monk.

=== "macOS"

    Run `monkd` in a new Terminal window and don't close it:

        monkd

    Wait for it to initialize, and you should get this output:

        Monkd v2.4.4
        © 2018-2021 OAKds Inc. All rights reserved.
        https://monk.io

        Please stand by while monkd is starting...
        Initialization complete. monkd is ready

=== "Ubuntu/Debian"

    If you installed `monkd` using apt it should be running after installation.

    You can confirm that `monkd` is running by using this command:

        systemctl status monkd.service

    The output should be similar to:

        ● monkd.service - Monk daemon
        Loaded: loaded (/lib/systemd/system/monk.service; enabled; vendor preset: enabled)
        Active: active (running) since Wed 2020-10-07 17:53:20 CEST; 10s ago
        Main PID: 10526 (monccd)
            Tasks: 16 (limit: 4667)
        CGroup: /system.slice/monkd.service
                └─10526 /usr/bin/monkd
        oct 07 17:53:20 foo systemd[1]: Started Monk daemon.
        oct 07 17:53:20 foo monccd[10526]:    Monk v2.4.3
        oct 07 17:53:20 foo monccd[10526]:    © 2018-2020 OAKds Inc. All rights reserved.
        oct 07 17:53:20 foo monccd[10526]:    https://monk.io
        oct 07 17:53:20 foo monccd[10526]: Please stand by while monccd is starting...
        oct 07 17:53:20 foo monccd[10526]: generating 2048-bit RSA keypair...done
        oct 07 17:53:20 foo monccd[10526]: peer identity: Qmch66W2sJPTvchcFAVwHR57HyAPA927s3327
        oct 07 17:53:23 foo monccd[10526]: Local containers will not be broadcasted to the clus
        oct 07 17:53:23 foo monccd[10526]: Initialization complete. monccd is ready

    If for some reason it's not running - just start it with the following command:

        monkd

    Keep the terminal open.

=== "Other Linux Distros"

    Run monkd in a new Terminal window and don't close it:

        monkd

    Wait for it to initialize, you should see this:


        Monk v2.4.3
        © 2018-2020 OAKds Inc. All rights reserved.
        https://monk.io

        Please stand by while monkd is starting...
        Initialization complete. monkd is ready

!!! warning

    **Yep, you always need to have `monkd` running in order to use Monk CLI. Fire it up to continue this guide.**

## Signing in

Once `monkd` is running:

    monk login

Use your Monk account email and password:

    ? Email greatest@hacker.me
    ? Password ***** ***
    ✔ Logged in.

!!! success

    **Monk is 100% ready to roll at this point.** You will not be asked to log in very often but some commands will require your Monk account credentials.

## Creating a Monk cluster

Now to the exciting part! Monk cluster is where your workloads will run. Clusters are created once and they serve as a runtime environment that can be grown or shrunk on demand. We will now create a cluster with 3 short commands.

Before that, get your service account credentials ready. Here's a reminder on how to get them:

=== "GCP"

    1. Create a new project in your GCP console,
    2. In the new project, go to ==IAM --> Service Accounts --> CREATE SERVICE ACCOUNT==
    3. Assign the **Admin** role on the project to the account,
    4. On the account list, click **three dots** and create a **JSON Key** for the account,
    5. Save the file on your machine eg. in `key.json`

    !!! warning

        Make sure that the account has **compute resources admin access**.

    !!! warning

        Make sure that **Compute Engine is enabled on your project**.
        See [https://cloud.google.com/apis/docs/getting-started#enabling_apis](https://cloud.google.com/apis/docs/getting-started#enabling_apis) if you're not sure how.

=== "AWS"

    If you're running the AWS CLI, you should be able to locate the credentials in the `~/.aws/credentials` on your machine, i.e.:

        [default]
        aws_access_key_id=F0FADIOSFODNN7EXAMPLE
        aws_secret_access_key=wJalrUUtnEEMI/K7MEDNG/bPxRfiCYEXAMPLEKEY

    Note those values down.

    If you don't have that file, consult the [AWS Documentation](https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-files.html).

    !!! warning

        Make sure that the account has **AmazonEC2FullAccess policy**.

=== "Azure"

    Assuming you're using Azure CLI, issue the following command:

        az ad sp create-for-rbac --sdk-auth > azurekey.json

    This will produce JSON file containing your access key.

    !!! warning

        Azure Access Key is sensitive information. You can remove the file from your machine once you configure Monk. The credentials are now stored in an encrypted storage in the `monkd` database.

=== "Digital Ocean"

    1. Go to [https://cloud.digitalocean.com/account/api/tokens](https://cloud.digitalocean.com/account/api/tokens)
    2. Create a new Personal Access Token
    3. Note down the Token for future use

    !!! warning

        DigitalOcean API Token is sensitive information. Take care to store it securely.

!!! note

    **It's alright if you want to skip cluster creation for now.** You can run things locally for now and create a cluster later. You can still follow this guide but remember that stuff will happen on your machine and not in the cloud. To skip ahead, head out to [Running templates locally](guides/running-templates.md).

To create a new cluster:

    monk cluster new

It will ask you to choose a name for the new cluster. Then, to attach your cloud credentials to the new cluster:

=== "GCP"

    In order to add your Service Account key to Monk do:

        monk cluster provider add -p gcp -f <<path/to/your-key.json>>

    where `<<path/to/your-key.json>>` is an absolute path to your Service Account **JSON Key**.

    For example:

        monk cluster provider add -p gcp -f ~/myproject/key.json

    Successful invocation will result in:

        ✔ Provider added successfully

=== "AWS"

    In order to add your AWS credentials to Monk do:

        monk cluster provider add -p aws

    Monk will look for AWS credentials in your AWS CLI config folder `~/.aws/credentials`:

        AWS config /Users/me/.aws/credentials detected, multiple profiles present - pick one.
        ? AWS profile  [Use arrows to move, type to filter]
        > default
          profile eb-cli

    !!! info

        If `~/.aws/credentials` file is not present, Monk will prompt you for **Access** and **Secret Keys**.

    Select or enter the credentials and confirm with ENTER.

    Successful invocation will result in:

        ✔ Provider added successfully

=== "Azure"

    In order to add your SDK authentication JSON file to Monk do:

        monk cluster provider add -p azure -f <<path/to/your-sdk-file.json>>

    where `<<path/to/your-sdk-file.json>>` is an absolute path to your  SDK authentication file in JSON format.

    For example:

        monk cluster provider add -p azure -f ~/myproject/azure.json

    Successful invocation will result in:

        ✔ Provider added successfully

=== "Digital Ocean"

    In order to add your Digital Ocean Personal Access Token to Monk do:

        monk cluster provider add -p digitalocean

    You will be prompted for your Digital Ocean Personal Access Token:

        ? Digitalocean Token *******************

    Enter or paste your token and confirm with ENTER.

    Successful invocation will result in:

        ✔ Provider added successfully

!!! note

    If you have more cloud accounts you can add all of them. Monk is great at managing singular clusters across cloud providers out of the box.

!!! important

    You don't need to touch, or even have your `gcloud` or `aws` CLI installed locally. Monk will work without them being present.

!!! success

    **That's it!** We now have a brand new cluster. Its only member is your own machine at the moment.

## Growing your new cluster

The cluster is there _logically_. Now we have to expand it _physically_. Fortunately, we don't have to go back to the cloud console or resort to other tools like Terraform. We will just tell Monk to bootstrap it for us:

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
**Monk requires all machines in the cluster to be tagged with at least one tag.** We will be referring to the new machines by their tag shortly.

!!! warning

    Your cloud account may have some quotas on CPU and instance types depending on the region. You may see an error if you hit a quota or choose an unavailable instance-region combination. Try choosing a different region or machine type.

It should take 1–3 minutes to bootstrap all 3 instances. After `grow` is done, check with:

    monk cluster peers

You should get a similar output:

    ID     Name      Tag  Cloud ID  Provider  Containers  IP         Started At  Active
    local  local                    unknown   0           127.0.0.1  52m 3s      true
    ...    foobar-1                 gcp       0           ...        2m 3s       true
    ...    foobar-2                 gcp       0           ...        2m 53s      true
    ...    foobar-3                 gcp       0           ...        3m 1s       true

!!! note

    Sometimes, depending on your network conditions, the peers might appear on the list with a slight delay. Repeat `monk cluster peers` if you don't see all 3 instances immediately.

!!! success

    You now have a fully operational 3 machine Monk cluster running in your cloud 🎉

## Deploying a template

Now that we have a working cluster, it's high time to run something on it.

Use the following to see what's immediately available:

    monk list

Then just pick one of those templates, or just try with `mongodb/latest`:

    monk run -t <your-cluster-tag> mongodb/latest

Remember to replace `<your-cluster-tag>` with the one you've chosen during `monk cluster new`!

!!! note

    Skip `-t <your-cluster-tag>` if you skipped the cluster creation step. The invocation will look like this:

        monk run mongodb/latest

Monk will work for a moment and then display a summary showing the current workload layout and some useful hints.

!!! success

    That's it! You're now running stuff, in the cloud, with Monk 🎉

## Cleaning up

If you don't want to use the cluster anymore just do:

    monk cluster nuke

This will destroy the cluster and all associated resources. **Careful here! Monk will not back up the storage of the instances it terminates**.

In case you'd like to create another cluster, follow this guide again or see: [Creating a cluster](guides/creating-a-cluster.md).

## What's next?

The cluster has 3 machines and it can do much more than just running one simple workload. Having your cluster up and running is enough to start trying [everything that Monk has to offer](features.md).

If you'd like to try a more advanced setup including a database, an HTTP server, and a self-made service, continue to our first A-Z tutorial: [Running a small system](guides/basic-app.md).
