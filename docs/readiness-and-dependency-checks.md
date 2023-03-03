---
title: "Readiness & Dependency Checks"
---

# Readiness & Dependency Checks

Sometimes you want to delay start of your application until you are sure that your application is ready to serve traffic.  
Monk comes with a readiness checks that will basically perform some tests to check if application is up and running.

## Readiness

Using combination of Monk functions and readiness checks we can create custom `checks` associated with any `runnable`. Currently the only special check is `readiness`, which is connected with `depends` clause. This check allows the defining `runnable` to determine and advertise its status to other runnables which may use `depends` to wait for it to be ready.

Whenever a `readiness` check fails (returns `false` or an error), Monk will report an error when trying to run other runnables that depend on it.

By default, when no `readiness` check is specfied all runnables are considered to be ready immediately after starting.

Let's learn how to define a `readiness` check.

### Definition

Lets have a look at full definition of readiness:

```yaml
readiness:
    code: <Arrow script code>
    period: <time in seconds>
    initialDelay: <time in seconds>
    attempts: <number of max retries>
```

`code` - is the place where we will put our Arrow script to check readiness, 
`period` - specifies how often (in seconds) Monk will perform this check, 
`initialDelay` - initial delay (in seconds) before Monk will start checking application health,
`attempts` - specifies how many times (max) to perform this check until Monk decides that application
didn't start properly, default is 10.

### Example

Lets have a look at following example:

```yaml
namespace: readiness

common:
    containers:
        fooc:
            image: alpine
            image-tag: latest
            bash: sleep 3600

bar:
    defines: runnable
    inherits: ./common
    checks:
        readiness:
            code: |
                exec("fooc", "ps", "-ef") "sleep" contains?
            period: 15
            initialDelay: 5
```

In this example we have defined one 'common' container that we can re-use in our application, it is just simple alpine image that will run for 1h.  
As next step we have defined a `bar` runnable that will inherit our common `alpine` image and additionally it will have readiness check defined.  
Combining power of monk script a [exec](monkscript/scripting/operators/containers#exec) function and [contains](monkscript/scripting/operators/boolean#contains-has) function we check if `sleep` process is running.

## Dependency

Any `runnable` can define its runtime dependencies using a `depends` section. In this section we define which other runnables the given runnable is waiting for before starting. Monk will report an error if all dependencies are not met i.e. is any of the listed `runnables` is not running or its `readiness` check fails after specified period.

### Definition

Lets have a look at full definition of dependency checks:

```yaml
depends:
    wait-for:
        runnables:
            - <a runnable path to wait for>
            - ...
        timeout: <time in seconds to wait for all runnables to be ready>
```

### Example

We will expand our example from before a little bit. To our readiness check we will add another runnable that will depend on the one that needs to be 'healthy'. We will do that using `wait-for` definition:

```yaml
namespace: readiness

common:
    containers:
        foo:
            image: alpine
            image-tag: latest
            bash: sleep 3600

bar:
    defines: runnable
    inherits: ./common

    checks:
        readiness:
            code: |
                exec("foo", "ps", "-ef") contains?("sleep")
            period: 60
            initialDelay: 5
            attempts: 5

baz:
    defines: runnable
    inherits: ./common

    depends:
        wait-for:
            runnables:
                - ./bar
            timeout: 30

group:
    defines: process-group
    runnable-list:
        - /readiness/bar
        - /readiness/baz
```

We've added here our simple dependency using:

```yaml
depends:
    wait-for:
        runnables:
            - ./bar
        timeout: 30
```

This means that our `baz` runnable will wait 30 seconds for `bar` to start. If it doesn't monk will return error.
