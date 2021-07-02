---
title: Containers
position: 6
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

## `container-domain-name`

<Tabs
  defaultValue="signature"
  values={[
    {label: 'Signature', value: 'signature'},
    {label: 'Example', value: 'example'},
  ]}
>

<TabItem value="signature">

```clojure
| container-domain-name(runnable-path String, container-name String) | (full-container-name String)
```

</TabItem>

<TabItem value="example">

```clojure
container-domain-name("some-runnable", "foo") => "some-runnable_foo"
```

</TabItem>

</Tabs>

Expands the `container-name` to its full form `full-container-name` (as seen in Docker) based on the runnable path
supplied in `runnable-path`.

## `container-name`

<Tabs
  defaultValue="signature"
  values={[
    {label: 'Signature', value: 'signature'},
    {label: 'Example', value: 'example'},
  ]}
>

<TabItem value="signature">

```clojure
| container-name(container-name String) | (full-container-name String)
```

</TabItem>

<TabItem value="example">

```clojure
container-name("foo") => "some-runnable_foo"
```

</TabItem>

</Tabs>

Expands the `container-name` to its full form  `full-container-name` (as seen in Docker) based on the runnable path
in which this operation is executed.

## `exec`

<Tabs
  defaultValue="signature"
  values={[
    {label: 'Signature', value: 'signature'},
    {label: 'Example', value: 'example'},
  ]}
>

<TabItem value="signature">

```clojure
| exec(runnable-path String, container-name String, cmd String, ...) | (stdout String)
```

</TabItem>

<TabItem value="example">

```clojure
exec("foo/bar", "baz", "cat", "foo.txt") => "contents of foo.txt"
```

</TabItem>

</Tabs>

Executes command `cmd` in container `container-name` being a part of `runnable-path` runnable.
The `cmd` argument can be spreat across any number of argumens.
