# Internals
## `append`
=== "Signature"

    ```clojure
    (a Array) (x Any) | append | ([..., x] Array)
    ```
=== "Example"

    ```clojure
    [] 8 append 9 append append => [8, 9]
    ```
Appends `x` to array `a`, leaves `a` on the stack.
## `array`
=== "Signature"

    ```clojure
    | array | Array
    ```
=== "Example"

    ```clojure
    array => []
    ```
Constructs an empty Array and pushes it to the stack.
## `assoc`
=== "Signature"

    ```clojure
    (ob Object) (key String) (value Any) | assoc | (ob Object)
    ```
=== "Example"

    ```clojure
    {} "foo" 6 assoc => {"foo": 6}
    ```
Sets `key` on the `ob` to `value` and leaves `ob` on the stack.
## `call`
=== "Signature"

    ```clojure
    (op-name String) (args [Any]) | call | (result Any)
    ```
Calls an operator `op-name` with arguments `args` and puts the `result` of its execution on the stack.
## `callf`
=== "Signature"

    ```clojure
    (op-name String) (args [Any]) | callf | (result Any)
    ```
Calls an operator `op-name` with arguments `args` and puts the `result` of its execution on the stack.
## `const`
=== "Signature"

    ```clojure
    | const(x Any) | (x Any)
    ```
Pushes a constant `x` of any type onto the stack.
## `dup`
=== "Signature"

    ```clojure
    (x Any) | dup | (x Any) (x Any)
    ```
=== "Example"

    ```clojure
    1 dup => 1 1
    ```
Duplicates the topmost value on the stack.
## `get-member`
=== "Signature"

    ```clojure
    (ob Object) | get-member(key String) | (val Any)
    ```
=== "Example"

    ```clojure
    {"foo": 6} | get-member("foo") | 6
    ```
Gets value `val` from key `key` in object `ob` and pushes `val` onto the stack.
Will return `Nil` if `key` is not in `ob`.
## `mark`
=== "Signature"

    ```clojure
    | mark | <mark>
    ```
Sets mark on top of the stack.
## `object`
=== "Signature"

    ```clojure
    | object | Object
    ```
=== "Example"

    ```clojure
    object => {}
    ```
Constructs an empty Object and pushes it to the stack.
## `var`
=== "Signature"

    ```clojure
    | var(var-name String) | (value Any)
    ```
=== "Example"

    ```clojure
    var("foo") => 6
    ```
Pushes the `value` of a variable named `var-name` onto the stack.
