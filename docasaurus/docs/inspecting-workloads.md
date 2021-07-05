---
title: "Inspect workloads"
---

When working with multiple containers running on a big cluster it's important to know what's where and how it performs. Monk provides simple but effective tools for inspecting and troubleshooting your workloads.

---

## What's running right now?

    monk ps

The `ps` command will show you all containers currently running in your cluster at any time.

## How does my workload look like?

    monk describe some/template

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
