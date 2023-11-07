---
title: "Inspect workloads"
---

When working with multiple containers running on a big cluster it's important to know what's where and how it performs. MonkOS provides simple but effective tools for inspecting and troubleshooting your workloads.

---

## What's running right now?

    monk ps

The `ps` command will show you all containers currently running in your cluster at any time.

## How does my workload look like?

    monk describe some/runnable

This will show a summary about a running workload, just like `monk run` would, but without re-running it.

## What was running?

    monk ps --all
    monk ps -a

The `ps `command with `--all` (`-a` for short) will list all containers, even the ones that were running but are currently not.

## How do I get logs?

    monk logs some/runnable
    monk logs -c <container-id> some/runnable

The `logs` command will show you the logs from any container, even the ones that are stopped. It's perfectly fine to just pass the runnable - monk will prompt show you a select if it detects more than one container.

## Streaming logs

    monk logs --follow some/runnable
    monk logs --follow -c <container-id> some/runnable

Use the `--follow` (or `-f`) option to stay get a continuous stream of logs from a running container.

## How do I get shell access?

    monk shell some/runnable
    monk shell -c <container-id> some/runnable

The `shell` command opens an interactive shell to any running container. It's perfectly fine to just pass the runnable - monk will prompt show you a select if it detects more than one container.

Use `exit` command in the shell to end the session.

## How do I get performance stats?

    monk stats

Will show the current CPU, memory, and disk usage of all containers running in the cluster.
---
title: "Run locally"
---

Running existing Kits with MonkOS is very straightforward. Running them locally is useful for testing and one-off deployments on single machines.

This short tutorial shows how to run Kits locally. We'll run MongoDB on Monk. Make sure you have Monk installed and `monkd` running. If not, follow [this guide &#8594;](../get-started/get-monk.md)

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

    curl https://us-east1-apt.pkg.dev/doc/repo-signing-key.gpg | sudo apt-key add
    echo 'deb https://us-east1-apt.pkg.dev/projects/monk-releases monk-releases-apt main' | sudo tee -a  /etc/apt/sources.list.d/artifact-registry.list
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
---
title: Publisher's Guide
---

# Publisher's Guide

This guide explains the publishing process from the technical standpoint. We are going into the nitty-gritty of how to publish and maintain a Monk Kit on MonkHub.

## Publishing to MonkHub

MonkHub hosts its contents publicly so that it stays available to all MonkOS instances in existence. Contents of the Hub are synced across all MonkOS instances every couple of minutes.
Once something is published to MonkHub it immediately becomes public and available to all MonkOS users.

MonkHub periodically pulls a set of public Git repos from different publishers and aggregates their contents. This means that having your Kit published on GitHub is basically enough to have it published on MonkHub.

In order to publish your software on MonkHub, you'll need to follow several steps:

1. Prepare your Kit - make sure it loads and runs without errors,
2. Add metadata - to make the Kit look good on the Hub,
3. Publish your Kit in a Git repo - so that its source is avaliable and MonkHub can pull it,
4. [Contact us](./about/support.md) to add your repo to MonkHub.
5. Your Kit will be published after a review from us.
6. Your Kit will be updated automatically whenever the default branch in your repo is updated.

## Preparing Your Kit
Even though any working Kit can be published to MonkHub, there are several steps that improve end-user experience and maintainability. We have detailed best practices below.

### Naming

Each Monk Kit lives in a `namespace` that identifies a company or a product to which the Kit belongs logically. It's good to decide on the name of your namespace and stick to it across all your Kits.

For example, if you're _ACME Corp._ and your primary product is called _foobar_, and you plan on publishing more products as Kits, you might want to define your namespace as:

```yaml title="acme.yaml"
namespace: acme

foobar: ...
```

This will result in MonkOS users see and refer to _foobar_ as `acme/foobar`. Add a new product called _dynamite_ and they'll know it as `acme/dynamite`.

Alternatively, if you only have one project called _gizmotron_ and identify by that name, you might want to define your namespace as follows:

```yaml title="gizmotron.yaml"
namespace: gizmotron

latest: ...
```

This, in contrast, will result in MonkOS users seeing names like `gizmotron/latest`, `gizmotron/v1.2.3`, `gizmotron/companion-database` etc.

You can choose either approach but the most important thing is to stick to your choice as changing namespaces will confuse the end-user.

### YAML Layout

#### Common Section

There are no technical limitations on how your YAML should look like as long as it is valid MonkScript. On the other hand, in our experience, defining common base for your runnables works well and helps to avoid verbose definitions.

See the following example:

```yaml title="gizmotron.yaml"
namespace: gizmotron

common:
    metadata:
        ...
    containers:
        app:
            image: docker.io/gizmotron
            ...
    ...

latest:
    defines: runnable
    inherits: gizmotron/common
    version: latest
    containers:
        app:
            image-tag: latest

```

`gizmotron/common` defines the basic structure of the runnable which might be bulky but it is not a runnable itself, i.e. it doesn't have `defines: runnable`. This means that there will not be a way to run such incomplete definition with `monk run gizmotron/common` and it will not be listed in MonkHub.

On the other hand, `gizmotron/latest` inherits common and overrides version, container image tag and other fields applicable to a concrete `gizmotron` variant. This definition has `defines: runnable` added so it will be listed in MonkHub as `gizmotron/latest`.

#### Group Variables

If your Kit features groups it is a good practice to expose variables in the group so that users can tune the underlying runnables without having to touch them directly.

Consider the following example:

```yaml title="gizmotron.yaml"
namespace: gizmotron

foo:
    defines: runnable
    containers:
        app:
            ...
            variables:
                admin-username:
                  env: ADMIN_NAME
                  type: string
                  value: "will_be_overriden"
                admin-password:
                  env: ADMIN_PASS
                  type: string
                  value: "will_be_overriden" 

# this defines foo complete with accompanying services meant for end-user consumption
complete-foo-setup:
    defines: process-group
    runnable-list:
        - gizmotron/foo
        - postgres/latest
        - redis/latest
    variables:
        admin-username: change me
        admin-password: change me, for real
```
This defines the `foo` component that will use default values `will_be_overriden` of variables if it won't be overriden by `complete-foo-setup` definition and make them environment variables named by `env` directives. 

By moving `admin-username` and `admin-password` to the `group` here, we have enabled the user to simply override the variables on the group and hid the details of `foo` itself.

The user will now run the complete `gizmotron/complete-foo-setup` with admin credentials of their choosing by simply doing:

```yaml title="user.yaml"
namespace: user

my-foo:
    inherits: gizmotron/complete-foo-setup
    variables:
        admin-username: king-of-the-hill
        admin-password: super secret password 123
```

### Kit Metadata

When making a Kit for internal use there's usually no need for adding metadata. When publishing your Kits to MonkHub it's good practice to add and keep metadata on all your runnables and groups. This can be easily achieved by just putting a single metadata definition in a `common` section described above.

Consider the following example:

```yaml title="gizmotron.yaml"
namespace: gizmotron

common:
  ...
  metadata:
    name: Gizmotron
    description: Open-source gizmotronic gizmo making gizmo that puts things on 🔥
    tags: comma, separated, list of tags
    website: gizmotron.io
    source: https://github.com/gizmotron-io/gizmotron
    publisher: Gizmotron Inc.
    icon: https://url.to/an/icon/for/gizmotron.png
    email: hello@gizmotron.io
    license: MIT
```

Above example shows the most useful metadata fields that you should put on all your runnables and groups. MonkHub will display Kit metadata according to this definition in its web UI. Those fields are also used in the CLI when listing and inspecting available Kits. Name, description and tags are used for search in MonkHub.

All metadata fields are optional and you can add any arbitrary field here, i.e.

```yaml
metadata:
    twitter: "@gizmotron"
    proprietary-gizmo-id: 42
```

### Container Images

MonkOS is able to pull container images from any public or private registry compatible with Docker. That being said, if a Kit is meant for public consumption all container images referenced by this Kit should also be publicly available to prevent end-users from having to supply container registry credentials upon running such Kit.

It is also a good practice to refer to container images by including the registry in image name i.e.:

```yaml
    image: gizmotron/foo           # bad
    image: docker.io/gizmotron/foo # good
```

## Preparing Your Repo

Now that you have a good Kit, the next step is to prepare a publicly available Git repo. You can use GitHub, GitLab or any other Git hosting of your choosing that allows for public repos.

Name of the repo is arbitrary and has no effect on MonkHub listing but we suggest using `monk-*` format i.e. `github.com/gizmotron/monk-gizmotron`, `github.com/acme/monk-dynamite` and keeping it in line with the chosen namespace.

If you don't want to host another repo you can use the main repo of your project and just put the required files in its top directory.

:::note

See an example published repo here: [https://github.com/monk-io/monk-chatwoot](https://github.com/monk-io/monk-chatwoot).

This repo showcases a number of good practices described in this document so be sure to check it out for inspiration :)

:::

### File Layout

The repo should contain at least three files in its top directory:

-   `README.md` - should contain an informative description of the Kit and a short guide on how to deploy it with Monk,
-   `kit.yaml` - this is the Kit itself, can be named after your namespace, eg. `gizmotron.yaml`
-   `MANIFEST` - this file lists all Kit files in load order, see below.

Of course, you can host multiple Kit files and build arbitrary directory structures as long as you adjust the `MANIFEST` accordingly.

Apart from the files above, you might want to include a `LICENSE` file containing the license under which you wish to distribute your Kit.

### MonkOS MANIFEST

MonkOS MANIFESTs are simple text files that are used by MonkOS to identify and load Kit files in correct order.

For example, if you just have one YAML file (`gizmotron.yaml`) in your repo `monk-gizmotron`, your `MANIFEST` should look like this:

```text title="MANIFEST"
REPO monk-gizmotron
LOAD gizmotron.yaml
```

If you have more than one file - list them in the order they should be loaded by Monk:

```text title="MANIFEST"
REPO monk-gizmotron
LOAD dependencies.yaml gizmotron.yaml
```

If you wish to store your Kit files in a sub-directory, you still need to place a `MANIFEST` in the repo's top level directory and point it to your sub-directory.

Consider the following directory structure:

```
repo/
    README.md
    LICENSE.md
    MANIFEST                    <-- top level MANIFEST
    kits/
        MANIFEST                <-- nested MANIFEST
        dependencies.yaml       <-- first Kit definition
        gizmotron.yaml          <-- second Kit definition
    resources/
        ...
    ...
```

The **top level `MANIFEST`** should point to `kits` and look like this:

```text title="MANIFEST"
REPO monk-gizmotron
DIRS kits
```

The `kits/MANIFEST` should then list the Kits in the load order:

```text title="kits/MANIFEST"
REPO monk-gizmotron
LOAD dependencies.yaml gizmotron.yaml
```

## Publishing Your Repo to MonkHub

The process is fully automated and requires no work on your side. Once you're ready to publish your repo to MonkHub just [drop us a line](./about/support.md) and we'll take care of the rest.

:::caution

In order to ensure high quality of Kits all contributions to MonkHub are considered on case-by-case basis and subject to review at any point.

:::

## Maintaining Your Kit
Once the initial setup has been completed and the repo is published to MonkHub the only thing left is to update the hosted Kit whenever you release a new version of your software or want to change the Kit itself.

:::caution

MonkHub will pull your changes whenever the default branch of your Git repo changes so anything committed or merged to `main` goes live within 10 minutes. For this reason we strongly advise to keep the write access limited to a small group of trusted people. Outside contributions to the Kit should be screened for potential bugs and security issues before merging them to the main branch.

:::

### Versioning Your Software

Monk Kits are immutable, meaning that any update to the existing Kit actually becomes another Kit under the hood. Users running a certain version of your Kit will keep running it until they decide to update their copy with `monk update` command. Even though this is the case, versioning your Kits makes it easier for the end user to pick a specific version of it as a dependency and enables easy downgrades.

MonkScript supports inheritance - it can be used to define multiple versions and variants of a Kit without much repetition. Each new version of a `runnable` or `group` can refer to previous version using the `inherits` directive just override version specific fields incrementally. This pattern works well with the [Common section pattern](#common-section).

Consider the following example:

```yaml title="gizmotron.yaml"
namespace: gizmotron

common:
    containers:
        app:
            image: docker.io/gizmotron
    ...

v1.0.0:
    defines: runnable
    inherits: ./common
    version: 1.0.0
    containers:
        app:
            image-tag: v1.0.0

latest:
    defines: runnable
    inherits: ./v1.0.0
```

:::note

Since MonkOS v3.4.0 `defines` key is only mandatory  within runnable and process-group, no need to put defines elsewhere!

:::


Here we have a `v1.0.0` definition, which inherits `gizmotron/common` and overrides the `image-tag` of the container. This `gizmotron/v1.0.0` will start a container `app` from image `docker.io/gizmotron:v1.0.0`. The `version` field is used to display human readable version in MonkHub and CLI listings. Additionally, `gizmotron/latest` is defined to be equivalent to `gizmotron/v1.0.0`.

Now let's suppose we want to add another version of Gizmotron to this Kit:

```yaml title="gizmotron.yaml"
namespace: gizmotron

common:
    containers:
        app:
            image: docker.io/gizmotron
    ...

v1.0.0:
    defines: runnable
    inherits: ./common
    version: 1.0.0
    containers:
        app:
            image-tag: v1.0.0

v2.0.0:
    defines: runnable
    inherits: ./v1.0.0
    version: 2.0.0
    containers:
        app:
            image-tag: v2.0.0

latest:
    defines: runnable
    inherits: ./v2.0.0
```

Assuming that only the underlying container image has changed from `v1.0.0` to `v2.0.0` that's all we have to do. `gizmotron/latest` now points to `gizmotron/v2.0.0` but `gizmotron/v1.0.0` is still available and unchanged. You can make other changes and overrides in each version and decide if you want to inherit the previous version or just start from `common` depending on what you want to achieve. The same mechanism applies if you want to add different variants or _flavors_ of any particular version.

#### Multiple Versions in Separate Files

Technique described above also works if you want to keep your versions in separate YAML files as long as you keep all definitions under the same namespace and you remember to update your [`MANIFEST` file](#monk-manifest).

Splitting separate versions into separate files might help to keep the definitions clean and works well in scenarios where you want to generate Kits programmatically as a part of your CI process for example.

Consider the following filesystem layout:

```
repo/
    MANIFEST
    common.yaml
    v1.0.0.yaml
    v2.0.0.yaml
    latest.yaml
```

Contents of these files are just obtained by splitting the previous example:

```yaml title="common.yaml"
namespace: gizmotron

common:
    containers:
        app:
            image: docker.io/gizmotron
    ...
```

```yaml title="v1.0.0.yaml"
namespace: gizmotron

v1.0.0:
    defines: runnable
    inherits: ./common
    version: 1.0.0
    containers:
        app:
            image-tag: v1.0.0
```

```yaml title="v2.0.0.yaml"
namespace: gizmotron

v2.0.0:
    defines: runnable
    inherits: ./v1.0.0
    version: 2.0.0
    containers:
        app:
            image-tag: v2.0.0
```

```yaml title="latest.yaml"
namespace: gizmotron

latest:
    defines: runnable
    inherits: ./v2.0.0
```

The `MANIFEST` file should then look as follows:

```text title="kits/MANIFEST"
REPO monk-gizmotron
LOAD common.yaml v1.0.0.yaml v2.0.0.yaml latest.yaml
```

In case you want to generate the version files programmatically, you just need to produce a new `vx.y.z.yaml` file using string templating, then update `latest.yaml` to point to the new version and finally append the name of your new file to the `LOAD` list in the `MANIFEST`.
---
title: "Add Infrastructure"
---

With Monk you can [grow your cluster manually](../lifecycle/cluster-create-1.md) by issuing the `grow` command. This is not the only way to add instances to your cluster as the Kits can also carry instructions instance definitions. Monk will create instances when running a Kit containing such a definition.

---

## Requirements

You need to create a cluster or join already existing cluster in order to deploy your runnable with embedded instances.

:::note

Please follow [this guide](../lifecycle/cluster-create-1.md) if you need to create a new cluster.

:::

## Defining nodes

Any runnable can define `nodes` like this:

```yaml linenums="1"
namespace: foos

foo:
    defines: runnable

    nodes:
        my-node:
            provider: gcp
            tag: my-magical-cluster
            instance-type: n1-standard-1
            region: us-central1
            disk-size: 128

    affinity:
        name: my-node

    containers:
        some-service:
            image: some/image
            image-tag: latest
```

When running `foos/foo`, MonkOS will create an instance named `my-node` using the GCP provider if it's available. The `some-service` container will be then scheduled to run on that new instance thanks to the `affinity` directive.

### Nodes section

The `nodes` definition is applicable in any `runnable`.

```yaml linenums="1"
my-node:
    provider: gcp
    tag: auto-grown
    instance-type: n1-standard-1
    region: us-central1
    disk-size: 128
```

The fields here match the arguments in the [`monk grow` command](../cli/monkd.md).

## Instance affinity

Use `affinity` field in runnable definition in order to tell MonkOS where to start this runnable.

```yaml linenums="1"
affinity:
    name: my-instance
```

Using `name` will look for a concrete instance by name and pin the runnable there so it always run on that instance.

```yaml linenums="1"
affinity:
    tag: some-tag
```

Using `tag` will look for any instance with the specified tag and pin the runnable on that instance.
Both can be used at the same time but `name` takes precedence.
---
title: "Readiness & Dependency Checks"
---

# Readiness & Dependency Checks

Sometimes you want to delay start of your application until you are sure that your application is ready to serve traffic.  
MonkOS comes with a readiness checks that will basically perform some tests to check if application is up and running.

## Readiness

Using combination of MonkOS functions and readiness checks we can create custom `checks` associated with any `runnable`. Currently the only special check is `readiness`, which is connected with `depends` clause. This check allows the defining `runnable` to determine and advertise its status to other runnables which may use `depends` to wait for it to be ready.

Whenever a `readiness` check fails (returns `false` or an error), MonkOS will report an error when trying to run other runnables that depend on it.

By default, when no `readiness` check is specfied all runnables are considered to be ready immediately after starting.

Let's learn how to define a `readiness` check.

### Definition

Lets have a look at full definition of readiness:

```yaml
readiness:
    code: <Arrow script code>
    period: <time in seconds>
    initialDelay: <time in seconds>
    attempts: <number of max retries>
```

`code` - is the place where we will put our Arrow script to check readiness, 
`period` - specifies how often (in seconds) MonkOS will perform this check, 
`initialDelay` - initial delay (in seconds) before MonkOS will start checking application health,
`attempts` - specifies how many times (max) to perform this check until MonkOS decides that application
didn't start properly, default is 10.

### Example

Lets have a look at following example:

```yaml
namespace: readiness

common:
    containers:
        fooc:
            image: alpine
            image-tag: latest
            bash: sleep 3600

bar:
    defines: runnable
    inherits: ./common
    checks:
        readiness:
            code: |
                exec("fooc", "ps", "-ef") "sleep" contains?
            period: 15
            initialDelay: 5
```

In this example we have defined one 'common' container that we can re-use in our application, it is just simple alpine image that will run for 1h.  
As next step we have defined a `bar` runnable that will inherit our common `alpine` image and additionally it will have readiness check defined.  
Combining power of monk script a [exec](../monkscript/scripting/operators/containers#exec) function and [contains](../monkscript/scripting/operators/boolean#contains-has) function we check if `sleep` process is running.

## Dependency

Any `runnable` can define its runtime dependencies using a `depends` section. In this section we define which other runnables the given runnable is waiting for before starting. MonkOS will report an error if all dependencies are not met i.e. is any of the listed `runnables` is not running or its `readiness` check fails after specified period.

### Definition

Lets have a look at full definition of dependency checks:

```yaml
depends:
    wait-for:
        runnables:
            - <a runnable path to wait for>
            - ...
        timeout: <time in seconds to wait for all runnables to be ready>
```

### Example

We will expand our example from before a little bit. To our readiness check we will add another runnable that will depend on the one that needs to be 'healthy'. We will do that using `wait-for` definition:

```yaml
namespace: readiness

common:
    containers:
        foo:
            image: alpine
            image-tag: latest
            bash: sleep 3600

bar:
    defines: runnable
    inherits: ./common

    checks:
        readiness:
            code: |
                exec("foo", "ps", "-ef") contains?("sleep")
            period: 60
            initialDelay: 5
            attempts: 5

baz:
    defines: runnable
    inherits: ./common

    depends:
        wait-for:
            runnables:
                - ./bar
            timeout: 30

group:
    defines: process-group
    runnable-list:
        - /readiness/bar
        - /readiness/baz
```

We've added here our simple dependency using:

```yaml
depends:
    wait-for:
        runnables:
            - ./bar
        timeout: 30
```

This means that our `baz` runnable will wait 30 seconds for `bar` to start. If it doesn't monk will return error.
---
title: "Add Dynamic Configuration"
---

MonkOS offers a convenient way to pass arbitrary text files (such as config files) to any container from the Kit level. Such files can be generated on the fly at container startup making it easy to create dynamic configuration for services based on MonkOS variables.

## Nginx example

Let's take an nginx Kits as an example and analyze how nginx configuration is passed to the container:

```yaml title="nginx.yaml" linenums="1"
namespace: nginx
reverse-proxy:
    defines: runnable

    containers:
        nginx-reverse-proxy:
            image-tag: latest
            ports: <- `0.0.0.0:${listen-port}:${listen-port}/tcp`
            image: bitnami/nginx

    variables:
        server-name: www.example.com
        listen-port: 8080
        proxy-target-host: google.com
        proxy-target-port: 80

    files:
        server-def:
            container: nginx-reverse-proxy
            path: /opt/bitnami/nginx/conf/server_blocks/reverse_proxy.conf
            mode: 511
            contents: |
                server {
                    listen 0.0.0.0:{{ v "listen-port" }};
                    server_name {{ v "server-name" }};
                    location / {
                        proxy_pass http://{{ v "proxy-target-host" }}:{{ v "proxy-target-port" }};
                    }
                }
```

Above example defines a basic nginx container that doesn't have any specific config inside by default.

In order to insert the config file `/opt/bitnami/nginx/conf/server_blocks/reverse_proxy.conf` defining a reverse proxy configuration, one could prepare a new container image based on `bitnami/nginx` and have the file set up as a part of the image. This approach comes with a disadvantage of having to prepare and build the image, which in turn means that all the values have to be known at build time.

MonkOS solves this issue by allowing to specify a `files` section in any `runnable`.

### File definition

In the above example we have defined one file `server-def` which specifies:

`container`
put the file in `nginx-reverse-proxy` of the runnable,

`path`
put the file under `/opt/bitnami/nginx/conf/server_blocks/reverse_proxy.conf` path **within** the container,

`mode`
set the file permissions to octal `511`,

### File contents

The `content` field contains what will be the file contents once it is created inside the container. Those contents could be any static text which would be put into the file verbatim, or some text templating can be used as shown in the above example.

### Templating

MonkOS currently uses a very simple templating syntax which allows for placing

    {{ v "variable-name" }}

blocks anywhere in the file contents. These blocks are replaced with variable contents **at runtime** when the container specified in the file definition is starting.

For example the line:

    listen 0.0.0.0:{{ v "listen-port" }};

will turn into:

    listen 0.0.0.0:8080;

as the `listen-port` variable specified in the `variables` section of the runnable currently has value of `8080`.

## Overriding configuration contents

### Re-using Kit contents

Assuming you'd like to run nginx reverse proxy with custom settings, you could just override variables like so:

```yaml title="my-proxy.yaml" linenums="1"
namespace: guides

my-proxy:
    defines: runnable
    inherits: nginx/reverse-proxy
    variables:
        server-name: my-service
        proxy-target-host: <- get-hostname("guides/database", "database")
        proxy-target-port: 9090
```

Running this Kit would result in having an nginx container with the following configuration in its `reverse_proxy.conf`:

```conf title="reverse_proxy.conf" linenums="1"
server {
    listen 0.0.0.0:8080;
    server_name myservice.com
    location / {
        proxy_pass http://10.1.0.23:9090;
    }
}
```

Notice how the proxy target address was computed dynamically and placed into the right place in the configuration. This is a very powerful feature allowing for re-use of config files at the Kit level.

### Re-defining the contents

Let's say you need to provide more tweaks to the provided reverse-proxy config file. It can be easily achieved by overriding the `contents` field.

Let's add websocket support to the reverse proxy Kit we have:

```yaml title="my-nginx.yaml" linenums="1"
namespace: my-nginx

reverse-proxy-with-sockets:
    defines: runnable
    inherits: nginx/reverse-proxy
    files:
        server-def:
            contents: |
                server {
                    listen 0.0.0.0:{{ v "listen-port" }};
                    server_name {{ v "server-name" }};
                    location / {
                        proxy_pass http://{{ v "proxy-target-host" }}:{{ v "proxy-target-port" }};

                        proxy_http_version 1.1;
                        proxy_set_header Upgrade $http_upgrade;
                        proxy_set_header Connection "Upgrade";
                        proxy_set_header Host $host;

                    }
                }
```

We've just extended the configuration by replacing the file contents with new contents containing nginx options to allow for proxying websocket connections. The rest of the `reverse-proxy-with-sockets` is identical to the `nginx/reverse-proxy` and can be used in place of it.

## Conclusion

Working with configuration files at Kit level gives a lot of control over configuration contents and enables re-use of common configuration patterns.
---
title: "Define Entities"
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

Entities are custom resources that allow everybody to extend MonkOS with their own data structures and logic.

---

## Define a new Entity

Suppose we want to have a Person type, it will be used to store information about
people.

Declare type:

```yaml title="type.yaml" linenums="1"
namespace: guides

person:
  defines: entity
  schema:
    name:
      type: string
    role:
      type: string
    age:
      type: integer
    org:
      type: object
      properties:
        organizationName:
          type: string
        organizationUnit:
          type: string
```

Key part is defines: entity which indicates that this is a new Entity type.

Also, we have here the schema property that describes entity structure. Schema format is similar to Swagger or OpenAPI
and follows [JSON Schema specification](https://json-schema.org/learn/).

An entity type can be loaded with `monk load type.yaml`:

Then we can define several resources that use the Person type:

```yaml title="people.yaml" linenums="1"
namespace: guides

john:
  defines: guides/person
  name: John D
  role: Accounting
  age: 27

lucy:
  defines: guides/person
  name: Lucy L
  role: Management
  org:
    organizationName: C corp
```

Now we can use MonkOS CLI to work with our custom Entity:

    # load template
    monk load people.yaml
    
    # run
    monk run guides/john
    
    # ps to see list of resources
    monk ps
    
    # describe to show a single entity
    monk describe guides/john
    
    # stop
    monk stop guides/john
    
    # edit templates and apply changes
    monk load type.yaml entities.yaml
    monk update guides/john
    
    # remove entity and delete template
    monk delete guides/john
    
    # remove entity type
    monk delete guides/person

This example already extends MonkOS API, but it is not doing much, apart from storing
and retrieving structured data. We have to write Lifecycle scripts to apply custom logic.

## Lifecycle scripts

Scripts are written in JavaScript and can be inlined in Entity type.

Considering our example, let’s add some validation and logging to create lifecycle:

```yaml title="type.yaml" linenums="1"
namespace: guides

person:
  defines: entity
  schema:
    ...
  lifecycle:
    create: |
      function main(obj) {
        if (obj.age !== undefined && obj.age < 16) {
           throw new Error("minimum age for employment is 16");
        }
        console.log(obj.name, obj.role);
      }
```

:::note

You can use `<<<` to embed content from an external file: `create: <<< foo.json`.

:::

JS script has to contain a _main_ function that receives up to 3 arguments and optionally returns an object as a result.

```javascript
function main(definition, state, context) {
    return {"lastUpdate": Date.now()};
}
```

Arguments are 3 objects:

1. **definition** - entity data, as defined in template.
2. **state** - saved data that was returned in previous executions, could be empty.
3. **context** - additional data with properties:
    1. **action** - current action, e.g. _create_, _start_, _update_, _purge_
    2. **status** - current entity status, e.g. _stopped_, _running_
    3. **path** - full template path for entity.
    4. Context for custom properties also contains additional arguments in **args** property.

Returned object is saved as state and will be passed to the next operations with this Entity.

:::note

You don't have to return new state for every action. If you do — it replaces previously saved data.

:::

You can use **throw** to terminate command execution from JS at any point.

MonkOS JS Runtime supports most of the native JS functions,
but it doesn't have access to browser features or file system.

Here's a list with some JS methods:

* `JSON.parse()`, `JSON.stringify()` - encode/decode JSON strings.
* `btoa()`, `atob()` - encode/decode base64 strings, this method accepts Unicode.
* `console.log()` - print value to monkd logs.
* `Math`, `Date`, `Map`, etc

### Available lifecycle targets

You can define any of them depending on what commands you need:

* **create** - triggered with first `monk run`, which also triggers **start**.
* **start** - triggered with every `monk run` or `monk update`.
* **update** - triggered with `monk update`, which also triggers **start**.
* **stop** - triggered with `monk stop`.
* **purge** - triggered with `monk purge` when resource is being removed.
* **sync** - triggered for any command that has no explicit script.

### Custom lifecycle actions

Besides standard create/update/delete lifecycle you can define any other verb as an action and use it with your own
arguments:

```yaml title="type.yaml" linenums="1"
namespace: guides

person:
  defines: entity
  schema:
    ...
  lifecycle:
    hello: |
      let cli = require("cli");
      function main(obj) {
        cli.output("hello", obj.name);
      }
```

Use it with do command (you need to run your entity first):

    monk run guides/john
    
    monk do guides/john/hello
    ...
    ✔ Executing entity hello script for templates/local/guides/john DONE
    ✔ Hello John D DONE

You can use single sync lifecycle to process custom actions — do it by assigning empty string for your action name:

```yaml title="type.yaml" linenums="1"
namespace: guides

person:
  defines: entity
  schema:
    ...
  lifecycle:
    sync: <<< sync.json
    hello: ""
    bye: ""
```

## Readiness & dependency checks

Lefecycle scripts are meant to return fast, but some Entities may take time to become available after `monk run`.
MonkOS comes with readiness checks that can perform tests to check if Entity is up and running.

:::note

See [this guide to learn](readiness-and-dependency-checks.md) how readiness and dependency work in detail.

:::

### Readiness

Readiness check is written in JavaScript. To fail check, you need to throw error at any point.

```yaml title="type.yaml" linenums="1"
namespace: guides

person:
  defines: entity
  checks:
    readiness:
      code: |
        function main(def, state, ctx) {
          throw "not ready";
        }
      initialDelay: 5   
```

Check can return state to be saved like any other lifecycle action.

```yaml title="type.yaml" linenums="1"
checks:
  readiness:
    code: |
      function main(def, state, ctx) {
        state.ready = true;
        return state;
      }
```

If code is empty and Entity has `sync` method defined, then `sync` is going to be called instead.
Context action will be **check-readiness**.

Example:

```yaml title="type.yaml" linenums="1"
namespace: guides

person:
  defines: entity
  checks:
    readiness:
      initialDelay: 15
      period: 10
      attempts: 12
  lifecycle:
    sync: |
      function main(def, state, ctx) {
         switch (ctx.action) {
            case "create":
              // create logic
              break;
            case "purge":
              // purge logic
              break;
            case "check-readiness":
              // readiness check logic
              break;
            default:
              // no action
              return;
         }
      }
```

### Dependency

Entities can depend on each other being available, they can also depend on Runnable, or vice versa.

```yaml title="people.yaml" linenums="1"
namespace: guides

john:
  defines: guides/person
  name: John D
  depends:
    wait-for:
      runnables:
        - guides/lucy
      timeout: 120

john-runnable:
  defines: runnable
  depends:
    wait-for:
      runnables:
        - guides/john
      timeout: 60
  containers:
    operator:
      image: your-image/test:webhook
```

## Require modules

MonkOS has a number of modules. You can use them by requiring modules in _requires_ property:

```yaml title="type.yaml" linenums="1"
namespace: guides

person:
  defines: entity
  requires:
    - cloud/aws
    - http
  lifecycle:
    create: |
      function main() {
        res = http.get("https://api.ipify.org");
        if (res.error) {
          throw res.error;
        }
        return {"ip": res.body};
      }
```

Or require module directly from JS script:

```javascript
let http = require("http");

function main(definition, state, context) {
    let res = http.get("https://api.ipify.org");
    if (res.error) {
        throw res.error;
    }
    return {"ip": res.body};
}
```

Available modules:

:::note

Require works only with modules that are implemented in Monk, see full list below.  
But you can use native JS functions like JSON, Math, etc.

:::

* cli
* secret
* fs
* parser
* http
* cloud/digitalocean
* cloud/aws
* cloud/gcp
* cloud/azure

### Module CLI

The module implements methods to work with MonkOS CLI.

Currently, it has only 1 method `output` that prints passed parameters to console.

Usage:

```javascript
let cli = require("cli");

cli.output("Test", "one");
```

The console will show it as:

      ✔ Test one DONE

### Module Secret

The module implements methods to work with MonkOS Secrets.

It has the following methods:

* `get` - get Secret value by name.
* `set` - set Secret value.
* `remove` - delete Secret.
* `randString` - generate random string.

Usage:

```javascript
let secret = require("secret");

// get Secret value
let password = secret.get("mypassword");

// update Secret value
secret.set("mypassword", secret.randString(12))

// delete Secret
secret.remove("mypassword")
```

Secrets have scope of the Entity where they are used.

To use Secrets with global scope, define them in **permitted-secrets** property:

```yaml title="john.yaml" linenums="1"
namespace: guides

john:
  defines: guides/person
  ...
  permitted-secrets:
    my-global-secret-name: true
```

### Module FS

The module implements methods to work with embedded files. It uses virtual filesystem with readonly access.

Module has the following methods:

* `ls` - returns array of filenames in the given path, dirs names end with "/".
* `readFile` - returns file content.
* `zip` - archive as zip.
* `tar` - package as tar.

Files can be added in **files** property.

:::note

You can use `<<<` macro [to paste contents from a local file](/docs/monkscript/yaml/index.md#file-embeds).

:::

Example:

```yaml title="john.yaml" linenums="1"
namespace: guides

john:
  defines: guides/person
  ...
  files:
    interests:
      path: interests.txt
      contents: "Animal lover, Astrology"
    bio:
      path: biography.txt
      contents: <<< bio.txt
```

Usage:

```javascript
let fs = require("fs");

// list files from root dir
let res = fs.ls();

// read file and return content
let data = fs.readFile("biography.txt");

// zip all files
let zipdata = fs.zip(".");

// zip files with given path
let zipdata = fs.zip("biography.txt", "interests.txt");

// tar all files
let tardata = fs.tar(".");
```

### Module Parser

The module implements methods to parse value from text documents.

Module has the following methods:

* `xmlquery` - parse XML documents.
* `jsonquery` - parse JSON documents.
* `htmlquery` - parse HTML documents.

Methods accept 2 strings: document and query with XPath expression.

Returned value is a list for most of the queries,
with the exceptions that return scalar values: XML methods like `count`, `concat`, `sum`.

Usage:

```javascript
const parser = require("parser");

// get values by selector
let title = parser.xmlquery(def.data, "//channel/title")[0];
let titles = itemTitles = parser.xmlquery(def.data, "//item/title");

// get attirubute value of a second item
let itemId = parser.xmlquery(def.data, "//item[2]/@id")[0];

// get number of all items
let count = parser.xmlquery(def.data, "count(//item)");

// JSON - get all prices that are greater than value
let prices = parser.jsonquery(def.data, "//price[.>21]");

// HTML - parse header h1 and all h2 text values
let h1 = parser.htmlquery(def.data, "//header/h1")[0];
let h2List = parser.htmlquery(def.data, "//h2");

// HTML - parse all link href values
let hrefs = parser.htmlquery(def.data, "//a/@href");
```

### Module HTTP

The module implements an HTTP REST client with methods `get`, `put`, `post`, `delete`, `do`.

All methods require passing **url** as the first argument and accept optional parameters: **headers**, **object**, *
*body** string, **timeout** in seconds.

The result is an object with properties:

* **status** - full response status e.g. "200 OK"
* **statusCode** - integer code
* **headers** - response headers object
* **body** - response body string
* **error** - contains error string if the request failed.

Usage:

```javascript
// simple get
res = http.get("https://api.ipify.org");

// put with headers, body, timeout
res = http.put(url, {
    "headers": {"authorization": "bearer xyz"},
    "body": `{"test": "val"}`, "timeout": 10
});

// do request with the provided method in parameters
res = http.do(url, {"method": "PATCH"});

// handle response error
if (res.error) {
    throw res.error;
}

// parse response body as json
parsed = JSON.parse(res.body);

// log result object to monkd.log as an encoded string
console.log(JSON.stringify(res));
```

### Module DigitalOcean

This module implements an HTTP client for DigitalOcean API.

:::note

Using digitalocean module requires you to have [DO provider credentials](../improve/cloud-provider.md) in your cluster.

:::

Methods and usage are the same as http module: `get`, `put`, `post`, `delete`, `do`. Authorization token will be
added to all requests that are made with this module.

Usage:

```javascript
let digitalocean = require("cloud/digitalocean");

function main(definition, state, context) {
    let res = digitalocean.get("https://api.digitalocean.com/v2/account");
    if (res.error) {
        throw res.error;
    }
    return {"body": res.body};
}
```

### Module GCP

This module implements an HTTP client for Google Cloud Platform API. All requests are authorized
with `https://www.googleapis.com/auth/cloud-platform` scope if provider credentials allow it.

:::note

Using gcp module requires you to have [GCP provider credentials](../improve/cloud-provider.md) in your cluster.

:::

Methods are the same as http module: `get`, `put`, `post`, `delete`, `do`.
There is also `getProject` method that returns project name from provider credentials.

Usage:

```javascript
let gcp = require("cloud/gcp");

function main(definition, state, context) {
    let url = "https://compute.googleapis.com/compute/v1/projects/" + gcp.getProject();
    let res = gcp.get(url);
    if (res.error) {
        throw res.error;
    }

    return {"body": res.body};
}
```

### Module AWS

Thies module implements an HTTP client for AWS API.

:::note

Using aws module requires you to have [AWS provider credentials](../improve/cloud-provider.md) in your cluster.

:::

Methods are the same as http module: `get`, `put`, `post`, `delete`, `do`, but each method additionally requires
**service** and **region** properties.

There is also a `presign` method that returns signed URL and headers for a given request and expiration time.

Usage:

```javascript
let aws = require("cloud/aws");

createBucket = function (name, region) {
    return aws.put("https://" + name + ".s3.amazonaws.com", {
        "service": "s3",
        "region": region,
        "headers": {"x-amz-acl": "public-read"}
    });
}

function main(definition) {
    let res = createBucket(definition.name, definition.region);
    if (res.error) {
        throw new Error(res.error);
    }
}
```

### Module Azure

This module implements an HTTP client for Microsoft Azure API.

:::note

Using azure module requires you to have [Azure provider credentials](../improve/cloud-provider.md) in your cluster.

:::

Methods are the same as http module: `get`, `put`, `post`, `delete`, `do`.
There are also `getTenant()`, `getSubscription()`, `getResourceGroup()` methods
that return info from provider credentials.

Usage:

```javascript
let azure = require("cloud/azure");

function main(definition, state, context) {
    let url = "https://mytestaccount.blob.core.windows.net/?comp=list";
    // storage has to use at least 2017-11-09 version to work with OAuth token
    let res = azure.get(url, {headers: {"x-ms-version": "2017-11-09"}});
    if (res.error) {
        throw res.error + ", body: " + res.body;
    }
    // print result to monkd logs
    console.log(res.body);
}
```

## Webhook lifecycle

If your logic needs a lot of dependencies, or you don't want to write JavaScript code, you can register webhook url of
your own service. In this case, MonkOS will send request for each lifecycle event and will expect a response with updated
Entity state.

     lifecycle:
       sync:
         url: "https://your-webhook-address.com/path-to-url"

Request is JSON with **definition**, **state**, **context**, the same properties as _main_ function in JS code. Response
can contain **state** object and **output** (list of strings) that will be printed to console.

Example of Entity type and webhook server runnable:

```yaml title="webhook.yaml" linenums="1"
namespace: guides

foo:
  defines: entity
  depends:
    wait-for:
      runnables:
        - guides/foo-operator
      timeout: 60
  schema:
    first-url:
      type: string
    second-url:
      type: string
  lifecycle:
    sync:
      url: <- "http://" peer-ip-address("guides/foo-operator") ":8090/" concat-all

foo-operator:
  defines: runnable
  containers:
    operator:
      image: your-image/test:webhook
      ports:
        - 8090:8090
```

Then, load and run an Entity like the one below to trigger webhook requst:

```yaml title="beep.yaml" linenums="1"
beep:
  defines: guides/foo
  first-url: https://wikipedia.com
  second-url: https://example.com
```

Webhooks don't stop you from using inlined JavaScript: an Entity can define JS script for some action,
and for that lifecycle it will be called instead of webhook url.

```yaml
  lifecycle:
    create: |
      function main() {
        let res = http.get("https://api.ipify.org");
        if (res.error) {
          throw res.error;
        }
        return {"ip": res.body};
      }
    sync:
      url: "https://your-webhook-address.com/path-to-url"
```

If you want to define custom action for the Entity with webhook logic,
you can do it by assigning empty string to your action name:

     lifecycle:
       do-something: ""
       sync:
         url: "https://your-webhook-address.com/path-to-url"

Call it like this to send a request to webhook server with custom arguments:

      monk do guides/beep/do-something your-arg=value

Webhook server example written in Go:

```go
package main

import (
	"encoding/json"
	"net/http"
	"time"
)

type webhookContext struct {
	Status string            `json:"status"`
	Action string            `json:"action"`
	Path   string            `json:"path"`
	Args   map[string]string `json:"args"`
}

type webhookRequest struct {
	Definition map[string]interface{} `json:"definition"`
	State      map[string]interface{} `json:"state"`
	Context    webhookContext         `json:"context"`
}

type webhookResponse struct {
	Output []string               `json:"output,omitempty"`
	State  map[string]interface{} `json:"state,omitempty"`
}

func webhook(w http.ResponseWriter, r *http.Request) {
	decoder := json.NewDecoder(r.Body)
	var req webhookRequest
	err := decoder.Decode(&req)
	if err != nil {
		panic(err)
	}

	state, err := json.Marshal(req.State)
	if err != nil {
		panic(err)
	}

	resp := new(webhookResponse)
	resp.Output = []string{"ACTION " + req.Context.Action, "PREV STATE " + string(state)}
	resp.State = map[string]interface{}{
		"lastTime": time.Now().String(),
	}

	data, err := json.Marshal(resp)
	if err != nil {
		panic(err)
	}

	_, err = w.Write(data)
	if err != nil {
		panic(err)
	}
}

func main() {
	http.HandleFunc("/", webhook)
	err := http.ListenAndServe(":8090", nil)
	if err != nil {
		panic(err)
	}
}
```

## Examples: AWS S3 Bucket Entity

Let's implement a new Entity to manage AWS S3 bucket.
It will allow us to create new Buckets and upload files using Monk.

First, we have to declare the Bucket type with create/delete lifecycle and additional **presign** method:

```yaml title="objectstorage.yaml" linenums="1"
namespace: guides

aws-bucket:
  defines: entity
  schema:
    required: [ "name", "region" ]
    name:
      type: string
    region:
      type: string
  requires:
    - cloud/aws
  lifecycle:
    create: |
      let createBucket = function(name, region) {
        return aws.put("https://"+name+".s3.amazonaws.com", {"service": "s3", "region": region, "headers": {"x-amz-acl": "public-read"}});
      }

      function main(definition) {
        let res = createBucket(definition.name, definition.region);
        if (res.error) {
          throw new Error(res.error);
        }
      }
    purge: |
      deleteBucket = function(name, region) {
        return aws.delete("https://"+name+".s3.amazonaws.com", {"service": "s3", "region": region});
      }

      function main(definition) {
        let res = deleteBucket(definition.name, definition.region);
        if (res.error) {
          throw new Error(res.error);
        }
      }
    presign: |
      var cli = require("cli");

      presignUpload = function(name, region, path) {
        return aws.presign("https://"+name+".s3.amazonaws.com" + path,
           {"method": "PUT", "expire": "5m", "service": "s3", "region": region,
            "headers": {"x-amz-acl": "public-read"}});
      }

      function main(definition, state, context) {
        let {url, headers} = presignUpload(definition.name, definition.region, context.args.path);
        cli.output("Pre-signed URL:", decodeURI(url))
        if (headers) {
          cli.output("Pre-signed headers", JSON.stringify(headers));
        }
      }
```

We declared guides/aws-bucket type with 2 properties in schema: **name** and **region**.

Lifecycle has only 2 events: create a bucket using AWS API on Entity create, remove it on delete.

Custom action **presing** returns upload url with authorization to upload to our Bucket.

Now, let's add Entity definition for an actual bucket,
keep in mind that AWS requires it to have a globally unique name:

```yaml title="mybucket.yaml" linenums="1"
mybucket:
  defines: guides/aws-bucket
  name: my-bucket-with-unique-name
  region: us-east-1
```

Then, we use MonkOS CLI to load and run templates:

      # load templates
      monk load objectstorage.yaml mybucket.yaml
      
      # run to trigger a "create" event
      monk run guides/mybucket

An empty bucket with public read access should be created in AWS,
available at:  
https://my-bucket-with-unique-name.s3.amazonaws.com/

Now we can use presign an url to upload some file to Bucket to desired location path.

      monk do guides/mybucket/presign path=/image.png

This commands prints to console signed url and headers:

      ...
      ✔ Pre-signed URL: https://my-bucket-with-unique-name.s3.amazonaws.com/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAUACQQXWL7VRHQCYH%2F20221222%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20221222T213534Z&X-Amz-Expires=300&X-Amz-SignedHeaders=host%3Bx-amz-acl&X-Amz-Signature=7a8dd9acf0752f6a3223d7d335b5daf9a3503b2bdf5447bdeb5bd46ab725b403 DONE
      ✔ Pre-signed headers {"x-amz-acl":["public-read"]} DONE

We can upload the actual file using _curl_ tool with parameters from a response to the previous command:

      curl -X PUT -T /path-to-file/image.png -H "x-amz-acl: public-read" "https://my-bucket-with-unique-name.s3.amazonaws.com.s3.amazonaws.com/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAUACQQXWL7VRHQCYH/20221222/us-east-1/s3/aws4_request&X-Amz-Date=20221222T194021Z&X-Amz-Expires=300&X-Amz-SignedHeaders=host&X-Amz-Signature=f215ef40722f2d967fd35453ed94cbf12508a929ed6b57fc7e13ccd08dc5f2de"

Now you should see uploaded image at your location:  
https://my-bucket-with-unique-name.s3.amazonaws.com/image.png.

We can upload many more files, but when we don't need this Bucket anymore,
we can delete it with `monk delete`:

      monk delete guides/mybucket

This should remove Entity from MonkOS and the Bucket resource from AWS.

## Examples: Cloud SQL Entity

In this example let's implement a new Entity to deploy Cloud SQL Database instances on Google Cloud Platform.

First, we'll define an Entity for the Cloud SQL Instance server.

```yaml title="cloud-sql-instance.yaml" linenums="1"
namespace: guides

# BEFORE RUNNING:
#  If not already done, enable the Cloud SQL Administration API
#  and check the quota for your project at
#  https://console.developers.google.com/apis/api/sqladmin
cloud-sql-instance:
  defines: entity
  schema:
    required: [ "name" ]
    name:
      type: string
    database-version:
      type: string
      default: "POSTGRES_14"
    tier:
      type: string
      default: "db-f1-micro"
    region:
      type: string
      default: "us-central1"
    allow-all:
      type: bool
  requires:
    - cloud/gcp
  lifecycle:
    create: |
      var createInstance = function(project, def) {
        let body = {
          name: def.name,
          databaseVersion: "POSTGRES_14",
          region: "us-central1",
          settings: {
            tier: "db-f1-micro",
          }
        };

        if (def.tier) {
           body.settings.tier = def.tier;
        }

        if (def["allow-all"]) {
           body.settings.ipConfiguration = {
             authorizedNetworks: [{name: "unsafe-allow-all", value: "0.0.0.0/0"}]
           }
        }

        if (def.region) {
           body.region = def.region;
        }

        if (def["database-version"]) {
           body.databaseVersion = def["database-version"];
        }

        return gcp.post("https://sqladmin.googleapis.com/sql/v1beta4/projects/"+
          project+"/instances", {"body": JSON.stringify(body)});
      }

      function main(def, state, ctx) {
        let res = createInstance(gcp.getProject(), def);
        console.log(JSON.stringify(res));
        if (res.error) {
          throw new Error(res.error + ", body: " + res.body);
        }
        return {"statusCode": res.statusCode};
      }
    purge: |
      var deleteInstance = function(project, name) {
        return gcp.delete("https://sqladmin.googleapis.com/sql/v1beta4/projects/"+project+
          "/instances/"+name);
      }

      function main(def, state, context) {
        let res = deleteInstance(gcp.getProject(), def.name);
        console.log(JSON.stringify(res));
        if (res.error) {
          throw new Error(res.error + ", body: " + res.body);
        }
      }
```

One instance can have many databases, so next we will define
an Entity to initialize new Databases.

```yaml title="cloud-sql-database.yaml" linenums="1"
namespace: guides

cloud-sql-database:
  defines: entity
  schema:
    required: [ "instance", "name" ]
    instance:
      type: string
    name:
      type: string
  requires:
    - cloud/gcp
  lifecycle:
    create: |
      var createDatabase = function(project, instance, name) {
        let body = {
          name: name
        };

        return gcp.post("https://sqladmin.googleapis.com/sql/v1beta4/projects/"+
          project+"/instances/"+instance+"/databases",
          {"body": JSON.stringify(body)});
      }

      var getAddress = function(project, def) {
        let res = gcp.get("https://sqladmin.googleapis.com/sql/v1beta4/projects/"+
          gcp.getProject();+"/instances/"+def.instance);
        if (res.error) {
          throw new Error(res.error);
        }
        let instance = JSON.parse(res.body);
        if (!instance.ipAddresses) {
          throw new Error("instance has no address yet");
        }
        let address = "";
        for (let i = 0; i < instance.ipAddresses.length; i++) {
          if (instance.ipAddresses[i].type === "PRIMARY") {
             address = instance.ipAddresses[i].ipAddress;
             break;
          }
        }
        return address;
      }

      function main(def, state, ctx) {
        // get instance address
        let address = getAddress(gcp.getProject(), def);
        if (!address) {
          throw new Error("instance address is empty");
        }

        let res = createDatabase(gcp.getProject(), def.instance, def.name);
        if (res.error) {
          throw new Error(res.error + ", body: " + res.body);
        }
        return {"name": def.name, "address": address};
      }
    purge: |
      var deleteDatabase = function(project, instance, name) {
        return gcp.delete("https://sqladmin.googleapis.com/sql/v1beta4/projects/"+
          project+"/instances/"+instance+"/databases/"+name);
      }

      function main(def, state, context) {
        let res = deleteDatabase(gcp.getProject(), def.instance, def.name);
        if (res.error) {
          throw new Error(res.error + ", body: " + res.body);
        }
      }
```

Next is Cloud SQL User.

User needs password, our Entity will expect password to be passed as Secret.     
Or, if none are provided, it will generate random Secret with given name.

```yaml title="cloud-sql-user.yaml" linenums="1"
namespace: guides

cloud-sql-user:
  defines: entity
  schema:
    required: [ "instance", "name", "password-secret" ]
    instance:
      type: string
    name:
      type: string
    password-secret:
      type: string
  requires:
    - cloud/gcp
    - secret
  lifecycle:
    create: |
      var createUser = function(project, def) {
        let body = {
          name: def.name
        };

        try {
          body.password = secret.get(def["password-secret"]);
        } catch (error) {
          // generate password and save to secret if it doesn't exist
          body.password = secret.randString(16));
          secret.set(def["password-secret"], body.password);
        }

        return gcp.post("https://sqladmin.googleapis.com/sql/v1beta4/projects/"+
          project+"/instances/"+def.instance+"/users",
          {"body": JSON.stringify(body)});
      }

      function main(def, state, ctx) {      
        let res = createUser(gcp.getProject(), def);
        if (res.error) {
          throw new Error(res.error + ", body: " + res.body);
        }
        return {}
      }
    purge: |
      var deleteUser = function(project, instance, name) {
        return gcp.delete("https://sqladmin.googleapis.com/sql/v1beta4/projects/"+
          project+"/instances/"+instance+"/users?name="+name);
      }

      function main(def, state, context) {
        let res = deleteUser(gcp.getProject(), def.instance, def.name)
        if (res.error) {
          throw new Error(res.error + ", body: " + res.body);
        }
        try {
          secret.remove(def["password-secret"]);
        } catch (error) {}
      }
```

When we're done with Entities types, we can actually use them to define our specific Instance, Database and User.

Resources can use `entity` and `entity-state` ArrowScript operators to reference other Entity properties.

```yaml title="my-cloud-sql.yaml" linenums="1"
namespace: guides

myinstance:
  defines: guides/cloud-sql-instance
  name: testmyinstance1
  database-version: MYSQL_8_0
  tier: "db-g1-small"
  allow-all: true

mydb:
  defines: guides/cloud-sql-database
  name: mydb1
  instance: <- entity("guides/myinstance") get-member("name")

myuser:
  defines: guides/cloud-sql-user
  name: myuser1
  instance: <- entity("guides/myinstance") get-member("name")
  password-secret: myuser-password
  permitted-secrets:
    myuser-password: true
```

We'll use MonkOS CLI to load and run everything:

      # load Entity types
      monk load cloud-sql-instance.yaml cloud-sql-database.yaml cloud-sql-user.yaml

      # load the definitions
      monk load my-cloud-sql.yaml

      # run db Instance, it takes some time for GCP to provision the instance until we can use it
      monk run guides/myinstance

      # when Instance is ready, we can create Database and User
      monk run guides/mydb guides/myuser      

Finally, let's use these Entities for something practical:  
we are going to deploy WordPress Runnable that stores data in Cloud SQL Database
with User credentials from MonkOS Secret.

We are using `entity` and `entity-state` ArrowScript operators to reference Entity properties in Runnable resource.

```yaml title="wordpress.yaml" linenums="1"
namespace: guides

wordpress:
  defines: runnable
  permitted-secrets:
    myuser-password: true
  variables:
    wordpress_db_host:
      value: <- entity-state("guides/mydb") get-member("address")
      type: string
    wordpress_db_name:
      value: <- entity("guides/mydb") get-member("name")
      type: string
    wordpress_db_secret:
      value: <- entity("guides/myuser") get-member("password-secret")
      type: string
    wordpress_db_password:
      value: <- secret($wordpress_db_secret)
      type: string
    wordpress_db_user:
      value: <- entity("guides/myuser") get-member("name")
      type: string
    wordpress_db_addr:
      value: <- $wordpress_db_host ":3306" concat-all
      type: string
    wordpress_table_prefix:
      type: string
      value: wp_
    image-tag:
      value: latest
      type: string
  containers:
    wordpress:
      environment:
        - <- `WORDPRESS_DB_NAME=${wordpress_db_name}`
        - <- `WORDPRESS_DB_HOST=${wordpress_db_addr}`
        - <- `WORDPRESS_TABLE_PREFIX=${wordpress_table_prefix}`
        - <- `WORDPRESS_DB_PASSWORD=${wordpress_db_password}`
        - <- `WORDPRESS_DB_USER=${wordpress_db_user}`
      ports:
        - 8080:80
      image-tag: <- `${image-tag}`
      image: wordpress
```

Load and run WordPress, it should be able to run using Cloud SQL Database:

      monk load wordpress.yaml
      monk run guides/wordpress
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
---
title: "Add Load Balancers"
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

Load balancers are important components of any modern cloud setup. They provide a reliable ingress point for any system. MonkOS creates and manages load balancers for you so that you can focus on your services.

---

## Cloud Load Balancers

MonkOS currently supports TCP, UDP, HTTP(s) and Elastic IP type balancers on AWS, GCP, Azure and Digital Ocean. It doesn't matter on which cloud you're running as long as the balanced portion of the workload stays on the same cloud.

:::note

We are actively working on removing this limitation and enabling multi-cloud load balancing.

:::

## Load balancing with Monk

Let's suppose we have the following Kit:

```yaml linenums="1"
namespace: /lbs

service-1:
    defines: runnable
    inherits: nginx/latest
    variables:
        listen-port: 8080
        proxy-target-host: www.exmple.com

service-2:
    defines: runnable
    inherits: nginx/latest
    variables:
        listen-port: 8080
        proxy-target-host: www.exmple.com

services:
    defines: process-group
    runnable-list:
        - lbs/service-1
        - lbs/service-2
```

`service-1` and `service-2` are identical web services listening on port 8080 for incoming HTTP traffic.

:::warning

We're just using `nginx/latest` here to illustrate the point. There is little sense in load balancing a bunch of nginx instances but the methods apply to any kind of service.

:::

### HTTP

In order to create a load balancer that will balance the traffic between those two services, we just need to add the balancers section to the `services` group:

```yaml linenums="1"
namespace: /lbs

service-1:
    defines: runnable
    inherits: nginx/latest
    variables:
        listen-port: 8080
        proxy-target-host: www.exmple.com

service-2:
    defines: runnable
    inherits: nginx/latest
    variables:
        listen-port: 8080
        proxy-target-host: www.exmple.com

services:
    defines: process-group

    balancers:
        app-balancer:
            type: http
            port: 8080
            instances:
                - lbs/service-1
                - lbs/service-2

    runnable-list:
        - lbs/service-1
        - lbs/service-2
```

This defines the `app-balancer` - a `http` load balancer that targets port `8080` on the instances, which are members of the `services` group.

Running this group will show the load balancer in the run output together with its IP address. The HTTP load balancer listens on the port `80` by default. You can point your domain to its IP address and clients will reach either `service-1` or `service-2`.

:::warning

For a `http` load balancer to work a healthcheck against the runnable needs to pass. By default the `/` endpoint is called and `200` status code is expected in return. If your services handle healthchecks differently you can override it using [custom healthchecks](#custom-health-checks).

:::

### HTTPS

Load balancers are often used to terminate TLS so that the underlying services aren't concerned by such matters. Upgrading an HTTP balancer to an HTTPS-enabled balancer is very simple with Monk.

In order to tell `app-balancer` to use HTTPS, all we need to do is pass our certificates to it:

```yaml linenums="1"
namespace: /lbs

service-1:
    defines: runnable
    inherits: nginx/latest
    variables:
        listen-port: 8080
        proxy-target-host: www.exmple.com

service-2:
    defines: runnable
    inherits: nginx/latest
    variables:
        listen-port: 8080
        proxy-target-host: www.exmple.com

services:
    defines: process-group

    balancers:
        app-balancer:
            type: http
            domain: mystuff.com
            tls-certificate: |
                -----BEGIN CERTIFICATE-----
                ...
                -----END CERTIFICATE-----
            tls-chain: |
                -----BEGIN CERTIFICATE-----
                ...
                -----END CERTIFICATE-----
            tls-key: |
                -----BEGIN PRIVATE KEY-----
                ...
                -----END PRIVATE KEY-----
            port: 8080
            instances:
                - lbs/service-1
                - lbs/service-2

    runnable-list:
        - lbs/service-1
        - lbs/service-2
```

:::warning

Certificates are sensitive information. Learn how to store them in Kits securely: [Passing secrets in templates](passing-secrets.md).

:::

It's useful to also include domain: in this definition to immediately know what's going on just by looking at the Kit.

The `app-balancer` will listen on both port `80` and port `443` by default. It behaves the same way as the HTTP balancer but is capable of terminating TLS connections.

### TCP and UDP

A TCP and UDP load balancers can be used to balance TCP and UDP connections over a group of services.

<Tabs
defaultValue="tcp"
values={[
{label: 'TCP', value: 'tcp'},
{label: 'UDP', value: 'udp'},
{label: 'UDP (AWS)', value: 'udp-aws'},
]}>

<TabItem value="tcp">

```yaml linenums="1"
namespace: /lbs

service-1:
    defines: runnable
    inherits: nginx/latest
    variables:
        listen-port: 5222
        proxy-target-host: www.exmple.com

service-2:
    defines: runnable
    inherits: nginx/latest
    variables:
        listen-port: 5222
        proxy-target-host: www.exmple.com

services:
    defines: process-group

    balancers:
        app-balancer:
            type: tcp
            port: 5222
            instances:
                - lbs/service-1
                - lbs/service-2

    runnable-list:
        - lbs/service-1
        - lbs/service-2
```

:::warning

For a `tcp` load balancer to work a healthcheck against the runnable needs to pass. By default it just tries to open connection to the `port`. If your services handle healthchecks differently you can override it using [custom healthchecks](#custom-health-checks).

:::

</TabItem>

<TabItem value="udp">

```yaml linenums="1"
namespace: /lbs

udp:
    defines: runnable
    containers:
        defines: containers
        server:
            image: danielyinanc/udp-server-docker
            image-tag: latest
            ports:
                - 4545:4445/udp

service-1:
    defines: runnable
    inherits: lbs/udp

service-2:
    defines: runnable
    inherits: lbs/udp

services:
    defines: process-group
    balancers:
        defines: balancers
        app-balancer:
            type: udp
            port: 4545
            instances:
                - /lbs/service-1
                - /lbs/service-2

    runnable-list:
        - /lbs/service-1
        - /lbs/service-2
```
Here for demonstration purpose `danielyinanc/udp-server-docker` is used , since it is simple to test.

:::warning

UDP load balancers are not available for Digital Ocean, since Digital Ocean is not supporting that service.

:::
</TabItem>

<TabItem value="udp-aws">

```yaml linenums="1"
namespace: /lbs

udp:
  defines: runnable
  containers:
    defines: containers
    server:
      image: danielyinanc/udp-server-docker
      image-tag: latest
      ports:
        - 4545:4445/udp
    tcp-server:
      image: busybox
      image-tag: latest
      bash: "while true; do { echo -e 'HTTP/1.1 200 OK\r\n'; echo 'ok'; } | nc -l -p 8080; done"
      ports:
        - 4545:8080
```


AWS doesn't support UDP health check so load balancer from previous template will fail.
One way of solving this, is to attach simple TCP health endpoint at the same port.
This example introduces a tiny (~1MB) web server that just sends HTTP 200 for every request to port 8080.


</TabItem>

</Tabs>

Such balancers are listening on the specified port and are connecting on the same port to the underlying services.



### Elastic IP

The Elastic IP type of balancer creates a static IP address and attaches it to a healthy instance carrying the target service. Once the instance becomes unavailable due to a failure, the balancer will attach the static IP to another healthy instance until the primary one comes back.

No configuration is required here. All ports exposed on the target instance will be available when reaching the balancer IP.

```yaml linenums="1"
namespace: /lbs

service-1:
    defines: runnable
    inherits: nginx/latest
    variables:
        listen-port: 8080
        proxy-target-host: www.exmple.com

service-2:
    defines: runnable
    inherits: nginx/latest
    variables:
        listen-port: 8080
        proxy-target-host: www.exmple.com


services:
    defines: process-group

    balancers:
        app-balancer:
            type: elastic-ip
            instances:
                - lbs/service-1
                - lbs/service-2

    runnable-list:
        - lbs/service-1
        - lbs/service-2
```

## Custom health checks

MonkOS can configure the load balancers to perform custom health checks on the target services in order to switch between them in case they fail. Health checks can be applied to any type of load balancer, regardless of its type.

### HTTP

HTTP health checks are GET requests sent to at the specified `interval` (in seconds) to the `url` with specified `request` contents. The `response` field specifies the contents of the expected response. If the service fails to respond or the contents of the response are not matching - the balancer will mark that service as faulty and route traffic to its other instances.

```yaml linenums="1"
namespace: /lbs

services:
    defines: process-group

    balancers:
        app-balancer:
            port: 8080
            type: http
            health-check:
                kind: http
                url: /some/path
                interval: 5
                request: "request body"
                response: "expected response"
            instances:
                - lbs/service-1
                - lbs/service-2

    runnable-list:
        - lbs/service-1
        - lbs/service-2
```

### TCP

TCP health checks work in a similar manner except for the `url`. The following definition will make the balancer connect to the service, send `"something"` and expect a response matching the `"expected response"`. This is useful for services speaking a different protocol than HTTP.

```yaml linenums="1"
namespace: /lbs

services:
    defines: process-group

    balancers:
        app-balancer:
            port: 5222
            type: http
            health-check:
                kind: tcp
                interval: 5
                request: "something"
                response: "expected response"
            instances:
                - lbs/service-1
                - lbs/service-2

    runnable-list:
        - lbs/service-1
        - lbs/service-2
```

You now know how to easily set up different load balancers directly from your manifests. Let's now dig deeper into the provisioning side of things – again, without leaving our trusty YAML.
---
title: "Define Connections"
---

Getting services up and running isn't everything - they also need to talk to each other in order to serve their purpose. MonkOS abstracts away the complexity of networking and service discovery by introducing simple MonkScript operators that take care of finding services for you.

---

## The consumer

Consider the following Kit:

```yaml title="my stuff.yaml" linenums="1"
namespace: mystuff

my-service:
    defines: runnable
    containers:
        my-service:
            image: ubuntu:latest
            environment:
                - <- `DB_ADDR=${db-addr}`
                - <- `DB_PORT=${db-port}`
            bash: <- `echo db at $DB_ADDR:$DB_PORT ; sleep 3600`

    variables:
        db-addr:
            type: string
            value: localhost
        db-port:
            type: int
            value: 21721
```

Let's assume that the `ubuntu:latest` image expects environment variables `DB_ADDR` and `DB_PORT` to be set. We are setting those environment variables based on control plane variables `db-addr` and `db-port`.

Whenever we run `mystuff/my-service` it will assume that the database is at `localhost:21721`. Though, in most cases, the database will not be at localhost and running this Kit as it is will end in an error.

The provider `mystuff/my-service` expects a MongoDB database. MonkOS provides a Kit for this. So we don't really need to define it here. It's on the Hub.

Run MongoDB with:

    monk run mongodb/mongodb

## The connector

Before running mystuff/my-service we need to tell it where to find the database that is currently running. We will do that by replacing localhost with:

```clojure
<- get-hostname("mongodb/mongodb", "database")
```

`get-hostname` finds and returns the hostname of the target container. It takes two arguments:

1.  The path of the target runnable and,
2.  the name of the container within that runnable.

The Kit should now look like this:

```yaml title="mystuff.yaml" linenums="1"
namespace: mystuff

my-service:
    defines: runnable
    containers:
        my-service:
            image: ubuntu:latest
            environment:
                - <- `DB_ADDR=${db-addr}`
                - <- `DB_PORT=${db-port}`
            bash: <- `echo db at $DB_ADDR:$DB_PORT ; sleep 3600`
    variables:
        db-addr:
            type: string
            value: <- get-hostname("mongodb/mongodb", "database")
        db-port:
            type: int
            value: 21721
```

## The result

Run the new Kit with:

    monk load mystuff.yaml
    monk run mystuff/my-service

It will automatically find MongoDB that we run earlier. It will also work if you decide to run both runnables as a group:

```yaml title="mygroup.yaml" linenums="1"
my-group:
    defines: process-group
    runnable-list:
        - mongodb/mongodb
        - mystuff/my-service
```

    monk load mygroup.yaml
    monk run mystuff/my-group
---
title: "Automate with Hooks"
---

MonkOS is able to run any action in response to an event. This mechanism is good for defining scripted actions that should happen in given circumstances over containers and other objects. It can be used to define custom recovery scenarios and even intricate auto-scaling schemes.

---

## Basic example

This is a very basic example of how a hook can be applied to generate a file inside a container every time it is started:

```yaml title="basic.yaml" linenums="1"
namespace: foobars

foo:
    defines: runnable
    containers:
        bar:
            image: alpine:latest
            entrypoint: <- `/bin/sh /root/r.sh`
            hooks:
                container-started: hello-world

    files:
        r1:
            path: /root/r.sh
            container: bar
            contents: "while true; do sleep 1; date; done"

    actions:
        hello-world:
            code: exec("bar", "/bin/sh", "-c", `echo "Hello World" > /tmp/hello`)
```

The container itself will just hang out and wait but this is perfect for us since we'll be inspecting its filesystem contents.

Run the Kit with:

    monk load basic.yaml
    monk run foobars/foo

Now use the shell command to enter the container:

    monk shell foobars/foo

See if `/tmp/hello` exists:

    $ cat /tmp/hello
    Hello World

This confirms that the `hello-world` action was in fact triggered by `container-started` event. The action ran the exec operator that used shell echo to place a file in the container.

## More on hooks

MonkOS supports the following hooks at the moment:

| Applicable in | Hook                 | Description                       |
| ------------- | -------------------- | --------------------------------- |
| container     | `container-starting` | Fires before the container start. |
| container     | `container-started`  | Fires after the container start.  |
| container     | `container-stopping` | Fires before the container stop.  |
| container     | `container-stopped`  | Fires after the container stop.   |

All hooks are asynchronous at the moment, meaning that the action called by the hook will run in parallel with other processes and won't block the hooked process.
---
title: "Add Placement Constraints"
---

# How to constrain containers to certain instances in monk cluster

MonkOS provides a mechanism to constrain runnables to certain instances or groups of instances within a cluster. This mechanism ensures that your containers will not run where they don't belong.

Each runnable has an _affinity_ - by default this affinity is set to any instance but can be easily overriden. Additionally, in case of restart MonkOS will remember where each of the runnables were and restarts them in place so they don't change instances unless they are forced to do so. This feature is perfect for stateful workloads and we say that in MonkOS the workloads are _sticky_.

## Prerequisites

You should have a MonkOS cluster with several instances and tags running in order to follow this guide.

## Step 1: Basic Kit

Let's define a basic Kit:

```yaml title="dummy.yaml" linenums="1"
namespace: guide

foo:
    defines: runnable
    containers:
        utils:
            image: amouat/network-utils
            image-tag: latest
            entrypoint: <- `sleep 36000`
```

This just defines an utility container which will stay up for a long time. While the container doesn't do much, it will help us to demonstrate the affinity. Load this Kit by:

    monk load dummy.yaml

# Step 2: Node affinity

Let's extend the Kit by adding `affinity` section:

```yaml title="dummy2.yaml" linenums="1"
namespace: guide

foo-on-node:
    defines: runnable
    inherits: guide/foo
    affinity:
        name: <<name of one of your nodes>> # <----
```

The new `affinity` section tells monk to put `foo-on-node` on a specific node which is looked up by `name`. Use:

    monk cluster peers

to see the names of the nodes, pick one and place this name in the Kit above instead of `<<name of one of your nodes>>`.

Try loading and running this Kit:

    monk load dummy2.yaml
    monk run guide/foo-on-node

Once the Kit is up, check its placement with:

    monk describe guide/foo-on-node

It should show that `guide/foo-on-node` lives on the node you've specified.

# Step 3: Tag affinity

Let's create another Kit with a different `affinity` section:

```yaml title="dummy3.yaml" linenums="1"
namespace: guide

foo-on-tag:
    defines: runnable
    inherits: guide/foo
    affinity:
        tag: <<your tag>> # <----
```

The new `affinity` section tells monk to put `foo-on-tag` on a any node with a specific `tag`. Use:

    monk cluster peers

to see available tags, pick one and place this name in the Kit above instead of `<<your tag>>`.

Try loading and running this Kit:

    monk load dummy3.yaml
    monk run guide/foo-on-tag

Once the Kit is up, check its placement with:

    monk describe guide/foo-on-tag

It should show that `guide/foo-on-tag` lives on a node having a tag you've specified.

## Step 3: Resident affinity

Both tag and node affinity are very useful to put certain workloads on certain nodes. What if we would like to have a runnable that takes up entire instance for itself?

This is where `resident` afinity comes into play. With `resident` affinity it is possible to tell MonkOS to put a runnable on a certain node and make sure that no other runnables will be started on it as long as the resident runnable is present.

Let's stop the runnable from Step 2 with:

    monk stop guide/foo-on-node

Then, let's copy the Kit from Step 2 and make a subtle change:

```yaml title="dummy4.yaml" linenums="1"
namespace: guide

foo-on-node-resident:
    defines: runnable
    inherits: guide/foo
    affinity:
        name: <<name of one of your nodes>> # <---- use the same name as in Step 2
        resident: true                      # <---- add this
```

Now let's load an run the Kit:

    monk load dumy4.yaml
    monk run guide/foo-on-node-resident

Confirm that `guide/foo-on-node-resident` lives on the right node and try running the one from Step 2:

    monk run guide/foo-on-node

This will fail as the node is now occupied by the resident `guide/foo-on-node-resident`.

:::note

Resident affinity works when either `name` or `tag` are specified. If you don't specify any of them, MonkOS will pick first empty instance and place the resident runnable there.

:::

## Conclusion

You've learned how to pin workloads to particular instances. This feature is very useful for making sure that resource hungry workloads are placed on the nodes that can provide these resources. With careful naming and partitioning your cluster with tags it is possible to achieve fine grained control over how different parts of your system are distributed.
---
title: "Add Secrets"
---

Some information passed in the Kits should be hidden from prying eyes. Fortunately, your database passwords, keys, secret tokens, and other sensitive information can be stored safely in encrypted form before being passed to Monk.

## SOPS

Mozilla Secrets OPerationS (SOPS) is a popular editor for encrypted files, supporting many popular formats including JSON and YAML. See: [https://github.com/mozilla/sops](https://github.com/mozilla/sops).

You can encrypt your Kits with SOPS for storage or for putting them under version control. MonkOS is able to `load` SOPS encrypted YAML files in a transparent manner as long as it has access to the key store that was used to encrypt them.

This feature works transparently - if you have an encrypted Kit, just use:

    monk load myencrypted.yaml

MonkOS will decrypt the values passed in that YAML file and then re-encrypt it in its internal database so that your data stays secure at rest.

## Prerequisites

In order to to run SOPS you need to generate your GPG key. You can do it by creating example GPG definition file that might look like this:

```text
%no-protection
Key-Type: default
Subkey-Type: default
Name-Real: MyApp1
Name-Email: myapp1@mydomain.local
Expire-Date: 0
```

And then issue following command:

```bash
$ gpg --batch --generate-key < myApp1_key_definition
```

You can then get your key ID that will be used by SOPS via this command:
```
$ gpg --list-keys "myapp1@mydomain.local" | grep pub -A1 | tail -n1
```

## Tutorial

Let's suppose we have the following Kit:

```yaml title="mystuff.yaml" linenums="1"
namespace: mystuff

my-service:
    defines: runnable
    containers:
        foo:
            image: foo:latest
            environment:
                - SECRET_KEY=1234-VERY-SECRET-KEY-ABC
```

This file contains `1234-VERY-SECRET-KEY-ABC`, a value that we wouldn't like anyone to intercept.
Encryption

Assuming you have SOPS set up on your machine, you should be able to encrypt that file by using the following command:

    sops --encrypt --pgp <your pgp key fingerprint> mystuff.yaml > mystuff-secure.yaml

:::note

SOPS provides many options for key storage. We have shown the `-p` option above. This will use your local PGP for encryption and decryption. Also, you have to be sure that you have PGP key installed locally before use it with monkd

:::

The `mystuff-secure.yaml` should look similar to this:

```yaml title="mystuff-secure.yaml" linenums="1"
namespace: ENC[AES256_GCM,data:8eSMrKDiqA==,iv:HHXy2xuo6oHGH3y9cgWUWZJwH9Mg8oUqdXKkwpgY9TY=,tag:d+OUbZPyA7pYAQN7vJKL3g==,type:str]
my-service:
    defines: ENC[AES256_GCM,data:BQJVtK8Ju1Q=,iv:2JKnD0ZoLUmacJ+zROhyuLv3xybiDpAFR/iGt8Jz18w=,tag:g3gRuIOZ6/GHCi0fU3d3Og==,type:str]
    containers:
        defines: ENC[AES256_GCM,data:w9Wm0ugLGh6Ihw==,iv:qI06rxEvRdZjBlCwpyEEuq7B+r3itRLyXoIC9gav7RM=,tag:snwjY8kRzXsSHh98eymqaA==,type:str]
        foo:
            image: ENC[AES256_GCM,data:P7KUkeLmly+QmA==,iv:GjMCqg8B4Eax3VGx+Cdem/XmX6vL4Q2+h4tJwaHrzvc=,tag:QZbhlaOrj+80lQksUAHrXg==,type:str]
            environment:
            - ENC[AES256_GCM,data:bQrtjuI0kH3SqlzDIAsQOdPeOmMNAfYjYlBx/phyj4mz7MQ=,iv:lcEqMQK5tZUMi0gE/BIgGP1FwabqFkIDoTRvLX5Il6o=,tag:z7mTd+sA8wcroJAZPY1qow==,type:str]
sops:
    kms: []
    gcp_kms: []
    azure_kv: []
    hc_vault: []
    lastmodified: '2020-10-04T19:43:17Z'
    mac: ENC[AES256_GCM,data:rkt22zDJ2i55cfJegxQ3KlSdlbBOC6aLqgu5zg6ggmte2wCmF9aJ7tkVdJ6tHfcCTB9RHsyb8VZ8FkgY51vNVMJUBhoK1oeI4DDf5P/LtumwWxOmVSeIi46byuHrmM0SHNwH/j5O2W1QGzeoYUPboTaa0v9ond9ECzzUIV0gfc8=,iv:ZipozZKS6qkMwdBK+EPwuQzawHoAEbqsLt+5jUVgAxM=,tag:t76XeNztb5MKeUSBxaGkvQ==,type:str]
    pgp:
    -   created_at: '2020-10-04T19:43:16Z'
        enc: |
            -----BEGIN PGP MESSAGE-----

            hQIMA1+L4XrjeoONAQ//TbzXJ+tY41NlUn8h8rn2pgXasLZLVw1tt6sMjUnPxnQ0
            5F2S2Z/wx5Pkd4Xf6t8ZCsaguD5SuT96DBH4OUYSZuRNu2ez4dUKNtvEJnf1UVxj
            A76QWzldderq/RwDtPAElDBLBae9xYU6z76RXoOO2sQM0sFnIohjC6dvagQR8Xu9
            2A+mJ+T3fVgpDgI/nHeF+YUHEOpNL6UbRpEZpH7gyrigiH7vE94P/m5xReDsHQLF
            JQmLFDiCneY9tV+7KVlfcjVjpLZy93WJnv/SpigsGGuJoxl/bjb9utDsbHFC4dCu
            /DmsgqW+i9M267tzN/eM8/wy0Y38IECtO7pjNZKEPUvr6hxp8VxlcN3V/xmmoOWo
            qvHpHQUQhUxjaWq8A8Z/rrhZvMcnS1+domPiCe3xNgluF2Hpnn6iqofrtjN3XflD
            kCV++MpuNOgZCboxNWi3651lUHyR0JBlopqvDtiTJF/3Zemx+f2WhaanhnnX7PZW
            yUcFL+HKGy74FvT5ivGMA38tpF7kPQHSSQg6ooDAqO8C8mErxm2g0kfuycvYfDTy
            Z/fQZBHn9+Gz6vJr0aq6BJPJuOyZ5twUZXrIktCeshIKfTNkZl39NfTPyu0Wqsj6
            VnVgHiggsWl9b6BvSYKr4fJteUhQE0Je5NSmgaG3LnwY7YjS+YyqaE4sT16EW2PS
            XgGiQV7kDYyb9UMtCGjtv/9lca89n9NJBk/1yYGzt7c4HBmAvhIYtCzgfEDLKdEi
            ayfYeAW8mXW4PNnyUYAuwpup+2mVvleeEyK2noQJa9DT+yFwNx5sf98U14Ijheo=
            =iMK9
            -----END PGP MESSAGE-----
        fp: 888E5DA29455B60CADAF9E94201C5767513753F8
    unencrypted_suffix: _unencrypted
    version: 3.6.0
```

As you can see, `1234-VERY-SECRET-KEY-ABC `is nowhere to be found. In fact, SOPS encrypted all the values so the purpose of this Kit is now impossible to decipher without decrypting the file.

## Loading

To `load` such Kit file:

    monk load mystuff-secure.yaml

And that's it! MonkOS will load this file like any other cleartext Kit.

## Further edits to the Kit
This Kit can now be edited by using:

    sops mystuff-secure.yaml

Refer to [SOPS documentation](https://github.com/mozilla/sops) for further help on this topic.
---
title: "Build a Basic App"
---

Let's see how to create and run a basic app that uses MongoDB and Nginx, entirely from Monk.

This tutorial requires you to have Monk installed locally, which you can do [just like this](../get-started/get-monk.md).

## What we're building

We're preparing a small application for deployment. It's a simple guestbook written in Node.js, where we store entries in MongoDB and use a basic Nginx reverse proxy in front of the app to secure it.

We will prepare a Monk Kit for a small system composed of these three elements. The code of the app itself is not the focus of this tutorial and will be provided.

<br/>

![An artist's rendering of the system we're building](/img/docs/system-basic.png)

## The app

Our App is just a simple piece of code that requires a Mongo database and exposes an HTTP endpoint by means of the Express framework.

<!-- FIXME: If we could migrate this sample out of Oaknode and into Monk, that'd be great -->

Let's grab the source from GitHub:

    git clone https://github.com/monk-io/tutorial.git


### Preparing the container

MonkOS runs containers so our App needs to be containerized before we can start handling it. We will use Docker in this tutorial as it is the easiest way to obtain a container image from the App's source code.

Open the folder containing the source and inspect the Dockerfile that we have prepared:

```dockerfile title="Dockerfile" linenums="1"

FROM node:alpine

WORKDIR /usr/src/app

COPY package.json ./

RUN npm install

COPY . .

EXPOSE 8080
CMD ["node", "index.js"]
```

This is a pretty standard Node.js Dockerfile without any bells and whistles and it's good enough for our small App. Let's build and publish the image:

    docker build -t yourname/tutorial:latest .
    docker push yourname/tutorial:latest

This will give us the container image for our App. Your local docker instance now knows about the `yourname/tutorial:latest` image, and in the next step we will wrap it in a Monk Kit.

:::note

We only use Docker in this tutorial to build the image so that MonkOS becomes aware of our app by caching its container image. MonkOS will run and orchestrate containers spawned from any OCI-compliant container image; Docker is one way of obtaining those.

:::

### Preparing a MonkOS manifest

Let's start writing a Kit that will describe where to get the app, how to configure it and how to run it in the right context. Start a new file called `app.yaml` and put the following contents there:

```yaml title="app.yaml" linenums="1"
namespace: /yourname

app:
    defines: runnable
    version: 0.0.1
    containers:
        app:
            image: yourname/tutorial:latest
```

:::note

You can look at the `tutorial.yaml` file in the App's repo to see the full example at any time.

:::

We have provided the simplest description of the container image to be run and MonkOS is already capable of starting it. The `namespace` field tells MonkOS where to put the description of `app` - it will be under `yourname/app`. The `defines` field is important as it tells MonkOS how to interpret parts of the YAML tree - all the names are free form so this is the way to "type" the YAML.

You could run your new Kit with:

    monk load app.yaml
    monk run yourname/app

:::note

To do this, you should have the cluster already set-up.
    Also, `monk stop yourname/app` to stop the Kit.

:::

However, the Kit is not complete. Much like with `docker-compose`, in order to prepare a good runtime environment, we must understand what are the App's requirements.

By inspecting the `index.js` file we can see that the app requires three environment variables to be set before it runs:

```js title="index.js" linenums="1"
//...
const PORT = process.env.PORT;
const DB_HOST = process.env.DB_HOST;
const DB_PORT = process.env.DB_PORT;
//...
```

This has to be reflected in our Kit by telling the container to use the right environment variables and also bringing them out into the MonkOS namespace. This will allow us to alter the variables later when composing the system.

First, let's define the variables in our `runnable`. Add the following `variables` section below the `containers` section:

```yaml title="app.yaml" linenums="1"
namespace: /yourname

app:
    # ...
    variables:
        port:
            type: int
            value: 8080
        db-host:
            type: string
        db-port:
            type: int
            value: 27017
```

This tells MonkOS that we have a set of values associated with our runnable for the app. Now let's pass the values to the container by adding the following `environment` section to `app/containers/app`:

```yaml title="app.yaml" linenums="1"
app:
    containers:
        app:
            # ... image
            environment:
                - <- `PORT=${port}`
                - <- `DB_HOST=${db-host}`
                - <- `DB_PORT=${db-port}`
```

Here we see a small example of Monk's powerful language. The YAML values starting with `<-` will be calculated at runtime. In this case, we just interpolate environment variables from the variables we have defined in the namespace.

:::note

The syntax for string interpolation in MonkScript is inspired by JavaScript's string Kit literals. Learn more about [Arrow scripts](../monkscript/index.md).

:::

Your `app.yaml` manifest should now look like this:

```yaml title="app.yaml" linenums="1"

namespace: /yourname

app:
    defines: runnable
    version: 0.0.1
    containers:
        app:
            image: yourname/tutorial:latest
            ports:
                - <- `${port}:${port}`
            environment:
                - <- `PORT=${port}`
                - <- `DB_HOST=${db-host}`
                - <- `DB_PORT=${db-port}`
    variables:
        port:
            type: int
            value: 8080
        db-host:
            type: string
            value: localhost
        db-port:
            type: int
            value: 27017
```

Now run the following to make MonkOS aware of your new Kit:

    monk load app.yaml

And that's it! It's very easy to wrap any containerized application into a Monk Kit. You could publish this Kit now for everyone to run with a simple `monk run yourname/app` or use it in composition with other Kits.

We are going to deploy it ourselves though, so publishing won't be necessary.

## 3rd party services

One of the most interesting facts about MonkOS is that we don't have to work from scratch when it comes to deploying 3rd party services such as Mongo and Nginx. We can simply take them off the shelf and focus on our app.

You'll see in a second. We will use pre-made Kits for Mongo and Nginx and simply include them in our system composition. Which means this step... is not really a step after all 😎

## Composing the system

Now it's time to compose our app's Kit with the third party services, and make another Kit out of that. This way, you will be able to run the same composition on any MonkOS cluster on any cloud.

<br/>

![Kit architecture for the system we're building](/img/docs/system-full.png)

If you were to publish your composed Kit, other people would also be able to run this same setup in seconds or compose it further with their own services.

### Creating a Kit of Kits

First, create a new manifest file called `system.yaml` and add the following contents:

```yaml title="system.yaml" linenums="1"
namespace: /yourname

tutorial-app:
    defines: runnable
    inherits: ./app
    variables:
        port:
            value: 8080

system:
    defines: process-group
    runnable-list:
        - /yourname/tutorial-app
        - /yourname/tutorial-mongo
        - /yourname/tutorial-nginx
```

We have already defined the `yourname/app` runnable inside `app.yaml` and now we're instantiating it as `yourname/tutorial-app`. Since `app` lives in the same namespace, we can just refer to it as `./app`. The `inherits` keyword tells MonkOS to put the sub-tree from the target path in the new path (here: `yourname/tutorial-app`) and override it with whatever comes next.

There are two other runnables which we will define in a moment. Also notice that the file uses the same `namespace`, which means that MonkOS will put `system` together with the `app` in the same namespace tree. This is important because it allows you to keep your definition files in separate repositories but still retain order within your own namespace.

Finally, `process-group` is like a `runnable` consisting of other runnables. This allows us to group them and tell MonkOS that we want these things to be run together in a single cluster.

### Adding Mongo

Great, now let's define the missing `yourname/tutorial-mongo` runnable in terms of the existing MongoDB Kit. Add this to the `system.yaml` file:

```yaml title="system.yaml" linenums="1"
namespace: /yourname

# ...

tutorial-mongo:
    defines: runnable
    inherits: mongodb/mongodb
```

And we're all good. We will use MongoDB from the `mongodb/mongodb` Kit that has been published to the shared namespace. That's all we need, since the app is simple and we don't want to change any defaults that the database Kit comes with.

Let's update `tutorial-app` so it knows how to find the database. Add the `db-host` section to the `tutorial-app/variables`:

```yaml title="system.yaml" linenums="1"
namespace: /yourname

tutorial-app:
    # ...
    variables:
        # ...
        db-host:
            value: <- get-hostname("yourname/tutorial-mongo", "db")
```

### Adding Nginx

Nginx is next. The process is similar to MongoDB, but we want to get Nginx configured as a reverse proxy, so we'll have to tell it where to connect to:

```yaml title="system.yaml" linenums="1"
namespace: /yourname

# ...

tutorial-nginx:
    defines: runnable
    inherits: nginx/reverse-proxy
    variables:
        listen-port:
            value: 9090
        proxy-target-host:
            value: <- get-hostname("yourname/tutorial-app", "app")
        proxy-target-port:
            value: 8080
```

And that's pretty much it. Just changing those two variables is enough for the Nginx Kit to generate a config file for itself and behave as a reverse proxy for our purposes.

We could change any of the Nginx settings here or even enable Let's Encrypt, which is already available in the Nginx Kit, but let's keep it simple for now.

## Our app is ready

In the previous steps we've composed all parts of our app. Your `system.yaml` file should look like this now:

```yaml title="system.yaml" linenums="1"

namespace: /yourname

tutorial-mongo:
    defines: runnable
    inherits: mongodb/mongodb

tutorial-app:
    defines: runnable
    inherits: ./app
    variables:
        port: 9090
        db-host: <- get-hostname("yourname/tutorial-mongo", "database")

tutorial-nginx:
    defines: runnable
    inherits: nginx/reverse-proxy
    variables:
        server-name: tutorial-app.monk.io
        listen-port: 8080
        proxy-target-host: <- get-hostname("yourname/tutorial-app", "app")
        proxy-target-port: 9090

system:
    defines: process-group
    runnable-list:
        - /yourname/tutorial-mongo
        - /yourname/tutorial-app
        - /yourname/tutorial-nginx
```

Let's load the system definition with:

    monk load system.yaml

You can now run your system locally using the following command:

    monk run yourname/system

And everything should be working like a charm. You can now visit <http://localhost:9090> to verify that the app is in fact running and functioning correctly.

To update template & running workload, use:

    monk update yourname/system

To stop it, use:

    monk stop yourname/system

## Conclusion

This concludes our basic app tutorial. We have learned how to compose 3rd party software with our own containerized service and how to run it all as an ensemble using Monk.

The next step would be to run your app on different clouds. To that end, you can head back to the [Creating a cluster](../lifecycle/cluster-create-1) and [Running Kits in a cluster](../lifecycle/running-templates-cluster) guides to see them with a fresh perspective.

Or better yet, continue to [Connecting runnables](connecting-runnables.md) to see how we can make our services talk to each other.
---
title: Join MonkOS Publisher Program
---

# Publisher & Certified Content Program (Alpha)

MonkOS is a new alternative to Kubernetes and Terraform-based deployment flows. We make it possible to orchestrate entire stacks, rather than just containers, on any cloud or on-premise cluster, saving months of DevOps overhead.

This vision wouldn't be possible without publishers: developers who build and maintain stack Kits. We invite you to become one for fun, exposure and a host of other benefits.

## Publishers Create Monk Kits

MonkOS is based on powerful master manifests, called Kits. You can use them to specify and provision system configurations down to the workload level. This makes these Kits incredibly easy to deploy, manage and migrate on any infrastructure.

Kits are released on [MonkHub.io](https://monkhub.io) by community Publishers, who include open source developers, software vendors, and enterprises. In our open beta, we collected over 300+ Kits, ranging from single software components to fully integrated stack blueprints. We are always on the lookout for thrill-seeking devs to build more Kits and push this new boundary of orchestration with us.

​[Apply here](https://monk-io.typeform.com/to/SCkHZKPE) to start publishing, or read on for details.

## How Monk Kits Work

Think of Monk Kits as no-Kubernetes Helm charts on overdrive, defining entire system requirements from machines to workload provisioning. They’re written in MonkScript, an easy and powerful flavor of YAML that is:

-   **Composable**: Import, reuse and modify existing configurations as you would with regular code libraries.

-   **Scriptable**: Extend the capabilities of the containers and your system with our programmable control plane.

-   **Portable**: Kits can be reproduced on any cloud or on-premise cluster that runs MonkOS within minutes.

This means you can tweak and share single components (e.g. Nginx) as easily as an entire off-the-shelf stack (e.g. the entire data science workflow your startup runs on AWS + GCP), or even better, combine these and more to build something entirely new. Here's a [simple example](develop/basic-app.md).

## Benefits for Publishers

This flexibility makes Monk Kits an excellent distribution choice for open-source developers and proprietary software vendors. As a fast-growing Silicon Valley startup we are actively exploring publishing models that you, our community, will love and benefit from.

MonkOS is a new paradigm in orchestration. It makes it easy for your users to run your software anywhere while giving you visibility into a growing new community.

### Grow Your Software

-   **Reduced barrier of entry for your users**<br/>
    Your users can deploy and operate your software with just a few commands, on their own cloud of choice.

-   **New distribution channel for your software**<br/>
    Gain exposure to MonkOS’s rapidly growing user base, increase visibility with Monk Hub, and reduce friction.

-   **Offer seamless updates and upgrades**<br/>
    MonkOS users can subscribe to your releases and update their current stack with a simple `monk update your-stack/latest`

-   **Rich adoption metrics**<br/>
    Go beyond download count and GitHub stars. See how many CPUs your software runs on at any given moment, across cloud providers and cluster sizes. Learn how developers are composing your software within their stacks (e.g. which databases they use it with) and get a clear picture of Cloud Native industry trends.

:::note

The architecture of MonkOS and Monk Hub is primed for visibility. We're exploring, building and testing these and more models for adoption metrics.

:::

### Grow as a Developer

-   **Share the love** <br/>
    Be one of the pioneers of MonkOS.

-   **Contribute to your community** <br/>
    Become a core maintainer of the official Monk Kit for your favorite open-source software.

### Unlock New Revenue

We are in the early stages of exploring these revenue models for our publishers, and would love your opinion!

-   **Kit marketplace** <br/>
    Sell your own software or build in-demand stack Kits.

-   **On-demand stacks** <br/>
    Build and maintain specific stacks for enterprises on request, sometimes alongside the MonkOS team.

## How to Become a Publisher?

1. Apply by filling the [application form](https://monk-io.typeform.com/to/SCkHZKPE), it only takes a minute or two
2. We will review your application and get in touch to start onboarding.
3. Onboarding includes setting up your publisher account, linking your code repository, and configuring the publishing pipeline for your Kits.
4. Publish your Kits on Monk Hub for other developers to use!
5. Access rich usage insights and update your Kits seamlessly

## Publishing: a Primer

Once your application is successful and you are onboarded as a Publisher you can start pushing Kits on Monk Hub via your own code repository or one maintained by MonkOS.

Your published Kits will appear in the Monk Hub and the stack wizard, as well as by running `monk list` in the CLI.

![Monk Hub Website view](/img/docs/publishers1.png)

![Monk Hub CLI view](/img/docs/publishers2.png)

Each change to your Monk Kit triggers our deployment pipeline and publishes an updated or new version of your components to Monk Hub.

Creating a Kit is easy and takes only a few lines of YAML. You decide how much detail you want to include:

-   metadata describing your system
-   public or private containers
-   public Monk Kits available in the Hub - by inheriting and customizing them within your own system
-   instance provisioning and affinity if you want to make the system cloud (or multi-cloud) provider-specific. MonkOS currently supports GCP, AWS and Digital Ocean with more coming soon
-   additional cloud resources such as volume claims, cloud load balancers, etc.

![](/img/docs/publishers3.png)

You will feel right at home with MonkScript, YAML inspired by `docker-compose` but with quite a few scriptable tricks up its sleeve. View them all in [Features](about/features.md) and inside the [Reference](monkscript/index.md).

## How Can I join?

Let us know that you are interested in joining our Publisher Program by filling this [application form](https://monk-io.typeform.com/to/SCkHZKPE).

We’d also be thrilled to have you on our [Discord](https://discord.gg/monk-io) and answer all your questions!
---
title: "Switch Clusters"
---

You can have multiple MonkOS clusters at any given time but you can manage just one at a time. When you're working with a cluster, you're essentially joining the cluster as a member from your local machine.

MonkOS introduces `exit` and `switch` commands which make it possible to hop between clusters. You can also join somebody else's cluster if they add you as an admin and as long as you have their _Monkcode_

## Monkcodes

_Monkcodes_ are encrypted and compressed connection strings for MonkOS clusters. Each MonkOS cluster has its own Monkcode, find it with:

    monk cluster info

Monkcode should look more or less like this:

    H4sIAAAAAABA/6TMva7CIBQA4Be88xwOIsVRu5FoQrSDI9Kk/MTkhLWWhzc
    +grp90+eevvV4sjmfb5OZtRvGHOOoFmulrvLCvOzNdXec2uOu3TZ39qWzX1
    NJa/XFb8iS/0Oqoaf2Nn42/mFihSQHEAAAsAVGpYSg76+DBNIGCEj89r0CA
    AD//8oRarscAQAA

Monkcodes can be passed around as "invitations" to a cluster, or stored securely as credentials for a number of your own clusters.

:::note info

It's useful to obtain a fresh Monkcode before using it because they might change over time as new nodes are added and removed.

:::

:::caution warning

Monkcodes are sensitive information, protect them with great care. Even though it's impossible to join a cluster without being added as an admin, it's still best to keep Monkcodes away from prying eyes.

:::

## Admin access

By default, only the cluster creator is able to connect to the cluster of their own making. In order to permit another user to join the cluster, use:

    monk user add

You'll need the email they signed up with for their MonkOS account. They'll need to have a MonkOS account, obviously.

### User management

To check who has access to your current cluster, use:

    monk user list

To remove a member from the cluster, use:

    monk user remove

## Exiting a cluster

To exit a cluster and return back to local only mode (the same state as before creating/joining a cluster), use:

    monk cluster exit

This command will display the cluster's Monkcode so that you can come back at any time using it.

## Switching a cluster

In order to switch to another cluster from either local mode or current cluster use:

    monk cluster switch

This command will prompt you for a Monkcode of the target cluster. If this is your cluster you should be connected immediately. If this is somebody's else cluster - you may need to connect them so that they add your email with `monk user add`.

If you are currently in a cluster, MonkOS will exit that cluster before joining the target one.
---
title: "Run Kits in a Cluster"
---

Running Kits in a cluster isn't much different from running them locally from the operator's point of view. You can view running things locally as running them on a cluster with just one (local) machine in it.

Thanks to Monk's developer-centric design, the main focus is on services and their description in the Kits. The operator does not have to be concerned with the details of provisioning, orchestration or container image publishing.

---

## Preparation

In order to run a Kit in a cluster, we need to be in a cluster context. Run:

    monk cluster info

to check whether you're in a cluster. If not, [create a new cluster](./cluster-create-1.md) or join an existing one.

## Running a single Kit
Once you're in a cluster it is almost the same as when [running locally](../basics/running-templates.md):

    monk run -t mytag mongodb/mongodb

The `-t` flag tells MonkOS to only pick cluster members with `mytag` tag. Tags are specified when [growing the cluster](./cluster-create-1.md).

:::note

MonkOS makes all runnables stick to the node they were ran on initially. If you have been running mongodb/mongodb on your local machine it will always go to your local machine.

In order to un-stick the workload use the `--force-move` flag like this:

    monk run -t mytag --force-move mongodb/mongodb

:::

### Orchestration

MonkOS will pick the least busy machine in the cluster tagged with `mytag` tag and put MongoDB there. There is no way to instruct MonkOS to put particular containers on particular machines yet.

### Auto-recovery

MonkOS will restart crashed containers on the same instance they were occupying previously.

In case of instance outage, MonkOS will re-provision the same type of instance and re-create the containers that were affected by the outage. During this process, containers will be distributed across healthy instances for the time it takes to re-provision the missing instance.

## Running more than one instance of a Kit
Currently there are two ways to run multiple copies of one Kit in a single cluster. They are described below.

### Proxy Kits

Another option is to write a small proxy Kit to rename the thing we want to run. Let's suppose we want to run two independent copies of mongodb/mongodb.

Create `mongos.yaml` file:

```yaml linenums="1"
namespace: mynamespace

mongo1:
    defines: runnable
    inherits: mongodb/mongodb

mongo2:
    defines: runnable
    inherits: mongodb/mongodb
```

Now load it with:

    monk load mongos.yaml

To obtain two independent MongoDBs you can now do:

    monk run -t mytag mynamespace/mongo1
    monk run -t mytag mynamespace/mongo2

This method is useful when you expect to modify the configuration of each Kit: having your own Kits inheriting from a single one allows you to make adjustments and see differences at a glance in the new Kit file.

This is the recommended way of dealing with multiple workloads of the same type.

### Groups

If we want to have all instances of the Kit as a group, we can create a process group instantiating the proxy Kits.

Create a `mongos.yaml` file:

```yaml title="mongos.yaml" linenums
namespace: mynamespace

#define proxy Kits
mongo1:
    defines: runnable
    inherits: mongodb/mongodb

mongo2:
    defines: runnable
    inherits: mongodb/mongodb

mongo3:
    defines: runnable
    inherits: mongodb/mongodb

mongo4:
    defines: runnable
    inherits: mongodb/mongodb

#create process group
many-mongos:
    defines: process-group
    runnable-list:
        - mynamespace/mongo1
        - mynamespace/mongo2
        - mynamespace/mongo3
        - mynamespace/mongo4
```

Load and run it:

    monk load mongos.yaml
    monk run -t mytag mynamespace/many-mongos

This will result in four instances of `mongodb/mongodb` starting in your cluster. This approach works well for stateless Kits that are to be run in great numbers of exact copies.

## Updating and Stopping

Updating and stopping Kits in a cluster work the same as their [local counterparts](../basics/running-templates.md).

## Conclusion

We have learned that running workloads in a cluster is almost as simple as running them locally. Uncomplicated workloads like MongoDB are not that interesting on their own as MonkOS can compose multiple different Kits into reusable system Kits. Head to the next guide to learn how to build a small system with Monk.
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

Automatic provisioning is the recommended way of creating your MonkOS clusters. Currently, MonkOS features integration with AWS, GCP, Azure and DigitalOcean. This means that Clusters can be grown automatically by just specifying instances by their type on any of those clouds. One cluster can have peers in both clouds at the same time if you set up both providers for the cluster beforehand.

### Adding cloud providers

In order to _grow_ your new cluster onto your cloud(s) you need to add your cloud credentials to MonkOS first.

:::note Info

Follow [How to add cloud provider to monk &#8594;](../improve/cloud-provider.md)

:::

### Growing the cluster

We'll now create two instances on GCP to demonstrate how easy it is to grow a MonkOS cluster.

Obviously, you can try to run your two instances (or any number of them in fact) in multiple clouds.

:::note Info

See [How to add cloud provider to monk](../improve/multi-cloud.md) to learn how to provision multi-cloud clusters in detail.

:::

Let's create a new **GCP** instance. MonkOS has an aptly named `grow` command for doing this:

    monk cluster grow --provider=gcp --name=my-gcp-instance --tag=mytag --instance-type=g1-small --region=europe-west4 -m 2

:::note Info

If you omit flags, `monk cluster grow` will ask you interactively for all the required details.

:::

It sometime takes several minutes to bootstrap a new instance so do not be alarmed if the command takes some time to execute.

:::note Info

Passing the `--tag` flag tags the new peers upon their creation so they can be addressed using their tags later on. See [Running templates in a cluster](/docs/lifecycle/running-templates-cluster.md) to find out how to use tags to indicate where to run the template.

:::

Running the above commands will create two new peers on GCP:

-   `my-gcp-instance-1`
-   `my-gcp-instance-2`

Both of those peers are now available to run MonkOS workloads in the cluster. You can verify this with the cluster peers command like so:

```bash
monk cluster peers
```

    ID            Name               Provider    Containers     IP            Active
    local         local              unknown     0              127.0.0.1     true
    ...           my-gcp-instance-1  gcp         0              ...           true
    ...           my-gcp-instance-2  gcp         0              ...           true

:::tip success

You are all set to [Run Kits in a cluster](running-templates-cluster)!

:::

:::caution warning

The instances created by MonkOS using `grow` are essentially black boxes - the user is not supposed to change their configuration by hand or even log into them via ssh. Attempting to reconfigure such instance by other means than MonkOS may render it unstable or unusable.

:::

## Adding peers manually

In addition to recommended Automatic provisioning, there is an option to add new peers manually. This operation can be performed by hand or automated by some custom scripting. You can use this method, for instance, to plug on-premise bare metal servers into your existing MonkOS cluster or even bootstrap an entire cluster from such machines.

The process to add new peer is relatively simple thanks to _Monkcodes_ and can be used to put almost any linux machine under Monk's control.

:::note Info

See [How to add cloud provider to monk](/docs/lifecycle/cluster-switch-1.md#monkcodes) to learn more about Monkcodes.

:::

First, install MonkOS on a machine of your choice (let's call it **New Machine**). Check [Getting Monk](../get-started/get-monk.md) for instructions for **New Machine's** OS.

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

We have learned how to create and grow a cluster. The whole point of having a MonkOS cluster is being able to run Kits on it. Continue to the next guide to see how to run a Kit in your new cluster.
---
title: "Operate Clusters"
---

## Inspecting the cluster

If you wish to see all the peers in your cluster:

    monk cluster peers

This will display a list of peers in your cluster.

## Stopping peers

If you wish to remove a particular node from the cluster:

    monk cluster peer-remove <peer-name>

This will stop the peer and detach it from the cluster.

:::caution warning

The instance will be terminated.

MonkOS will not back up the storage of the instances it terminates. Use `peer-remove` with caution and make sure that you've backed up your data first if you'd like to keep it.

:::

## Shrinking the cluster

If you wish to stop the instances you've created you can use the `cluster shrink` command.

The invocation is simple:

    monk cluster shrink

Upon running this command, MonkOS will look for idle (not running any containers) instances in the cluster and terminate them.

:::caution warning

The instances will be terminated.

MonkOS will not back up the storage of the instances it terminates. Use `shrink` with caution and make sure that you've backed up your data first if you'd like to keep it.

:::

## Destroying the cluster

If you wish to get rid of your entire cluster and all associated resources, you can use the cluster nuke command.

    monk cluster nuke

Upon running this command, MonkOS will irreversibly destroy the entire cluster and delete all associated cloud resources and data.

This will also log you out from MonkOS CLI.

:::caution warning

The instances and all associated resources will be terminated.

MonkOS will not back up the storage of the instances it terminates. Use `nuke` with caution and make sure that you've backed up your data first if you'd like to keep it.

:::
---
title: "Overview"
---

# MonkOS Deployments

MonkOS Engine is a new gen container orchestrator that implements masterless cluster architecture. This means that under any workload you want to deploy, there is a MonkOS Cluster that talks to the underlying hosts and facilitates orchestration.

## MonkOS Clusters

![Example MonkOS cluster](/img/docs/cluster.png)

MonkOS Clusters work as bunch of `monkd` instances (peers) connected together via P2P network. These instances can reside on any machine, anywhere on the internet.

Peers communicate and coordinate using an encrypted peer-to-peer protocol and, in addition, provide a virtual LAN for the workloads running within the cluster. This way, the workloads can transparently communicate with each other, no matter where they are in the cluster.

:::note Info

Learn more about networking here: [Connecting runnables &#8594;](../develop/connecting-runnables.md)

:::

The Cluster can be automatically grown within cloud environments without any work from its operator. This chapter shows how to create MonkOS Clusters and manage the peers.

## Lifecycle

### Creation

MonkOS clusters are very easy to create since MonkOS can bootstrap itself onto your existing cloud environment with minimal to no configuration required beforehand. This allows for creating temporary clusters for testing and development, as well as long running production clusters while the methods always stay the same.

Once created, MonkOS Clusters can be expanded in two ways:

-   automatically on AWS and GCP and Azure and DigitalOcean
-   manually by installing MonkOS on any set of machines and passing the right configuration

These two methods can be combined seemlessly: MonkOS clusters can span across clouds and on-premise machines or other bare metal.

:::note Info

See [Create](cluster-create-1.md) to learn how to create a MonkOS cluster.

:::

### Cluster operations

:::note Info

See [Operate](cluster-operate-1.md) to learn how to inspect, troubleshoot, shrirnk and destroy MonkOS clusters.

:::

### Switching clusters

It is possible to operate an unlimited number of separate MonkOS clusters at once. In order to assume control of a cluster, operator must join the cluster with their operator machine. This process is called _switching_.

:::note Info

See [Switch](cluster-switch-1.md) to learn how to switch between multiple MonkOS clusters.

:::
---
id: welcome
description: Welcome to Monk
slug: /
---

# Welcome to Monk

Welcome to [Monk](https://monk.io), the AI DevOps for the cloud.

Monk takes any cloud application directly from source code to production, in any cloud. With or without AI.

Monk X, an expert autonomous AI DevOps agent trained on live application architectures. Being aware of the lowest-level infrastructure to the highest application intent, Monk X selects, builds, and runs a deployable diagram. Using our GUI Whiteboard or code, the running deployable designs are instrumented, inspectable and editable. Monk X communicates through a chat interface and is system-aware of both the existing configuration and all potential options.

Monk X is the AI element within the Monk ecosystem. This AI does not function independently; rather, it is powered by monkOS, an innovative distributed cloud operating system we have built.

monkOS comes with hundreds of ready pre-configured packages, called Kits. They are pre-packaged components such as containers, infrastructure elements and third party APIs. Kits are composable and portable. There are hundreds of public Kits available on monkHub. Kit repositories can be either public or private.

You can interact with monkOS via our GUI (whiteboard) or CLI.

import CustomLink from '@site/src/components/customLink';

<CustomLink to="/docs/gui/overview">Start with Whiteboard</CustomLink>
<CustomLink to="/docs/basics/monk-in-10">Start with CLI</CustomLink>

If at any time you need help or want to share feedback, we'd love to hear from you! Find all our contacts and resources on the [Support](about/support.md) page to find our contacts, or join us directly on [Discord](https://discord.gg/monk-io).

## About the Documentation

Monk’s documentation supports Monk products as well as the Monk Community. All Monk documentation is licensed via a Creative-Commons license, so please feel free to open a [GitHub Issue or PR directly](https://github.com/monk-io/docs) if you see anything you would like clarified or fixed.
---
title: Monk X
---

Monk X is our autonomous AI DevOps agent. The AI/ML model for Monk has been trained to understand how to answer questions and suggest configurations that are relevant and correct to your deployment. This means you can ask it questions about the state of the deployment, like the CPU usage of an instance, or prompt it to mutate the environment in a specific way. Our agent does not automatically deploy: all changes can be reviewed by you and your team before proceeding to a pipeline or production.# Monk ecosystem at glance

[**monkOS**](/about/monkos.md): new, self-contained distributed cloud OS. 

[**monk Kits or “kits”**](/about/kits.md):  Abstractions for any infrastructure element. This can include a containerized application or microservice, or even an artifact like an AWS RDS / GCP database instance. Kits can also be bundled into other kits.

[**monkScript**](/about/monkscript.md): composable YAML for describing workloads and infrastructure in one place. A difference between *monkScript* and other YAML based Infrastructure-As-Code (IaaS) languages is that there is no need for macros or pre-processors. 

[**Whiteboard**](/about/whiteboard.md): Monk’s GUI. You can design your infrastructure from pre-packaged Kits and your own services. The design on the whiteboard is fully deployable which means you can deploy it on any cloud. 

[**Monk X**](/about/monkx.md): is an autonomous AI DevOps agent that runs your app in the cloud. 
# MonkOS vs Other Software

import ComparisonTable from "../../src/components/comparisonTable";

As a new startup kid on the stack block, we often get compared to other services. Those who ask usually have their assumptions all wrong 🚨

Let's fix that, starting with two common misconceptions:

-   **MonkOS is not built on Kubernetes**: MonkOS doesn't enhance, add to or require K8s. In fact, we replace it altogether.
-   **MonkOS is not a managed service/IaaS**: Deploy anywhere and however you want. MonkOS helps you compose and provision your stack with minimal overhead.

MonkOS is a new paradigm and approach to orchestration: a control plane sitting between application and infrastructure that lets you interact with both, touching only what matters to you, while the rest 'just works'.

:::note Paradigm

No matter how complex they get, stacks should be as easy to 'install' and 'run' as mobile apps. Since Monk Kits work seamlessly everywhere, **you as a developer offload all undue complexity** to (1) us, who make sure `monk` and `monkd` work with both infra and containers, and to (2) Kitp ublishers, who optimize stacks and components for particular app/infra combinations.
:::

---

## Kubernetes

MonkOS was built to be the next-gen Kubernetes alternative. We realized that with K8s's power came great complexity and overhead, so we built something simpler but just as powerful. In fact, we built MonkOS to make our own lives easier with a startup that dealt with a lot of decentralized applications (where staying lean and flexible is key).

Both MonkOS and Kubernetes orchestrate containers, provision workloads and reduce hardware footprint. However, Kubernetes being a monumental solution, requires highly specialized engineers and a sophisticated DevOps setup. MonkOS bypasses this complexity by abstracting the vast majority of orchestration and infrastructure-side operations into an efficient single workflow.

-   **Fast onboarding**: familiar YAML, easy to customize Kits and a logic no more complicated than `docker-compose` make it easy to deploy your first app with MonOS in less than 2 hours.

-   **Seamless production flow**: develop locally and move to staging and production with zero friction. MonkOS Kits work the same anywhere there's a `monkd` instance running.

-   **Low overhead**: lean teams can manage very complex applications. MonkOS is easy to use, and developers who maintain Kits significantly reduce overhead for end users.

-   **Self-contained Engine**: in most use cases, especially for smaller teams, K8s requires managed services such as EKS, AKS or GKE, which add extra steps and scaling pains. MonkOS runs a new kind of [peer-to-peer clusters](/docs/lifecycle/cluster-create-1.md), is a native part of the [ecosystem](key-concepts.md) and offers load balancing, auto-scaling and much more out of the box. See [Features](./features.md) for a complete list.

Also note that MonkOS integrates natively with popular [CI/CD providers](../improve/ci-cd/). Overall, MonkOS is meant to be a single solution that maintains the power of K8s where it shines, but without the extra steps of setting up DevOps or using external IaaS, managed engines, or Helm. And speaking of...

## Helm

You could think of Monk Kits as superpowered Helm charts. Yet unlike Helm, MonkOS is built from the ground up to integrate Kitlanguage and package management into one.

-   _All in one_: Helm was supposed to be a package manager for K8s definitions, but it also doubles as a templating language. Doing more things at once increases complexity and errors.

-   _Better language_: Helm's language relies on imperative templating, which makes it verbose and prone to mistakes. [MonkScript YAML](../monkscript) is declarative and composable, which makes it less verbose and supportive of the DRY principle. It also has a friendlier syntax.

-   _Native package manager_: Artifact Hub is a package manager built on top of Helm, whereas Monk Hub is native to the [ecosystem](key-concepts.md). Our Kitlanguage is also seamlessly integrated with the rest of the internals and decoupled from package management, which makes Monk Kits really portable across workflows and systems.

-   _Unified Execution_: in Helm, composition happens at compile-time, and runtime scripting happens through other mechanisms that depend on k8s, which complicates workflow and troubleshooting. MonkOS presents a unified execution model for Kitprogramming, so all scripts and one-liners execute at the time when they're needed without a pre-processing phase. It's much simpler and more powerful to have everything under control using a single grammar.

In short, MonkOS offers a similar value proposition to Helm, but it's easier to use, implemented better, and ready to go out of the box.

## Nomad

Like Nomad, MonkOS is designed for simplicity, which means we keep the number of moving parts low and make setup and onboarding easy. Nomad is more powerful and reliable than MonkOS at very large scales, but MonkOS excels at saving time and reducing complexity in the vast majority of use cases.

-   **Native multi-infrastructure**: like Nomad, MonkOS supports multi-cloud, multi-region and on-prem deployments. But MonkOS doesn't need additional tools (e.g. Terraform) to set up clusters, since clusters are a native feature.

-   **Integrated Hub**: Just as with Helm, a Hub that's directly integrated with the workflow offers considerable benefits. Nomad doesn't have a hub, so you always need to start from scratch and it's hard to reuse workloads on different infrastructures.

-   **No hyperscale**: however, Nomad excels at high scales and when fine-grained workload optimization is needed. MonkOS isn't yet capable of that, but most of our users don't need to orchestrate hundreds of thousands of containers (and those who do usually rock advanced DevOps processes).

-   **More specialized in scope**: Nomad supports orchestrating applications of different kinds, including Windows, Java, VMs and others. MonkOS currently works with Podman but the architecture can easily support any other OCI-compliant containerization solutions.

In short, both MonkOS and Nomad make it easy and efficient to orchestrate applications across regions and infrastructures. MonkOS is easier to use and offers a stable, efficient single workflow, while Nomad offers more reliability at the highest scale and scope.

## Docker-compose

In general principle and syntax, MonkScript is similar to Docker Compose: you define and run multi-container applications with YAML manifest. In fact, if you've ever written a `docker-compose.yml` you'll feel right at home using MonkScript (see the [MonkScript primer](/docs/monkscript/index.md)).

However, MonkOS adds an invaluable extra layer of control to your manifests, making them truly independent of environment, and bypassing the need for a Dockerfile in most cases.

-   **Environment definition**: With Compose, you need to specify a particular environment in your Dockerfile, and make manual changes to it when needed. MonkOS lets you do that inside your single MonkScript file, and switch environments (staging, production, CI/CD etc.) and infrastructure (cloud, multi-cloud or bare metal) in one place with just a few lines of code.
-   **Scriptable actions**: You can execute code in your containers and communicate with your cloud provider directly from MonkOS, without a Dockerfile or even your cloud CLI. All you need is your Kit's file and MonkOS' [command line](/docs/cli/monk.md).

Think of Monk as a docker-compose for herds of docker-composes, which also sets up and manages your infra in addition to containers.

:::note

Monk works seamlessly with Docker, and in fact to [install Monk](../get-started/get-monk.md) at this point in time you'll need to have Docker installed and running.

:::

## Terraform

Terraform specializes in the provisioning/infrastructure level. MonkOS has that covered, but also deals with the application side of things. Think of it as if Kubernetes and Terraform had a baby, with much nicer syntax:

-   **More than provisioning**: Monk Kits can contain both infrastructure elements and service definitions (containers).

-   **Complete system definitions**: Since infrastructure components and service components are unified on MonkOS, it's possible to share a complete system – e.g. a Kafka cluster with a lot of moving parts – and put it on any MonkOS cluster in the world. All with a single YAML file.

-   **Simple and efficient**: Starting a new MonkOS cluster, without even having MonkOS installed, only takes three commands: `apt install monk` && `monk cluster new` && `monk provider add`. Even without writing any Kits you get to deploy full systems with e.g. `monk run gitlab/latest` pulled straight from the Hub.

-   **Declarative templating**: like MonkScript, Terraform uses declarative configuration files that work predictably in testing, staging, and production environments. However, MonkScript is arguably easier to learn than HCL (HashiCorp Configuration Language) and provides a more unified workflow thanks to [scriptable actions](../monkscript/scripting) and more unique features.

Therefore, a bit like Nomad, Terraform is a feature-packed solution that offers value at large scale and complexity, while MonkOS is a leaner out-of-the box solution that offers great efficiency at a much lower threshold of complexity.

---

## Conclusion

MonkOS pushes forward a new paradigm in orchestration. Main functionalities are comparable to popular solutions you might be familiar with, but the whole package is more complete and straightforward than any other piece of software that's currently out there.

If you haven't already, [get Monk](../get-started/get-monk.md) to see it in action, or dive into [Features](features.md) to see what's on the plate.

<ComparisonTable />
---
title: Kits
---

## Kits - Monk Packages

Kits are pre-packaged components such as containers, infrastructure elements, and compositions. We call them monkKits or just kits. There are hundreds of public Kits available in Monk Hub. 

These kits range from components like WordPress or PostgreSQL databases to infrastructure elements like CloudSQL, API endpoints or Firebase Cloud Functions. Kits can also form compositions. We call them “bundles” in GUI or “groups” in the CLI. These can be compositions like Kafka clusters or GitLab or combinations of other packages into full applications. Kit repositories can be either public or private. 
---
title: monkScript
---

monkScript functions as the definition language for Kits, essentially utilizing YAML to articulate and structure Kits. 
One of our design goals was to make YAML manageable and eliminate the need for pre-processing using external tools. monkScript is easy to understand as it takes inspiration from well-known products like docker-compose. At the same time, monkScript is more expressive than similar definition languages thanks to inline scripting and composability. ---
title: Whiteboard
---

Our graphical interface, or whiteboard, allows you to draw your architectural designs and deploy them. The elements of the whiteboard are designed so that they match how you would expect to draw these diagrams either by hand or existing software architecting tools: you use different visual elements to show instances, load balancers, volumes, as well as the software running on them. Once you have designed your infrastructure, you can deploy it to your chosen cloud providers using the Deploy button.

## Sandbox

If you are interested in building diagrams but not saving and deploying them, you can use our sandbox. Our sandbox has access to the same cloud providers and kits as our main whiteboard, the two biggest differences are:

1. you do not use an account with the sandbox and,
2. you cannot deploy from the sandbox. 
 
Since you cannot store sensitive data in a sandbox deploy, you can also share your designs with others for ease of knowledge transfer and communication.
---
title: "Support & Resources"
---

# Support & Contact

## Get Help

Join [MonkOS at Discord](https://discord.gg/monk-io) to get real-time support or to discuss all things Monk.

Or send us an email at <hello@monk.io>. We do read those.

## Get Involved

Here's a quick link to the [application form](https://monk-io.typeform.com/to/SCkHZKPE) (takes only a minute or so).

## Other Resources

Be sure to check out:

- [Monk's YouTube channel](https://www.youtube.com/@monk_io) for video tutorials and guides
- [@monk_io](https://twitter.com/monk_io) on Twitter for news and updates

With that out of the way, we're ready to dig in! Go to the next page for [Guides and tutorials](../basics/running-templates.md) in the next page.---
title: monkOS
---

## monkOS as a Cloud Operating System 

**Conceptually:** monkOS is a cloud operating system. Cloud operating system here does not mean Linux on a VM at a cloud provider. We use the term to mean an operating system atop the cloud infrastructure. Unlike Linux which works with primitives like CPU, RAM, and disk; monkOS works with primitives like compute clusters, API endpoints and cloud storage.

**Technically:** monkOS is a distributed resource manager. Unlike tools such as Kubernetes or Terraform, monkOS employs a single, distributed control plane for all cloud resources, containers and APIs that make up your application. This means that monkOS constantly keeps track of your infrastructure and services running on top of that infrastructure. 

**monkOS** has many functions:

- It is **multi-cloud** by default; a typical monkOS cluster can span across cloud providers and even on-premise machines.  monkOS boots up in minutes rather than hours. 
- It **deploys container workloads** and provisions needed infrastructure.
- It has a **built-in package manager** for fully portable packages called Kits. 
- It **composes** these packages into higher order Kits by utilizing a powerful definition language ([monkScript](/about/monkscript.md)) that supports inheritance and composition. 
- It **standardized common infrastructure** components across clouds by providing an unified API to all resources under its control (for example, you can swap AWS EBS for a GCP volume easily).
- It **automates operations**, upgrades, multi-stage deployments, backups, scaling workloads and clusters up and down, migrating from one cloud to another. 
- It **orchestrates containers but also all other kinds of resources**, including its own clusters.
- It **secures itself and your workloads** by employing 0-config KMS-backed secret storage, network encryption and isolation, access control etc,

---
title: CLI Overview
---

This page describes primary MonkOS features and points to relevant resources for each of them.

## Supported Cloud Providers

-   GCP
-   AWS
-   Azure
-   DigitalOcean

## MonkScript

Our language allows you to specify your entire stack needs in a simple, reusable way. MonkScript is a primary user interface for controlling Monk's Programmable Control Plane. 

### Programmable Control Plane

MonkOS understands your workloads by constantly tracking and computing values associated with any cloud instance, running container, firewall rule, data volume, and all other items present in a cluster. This process is scriptable directly from the Kits, which makes it easy to express even the most complex workloads.

### Custom Variables

Expose your container environment variables through dynamically computed variables, add and edit as required to extend your component functionality. [Read more &#8594;](../monkscript/yaml/runnables.md#variables)​

### Actions

Abstract any of your containerized software functionalities through our unique actions within the same Kit. [Read more​ &#8594;](../monkscript/yaml/runnables.md#actions)

### Health Checks

Simplify container calls outside the cluster and easily implement specific health-checks.

### Service Discovery

Seamlessly integrate your services to discover and talk to each other with one line of code.

### Container Data Introspection

Inspect any data generated by your services by directly calling and extracting it via `monk` CLI.

### Life Cycle Hooks & Auto-scaling

Define cluster and container events. Anything from changing container variables to the whole cluster scaling strategies. For provisioning, [start learning here](../develop/provisioning-via-templates.md), or check out [hooks](../develop/hooks.md).

### Placement Constraints for Containers

Define explicit deployment of your architecture. Depending on your architecture, your services may need an explicitly defined deployment to ensure they are using an instance on their own, are on instances close to other services, or exactly on the same one as them.

### Encrypted at Rest

No need for special handling when it comes to secrets. Monk will load SOPS-encrypted YAML and store all the values re-encrypted in a cluster-wide vault by default. [SOPS guide &#8594;](../develop/passing-secrets.md)

## Interfaces: CLI / GUI

### Remote Log Streaming

Instantly inspect your services logs via our CLI or GUI without any 3rd party tools, needing to ssh to instances or finding out where they are deployed.

### Built-in CPU/MEM/Disk stats

Instantly inspect your cluster instances utilization directly from our CLI or GUI.

### Shell Access to/from Any Container

Directly access shell of any running container from our CLI, without ssh to its instance or needing to find out where they are running.

## Orchestration

### System Portability to Any Cloud Provider

The MonkOS runtime natively runs on any Linux instance. You can create clusters spanning across any cloud or on-premise server while ensuring your Kit will stay portable.

### Workload Healing on Container and Instance Level

Our orchestration engine constantly ensures that the cluster and container state is preserved and in the event of down time or service failure it will aim to restore the state.

### Automatic, State-Preserving Updates of the Containers, Including Dependencies

MonkOS is aware of changes happening to each part. Therefore you can easily perform updates with a single line command.

### Auto-scaling

Implement horizontal and vertical scaling strategies to keep your system growing. MonkOS supports target-based algorythmic aut-scaling that allows you to specify scale as a function of any given set of metrics.

## Infrastructure Provisioning

Automatic provisioning of resources such as instances, EBS-type volumes, load balancers, and security groups. MonkOS takes care of all the complexity of provisioning different parts of cloud infrastructure that your system needs.

## Service Abstraction

### Cloud Load Balancers

Utilize the most popular load balancers (HTTP(s) and ElasticIP) natively baked in and easily definable by our language. [Load balancers &#8594;](../develop/load-balancers.md)

### 3rd Party Service Abstraction

Include any 3rd party services such as specific Cloud APIs in Kits with similar scripting capabilities. Our language can also be used to embed third party services such as SaaS APIs or directly into your system. [Compose a small system](../develop/basic-app.md) to see how it works.

### Network Abstraction

Encrypted overlay network between the containers with fully automated internet-facing firewall control.

Our orchestration comes with security baked in. Containers can securely communicate with each other, as per your defined criteria, and all secrets all encrypted except when needed. [Connecting runnables &#8594;](../develop/connecting-runnables.md)

## Access Control

### Multiple Users Cluster Access

Allow multiple users within your organization to perform operations on your running clusters. Regulate types of access to running MonkOS clusters resources based on the roles of individual users within your organization. [Contact us &#8594;](https://monk-io.typeform.com/to/Wd9BokCb)

## CI/CD support

Integrate your stack deployment with your favorite CI/CD tools and deploy to your MonkOS clusters. Currently tested with:

-   CircleCI
-   Github Actions
-   GitLab CI

See the [CI/CD Guide&#8594;](../improve/ci-cd)
# MonkOS Privacy

Rather than direct you to a long, boring privacy policy, we'd like to take a moment to explain why we need to collect a tiny bit of personal information from you when creating a MonkOS account.

## Basic Account Details

Every MonkOS user is assigned a unique identifier tied to the email address used to create the account. This is primarily used for licensing purposes so that MonkOS knows what features to activate. Sign in occurs on the operator's computer, while the peers receive JWT tokens from the CLI. Your email and password aren't sent to the peers.

## Telemetry

Each monkd instance periodically sends telemetry signals to our servers to help us build metrics and examine common usage patterns. It contains the user ID, a self-signed cluster ID, and peer ID. No location or other identifying information is transmitted to us.

## Our Privacy Policy

Your data, code, and infrastructure are yours and MonkOS helps it stay that way. It's really that simple.

Now that the basics are out of the way, you can always [read the full policy](https://monk.io/privacy-policy).

## Questions?

Join [MonkOS at Discord](https://discord.gg/monk-io) to get real-time support or to discuss all things Monk.

Or feel free to drop us a line at <hello@monk.io>.# CLI Overview

<!-- FIXME: There are several links in the docs to MonkHub.io, which I believe is offline. We should redirect this -->

Orchestrating containers and infrastructure together gets tedious really quick. MonkOS is a flexible piece of middleware that frees your time and restores your sanity by letting you control both these layers with a single, streamlined workflow.

This page will give you an idea of what you can accomplish with Monk, and hopefully give you a nudge towards [giving it a try](../get-started/get-monk.md).

---

## The Problem MonkOS Solves

As software becomes more sophisticated and performance requirements get steeper, container orchestration is becoming increasingly complex, time-consuming, and mission critical.

Developer teams are spending a lot of time managing (a.k.a. de-spaghettifying) infrastructure and less building product. This is especially true for teams without the scale and resources to justify internal DevOps or wide-scope enteprise tools.

MonkOS removes most of the overhead, scope and headaches from today's orchestration:

-   **Months of DevOps**, From hiring specialists to DIYing an efficient CI/CD pipeline.<br/> &#8594;
    _With Monk you can get well-configured stacks up & runnuing in minutes_. See [Monk in 10 minutes &#8594;](../basics/monk-in-10.md)

-   **Devtools creep**: Using Kubernetes? Brush up on your Helm syntax, sign up to Terraform and get their EKS module, then repeat for the GCP portion of your app.<br/> &#8594;
    _MonkOS is one solution: compose with Hub Kits, deploy from a single manifest, manage with the built-in Engine_. See [MonkOS ecosystem &#8594;](key-concepts.md)

-   **Cloud provider lock-in**: Managed services or manual deployments force you into specific providers, make future migration a pain, or make multi-cloud deployments simply too much of a hassle.<br/> &#8594;
    \_MonkOS lets you use any combination of infrastructure and switch gears whenever you want.

-   **Moving clouds?** Simply add your new cloud's credentials with* `monk cluster provider add --provider=` \_and run your Kits there.* See [MonkOS vs. other software &#8594;](comparison.md)

## 1. Find Inspiration for Your Stack

Whatever you're building, there's a chance someone somewhere made a similar stack work for them in the past. Why not piggyback on their experience and build on more solid ground?

That's the idea behind Monk Kits: infinitely composable system blueprints, complete with provisioning instructions, that can get entire systems up and running anywhere.

We're growing [Monk Hub](https://monkhub.io) into a repository not only for containers and components, but entire systems you can pick, tweak and make yours.

## 2. Build Your Stack with Ready Components

Kits are written in MonkScript, a composable and scriptable flavor of YAML that lets you define your stack at any complexity level, with just a few lines of code:

**Single containers** pick ready-to-compose databases, APIs and services from the Hub. These are classified as `runnable` Kits:

```
❯ monk list | grep runnable
✔ Got the list
Type      Kit                       Repository    Version        Tags
...
runnable  mysql/latest                   monk          -              database
runnable  mysql/v5.7                     monk          -              database
...
```

**Parts of your stack** the `group` type on Monk Hub defines pre-composed systems, such as a backend or data pipeline. When you find the right group, you can compose it with the rest of your application with minimal config work:

```
monk list | grep group
✔ Got the list
Type      Template                                    Repository    Version       Tags
...
group     apache-kafka/cluster-1-zookeeper-2-brokers  monk          -             streaming, data, analytics, integration
...
```

**Entire off-the-shelf stacks** plug and play an entire application, extend it with third party components and tune functionalities with custom overrides. All Kit definitions are composable.

```
❯ monk list | grep elk
✔ Got the list
Type      Template                       Repository    Version           Tags
...
group     elk/stack                      monk          -                 -
...
```

See how it works in this guide: [Running a small system](../develop/basic-app.md).

## 3. Manage Infra in One Place

Since MonkOS sits between your infra and application, the CLI that can communicate directly with your cloud providers. It's packed with functionality, meaning you'll be able to perform the majority of infrastructure-side work without ever leaving Monk. See the [CLI reference](../cli/monk.md).

More importantly, MonkOS is multi-cloud by design, enabling you to deploy your application across environment with minimal custom work.

Also note that MonkOS can take care of [provisioning](../develop/provisioning-via-templates.md) natively, supports [load balancers](../develop/load-balancers.md), integrates with popular [CI/CD platforms](../improve/ci-cd.md), and much more.

## 4. Share & Maintain Your Stack

Monk Hub is a new distribution system for open-source components and pre-build stacks. It features over 300 entries, with more being added constantly by our team and the community.

## 5. Save Time and Sanity

Our mission is to make composing, deploying, and managing applications almost as easy as installing mobile apps. With Monk, you can save time to market by starting from ready-made stack Kits. Your life will be much easier because you'll be able to keep deployments inside a single workflow.

Scroll to the next page to learn about Monk's key technologies – the "trinity" of Engine, Script and Hub – or [Install Monk](../get-started/get-monk.md) to see them in action.
---
title: "Common Issues"
---

<!-- FIXME: the title might need to be reworked -->

Commonly encountered issues and how to resolve them.

### I need to generally troubleshoot my MonkOS installation

There may be situations where you need to check your MonkOS installation to troubleshoot
an issue with your configuration or the tool itself. The first place you should go to
gather information is `monk system selftest`:

```bash
$ monk system selftest
✔ CLI check DONE
✔ Daemon check DONE
✔ NS check DONE
✔ Cluster check DONE
✔ Runtime check DONE
✔ Host check DONE
Test results:
✔ CLI check: Version v3.10.1, build 268736cb
✔ Daemon check: Daemon is running: Version v3.10.1, build 268736cb
⚠ Cluster connection check: Cluster not connected
✔ NS consistency check: NS in consistent state
✔ Runtime check: Runtime version 20.10.14
✔ Host check: OS darwin darwin 13.3.1, Usage: CPU 0.00%, Memory 72.50%, Disk 57.69%
```

The above case is a situation showing what happens when the tool is installed
and running, but is not currently connected to a cluster. Common configuration
issues, like the state of the CLI tool itself, the daemon, and so forth, are all
checked as part of the `selftest` with the outputs displayed as above.

### MonkOS CLI cannot connect to `monkd` socket

If you do not have `monkd` running when you use the MonkOS CLI, you will encounter an
error that looks like the following:

```bash
$ monk register
failed to connect on socket /Users/USERNAME/.monk/monkd.sock
monkd logfile found
try to connect monkd on other socket/port
```

To resolve this error: start or restart the `monkd` process. Depending on what you are working
on, you mway want to do this via `tmux` in a separate window, in a new tab of your
terminal session, or as a background process.

### Some of my runnables have problem resolving hostnames of other runnables

If some of the [runnables](/docs/monkscript/yaml/runnables/) crash with errors like `Error connecting to Redis on templates-stack-redis-redis:6379 (SocketError)` and you are using `alpine` based image then you have probably encountered a bug with `alpine` hostname resolving.

How to verify it:

```clojure
monk shell problematic-runnable-name
ping templates-stack-redis-redis
```

If the ping works correctly then it might be problem with your service. If on the other hand the host is not reachable when pinging it might be problem related to some `alpine` versions. It can be mitigated by adding `.monk` at the end of the host. For example `templates-stack-redis-redis.monk`. After that you can verify that host is working by loading Kit again and updating your runnable. In `monk` Kits the `.monk` suffix can be added using `arrowscript`:

```clojure
<- get-hostname("stack/redis", "redis") ".monk" concat
```
# `monkd`

![`monkd` displaying help](/img/docs/monkd-cli.png)

---

## Description

`monkd` is the MonkOS daemon. It implements all of Monk's functionalities and is required to be running in order for MonkOS setup to operate.

Running `monkd` in a normal scenario does not require any options.
It is advised to run `monkd` as a service on your system. See Running `monkd` as a service for an example setup.

### Usage

    monkd [flags]

### Options

`--analytics` _bool_
: Send anonymous usage data to MonkOS Inc. (default true)

`--cluster-exchange` _bool_
: In-cluster P2P image exchange (default false)

`--consensus-log-path` _string_
: Path to consensus log

`--consensus-snapshot` _string_
: Path to consensus snapshot

`--content-trust` _bool_
: Enable Docker Content Trust checking

`-d, --debug`
: Debug mode (writes logs to stdout)

`-h, --help`
: Display help for monkd

`--hypervised`
: Hypervised mode (enables halt call), use ONLY when running inside a hypervisor

`-i, --ipfs-repo-path` _string_
: Path to IPFS repository

`-l, --log-file` _string_
: Path to log file

`-m, --moby-socket` _string_
: UNIX socket or host moby/dockerd is listening on

`--monkd-backup` _string_
: Path to namespaces database backup

`-p, --monkd-pid-path` _string_
: Path to PID file

`-s, --monkd-socket` _string_
: TCP or UNIX socket that monkd should listen on

`-n, --monkd-storage` _string_
: Path to namespaces database

`-t, --network-name` _string_ (`"monkd_network"`)
: Name of the network to which the containers will attach to

`--p2p-port` _int_ (`44001`)
: P2P port

`--readonly`
: Run in read-only mode

`-a, --template-autoupdate` _int_ (`30`)
: The Kit auto update interval in minutes (set to 0 to disable)

`-v, --version`
: Print version information and quit

`--volume-path` _string_
: Path to a directory where the monkd should store container volumes

## Running `monkd` as a Service

### Linux `systemd`

To setup `monkd` as a service on a Linux system running systemd, create a config file like the one presented below and substitute the path to `monkd` binary for `PATH_TO_MONKD_BINARY`.

```ini
[Unit]
Description=MonkOS daemon

[Service]
User=monkd
Group=monkd
ExecStart=PATH_TO_MONKD_BINARY
Restart=on-abort

[Install]
WantedBy=multi-user.target
```

Place the file in `/etc/systemd/system/`, then run:

    systemctl daemon-reload

to read the new configuration into systemd, then run:

    systemctl enable --now monkd

to start `monkd` and set it to automatically start on boot.

### MacOS `launchd`

To setup MonkOS as a service on macOS, create a config file like the one presented below and substitute the path to `monkd` binary for `PATH_TO_MONKD_BINARY`.

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
  <dict>
    <key>Label</key>
    <string>com.monkd.daemon.plist</string>
    <key>RunAtLoad</key>
    <true/>
    <key>EnableGlobbing</key>
    <true/>
    <key>ProgramArguments</key>
    <array>
      <string>/bin/sh</string>
      <string>-c</string>
      <string>PATH_TO_MONKD_BINARY no-daemon</string>
    </array>
    <key>StandardErrorPath</key>
    <string>/tmp/com.monkd.daemon.plist.error.log</string>
    <key>StandardOutPath</key>
    <string>/tmp/com.monkd.daemon.plist.log</string>
  </dict>
</plist>
```

To install the config file, move it to `$HOME/Library/LaunchAgents/`:

    cp -v com.monkd.daemon.plist $HOME/Library/LaunchAgents/com.monkd.daemon.plist

Then load it with `launchctl`:

    launchctl load -w $HOME/Library/LaunchAgents/com.monkd.daemon.plist

:::success

`monkd` will start and will be automatically started on boot.

:::

## Troubleshooting

This section contains solution to problems you may experience when running `monkd` as a service.

### File Limit Reached on macOS

By default, macOS limits the number of open files per process to 256. Since `monkd` opens many network connections, it's easy to bump against this limit.

To fix this problem, you'll need to increase the open file limit. Run the following command with sudo before starting monkd:

    sudo launchctl limit maxfiles 4096 unlimited

This will set the limit to 4096 which is more than enough for `monkd`.

For more information, see [https://wilsonmar.github.io/maximum-limits/](https://wilsonmar.github.io/maximum-limits/)
# `monk`
MonkOS Command Line Interface

**Usage**

```
monk [GLOBAL OPTIONS] command [OPTIONS] [arguments...]
```

**Global Flags**


| Flag | Default | Description |
| --- | --- | --- | --- |
| `--nofancy` |  | No fancy output (emoji, formatting etc.) |
| `--nocolor` |  | Do not color the output |
| `--silent` |  | Do not print the log |
| `--socket SOCKET, -s SOCKET` | `/Users/nooga/.monk/monkd.sock` | Set TCP or UNIX `SOCKET` that monkd is listening on |
| `--token-folder, --tf` | `/Users/nooga/.monk` | Set the path to the token storage folder |
| `--help, -h` |  | show help |
| `--skip-version-check` |  | skip peer version mismatch in cluster |
| `--dev-log PATH, -l PATH` | `/Users/nooga/.monk/log/cli.log` | Set `PATH` to development log file |

## register

Register a new MonkOS account


## login

Log in with your MonkOS account

**Flags**


| Flag | Default | Description |
| --- | --- | --- | --- |
| `--email, -l, -e, -u` | `` | Email address |
| `--password, -p` | `` | Password |
| `--github, -g` |  | github |

## logout

Log out

**Flags**


| Flag | Default | Description |
| --- | --- | --- | --- |
| `--full, -f, -a` |  | logout daemon too |

## reset

Reset your MonkOS account password


## load

Load template YAML file(s) from disk.

Will not update a running workload. Use `update` after `load` to commit changes to the workload that is already running.

**Flags**


| Flag | Default | Description |
| --- | --- | --- | --- |
| `--strict, -s` |  | Fail on warnings |

## list

**Aliases:** `ls`

List available templates

**Flags**


| Flag | Default | Description |
| --- | --- | --- | --- |
| `--runnables, -r` |  | Only list runnables |
| `--groups, -g` |  | Only list groups |
| `--local, -l` |  | Only list local templates |
| `--show-deprecated` |  | List templates marked as deprecated |

## info

Print information about a template

**Flags**


| Flag | Default | Description |
| --- | --- | --- | --- |
| `--table, -t` |  | Print output in a table |

## actions

**Aliases:** `list-actions`

List actions exposed by a template


## dump

Print template(s) in YAML format

**Flags**


| Flag | Default | Description |
| --- | --- | --- | --- |
| `--output FILE, -o FILE` | `` | Save output to `FILE` |

## import

**Aliases:** `clone`

Combine existing templates into a new template

**Usage**


```
monk import --ns [namespace] -o [output] [SOURCE-TEMPLATE] ...
```

**Flags**


| Flag | Default | Description |
| --- | --- | --- | --- |
| `--output FILE, -o FILE` | `` | Save output to a `FILE` |
| `--ignore-missing, -m` |  | Ignore non-existent templates |
| `--ns NAMESPACE, -n NAMESPACE` | `` | Target `NAMESPACE` name |
| `--load, -l` |  | Load output template after creating it |

## run

Run a template

**Flags**


| Flag | Default | Description |
| --- | --- | --- | --- |
| `--tag TAG, -t TAG` | `` | Schedule run only on peers tagged with `TAG` in current cluster |
| `--peer NAME, -p NAME` | `` | Schedule run on peer named `NAME` |
| `--force-move, -f` |  | Re-schedule the workload if it's already running on a different tag/peer |
| `--local, -l` |  | Run template locally even if a cluster is available |
| `--local-only, -o` |  | Search for templates only in local repository |
| `--multiple, -m` |  | Run multiple templates at once |
| `--autoload, -a` |  | Automatically reload modified templates without prompting |
| `--set VAR=VALUE, -s VAR=VALUE` |  | Set runtime value for a variable |
| `--variables-file FILE, --variable-file FILE, --vf FILE` |  | Load runtime values for variables from file |

### Runtime variables

It's possible to provide runtime values for some variables during `monk run` or `monk update`. It can be used to override default values defined in the template, or to provide values for variables that were declared without a default value, or to modify the value of a variable for `monk update`. Runtime variables can be set either using the `--set` flag for `monk run` or `monk update`, or listed in a YAML file and provided using the `--variables-file` flag.

E.g.:
```
monk run --set foo=somevalue --set somenamespace/somerunnable/bar=othervalue somenamespace/somegroup
```
will set the variable `foo` on runnable `somenamespace/somegroup` to `somevalue`, and variable `bar` on a runnable `somenamespace/somerunnable` (which is presumably a part of `somegroup`'s runnable-list) to `othervalue`.

The same can be achieved by putting those values in a YAML file:
```yaml title="vars.yaml"
foo: somevalue
somenamespace:
    somerunnable:
        bar: othervalue
```
```
monk run --variables-file vars.yaml somenamespace/somegroup
```

## describe

Describe a running workload

**Flags**


| Flag | Default | Description |
| --- | --- | --- | --- |
| `--multiple, -m` |  | Describe multiple workloads |

## update

Update a running workload with new template definition

**Flags**


| Flag | Default | Description |
| --- | --- | --- | --- |
| `--tag TAG, -t TAG` | `` | Consider only workloads running on peers tagged with `TAG` |
| `--peer NAME, -p NAME` | `` | Consider only workloads running on peer named `NAME` |
| `--multiple, -m` |  | Update multiple templates |
| `--autoload, -a` |  | Automatically reload modified templates without prompting |
| `--set VAR=VALUE, -s VAR=VALUE` |  | Set runtime value for a variable |
| `--variables-file FILE, --variable-file FILE, --vf FILE` |  | Load runtime values for variables from file |

### Runtime variables

See [`Runtime variables`](#runtime-variables).

## restart

Restart a running workload

**Flags**


| Flag | Default | Description |
| --- | --- | --- | --- |
| `--multiple, -m` |  | Restart multiple workloads |

## stop

Stop a running workload

**Flags**


| Flag | Default | Description |
| --- | --- | --- | --- |
| `--template TEMPLATE` | `` | Name of the `TEMPLATE` to stop |
| `--all, -a` |  | Stop all running workloads |
| `--tag TAG, -t TAG` | `` | Stop workloads on peers tagged with `TAG` |
| `--multiple, -m` |  | Stop multiple workloads |

## purge

Stop, remove and clean up workloads and templates

**Flags**


| Flag | Default | Description |
| --- | --- | --- | --- |
| `--excise, -x` |  | Remove template definitions from the namespace |
| `--all, -a` |  | Purge all running workloads |
| `--no-confirm` |  | Don't ask for confirmation |
| `--ignore-volumes` |  | Don't remove cloud volumes |

## ps

List running workloads

**Flags**


| Flag | Default | Description |
| --- | --- | --- | --- |
| `--filter TEMPLATE, -f TEMPLATE` | `` | Filter by `TEMPLATE` name |
| `--local, -l` |  | Show only local workloads |
| `--all, -a` |  | Show all workloads with any status (stopped etc.) |
| `--tag TAG, -t TAG` | `` | Filter by `TAG` |
| `--peer NAME, -p NAME` | `` | Filter by peer `NAME` |

## stats

Print CPU, memory and disk used by workload(s)

**Flags**


| Flag | Default | Description |
| --- | --- | --- | --- |
| `--all, -a` |  | Show stats for all running workloads |

## do

Run an action from a running workload


## exec

Execute command in a container

**Flags**


| Flag | Default | Description |
| --- | --- | --- | --- |
| `--container ID, -c ID` | `` | Container `ID` |
| `--peer, -p` | `` | Peer `ID or NAME` |
| `--interactive, -i` |  | Start interactive session with pseudo-TTY |

## shell

Open an interactive shell in a container; alias for `monk exec -i [RUNNABLE] /bin/sh`

**Flags**


| Flag | Default | Description |
| --- | --- | --- | --- |
| `--container ID, -c ID` | `` | Container `ID` |
| `--peer, -p` | `` | Peer `ID or NAME` |
| `--shell SHELL, -b SHELL` | `/bin/sh` | Path to `SHELL` to run inside container |

## logs

**Aliases:** `log`

Print log stream from a running container

**Flags**


| Flag | Default | Description |
| --- | --- | --- | --- |
| `--follow, -f` |  | Print the log continuously |
| `--container ID, -c ID` | `` | Container `ID` |
| `--peer ID, -p ID` | `` | Peer `ID` |
| `--last N, -l N` | `10` | Print `N` last lines of the log |
| `--tail, -t` |  | Print 10 last lines of the log, equivalent to -l 10 |
| `--all, -a` |  | Print logs from all running containers at the same time |

## port-forward

Forward local port to a running container

**Flags**


| Flag | Default | Description |
| --- | --- | --- | --- |
| `--container ID, -c ID` | `` | Container `ID` |
| `--peer ID, -p ID` | `` | Peer `ID` |

## registry

**Aliases:** `docker-login`

Add a container registry

**Flags**


| Flag | Default | Description |
| --- | --- | --- | --- |
| `--username, -l, -e, -u` | `` | Username |
| `--password, -p` | `` | Password |
| `--server URL, -s URL` | `` | Registry `URL` |

## tutorial

Start the MonkOS interactive tutorial

**Flags**


| Flag | Default | Description |
| --- | --- | --- | --- |
| `--exit, -e, -x` |  | Exit the tutorial |

## gui

Start, upgrade or stop MonkOS GUI

**Flags**


| Flag | Default | Description |
| --- | --- | --- | --- |
| `--start` |  |  |
| `--stop` |  |  |
| `--update` |  |  |
| `--port PORT` | `44004` | Listen on `PORT` |

## status

Print MonkOS's status


## version

Print versions of this CLI and connected daemon


## cluster

**Aliases:** `c`, `cloister`

Set up and manage clusters


### new

Create a new cluster

**Flags**


| Flag | Default | Description |
| --- | --- | --- | --- |
| `--name, -n` | `` | Name for the new cluster |
| `--link, -l` |  | Store cluster Monkcode in your MonkOS account |

### grow

Provision and connect new peers to current cluster

**Flags**


| Flag | Default | Description |
| --- | --- | --- | --- |
| `--provider CLOUD, -p CLOUD` | `` | The `CLOUD` to provision instances on: GCP, AWS, Azure or DigitalOcean |
| `--name, -n` | `` | Instance name |
| `--tag TAG, -t TAG` | `` | Tag new instances with `TAG` |
| `--instance-type, -i` | `` | Instance type |
| `--region, -r` | `` | Instance region |
| `--zone, -z` | `` | Instance zone (GCP only) |
| `--disk-size, -d` | `0` | Disk Size (in GBs) |
| `--num-instances NUMBER, -m NUMBER` | `0` | Provision `NUMBER` instances |
| `--grow-timeout TIMEOUT` | `10` | Wait for `TIMEOUT` minutes before failing (must be more than 10) |
| `--security-key-pair NAME, --kp NAME` | `` | Security key-pair `NAME` (AWS and DigitalOcean only) |

### shrink

Remove idle peers from current cluster

**Flags**


| Flag | Default | Description |
| --- | --- | --- | --- |
| `--force, -f` |  | Don't ask for confirmation |

### join

**Aliases:** `switch`

Join a cluster, or switch current cluster

**Flags**


| Flag | Default | Description |
| --- | --- | --- | --- |
| `--name NAME, -n NAME` | `` | Target cluster `NAME` |
| `--password PASSWORD, -p PASSWORD` | `` | Target cluster `PASSWORD` |
| `--peers MULTIADDRS, -b MULTIADDRS` | `` | Target cluster node `MULTIADDRS` |
| `--monkcode MONKCODE, -m MONKCODE` | `` | Target cluster `MONKCODE` |

### exit

Exit from current cluster into local-only mode

**Flags**


| Flag | Default | Description |
| --- | --- | --- | --- |
| `--no-confirm, --force, -f` |  | Don't ask for confirmation |

### nuke

Tear down current cluster removing all resources

**Flags**


| Flag | Default | Description |
| --- | --- | --- | --- |
| `--force, -f` |  | Don't ask for confirmation |
| `--verbose, -i` |  | Show list of cloud resources which will be removed |
| `--email, -l, -e, -u` | `` | Email address |
| `--password, -p` | `` | Password |
| `--ignore-volumes, -v` |  | Don't remove existing cloud volumes |

### info

Print information about current cluster


### peers

List peers in current cluster

**Flags**


| Flag | Default | Description |
| --- | --- | --- | --- |
| `--order, -s` | `name` | order peers (valid options: name, tag, provider, containers) |
| `--name, -n` | `` | filter peers by name |
| `--tag, -t` | `` | filter peers by tag |
| `--provider, -p` | `` | filter peers by provider |
| `--active, -a` |  | filter only active peers |

### volumes

List cloud volumes attached to current cluster


### balancers

List cloud balancers attached to current cluster


### providers

List cloud providers installed in current cluster


### stats

List resource usage by peer

**Flags**


| Flag | Default | Description |
| --- | --- | --- | --- |
| `--json, -j` |  | print as raw json |

### peer-duplicate

Provision and connect a new peer based on existing one

**Flags**


| Flag | Default | Description |
| --- | --- | --- | --- |
| `--id, -i` | `` | Peer `ID or NAME`  create duplicate |
| `--name NAME, -n NAME` | `` | `NAME` for the new peer |
| `--tag TAG, -t TAG` | `` | Tag the new peer with `TAG` |

### peer-remove

Terminate and remove peer(s) from current cluster

**Flags**


| Flag | Default | Description |
| --- | --- | --- | --- |
| `--id, -i` | `` | `ID or NAME` of the peer to terminate |
| `--tag TAG, -t TAG` | `` | Terminate all peers tagged with `TAG` |
| `--force, -f` |  | Terminate even if running containers are present |

### peer-tags

**Aliases:** `peer-tag`

Edit tags on a peer

**Flags**


| Flag | Default | Description |
| --- | --- | --- | --- |
| `--id ID, -i ID` | `` | Peer `ID` to edit |
| `--tag TAGS, -t TAGS` | `` | Comma separated `TAGS` to tag the peer with |

### cloud-resources

List cloud resources of the cluster

**Flags**


| Flag | Default | Description |
| --- | --- | --- | --- |
| `--provider CLOUD, -p CLOUD` | `` | The `CLOUD`: GCP, AWS, Azure or DigitalOcean |

### snapshots

List snapshots for given provider

**Flags**


| Flag | Default | Description |
| --- | --- | --- | --- |
| `--provider NAME, -p NAME` | `` | Provider `NAME`: GCP, AWS, Azure or Digitalocean |

### provider

**Aliases:** `p`

Manage cloud providers


## user

**Aliases:** `u`

Manage users and their access


### add

add cluster user(s)

**Flags**


| Flag | Default | Description |
| --- | --- | --- | --- |
| `--email, -e` | `` | Email |

### remove

remove cluster user(s)

**Flags**


| Flag | Default | Description |
| --- | --- | --- | --- |
| `--email, -e` | `` | Email |

### list

list cluster users


## system

**Aliases:** `s`

Manage and debug MonkOS internals (be careful!)


### logs

**Aliases:** `log`

Print monkd logs from a specified peer

**Flags**


| Flag | Default | Description |
| --- | --- | --- | --- |
| `--follow, -f` |  | Print the log continuously |
| `--last N, -l N` | `0` | Print `N` last lines of the log |
| `--tail, -t` |  | Print 10 last lines of the log, equivalent to -l 10 |

### jobs

get list of jobs

**Flags**


| Flag | Default | Description |
| --- | --- | --- | --- |
| `--order, -o` | `name` | order jobs (valid options: id, title, status, peer, started,ended) |
| `--all, -a` |  | Print all jobs including inactive |
| `--title TITLE, -t TITLE` | `` | Filter by job `TITLE` |
| `--status STATUS, -s STATUS` | `` | Filter by job `STATUS` (idle, running, failed, success, cancelled) |
| `--peer, -p` | `` | Filter by peer name or id |

### events

List events

**Flags**


| Flag | Default | Description |
| --- | --- | --- | --- |
| `--event, -e` | `` | Filter by `EVENT-TYPE` |
| `--peer-id` | `` | Filter by `PEER-ID` |

### ns-list

List the contents of a namespace

**Flags**


| Flag | Default | Description |
| --- | --- | --- | --- |
| `--depth, -d` | `2147483647` | Max depth of the tree |

### ns-get

Get a value from namespace


### down

**Aliases:** `bye`

Stop monkd on this machine


### up

**Aliases:** `hi`

Launch monkd on this machine


### upgrade

**Aliases:** `update`

Upgrade MonkOS on selected node(s)

**Flags**


| Flag | Default | Description |
| --- | --- | --- | --- |
| `--peer-id, -p, --peer` | `` | Upgrade a specific node with `PEER-ID` |
| `--full, -f` |  | Upgrade all nodes in the cluster |
| `--version, -c, --custom, -v` |  | Upgrade to a specific `VERSION` |
| `--local, -l` |  | Upgrade only this node |
| `--url, -u` | `` | Url to archive containing a specific version |

### consensus

**Aliases:** `consensus-info`

Print consensus state for debugging


## help

**Aliases:** `h`

Shows a list of commands or help for one command

**Usage**


```
monk help [OPTIONS] [COMMAND]
```


---
title: Multiple Environments 
---

import Figure from "@site/src/components/figure";

Each Project can have multiple environments, for example, you might want to keep your Staging environment separate from your Production environment or create a temporary Dev environment to test out changes without impacting any existing environment.

Each environment is almost completely separated from the others, however, they can share secrets and variables if you chose so. Each environment has its own MonkOS cluster to use.

To switch between environments use the **Environment Switcher** in the middle of the navigation bar. Selecting an environment will immediately place you in context of that environment. ✔️ indicates which environment is currently shown.

<Figure src="/img/docs/gui/gui36.png" caption="Environment Switcher"/>

To add new environment hover over **Environment Switcher** and select **Create new environment**.

<Figure src="/img/docs/gui/gui51.png" caption="Creating new environment"/>

This opens a dialog box in which you can set the following:

*   **Type** - environment type, Production/Staging/Development. This has no special function, it’s used to indicate what kind of environment it will be.
    
*   **Name** - name of the new environment,
    
*   **Expiry** - When set, will make the environment self-destruct after set period of time. Useful for ephemeral development environments,
    
*   **Schedule** - Choose either “All days” of “Weekdays”. If “Weekdays” is selected then the environment will be destroyed at midnight on Friday night and recreated at midnight on Sunday. Useful for saving costs.
    

Click **Save** to confirm.

<Figure src="/img/docs/gui/gui42.png" caption="Form: Add new environment"/>

New environment is created. Since each environment has its own cluster, like with a fresh project you will have to wait 2-3 minutes for the cluster to finish setting up before the first deployment of your new environment.

Environments can be edited by clciking **Environment settings** within the **Environment Switcher.**

<Figure src="/img/docs/gui/gui45.png" caption="Switching between environments"/>

Edit environment **Type**, **Name**, **Expiry** and **Schedule** of the environment using this view. You can also manage secrets and variables within the environment here.

<Figure src="/img/docs/gui/gui27.png" caption="Environment settings page"/>

Delete the environment by clicking **Delete Environment**. You will be asked to **Confirm** your action.

<Figure src="/img/docs/gui/gui49.png" caption="Deleting an environment"/>

After deleting the environment context will switch to the next available environment within the project.

Deleting the last environment from the project deletes the project.---
title: Adding Your Own Services
---

import Figure from "@site/src/components/figure";

A PostgreSQL database is not that useful by itself. With MonkOS you can add your services straight from GitHub - MonkOS converts your app into a private Kit and takes care of building it for you using Buildpacks. If you already have an app running on Heroku, Railway or other PaaS providers you can spin it up with MonkOS by just adding your existing repo.

Click ![(plus)](https://monk-io.atlassian.net/wiki/s/481958474/6452/fd6418f9b90c3778951784f56d6337a7b98af733/_/images/icons/emoticons/add.png) and select **Add kit** just like before.

<Figure src="/img/docs/gui/gui16.png" />

Click **Import repositories** on the top-right.

<Figure src="/img/docs/gui/gui6.png" />

A dialog will appear prompting you to select a repo. Since there are no existing connections you need to add one. Click **Connect** next to **GitHub**.

<Figure src="/img/docs/gui/gui30.png" />

You will be redirected to GitHub to authorize MonkOS app. Once you complete this process you will see the connection on the list. Click **Import** on your new GitHub connection.

<Figure src="/img/docs/gui/gui4.png" />

In the next step you are prompted to choose from which GitHub organization you want to import. Pick one and confirm with **Next.**

<Figure src="/img/docs/gui/gui44.png" />

Now you can select one or more repositories from the organization using a multiple choice list. Select your repository and confirm with **Next**.

<Figure src="/img/docs/gui/gui5.png" />

Now **Kit Browser** will display all your private kits under **All Kits** in **PRIVATE** section. They will also appear in searches when using the search bar. Select your app in the same way as any other kit and click **\+ Import** to place it on the board.

<Figure src="/img/docs/gui/gui18.png" />

MonkOS will rebuild your services and deploy changes whenever you push to master branch in your repos that were imported.

Place your app inside the empty instance so that it doesn’t clash with the **db**. With two kits on the board you are ready to connect them.

<Figure src="/img/docs/gui/gui40.png" />---
title: Building Your System
---

Monk X understands what your application needs by reading the source code. It intuits the optimal infrastructure around it and builds it in any cloud. Any service, simple or complex, any programming language. No config, no infrastructure as code (IaC), nor even Dockerfiles are needed. ---
title: Overview
---

Monk GUI is a graphical interface to monkOS. 

Every modern app starts with a whiteboard and system design diagram. With our GUI, called Monk Whiteboard, you can whiteboard directly to the cloud. It’s a low code tool that you can use to run applications on the cloud.  

## Accessing the Whiteboard

You can access the whiteboard by going to [https://monk.io](https://monk.io) and clicking on the [**Sign up** button](https://app.monk.io/register).

## Key Concepts 

**Monk X**: our AI DevOps agent, operates the whiteboard. The chatbot UI is just its exterior surface. It’s an autonomous agent that is system-aware and can design, advise, improve, and execute your deployable  diagram both before and after you deploy it. Monk X is currently, invite only. In order to have early access, sign up for one of our training sessions, which include workshops and Lunch & Learns. 

**Kits**: Kits are abstractions of infrastructure elements, including microservices. Kits are displayed on the whiteboard as boxes. Before a design is deployed, the boxes are grey, and after a deployment the boxes turn green or red to indicate if the deployment was successful.

**Arrow**: Arrows are used to connect infrastructure elements together, such as instances, load balancers, persistent storage, and so forth. When you connect two elements, either on the same cloud platform or across different cloud platforms, the connections are secure by default.

**Instances**: Instances are traditional cloud instances, e.g. an AWS EC2 instance. The instances are represented as clear rectangles on the board. In order to run a kit on an instance, you can drag and drop one or more kits into that instance's rectangle. 

**Deployable Diagrams**: Deployable diagrams are designed to be virtually identical to the way you would draw an architecture diagram, with the primary difference being that the Monk tools know how to do a secure deployment from that diagram.

**Deploy button**: it enables you to instantly deploy your diagram directly to any single or multi-cloud, public or private cloud.

## Getting Started with the Whiteboard

1. Set up your account. You can sign up for a free account [here](https://app.monk.io/register).
2. Log in to the whiteboard. You can access the whiteboard [here](https://app.monk.io/projects).
3. [Create a new project](/gui/project-setup.md).
---
title: Adding your cloud providers
---

import Figure from "@site/src/components/figure";

In [Setting Up Your Project](project-setup), you were prompted to add credentials
to your first project. You can also add, and manage, your credentials in your
Account Settings.

## How to add a new token

To reach your account settings, you can click on your avatar in the upper right
of your screen and select **Account Settings**.

<Figure src="/img/docs/gui/gui60.png" caption="Account navigation drop-down"/>

You can also go directly to: [app.monk.io/settings/account](https://app.monk.io/settings/account).

Your account settings page will look similar to the below.

<Figure src="/img/docs/gui/gui61.png" caption="Account settings page" />

In this example we haven't yet added a cloud provider. Let's add and modify a token for
Digital Ocean. First, we click on **+ Add** in th Cloud Credentials section. The same
credentials window appears:

<Figure src="/img/docs/gui/gui9.png" caption="Add cloud provider selector" />

Select your provider, in our case Digital Ocean. The next window prompts us to add a
our new cloud credentials. Click **Add new cloud credentials**.

<Figure src="/img/docs/gui/gui57.png" caption="Choose credentials menu" />

Since Digital Ocean uses API tokens, you are given the ability to name and add your
token. Once you are done, click **Next**.

<Figure src="/img/docs/gui/gui62.png" caption="Add token value" />

Once complete, you will be back on your Account Settings page with the new token
visible.

<Figure src="/img/docs/gui/gui63.png" caption="Account settings page with new token" />

## How to modify and delete tokens

You can rename your existing tokens at any time. To do so, click the meatball
menu and then click the pencil.

<Figure src="/img/docs/gui/gui64.png" caption="Token menu with pencil and bin" />

Let's change the name of the token from `DigitalOcean Token` to `Digital Ocean Token`. In the
prompt that appears, we can do this by just altering the name in the text area:

<Figure src="/img/docs/gui/gui65.png" caption="Change name field" />

And then click **Save**. Our token now has the updated name `Digital Ocean Token`:

<Figure src="/img/docs/gui/gui66.png" caption="Token with new name displayed" />

If the value of your token itself changes, rather than just updating the name, you will
need to add the new credentials separately. If the pre-existing token(s) are now outdated
you can delete them. To delete them, instead of clicking the pencil above you click the
trash can:

<Figure src="/img/docs/gui/gui64.png" caption="Token menu with pencil and bin" />

When you click the trash can to delete, you will have a prompt to verify that you are
looking to delete that specific token. To confirm, click **Remove**.

<Figure src="/img/docs/gui/gui67.png" caption="Token delete prompt" />---
title: Monk X Overview
---

Monk X, it is an autonomous AI DevOps agent that runs your app in the cloud.  It’s a smart teammate, bringing the collective DevOps intelligence to you. It architects, builds and optimizes your running app. 

Monk X has the ability to perform Day 1 and Day 2 operations. That includes everything from understanding what you app needs and creating the infrastructure in seconds, to setting up the instances 
---
title: Adding Secrets
---

import Figure from "@site/src/components/figure";

One of the crucial requirements of any deployment is storing secrets in a secure way. MonkOS offers a built-in secret storage that is backed by the Cloud KMS on your cloud account. MonkOS ensures that all your secrets stored within your infrastructure are always encrypted at rest with frequent key rotation.

Secrets can be shared between multiple kits within the project’s environment.

To change database password into a secret: Select the **db** kit and find **postgres\_password** in the **Settings tab** in the **Kit configuration** panel. Click blue **<-x** button next to the text input field containing the password.

<Figure src="/img/docs/gui/gui55.png" />

A dialog box opens up. As there are no secrets yet the list will be empty - click **Create Secret** to add new secret

<Figure src="/img/docs/gui/gui23.png" />

**Add New Secret** dialog will pop up prompting you for secret **Name** and **Value**. If your secret is stored in a file you can use the blue button next to the **Value** field to upload it from your computer instead of pasting it in.

If the project contains more environments you can also choose in which of them the secret will be visible using the **Environment** dropdown.

<Figure src="/img/docs/gui/gui28.png" />

Pick a name for the secret and fill out the fields. Secret values are initially visible at the time of creation but will be never shown again after saving. Confirm by clicking **Save**.

<Figure src="/img/docs/gui/gui39.png" />

The secret was added to the environment, select it and confirm with **Apply**.

<Figure src="/img/docs/gui/gui59.png" />

The **postgres\_password** field will now contain a padlock icon with the name of the secret whose value is assigned to this field. Confirm by clicking **Save changes** button.

At this point the password is not directly editable and must be changed via the secret in **Project settings**. To clear the secret click on **X** on the right side of the field.

<Figure src="/img/docs/gui/gui47.png" />

Repeat applying the secret to your own service by selecting the database password field, clicking **<-x** next to it and selecting the **DB PASSWORD** secret.

<Figure src="/img/docs/gui/gui35.png" />

MonkOS also offers **Variables**, which work in exactly the same way as secrets but are not encrypted and can be reviewed and edited at any time. If you do not care if the value is stored securely it is better to use a Variable instead of a Secret - the usage is the same as described above.

Secrets and Variables can be also added and removed from the **Settings** tab.

<Figure src="/img/docs/gui/gui56.png" />---
title: Creating Instances
---

import Figure from "@site/src/components/figure";

First step is to create some cloud VM instances that will host your services and kits. To do so, click on ![(plus)](https://monk-io.atlassian.net/wiki/s/481958474/6452/fd6418f9b90c3778951784f56d6337a7b98af733/_/images/icons/emoticons/add.png) and select **Create Instance**.

<Figure src="/img/docs/gui/gui53.png" />

This will create a box on the diagram - whatever you put in that box will be assigned to run on that instance. Selecting the instance brings up a property editor where you can select placement, type and default volume for your instance. With MonkOS you can pick any region and instance type on any of the supported clouds.

<Figure src="/img/docs/gui/gui11.png" />

Instances can be also resized and moved on the board at any moment to make a clear layout of the designed system. Hovering your mouse cursor over an instance will show a little context toolbar. Let’s use the duplicate button to create a new instance.

<Figure src="/img/docs/gui/gui34.png" />
<Figure src="/img/docs/gui/gui7.png" />

Any change you make is saved automatically. Indicator in the top-right corner of the screen says **Saved!** once current edits were persisted. You can safely close or refresh the browser tab without losing any data.

Saving does not deploy any changes to the cluster.---
title: Setting Up Your Project
---

import Figure from "@site/src/components/figure";

:::note Prerequisites

In order to build a project you will need to have your credentials ready for one or more of the following cloud providers:
AWS, Digital Ocean, and/or GCP. 
:::

After successful sign up, you will see the list of your projects. This list is initially empty as there are no projects in your account yet. To create a new project click **Create project** button in the top right corner.

<Figure src="/img/docs/gui/gui43.png" />

To create a completely new project, you will need to name your project and then select "Create a new cluster". (You can also connect to existing Monk clusters, but that is outside the scope of this tutorial.)

<Figure src="/img/docs/gui/gui52.png" />

Now you will need to optionally choose a cloud provider to deploy to. Alternatively, you can skip this step for now (using "Skip"), and add your desired cloud provider later. The only impact this will have is that you will need to have connected to a cloud provider before you can deploy. When you are ready to deploy, make sure you add as many cloud providers as you intend to deploy to as MonkOS supports infrastructure and workloads across cloud providers and regions. (Read more on our [Adding your cloud providers](add-cloud-providers) article, which is the next page in this section.)

<Figure src="/img/docs/gui/gui9.png" />

For the purpose of this tutorial we will pick just one cloud - GCP. You can choose different cloud - everything will work exactly the same regardless of your choice.  

Since you don’t have any cloud credentials stored in your account yet you will be prompted to add new credentials. Click **Add new cloud credentials**.

<Figure src="/img/docs/gui/gui57.png" />

GCP credentials come in a JSON key file. You can obtain this file for your account by following this guide. Upload the file from your computer and pick a name for these credentials. Confirm with **Next**.

<Figure src="/img/docs/gui/gui41.png" />

You will see your credentials added to the list. Be sure to check **Use GCP as default provider** - this tells MonkOS that the cluster should be initially created on this account. Confirm with **Next**.

<Figure src="/img/docs/gui/gui15.png" />

Now you’re ready to continue with creating the project. You only need to add your credentials the first time, they will be securely stored and remembered for use with future projects. Confirm the selection with **Next**.

<!-- FIXME: Screenshot shows Azure, do we need to change that based on the change requested for the pre-requisite? -->
<Figure src="/img/docs/gui/gui54.png" />

Project setup is complete. You are now entering the **Build** view. While the project has been created the underlying cluster still has to finish starting up on your cloud account. This process usually takes 3 to 5 minutes and doesn’t interfere with the process of building. The **Deploy** button will remain inactive until the cluster is created.

<Figure src="/img/docs/gui/gui48.png" />

Dismiss the dialog box. You’ll see a blank board - this is where you build your infrastructure and services into a deployable diagram! You’ll notice ENV Staging in the top bar - you are currently in Staging environment that is automatically created for each project. (Read more on environments on our [Multiple environments](environments) article at the end of this section.)

<Figure src="/img/docs/gui/gui22.png" />
---
title: Monitoring Your Project
---

import Figure from "@site/src/components/figure";

MonkOS tracks basic metrics of each component in your system. Access the metrics by selecting **Monitor** tab in the main navigation bar.

<Figure src="/img/docs/gui/gui10.png" />

Metrics are provided per **Instance**, **Volume** and **Kit** available in respective tabs within the **Monitor** interface.

For Instances the metrics available are:

*   **CPU** - total CPU % load on the instance,
    
*   **MEM** - total RAM % load on the instance,
    
*   **DISK** - total % of space used on the instance’s root volume.
    
*   **Network RX/TX** \- inbound and outbound data rates on the instance’s network interface.
    

Hover the mouse cursor over the graphs to see exact values of these metrics at any given moment.

<Figure src="/img/docs/gui/gui2.png" />

Click **see details** to enter a more detailed view narrowed down to the particular instance.

<Figure src="/img/docs/gui/gui25.png" />---
title: Deploying Your Project
---

import Figure from "@site/src/components/figure";

Once your design has been set up it is time to **Deploy** it onto your cloud account. The process is fully automated and only requires pressing a button.

Make sure that the kits are connected and placed appropriately and click the **Deploy** button on the top-right of the screen.

<Figure src="/img/docs/gui/gui31.png" />

Kits turn gray indicating that they are not yet deployed. On the right side of the screen there is a deployment checklist that shows deployment tasks in real time as they progress.

<Figure src="/img/docs/gui/gui32.png" />

During a successful deployment kits will turn green one by one indicating that they started without issues. In case some kits didn’t start they will turn red. Kits can also become yellow indicating a warning. Hovering over a red or yellow kit reveals a list of problems.

<Figure src="/img/docs/gui/gui3.png" />---
title: Scaling and Auto-scaling 
---

import Figure from "@site/src/components/figure";

MonkOS enables easy manual and automatic scaling of any kit.

To set kit’s scale select it and go to **Scale** tab in **Kit Configuration** panel.

<Figure src="/img/docs/gui/gui1.png" />

You can manually set the number of replicas at any point by changing the number in the **Replicas** field and clicking **Save changes** to confirm. Current replica count is indicated on the kit’s top bar.

<Figure src="/img/docs/gui/gui26.png" />

To set up Auto-scaling, enable it by flipping the switch next to **Auto Scale**. This reveals more options.

<Figure src="/img/docs/gui/gui58.png" />

Auto-scaling is always constrained by a range between minimum and maximum replica counts. Set the range using two inputs in the **Replicas** section - left for minimum replica count, right for maximum replica count.

The Basic Metrics section allows to set resource utilization targets, it is possible to set multiple targets at once, one per metric: **CPU**, **RAM** and **Disk**. When a target is set monk will replicate all containers belonging to the scaled kit dynamically by observing kit’s usage of selected resource across the cluster.

The number of replicas is computed using the following formula per metric:

```
desiredReplicas = ceil(currentReplicas * (currentMetricValue / desiredMetricValue))
```

If multiple targets are enabled at once the autoscaler will average out the `desiredReplicas` calculated for each metric. Number of replicas will not fall below or above limits set in **Replicas** section.

Replica placement is fully automated and will place replicated containers on separate nodes when possible, this spreads the load evenly.

All network connections to and from replicas are handled transparently spreading the traffic evenly across replicas.

For example: Set **max replicas** to **3** and flip the switch next to **CPU usage**, set the slider to **50%**. Confirm by clicking **Save changes**.

<Figure src="/img/docs/gui/gui13.png" />

MonkOS autoscaler features target-oriented and algorithmic scaling modes, however only the target-oriented method is available in the GUI at this time. For more autoscaling options see the Monkscript documentation.

To disable auto-scaling just flip the switch nest to **Auto Scale** and confirm by clicking **Save changes**.
---
title: Collaborating with Monk X
---

Monk X recommends your deployable diagram on the Monk whiteboard. Edit visually, in code, or in dialog with the Monk X chat interface. Monk X is fully aware of your entire system and can suggest changes, improvements and warnings. ---
title: Adding and Fine-tuning Kits
---

import Figure from "@site/src/components/figure";

Having one or two instances set up, we are ready to add some services to the board. Click ![(plus)](https://monk-io.atlassian.net/wiki/s/481958474/6452/fd6418f9b90c3778951784f56d6337a7b98af733/_/images/icons/emoticons/add.png) and select **Add kit**.

<Figure src="/img/docs/gui/gui16.png" />

This opens up the **Kit Browser**. MonkOS offers many pre-built packages to chose from. For this guide, we will host a PostgreSQL on one of our instances. Search for **PostgreSQL**, find **postgresql/db** and select it by clicking **\+ Add Kit**, this will mark it as **Selected** and show a little box with **\+ Import** button at the bottom of the screen. You can select more kits to be added at once this way. Click **\+ Import** to add selected kit(s) to the board.

<Figure src="/img/docs/gui/gui14.png" />

Once the kit is imported, you will see it as a box on the board, it can be dragged freely but let’s put it on **node-1**. When the kit is selected, **Kit Configuration** panel pops up on the right side of the screen.

<Figure src="/img/docs/gui/gui46.png" />

Each MonkOS kit exposes different configuration options - you can modify them in the **Settings** tab of the **Kit Configuration** panel under **Variables**. This way you are able to override the sane defaults included in the kit and fine-tune it to your needs. You can also change the name of the kit on the board - it is displayed on the top bar of the kit.

Apart from **Settings**, there are other tabs in the **Kit Configuration** panel: **Scale** allows you to control (auto)scaling of the kit, **Network** lists endpoints exposed by the kit, **Metrics** shows basic runtime metrics, **Logs** shows logs coming from the kit. These become active after first deployment when runtime information becomes available. Read more here.
---
title: Prompts
---

Coming soon. We are working on a prompt hub for Monk X.
---
title: Connecting Kits
---

import Figure from "@site/src/components/figure";

MonkOS includes a secure encrypted overlay network that is configured automatically based on declared connections between kits. Connecting kits with MonkOS is very straightforward.

Each kit on the board has **ports** represented by circles on the edges of the kit. **Inputs** are on the left side of kits, **outputs** are on the right.

To connect your service to the database you need to connect **db-host** output on your app to the **db** port on the database.

Click on the **db-host** port. An arrow will appear and follow your mouse.

<Figure src="/img/docs/gui/gui33.png" />

Move your mouse cursor over to the port labelled **db** and click on the port to confirm.

<Figure src="/img/docs/gui/gui8.png" />

A connection is made and arrow points from **db-host** to **db**.

<Figure src="/img/docs/gui/gui21.png" />

To sever the connection double-click on the line.

The direction of the arrow follows the direction of the network connection it represents meaning that, in this case, your service will connect to the database and not the other way round. Making a mistake is impossible as outputs cannot be connected to other outputs, inputs cannot be connected to other inputs and every input can only be connected to a single output at a time.

While the process of connecting kits is very straightforward, MonkOS ensures that the connection is made in a secure manner. Even if your instances are in different regions or clouds MonkOS will create an encrypted subnet on your cluster’s overlay network. Routing on this subnet is set up in such a way that only the connections represented by arrows are possible - if we added another kit to the board it couldn’t reach the database unless expressly connected with an arrow.

In addition to the above, **db**’s hostname is assigned to the db-host variable on the app so that the app knows where to connect.

You can freely move kits around between instances and the declared connections will always hold.---
title: Inspecting Kits
---

import Figure from "@site/src/components/figure";

After first deployment when the project is running it is possible to inspect the running kits by simply clicking on them. You can access basic CPU, memory and disk usage stats of a kit, check its network endpoints and read the logs from the **Kit Configuration** panel at any time. This is meant for a quick preview - more options are available in the **Monitor** tab of your environment. See Monitoring your project.

To view kit’s network endpoints select the kit by clicking on it, **Kit Configuration** panel will appear. Select **Network** tab on the **Kit Configuration** panel. You can copy the endpoint address or visit it new tab by clicking “Preview” next to the endpoint.

<Figure src="/img/docs/gui/gui12.png" />

To view metrics of a kit select the kit by clicking on it, **Kit Configuration** panel will appear. Select **Metrics** tab on the **Kit Configuration** panel. Metrics are updated in real-time and show current values as well as historical values on a mini graph.

<Figure src="/img/docs/gui/gui20.png" />

To view kit’s logs select the kit by clicking on it, **Kit Configuration** panel will appear. Select **Logs** tab on the **Kit Configuration** panel. Logs are streamed in real-time.

<Figure src="/img/docs/gui/gui24.png" />
---
title: Inspecting The Code
---

import Figure from "@site/src/components/figure";

When working on a system in the Build view, any change made to the instances, kits and connections is dynamically reflected as Monkscript code. In fact, the editable diagram corresponds 1:1 with the code available in **Code preview** tab.

To preview the code click **\[^\]** in the bottom right corner of the screen. This opens code preview panel. The code can be searched and copied.

<Figure src="/img/docs/gui/gui17.png" />
---
title: Add cloud provider
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

MonkOS requires access to your cloud account in order to be able to provision cloud resources on your behalf. Before running a Kitthat provisions instances, load-balancers, volumes etc. you will have to add your cloud provider to Monk.

:::note

Your credentials are saved by your local MonkOS instance and shared with other peers within your cluster via encrypted connections on a need-to-know basis. Credentials are never transferred outside of your infrastructure.

:::

## Prerequisites

This procedure can be performed only while you're connected to a cluster - either a fresh or existing one. MonkOS will ask you to create a cluster in case you try the following commands without having a cluster.

MonkOS will only accept one provider of each kind per cluster. This means that you can have GCP, AWS, Azure and DO providers added at the same time but you can't have eg. two sets of GCP credentials for different projects.

## Step 1: Obtaining cloud credentials

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
2. In the new project, go to **IAM &#8594; Service Accounts &#8594; CREATE SERVICE ACCOUNT**
3. Assign the **Admin** role on the project to the account,
4. On the account list, click **three dots** and create a **JSON Key** for the account,
5. Save the file on your machine eg. in `key.json`

:::warning

Service Account Key is sensitive information. You can remove the file from your machine once you configure Monk. The credentials are now stored in an encrypted storage in the `monkd` database.

:::

</TabItem>

<TabItem value="aws">

If you're running the AWS CLI, you should be able to locate the credentials in the `~/.aws/credentials` on your machine, i.e.:

    [default]
    aws_access_key_id=F0FADIOSFODNN7EXAMPLE
    aws_secret_access_key=wJalrUUtnEEMI/K7MEDNG/bPxRfiCYEXAMPLEKEY

If you don't have that file, consult the [AWS Documentation](https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-files.html).

:::note

Alternatively, if you don't want AWS CLI, follow these steps to obtain your Access and Secret Keys.

1. Open [https://console.aws.amazon.com/](https://console.aws.amazon.com/)
2. Log in to your Amazon account
3. In searchbox - search for `IAM`.
4. On the right you will see `Quick links`, click `My Access Key`
5. Click `Create New Access Key`
6. You will now be able to view or download Access and Secret Keys.

:::

:::warning

Make sure that the account has **AmazonEC2FullAccess policy**.

:::

:::warning

AWS Access Key is sensitive information. You can remove the file from your machine once you configure Monk. The credentials are now stored in an encrypted storage in the `monkd` database.

:::

</TabItem>

<TabItem value="azure">

Assuming you're using Azure CLI, issue the following command:

    az ad sp create-for-rbac --role Contributor --sdk-auth > azurekey.json

This will produce JSON file containing your access key.

:::warning

Azure Access Key is sensitive information. You can remove the file from your machine once you configure Monk. The credentials are now stored in an encrypted storage in the `monkd` database.

:::

</TabItem>

<TabItem value="do">

1. Go to [https://cloud.digitalocean.com/account/api/tokens](https://cloud.digitalocean.com/account/api/tokens)
2. Create a new Personal Access Token
3. Note down the Token for future use

:::warning

DigitalOcean API Token is sensitive information. Take care to store it securely.

:::

</TabItem>

</Tabs>

## Step 2: Adding the provider

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

where `<<path/to/your-key.json>>` is an absolute path to your Service Account key in JSON format.

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

If `~/.aws/credentials` file is not present, MonkOS will prompt you for Access and Secret Keys.

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

## Conclusion

Adding a single provider is enough to start provisioning instances and other resources via Monk. If you have multiple accounts, you can add them the same way by just going back to [Step 1](#Step-1:-Obtaining-cloud-credentials) and repeating the process.

Adding providers is usually a one time operation performed on new clusters. Once the credentials are in there is no maintenance required from the user. This action doesn't have to repeated during deployments, even if they happen from different nodes connected to the same cluster. MonkOS will manage your credentials and use them only when performing actions on the infrastructure relevant to the cluster itself.
---
title: "Deploy Kits from CI/CD"
---

MonkOS can run as a step in your CI process and push updated Kits to an existing MonkOS cluster. This is a powerful feature for git-driven ops and it's easy to accomplish.

---

## Prerequisites

### A cluster

In order to deploy to a cluster, you will need a running cluster. See: [Creating a cluster](../lifecycle/cluster-create-1.md).

Be sure to note down the Monkcode for the cluster, you can get it by running:

    monk cluster info

### A Kit

You'll need a Kit YAML file available to the CI job. It can come from the repo or even be synthesized by some CI job running before the one we're going to write in a moment.

## Credentials

The CI process will need access to your MonkOS account email and password.

Alternatively, you can [create another account](../get-started/acc-and-auth.md) just for your CI and [authorize it against the cluster](../lifecycle/cluster-switch-1.md). This can be done with:

    monk user add

and specifying the new account's email while being connected to the target cluster.

:::warning

It's not a good idea to put your credentials in plaintext anywhere. Use CircleCI contexts or another mechanism to inject secrets into your CI config.

:::

## MonkOS CI image

The container image `gcr.io/monk-releases/monk-ci:latest` provides full `monkd` and `monk` capable of running inside your CI job. The usage is exactly the same as if you were running MonkOS locally with the exception of local `run`, which will not work inside the image.

:::note

`monk-ci` image will not be deployed in your cluster and has nothing to do with it. It's merely spawned in the CI pipeline to run your deployment job.

:::

## CircleCI

Assuming you have a project that contains a Kit, all you need to do is create a CircleCI config like this one in your project's folder:

```yaml title=".circleci/config.yml" linenums="1"
version: 2.1
jobs:
    deploy:
        docker:
            - image: gcr.io/monk-releases/monk-ci:latest
        steps:
            - checkout
            - run:
                command: |
                    MONK="monk -s monkcode://<cluster-monkcode> --nofancy --nocolor"
                    $MONK login --email <your-email> --password <your-password>
                    $MONK load <your-kit-file.yaml>
                    $MONK update -t <yourtag> <your/runnable>
workflows:
    build:
        jobs:
            - deploy
```

The above example will load and update `<your/runnable>` in the target cluster whenever the `build` workflow runs. The `-t <yourtag>` is needed for the first run to schedule your workload on the correct tag in the cluster. Note that `<your/runnable>` comes from `<your-kit-file.yaml>` - put your own values there.

:::note

In case you just want to deploy a Kitthat already exists in the hub - get rid of:

    $MONK load <your-kit-file.yaml>

Then, just use something else in place of `<your/runnable>`, eg. `mongodb/mongodb`

:::

Be sure to pass your own credentials and Monkcode in place of:

-   `<your-email>`
-   `<your-password>`
-   `<cluster-monkcode>`

You can of course come up with a much more involved CI setup - the `deploy` job definition should give you a good idea on how to incorporate MonkOS into your pipeline.

## Github Actions

For the most part, we will follow the [Github Actions Hello World](https://lab.github.com/githubtraining/github-actions:-hello-world) course.

Use the MonkOS CI/CD image (`gcr.io/monk-releases/monk-ci:latest`) as base for your `Dockerfile`:

```dockerfile title="monk-deploy/Dockerfile"
FROM gcr.io/monk-releases/monk-ci:latest

ADD entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

ENTRYPOINT ["/entrypoint.sh"]
```

In your `entrypoint.sh` add the MonkOS commands to start the daemon, log in to your account, join your cluster with the Monkcode and deploy the Kit:

```bash title="monk-deploy/entrypoint.sh"
#!/bin/sh -l

MONK="monk --nofancy -s monkcode://$MONKCODE"
$MONK login --email $MONK_USER --password $MONK_PASS
$MONK load <your-kit-file.yaml>
$MONK update -t <yourtag> <your/runnable>
```

This will load and update `<your/runnable>` in the target cluster whenever the `build` workflow runs. The `-t <yourtag>` is needed for the first run to schedule your workload on the correct tag in the cluster. Note that `<your/runnable>` comes from `<your-kit-file.yaml>` - put your own values there.

Next, create the action metadata file:

```yaml title="monk-deploy/action.yml" linenums="1"
name: "MonkOS deploy"
description: "Deploy new version to cluster with Monk"
author: "author@github.com"

runs:
    using: "docker"
    image: "Dockerfile"
```

Finally, create a workflow:

```yaml title=".github/workflows/main.yml" linenums="1"
name: A workflow for my MonkOS deploy
on: push

jobs:
    deploy:
        name: MonkOS deploy action
        runs-on: ubuntu-latest
        steps:
            - uses: actions/checkout@v1
            - uses: ./monk-deploy
        env:
            MONK_USER: ${{ secrets.MONK_USER }}
            MONK_PASS: ${{ secrets.MONK_PASS }}
            MONKCODE: ${{ secrets.MONKCODE }}
```

Be sure to provide these variables to Github Actions secrets:

`MONK_USER`
: your MonkOS account username

`MONK_PASS`
: your MonkOS account password

`MONKODE`
: the Monkcode for your cluster

## GitLab CI

Here's a basic `.gitlab-ci.yml` config for deploying with Monk:

```yaml title=".gitlab-ci.yml" linenums="1"
deploy:
    stage: deploy
    only:
        - tags
    image:
        name: "gcr.io/monk-releases/monk-ci:latest"
    script: |
        set -x
        MONK="/usr/local/bin/monk -s monkcode://$MONKCODE"
        $MONK login --email $MONK_USERNAME --password $MONK_PASSWORD
        $MONK load <your-kit-file.yaml>
        $MONK update -t <yourtag> <your/runnable>
```

This will load and update `<your/runnable>` in the target cluster whenever the `build` workflow runs. The `-t <yourtag>` is needed for the first run to schedule your workload on the correct tag in the cluster. Note that `<your/runnable>` comes from `<your-kit-file.yaml>` - put your own values there.

It triggers whenever you push a tag to your repo.

The `deploy` job uses MonkOS to deploy to your cluster. In this example we load the `test.yaml` Kitand update the runnable `test/test`.

Be sure to provide these variables to the Gitlab CI:

-   `MONK_USERNAME`: your MonkOS account username
-   `MONK_PASSWORD`: your MonkOS account password
-   `MONKCODE`: the Monkcode for your cluster

## Bitbucket

Here's a basic `bitbucket-pipelines.yml` config for deploying with Monk:

```yaml title="bitbucket-pipelines.yml" linenums="1"
image: gcr.io/monk-releases/monk-ci:latest

pipelines:
    default:
    - parallel:
        - step:
            name: 'monk deploy'
            script:
            - export MONK="monk -s monkcode://$MONKCODE --nofancy --nocolor"
            - $MONK login --email $MONK_USER --password $MONK_PASSWORD
            - $MONK load <your-kit-file.yaml>
            - $MONK update -t $MONK_TAG <your/runnable>
```

This will load and update `<your/runnable>` in the target cluster whenever a new commit is pushed to the repo. Note `-t $MONK_TAG` is required on first run to put your workload on the correct tag in the cluster. Remember to fill in your own values for `<your-kit-file.yaml>` and `<your/runnable>`.

Be sure to provide these variables in the Bitbucket pipeline settings:

-   `MONK_USER`: your MonkOS account username
-   `MONK_PASSWORD`: your monk account password
-   `MONKCODE`: the Monkcode for your cluster
-   `MONK_TAG`: tag on which to deploy in your cluster

## Secrets

Throughout this tutorial we've had to deal with secrets, even if just for our MonkOS account credentials. Let's now see how you can boost your MonkOS setup security and work with [encrypted Kits](../develop/passing-secrets.md) 🤫
---
title: "Porting Apps from K8s"
---

This guide will show you how easy it os to port Kubernetes apps to Monk.

To demonstrate this, we'll use [YELB](https://github.com/mreferre/yelb), a simple microservice oriented web application.

## YELB Design

YELB's design is well documented [here](https://github.com/mreferre/yelb#yelb-architecture).

A quick glance at the architecture tells us we'll need to create definitions for four [runnables](../monkscript/yaml/runnables/) and one [process group](../monkscript/yaml/groups.md) group them all together.

## Digging In

To speed things up, we can cheat a bit since YELB (as with many other Kubernetes applications) provides YAML definitions for the containers and environment configuration.

A specific YAML definition that contains all necessary service definitions and deployments is located on [this page](https://github.com/mreferre/yelb/blob/master/deployments/platformdeployment/Kubernetes/yaml/yelb-k8s-minikube-nodeport.yaml).

## YELB Deployments

Deployments in Monk are very similar to Kubernetes [(see runnables for more info)](../monkscript/yaml/runnables/). We have four deployments defined in the Kubernetes YAML, which we'll now port to Monk.

We'll start with porting the YELB deployments, then try to run them and see what problems need to be resolved to get it up and running. With most microservice apps, we will have to port Kubernetes Services configurations so the app can communicate between its components.

### yelb-ui

We'll start with UI. The YAML spec looks like this:

```yaml title="Kubernetes"
apiVersion: apps/v1
kind: Deployment
metadata:
    name: yelb-ui
spec:
    replicas: 1
    selector:
        matchLabels:
            app: yelb-ui
            tier: frontend
    template:
        metadata:
            labels:
                app: yelb-ui
                tier: frontend
        spec:
            containers:
                - name: yelb-ui
                image: mreferre/yelb-ui:0.7
                ports:
                    - containerPort: 80
```

The most interesting part for us is the container spec:

```yaml title="Kubernetes"
spec:
    containers:
        - name: yelb-ui
        image: mreferre/yelb-ui:0.7
        ports:
            - containerPort: 80
```

We need something similar in Monk to run the application component. Lets define our [runnable](../monkscript/yaml/runnables/) and put that information in. It will look like this:

```yaml title="Monk"
namespace: /yelb

ui:
    defines: runnable
    containers:
        yelb-ui:
            image-tag: "0.7"
            image: mreferre/yelb-ui
```

That should be enough for the component to start.

:::note

We've deliberately skipped `containerPort`, but we'll get to that part later. For now, we want to try to start every single component (or not).

:::

### yelb-appserver

We'll do the same with appserver. It's YAML spec looks like:

```yaml title="Kubernetes"
apiVersion: apps/v1
kind: Deployment
metadata:
    name: yelb-appserver
spec:
    replicas: 1
    selector:
        matchLabels:
            app: yelb-appserver
            tier: middletier
    template:
        metadata:
            labels:
                app: yelb-appserver
                tier: middletier
        spec:
            containers:
                - name: yelb-appserver
                image: mreferre/yelb-appserver:0.5
                ports:
                    - containerPort: 4567
```

Again, we will look at containers spec, and produce similar YAML:

```yaml title="Monk"
namespace: /yelb

appserver:
    defines: runnable
    containers:
        yelb-appserver:
            image-tag: "0.5"
            image: mreferre/yelb-appserver
```

### yelb-db

We'll do the same with db server. It's YAML spec looks like:

```yaml title="Kubernetes"
apiVersion: apps/v1
kind: Deployment
metadata:
    name: yelb-db
spec:
    replicas: 1
    selector:
        matchLabels:
            app: yelb-db
            tier: backenddb
    template:
        metadata:
            labels:
                app: yelb-db
                tier: backenddb
        spec:
            containers:
                - name: yelb-db
                image: mreferre/yelb-db:0.5
                ports:
                    - containerPort: 5432
```

Again, we'll reference the containers spec and produce similar YAML:

```yaml title="Monk"
namespace: /yelb

db:
    defines: runnable
    containers:
        yelb-db:
            image-tag: "0.5"
            image: mreferre/yelb-db
```

### redis-server

We will do the same with redis server. It's YAML spec looks like:

```yaml title="Kubernetes"
apiVersion: apps/v1
kind: Deployment
metadata:
    name: redis-server
spec:
    replicas: 1
    selector:
        matchLabels:
            app: redis-server
            tier: cache
    template:
        metadata:
            labels:
                app: redis-server
                tier: cache
        spec:
            containers:
                - name: redis-server
                image: redis:4.0.2
                ports:
                    - containerPort: 6379
```

Referencing the contianer spec, we'll write similar YAML:

```yaml title="Monk"
namespace: /yelb

redis:
    defines: runnable
    containers:
        redis-server:
            image-tag: "4.0.2"
            image: redis
```

## Starting YELB in MonkOS for the First Time

Since we have all runnable defitions completed, it's time to try to run them.

### Loading Kits into Monk

First we need to load them into monk, we can achieve this by running:

```bash
$ monk load *yaml
```

If all goes well, we'll see:

```
✔ Read files successfully
✔ Loaded yelb-appserver.yaml successfully
✔ Loaded yelb-db.yaml successfully
✔ Loaded yelb-redisserver.yaml successfully
✔ Loaded yelb-ui.yaml successfully

Loaded 4 runnables, 0 process groups and 0 services in 4 files with 0 errors and 0 warnings
✨ Loaded:
 └─🔩 Runnables:
    ├─🧩 yelb/appserver
    ├─🧩 yelb/db
    ├─🧩 yelb/redis
    └─🧩 yelb/ui

✔ All templates loaded successfully
```

### Running Workloads

Since we have the definitions loaded, we can now start them individually.

:::note

Later, we'll create a [process group](../monkscript/yaml/groups.md) that will allow us to start all of them at the same time.

:::

```bash
$ monk run yelb/appserver
(...)
$ monk run yelb/db
(...)
$ monk run yelb/redis
(...)
$ monk run yelb/ui
(...)
```

Let's check status of the workloads:

```bash
$ monk ps
✔ Got state
Group/Runnable/Containers                            Uptime   Peer   Ports
🔩 local/yelb/redis
 └─📦 templates-local-yelb-redis-redis-server        1m 28s   local
🔩 local/yelb/appserver
 └─📦 templates-local-yelb-appserver-yelb-appserver  3m 10s   local
🔩 local/yelb/ui
 └─📦 templates-local-yelb-ui-yelb-ui                33s      local
🔩 local/yelb/db
 └─📦 templates-local-yelb-db-yelb-db                2m 25s   local
```

### Checking Logs

Once everything is running, we can check logs from the running containers.

##### yelb-db logs

```bash
$ monk logs yelb/db
(...)
PostgreSQL init process complete; ready for start up.
2021-05-15 10:51:52.492 UTC [1] LOG:  listening on IPv4 address "0.0.0.0", port 5432
2021-05-15 10:51:52.492 UTC [1] LOG:  listening on IPv6 address "::", port 5432
2021-05-15 10:51:52.567 UTC [1] LOG:  listening on Unix socket "/var/run/postgresql/.s.PGSQL.5432"
2021-05-15 10:51:52.918 UTC [67] LOG:  database system was shut down at 2021-05-15 10:51:52 UTC
2021-05-15 10:51:53.017 UTC [1] LOG:  database system is ready to accept connections

```

We can see `database system is ready to accept connections` message which means our database is running properly.

##### yelb-redis logs

```bash
$ monk logs yelb/redis
(...)
1:M 15 May 14:42:26.180 # Server initialized
1:M 15 May 14:42:26.180 # WARNING overcommit_memory is set to 0! Background save may fail under low memory condition. To fix this issue add 'vm.overcommit_memory = 1' to /etc/sysctl.conf and then reboot or run the command 'sysctl vm.overcommit_memory=1' for this to take effect.
1:M 15 May 14:42:26.181 # WARNING you have Transparent Huge Pages (THP) support enabled in your kernel. This will create latency and memory usage issues with Redis. To fix this issue run the command 'echo never > /sys/kernel/mm/transparent_hugepage/enabled' as root, and add it to your /etc/rc.local in order to retain the setting after a reboot. Redis must be restarted after THP is disabled.
1:M 15 May 14:42:26.181 * Ready to accept connections
```

The `Ready to accept connections` message means our [Redis](https://redis.io/) server is running properly.

##### yelb-ui logs

```bash
$ monk logs yelb/ui
(...)
2021/05/15 14:43:20 [emerg] 12#12: host not found in upstream "yelb-appserver" in /etc/nginx/conf.d/default.conf:5
nginx: [emerg] host not found in upstream "yelb-appserver" in /etc/nginx/conf.d/default.conf:5
```

We'll have to fix the `host not found` issue.

##### yelb-appserver logs

```bash
$ monk logs yelb/appserver
[2021-05-15 14:40:43] INFO  WEBrick 1.3.1
[2021-05-15 14:40:43] INFO  ruby 2.4.2 (2017-09-14) [x86_64-linux]
== Sinatra (v2.0.5) has taken the stage on 4567 for production with backup from WEBrick
[2021-05-15 14:40:43] INFO  WEBrick::HTTPServer#start: pid=7 port=4567
```

The `WEBrick::HTTPServer#start` message indicates the app server is running properly.

### Checking Connectivity

Now we need to check to see if we can open our application. Since this is web app, it should listen on port 80. We can test this with `curl`:

```bash
$ curl localhost
curl: (7) Failed to connect to localhost port 80: Connection refused
```

The connection refused message means we didn't expose our application properly.

## Fixing Problems

So far we've identified two problems: both related to UI. We can't connect to the web page and there's a problem with a configuration setting that points towards an incorrect appserver container hostname. We know this because we've seen a Service defined called `yelb-appserver` in the Kubernetes manifests.

### Connectivity

Let's take a quick look at the original YAML for Kubernetes.

```bash title="Kubernetes"
apiVersion: v1
kind: Service
metadata:
name: yelb-ui
labels:
    app: yelb-ui
    tier: frontend
spec:
type: NodePort
ports:
- port: 80
    protocol: TCP
    targetPort: 80
    # nodePort: 32777 <- if not specified, the system will generate a nodePort value
selector:
    app: yelb-ui
    tier: frontend
```

We can see that `Service` listens and redirects requests to port 80. Lets amend our `yelb/ui` spec to match that. To do that, we simply need to add a `ports` section to our manifest.

```bash title="Monk"
namespace: /yelb

ui:
defines: runnable
containers:
    yelb-ui:
    image-tag: "0.7"
    image: mreferre/yelb-ui
    ports:
        - 80:80
```

Now we need to update the Kit and our workload:

```bash
$ monk load yelb-ui.yaml
✔ Read files successfully
✔ Loaded yelb-ui.yaml successfully

Loaded 1 runnables, 0 process groups and 0 services in 1 files with 0 errors and 0 warnings
✨ Loaded:
 └─🔩 Runnables:
    └─🧩 yelb/ui

✔ All templates loaded successfully
```

```bash
$ monk update yelb/ui
✔ Starting job... DONE
✔ Preparing nodes DONE
✔ Checking/pulling images DONE
✔ Updating containers DONE
✔ Updating templates-local-yelb-ui-yelb-ui DONE
✔ Stopping old templates-local-yelb-ui-yelb-ui DONE
✔ Removing old templates-local-yelb-ui-yelb-ui DONE
✔ Starting new templates-local-yelb-ui-yelb-ui DONE
✔ ✨yelb/ui updated successfully
🔩 yelb/ui
 └─🧊 local
    └─📦 templates-local-yelb-ui-yelb-ui
       ├─🧩 mreferre/yelb-ui:0.7
       └─🔌 open localhost:80 -> 80
```

Now we can see our port redirection definition worked (via the `open localhost:80 -> 80` message in the output). However, a `curl` test might still fail due to an incorrect nginx configuration as we've seen previously.

### Nginx Configuration

The application is configured to automatically redirect requests to appserver listening on the `yelb-appserver` address. We can check if there's any possibility that we can overwrite this by using some environment variables or perhaps a startup parameter. To check that, we will simply use the `docker inspect` command on the image that the ui uses.

```bash
$ docker image ls | grep ui
mreferre/yelb-ui                0.7           959bb4605293   9 months ago    167MB

$ docker inspect 959bb4605293^C
(...)
            "Env": [
                "PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin",
                "NGINX_VERSION=1.17.10",
                "NJS_VERSION=0.3.9",
                "PKG_RELEASE=1~buster",
                "UI_ENV=prod"
            ],
            "Cmd": [
                "./startup.sh"
            ],
...
```

Unfortunately, in this case, there's no environment variables that we could overwrite. Let's see what's in the startup script. We can check it by trying to start container with a command to check the contents of the startup script or by going to the GitHub repository and opening the corresponding file.

1. Check the file [here](https://github.com/mreferre/yelb/blob/master/yelb-ui/startup.sh).
2. Run `docker run 959bb4605293 cat /startup.sh` command.

We need to update `proxy_pass http://yelb-appserver:4567/api;` with the real name of docker container running our `yelb-appserver`.

We will utilise three the MonkOS features here:

1. `bash` [option](../monkscript/yaml/runnables#container) that will overwrite our docker command.
2. `get-hostname` [function](../monkscript/scripting/operators/network#get-hostname-get-container-ip), as Monk sometimes changes the name of the container.
3. `variables` [section](../monkscript/yaml/runnables#variables) of the YAML definition.

Lets combine all the information into our YAML file:

```bash title="Monk"
namespace: /yelb

ui:
defines: runnable
containers:
    yelb-ui:
    image-tag: "0.7"
    image: mreferre/yelb-ui
    ports:
        - 80:80
    bash: <- `sed -e "s/yelb-appserver/${yelb-appserver-addr}/g" -i /startup.sh &&
        /startup.sh`

variables:
    port: 80
    yelb-appserver-addr:
    type: string
    # get-hostname syntax is "namespace/runnable", "container_name"
    value: <- get-hostname("yelb/appserver", "yelb-appserver")
```

We should now update our Kit and workload.

```bash
$ monk load yelb-ui.yaml
(...)
$ monk update yelb/ui
(...)
$ monk logs -f yelb/ui
(...)
```

The `monk logs -f yelb/ui` will tail the logs. Now, launch a web browser and try open the page. Some logs should start appearing.

```bash
(...)
192.168.0.90 - - [15/May/2021:15:50:30 +0000] "GET //api/outback HTTP/1.1" 500 30 "http://monk03.lan/" "Mozilla/5.0 (X11; Linux x86_64; rv:88.0) Gecko/20100101 Firefox/88.0" "-"
192.168.0.90 - - [15/May/2021:15:50:30 +0000] "GET //api/getvotes HTTP/1.1" 500 30 "http://monk03.lan/" "Mozilla/5.0 (X11; Linux x86_64; rv:88.0) Gecko/20100101 Firefox/88.0" "-"
```

Judging by the logs while trying to 'Vote' on the page, we can see the functionaly is still broken.

### Fixing appserver

We know the /api functionality is being proxied to our yelb-appserver by examining the nginx configuration of the UI. Let's check its logs:

```bash
$ monk logs yelb/appserver
(...)
172.23.0.5 - - [15/May/2021:15:50:25 UTC] "GET /api/getstats HTTP/1.1" 500 30
http://monk03.lan/ -> /api/getstats
2021-05-15 15:50:26 - PG::ConnectionBad - could not translate host name "yelb-db" to address: Name or service not known
(...)
172.23.0.5 - - [15/May/2021:15:50:25 UTC] "GET /api/getvotes HTTP/1.1" 500 30
http://monk03.lan/ -> /api/getvotes
2021-05-15 15:50:25 - Redis::CannotConnectError - Error connecting to Redis on redis-server:6379 (SocketError):
(...)
```

We have similar problem like we had with our UI--the application looks for its components on predefined addresses. We will have to update appserver as well, so it can connect to proper containers. Again, we will have a look at our container.

Let's check our appserver image, similar way like we did with UI:

```bash
$ docker image ls | grep appserver
mreferre/yelb-appserver         0.5           94e995994d78   23 months ago   429MB

$ docker inspect 94e995994d78
(...)
            "Env": [
                "PATH=/opt/bitnami/ruby/bin:/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin",
                "BITNAMI_APP_NAME=ruby",
                "BITNAMI_IMAGE_VERSION=2.4.2-r1",
                "LANG=en_us.UTF-8",
                "LC_ALL=C.UTF-8",
                "RACK_ENV=production"
            ],
            "Cmd": [
                "./startup.sh"
            ],
```

There seems to be nothing that would allow us to change easily those two. Let's check what's in the `startup.sh` script by either:

1. Checking its [file in github](https://github.com/mreferre/yelb/blob/master/yelb-appserver/startup.sh), or
2. Running `docker run 94e995994d78 cat /startup.sh`.

Now we know it basically runs `/app/yelb-appserver.rb`. Again, we will have to check the contents of the file to see if we can sort out the problems we're having. We can see that part of the file consists partially static configuration:

```bash
  set :redishost, "redis-server"
  set :port, 4567
  set :yelbdbhost => "yelb-db"
  set :yelbdbport => 5432
  set :yelbddbrestaurants => ENV['YELB_DDB_RESTAURANTS']
  set :yelbddbcache => ENV['YELB_DDB_CACHE']
  set :awsregion => ENV['AWS_REGION']
```

Unfortunately, the options we would like to change are hardcoded into application. We need to modify the file again and overwrite `Cmd` in our docker container. Keeping all this in mind, let's prepare our new appserver manifest by using [arrow script](../monkscript/yaml#arrow-scripts), `get-hostname` [function](../monkscript/scripting/operators/network/) and `variables` [section](../monkscript/yaml/runnables#variables).

Our YAML should look like:

```yaml title="Monk"
namespace: /yelb

appserver:
    defines: runnable
    containers:
        yelb-appserver:
            image-tag: "0.5"
            image: mreferre/yelb-appserver
            bash:
                <- `sed -e "s/yelb-db/${yelb-db-addr}/g" -i /app/yelb-appserver.rb &&
                sed -e "s/redis-server/${yelb-redis-addr}/g" -i /app/yelb-appserver.rb &&
                /startup.sh`

    variables:
        port: 4567
        yelb-db-addr:
            type: string
            value: <- get-hostname("yelb/db", "yelb-db")

        yelb-redis-addr:
            type: string
            value: <- get-hostname("yelb/redis", "redis-server")
```

We should update our Kit and workload.

```bash
$ monk load yelb-appserver.yaml
(...)
$ monk update yelb/appserver
(...)
$ monk logs -f yelb/appserver
(...)
```

We can now open the webpage again. It should now work correctly.

## Process Groups

Now that we have everything working together without any problems, we can 'beutify' our configuration a bit. We'll start by removing our workload to demonstrate how having predefined templates lets us start of our workloads all at once.

```bash
$ monk purge local/yelb/db
(...)
$ monk purge local/yelb/appserver
(...)
$ monk purge local/yelb/ui
(...)
$ monk purge local/yelb/redis
(...)
```

To define a [process group](../monkscript/yaml/groups.md), we'll have to create YAML with list of runnables that will be part of our group. It will look like:

```yaml title="Monk"
namespace: /yelb

# We will call our group 'application'
application:
    defines: process-group

    # And we will put a list of runnables that will consist of this group
    runnable-list:
        - /yelb/appserver
        - /yelb/db
        - /yelb/ui
        - /yelb/redis
```

This will create a group called `application` which we can operate via `yelb/application` syntax.

Let's load it and try to start it.

```bash
$ monk load yelb-group.yaml
✔ Read files successfully
✔ Loaded yelb-group.yaml successfully

Loaded 0 runnables, 1 process groups and 0 services in 1 files with 0 errors and 0 warnings
✨ Loaded:
 └─🔗 Process groups:
    └─🧩 yelb/application

✔ All templates loaded successfully
```

```bash
$ monk run yelb/application
✔ Starting the job... DONE
✔ Preparing nodes DONE
✔ Checking/pulling images DONE
✔ Starting containers DONE
✔ New container templates-local-yelb-appserver-yelb-appserver created DONE
✔ New container templates-local-yelb-db-yelb-db created DONE
✔ New container templates-local-yelb-ui-yelb-ui created DONE
✔ Started yelb/application

✨ All done!

🔩 yelb/application
 └─🧊 local
    ├─📦 templates-local-yelb-db-yelb-db
    │  └─🧩 mreferre/yelb-db:0.5
    ├─📦 templates-local-yelb-ui-yelb-ui
    │  ├─🧩 mreferre/yelb-ui:0.7
    │  └─🔌 open localhost:80 -> 80
    ├─📦 templates-local-yelb-appserver-yelb-appserver
    │  └─🧩 mreferre/yelb-appserver:0.5
    └─📦 templates-local-yelb-redis-redis-server
       └─🧩 redis:4.0.2

💡 You can inspect and manage your above stack with these commands:
        monk logs (-f) yelb/application - Inspect logs
        monk shell     yelb/application - Connect to the container shell
        monk do        yelb/application/action_name - Run defined action (if exists)
💡 Check monk help for more!
```

```bash
$ monk ps
✔ Got state
Group/Runnable/Containers                               Uptime   Peer   Ports
🔗 local/yelb/application
   🔩 local/yelb/appserver
    └─📦 templates-local-yelb-appserver-yelb-appserver  48s      local
   🔩 local/yelb/db
    └─📦 templates-local-yelb-db-yelb-db                38s      local
   🔩 local/yelb/ui
    └─📦 templates-local-yelb-ui-yelb-ui                25s      local  80:80
   🔩 local/yelb/redis
    └─📦 templates-local-yelb-redis-redis-server        12s      local
```

All our components have been started at once!

Our application should be running exactly the same as previously, but this gives us more flexibility and makes for a lot less work in the future as we can operate on the whole group or individual components.

## Using Inheritance to Spawn Multiple Copies of YELB

MonkOS is very powerful. We can spawn multiple instances of the same app via inheritence with existing Kits.

### Our Development Environment

We can safely assume that we were working on our development environment. So the last command we have executed `monk run yelb/application` spawned our YELB dev app.

### Moving to Production

To spawn another instance of the YELB app for production, we will use Monk's [inheritance](../monkscript/yaml/index.md#inheritance) feature. This allows us to inherit a predefined Kit and only update the parts we want to change.

Let's define our namespace and add our db and redis [runnable](../monkscript/yaml/runnables/) components in the Kit.

```yaml title="Monk"
namespace: /yelb-production

db:
    defines: runnable
    inherits: yelb/db

redis:
    defines: runnable
    inherits: yelb/redis
```

In this example, we're defining a new namespace for production and adding two [runnables](../monkscript/yaml/runnables/). Each runnable inherits from existing Kits via the `inherits` parameter.

Now we will have to add our appserver and ui. We'll need to do a bit more as we had to use some workarounds in development mode. Fortunately, the inheritance will make this task easier.

Lets start with appserver. We need to:

1. Add the `image-tag` option.
2. Add new `variables` to reflect the proper namespace in our `get-hostname` functions.

Our `appserver` definition will look like that:

```yaml title="Monk"
appserver:
    defines: runnable
    # We are inheriting main runnable yelb/appserver
    inherits: yelb/appserver
    containers:
        # We will overwrite our image-tag here, all other definition of the runnable will stay the same
        yelb-appserver:
            image-tag: "0.4"

    # Update the namespace in our variables, changing it from yelb to yelb-production
    variables:
        yelb-db-addr:
            type: string
            value: <- get-hostname("yelb-production/db", "yelb-db")

        yelb-redis-addr:
            type: string
            value: <- get-hostname("yelb-production/redis", "redis-server")
```

Finally, we will look at UI, which will be less problematic. For that, we'll just need to update its varliables.

```yaml title="Monk"
ui:
    defines: runnable
    # Inherit yelb/ui
    inherits: yelb/ui

    variables:
        # Update our appserver hostname here with production version
        yelb-appserver-addr:
            type: string
            value: <- get-hostname("yelb-production/appserver", "yelb-appserver")
```

The final YAML should look like this:

```yaml title="Monk"
namespace: /yelb-production

db:
    defines: runnable
    inherits: yelb/db

redis:
    defines: runnable
    inherits: yelb/redis

appserver:
    defines: runnable
    inherits: yelb/appserver
    containers:
        yelb-appserver:
            image-tag: "0.4"

    variables:
        yelb-db-addr:
            type: string
            value: <- get-hostname("yelb-production/db", "yelb-db")

        yelb-redis-addr:
            type: string
            value: <- get-hostname("yelb-production/redis", "redis-server")

ui:
    defines: runnable
    inherits: yelb/ui

    variables:
        yelb-appserver-addr:
            type: string
            value: <- get-hostname("yelb-production/appserver", "yelb-appserver")

application:
    defines: process-group

    runnable-list:
        - /yelb-production/appserver
        - /yelb-production/db
        - /yelb-production/ui
        - /yelb-production/redis
```

Since this is our production Kit, it might be good idea to run it on some public cloud services. To do this, you'll need to have a cloud provider added. To learn more, please see ["Monk in 10 minutes" guide](../basics/monk-in-10#growing-your-new-cluster).

Assuming we have AWS as the provider, we can simply run:

**Grow our Cluster**

```yaml
$ monk cluster grow -p aws -n monkNode -t aws -i t2.medium -r us-east-1 -d 15 -m 1
(...)
```

**Run our Workload**

```bash
$ monk run -t aws yelb-production/application
(...)
```

**Testing**

Simply open a browser with the address returned by Monk.
---
title: "Multi-Cloud Deployments"
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

MonkOS clusters are capable of spanning across multiple cloud environments while MonkOS handles all cloud specific aspects of such setup.

## Prerequisites

You need a cluster with at least two cloud providers added.
See: [how to add cloud providers](cloud-provider).

Pick a pair of clouds you have credentials for eg. let **cloud A** be **AWS** and **cloud B** be **GCP**. The instructions apply to any pair of clouds and you can always add more than two if you wish.

## Step 1: Add instances on cloud A

We will start by provisioning two nodes on one of the clouds:

    monk cluster grow

MonkOS will ask several questions about new instances, see example answers below:

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

After completing the survey, MonkOS will create instances according to your choices. Output from a successful run looks like this:

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

After completing above steps, you should have a multi-cloud MonkOS cluster running. To confirm that all nodes were started issue the following command:

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

You are now running a MonkOS cluster spanning across two clouds. This cluster will behave as any other MonkOS cluster as MonkOS manages all supported cloud environments in a transparent manner. This new cluster is capable of running any Monk Kit and the workloads will be distributed to all instances available.
---
title: Content Creation
---

# Content Creation

MonkOS Contributor Program rewards individuals who share their knowledge and spread the word about MonkOSOS on the internet.

:::success Earn up to $300 per article or video!

If you:
- wrote a blog post or an article referring to MonkOS,
- recorded a tutorial video on how to use MonkOS,
- live-steramed yourself using MonkOS, 
- did a podcast episode about MonkOS,
- mentioned MonkOS on social media and people liked it,
  
then MonkOS Contributor Program is for you, read on! 😀

:::



## Eligible Content

In order to be eligible for a reward, your content must check all of these boxes:

- Your content must be in English,
- Your content must be related to MonkOS,
- Your content must be original (and you can prove it),
- Your content should be published on your own website/blog or at least one of:
  - [Youtube](https://www.youtube.com/)
  - [Twitter](https://twitter.com/)
  - [Twitch](https://www.twitch.tv/)
  - [Medium](https://medium.com/)
  - [Substack](https://substack.com/)
  - [DZone](https://dzone.com/)
  - [Dev.To](https://dev.to/)
  - [IndieHackers](https://www.indiehackers.com/)
- Your content must be linked on at least one of:
  - [Reddit](https://www.reddit.com/)
  - [HackerNews](https://news.ycombinator.com/)
  - [lobste.rs](https://lobste.rs/)
  - [Twitter](https://twitter.com/)

## Submit Your Content

Submitting content is simple:

1. [Sign up](../get-started/acc-and-auth) for a MonkOS account (if you don't have one already!),
2. Join [MonkOS Discord Server](https://discord.gg/monk-io) and link your content in **[#content](https://discord.com/channels/760852235000348703/950793772382420992)** channel,
3. We will review your content and get back to you regarding next steps,
4. If accepted, your content will be featured on our [Resources](https://monk.io/resources) page.

## Rewards

Our team will review your content and put into one of three tiers at their discretion. Judging is based on social reach, production value and effort you put into your content. You can get only rewarded once for a single piece of content.

| Tier     | Articles, posts, tweets | Video, audio, multimedia |
| -------- | ----------------------- | ------------------------ |
| 🥇 gold   | $150                    | $300                     |
| 🥈 silver | $75                     | $150                     |
| 🥉 bronze | $25                     | $50                      |

:::caution The reward amounts may change without notice

MonkOS Contributor Program rules apply. [Read more &#8594;](.)

:::


---
title: Bug Bounty
---

# Bug Bounty

Strong security out-of-box is one of the main design goals of MonkOS. Like any respectable piece of software, MonkOS is constantly patched and improved to make sure that it cannot be exploited. Our team is happy to work with anyone who discovers a new way to make MonkOS go *bzzzzt*.

:::success Earn up to $3000 per exploit!  

If you have discovered a security vulnerability in MonkOS let us know!

:::

## Eligibility

In order to be eligible for a Bug Bounty reward:

- Your report must be original, describing a previously undiscovered vulnerability,
- Report must contain a working proof of concept demonstrating the vulnerability,
- Reported vulnerability was not disclosed publicly,
- Do no harm:
  - Do not attack accounts and clusters that do not belong to you,
  - Do not access data that does not belong to you,
- Your vulnerability report must pertain to one of the following scopes:
  - Any endpoint on `monk.io` and `*.monk.io`, or any public system ran by MonkOS that you can find,
  - MonkOS authentication and account lifecycle,
  - Remote and local exploitation of `monkd`,
  - Remote exploitation of MonkOS clusters running on different cloud environments.

Moreover, we reserve the right to reject reports that are purely theoretical, plainly obvious or rely on attack vectors outside our control.

## Submit Your Report 

Contact us via:
- [MonkOS Discord Server](https://discord.gg/monk-io), channel: **[#bugs-and-fixes](https://discord.com/channels/760852235000348703/760855409992531998)**
- Email: [bugs@monk.io](mailto:bugs@monk.io)

We will get back to you with next steps.

## Rewards 

Our team will review your report and put into one of three tiers at their discretion. The exact reward amount depends on the vulnerability severity. You can get only rewarded once for a single vulnerability.

| Tier     | Reward        | Severity                        |
| -------- | ------------- | ------------------------------- |
| 🥇 gold   | $1500 - $3000 | High, medium-high probablility  |
| 🥈 silver | $500 - $1500  | Medium, medium-high probabliity |
| 🥉 bronze | $100 - $500   | Low or low probability          |

Issues without security impact are most welcome but they do not qualify for a reward.

:::caution The reward amounts may change without notice

MonkOS Contributor Program rules apply. [Read more &#8594;](.)

:::
---
title: Kit Creation
---

# Kit Creation

Monk Kits published on [monkhub.io](https://monkhub.io) are constantly ranked by their usage. The more people install and run your Kit, the higher it gets in the ranking. 

Publishers of the most popular Kits are rewarded with money each month! (Even more than once!)

:::success Earn rewards for maintaining your Monk Kits!

Did you make a good Kit for a popular database, or maybe you run a well configured Kafka cluster using Monk?
It's worth to publish it on [monkhub.io](https://monkhub.io) and start earning!

All you have to do is follow [our Kit publishing guide &#8594;](#).

:::

## Eligibility

- You must have a MonkOS account (you need it to publish your Kit anyway), 
- Your Kit must be published on [monkhub.io](https://monkhub.io).
- Your Kit must be original, actively maintained and made by you (we check),
- Your Kit must adhere to the publishing standards [Read more about making a good Kit &#8594;](#)
<!-- FIXME: we need the publishing standards. The above just links to the top of the page -->

## Kit Ranking and Rewards 

All Kits on [monkhub.io](https://monkhub.io) are being constantly ranked by popularity which is a function of number of deployments and their aggregate runtime at large.

:::caution MonkOS Inc. reserves right to adjust the ranking

Kit Ranking is all about fair play. We slash Kits that appear to be unfairly boosted and ban their publishers from competing for rewards.

Additionally, the reward will be witheld if the total aggregate runtime of a Kit is shorter than certain threshold.

:::

Top 20 Kits are selected at the end of each month and their creators are automatically awarded an amount according to the table below.

| Place | Reward |
| ----- | ------ |
| 🥇 1st | $2550  |
| 🥈 2nd | $1550  |
| 🥉 3rd | $1100  |
| 4     | $850   |
| 5     | $650   |
| 6     | $500   |
| 7     | $400   |
| 8     | $350   |
| 9     | $300   |
| 10    | $250   |
| 11    | $200   |
| 12    | $150   |
| 13    | $100   |
| 14    | $100   |
| 15    | $100   |
| 16    | $50    |
| 17    | $50    |
| 18    | $50    |
| 19    | $50    |
| 20    | $50    |

If you created more than one Kit in the ranking - you get both rewards. If your Kit(s) stays in the ranking for more than one month - you get all the rewards. Rewards accumulate until claimed. You can always check your rewards in [your dashboard](#).

If you get rewarded at any point we will contact you via the email address associated with your MonkOS account in order to arrange the payout.

If for some reason you didn't hear from us, in order to claim your rewards reach us at:
- [MonkOS Discord Server](https://discord.gg/monk-io), channel: **[#bugs-and-fixes](https://discord.com/channels/760852235000348703/760855409992531998)**
- Email: [rewards@monk.io](mailto:rewards@monk.io)

We are obligated to verify your identity and authorship of the Kits before making any payments.

:::caution The reward amounts may change without notice

MonkOS Contributor Program rules apply. [Read more &#8594;](.)

:::




---
title: Contributor Program
---

import CustomLink from '@site/src/components/customLink';

# MonkOS Contributor Program

MonkOS Contributor Program rewards MonkOS users for creating popular Kits, sharing their knowledge and finding bugs. 

## Joining

Learn how to contribute and earn rewards for:

<CustomLink to="./content">Content Creation</CustomLink>
<CustomLink to="./bugs">Bug Bounty</CustomLink>

You're most welcome to participate on more than one front! 😎

## Rewards

You can earn from $25 to $3000 one-time rewards for submitting content and bug reports.

## General Rules

There are some basic rules that apply:

- Any person can enter MonkOS Contributor Program by:
  - Signing up for a MonkOS account,
  - Following steps outlined in documents linked above,
- Each contributor wishing to receive rewards is bound by the [Contributor Agreement](#).
- Reward amounts may change without notice,
- MonkOS team reviews all applications and has the final say in granting the reward and its amount,
- MonkOS reserves the right to withold rewards and ban contributors in justified circumstances.

## Ranking

Users participating in MonkOS Contributor Program are ranked by total amount of rewards received. 

Contributor ranking is publicly visible at all times on [this page](#). Your contributor profile will be visible there once you win your first reward.



---
title: Working with MonkScript
---

# Working with MonkScript

This document describes basic ideas and workflow behind authoring Monk Kits. Check the reference in order to understand MonkScript itself.

:::note

See the [MonkScript YAML](./yaml) reference.

:::

## Manifest files and project structure

MonkOS keeps all its data, including Kits in an internal tree-like data structure. Kits are stored as individual parts of that tree. YAML files are a human-friendly way to express tree-like structures and thus, we have used YAML as our primary input format.

It is important to remember that since MonkOS doesn't work with those files directly, their source of origin and layout in the filesystem tree is arbitrary. This gives a lot of flexibility to the user and allows the user to choose the best organization strategy for a particular use case.

Each manifest file must start with a `namespace` declaration - it allows MonkOS to put data coming from many files into a common root in its database. The logic here is that each file merely contains a set of trees that should be attached to some root. `namespace` declaration instructs the loader to add the file contents under a specific root.

## Picking a namespace

A good name for a [`namespace`](./yaml/index.md#namespaces) is unique and short. Suitable candidates are:

-   your name,
-   name of your company,
-   name of your project.

Any of those will do as long as they don't clash with an existing namespace available via the hub - in case of name collision, your namespace will shadow the existing one.

## Storing manifests

The notion of the namespace eliminates the need to keep all the files pertaining to one project in one place. A MonkOS cluster could, for instance, load many files describing particular services, from their git repositories and do so asynchronously. They will still end up grouped together in Monk's internal database.

## Loading manifests

In order for MonkOS to be aware of a Kit, the file containing the Kit must be loaded. This is achieved by using the `load` command.

    monk load mystuff.yaml

Remember to reload (use the load command again) any file that has been changed in order for MonkOS to acknowledge the changes. This is very important when developing the Kits as forgetting to reload a Kit often leads to confusion.

Example development flow:

1. Create a manifest: `mystuff.yaml`
2. Load the manifest for the first time: `monk load mystuff.yaml`
3. Find out you've made a mistake
4. Edit the manifest
5. Go to step 2 😀
---
title: HTTP
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

## `http-get`

<Tabs
  defaultValue="signature"
  values={[
    {label: 'Signature', value: 'signature'},
    {label: 'Example', value: 'example'},
  ]}
>

<TabItem value="signature">

```clojure
| http-get(url String, options Object?) | (body String)
```

</TabItem>

<TabItem value="example">

```clojure
http-get("https://yesno.wtf/api") parse-json get-member("answer") => "yes"
```

</TabItem>

</Tabs>

Http(s) GET `url`, results in response `body` as a string or `nil` on error.
Takes an optional `options` object, currently only supports `headers`.

## `http-post`

<Tabs
  defaultValue="signature"
  values={[
    {label: 'Signature', value: 'signature'},
    {label: 'Example', value: 'example'},
  ]}
>

<TabItem value="signature">

```clojure
(req-body String) | http-post(url String, options Object?) | (body String)
```

</TabItem>

<TabItem value="example">

```clojure
"foo" http-post("https://postman-echo.com/post") => "fooo"
```

</TabItem>

</Tabs>

Http(s) POST to `url` with `req-body` as the request body, results in response `body` as a string or `nil` on error.
Takes an optional `options` object, currently only supports `headers`.
---
title: Network
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

## `peer-ip-address`

<Tabs
  defaultValue="signature"
  values={[
    {label: 'Signature', value: 'signature'},
    {label: 'Example', value: 'example'},
  ]}
>

<TabItem value="signature">

```clojure
| peer-ip-address("namespace/runnable-path", String)
```

</TabItem>

<TabItem value="example">

```clojure
peer-ip-address("hello/world") => "1.2.3.4"
```

</TabItem>

</Tabs>

Returns external IP of the node that the runnable is running on.

## `get-hostname`, `get-container-ip`

<Tabs
  defaultValue="signature"
  values={[
    {label: 'Signature', value: 'signature'},
    {label: 'Example', value: 'example'},
  ]}
>

<TabItem value="signature">

```clojure
| get-hostname(runnable-path String, container-name String) | (container-hostname String)
```

</TabItem>

<TabItem value="example">

```clojure
get-hostname("foo/bar","baz") => "foo-bar_baz"
```

</TabItem>

</Tabs>

Finds a container by its `runnable-path` and name `container-name` and returns its
hostname `container-hostname` on the overlay DNS or the bridge network as a fallback.

## `ip-address-public`

<Tabs
  defaultValue="signature"
  values={[
    {label: 'Signature', value: 'signature'},
    {label: 'Example', value: 'example'},
  ]}
>

<TabItem value="signature">

```clojure
| ip-address-public | (ip String)
```

</TabItem>

<TabItem value="example">

```clojure
ip-address-public => "1.2.3.4"
```

</TabItem>

</Tabs>

Returns current public `ip` of the node it was executed on.
The address is obtained by calling `http://ipecho.net/plain`.
---
title: Strings
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

## `concat`

<Tabs
  defaultValue="signature"
  values={[
    {label: 'Signature', value: 'signature'},
    {label: 'Example', value: 'example'},
  ]}
>

<TabItem value="signature">

```clojure
(b String) (a String) | concat | (a+b String)
```

</TabItem>

<TabItem value="example">

```clojure
"foo" "bar" concat => "foobar"
```

</TabItem>

</Tabs>

Concatenates two strings and puts the result onto the stack.

## `concat-all`

<Tabs
  defaultValue="signature"
  values={[
    {label: 'Signature', value: 'signature'},
    {label: 'Example', value: 'example'},
  ]}
>

<TabItem value="signature">

```clojure
<mark> (as ...String) | concat-all | (a String)
```

</TabItem>

<TabItem value="example">

```clojure
"a" "b" "c" "d" concat-all => "abcd"
```

</TabItem>

</Tabs>

Concatenates all the strings on the stack down to the mark andputs the result on the stack.

## `trim`

<Tabs
  defaultValue="signature"
  values={[
    {label: 'Signature', value: 'signature'},
    {label: 'Example', value: 'example'},
  ]}
>

<TabItem value="signature">

```clojure
(x String) | trim | (y String)
```

</TabItem>

<TabItem value="example">

```clojure
" foo " trim => "foo"
```

</TabItem>

</Tabs>

Removes trailing and leading whitespace around a string.
---
title: JSON
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

## `parse-json`

<Tabs
  defaultValue="signature"
  values={[
    {label: 'Signature', value: 'signature'},
    {label: 'Example', value: 'example'},
  ]}
>

<TabItem value="signature">

```clojure
(x String) | parse-json | (y Any)
```

</TabItem>

<TabItem value="example">

```clojure
'[{"foo": 99}, 6]' parse-json => [{"foo": 99}, 6]
```

</TabItem>

</Tabs>

Parses a JSON string `x` and returns its value `y`.

## `to-json`

<Tabs
  defaultValue="signature"
  values={[
    {label: 'Signature', value: 'signature'},
    {label: 'Example', value: 'example'},
  ]}
>

<TabItem value="signature">

```clojure
(x Any) | to-json | (y String)
```

</TabItem>

<TabItem value="example">

```clojure
[{"foo": 99}, 6] to-json => '[{"foo": 99}, 6]'
```

</TabItem>

</Tabs>

Turns any value `x` into its JSON string representation `y`.
---
title: JSON-RPC
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

## `rpc-call`

<Tabs
  defaultValue="signature"
  values={[
    {label: 'Signature', value: 'signature'},
    {label: 'Example', value: 'example'},
  ]}
>

<TabItem value="signature">

```clojure
(url String) | rpc-call(method String, args Any, ...) | (response Any)
```

</TabItem>

<TabItem value="example">

```clojure
"http://localhost:4040/" rpc-call("count", ["foo", 7]) get-member("result") => 2
```

</TabItem>

</Tabs>

Calls JSON-RPC method `method` on `url` with any number of `args`. The response is
converted to an appropriate data type automatically.
---
title: Entities
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

## `entity`

<Tabs
  defaultValue="signature"
  values={[
    {label: 'Signature', value: 'signature'},
    {label: 'Example', value: 'example'},
  ]}
>

<TabItem value="signature">

```clojure
| entity(entity-path String) | (entity Object)
```

</TabItem>

<TabItem value="example">

```clojure
entity("foo/bar") get-member("foo") => "bar"
```

</TabItem>

</Tabs>

Returns entity definition.

## `entity-state`

<Tabs
defaultValue="signature"
values={[
{label: 'Signature', value: 'signature'},
{label: 'Example', value: 'example'},
]}
>

<TabItem value="signature">

```clojure
| entity-state(entity-path String) | (entity-state Object)
```

</TabItem>

<TabItem value="example">

```clojure
entity-state("foo/bar") get-member("foo") => "bar"
```

</TabItem>

</Tabs>

Returns entity state.
---
title: Maths
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

## `add`

<Tabs
  defaultValue="signature"
  values={[
    {label: 'Signature', value: 'signature'},
    {label: 'Example', value: 'example'},
  ]}
>

<TabItem value="signature">

```clojure
(a Number) (b Number) | add | (a + b Number)
```

</TabItem>

<TabItem value="example">

```clojure
1 2 add => 3
```

</TabItem>

</Tabs>

Adds two numbers and returns the result.
This operation promotes the result to a proper type based on argument types.

## `cmp`

<Tabs
  defaultValue="signature"
  values={[
    {label: 'Signature', value: 'signature'},
    {label: 'Example', value: 'example'},
  ]}
>

<TabItem value="signature">

```clojure
(a Number) (b Number) | cmp | (a == b Bool)
```

</TabItem>

<TabItem value="example">

```clojure
7 2 cmp => false
```

</TabItem>

</Tabs>

Compares two numbers.

## `div`

<Tabs
  defaultValue="signature"
  values={[
    {label: 'Signature', value: 'signature'},
    {label: 'Example', value: 'example'},
  ]}
>

<TabItem value="signature">

```clojure
(a Number) (b Number) | div | (a / b Number)
```

</TabItem>

<TabItem value="example">

```clojure
1 2 div => 0.5
```

</TabItem>

</Tabs>

Divides `a` by `b` and returns the result.
This operation promotes the result to a proper type based on argument types.

## `mult`

<Tabs
  defaultValue="signature"
  values={[
    {label: 'Signature', value: 'signature'},
    {label: 'Example', value: 'example'},
  ]}
>

<TabItem value="signature">

```clojure
(a Number) (b Number) | mult | (a * b Number)
```

</TabItem>

<TabItem value="example">

```clojure
2 2 mult => 4
```

</TabItem>

</Tabs>

Multiplies two numbers and returns the result.
This operation promotes the result to a proper type based on argument types.

## `sub`

<Tabs
  defaultValue="signature"
  values={[
    {label: 'Signature', value: 'signature'},
    {label: 'Example', value: 'example'},
  ]}
>

<TabItem value="signature">

```clojure
(a Number) (b Number) | sub | (a - b Number)
```

</TabItem>

<TabItem value="example">

```clojure
1 2 sub => -1
```

</TabItem>

</Tabs>

Subtracts `b` from `a` and returns the result.
This operation promotes the result to a proper type based on argument types.
---
title: Internals
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

## `append`

<Tabs
  defaultValue="signature"
  values={[
    {label: 'Signature', value: 'signature'},
    {label: 'Example', value: 'example'},
  ]}
>

<TabItem value="signature">

```clojure
(a Array) (x Any) | append | ([..., x] Array)
```

</TabItem>

<TabItem value="example">

```clojure
[] 8 append 9 append append => [8, 9]
```

</TabItem>

</Tabs>

Appends `x` to array `a`, leaves `a` on the stack.

## `array`

<Tabs
  defaultValue="signature"
  values={[
    {label: 'Signature', value: 'signature'},
    {label: 'Example', value: 'example'},
  ]}
>

<TabItem value="signature">

```clojure
| array | Array
```

</TabItem>

<TabItem value="example">

```clojure
array => []
```

</TabItem>

</Tabs>

Constructs an empty Array and pushes it to the stack.

## `assoc`

<Tabs
  defaultValue="signature"
  values={[
    {label: 'Signature', value: 'signature'},
    {label: 'Example', value: 'example'},
  ]}
>

<TabItem value="signature">

```clojure
(ob Object) (key String) (value Any) | assoc | (ob Object)
```

</TabItem>

<TabItem value="example">

```clojure
{} "foo" 6 assoc => {"foo": 6}
```

</TabItem>

</Tabs>

Sets `key` on the `ob` to `value` and leaves `ob` on the stack.

## `call`

<Tabs
  defaultValue="signature"
  values={[
    {label: 'Signature', value: 'signature'},
  ]}
>

<TabItem value="signature">

```clojure
(op-name String) (args [Any]) | call | (result Any)
```

</TabItem>

</Tabs>

Calls an operator `op-name` with arguments `args` and puts the `result` of its execution on the stack.

## `callf`

<Tabs
  defaultValue="signature"
  values={[
    {label: 'Signature', value: 'signature'},
  ]}
>

<TabItem value="signature">

```clojure
(op-name String) (args [Any]) | callf | (result Any)
```

</TabItem>

</Tabs>

Calls an operator `op-name` with arguments `args` and puts the `result` of its execution on the stack.

## `const`

<Tabs
  defaultValue="signature"
  values={[
    {label: 'Signature', value: 'signature'},
  ]}
>

<TabItem value="signature">

```clojure
| const(x Any) | (x Any)
```

</TabItem>

</Tabs>

Pushes a constant `x` of any type onto the stack.

## `dup`

<Tabs
  defaultValue="signature"
  values={[
    {label: 'Signature', value: 'signature'},
    {label: 'Example', value: 'example'},
  ]}
>

<TabItem value="signature">

```clojure
(x Any) | dup | (x Any) (x Any)
```

</TabItem>

<TabItem value="example">

```clojure
1 dup => 1 1
```

</TabItem>

</Tabs>

Duplicates the topmost value on the stack.

## `get-member`

<Tabs
  defaultValue="signature"
  values={[
    {label: 'Signature', value: 'signature'},
    {label: 'Example', value: 'example'},
  ]}
>

<TabItem value="signature">

```clojure
(ob Object) | get-member(key String) | (val Any)
```

</TabItem>

<TabItem value="example">

```clojure
{"foo": 6} | get-member("foo") | 6
```

</TabItem>

</Tabs>

Gets value `val` from key `key` in object `ob` and pushes `val` onto the stack.
Will return `Nil` if `key` is not in `ob`.

## `mark`

<Tabs
  defaultValue="signature"
  values={[
    {label: 'Signature', value: 'signature'},
  ]}
>

<TabItem value="signature">

```clojure
| mark | <mark>
```

</TabItem>

</Tabs>

Sets mark on top of the stack.

## `object`

<Tabs
  defaultValue="signature"
  values={[
    {label: 'Signature', value: 'signature'},
    {label: 'Example', value: 'example'},
  ]}
>

<TabItem value="signature">

```clojure
| object | Object
```

</TabItem>

<TabItem value="example">

```clojure
object => {}
```

</TabItem>

</Tabs>

Constructs an empty Object and pushes it to the stack.

## `var`

<Tabs
  defaultValue="signature"
  values={[
    {label: 'Signature', value: 'signature'},
    {label: 'Example', value: 'example'},
  ]}
>

<TabItem value="signature">

```clojure
| var(var-name String) | (value Any)
```

</TabItem>

<TabItem value="example">

```clojure
var("foo") => 6
```

</TabItem>

</Tabs>

Pushes the `value` of a variable named `var-name` onto the stack.
---
title: Actions
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Actions
## `act`

<Tabs
  defaultValue="signature"
  values={[
    {label: 'Signature', value: 'signature'},
    {label: 'Example', value: 'example'},
  ]}
>

<TabItem value="signature">

```clojure
| act(action String, arg-name String, arg-value String, ...) | (value Any)
```

</TabItem>

<TabItem value="example">

```clojure
act("namespace/runnable/action_name", "arg1", "val1", "arg2", "val2") => "result of the action"
```

</TabItem>

</Tabs>

Calls an action from path `action` with named arguments `arg-name`=`arg-value`. Accepts any number or argument name-value pairs.
The action will execute in another VM instance local to the running `namespace/runnable` on which it was called.

## `wait-for`

<Tabs
  defaultValue="signature"
  values={[
    {label: 'Signature', value: 'signature'},
    {label: 'Example', value: 'example'},
  ]}
>

<TabItem value="signature">

```clojure
| wait-for(delay Int, max-attempts Int, action String, arg-name String, arg-value String, ...) | (value Any)
```

</TabItem>

<TabItem value="example">

```clojure
wait-for("namespace/runnable/action_name", "arg1", "val1", "arg2", "val2") => "result of the action"
```

</TabItem>

</Tabs>

Attempts to call an action from path `action` with named arguments `arg-name`=`arg-value`.
It will try to call the action `max-attempts` times with `delay` in milliseconds between the attempts.
The action will execute in another VM instance local to the running `namespace/runnable` on which it was called.
---
title: Random
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

## `random-uuid`

<Tabs
  defaultValue="signature"
  values={[
    {label: 'Signature', value: 'signature'},
    {label: 'Example', value: 'example'},
  ]}
>

<TabItem value="signature">

```clojure
| random-uuid | (uuid String)
```

</TabItem>

<TabItem value="example">

```clojure
random-uuid => "d7f2edc5-1ba0-45ab-a360-8927dcce9e42"
```

</TabItem>

</Tabs>

Returns a random UUID4.
---
title: Boolean
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

## `and`

<Tabs
defaultValue="signature"
values={[
{label: 'Signature', value: 'signature'},
{label: 'Example', value: 'example'},
]}>

<TabItem value="signature">

```clojure
(b Bool) (a Bool) | and | (a && b Bool)
```

</TabItem>

<TabItem value="example">

```clojure
true false and => false
```

</TabItem>

</Tabs>

Boolean AND.

## `contains?`, `has?`

<Tabs
defaultValue="signature"
values={[
{label: 'Signature', value: 'signature'},
{label: 'Example', value: 'example'},
]}>

<TabItem value="signature">

```clojure
(a Bool) | contains? | (!a Bool)
```

</TabItem>

<TabItem value="example">

```clojure
true contains? => false
```

</TabItem>

</Tabs>

Boolean NOT.

## `eq?`, `equal?`

<Tabs
defaultValue="signature"
values={[
{label: 'Signature', value: 'signature'},
{label: 'Example', value: 'example'},
]}>

<TabItem value="signature">

```clojure
(a Bool) | eq? | (!a Bool)
```

</TabItem>

<TabItem value="example">

```clojure
true eq? => false
```

</TabItem>

</Tabs>

Boolean NOT.

## `not`

<Tabs
defaultValue="signature"
values={[
{label: 'Signature', value: 'signature'},
{label: 'Example', value: 'example'},
]}>

<TabItem value="signature">

```clojure
(a Bool) | not | (!a Bool)
```

</TabItem>

<TabItem value="example">

```clojure
true not => false
```

</TabItem>

</Tabs>

Boolean NOT.

## `not-equal?`, `not-eq?`

<Tabs
defaultValue="signature"
values={[
{label: 'Signature', value: 'signature'},
{label: 'Example', value: 'example'},
]}>

<TabItem value="signature">

```clojure
(a Bool) | not-equal? | (!a Bool)
```

</TabItem>

<TabItem value="example">

```clojure
true not-equal? => false
```

</TabItem>

</Tabs>

Boolean NOT.

## `or`

<Tabs
defaultValue="signature"
values={[
{label: 'Signature', value: 'signature'},
{label: 'Example', value: 'example'},
]}>

<TabItem value="signature">

```clojure
(b Bool) (a Bool) | or | (a || b Bool)
```

</TabItem>

<TabItem value="example">

```clojure
true false or => true
```

</TabItem>

</Tabs>

Boolean OR.

## `xor`

<Tabs
defaultValue="signature"
values={[
{label: 'Signature', value: 'signature'},
{label: 'Example', value: 'example'},
]}>

<TabItem value="signature">

```clojure
(b Bool) (a Bool) | xor | (a != b Bool)
```

</TabItem>

<TabItem value="example">

```clojure
true true xor => false
```

</TabItem>

</Tabs>

Boolean XOR.
---
title: Numbers
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

## `to-hex`

<Tabs
  defaultValue="signature"
  values={[
    {label: 'Signature', value: 'signature'},
    {label: 'Example', value: 'example'},
  ]}
>

<TabItem value="signature">

```clojure
(x Number) | to-hex(prefix Bool?) | (y String)
```

</TabItem>

<TabItem value="example">

```clojure
16 to-hex(true) => "0xF"
```

</TabItem>

</Tabs>

Converts number `x` to a hex string `y`.
Adds `0x` prefix when `prefix` is `true`.
---
title: Types
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

## `to-bi`, `to-bigint`

<Tabs
  defaultValue="signature"
  values={[
    {label: 'Signature', value: 'signature'},
    {label: 'Example', value: 'example'},
  ]}
>

<TabItem value="signature">

```clojure
(value Any) | to-bi | (y BigInt)
```

</TabItem>

<TabItem value="example">

```clojure
88 to-bi => 88n
```

</TabItem>

</Tabs>

Coerces any `value` to BigInt.

## `to-float`, `to-f`

<Tabs
  defaultValue="signature"
  values={[
    {label: 'Signature', value: 'signature'},
    {label: 'Example', value: 'example'},
  ]}
>

<TabItem value="signature">

```clojure
(value Any) | to-float | (y Float)
```

</TabItem>

<TabItem value="example">

```clojure
88 to-float => 88.0
```

</TabItem>

</Tabs>

Coerces any `value` to Float.

## `to-int`, `to-i`

<Tabs
  defaultValue="signature"
  values={[
    {label: 'Signature', value: 'signature'},
    {label: 'Example', value: 'example'},
  ]}
>

<TabItem value="signature">

```clojure
(value Any) | to-int | (y Int)
```

</TabItem>

<TabItem value="example">

```clojure
"99" to-int => 99
```

</TabItem>

</Tabs>

Coerces any `value` to Int.

## `to-string`, `to-s`

<Tabs
  defaultValue="signature"
  values={[
    {label: 'Signature', value: 'signature'},
    {label: 'Example', value: 'example'},
  ]}
>

<TabItem value="signature">

```clojure
(value Any) | to-string | (y String)
```

</TabItem>

<TabItem value="example">

```clojure
88 to-string => "88"
```

</TabItem>

</Tabs>

Coerces any `value` to String.
---
title: Containers
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

## `container-domain-name`

<Tabs
  defaultValue="signature"
  values={[
    {label: 'Signature', value: 'signature'},
    {label: 'Example', value: 'example'},
  ]}
>

<TabItem value="signature">

```clojure
| container-domain-name(runnable-path String, container-name String) | (full-container-name String)
```

</TabItem>

<TabItem value="example">

```clojure
container-domain-name("some-runnable", "foo") => "some-runnable_foo"
```

</TabItem>

</Tabs>

Expands the `container-name` to its full form `full-container-name` (as seen in Docker) based on the runnable path
supplied in `runnable-path`.

## `container-name`

<Tabs
  defaultValue="signature"
  values={[
    {label: 'Signature', value: 'signature'},
    {label: 'Example', value: 'example'},
  ]}
>

<TabItem value="signature">

```clojure
| container-name(container-name String) | (full-container-name String)
```

</TabItem>

<TabItem value="example">

```clojure
container-name("foo") => "some-runnable_foo"
```

</TabItem>

</Tabs>

Expands the `container-name` to its full form  `full-container-name` (as seen in Docker) based on the runnable path
in which this operation is executed.

## `exec`

<Tabs
  defaultValue="signature"
  values={[
    {label: 'Signature', value: 'signature'},
    {label: 'Example', value: 'example'},
  ]}
>

<TabItem value="signature">

```clojure
| exec(runnable-path String, container-name String, cmd String, ...) | (stdout String)
```

</TabItem>

<TabItem value="example">

```clojure
exec("foo/bar", "baz", "cat", "foo.txt") => "contents of foo.txt"
```

</TabItem>

</Tabs>

Executes command `cmd` in container `container-name` being a part of `runnable-path` runnable.
The `cmd` argument can be spreat across any number of argumens.
---
title: Variables
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

## `set`

<Tabs
  defaultValue="signature"
  values={[
    {label: 'Signature', value: 'signature'},
    {label: 'Example', value: 'example'},
  ]}
>

<TabItem value="signature">

```clojure
(value Any) | set(var-name String) | (value Any)
```

</TabItem>

<TabItem value="example">

```clojure
9 set("foo") => 9
```

</TabItem>

</Tabs>

Sets variable named `var-name` to `value`.

## `set-tmp`

<Tabs
  defaultValue="signature"
  values={[
    {label: 'Signature', value: 'signature'},
    {label: 'Example', value: 'example'},
  ]}
>

<TabItem value="signature">

```clojure
(value Any) | set-tmp(var-name String) | (value Any)
```

</TabItem>

<TabItem value="example">

```clojure
9 set-tmp("foo") => 9
```

</TabItem>

</Tabs>

Sets **temporary** variable named `var-name` to `value`.
Temporary variables are local to the script, they are forgotten after single run.

## `unset`

<Tabs
  defaultValue="signature"
  values={[
    {label: 'Signature', value: 'signature'},
    {label: 'Example', value: 'example'},
  ]}
>

<TabItem value="signature">

```clojure
| unset(var-name String) |
```

</TabItem>

<TabItem value="example">

```clojure
9 unset("foo") => 9
```

</TabItem>

</Tabs>

Unsets **temporary** variable named `var-name`.
Temporary variables are local to the script, they are forgotten after single run.
---
title: Arrow scripts cheatsheet
---

# Arrow scripts cheatsheet

Here's an index of all the operators available in Arrow scripts by category. Each name links to the detailed description of an operator.

## Strings
[`concat`](operators/strings.md#concat) [`concat-all`](operators/strings.md#concat-all) [`trim`](operators/strings.md#trim) 

## Variables
[`set`](operators/variables.md#set) [`set-tmp`](operators/variables.md#set-tmp) [`unset`](operators/variables.md#unset) 

## Actions
[`act`](operators/actions.md#act) [`wait-for`](operators/actions.md#wait-for) 

## JSON-RPC
[`rpc-call`](operators/JSON-RPC.md#rpc-call) 

## HTTP
[`http-get`](operators/HTTP.md#http-get) [`http-post`](operators/HTTP.md#http-post) 

## Math
[`add`](operators/math.md#add) [`cmp`](operators/math.md#cmp) [`div`](operators/math.md#div) [`mult`](operators/math.md#mult) [`sub`](operators/math.md#sub) 

## Numbers
[`to-hex`](operators/numbers.md#to-hex) 

## Containers
[`container-domain-name`](operators/containers.md#container-domain-name) [`container-name`](operators/containers.md#container-name) [`exec`](operators/containers.md#exec) 

## Random
[`random-uuid`](operators/random.md#random-uuid) 

## Network
[`get-hostname, get-container-ip`](operators/network.md#get-hostname-get-container-ip) [`ip-address-public`](operators/network.md#ip-address-public) 

## Internals
[`append`](operators/internals.md#append) [`array`](operators/internals.md#array) [`assoc`](operators/internals.md#assoc) [`call`](operators/internals.md#call) [`callf`](operators/internals.md#callf) [`const`](operators/internals.md#const) [`dup`](operators/internals.md#dup) [`get-member`](operators/internals.md#get-member) [`mark`](operators/internals.md#mark) [`object`](operators/internals.md#object) [`var`](operators/internals.md#var) 

## Boolean
[`and`](operators/boolean.md#and) [`contains?, has?`](operators/boolean.md#contains?-has?) [`eq?, equal?`](operators/boolean.md#eq?-equal?) [`not`](operators/boolean.md#not) [`not-equal?, not-eq?`](operators/boolean.md#not-equal?-not-eq?) [`or`](operators/boolean.md#or) [`xor`](operators/boolean.md#xor) 

## JSON
[`parse-json`](operators/JSON.md#parse-json) [`to-json`](operators/JSON.md#to-json) 

## Types
[`to-bi, to-bigint`](operators/types.md#to-bi-to-bigint) [`to-float, to-f`](operators/types.md#to-float-to-f) [`to-int, to-i`](operators/types.md#to-int-to-i) [`to-string, to-s`](operators/types.md#to-string-to-s) 

## Entities
[`entity`](./operators/entities.md#entity) [`entity-state`](./operators/entities.md#entity-state)
---
title: Arrow Scripts
slug: /monkscript/scripting
---

Any value in YAML can be a script written in Monk's scripting language (Arrow script). The scripts might be as simple as reading a variable, or performing string interpolation, to more complex like making RPC or HTTP calls, performing calculations etc.

An Arrow script start with an arrow symbol `<-` followed by a sequence of variable references, constants and operator calls.

For example:

```yaml linenums="1"
value: <- `geth --syncmode ${syncmode} ${network} --rpc --rpcaddr 0.0.0.0`
```

this script composes a string from constant strings and the contents of `syncmode` and `network` [variables](/docs/monkscript/yaml/runnables.md#variables).

## Evaluation

Arrow script is evaluated at **runtime**, this means that script definitions are stored and executed when needed during operation of the Kits that defined them.

## Syntax

The language itself is simple, does not contain any general way to loop or branch. Instead, scripts are composed from values and pre-defined operators that take some value and return a new value, optionally taking arguments. This is comparable to stack based languages such as [Forth &#8594;
](<https:/en.wikipedia.org/wiki/Forth_(programming_language)>).

A script is a sequence of [literal values](#values), [variable accesses](#variables) and [calls to operators](#operators). This form is similar to shell scripting with pipes (`|`) but with implicit pipes in between the elements.

For example:

```
<- $foo 2 add div(2) to-json
```

This would be equivalent to shell invocation similar to:

```
expr 2 + $foo | awk '{print $1/2}' | jq
```

Or, python:

```
json.dumps((2 + foo)/2)
```

### Values and Types

MonkOS recognizes several data types similar to JSON. See example literals in the table below:

| Type      | Example literals                | Comment                                                                                              |
| --------- | ------------------------------- | ---------------------------------------------------------------------------------------------------- |
| `Nil`     | `nil`                           | A type whose only value is `nil`. Used to denote a void value                                        |
| `Boolean` | `true`, `false`                 | Boolean values                                                                                       |
| `Int`     | `0b11`, `0xff`, `0777`, `-1337` | Integer numbers. Binary, octal, hexadecimal and decimal formats are supported                        |
| `BigInt`  | `123456789012n`                 | Big integer numbers                                                                                  |
| `Float`   | `0.1`, `-0.4e2`                 | Floating point numbers                                                                               |
| `String`  | `"foo"`, `'bar'`, `` `baz` ``   | Unicode character strings, standard escape syntax is supported                                       |
| `Array`   | `[1, "foo", []]`                | Array of values                                                                                      |
| `Object`  | `{"a": 1, b: 2, $var: 4}`       | A map from keys to values, keys can be any type, constant or variable but all are casted to `String` |
| `Func`    | `<-{ 1 add }`                   | First class code block, used for iterators and higher order operators such as `map` and `filter`     |

Literals can be used in any place in Arrow scripts.

Arrow script falls into category of strongly typed dynamic languages meaning that the operators expect certain types of values will not generally work with other types by performing behind the scenes conversions. At the same time, the types are determined at runtime and values can be freely converted from one type to another.

### Variables

Variables in scripts refer to [variables](/docs/monkscript/yaml/runnables.md#variables) defined in YAML. Variables are accessed using `$` sign. Variable names can consist of letters, numbers, hyphens and underscores, as well as other unicode characters except the `$` and as long as a letter is used as the first character.

For example:

```
<- $foo $bar add
```

Will return `3` as long as it is placed within a [`runnable`](/docs/monkscript/yaml/runnables.md) containing the following definition:

```yaml
variables:
    foo: 1
    bar: 2
```

Variables can be used as parenthesized arguments to operators:

```
<- $foo add($bar)
```

### Operators

Operators are pre-defined functions which usually take one or more preceding values together with parenthesized arguments and produce another value. Operators can also perform work behind the scenes causing side-effects such as calling HTTP APIs, changing state, communicating with containers. MonkOS provides a [library of operators](/docs/monkscript/scripting/operators/HTTP.md) that can be used to compose many useful scripts.

Operator names can consist of letters, numbers, hyphens and underscores, as well as other unicode characters and as long as a letter is used as the first character. Many operators accept parenthesized arguments in addition to values piped to them from the left. Some will work with both forms.

For example:

```
<- get-hostname("some/runnable", "container") ":" concat concat("8080")
```

This will get a hostname of some running container in the system first, then place `":"` on the stack as an additional value, then `concat` will turn those two values into `"some_hostname:"`. Next, a version of `concat` with parenthesized argument will add `"8080"` resulting in `"some_hostname:8080"` being returned as the value of entire script.

### Functions

Since Arrow script does not have any classical conditional and looping constructs, such as `for` and `if`, we have included a set of functional operators to enable processing of collections in a succinct manner. These operators will accept a function which then gets applied to the stack in place of invocation of such operator.

For example:

```
<- [1,2,3] map(<-{ 1 add })
```

This will return `[2,3,4]` as the result of applying `1 add` to each element of the input array. Syntax for functions is `<-{ ... }`, they don't take named arguments and must assume that input values will come as if they were placed to the left of the function, i.e. these two scripts are equivalent:

```
<- 1 <-{ 1 add } callf
<- 1 1 add
```

Here, `callf` can be thought of as if it simply dropped the `<-{ ... }` by calling the function.

Functions are really just code blocks treated as values and they can be passed around just like other values.

### String interpolation

String interpolation is a convenience feature that helps to express string values succinctly. In Arrow script backticks (`` ` ``) are used to denote an interpolated string. Within those strings variables can be resolved using `${variable-name}` syntax. Values will be converted to strings (by `to-s`) before concatenating the final result. This form of string interpolation is inspired by JavaScript - it's simple and effective.

Consider this example:

```
<- $person " had a " $color " " $thing concat-all
```

Using the string interpolation syntax:

```
<- `${person} had a ${color} ${thing}`
```

assuming the variables:

```
person: Flipper
color: chrome
thing: speedboat
```

this will evaluate to `"Flipper had a chrome speedboat"`

:::note

Only variables and literals can be resolved inside `${...}`, putting anything else there will not work.

For example, this is wrong:

```
<- `2 + 2 is ${2 2 add}`
```

:::

## Variable scope

Scripts have read access to variables defined in the `variables` section of any given runnable. The scripts cannot reach outside their `runnable` scope.
---
title: Kits Overview
---

TODO---
title: MonkScript Overview
slug: /monkscript
---

## MonkScript

MonkScript is Monk's composable definition language with runtime scripting abilities. Apart from the CLI, MonkScript is the primary way of programming MonkOS to run and manage workloads.

:::note

Start [Working with MonkScript &#8594;
](working.md)

:::

MonkScript sources can live in YAML files. These YAML files are called _kits_ and the statements within, are called _entities_. An _entity_ can be either a _runnable_ (a single _component_, much like K8s pod) or a _group_ (a composition of other _entities_, including _groups_).

A notable difference between MonkScript and other YAML based Infrastructure-As-Code languages is that there is no need for macros or pre-processors. MonkScript implements a set of inheritance and composition rules that can express even the most complicated systems in a straightforward manner.

:::note

Read more about [MonkScript YAML &#8594;
](yaml/index.md)

:::

In addition to the built-in composition capabilities, MonkScript allows the operator to define almost all values in terms of variables and one-line scripts called _Arrow scripts_. These small scripts start with `<-` (hence the name) and are computed at runtime. This allows Monk's control plane to track and crunch any signal coming from a running container, or to perform user-defined actions at any time.

Arrow scripts are immensely powerful - they are used to implement service discovery and health check mechanisms among other core functions in Monk.

:::note

Read more about [MonkScript Arrow scripting &#8594;
](scripting/index.md)

:::

Last but not least, MonkScript manifests are meant to be fully portable between MonkOS clusters - meaning that any MonkOS cluster can interpret and run all existing Kits. Additionally, all public Kits available in the Monk Hub are readily available to be run and composed on any MonkOS cluster. This makes MonkScript globally share-able and easy to apply.
---
title: Runnables
---

Runnables are the most common and basic unit in Monk. They represent a container or multiple containers meant to be standing together on a single node together with all necessary resources and configuration. Runnables can be composed together to form [Groups](./groups).

## Minimal example

```yaml title="runnable.yaml" linenums="1"
namespace: reference

example-runnable:
    defines: runnable

    containers:
        utils:
            image: amouat/network-utils
            image-tag: latest
            entrypoint: sleep 36000
```

This example shows a runnable `example-runnable` inside a namespace `reference`. At minimum, a valid `runnable` must have a [`containers`](#containers) sub-section containing at least one container.

## Sub-sections

Runnable sections can have multiple sub-sections of special meaning. All definitions applicable inside a `runnable` are described below.

### `containers`

```yaml
containers:
    container-a: ...
    container-b: ...
```

:::info

**Applicable to:**  [`runnable`](#)

**Required:** yes

:::

Containers section is a map of [`container`](#container), each container is named by its key (`container-a`, `container-b` in above example). Names can be any valid YAML key.

#### `container`

```yaml
container-name:
    image: string
    image-tag: string
    entrypoint: container entrypoint
    bash: shell command to run
    workdir: container working directory
    environment:
        - list of environment variables
    ports:
        - list of public port mappings
    paths:
        - list of paths to mount
    labels:
        - list of labels
```

:::info

**Applicable to:** [`containers`](#containers)

**Required:** at least one

:::

| Field        | Value                                                  | Purpose                                                     | Required                    |
| ------------ | ------------------------------------------------------ | ----------------------------------------------------------- | --------------------------- |
| `image`      | `alpine`, `alpine:latest`, `gcr.io/someimage`          | A container image to run                                    | yes                         |
| `image-tag`  | `latest`, `v2`                                         | Image tag, will override the one in `image` if present.     | only when no tag in `image` |
| `entrypoint` | `run.sh --someoption`                                  | Container entrypoint, will override the image's entrypoint. | no                          |
| `bash`       | `rm /app/cache`                                        | A shell command to run upon container start.                | no                          |
| `ports`      | list of: `8080`, `8080:9090`, `0.0.0.0:8080:9090`      | A list of ports to bind and publish to the internet.        | no                          |
| `paths`      | list of: `host/path:container/path`                    | A list of filesystem paths to bind.                         | no                          |
| `labels`     | list of: `"com.example.description=Accounting webapp"` | A list of container labels.                                 | no                          |

### `variables`

```yaml
variables:
    variable-a: ...
    variable-b: ...
```

:::info

**Applicable to:** [`runnable`](#)

**Required:** no

:::

Variables section is a map of [`variable`](#variable), each variable is named by its key (`variable-a`, `variable-b` in above example). Names can be any valid YAML key.

:::info

These variables are not environment variables - they live on Monk's control plane. Use `env` to bind them to environment variables if you need.

:::

#### `variable`

```yaml
variable-name:
    type: variable type
    value: variable value
    env: environment variable to bind to

variable-name: variable value
```

:::info

**Applicable to:** [`variables`](#variables)

**Required:** at least one

:::

A variable can either just specify the value - in which case the type is inferred automatically, or specify its type and value. It's also possible for the value to be left undefined, to be set in another runnable derived by inheritance, in a parent process-group's scope, or at runtime (see [`Runtime variables`](/docs/cli/monk#runtime-variables)).

| Field   | Value                                              | Purpose                                                                               | Required |
| ------- | -------------------------------------------------- | ------------------------------------------------------------------------------------- | -------- |
| `type`  | one of: `string`, `int`, `float`, `bool`, `bigint` | Type of the variable                                                                  | yes      |
| `value` | anything                                           | Initial value of the variable                                                         | no      |
| `env`   | `VARIABLE_NAME`                                    | Name of environment variable that will receive the variable's value in all containers | no       |
| `required`   | `true` or `false`                                    | Whether it is required for the value of the variable to be set in other to start the runnable | no       |

### `actions`

```yaml
variables:
    action-a: ...
    action-b: ...
```

:::info

**Applicable to:** [`runnable`](#)

**Required:** no

:::

Action section is a map of [`action`](#action), each container is named by its key (`action-a`, `action-b` in above example). Names can be any valid YAML key.

#### `action`

```yaml
action-name:
    description: action description
    arguments:
        arg-a:
            type: argument type
            description: argument description
            default: argument default value
        arg-b: ...
    code: Arrow script code
```

:::info

**Applicable to:** [`actions`](#actions)

**Required:** yes

:::

Actions are somewhat akin to function definitions known from regular programming languages. They are specified by name, list of arguments and code to be executed upon calling the action.
`action` specifies its code using Arrow script syntax but without `<-` as the code is constant here.

| Field         | Value                 | Purpose                                                           | Required |
| ------------- | --------------------- | ----------------------------------------------------------------- | -------- |
| `description` | human readable string | Human readable description of the action. MonkHub displays these. | yes      |
| `code`        | Arrow script code     | Code for the action, notice that the `<-` prefix is not needed    | yes      |
| `arguments`   | map of `argument`s    | Specifies action's expected arguments. See the table below        | no       |

#### `argument`

| Field         | Value                            | Purpose                                                             | Required |
| ------------- | -------------------------------- | ------------------------------------------------------------------- | -------- |
| `description` | human readable string            | Human readable description of the argument. MonkHub displays these. | yes      |
| `type`        | one of: `string`, `int`, `float` | Type of the argument                                                | yes      |
| `default`     | anything                         | Value of the argument used when it is not specified during call     | no       |

#### Example

```yaml linenums="1"
actions:

    sum:
        description: sums two numbers
        arguments:
            a:
                type: int
                description: first number
            b:
                type: int
                description: second number
            add-one:
                type: bool
                description: add 1 to result
                default: false # if default is not set, the argument is required
        code: $args["a"] $args["b"] add $args["add-one"] add
```

### `files`

```yaml linenums="1"
files:
    file-a: ...
    file-b: ...
```

:::info

**Applicable to:** [`runnable`](#runnable)

**Required:** no

:::

Under this section there are definitions of [`file`](#file)s to be created in the container.

#### `file`

```yaml linenums="1"
file-a:
    path: path inside the container
    container: name of the container
    chmod: octal numeral
    raw: boolean
    contents: string
```

:::info

**Applicable to:** [`files`](#file)

**Required:** at least one

:::

| Field       | Value                      | Purpose                                                                                                               | Required |
| ----------- | -------------------------- | --------------------------------------------------------------------------------------------------------------------- | -------- |
| `path`      | `/foo/bar`                 | the path in the container where the file needs to be stored                                                           | yes      |
| `container` | name of existing container | the name of the container sub-section describing the container that the file is to be created in                      | yes      |
| `chmod`     | octal number               | an octal numeral representing the file permissions (defaults to `0600` if omited).                                    | no       |
| `raw`       | `true` or `false`          | if set to `true`, the contents will not be interpreted as a Golang `text/template`, if `false` or omitted, they will  | no       |
| `contents`  | any text                   | the file contents. If `raw` is `false`, interpreted as a Kit. See [docs](https://golang.org/pkg/text/template/). | yes      |

The `contents` of the file can be either literal, or rendered by Golang's `text/template`. In the `contents`, if `raw` is not set to `true`, you can use the following to access the Kit variables:

```
{{ v "foo-bar" }} or {{ var "foo-bar" }}
```

It's useful to declare multiline file `contents` using YAML syntax `|`

#### Example

```yaml linenums="1"
files:
    poem:
        path: /var/poem.txt
        container: dummy
        chmod: 0666
        raw: false
        contents: |
            roses are {{ v "color" }}
            violets are {{ v "another-color" }}
            MonkOS is awesome!
```

### `checks`

Each runnable can contain status checks. Currently the only supported check is `readiness`.

::: info

**Applicable to:** [`runnable`](#runnable)

**Required:** no

:::

| Field          | Value             | Purpose                                                                                                     | Required |
|----------------|-------------------|-------------------------------------------------------------------------------------------------------------| -------- |
| `code`         | arrow script code | code to be run to perform the check, truthy return value indicates success, anything else indicates failure | yes      |
| `period`       | int (seconds)     | specifies how often (in seconds) MonkOS will perform this check                                               | no       |
| `initialDelay` | int (seconds)     | initial delay (in seconds) before MonkOS will start checking application health                               | no       |
| `attempts`     | int               | specifies how many times MonkOS will perform this check                                                       | no       |

#### Example

```yaml linenums="1"
checks:
    readiness:
        code: exec("ethereum-node", "echo", "-e", "two") "two" contains?
        period: 15
        initialDelay: 13
```

### `depends`

Each runnable can contain depends section. Any runnable can wait for other runnables specified in `wait-for`.
This works by awaiting the results of [`readiness` `checks`](#checks) on all referenced [`runnables`](#runnable).

#### Example

```yaml linenums="1"
depends:
    wait-for:
        runnables:
            - /some/another-runnable
        timeout: 60
```

### `recovery`

Each runnable can contain a recovery section.

If it doesn't exist, MonkOS will assume default values:

```
    after: 60s
    when: always
    mode: default
```

#### Example

```yaml linenums="1"
recovery:
    after: 60s # timeout before start recovey mechanism
    when: always/node-failure/container-failure/none # condition when to start recovery
    # node-failure - recover only if node is failed
    # container-failure - recover only if container is failed
    # none - doesn't recover runnable
    # pressure - recover only if node is under pressure
    # memory-pressure - recover only if node is memory under pressure
    # cpu-pressure - recover only if node is CPU under pressure
    # pid-pressure - recover only if node is pid under pressure
    # disk-pressure - recover only if node is disk under pressure
    mode: default/node/cluster
    # node - create new node on recovery
    # cluster - looking for resource on a exists cluster
    # default - first looking for resource on a exists cluster, then it tries to create new node
```

### `affinity`

Each runnable can contain `affinity` section. It's used to determine runtime placement of the `runnable`.

Eiher `tag` or `name` can be specified, depending on the choice, MonkOS will place the runnable either on any of the nodes bearing the `tag`, or on a specific node named by `name`.

If `resident` is `true` (`false` by default), MonkOS will search for an empty node and reserve it for the runnable in questions so that no other `runnable` will start on that node as long as the `runnable` in question is present.

If `ignore-pressure` is `true` (`false` by default) MonkOS will ignore pressure and consider all nodes, even the busy ones for allocation.

```yaml linenums="1"
affinity:
    tag: test-node
    name: test
    ignore-pressure: false
    resident: false
```
---
title: MonkOS YAML
slug: /monkscript/yaml
---

```mdx-code-block
import CustomLink from '@site/src/components/customLink';
```

MonkOS uses YAML to express Kits. One of our design goals was to make YAML manageable and eliminate the need for pre-processing using external tools. In order to achieve succinct definitions and composability, we've defined three special keys on top of standard YAML: `namespace`, `defines` and `inherits`.

Additionally, MonkOS provides a `<-` macro that denotes an [Arrow script](./scripting) which can be used in place of _any_ value in YAML.

It's important to understand how they work before working with MonkScript in order to avoid confusion.

## Namespaces

Each MonkScript YAML file has to have `namespace` key as the first key in the file. This instructs the MonkScript loader to put the contents of the Kit under a chosen path in MonkOS internal database.

Consider the following example:

```yaml linenums="1"
namespace: hello-world

foo: ...

bar: ...
```

Loading this snippet will put both `foo` and `bar` under `/hello-world` so that they can be later referred to as:

-   `foo` &#8594;
    `hello-world/foo`
-   `bar` &#8594;
    `hello-world/bar`

## Arrow scripts

Consider the following example:

```yaml linenums="1"
quux:
    bar: <- local-ip concat(":8080")
```

This arrow script will put a local IP address with a `:8080` postfix into `bar`. Resolution of this script happens dynamically at Kit _runtime_. Final result would be as if the Kit looked like this:

```yaml linenums="1"
quux:
    bar: 127.0.0.1:8080
```

:::note

Learn more about [Arrow script &#8594;
](./scripting)

:::

## File embeds

Consider the following example:

```yaml linenums="1"
quux:
    #...
    variables: 
        foo: <<< foo.json 
```

The `<<<` instructs MonkOS to read the file `foo.json` relative to the currently interpreted YAML file and place its contents in `quux/variables/foo` as if they were pasted into YAML.

This is useful for embedding large text files into your definitions without cluttering the YAML. Keep in mind that the embedded file needs to be present whenever your Kit is loaded.

You can add content of the file by supplying path of the local file with `<<<`.

#### Example
```yaml linenums="1"
files:
    poem:
        path: /var/poem.txt
        container: dummy
        chmod: 0666
        raw: false
        contents: <<< files/poem.txt
```


## Inheritance

The most powerful feature of MonkScript is the ability to inherit any piece of YAML from any place in any definition. The inheritance mechanism practically eliminates the need for macro processing as it is capable of expressing many complex patterns by itself.

Consider the following example:

```yaml linenums="1"
foo:
    bar: 1
    baz: 2
    foos:
        - A
        - B
        - C

quux:
    inherits: ./foo ### let quux inherit foo
    baz: 3
    fnord:
        food: pizza
```

To Monk, `quux` is as if it was written in the following way:

```yaml linenums="1"
quux:
    bar: 1
    baz: 3
    foos:
        - A
        - B
        - C
    fnord:
        food: pizza
```

The `inherits` property can be used freely in any place in any definition and it can point to any path in any namespace known by Monk.

Inheritance can be used to:

-   Override any value in any Kit,
-   Compose a complex definition out of simple ones,
-   Re-use common definitions across multiple components,
-   Create multiple flavors or versions of the same runnable easily.

## Definitions

Consider the following definitions:

```yaml linenums="1"
foo:
    defines: runnable
    containers:
        ...
bar:
    defines: runnable
    fun-boxes:
```

Both `foo` and `bar` are [`runnable`](#runnable). The key defines has special meaning, it labels its parent node with a _descriptor_ (in this case, `runnable`). MonkOS finds relevant sections by looking at those descriptors.

By not deciding the meaning based on names, MonkScript allows for custom naming of all "special" sections. Notice that `foo` has `containers` but `bar` has `fun-boxes`. Both `containers` and `fun-boxes` has the same meaning to MonkOS as only the descriptor matters.

Not relying on key names allows MonkScript to be extended with every new release without affecting the existing Kits.

:::info

Be sure to remember about assigning proper descriptors to the relevant sections as MonkOS will not interpret them without it.

:::

Currently MonkOS recognizes several "special" sections, or definition classes higlighted below.

### `runnable`

Runnables are the basic unit in Monk. A `runnable` is essentially something that MonkOS can run, manage and then stop. This can be viewed as one or more containers meant to be standing together, plus associated resource definitions, variables etc.

<CustomLink to="./yaml/runnables">Learn more about Runnables</CustomLink>

### `process-group`

Groups (or `process-group`s) are compositions of multiple [runnables](#runnable) and other `groups` plus associated resources and state. This construct is used to compose other Kits in Monk.

<CustomLink to="./yaml/groups">Learn more about Groups</CustomLink>

---
title: Services
---

Services are much like [Runnables](runnables.md) but they don't define any containers and associated lifecycle sections. Services are meant to be an abstract counterpart of Runnables that defines 3rd party services existing outside of MonkOS control. They can be useful for representing external APIs together with associated state, actions and variables.

Services can be composed with other Services and Runnables to form [Groups](./groups).

## Minimal example

```yaml title="service.yaml" linenums="1"
namespace: reference

example-service:
    defines: service

    variables:
        foo: 1
        bar: 2
```

This example shows a runnable `example-service` inside a namespace `reference`. At minimum, a valid `service` must have a [`variables`](#variables) sub-section containing at least one container.

## Sub-sections

Service sections can have multiple sub-sections of special meaning. All definitions applicable inside a `service` are described below.

### `variables`

```yaml
variables:
    variable-a: ...
    variable-b: ...
```

:::info

**Applicable to:** [`service`](#)

**Required:** yes

:::

Variables section is a map of [`variable`](#variable), each container is named by its key (`variable-a`, `variable-b` in above example). Names can be any valid YAML key.

:::info

These variables are not environment variables - they live on Monk's control plane. Use `env` to bind them to environment variables if you need.

:::

#### `variable`

```yaml
variable-name:
    type: variable type
    value: variable value
    env: environment variable to bind to

variable-name: variable value
```

:::info

**Applicable to:** [`variables`](#variables)

**Required:** at least one

:::

A variable can either just specify the value - in which case the type is inferred automatically, or specify its type and value.

| Field   | Value                                              | Purpose                                                                               | Required |
| ------- | -------------------------------------------------- | ------------------------------------------------------------------------------------- | -------- |
| `type`  | one of: `string`, `int`, `float`, `bool`, `bigint` | Type of the variable                                                                  | yes      |
| `value` | anything                                           | Initial value of the variable                                                         | yes      |
| `env`   | `VAIRABLE_NAME`                                    | Name of environment variable that will receive the variable's value in all containers | no       |

### `actions`

```yaml
variables:
    action-a: ...
    action-b: ...
```

:::info

**Applicable to:** [`service`](#)

**Required:** no

:::

Action section is a map of [`action`](#action), each container is named by its key (`action-a`, `action-b` in above example). Names can be any valid YAML key.

#### `action`

```yaml
action-name:
    description: action description
    arguments:
        arg-a:
            type: argument type
            description: argument description
            default: argument default value
        arg-b: ...
    code: Arrow script code
```

:::info

**Applicable to:** [`actions`](#actions)

**Required:** yes

:::

Actions are somewhat akin to function definitions known from regular programming languages. They are specified by name, list of arguments and code to be executed upon calling the action.
`action` specifies its code using Arrow script syntax but without `<-` as the code is constant here.

| Field         | Value                 | Purpose                                                           | Required |
| ------------- | --------------------- | ----------------------------------------------------------------- | -------- |
| `description` | human readable string | Human readable description of the action. MonkHub displays these. | yes      |
| `code`        | Arrow script code     | Code for the action, notice that the `<-` prefix is not needed    | yes      |
| `arguments`   | map of `argument`s    | Specifies action's expected arguments. See the table below        | no       |

#### `argument`

| Field         | Value                            | Purpose                                                             | Required |
| ------------- | -------------------------------- | ------------------------------------------------------------------- | -------- |
| `description` | human readable string            | Human readable description of the argument. MonkHub displays these. | yes      |
| `type`        | one of: `string`, `int`, `float` | Type of the argument                                                | yes      |
| `default`     | anything                         | Value of the argument used when it is not specified during call     | no       |

#### Example

```yaml linenums="1"
actions:

    sum:
        description: sums two numbers
        arguments:
            a:
                type: int
                description: first number
            b:
                type: int
                description: second number
            add-one:
                type: bool
                description: add 1 to result
                default: false # if default is not set, the argument is required
        code: $args["a"] $args["b"] add $args["add-one"] add
```
---
title: Groups
---

Groups are Monk's composition constructs. Groups allow for composing [`runnables`](runnables.md), [`services`](services.md) and other groups into sets that can be ran and managed as single entities. This allows for expressing complex systems in a portable and modular way. Additionally, a group can define additional resources, such as load balancers that apply to all members of the group.

Groups can also contain common [`variables`](#variables) shared by the group members providing a scoped state storage and communication bus.

## Minimal example

```yaml title="runnable.yaml" linenums="1"
namespace: reference

example-group:
    defines: process-group
    runnable-list:
        - reference/runnable-a
        - reference/runnable-b
```

This example shows a group `example-group` inside a namespace `reference`. At minimum, a valid `process-group` must have at least one `runnable` (or other object) specified in the `runnable-list`.

## `process-group`

| Field           | Value         | Purpose                                                                                                                      | Required |
| --------------- | ------------- | ---------------------------------------------------------------------------------------------------------------------------- | -------- |
| `runnable-list` | list of paths | List of members of the group, can be namespace paths to [`runnable`](runnables.md), [`service`](services.md) or other group. | yes      |

## Sub-sections

Runnable sections can have multiple sub-sections of special meaning. All definitions applicable inside a `runnable` are described below.

### `variables`

```yaml
variables:
    variable-a: ...
    variable-b: ...
```

:::info

**Applicable to:** [`process-group`](#)

**Required:** no

:::

Variables section is a map of [`variable`](#variable), each container is named by its key (`variable-a`, `variable-b` in above example). Names can be any valid YAML key.

Variables in groups are visible to all member `runnables` as if they were declared in the runnable as long as there is no definition for a variable of the same name inside the runnable itself. In other words, whenever resolving a variable inside a `runnable`, MonkOS first looks at variables defined or inherited in that runnable, only then looks at the variables defined in the group containing the runnable.

:::note

These variables are not environment variables - they live on Monk's control plane. Use `env` to bind them to environment variables if you need.

:::

#### `variable`

```yaml
variable-name:
    type: variable type
    value: variable value
    env: environment variable to bind to

variable-name: variable value
```

:::info

**Applicable to:** [`variables`](#variables)

**Required:** at least one

:::

A variable can either just specify the value - in which case the type is inferred automatically, or specify its type and value. It's also possible for the value to be left undefined, to be set in another runnable derived by inheritance, in a parent process-group's scope, or at runtime (see [`Runtime variables`](/docs/cli/monk#runtime-variables)).

| Field   | Value                            | Purpose                                                                               | Required |
| ------- | -------------------------------- | ------------------------------------------------------------------------------------- | -------- |
| `type`  | one of: `string`, `int`, `float` | Type of the variable                                                                  | yes      |
| `value` | anything                         | Initial value of the variable                                                         | no       |
| `env`   | `VARIABLE_NAME`                  | Name of environment variable that will receive the variable's value in all containers | no       |
| `required`   | `true` or `false`                                    | Whether it is required for the value of the variable to be set in other to start the runnable | no       |


### `actions`

```yaml
variables:
    action-a: ...
    action-b: ...
```

:::info

**Applicable to:** [`process-group`](#)

**Required:** no

:::

Action section is a map of [`action`](#action), each container is named by its key (`action-a`, `action-b` in above example). Names can be any valid YAML key.

#### `action`

```yaml
action-name:
    description: action description
    arguments:
        arg-a:
            type: argument type
            description: argument description
            default: argument default value
        arg-b: ...
    code: Arrow script code
```

:::info

**Applicable to:** [`actions`](#actions)

**Required:** yes

:::

Actions are somewhat akin to function definitions known from regular programming languages. They are specified by name, list of arguments and code to be executed upon calling the action.
`action` specifies its code using Arrow script syntax but without `<-` as the code is constant here.

| Field         | Value                 | Purpose                                                           | Required |
| ------------- | --------------------- | ----------------------------------------------------------------- | -------- |
| `description` | human readable string | Human readable description of the action. MonkHub displays these. | yes      |
| `code`        | Arrow script code     | Code for the action, notice that the `<-` prefix is not needed    | yes      |
| `arguments`   | map of `argument`s    | Specifies action's expected arguments. See the table below        | no       |

#### `argument`

| Field         | Value                            | Purpose                                                             | Required |
| ------------- | -------------------------------- | ------------------------------------------------------------------- | -------- |
| `description` | human readable string            | Human readable description of the argument. MonkHub displays these. | yes      |
| `type`        | one of: `string`, `int`, `float` | Type of the argument                                                | yes      |
| `default`     | anything                         | Value of the argument used when it is not specified during call     | no       |

#### Example

```yaml linenums="1"
actions:

    sum:
        description: sums two numbers
        arguments:
            a:
                type: int
                description: first number
            b:
                type: int
                description: second number
            add-one:
                type: bool
                description: add 1 to result
                default: false # if default is not set, the argument is required
        code: $args["a"] $args["b"] add $args["add-one"] add
```

### `balancers`

```yaml linenums="1"
balancers:
    balancer-a: ...
    balancer-b: ...
```

:::info

**Applicable to:** [`process-group`](#)

**Required:** no

:::

Balancers section is a map of [`balancer`](#balancer), each load balancer is named by its key (`balancer-a`, `balancer-b` in above example). Names can be any valid YAML key.

#### `balancer`

```yaml linenums="1"
balancer-a:
    type: load balancer type
    port: target port
    instances:
        - list of runnables to balance between
```

:::info

**Applicable to:** [`balancers`](#balancers)

**Required:** at least one

:::
---
title: monkHub
---import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Install MonkOS Locally

Here's how you install, test, and upgrade Monk.

:::note Prerequisites

MonkOS requires [Podman](https://podman.io/) to be present and running on your system. 

APT and Homebrew packages will install Podman for you.

If you're not installing from the above sources, please check out [how to install Podman](https://podman.io/getting-started/installation) prior to installing MonkOS.

:::

:::note Prerequisites

MonkOS on macOS requires Command Line Tools version 14.3. If you are using an earlier version of the Command Line Tools, you will be prompted
to upgrade as part of set up. Note that the version of Command Line Tools is separate from the version of Xcode.
If you are unsure what version of Command Line Tools you are running, you can check with:

```
softwareupdate --history | grep "Command Line Tools" | tail -n 1
```

:::

## Installing Monk

<Tabs
  defaultValue="macOS"
  values={[
    {label: 'macOS', value: 'macOS'},
    {label: 'Ubuntu and Debian', value: 'mainLinux'},
    {label: 'Red Hat Enterprise Linux 8', value: 'rpmLinux'},
    {label: 'Other Linux Systems', value: 'otherLinux'},
  ]}
>
<TabItem value="macOS">

**Installing with Homebrew**

We provide a [Homebrew](https://brew.sh/) repository containing official releases of Monk. You can obtain the latest stable version of MonkOS from this repository by running the following command:

    brew install monk-io/monk/monk

Now enable Monk machine to have `monkd` running in the background:

    monk machine init

Monk machine is a lightweight Linux VM that runs `monkd` on your mac.
After this step you don't have to start `monkd` by hand.
</TabItem>
<TabItem value="mainLinux">
We run an APT repository containing official releases of Monk. You can obtain the latest stable version of MonkOS from this repository in two steps.

Add MonkOS repository to your sources list:

    curl https://us-east1-apt.pkg.dev/doc/repo-signing-key.gpg | sudo apt-key add
    echo 'deb https://us-east1-apt.pkg.dev/projects/monk-releases monk-releases-apt main' | sudo tee -a  /etc/apt/sources.list.d/artifact-registry.list
    sudo apt update

Install `monkd` and `monk`:

    sudo apt install monk

After this, `monkd` service will be started and added to your systemd configuration so that it stays running in the background.

:::note

You might need to log out and log back in on your system to be able to use `monk` without `sudo`. Alternatively, use `su - <your-username>`.

:::
</TabItem>
<TabItem value="rpmLinux">
We run an RPM repository containing official releases of Monk. You can obtain the latest stable version of MonkOS from this repository with the following steps.

Install `epel`:

    yum install https://dl.fedoraproject.org/pub/epel/epel-release-latest-8.noarch.rpm

Enable `codeready-builder`:

    yum subscription-manager repos --enable codeready-builder-for-rhel-8-$(arch)-rpms

Enable Wireguard:

    yum copr enable jdoss/wireguard

Add MonkOS repository:

    sudo tee -a /etc/yum.repos.d/artifact-registry.repo << EOF
    [monk-repo]
    name=Monk Repository
    baseurl=https://us-east1-yum.pkg.dev/projects/monk-releases/monk-releases-rpm
    enabled=1
    repo_gpgcheck=0
    gpgcheck=0
    EOF

And finally install MonkOS with:

    yum install monk

After this, `monkd` service will be started and added to your systemd configuration so that it stays running in the background.

:::note

You might need to log out and log back in on your system to be able to use `monk` without `sudo`. Alternatively, use `su - <your-username>`.

:::
</TabItem>
<TabItem value="otherLinux">

Download the latest stable binary distribution of MonkOS for Linux:

    wget https://get.monk.io/stable/linux/monk-amd64-latest.tar.gz

Unpack the zip file and move both `monk` and `monkd` into a folder that is on your `PATH`:

    tar -xvf monk-amd64-latest.tar.gz
    cd monk-amd64-latest
    cp monkd monk /usr/local/bin

Open a fresh terminal and run `monkd`:

    monkd

:::note

`monkd` has to be running at all times when using `monk` or running any workloads via Monk. You might consider adding monkd to your service management daemon configuration so that it stays running as a service.

:::
</TabItem>
</Tabs>

:::success

All done! Please proceed to the next section to try `monk` out.

:::

## Testing Your Setup

In a new terminal, run:

    monk login

After logging in, you should be able to list the available Kits like so:

    monk list

The command should return available Kits if the installation was successful, but sometimes it may take up to 30 seconds to sync the Kits. If you don't see a list at first, just retry in a few seconds.

    Type      Template              Repository    Version   Tags
    runnable  chatwoot/chatwoot     local         latest    self hosted, messaging, communication
    runnable  chatwoot/mailhog      monk          latest    smtp, email
    runnable  chatwoot/sidekiq      local         latest    self hosted, messaging, communication
    group     chatwoot/stack        monk          latest    self hosted, messaging, communication
    ....

If you see similar output it means that the installation was successful and you may now start using MonkOS on your system 🎉

Continue to the [Guides section](/) to see how you can use Monk.

If for some reason the command didn't work, please check if you have followed all instructions.

## Upgrading Monk

Upgrading your local MonkOS to the newest version is simple.
<Tabs
  defaultValue="macOS"
  values={[
    {label: 'macOS', value: 'macOS'},
    {label: 'Ubuntu and Debian', value: 'mainLinux'},
    {label: 'Red Hat Enterprise Linux 8', value: 'rpmLinux'},
    {label: 'Other Linux Systems', value: 'otherLinux'},
  ]}
>

<TabItem value="macOS">

    brew upgrade monk
    monk machine rm
    monk machine init

</TabItem>

<TabItem value="mainLinux">

    sudo apt update
    sudo apt upgrade monkd monk

</TabItem>

<TabItem value="rpmLinux">

    yum update monk monkd

</TabItem>

<TabItem value="otherLinux">

1. Follow the steps in [Installing Monk](get-monk.md) to obtain the latest binaries.
2. Replace the old binaries with the latest binaries.
3. Restart `monkd`

</TabItem>

</Tabs>

If you have a cluster running:

1. Make sure you are connected to the cluster (`monk cluster info`),
2. Make sure your local MonkOS is the latest version,
3. Run `monk system upgrade` to upgrade all the nodes to the newest version.

## Installation Impact

MonkOS aims to be a good steward of your filesystem and not scatter files throughout the disk. The MonkOS distribution is simple and consists of two binaries, `monkd` and `monk`. 

Our `apt` ot `brew` packages bring `podman` as a dependency and install it on your system if it is not present.

When installing with `apt` or `brew` those are placed or symlinked in `/usr/local/bin`. `apt` on Linux configures your `systemd` to start `monkd` as a service immediately after install and on system startup. Additionally, a `monkd` user group is created and assigned appropriately.

All data files needed for MonkOS' operation are created in `/var/lib/monkd` (Linux) and `~/.monk` (both Linux and macOS) upon first `monkd` startup.

The `monk` command will install `bash` and `zsh` autocompletion in your dotfiles on first use. Changes to the dotfiles are reversed upon package removal.
---
title: "Create Your MonkOS Account"
---

# MonkOS Accounts & Authentication

You need an account in order to use Monk. Getting one is free, straightforward, and it shouldn't take more than a couple of seconds.

---

## Register Using CLI

You are going to need a working MonkOS installation before proceeding. If you haven't installed MonkOS yet, see [Getting Monk](get-monk.md).

## Register

To sign up for a new MonkOS account, run:

    monk register

You will be asked for:

-   email address
-   new password
-   password confirmation

You will be asked to verify your email address before logging in. Check your email!

:::warning

Choose a strong password to secure your MonkOS account. We recommend passwords longer than 12 characters.

:::

## Log In

While using MonkOS tools, you will be asked to log in while performing various actions. In order to log in permanently, do the following:

    monk login

You will be asked for:

-   the email address you used to register
-   the password you chose when registering

## Log Out

If your work with the CLI is finished you might choose to log out. Here is how:

    monk logout

## Forgotten Password?

To reset your password, you can use the following command:

    monk reset

---

If you've been following along, you now have a working MonkOS installation. See these first steps in context in the next section: [MonkOS in 10 minutes](../basics/monk-in-10.md).
