---
title: Types
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

## `to-bi`, `to-bigint`

<Tabs
  defaultValue="signature"
  values={[
    {label: 'Signature', value: 'signature'},
    {label: 'Example', value: 'example'},
  ]}
>

<TabItem value="signature">

```clojure
(value Any) | to-bi | (y BigInt)
```

</TabItem>

<TabItem value="example">

```clojure
88 to-bi => 88n
```

</TabItem>

</Tabs>

Coerces any `value` to BigInt.

## `to-float`, `to-f`

<Tabs
  defaultValue="signature"
  values={[
    {label: 'Signature', value: 'signature'},
    {label: 'Example', value: 'example'},
  ]}
>

<TabItem value="signature">

```clojure
(value Any) | to-float | (y Float)
```

</TabItem>

<TabItem value="example">

```clojure
88 to-float => 88.0
```

</TabItem>

</Tabs>

Coerces any `value` to Float.

## `to-int`, `to-i`

<Tabs
  defaultValue="signature"
  values={[
    {label: 'Signature', value: 'signature'},
    {label: 'Example', value: 'example'},
  ]}
>

<TabItem value="signature">

```clojure
(value Any) | to-int | (y Int)
```

</TabItem>

<TabItem value="example">

```clojure
"99" to-int => 99
```

</TabItem>

</Tabs>

Coerces any `value` to Int.

## `to-string`, `to-s`

<Tabs
  defaultValue="signature"
  values={[
    {label: 'Signature', value: 'signature'},
    {label: 'Example', value: 'example'},
  ]}
>

<TabItem value="signature">

```clojure
(value Any) | to-string | (y String)
```

</TabItem>

<TabItem value="example">

```clojure
88 to-string => "88"
```

</TabItem>

</Tabs>

Coerces any `value` to String.
