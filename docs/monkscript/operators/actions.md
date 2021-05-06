# Actions
## `act`
=== "Signature"

    ```clojure
    | act(action String, arg-name String, arg-value String, ...) | (value Any)
    ```
=== "Example"

    ```clojure
    act("namespace/runnable/action_name", "arg1", "val1", "arg2", "val2") => "result of the action"
    ```
Calls an action from path `action` with named arguments `arg-name`=`arg-value`. Accepts any number or argument name-value pairs.
The action will execute in another VM instance local to the running `namespace/runnable` on which it was called.
## `wait-for`
=== "Signature"

    ```clojure
    | wait-for(delay Int, max-attempts Int, action String, arg-name String, arg-value String, ...) | (value Any)
    ```
=== "Example"

    ```clojure
    wait-for("namespace/runnable/action_name", "arg1", "val1", "arg2", "val2") => "result of the action"
    ```
Attempts to call an action from path `action` with named arguments `arg-name`=`arg-value`.
It will try to call the action `max-attempts` times with `delay` in milliseconds between the attempts.
The action will execute in another VM instance local to the running `namespace/runnable` on which it was called.
