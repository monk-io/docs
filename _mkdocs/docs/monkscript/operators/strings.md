# Strings
## `concat`
=== "Signature"

    ```clojure
    (b String) (a String) | concat | (a+b String)
    ```
=== "Example"

    ```clojure
    "foo" "bar" concat => "foobar"
    ```
Concatenates two strings and puts the result onto the stack.
## `concat-all`
=== "Signature"

    ```clojure
    <mark> (as ...String) | concat-all | (a String)
    ```
=== "Example"

    ```clojure
    "a" "b" "c" "d" concat-all => "abcd"
    ```
Concatenates all the strings on the stack down to the mark andputs the result on the stack.
## `trim`
=== "Signature"

    ```clojure
    (x String) | trim | (y String)
    ```
=== "Example"

    ```clojure
    " foo " trim => "foo"
    ```
Removes trailing and leading whitespace around a string.
