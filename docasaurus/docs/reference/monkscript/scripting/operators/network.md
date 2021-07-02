---
title: Network
position: 9
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

## `get-hostname`, `get-container-ip`

<Tabs
  defaultValue="signature"
  values={[
    {label: 'Signature', value: 'signature'},
    {label: 'Example', value: 'example'},
  ]}
>

<TabItem value="signature">

```clojure
| get-hostname(runnable-path String, container-name String) | (container-hostname String)
```

</TabItem>

<TabItem value="example">

```clojure
get-hostname("foo/bar","baz") => "foo-bar_baz"
```

</TabItem>

</Tabs>

Finds a container by its `runnable-path` and name `container-name` and returns its
hostname `container-hostname` on the overlay DNS or the bridge network as a fallback.

## `ip-address-public`

<Tabs
  defaultValue="signature"
  values={[
    {label: 'Signature', value: 'signature'},
    {label: 'Example', value: 'example'},
  ]}
>

<TabItem value="signature">

```clojure
| ip-address-public | (ip String)
```

</TabItem>

<TabItem value="example">

```clojure
ip-address-public => "1.2.3.4"
```

</TabItem>

</Tabs>

Returns current public `ip` of the node it was executed on.
The address is obtained by calling `http://ipecho.net/plain`.
