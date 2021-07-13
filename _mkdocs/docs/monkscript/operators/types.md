# Types
## `to-bi`, `to-bigint`
=== "Signature"

    ```clojure
    (value Any) | to-bi | (y BigInt)
    ```
=== "Example"

    ```clojure
    88 to-bi => 88n
    ```
Coerces any `value` to BigInt.
## `to-float`, `to-f`
=== "Signature"

    ```clojure
    (value Any) | to-float | (y Float)
    ```
=== "Example"

    ```clojure
    88 to-float => 88.0
    ```
Coerces any `value` to Float.
## `to-int`, `to-i`
=== "Signature"

    ```clojure
    (value Any) | to-int | (y Int)
    ```
=== "Example"

    ```clojure
    "99" to-int => 99
    ```
Coerces any `value` to Int.
## `to-string`, `to-s`
=== "Signature"

    ```clojure
    (value Any) | to-string | (y String)
    ```
=== "Example"

    ```clojure
    88 to-string => "88"
    ```
Coerces any `value` to String.
