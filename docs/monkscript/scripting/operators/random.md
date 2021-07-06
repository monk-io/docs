---
title: Random
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

## `random-uuid`

<Tabs
  defaultValue="signature"
  values={[
    {label: 'Signature', value: 'signature'},
    {label: 'Example', value: 'example'},
  ]}
>

<TabItem value="signature">

```clojure
| random-uuid | (uuid String)
```

</TabItem>

<TabItem value="example">

```clojure
random-uuid => "d7f2edc5-1ba0-45ab-a360-8927dcce9e42"
```

</TabItem>

</Tabs>

Returns a random UUID4.
