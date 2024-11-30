import Tabs from '@theme/Tabs';
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

    curl https://apt.monk.io/repo-signing-key.pgp | sudo apt-key add
    echo "deb [arch=amd64] https://apt.monk.io stable main" | sudo tee -a  /etc/apt/sources.list.d/monk.list
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
    sudo apt install monkd monk

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
