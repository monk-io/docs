# `monkd`

<figure>
  <img src="/assets/monkd-cli.png" />
  <figcaption>`monkd` displaying help</figcaption>
</figure>

---

## Description

`monkd` is the Monk engine daemon. It implements all of Monk's functionalities and is required to be running in order for Monk setup to operate.

Running `monkd` in a normal scenario does not require any options.
It is advised to run `monkd` as a service on your system. See Running monccd as a service for an example setup.

### Usage

    monkd [flags]

### Options

`--analytics` _bool_
: Send anonymous usage data to Monk (default true)

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

To setup Monk as a service on a Linux system running systemd, create a config file like the one presented below and substitute the path to `monkd` binary for `PATH_TO_MONKD_BINARY`.

```ini
[Unit]
Description=Monk daemon

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

To setup Monk as a service on macOS, create a config file like the one presented below and substitute the path to `monkd` binary for `PATH_TO_MONKD_BINARY`.

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

!!!success

    `monkd` will start and will be automatically started on boot.

## Troubleshooting

This section contains solution to problems you may experience when running `monkd` as a service.

### File Limit Reached on macOS

By default, macOS limits the number of open files per process to 256. Since `monkd` opens many network connections, it's easy to bump against this limit.

To fix this problem, you'll need to increase the open file limit. Run the following command with sudo before starting monkd:

    sudo launchctl limit maxfiles 4096 unlimited

This will set the limit to 4096 which is more than enough for `monkd`.

For more information, see [https://wilsonmar.github.io/maximum-limits/](https://wilsonmar.github.io/maximum-limits/)
