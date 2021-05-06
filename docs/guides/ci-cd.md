Monk can run as a step in your CI process and push updated templates to an existing Monk cluster. This is a powerful feature for git-driven ops and it's easy to accomplish.

---

## Prerequisites

### A cluster

In order to deploy to a cluster, you will need a running cluster. See: [Creating a cluster](creating-a-cluster.md).

Be sure to note down the Monkcode for the cluster, you can get it by running:

    monk cluster info

### A template

You'll need a template YAML file available to the CI job. It can come from the repo or even be synthesized by some CI job running before the one we're going to write in a moment.

## Credentials

The CI process will need access to your Monk account email and password.

Alternatively, you can [create another account](../acc-and-auth.md) just for your CI and [authorize it against the cluster](creating-a-cluster.md). This can be done with:

    monk user add

and specifying the new account's email while being connected to the target cluster.

!!! warning

    It's not a good idea to put your credentials in plaintext anywhere. Use CircleCI contexts or another mechanism to inject secrets into your CI config.

## Monk CI image

The container image `gcr.io/monk-releases/monk-ci:latest` provides full `monkd` and `monk` capable of running inside your CI job. The usage is exactly the same as if you were running Monk locally with the exception of local `run`, which will not work inside the image.

!!! note

    `monk-ci` image will not be deployed in your cluster and has nothing to do with it. It's merely spawned in the CI pipeline to run your deployment job.

## CircleCI

Assuming you have a project that contains a template, all you need to do is create a CircleCI config like this one in your project's folder:

=== ".circleci/config.yml"

    ```yaml linenums="1"
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
                        $MONK load <your-template-file.yaml>
                        $MONK update -t <yourtag> <your/runnable>
    workflows:
        build:
            jobs:
                - deploy
    ```

The above example will load and update `<your/runnable>` in the target cluster whenever the `build` workflow runs. The `-t <yourtag>` is needed for the first run to schedule your workload on the correct tag in the cluster. Note that `<your/runnable>` comes from `<your-template-file.yaml>` - put your own values there.

!!! note

    In case you just want to deploy a template that already exists in the hub - get rid of:

        $MONK load <your-template-file.yaml>

    Then, just use something else in place of `<your/runnable>`, eg. `mongodb/latest`

Be sure to pass your own credentials and Monkcode in place of:

-   `<your-email>`
-   `<your-password>`
-   `<cluster-monkcode>`

You can of course come up with a much more involved CI setup - the `deploy` job definition should give you a good idea on how to incorporate Monk into your pipeline.

## Github Actions

For the most part, we will follow the [Github Actions Hello World](https://lab.github.com/githubtraining/github-actions:-hello-world) course.

Use the Monk CI/CD image (`gcr.io/monk-releases/monk-ci:latest`) as base for your `Dockerfile`:

=== "monk-deploy/Dockerfile"

    ```dockerfile
    FROM gcr.io/monk-releases/monk-ci:latest

    ADD entrypoint.sh /entrypoint.sh
    RUN chmod +x /entrypoint.sh

    ENTRYPOINT ["/entrypoint.sh"]
    ```

In your `entrypoint.sh` add the Monk commands to start the daemon, log in to your account, join your cluster with the Monkcode and deploy the template:

=== "monk-deploy/entrypoint.sh"

    ```bash
    #!/bin/sh -l

    MONK="monk --nofancy -s monkcode://$MONKCODE"
    $MONK login --email $MONK_USER --password $MONK_PASS
    $MONK load <your-template-file.yaml>
    $MONK update -t <yourtag> <your/runnable>
    ```

This will load and update `<your/runnable>` in the target cluster whenever the `build` workflow runs. The `-t <yourtag>` is needed for the first run to schedule your workload on the correct tag in the cluster. Note that `<your/runnable>` comes from `<your-template-file.yaml>` - put your own values there.

Next, create the action metadata file:

=== "monk-deploy/action.yml"

    ```yaml linenums="1"
    name: "Monk deploy"
    description: "Deploy new version to cluster with Monk"
    author: "author@github.com"

    runs:
        using: "docker"
        image: "Dockerfile"
    ```

Finally, create a workflow:

=== ".github/workflows/main.yml"

    ```yaml linenums="1"
    name: A workflow for my Monk deploy
    on: push

    jobs:
        deploy:
            name: Monk deploy action
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
: your Monk account username

`MONK_PASS`
: your Monk account password

`MONKODE`
: the Monkcode for your cluster

## GitLab CI

Here's a basic `.gitlab-ci.yml` config for deploying with Monk:

=== ".gitlab-ci.yml"

    ```yaml linenums="1"
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
          $MONK load <your-template-file.yaml>
          $MONK update -t <yourtag> <your/runnable>
    ```

This will load and update `<your/runnable>` in the target cluster whenever the `build` workflow runs. The `-t <yourtag>` is needed for the first run to schedule your workload on the correct tag in the cluster. Note that `<your/runnable>` comes from `<your-template-file.yaml>` - put your own values there.

It triggers whenever you push a tag to your repo.

The `deploy` job uses Monk to deploy to your cluster. In this example we load the `test.yaml` template and update the runnable `test/test`.

Be sure to provide these variables to the Gitlab CI:

-   `MONK_USERNAME`: your Monk account username
-   `MONK_PASSWORD`: your Monk account password
-   `MONKCODE`: the Monkcode for your cluster

## Secrets

Throughout this tutorial we've had to deal with secrets, even if just for our Monk account credentials. Let's now see how you can boost your Monk setup security and work with [encrypted templates](./passing-secrets.md) 🤫
