---
title: Actions
position: 4
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Actions
## `act`

<Tabs
  defaultValue="signature"
  values={[
    {label: 'Signature', value: 'signature'},
    {label: 'Example', value: 'example'},
  ]}
>

<TabItem value="signature">

```clojure
| act(action String, arg-name String, arg-value String, ...) | (value Any)
```

</TabItem>

<TabItem value="example">

```clojure
act("namespace/runnable/action_name", "arg1", "val1", "arg2", "val2") => "result of the action"
```

</TabItem>

</Tabs>

Calls an action from path `action` with named arguments `arg-name`=`arg-value`. Accepts any number or argument name-value pairs.
The action will execute in another VM instance local to the running `namespace/runnable` on which it was called.

## `wait-for`

<Tabs
  defaultValue="signature"
  values={[
    {label: 'Signature', value: 'signature'},
    {label: 'Example', value: 'example'},
  ]}
>

<TabItem value="signature">

```clojure
| wait-for(delay Int, max-attempts Int, action String, arg-name String, arg-value String, ...) | (value Any)
```

</TabItem>

<TabItem value="example">

```clojure
wait-for("namespace/runnable/action_name", "arg1", "val1", "arg2", "val2") => "result of the action"
```

</TabItem>

</Tabs>

Attempts to call an action from path `action` with named arguments `arg-name`=`arg-value`.
It will try to call the action `max-attempts` times with `delay` in milliseconds between the attempts.
The action will execute in another VM instance local to the running `namespace/runnable` on which it was called.
