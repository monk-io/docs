# JSON-RPC
## `rpc-call`
=== "Signature"

    ```clojure
    (url String) | rpc-call(method String, args Any, ...) | (response Any)
    ```
=== "Example"

    ```clojure
    "http://localhost:4040/" rpc-call("count", ["foo", 7]) get-member("result") => 2
    ```
Calls JSON-RPC method `method` on `url` with any number of `args`. The response is
converted to an appropriate data type automatically.
