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
