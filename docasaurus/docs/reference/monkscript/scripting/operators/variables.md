---
title: Variables
position: 14
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

## `set`

<Tabs
  defaultValue="signature"
  values={[
    {label: 'Signature', value: 'signature'},
    {label: 'Example', value: 'example'},
  ]}
>

<TabItem value="signature">

```clojure
(value Any) | set(var-name String) | (value Any)
```

</TabItem>

<TabItem value="example">

```clojure
9 set("foo") => 9
```

</TabItem>

</Tabs>

Sets variable named `var-name` to `value`.

## `set-tmp`

<Tabs
  defaultValue="signature"
  values={[
    {label: 'Signature', value: 'signature'},
    {label: 'Example', value: 'example'},
  ]}
>

<TabItem value="signature">

```clojure
(value Any) | set-tmp(var-name String) | (value Any)
```

</TabItem>

<TabItem value="example">

```clojure
9 set-tmp("foo") => 9
```

</TabItem>

</Tabs>

Sets **temporary** variable named `var-name` to `value`.
Temporary variables are local to the script, they are forgotten after single run.

## `unset`

<Tabs
  defaultValue="signature"
  values={[
    {label: 'Signature', value: 'signature'},
    {label: 'Example', value: 'example'},
  ]}
>

<TabItem value="signature">

```clojure
| unset(var-name String) |
```

</TabItem>

<TabItem value="example">

```clojure
9 unset("foo") => 9
```

</TabItem>

</Tabs>

Unsets **temporary** variable named `var-name`.
Temporary variables are local to the script, they are forgotten after single run.
