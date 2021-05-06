# Math
## `add`
=== "Signature"

    ```clojure
    (a Number) (b Number) | add | (a + b Number)
    ```
=== "Example"

    ```clojure
    1 2 add => 3
    ```
Adds two numbers and returns the result.
This operation promotes the result to a proper type based on argument types.
## `cmp`
=== "Signature"

    ```clojure
    (a Number) (b Number) | cmp | (a == b Bool)
    ```
=== "Example"

    ```clojure
    7 2 cmp => false
    ```
Compares two numbers.
## `div`
=== "Signature"

    ```clojure
    (a Number) (b Number) | div | (a / b Number)
    ```
=== "Example"

    ```clojure
    1 2 div => 0.5
    ```
Divides `a` by `b` and returns the result.
This operation promotes the result to a proper type based on argument types.
## `mult`
=== "Signature"

    ```clojure
    (a Number) (b Number) | mult | (a * b Number)
    ```
=== "Example"

    ```clojure
    2 2 mult => 4
    ```
Multiplies two numbers and returns the result.
This operation promotes the result to a proper type based on argument types.
## `sub`
=== "Signature"

    ```clojure
    (a Number) (b Number) | sub | (a - b Number)
    ```
=== "Example"

    ```clojure
    1 2 sub => -1
    ```
Subtracts `b` from `a` and returns the result.
This operation promotes the result to a proper type based on argument types.
