# Variables
## `set`
=== "Signature"

    ```clojure
    (value Any) | set(var-name String) | (value Any)
    ```
=== "Example"

    ```clojure
    9 set("foo") => 9
    ```
Sets variable named `var-name` to `value`.
## `set-tmp`
=== "Signature"

    ```clojure
    (value Any) | set-tmp(var-name String) | (value Any)
    ```
=== "Example"

    ```clojure
    9 set-tmp("foo") => 9
    ```
Sets **temporary** variable named `var-name` to `value`.
Temporary variables are local to the script, they are forgotten after single run.
## `unset`
=== "Signature"

    ```clojure
    | unset(var-name String) |
    ```
=== "Example"

    ```clojure
    9 unset("foo") => 9
    ```
Unsets **temporary** variable named `var-name`.
Temporary variables are local to the script, they are forgotten after single run.
