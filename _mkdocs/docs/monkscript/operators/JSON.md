# JSON
## `parse-json`
=== "Signature"

    ```clojure
    (x String) | parse-json | (y Any)
    ```
=== "Example"

    ```clojure
    '[{"foo": 99}, 6]' parse-json => [{"foo": 99}, 6]
    ```
Parses a JSON string `x` and returns its value `y`.
## `to-json`
=== "Signature"

    ```clojure
    (x Any) | to-json | (y String)
    ```
=== "Example"

    ```clojure
    [{"foo": 99}, 6] to-json => '[{"foo": 99}, 6]'
    ```
Turns any value `x` into its JSON string representation `y`.
