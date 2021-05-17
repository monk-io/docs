Any value in YAML can be a script written in Monk's scripting language (Arrow script). The scripts might be as simple as reading a variable, or performing string interpolation, to more complex like making RPC or HTTP calls, performing calculations etc.

An Arrow script start with an arrow symbol `<-` followed by a sequence of variable references, constants and operator calls.

For example:

```yaml linenums="1"
value: <- `geth --syncmode ${syncmode} ${network} --rpc --rpcaddr 0.0.0.0`
```

this script composes a string from constant strings and the contents of `syncmode` and `network` [variables](yaml/runnables.md#variables).

## Evaluation

Arrow script is evaluated at **runtime**, this means that script definitions are stored and executed when needed during operation of the templates that defined them.

## Syntax

The language itself is simple, does not contain any general way to loop or branch. Instead, scripts are composed from values and pre-defined operators that take some value and return a new value, optionally taking arguments. This is comparable to stack based languages such as [Forth -->](<https://en.wikipedia.org/wiki/Forth_(programming_language)>).

A script is a sequence of [literal values](#values), [variable accesses](#variables) and [calls to operators](#operators). This form is similar to shell scripting with pipes (`|`) but with implicit pipes in between the elements.

For example:

```
<- $foo 2 add div(2) to-json
```

This would be equivalent to shell invocation similar to:

```
expr 2 + $foo | awk '{print $1/2}' | jq
```

Or, python:

```
json.dumps((2 + foo)/2)
```

### Values and Types

Monk recognizes several data types similar to JSON. See example literals in the table below:

| Type      | Example literals                | Comment                                                                                              |
| --------- | ------------------------------- | ---------------------------------------------------------------------------------------------------- |
| `Nil`     | `nil`                           | A type whose only value is `nil`. Used to denote a void value                                        |
| `Boolean` | `true`, `false`                 | Boolean values                                                                                       |
| `Int`     | `0b11`, `0xff`, `0777`, `-1337` | Integer numbers. Binary, octal, hexadecimal and decimal formats are supported                        |
| `BigInt`  | `123456789012n`                 | Big integer numbers                                                                                  |
| `Float`   | `0.1`, `-0.4e2`                 | Floating point numbers                                                                               |
| `String`  | `"foo"`, `'bar'`, `` `baz` ``   | Unicode character strings, standard escape syntax is supported                                       |
| `Array`   | `[1, "foo", []]`                | Array of values                                                                                      |
| `Object`  | `{"a": 1, b: 2, $var: 4}`       | A map from keys to values, keys can be any type, constant or variable but all are casted to `String` |
| `Func`    | `<-{ 1 add }`                   | First class code block, used for iterators and higher order operators such as `map` and `filter`     |

Literals can be used in any place in Arrow scripts.

Arrow script falls into category of strongly typed dynamic languages meaning that the operators expect certain types of values will not generally work with other types by performing behind the scenes conversions. At the same time, the types are determined at runtime and values can be freely converted from one type to another.

### Variables

Variables in scripts refer to [variables](yaml/runnables.md#variables) defined in YAML. Variables are accessed using `$` sign. Variable names can consist of letters, numbers, hyphens and underscores, as well as other unicode characters except the `$` and as long as a letter is used as the first character.

For example:

```
<- $foo $bar add
```

Will return `3` as long as it is placed within a [`runnable`](yaml/runnables.md) containing the following definition:

```yaml
variables:
    defines: variables
    foo: 1
    bar: 2
```

Variables can be used as parenthesized arguments to operators:

```
<- $foo add($bar)
```

### Operators

Operators are pre-defined functions which usually take one or more preceding values together with parenthesized arguments and produce another value. Operators can also perform work behind the scenes causing side-effects such as calling HTTP APIs, changing state, communicating with containers. Monk provides a [library of operators](operators.md) that can be used to compose many useful scripts.

Operator names can consist of letters, numbers, hyphens and underscores, as well as other unicode characters and as long as a letter is used as the first character. Many operators accept parenthesized arguments in addition to values piped to them from the left. Some will work with both forms.

For example:

```
<- get-hostname("some/runnable", "container") ":" concat concat("8080")
```

This will get a hostname of some running container in the system first, then place `":"` on the stack as an additional value, then `concat` will turn those two values into `"some_hostname:"`. Next, a version of `concat` with parenthesized argument will add `"8080"` resulting in `"some_hostname:8080"` being returned as the value of entire script.

### Functions

Since Arrow script does not have any classical conditional and looping constructs, such as `for` and `if`, we have included a set of functional operators to enable processing of collections in a succinct manner. These operators will accept a function which then gets applied to the stack in place of invocation of such operator.

For example:

```
<- [1,2,3] map(<-{ 1 add })
```

This will return `[2,3,4]` as the result of applying `1 add` to each element of the input array. Syntax for functions is `<-{ ... }`, they don't take named arguments and must assume that input values will come as if they were placed to the left of the function, i.e. these two scripts are equivalent:

```
<- 1 <-{ 1 add } callf
<- 1 1 add
```

Here, `callf` can be thought of as if it simply dropped the `<-{ ... }` by calling the function.

Functions are really just code blocks treated as values and they can be passed around just like other values.

### String interpolation

String interpolation is a convenience feature that helps to express string values succinctly. In Arrow script backticks (`` ` ``) are used to denote an interpolated string. Within those strings variables can be resolved using `${variable-name}` syntax. This form of string interpolation is inspired by JavaScript - it's simple and effective.

Consider this example:

```
<- $person " had a " $color " " $thing concat-all
```

Using the string interpolation syntax:

```
<- `${person} had a ${color} ${thing}`
```

assuming the variables:

```
person: Flipper
color: chrome
thing: speedboat
```

this will evaluate to `"Flipper had a chrome speedboat"`

!!! note

    Only variables and constants can be resolved inside `${...}`, putting anything else there will not work.

    For example, this is wrong:
    ```
    `2 + 2 is ${2 2 add}`
    ```

## Variable scope

Scripts have read access to variables defined in the `variables` section of any given runnable. The scripts cannot reach outside their `runnable` scope.
