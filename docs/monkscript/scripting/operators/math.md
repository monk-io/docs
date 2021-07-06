---
title: Maths
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

## `add`

<Tabs
  defaultValue="signature"
  values={[
    {label: 'Signature', value: 'signature'},
    {label: 'Example', value: 'example'},
  ]}
>

<TabItem value="signature">

```clojure
(a Number) (b Number) | add | (a + b Number)
```

</TabItem>

<TabItem value="example">

```clojure
1 2 add => 3
```

</TabItem>

</Tabs>

Adds two numbers and returns the result.
This operation promotes the result to a proper type based on argument types.

## `cmp`

<Tabs
  defaultValue="signature"
  values={[
    {label: 'Signature', value: 'signature'},
    {label: 'Example', value: 'example'},
  ]}
>

<TabItem value="signature">

```clojure
(a Number) (b Number) | cmp | (a == b Bool)
```

</TabItem>

<TabItem value="example">

```clojure
7 2 cmp => false
```

</TabItem>

</Tabs>

Compares two numbers.

## `div`

<Tabs
  defaultValue="signature"
  values={[
    {label: 'Signature', value: 'signature'},
    {label: 'Example', value: 'example'},
  ]}
>

<TabItem value="signature">

```clojure
(a Number) (b Number) | div | (a / b Number)
```

</TabItem>

<TabItem value="example">

```clojure
1 2 div => 0.5
```

</TabItem>

</Tabs>

Divides `a` by `b` and returns the result.
This operation promotes the result to a proper type based on argument types.

## `mult`

<Tabs
  defaultValue="signature"
  values={[
    {label: 'Signature', value: 'signature'},
    {label: 'Example', value: 'example'},
  ]}
>

<TabItem value="signature">

```clojure
(a Number) (b Number) | mult | (a * b Number)
```

</TabItem>

<TabItem value="example">

```clojure
2 2 mult => 4
```

</TabItem>

</Tabs>

Multiplies two numbers and returns the result.
This operation promotes the result to a proper type based on argument types.

## `sub`

<Tabs
  defaultValue="signature"
  values={[
    {label: 'Signature', value: 'signature'},
    {label: 'Example', value: 'example'},
  ]}
>

<TabItem value="signature">

```clojure
(a Number) (b Number) | sub | (a - b Number)
```

</TabItem>

<TabItem value="example">

```clojure
1 2 sub => -1
```

</TabItem>

</Tabs>

Subtracts `b` from `a` and returns the result.
This operation promotes the result to a proper type based on argument types.
