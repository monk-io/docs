---
title: Services
---

Services are much like [Runnables](runnables.md) but they don't define any containers and associated lifecycle sections. Services are meant to be an abstract counterpart of Runnables that defines 3rd party services existing outside of Monk control. They can be useful for representing external APIs together with associated state, actions and variables.

Services can be composed with other Services and Runnables to form [Groups](./groups).

## Minimal example

```yaml title="service.yaml" linenums="1"
namespace: reference

example-service:
    defines: service

    variables:
        defines: variables
        foo: 1
        bar: 2
```

This example shows a runnable `example-service` inside a namespace `reference`. At minimum, a valid `service` must have a [`variables`](#variables) sub-section containing at least one container.

## Sub-sections

Service sections can have multiple sub-sections of special meaning. All definitions applicable inside a `service` are described below.

### `variables`

```yaml
variables:
    defines: variables
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
    defines: actions
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
    defines: actions

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
