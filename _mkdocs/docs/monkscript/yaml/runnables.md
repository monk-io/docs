Runnables are the most common and basic unit in Monk. They represent a container or multiple containers meant to be standing together on a single node together with all necessary resources and configuration. Runnables can be composed together to form [Groups](/monkscript/yaml/groups).

## Minimal example

=== "runnable.yaml"

    ```yaml linenums="1"
    namespace: reference

    example-runnable:
        defines: runnable

        containers:
            defines: containers
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
    defines: containers
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
    defines: variables
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
    defines: actions
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

### `files`

!!! info inline end ""

    **Applicable to:** [`runnable`](#runnable)

    **Required:** no

```yaml linenums="1"
files:
    defines: files
    file-a: ...
    file-b: ...
```

Under this section there are definitions of [`file`](#file)s to be created in the container.

#### `file`

!!! info inline end ""

    **Applicable to:** [`files`](#file)

    **Required:** at least one

```yaml linenums="1"
file-a:
    path: path inside the container
    container: name of the container
    chmod: octal numeral
    raw: boolean
    contents: string
```

| Field       | Value                      | Purpose                                                                                                               | Required |
| ----------- | -------------------------- | --------------------------------------------------------------------------------------------------------------------- | -------- |
| `path`      | `/foo/bar`                 | the path in the container where the file needs to be stored                                                           | yes      |
| `container` | name of existing container | the name of the container sub-section describing the container that the file is to be created in                      | yes      |
| `chmod`     | octal number               | an octal numeral representing the file permissions (defaults to `0600` if omited).                                    | no       |
| `raw`       | `true` or `false`          | if set to `true`, the contents will not be interpreted as a Golang `text/template`, if `false` or omitted, they will  | no       |
| `contents`  | any text                   | the file contents. If `raw` is `false`, interpreted as a template. See [docs](https://golang.org/pkg/text/template/). | yes      |

The `contents` of the file can be either literal, or rendered by Golang's `text/template`. In the `contents`, if `raw` is not set to `true`, you can use the following to access the template variables:

```
{{ v "foo-bar" }} or {{ var "foo-bar" }}
```

It's useful to declare multiline file `contents` using YAML syntax `|`

#### Example

```yaml linenums="1"
files:
    defines: files
    poem:
        path: /var/poem.txt
        container: dummy
        chmod: 0666
        raw: false
        contents: |
            roses are {{ v "color" }}
            violets are {{ v "another-color" }}
            Monk is awesome!
```

### `checks`

Each runnable can contain status checks. Currently the only supported check is `readiness`.

#### Example

```yaml linenums="1"
checks:
    defines: checks
    readiness:
        code: exec("ethereum-node", "echo", "-e", "two") "two" contains?
        period: 15
        initialDelay: 13
```

### `depends`

Each runnable can contain depends section. Any runnable can wait for other runnables specified in `wait-for`.
This works by awaiting the results of [`readiness` `checks`](#checks) on all referenced [`runnables`](#runnable).

#### Example

```yaml linenums="1"
depends:
    defines: depends
    wait-for:
        runnables:
            - /some/another-runnable
        timeout: 60
```

### `recovery`

Each runnable can contain a recovery section.

If it doesn't exist, Monk will assume default values:

```
    after: 60s
    when: always
    mode: default
```

#### Example

```yaml linenums="1"
recovery:
    defines: recovery
    after: 60s # timeout before start recovey mechanism
    when: always/node-failure/container-failure/none # condition when to start recovery
    # node-failure - recover only if node is failed
    # container-failure - recover only if container is failed
    # none - doesn't recover runnable
    # pressure - recover only if node is under pressure
    # memory-pressure - recover only if node is memory under pressure
    # cpu-pressure - recover only if node is CPU under pressure
    # pid-pressure - recover only if node is pid under pressure
    # disk-pressure - recover only if node is disk under pressure
    mode: default/node/cluster
    # node - create new node on recovery
    # cluster - looking for resource on a exists cluster
    # default - first looking for resource on a exists cluster, then it tries to create new node
```

### `affinity`

Each runnable can contain `affinity` section. It's used to determine runtime placement of the `runnable`.

Eiher `tag` or `name` can be specified, depending on the choice, Monk will place the runnable either on any of the nodes bearing the `tag`, or on a specific node named by `name`.

If `resident` is `true` (`false` by default), Monk will search for an empty node and reserve it for the runnable in questions so that no other `runnable` will start on that node as long as the `runnable` in question is present.

If `ignore-pressure` is `true` (`false` by default) Monk will ignore pressure and consider all nodes, even the busy ones for allocation.

```yaml linenums="1"
affinity:
    defines: affinity
    tag: test-node
    name: test
    ignore-pressure: false
    resident: false
```
