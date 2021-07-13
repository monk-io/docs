# HTTP
## `http-get`
=== "Signature"

    ```clojure
    | http-get(url String, options Object?) | (body String)
    ```
=== "Example"

    ```clojure
    http-get("https://yesno.wtf/api") parse-json get-member("answer") => "yes"
    ```
Http(s) GET `url`, results in response `body` as a string or `nil` on error.
Takes an optional `options` object, currently only supports `headers`.
## `http-post`
=== "Signature"

    ```clojure
    (req-body String) | http-post(url String, options Object?) | (body String)
    ```
=== "Example"

    ```clojure
    "foo" http-post("https://postman-echo.com/post") => "fooo"
    ```
Http(s) POST to `url` with `req-body` as the request body, results in response `body` as a string or `nil` on error.
Takes an optional `options` object, currently only supports `headers`.
