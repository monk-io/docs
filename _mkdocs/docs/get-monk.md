# Getting Monk

Here's how you install, test, and upgrade Monk.

!!!prerequisites

    Monk requires [Docker](https://www.docker.com/) to be present and running on your system. If you don't have Docker installed and running, please refer to ​[https://docs.docker.com/docker-for-mac/install/](​https://docs.docker.com/docker-for-mac/install/) and follow the steps detailed there in order to obtain Docker before installing Monk.

---

## Installing Monk

=== "macOS"

    **Installing with Homebrew**

    We provide a Homebrew repository containing official releases of Monk. You can obtain the latest stable version of Monk from this repository by running the following command:

        brew install monk-io/monk/monk

    Now run the Monk daemon in a fresh terminal:

        monkd

    !!! note

        `monkd` has to be running at all times when using `monk` or running any workloads via Monk. You might consider adding `monkd` to your `launchctl` configuration so that it stays running as a service. See [Running `monkd` as a service](./cli/monkd.md).

=== "Ubuntu and Debian"

    We run an APT repository containing official releases of Monk. You can obtain the latest stable version of Monk from this repository in two steps.

    Add Monk repository to your sources list:

        curl -s https://apt.monk.io/Release.gpg | sudo apt-key add -
        sudo echo "deb [arch=amd64] https://apt.monk.io/ stable main" | sudo tee /etc/apt/sources.list.d/monk.list
        sudo apt update

    Install `monkd` and `monk`:

        sudo apt install monk

    After this, `monkd` service will be started and added to your systemd configuration so that it stays running in the background.

    !!! note

        You might need to log out and log back in on your system to be able to use `monk` without `sudo`. Alternatively, use `su - <your-username>`.

=== "Other Linux Systems"

    Download the latest stable binary distribution of Monk for Linux:

        wget https://get.monk.io/stable/linux/monk-amd64-latest.tar.gz

    Unpack the zip file and move both `monk` and `monkd` into a folder that is on your `PATH`:

        tar -xvf monk-amd64-latest.tar.gz
        cd monk-amd64-latest
        cp monkd monk /usr/local/bin

    Open a fresh terminal and run `monkd`:

        monkd

    !!! note

        `monkd` has to be running at all times when using `monk` or running any workloads via Monk. You might consider adding monkd to your service management daemon configuration so that it stays running as a service.

!!! success

    All done! Go to [Testing the installation](#testing-your-setup) to try it out.

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

If you see similar output it means that the installation was successful and you may now start using Monk on your system 🎉

Continue to the [Guides section](guides/running-templates.md) to see how you can use Monk.

If for some reason the command didn't work, please check if you have followed all instructions.

## Upgrading Monk

Upgrading your local Monk to the newest version is simple.

=== "macOS"

        brew upgrade monk

=== "Ubuntu and Debian"

        sudo apt update
        sudo apt upgrade monkd monk

=== "Other Linux systems"

    1. Follow the steps in [Installing Monk](get-monk.md) to obtain the latest binaries.
    2. Replace the old binaries with the latest binaries.
    3. Restart `monkd`

If you have a cluster running:

1. Make sure you are connected to the cluster,
2. Make sure your local Monk is the latest version,
3. Run `monk system upgrade` to upgrade all the nodes to the newest version.

## Installation Impact

Monk aims to be a good steward of your filesystem and not scatter files throughout the disk. The Monk distribution is simple and consists of two binaries, `monkd` and `monk`. 

When installing with `apt` or `brew` those are placed or symlinked in `/usr/local/bin`. `apt` on Linux configures your `systemd` to start `monkd` as a service immediately after install and on system startup. Additionally, a `monkd` user group is created and assigned appropriately.

All data files needed for Monk's operation are created in `/var/lib/monkd` (Linux) and `~/.monk` (both Linux and macOS) upon first `monkd` startup.

The `monk` command will install `bash` and `zsh` autocompletion in your dotfiles on first use. Changes to the dotfiles are reversed upon package removal.
