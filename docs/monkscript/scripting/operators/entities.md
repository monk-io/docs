---
title: Entities
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

## `entity`

<Tabs
  defaultValue="signature"
  values={[
    {label: 'Signature', value: 'signature'},
    {label: 'Example', value: 'example'},
  ]}
>

<TabItem value="signature">

```clojure
| entity(entity-path String) | (entity Object)
```

</TabItem>

<TabItem value="example">

```clojure
entity("foo/bar") get-member("foo") => "bar"
```

</TabItem>

</Tabs>

Returns entity definition.

## `entity-state`

<Tabs
defaultValue="signature"
values={[
{label: 'Signature', value: 'signature'},
{label: 'Example', value: 'example'},
]}
>

<TabItem value="signature">

```clojure
| entity-state(entity-path String) | (entity-state Object)
```

</TabItem>

<TabItem value="example">

```clojure
entity-state("foo/bar") get-member("foo") => "bar"
```

</TabItem>

</Tabs>

Returns entity state.
