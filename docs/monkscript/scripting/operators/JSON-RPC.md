---
title: JSON-RPC
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

## `rpc-call`

<Tabs
  defaultValue="signature"
  values={[
    {label: 'Signature', value: 'signature'},
    {label: 'Example', value: 'example'},
  ]}
>

<TabItem value="signature">

```clojure
(url String) | rpc-call(method String, args Any, ...) | (response Any)
```

</TabItem>

<TabItem value="example">

```clojure
"http://localhost:4040/" rpc-call("count", ["foo", 7]) get-member("result") => 2
```

</TabItem>

</Tabs>

Calls JSON-RPC method `method` on `url` with any number of `args`. The response is
converted to an appropriate data type automatically.
