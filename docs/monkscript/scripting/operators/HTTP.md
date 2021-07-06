---
title: HTTP
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

## `http-get`

<Tabs
  defaultValue="signature"
  values={[
    {label: 'Signature', value: 'signature'},
    {label: 'Example', value: 'example'},
  ]}
>

<TabItem value="signature">

```clojure
| http-get(url String, options Object?) | (body String)
```

</TabItem>

<TabItem value="example">

```clojure
http-get("https://yesno.wtf/api") parse-json get-member("answer") => "yes"
```

</TabItem>

</Tabs>

Http(s) GET `url`, results in response `body` as a string or `nil` on error.
Takes an optional `options` object, currently only supports `headers`.

## `http-post`

<Tabs
  defaultValue="signature"
  values={[
    {label: 'Signature', value: 'signature'},
    {label: 'Example', value: 'example'},
  ]}
>

<TabItem value="signature">

```clojure
(req-body String) | http-post(url String, options Object?) | (body String)
```

</TabItem>

<TabItem value="example">

```clojure
"foo" http-post("https://postman-echo.com/post") => "fooo"
```

</TabItem>

</Tabs>

Http(s) POST to `url` with `req-body` as the request body, results in response `body` as a string or `nil` on error.
Takes an optional `options` object, currently only supports `headers`.
