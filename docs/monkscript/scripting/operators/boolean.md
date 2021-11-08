---
title: Boolean
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

## `and`

<Tabs
defaultValue="signature"
values={[
{label: 'Signature', value: 'signature'},
{label: 'Example', value: 'example'},
]}>

<TabItem value="signature">

```clojure
(b Bool) (a Bool) | and | (a && b Bool)
```

</TabItem>

<TabItem value="example">

```clojure
true false and => false
```

</TabItem>

</Tabs>

Boolean AND.

## `contains?`, `has?`

<Tabs
defaultValue="signature"
values={[
{label: 'Signature', value: 'signature'},
{label: 'Example', value: 'example'},
]}>

<TabItem value="signature">

```clojure
(a Bool) | contains? | (!a Bool)
```

</TabItem>

<TabItem value="example">

```clojure
true contains? => false
```

</TabItem>

</Tabs>

Boolean NOT.

## `eq?`, `equal?`

<Tabs
defaultValue="signature"
values={[
{label: 'Signature', value: 'signature'},
{label: 'Example', value: 'example'},
]}>

<TabItem value="signature">

```clojure
(a Bool) | eq? | (!a Bool)
```

</TabItem>

<TabItem value="example">

```clojure
true eq? => false
```

</TabItem>

</Tabs>

Boolean NOT.

## `not`

<Tabs
defaultValue="signature"
values={[
{label: 'Signature', value: 'signature'},
{label: 'Example', value: 'example'},
]}>

<TabItem value="signature">

```clojure
(a Bool) | not | (!a Bool)
```

</TabItem>

<TabItem value="example">

```clojure
true not => false
```

</TabItem>

</Tabs>

Boolean NOT.

## `not-equal?`, `not-eq?`

<Tabs
defaultValue="signature"
values={[
{label: 'Signature', value: 'signature'},
{label: 'Example', value: 'example'},
]}>

<TabItem value="signature">

```clojure
(a Bool) | not-equal? | (!a Bool)
```

</TabItem>

<TabItem value="example">

```clojure
true not-equal? => false
```

</TabItem>

</Tabs>

Boolean NOT.

## `or`

<Tabs
defaultValue="signature"
values={[
{label: 'Signature', value: 'signature'},
{label: 'Example', value: 'example'},
]}>

<TabItem value="signature">

```clojure
(b Bool) (a Bool) | or | (a || b Bool)
```

</TabItem>

<TabItem value="example">

```clojure
true false or => true
```

</TabItem>

</Tabs>

Boolean OR.

## `xor`

<Tabs
defaultValue="signature"
values={[
{label: 'Signature', value: 'signature'},
{label: 'Example', value: 'example'},
]}>

<TabItem value="signature">

```clojure
(b Bool) (a Bool) | xor | (a != b Bool)
```

</TabItem>

<TabItem value="example">

```clojure
true true xor => false
```

</TabItem>

</Tabs>

Boolean XOR.
