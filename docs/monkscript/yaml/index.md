---
title: MonkOS YAML
slug: /monkscript/yaml
---

```mdx-code-block
import CustomLink from '@site/src/components/customLink';
```

MonkOS uses YAML to express Kits. One of our design goals was to make YAML manageable and eliminate the need for pre-processing using external tools. In order to achieve succinct definitions and composability, we've defined three special keys on top of standard YAML: `namespace`, `defines` and `inherits`.

Additionally, MonkOS provides a `<-` macro that denotes an [Arrow script](./scripting) which can be used in place of _any_ value in YAML.

It's important to understand how they work before working with MonkScript in order to avoid confusion.

## Namespaces

Each MonkScript YAML file has to have `namespace` key as the first key in the file. This instructs the MonkScript loader to put the contents of the Kit under a chosen path in MonkOS internal database.

Consider the following example:

```yaml linenums="1"
namespace: hello-world

foo: ...

bar: ...
```

Loading this snippet will put both `foo` and `bar` under `/hello-world` so that they can be later referred to as:

-   `foo` &#8594;
    `hello-world/foo`
-   `bar` &#8594;
    `hello-world/bar`

## Arrow scripts

Consider the following example:

```yaml linenums="1"
quux:
    bar: <- local-ip concat(":8080")
```

This arrow script will put a local IP address with a `:8080` postfix into `bar`. Resolution of this script happens dynamically at Kit _runtime_. Final result would be as if the Kit looked like this:

```yaml linenums="1"
quux:
    bar: 127.0.0.1:8080
```

:::note

Learn more about [Arrow script &#8594;
](./scripting)

:::

## File embeds

Consider the following example:

```yaml linenums="1"
quux:
    #...
    variables: 
        foo: <<< foo.json 
```

The `<<<` instructs MonkOS to read the file `foo.json` relative to the currently interpreted YAML file and place its contents in `quux/variables/foo` as if they were pasted into YAML.

This is useful for embedding large text files into your definitions without cluttering the YAML. Keep in mind that the embedded file needs to be present whenever your Kit is loaded.

You can add content of the file by supplying path of the local file with `<<<`.

#### Example
```yaml linenums="1"
files:
    poem:
        path: /var/poem.txt
        container: dummy
        chmod: 0666
        raw: false
        contents: <<< files/poem.txt
```


## Inheritance

The most powerful feature of MonkScript is the ability to inherit any piece of YAML from any place in any definition. The inheritance mechanism practically eliminates the need for macro processing as it is capable of expressing many complex patterns by itself.

Consider the following example:

```yaml linenums="1"
foo:
    bar: 1
    baz: 2
    foos:
        - A
        - B
        - C

quux:
    inherits: ./foo ### let quux inherit foo
    baz: 3
    fnord:
        food: pizza
```

To Monk, `quux` is as if it was written in the following way:

```yaml linenums="1"
quux:
    bar: 1
    baz: 3
    foos:
        - A
        - B
        - C
    fnord:
        food: pizza
```

The `inherits` property can be used freely in any place in any definition and it can point to any path in any namespace known by Monk.

Inheritance can be used to:

-   Override any value in any Kit,
-   Compose a complex definition out of simple ones,
-   Re-use common definitions across multiple components,
-   Create multiple flavors or versions of the same runnable easily.

## Definitions

Consider the following definitions:

```yaml linenums="1"
foo:
    defines: runnable
    containers:
        ...
bar:
    defines: runnable
    fun-boxes:
```

Both `foo` and `bar` are [`runnable`](#runnable). The key defines has special meaning, it labels its parent node with a _descriptor_ (in this case, `runnable`). MonkOS finds relevant sections by looking at those descriptors.

By not deciding the meaning based on names, MonkScript allows for custom naming of all "special" sections. Notice that `foo` has `containers` but `bar` has `fun-boxes`. Both `containers` and `fun-boxes` has the same meaning to MonkOS as only the descriptor matters.

Not relying on key names allows MonkScript to be extended with every new release without affecting the existing Kits.

:::info

Be sure to remember about assigning proper descriptors to the relevant sections as MonkOS will not interpret them without it.

:::

Currently MonkOS recognizes several "special" sections, or definition classes higlighted below.

### `runnable`

Runnables are the basic unit in Monk. A `runnable` is essentially something that MonkOS can run, manage and then stop. This can be viewed as one or more containers meant to be standing together, plus associated resource definitions, variables etc.

<CustomLink to="./yaml/runnables">Learn more about Runnables</CustomLink>

### `process-group`

Groups (or `process-group`s) are compositions of multiple [runnables](#runnable) and other `groups` plus associated resources and state. This construct is used to compose other Kits in Monk.

<CustomLink to="./yaml/groups">Learn more about Groups</CustomLink>

