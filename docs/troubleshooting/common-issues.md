---
title: "Common Issues"
---

<!-- FIXME: the title might need to be reworked -->

Commonly encountered issues and how to resolve them.

### I need to generally troubleshoot my Monk installation

There may be situations where you need to check your Monk installation to troubleshoot
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
✔ CLI check: Version v3.9.0, build 6cce10a6
✔ Daemon check: Daemon is running: Version v3.9.0, build 6cce10a6
⚠ Cluster connection check: Cluster not connected
✔ NS consistency check: NS in consistent state
✔ Runtime check: Runtime version 20.10.14
✔ Host check: OS darwin darwin 13.3.1, Usage: CPU 0.00%, Memory 72.50%, Disk 57.69%
```

The above case is a situation showing what happens when the tool is installed
and running, but is not currently connected to a cluster. Common configuration
issues, like the state of the CLI tool itself, the daemon, and so forth, are all
checked as part of the `selftest` with the outputs displayed as above.

### Monk cannot connect to socket

If you do not have `monkd` running when you use the Monk CLI, you will encounter an
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


