---
title: Strings
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

## `concat`

<Tabs
  defaultValue="signature"
  values={[
    {label: 'Signature', value: 'signature'},
    {label: 'Example', value: 'example'},
  ]}
>

<TabItem value="signature">

```clojure
(b String) (a String) | concat | (a+b String)
```

</TabItem>

<TabItem value="example">

```clojure
"foo" "bar" concat => "foobar"
```

</TabItem>

</Tabs>

Concatenates two strings and puts the result onto the stack.

## `concat-all`

<Tabs
  defaultValue="signature"
  values={[
    {label: 'Signature', value: 'signature'},
    {label: 'Example', value: 'example'},
  ]}
>

<TabItem value="signature">

```clojure
<mark> (as ...String) | concat-all | (a String)
```

</TabItem>

<TabItem value="example">

```clojure
"a" "b" "c" "d" concat-all => "abcd"
```

</TabItem>

</Tabs>

Concatenates all the strings on the stack down to the mark andputs the result on the stack.

## `trim`

<Tabs
  defaultValue="signature"
  values={[
    {label: 'Signature', value: 'signature'},
    {label: 'Example', value: 'example'},
  ]}
>

<TabItem value="signature">

```clojure
(x String) | trim | (y String)
```

</TabItem>

<TabItem value="example">

```clojure
" foo " trim => "foo"
```

</TabItem>

</Tabs>

Removes trailing and leading whitespace around a string.
