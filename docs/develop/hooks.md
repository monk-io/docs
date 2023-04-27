---
title: "Automate with Hooks"
---

Monk is able to run any action in response to an event. This mechanism is good for defining scripted actions that should happen in given circumstances over containers and other objects. It can be used to define custom recovery scenarios and even intricate auto-scaling schemes.

---

## Basic example

This is a very basic example of how a hook can be applied to generate a file inside a container every time it is started:

```yaml title="basic.yaml" linenums="1"
namespace: foobars

foo:
    defines: runnable
    containers:
        bar:
            image: alpine:latest
            entrypoint: <- `/bin/sh /root/r.sh`
            hooks:
                container-started: hello-world

    files:
        r1:
            path: /root/r.sh
            container: bar
            contents: "while true; do sleep 1; date; done"

    actions:
        hello-world:
            code: exec("bar", "/bin/sh", "-c", `echo "Hello World" > /tmp/hello`)
```

The container itself will just hang out and wait but this is perfect for us since we'll be inspecting its filesystem contents.

Run the Kit with:

    monk load basic.yaml
    monk run foobars/foo

Now use the shell command to enter the container:

    monk shell foobars/foo

See if `/tmp/hello` exists:

    $ cat /tmp/hello
    Hello World

This confirms that the `hello-world` action was in fact triggered by `container-started` event. The action ran the exec operator that used shell echo to place a file in the container.

## More on hooks

Monk supports the following hooks at the moment:

| Applicable in | Hook                 | Description                       |
| ------------- | -------------------- | --------------------------------- |
| container     | `container-starting` | Fires before the container start. |
| container     | `container-started`  | Fires after the container start.  |
| container     | `container-stopping` | Fires before the container stop.  |
| container     | `container-stopped`  | Fires after the container stop.   |

All hooks are asynchronous at the moment, meaning that the action called by the hook will run in parallel with other processes and won't block the hooked process.
