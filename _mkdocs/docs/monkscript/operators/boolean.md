# Boolean
## `and`
=== "Signature"

    ```clojure
    (b Bool) (a Bool) | and | (a && b Bool)
    ```
=== "Example"

    ```clojure
    true false and => false
    ```
Boolean AND.
## `contains?`, `has?`
=== "Signature"

    ```clojure
    (a Bool) | contains? | (!a Bool)
    ```
=== "Example"

    ```clojure
    true contains? => false
    ```
Boolean NOT.
## `eq?`, `equal?`
=== "Signature"

    ```clojure
    (a Bool) | eq? | (!a Bool)
    ```
=== "Example"

    ```clojure
    true eq? => false
    ```
Boolean NOT.
## `not`
=== "Signature"

    ```clojure
    (a Bool) | not | (!a Bool)
    ```
=== "Example"

    ```clojure
    true not => false
    ```
Boolean NOT.
## `not-equal?`, `not-eq?`
=== "Signature"

    ```clojure
    (a Bool) | not-equal? | (!a Bool)
    ```
=== "Example"

    ```clojure
    true not-equal? => false
    ```
Boolean NOT.
## `or`
=== "Signature"

    ```clojure
    (b Bool) (a Bool) | or | (a || b Bool)
    ```
=== "Example"

    ```clojure
    true false or => true
    ```
Boolean OR.
## `xor`
=== "Signature"

    ```clojure
    (b Bool) (a Bool) | xor | (a != b Bool)
    ```
=== "Example"

    ```clojure
    true true xor => false
    ```
Boolean XOR.
