# Readiness & Dependency Checks

Sometimes you want to delay start of your application until you are sure that your application is ready to serve traffic.  
Monk comes with a readiness checks that will basically perform some tests to check if application is up and running.  

## Readiness

Using combination of Monk functions and readiness checks we can create powerful checks.  

{ information of what happens if succeeds doesn't succed needed here}

### Definition
Lets have a look at full definition of readiness:  

```yaml
    readiness:
      code: |
        "ok" "ok" contains?
      period: 15
      initialDelay: 5
      interval: 30
```
`code` - is the place where we will put our monk script to check readiness  
`period` - is the value that defines how long monk will perform checks until it decides that application didn't start properly  
`initialDelay` - specified initial delay before monk will start checking application health  
`interval` - specifies how often monk will perform this check  

### Example
Lets have a look at following example:

```yaml
namespace: readiness

common:
  containers:
    defines: containers
    fooc:
      image: alpine
      image-tag: latest
      bash: sleep 3600

bar:
  defines: runnable
  inherits: ./common
  checks:
    defines: checks
    readiness:
      code: |
        exec("fooc", "ps", "-ef") "sleep" contains?
      period: 15
      initialDelay: 5
```

In this example we have defined one 'common' container that we can re-use in our application, it is just simple alpine image that will run for 1h.  
As next step we have defined a `bar` runnable that will inherit our common `alpine` image and additionally it will have readiness check defined.  
Combining power of monk script a [exec](/monkscript/operators/containers/#exec) function and [contains](/monkscript/operators/boolean/#contains-has) function we check if `sleep` process is running.

## Dependency

Dependency check is another type of check Monk can perform.  

{ information of what happens if succeeds doesn't succed needed here}

### Definition

Lets have a look at full definition of dependency checks:  

```yaml
  depends:
    defines: depends
    wait-for:
      runnables:
        - ./bar
      timeout: 30
{ can you put full definition of 'depends' here }
```

### Example

We will expand our example from before a little bit. To our readiness check we will add another runnable that will depend on the one that needs to be 'healthy'. We will do that using `wait-for` definition:

```yaml
namespace: readiness

common:
  containers:
    defines: containers
    fooc:
      image: alpine
      image-tag: latest
      bash: sleep 3600

bar:
  defines: runnable
  inherits: ./common

  checks:
    defines: checks
    readiness:
      code: |
        exec("fooc", "ps", "-ef") contains?("sleep")
      period: 60
      initialDelay: 5
      interval: 5

baz:
  defines: runnable
  inherits: ./common

  depends:
    defines: depends
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
    defines: depends
    wait-for:
      runnables:
        - ./bar
      timeout: 30
```

This means that our `baz` runnable will wait 30 seconds for `bar` to start. If it doesn't monk will return error.
