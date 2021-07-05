---
title: "Define Connections"
---

Getting services up and running isn't everything - they also need to talk to each other in order to serve their purpose. Monk abstracts away the complexity of networking and service discovery by introducing simple MonkScript operators that take care of finding services for you.

---

## The consumer

Consider the following template:

```yaml title="my stuff.yaml" linenums="1"
namespace: mystuff

my-service:
    defines: runnable
    containers:
        defines: containers
        my-service:
            image: ubuntu:latest
            environment:
                - <- `DB_ADDR=${db-addr}`
                - <- `DB_PORT=${db-port}`
            bash: echo "db at ${DB_ADDR}:${DB_PORT}" ; sleep 3600
    variables:
        defines: variables
        db-addr:
            type: string
            value: localhost
        db-port:
            type: int
            value: 21721
```

Let's assume that the `ubuntu:latest` image expects environment variables `DB_ADDR` and `DB_PORT` to be set. We are setting those environment variables based on control plane variables `db-addr` and `db-port`.

Whenever we run `mystuff/my-service` it will assume that the database is at `localhost:21721`. Though, in most cases, the database will not be at localhostand running this template as it is will end in an error.
The provider

`mystuff/my-service` expects a MongoDB database. Monk provides a template for this. So we don't really need to define it here. It's on the Hub.

Run MongoDB with:

    monk run mongodb/latest

## The connector

Before running mystuff/my-service we need to tell it where to find the database that is currently running. We will do that by replacing localhost with:

```clojure
<- get-hostname("mongodb/latest", "database")
```

`get-hostname` finds and returns the hostname of the target container. It takes two arguments:

1.  The path of the target runnable and,
2.  the name of the container within that runnable.

The template should now look like this:

```yaml title="mystuff.yaml" linenums="1"
namespace: mystuff

my-service:
    defines: runnable
    containers:
        defines: containers
        my-service:
            image: ubuntu:latest
            environment:
                - <- `DB_ADDR=${db-addr}`
                - <- `DB_PORT=${db-port}`
            bash: echo "db at ${DB_ADDR}:${DB_PORT}" ; sleep 3600
    variables:
        defines: variables
        db-addr:
            type: string
            value: <- get-hostname("mongodb/latest", "database")
        db-port:
            type: int
            value: 21721
```

## The result

Run the new template with:

    monk load mystuff.yaml
    monk run mystuff/my-service

It will automatically find MongoDB that we run earlier. It will also work if you decide to run both runnables as a group:

```yaml title="mygroup.yaml" linenums="1"
my-group:
    defines: process-group
    runnable-list:
        - mongodb/latest
        - mystuff/my-service
```

    monk load mygroup.yaml
    monk run mystuff/my-group
