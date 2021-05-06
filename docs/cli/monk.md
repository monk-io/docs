# `monk`

<figure>
  <img src="/assets/monk-cli.png" />
  <figcaption>`monk` CLI displaying help</figcaption>
</figure>

## Description

`monk` is the Monk Command Line Interface. This command features many sub-commands that work with various aspects of a Monk system.

`monk` connects to monkd via a socket and issues commands to it, thus, in order to use monk there has to be an instance of `monkd` running.

## Usage

    monk [global options] command [command options] [arguments...]

Some of the commands require flags or positional arguments. If a flag or argument is required and was not specified, the CLI will ask for its value interactively.

## Commands

```
monk help
```

Use `monk`'s help command to get up-to-date information about available commands and details on each one of them. You can also append `--help` to any invocation of `monk` or its sub-commands to see available flags and options.

## Global convenience flags and settings

The CLI features a nicely formatted, colorful and interactive input by default. These features can be disabled globally for all commands if you wish to run monk in a script. This can be configured either by environment variables or global flags going before the command (right after `monk`).
For instance, to disable colored output do:

    monk --nocolor ...

or

    MONK_CLI_NO_COLOR=1 monk ...

## Parsing monk output

`monk` prints the final output to `stdout` and the messages intended for humans go to `stderr`. If you wish to parse `monk` output you just need to read `stdout`.

!!!hint

    Using `--nocolor` or `--nofancy` flags or setting their equivalent environment variables might help with parsing the output.

## Argument-flag order is important

In the current version, the CLI accepts flags in order specified by the usage. This means that it is important to take some care when specifying flags. For instance:

    monk run foo/bar --tag=quux

will ignore the `--tag` flag since it stands after the argument `foo/bar`. The correct usage is:

    monk run --tag=quux foo/bar

!!!note

    This will be fixed in future versions but please remember about it for now 😅
