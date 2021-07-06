# Containers
## `container-domain-name`
=== "Signature"

    ```clojure
    | container-domain-name(runnable-path String, container-name String) | (full-container-name String)
    ```
=== "Example"

    ```clojure
    container-domain-name("some-runnable", "foo") => "some-runnable_foo"
    ```
Expands the `container-name` to its full form `full-container-name` (as seen in Docker) based on the runnable path
supplied in `runnable-path`.
## `container-name`
=== "Signature"

    ```clojure
    | container-name(container-name String) | (full-container-name String)
    ```
=== "Example"

    ```clojure
    container-name("foo") => "some-runnable_foo"
    ```
Expands the `container-name` to its full form  `full-container-name` (as seen in Docker) based on the runnable path
in which this operation is executed.
## `exec`
=== "Signature"

    ```clojure
    | exec(runnable-path String, container-name String, cmd String, ...) | (stdout String)
    ```
=== "Example"

    ```clojure
    exec("foo/bar", "baz", "cat", "foo.txt") => "contents of foo.txt"
    ```
Executes command `cmd` in container `container-name` being a part of `runnable-path` runnable.
The `cmd` argument can be spreat across any number of argumens.
