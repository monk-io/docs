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


