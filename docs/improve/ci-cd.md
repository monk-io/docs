---
title: "Deploy Kits from CI/CD"
---

MonkOS can run as a step in your CI process and push updated Kits to an existing MonkOS cluster. This is a powerful feature for git-driven ops and it's easy to accomplish.

---

## Prerequisites

### A cluster

In order to deploy to a cluster, you will need a running cluster. See: [Creating a cluster](../lifecycle/cluster-create-1).

Be sure to note down the Monkcode for the cluster, you can get it by running:

    monk cluster info

### A Kit

You'll need a Kit YAML file available to the CI job. It can come from the repo or even be synthesized by some CI job running before the one we're going to write in a moment.

## Credentials

The CI process will need access to your MonkOS account email and password.

Alternatively, you can [create another account](../get-started/acc-and-auth) just for your CI and [authorize it against the cluster](../lifecycle/cluster-switch-1). This can be done with:

    monk user add

and specifying the new account's email while being connected to the target cluster.

:::warning

It's not a good idea to put your credentials in plaintext anywhere. Use CircleCI contexts or another mechanism to inject secrets into your CI config.

:::

## MonkOS CI image

The container image `gcr.io/monk-releases/monk-ci:latest` provides full `monkd` and `monk` capable of running inside your CI job. The usage is exactly the same as if you were running MonkOS locally with the exception of local `run`, which will not work inside the image.

:::note

`monk-ci` image will not be deployed in your cluster and has nothing to do with it. It's merely spawned in the CI pipeline to run your deployment job.

:::

## CircleCI

Assuming you have a project that contains a Kit, all you need to do is create a CircleCI config like this one in your project's folder:

```yaml title=".circleci/config.yml" linenums="1"
version: 2.1
jobs:
    deploy:
        docker:
            - image: gcr.io/monk-releases/monk-ci:latest
        steps:
            - checkout
            - run:
                command: |
                    MONK="monk -s monkcode://<cluster-monkcode> --nofancy --nocolor"
                    $MONK login --email <your-email> --password <your-password>
                    $MONK load <your-kit-file.yaml>
                    $MONK update -t <yourtag> <your/runnable>
workflows:
    build:
        jobs:
            - deploy
```

The above example will load and update `<your/runnable>` in the target cluster whenever the `build` workflow runs. The `-t <yourtag>` is needed for the first run to schedule your workload on the correct tag in the cluster. Note that `<your/runnable>` comes from `<your-kit-file.yaml>` - put your own values there.

:::note

In case you just want to deploy a Kitthat already exists in the hub - get rid of:

    $MONK load <your-kit-file.yaml>

Then, just use something else in place of `<your/runnable>`, eg. `mongodb/mongodb`

:::

Be sure to pass your own credentials and Monkcode in place of:

-   `<your-email>`
-   `<your-password>`
-   `<cluster-monkcode>`

You can of course come up with a much more involved CI setup - the `deploy` job definition should give you a good idea on how to incorporate MonkOS into your pipeline.

## Github Actions

For the most part, we will follow the [Github Actions Hello World](https://lab.github.com/githubtraining/github-actions:-hello-world) course.

Use the MonkOS CI/CD image (`gcr.io/monk-releases/monk-ci:latest`) as base for your `Dockerfile`:

```dockerfile title="monk-deploy/Dockerfile"
FROM gcr.io/monk-releases/monk-ci:latest

ADD entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

ENTRYPOINT ["/entrypoint.sh"]
```

In your `entrypoint.sh` add the MonkOS commands to start the daemon, log in to your account, join your cluster with the Monkcode and deploy the Kit:

```bash title="monk-deploy/entrypoint.sh"
#!/bin/sh -l

MONK="monk --nofancy -s monkcode://$MONKCODE"
$MONK login --email $MONK_USER --password $MONK_PASS
$MONK load <your-kit-file.yaml>
$MONK update -t <yourtag> <your/runnable>
```

This will load and update `<your/runnable>` in the target cluster whenever the `build` workflow runs. The `-t <yourtag>` is needed for the first run to schedule your workload on the correct tag in the cluster. Note that `<your/runnable>` comes from `<your-kit-file.yaml>` - put your own values there.

Next, create the action metadata file:

```yaml title="monk-deploy/action.yml" linenums="1"
name: "MonkOS deploy"
description: "Deploy new version to cluster with Monk"
author: "author@github.com"

runs:
    using: "docker"
    image: "Dockerfile"
```

Finally, create a workflow:

```yaml title=".github/workflows/main.yml" linenums="1"
name: A workflow for my MonkOS deploy
on: push

jobs:
    deploy:
        name: MonkOS deploy action
        runs-on: ubuntu-latest
        steps:
            - uses: actions/checkout@v1
            - uses: ./monk-deploy
        env:
            MONK_USER: ${{ secrets.MONK_USER }}
            MONK_PASS: ${{ secrets.MONK_PASS }}
            MONKCODE: ${{ secrets.MONKCODE }}
```

Be sure to provide these variables to Github Actions secrets:

`MONK_USER`
: your MonkOS account username

`MONK_PASS`
: your MonkOS account password

`MONKODE`
: the Monkcode for your cluster

## GitLab CI

Here's a basic `.gitlab-ci.yml` config for deploying with Monk:

```yaml title=".gitlab-ci.yml" linenums="1"
deploy:
    stage: deploy
    only:
        - tags
    image:
        name: "gcr.io/monk-releases/monk-ci:latest"
    script: |
        set -x
        MONK="/usr/local/bin/monk -s monkcode://$MONKCODE"
        $MONK login --email $MONK_USERNAME --password $MONK_PASSWORD
        $MONK load <your-kit-file.yaml>
        $MONK update -t <yourtag> <your/runnable>
```

This will load and update `<your/runnable>` in the target cluster whenever the `build` workflow runs. The `-t <yourtag>` is needed for the first run to schedule your workload on the correct tag in the cluster. Note that `<your/runnable>` comes from `<your-kit-file.yaml>` - put your own values there.

It triggers whenever you push a tag to your repo.

The `deploy` job uses MonkOS to deploy to your cluster. In this example we load the `test.yaml` Kitand update the runnable `test/test`.

Be sure to provide these variables to the Gitlab CI:

-   `MONK_USERNAME`: your MonkOS account username
-   `MONK_PASSWORD`: your MonkOS account password
-   `MONKCODE`: the Monkcode for your cluster

## Bitbucket

Here's a basic `bitbucket-pipelines.yml` config for deploying with Monk:

```yaml title="bitbucket-pipelines.yml" linenums="1"
image: gcr.io/monk-releases/monk-ci:latest

pipelines:
    default:
    - parallel:
        - step:
            name: 'monk deploy'
            script:
            - export MONK="monk -s monkcode://$MONKCODE --nofancy --nocolor"
            - $MONK login --email $MONK_USER --password $MONK_PASSWORD
            - $MONK load <your-kit-file.yaml>
            - $MONK update -t $MONK_TAG <your/runnable>
```

This will load and update `<your/runnable>` in the target cluster whenever a new commit is pushed to the repo. Note `-t $MONK_TAG` is required on first run to put your workload on the correct tag in the cluster. Remember to fill in your own values for `<your-kit-file.yaml>` and `<your/runnable>`.

Be sure to provide these variables in the Bitbucket pipeline settings:

-   `MONK_USER`: your MonkOS account username
-   `MONK_PASSWORD`: your monk account password
-   `MONKCODE`: the Monkcode for your cluster
-   `MONK_TAG`: tag on which to deploy in your cluster

## Secrets

Throughout this tutorial we've had to deal with secrets, even if just for our MonkOS account credentials. Let's now see how you can boost your MonkOS setup security and work with [encrypted Kits](./passing-secrets.md) 🤫
