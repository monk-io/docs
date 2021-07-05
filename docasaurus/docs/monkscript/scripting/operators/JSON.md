---
title: JSON
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

## `parse-json`

<Tabs
  defaultValue="signature"
  values={[
    {label: 'Signature', value: 'signature'},
    {label: 'Example', value: 'example'},
  ]}
>

<TabItem value="signature">

```clojure
(x String) | parse-json | (y Any)
```

</TabItem>

<TabItem value="example">

```clojure
'[{"foo": 99}, 6]' parse-json => [{"foo": 99}, 6]
```

</TabItem>

</Tabs>

Parses a JSON string `x` and returns its value `y`.

## `to-json`

<Tabs
  defaultValue="signature"
  values={[
    {label: 'Signature', value: 'signature'},
    {label: 'Example', value: 'example'},
  ]}
>

<TabItem value="signature">

```clojure
(x Any) | to-json | (y String)
```

</TabItem>

<TabItem value="example">

```clojure
[{"foo": 99}, 6] to-json => '[{"foo": 99}, 6]'
```

</TabItem>

</Tabs>

Turns any value `x` into its JSON string representation `y`.
