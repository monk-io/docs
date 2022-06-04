Services are much like [Runnables](runnables.md) but they don't define any containers and associated lifecycle sections. Services are meant to be an abstract counterpart of Runnables that defines 3rd party services existing outside of Monk control. They can be useful for representing external APIs together with associated state, actions and variables.

Services can be composed with other Services and Runnables to form [Groups](/monkscript/yaml/groups).

## Minimal example

=== "runnable.yaml"

    ```yaml linenums="1"
    namespace: reference

    example-runnable:
        defines: runnable

        containers:
            utils:
                image: amouat/network-utils
                image-tag: latest
                entrypoint: sleep 36000
    ```

    This example shows a runnable `example-runnable` inside a namespace `reference`. At minimum, a valid `runnable` must have a [`containers`](#containers) sub-section containing at least one container.

## Sub-sections

Runnable sections can have multiple sub-sections of special meaning. All definitions applicable inside a `runnable` are described below.

### `containers`

!!! info inline end ""

    **Applicable to:**  [`runnable`](#)

    **Required:** yes

```yaml
containers:
    container-a: ...
    container-b: ...
```

Containers section is a map of [`container`](#container), each container is named by its key (`container-a`, `container-b` in above example). Names can be any valid YAML key.

#### `container`

!!! info inline end ""

    **Applicable to:** [`containers`](#containers)

    **Required:** at least one

```yaml
container-name:
    image: string
    image-tag: string
    entrypoint: container entrypoint
    bash: shell command to run
    workdir: container working directory
    environment:
        - list of environment variables
    ports:
        - list of public port mappings
    paths:
        - list of paths to mount
    labels:
        - list of labels
```

| Field        | Value                                                  | Purpose                                                     | Required                    |
| ------------ | ------------------------------------------------------ | ----------------------------------------------------------- | --------------------------- |
| `image`      | `alpine`, `alpine:latest`, `gcr.io/someimage`          | A container image to run                                    | yes                         |
| `image-tag`  | `latest`, `v2`                                         | Image tag, will override the one in `image` if present.     | only when no tag in `image` |
| `entrypoint` | `run.sh --someoption`                                  | Container entrypoint, will override the image's entrypoint. | no                          |
| `bash`       | `rm /app/cache`                                        | A shell command to run upon container start.                | no                          |
| `ports`      | list of: `8080`, `8080:9090`, `0.0.0.0:8080:9090`      | A list of ports to bind and publish to the internet.        | no                          |
| `paths`      | list of: `host/path:container/path`                    | A list of filesystem paths to bind.                         | no                          |
| `labels`     | list of: `"com.example.description=Accounting webapp"` | A list of container labels.                                 | no                          |

### `variables`

!!! info inline end ""

    **Applicable to:** [`runnable`](#)

    **Required:** no

```yaml
variables:
    variable-a: ...
    variable-b: ...
```

Variables section is a map of [`variable`](#variable), each container is named by its key (`variable-a`, `variable-b` in above example). Names can be any valid YAML key.

!!! info

    These variables are not environment variables - they live on Monk's control plane. Use `env` to bind them to environment variables if you need.

#### `variable`

!!! info inline end ""

    **Applicable to:** [`variables`](#variables)

    **Required:** at least one

```yaml
variable-name:
    type: variable type
    value: variable value
    env: environment variable to bind to

variable-name: variable value
```

A variable can either just specify the value - in which case the type is inferred automatically, or specify its type and value.

| Field   | Value                            | Purpose                                                                               | Required |
| ------- | -------------------------------- | ------------------------------------------------------------------------------------- | -------- |
| `type`  | one of: `string`, `int`, `float` | Type of the variable                                                                  | yes      |
| `value` | anything                         | Initial value of the variable                                                         | yes      |
| `env`   | `VAIRABLE_NAME`                  | Name of environment variable that will receive the variable's value in all containers | no       |

### `actions`

!!! info inline end ""

    **Applicable to:** [`runnable`](#)

    **Required:** no

```yaml
variables:
    action-a: ...
    action-b: ...
```

Action section is a map of [`action`](#action), each container is named by its key (`action-a`, `action-b` in above example). Names can be any valid YAML key.

#### `action`

!!! info inline end ""

    **Applicable to:** [`actions`](#actions)

    **Required:** yes

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
