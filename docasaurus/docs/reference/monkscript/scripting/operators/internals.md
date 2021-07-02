---
title: Internals
position: 7
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

## `append`

<Tabs
  defaultValue="signature"
  values={[
    {label: 'Signature', value: 'signature'},
    {label: 'Example', value: 'example'},
  ]}
>

<TabItem value="signature">

```clojure
(a Array) (x Any) | append | ([..., x] Array)
```

</TabItem>

<TabItem value="example">

```clojure
[] 8 append 9 append append => [8, 9]
```

</TabItem>

</Tabs>

Appends `x` to array `a`, leaves `a` on the stack.

## `array`

<Tabs
  defaultValue="signature"
  values={[
    {label: 'Signature', value: 'signature'},
    {label: 'Example', value: 'example'},
  ]}
>

<TabItem value="signature">

```clojure
| array | Array
```

</TabItem>

<TabItem value="example">

```clojure
array => []
```

</TabItem>

</Tabs>

Constructs an empty Array and pushes it to the stack.

## `assoc`

<Tabs
  defaultValue="signature"
  values={[
    {label: 'Signature', value: 'signature'},
    {label: 'Example', value: 'example'},
  ]}
>

<TabItem value="signature">

```clojure
(ob Object) (key String) (value Any) | assoc | (ob Object)
```

</TabItem>

<TabItem value="example">

```clojure
{} "foo" 6 assoc => {"foo": 6}
```

</TabItem>

</Tabs>

Sets `key` on the `ob` to `value` and leaves `ob` on the stack.

## `call`

<Tabs
  defaultValue="signature"
  values={[
    {label: 'Signature', value: 'signature'},
  ]}
>

<TabItem value="signature">

```clojure
(op-name String) (args [Any]) | call | (result Any)
```

</TabItem>

</Tabs>

Calls an operator `op-name` with arguments `args` and puts the `result` of its execution on the stack.

## `callf`

<Tabs
  defaultValue="signature"
  values={[
    {label: 'Signature', value: 'signature'},
  ]}
>

<TabItem value="signature">

```clojure
(op-name String) (args [Any]) | callf | (result Any)
```

</TabItem>

</Tabs>

Calls an operator `op-name` with arguments `args` and puts the `result` of its execution on the stack.

## `const`

<Tabs
  defaultValue="signature"
  values={[
    {label: 'Signature', value: 'signature'},
  ]}
>

<TabItem value="signature">

```clojure
| const(x Any) | (x Any)
```

</TabItem>

</Tabs>

Pushes a constant `x` of any type onto the stack.

## `dup`

<Tabs
  defaultValue="signature"
  values={[
    {label: 'Signature', value: 'signature'},
    {label: 'Example', value: 'example'},
  ]}
>

<TabItem value="signature">

```clojure
(x Any) | dup | (x Any) (x Any)
```

</TabItem>

<TabItem value="example">

```clojure
1 dup => 1 1
```

</TabItem>

</Tabs>

Duplicates the topmost value on the stack.

## `get-member`

<Tabs
  defaultValue="signature"
  values={[
    {label: 'Signature', value: 'signature'},
    {label: 'Example', value: 'example'},
  ]}
>

<TabItem value="signature">

```clojure
(ob Object) | get-member(key String) | (val Any)
```

</TabItem>

<TabItem value="example">

```clojure
{"foo": 6} | get-member("foo") | 6
```

</TabItem>

</Tabs>

Gets value `val` from key `key` in object `ob` and pushes `val` onto the stack.
Will return `Nil` if `key` is not in `ob`.

## `mark`

<Tabs
  defaultValue="signature"
  values={[
    {label: 'Signature', value: 'signature'},
  ]}
>

<TabItem value="signature">

```clojure
| mark | <mark>
```

</TabItem>

</Tabs>

Sets mark on top of the stack.

## `object`

<Tabs
  defaultValue="signature"
  values={[
    {label: 'Signature', value: 'signature'},
    {label: 'Example', value: 'example'},
  ]}
>

<TabItem value="signature">

```clojure
| object | Object
```

</TabItem>

<TabItem value="example">

```clojure
object => {}
```

</TabItem>

</Tabs>

Constructs an empty Object and pushes it to the stack.

## `var`

<Tabs
  defaultValue="signature"
  values={[
    {label: 'Signature', value: 'signature'},
    {label: 'Example', value: 'example'},
  ]}
>

<TabItem value="signature">

```clojure
| var(var-name String) | (value Any)
```

</TabItem>

<TabItem value="example">

```clojure
var("foo") => 6
```

</TabItem>

</Tabs>

Pushes the `value` of a variable named `var-name` onto the stack.
