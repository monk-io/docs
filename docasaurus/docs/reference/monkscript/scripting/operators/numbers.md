---
title: Numbers
position: 10
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

## `to-hex`

<Tabs
  defaultValue="signature"
  values={[
    {label: 'Signature', value: 'signature'},
    {label: 'Example', value: 'example'},
  ]}
>

<TabItem value="signature">

```clojure
(x Number) | to-hex(prefix Bool?) | (y String)
```

</TabItem>

<TabItem value="example">

```clojure
16 to-hex(true) => "0xF"
```

</TabItem>

</Tabs>

Converts number `x` to a hex string `y`.
Adds `0x` prefix when `prefix` is `true`.
