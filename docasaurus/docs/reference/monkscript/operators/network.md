# Network
## `get-hostname`, `get-container-ip`
=== "Signature"

    ```clojure
    | get-hostname(runnable-path String, container-name String) | (container-hostname String)
    ```
=== "Example"

    ```clojure
    get-hostname("foo/bar","baz") => "foo-bar_baz"
    ```
Finds a container by its `runnable-path` and name `container-name` and returns its
hostname `container-hostname` on the overlay DNS or the bridge network as a fallback.
## `ip-address-public`
=== "Signature"

    ```clojure
    | ip-address-public | (ip String)
    ```
=== "Example"

    ```clojure
    ip-address-public => "1.2.3.4"
    ```
Returns current public `ip` of the node it was executed on.
The address is obtained by calling `http://ipecho.net/plain`.
