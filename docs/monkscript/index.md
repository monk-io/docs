---
title: Overview
slug: /monkscript
---

# MonkScript

MonkScript is Monk's composable definition language with runtime scripting abilities. Apart from the CLI, MonkScript is the primary way of programming Monk to run and manage workloads.

:::note

Start [Working with MonkScript &#8594;
](monkscript/working.md)

:::

MonkScript sources can live in YAML files. These YAML files are called _manifests_ and the statements within, are called _templates_. A template can be either a _runnable_ (a single _component_) or a _group_ (a composition of other templates).

A notable difference between MonkScript and other YAML based Infrastructure-As-Code languages is that there is no need for macros or pre-processors. MonkScript implements a set of inheritance and composition rules that can express even the most complicated systems in a straightforward manner.

:::note

Read more about [MonkScript YAML &#8594;
](monkscript/yaml)

:::

In addition to the built-in composition capabilities, MonkScript allows the operator to define almost all values in terms of variables and one-line scripts called _Arrow scripts_. These small scripts start with `<-` (hence the name) and are computed at runtime. This allows Monk's control plane to track and crunch any signal coming from a running container, or to perform user-defined actions at any time.

Arrow scripts are immensely powerful - they are used to implement service discovery and health check mechanisms among other core functions in Monk.

:::note

Read more about [MonkScript Arrow scripting &#8594;
](monkscript/scripting)

:::

Last but not least, MonkScript manifests are meant to be fully portable between Monk clusters - meaning that any Monk cluster can interpret and run all existing templates. Additionally, all public templates available in the Monk Hub are readily available to be run and composed on any Monk cluster. This makes MonkScript globally share-able and easy to apply.
