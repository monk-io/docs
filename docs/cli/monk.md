# `monk`

![`monk` CLI displaying help](/img/docs/monk-cli.png)

## Description

`monk` is the Monk Command Line Interface. This command features many sub-commands that work with various aspects of a Monk system.

`monk` connects to `monkd` via a socket and issues commands to it, thus, in order to use monk there has to be an instance of `monkd` running.

## Usage

    monk [global options] command [command options] [arguments...]

Some of the commands require flags or positional arguments. If a flag or argument is required and was not specified, the CLI will ask for its value interactively.

## Commands

```
monk help
```

Use `monk`'s help command to get up-to-date information about available commands and details on each one of them. You can also append `--help` to any invocation of `monk` or its sub-commands to see available flags and options.

## Global Convenience Flags and Settings

The CLI features a nicely formatted, colorful, and interactive input by default. These features can be disabled globally for all commands if you wish to run monk in a script. This can be configured either by environment variables or global flags before the command (right after `monk`).

For instance, to disable colored output do:

    monk --nocolor ...

or

    MONK_CLI_NO_COLOR=1 monk ...

You can set these environment variables in your shell's environment file (i.e. `~/.bashrc`) to make them persistent for your user.

## Parsing Monk Output

`monk` prints the final output to `stdout` and messages intended for humans go to `stderr`. If you wish to parse `monk` output, you just need to read `stdout`.

:::info Hint

Using `--nocolor` or `--nofancy` flags or setting their equivalent environment variables might make it easier to parse the output.

:::

## Argument-flag Order is Important

In the current version, it is important to consider the order of flags when a string is needed for input. Consider the following example:

    monk run foo/bar --tag=quux

In this case, Monk will ignore the `--tag` flag since it is after after the argument `foo/bar`. The correct usage is:

    monk run --tag=quux foo/bar

:::note

This will be fixed in future versions but please remember it for now 😅

:::