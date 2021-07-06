# Numbers
## `to-hex`
=== "Signature"

    ```clojure
    (x Number) | to-hex(prefix Bool?) | (y String)
    ```
=== "Example"

    ```clojure
    16 to-hex(true) => "0xF"
    ```
Converts number `x` to a hex string `y`.
Adds `0x` prefix when `prefix` is `true`.
