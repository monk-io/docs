---
title: Publisher's Guide
---

# Publisher's Guide

This guide explains the publishing process from the technical standpoint. We are going into the nitty-gritty of how to publish and maintain a Monk template on MonkHub.

## Publishing to MonkHub

MonkHub hosts its contents publicly so that it stays available to all Monk instances in existence. Contents of the Hub are synced across all Monk instances every couple of minutes.
Once something is published to MonkHub it immediately becomes public and available to all Monk users.

MonkHub periodically pulls a set of public Git repos from different publishers and aggregates their contents. This means that having your template published on GitHub is basically enough to have it published on MonkHub.

In order to publish your software on MonkHub, you'll need to follow several steps:

1. Prepare your template - make sure it loads and runs without errors,
2. Add metadata - to make the template look good on the Hub,
3. Publish your template in a Git repo - so that its source is avaliable and MonkHub can pull it,
4. [Contact us](support.md) to add your repo to MonkHub.
5. Your template will be published after a review from us.
6. Your template will be updated automatically whenever the default branch in your repo is updated.

## Preparing Your Template

Even though any working template can be published to MonkHub, there are several steps that improve end-user experience and maintainability. We have detailed best practices below.

### Naming

Each Monk template lives in a `namespace` that identifies a company or a product to which the template belongs logically. It's good to decide on the name of your namespace and stick to it across all your templates.

For example, if you're _ACME Corp._ and your primary product is called _foobar_, and you plan on publishing more products as templates, you might want to define your namespace as:

```yaml title="acme.yaml"
namespace: acme

foobar: ...
```

This will result in Monk users see and refer to _foobar_ as `acme/foobar`. Add a new product called _dynamite_ and they'll know it as `acme/dynamite`.

Alternatively, if you only have one project called _gizmotron_ and identify by that name, you might want to define your namespace as follows:

```yaml title="gizmotron.yaml"
namespace: gizmotron

latest: ...
```

This, in contrast, will result in Monk users seeing names like `gizmotron/latest`, `gizmotron/v1.2.3`, `gizmotron/companion-database` etc.

You can choose either approach but the most important thing is to stick to your choice as changing namespaces will confuse the end-user.

### YAML Layout

#### Common Section

There are no technical limitations on how your YAML should look like as long as it is valid MonkScript. On the other hand, in our experience, defining common base for your runnables works well and helps to avoid verbose definitions.

See the following example:

```yaml title="gizmotron.yaml"
namespace: gizmotron

common:
    metadata:
        defines: metadata
        ...
    containers:
        defines: containers
        app:
            image: docker.io/gizmotron
            ...
    ...

latest:
    defines: runnable
    inherits: gizmotron/common
    version: latest
    containers:
        app:
            image-tag: latest

```

`gizmotron/common` defines the basic structure of the runnable which might be bulky but it is not a runnable itself, i.e. it doesn't have `defines: runnable`. This means that there will not be a way to run such incomplete definition with `monk run gizmotron/common` and it will not be listed in MonkHub.

On the other hand, `gizmotron/latest` inherits common and overrides version, container image tag and other fields applicable to a concrete `gizmotron` variant. This definition has `defines: runnable` added so it will be listed in MonkHub as `gizmotron/latest`.

#### Group Variables

If your template features groups it is a good practice to expose variables in the group so that users can tune the underlying runnables without having to touch them directly.

Consider the following example:

```yaml title="gizmotron.yaml"
namespace: gizmotron

# this defines foo component that expects admin-username and admin-password to be defined
foo:
    defines: runnable
    containers:
        defines: containers
        app:
            ...
            environment:
                - <- `ADMIN_NAME=${admin-username}`
                - <- `ADMIN_PASS=${admin-password}`

# this defines foo complete with accompanying services meant for end-user consumption
complete-foo-setup:
    defines: process-group
    runnable-list:
        - gizmotron/foo
        - postgres/latest
        - redis/latest
    variables:
        defines: variables
        admin-username: change me
        admin-password: change me, for real
```

By moving `admin-username` and `admin-password` to the `group` here, we have enabled the user to simply override the variables on the group and hid the details of `foo` itself.

The user will now run the complete `gizmotron/complete-foo-setup` with admin credentials of their choosing by simply doing:

```yaml title="user.yaml"
namespace: user

my-foo:
    inherits: gizmotron/complete-foo-setup
    variables:
        admin-username: king-of-the-hill
        admin-password: super secret password 123
```

### Template Metadata

When making a template for internal use there's usually no need for adding metadata. When publishing your templates to MonkHub it's good practice to add and keep metadata on all your runnables and groups. This can be easily achieved by just putting a single metadata definition in a `common` section described above.

Consider the following example:

```yaml title="gizmotron.yaml"
namespace: gizmotron

common:
  ...
  metadata:
    defines: metadata
    name: Gizmotron
    description: Open-source gizmotronic gizmo making gizmo that puts things on 🔥
    tags: comma, separated, list of tags
    website: gizmotron.io
    source: https://github.com/gizmotron-io/gizmotron
    publisher: Gizmotron Inc.
    icon: https://url.to/an/icon/for/gizmotron.png
    email: hello@gizmotron.io
    license: MIT
```

Above example shows the most useful metadata fields that you should put on all your runnables and groups. MonkHub will display template metadata according to this definition in its web UI. Those fields are also used in the CLI when listing and inspecting available templates. Name, description and tags are used for search in MonkHub.

All metadata fields are optional and you can add any arbitrary field here, i.e.

```yaml
metadata:
    defines: metadata
    twitter: "@gizmotron"
    proprietary-gizmo-id: 42
```

### Container Images

Monk is able to pull container images from any public or private registry compatible with Docker. That being said, if a template is meant for public consumption all container images referenced by this template should also be publicly available to prevent end-users from having to supply container registry credentials upon running such template.

It is also a good practice to refer to container images by including the registry in image name i.e.:

```yaml
    image: gizmotron/foo           # bad
    image: docker.io/gizmotron/foo # good
```

## Preparing Your Repo

Now that you have a good template, the next step is to prepare a publicly available Git repo. You can use GitHub, GitLab or any other Git hosting of your choosing that allows for public repos.

Name of the repo is arbitrary and has no effect on MonkHub listing but we suggest using `monk-*` format i.e. `github.com/gizmotron/monk-gizmotron`, `github.com/acme/monk-dynamite` and keeping it in line with the chosen namespace.

If you don't want to host another repo you can use the main repo of your project and just put the required files in its top directory.

:::note

See an example published repo here: [https://github.com/monk-io/monk-chatwoot](https://github.com/monk-io/monk-chatwoot).

This repo showcases a number of good practices described in this document so be sure to check it out for inspiration :)

:::

### File layout

The repo should contain at least three files in its top directory:

-   `README.md` - should contain an informative description of the template and a short guide on how to deploy it with Monk,
-   `template.yaml` - this is the template itself, can be named after your namespace, eg. `gizmotron.yaml`
-   `MANIFEST` - this file lists all template files in load order, see below.

Of course, you can host multiple template files and build arbitrary directory structures as long as you adjust the `MANIFEST` accordingly.

Apart from the files above, you might want to include a `LICENSE` file containing the license under which you wish to distribute your template.

### Monk MANIFEST

Monk MANIFESTs are simple text files that are used by Monk to identify and load template files in correct order.

For example, if you just have one YAML file (`gizmotron.yaml`) in your repo `monk-gizmotron`, your `MANIFEST` should look like this:

```text title="MANIFEST"
REPO monk-gizmotron
LOAD gizmotron.yaml
```

If you have more than one file - list them in the order they should be loaded by Monk:

```text title="MANIFEST"
REPO monk-gizmotron
LOAD dependencies.yaml gizmotron.yaml
```

If you wish to store your template files in a sub-directory, you still need to place a `MANIFEST` in the repo's top level directory and point it to your sub-directory.

Consider the following directory structure:

```
repo/
    README.md
    LICENSE.md
    MANIFEST                    <-- top level MANIFEST
    templates/
        MANIFEST                <-- nested MANIFEST
        dependencies.yaml       <-- first template
        gizmotron.yaml          <-- second template
    resources/
        ...
    ...
```

The **top level `MANIFEST`** should point to `templates` and look like this:

```text title="MANIFEST"
REPO monk-gizmotron
DIRS templates
```

The `templates/MANIFEST` should then list the templates in the load order:

```text title="templates/MANIFEST"
REPO monk-gizmotron
LOAD dependencies.yaml gizmotron.yaml
```

## Publishing Your Repo to MonkHub

The process is fully automated and requires no work on your side. Once you're ready to publish your repo to MonkHub just [drop us a line](support.md) and we'll take care of the rest.

:::caution

In order to ensure high quality of templates all contributions to MonkHub are considered on case-by-case basis and subject to review at any point.

:::

## Maintaining Your Template

Once the initial setup has been completed and the repo is published to MonkHub the only thing left is to update the hosted template whenever you release a new version of your software or want to change the template itself.

:::caution

MonkHub will pull your changes whenever the default branch of your Git repo changes so anything committed or merged to `main` goes live within 10 minutes. For this reason we strongly advise to keep the write access limited to a small group of trusted people. Outside contributions to the template should be screened for potential bugs and security issues before merging them to the main branch.

:::

### Versioning Your Software

Monk templates are immutable, meaning that any update to the existing template actually becomes another template under the hood. Users running a certain version of your template will keep running it until they decide to update their copy with `monk update` command. Even though this is the case, versioning your templates makes it easier for the end user to pick a specific version of it as a dependency and enables easy downgrades.

MonkScript supports inheritance - it can be used to define multiple versions and variants of a template without much repetition. Each new version of a `runnable` or `group` can refer to previous version using the `inherits` directive just override version specific fields incrementally. This pattern works well with the [Common section pattern](#common-section).

Consider the following example:

```yaml title="gizmotron.yaml"
namespace: gizmotron

common:
    containers:
        defines: containers
        app:
            image: docker.io/gizmotron
    ...

v1.0.0:
    defines: runnable
    inherits: ./common
    version: 1.0.0
    containers:
        app:
            image-tag: v1.0.0

latest:
    defines: runnable
    inherits: ./v1.0.0
```

Here we have a `v1.0.0` definition, which inherits `gizmotron/common` and overrides the `image-tag` of the container. This `gizmotron/v1.0.0` will start a container `app` from image `docker.io/gizmotron:v1.0.0`. The `version` field is used to display human readable version in MonkHub and CLI listings. Additionally, `gizmotron/latest` is defined to be equivalent to `gizmotron/v1.0.0`.

Now let's suppose we want to add another version of Gizmotron to this template:

```yaml title="gizmotron.yaml"
namespace: gizmotron

common:
    containers:
        defines: containers
        app:
            image: docker.io/gizmotron
    ...

v1.0.0:
    defines: runnable
    inherits: ./common
    version: 1.0.0
    containers:
        app:
            image-tag: v1.0.0

v2.0.0:
    defines: runnable
    inherits: ./v1.0.0
    version: 2.0.0
    containers:
        app:
            image-tag: v2.0.0

latest:
    defines: runnable
    inherits: ./v2.0.0
```

Assuming that only the underlying container image has changed from `v1.0.0` to `v2.0.0` that's all we have to do. `gizmotron/latest` now points to `gizmotron/v2.0.0` but `gizmotron/v1.0.0` is still available and unchanged. You can make other changes and overrides in each version and decide if you want to inherit the previous version or just start from `common` depending on what you want to achieve. The same mechanism applies if you want to add different variants or _flavors_ of any particular version.

#### Multiple Versions in Separate Files

Technique described above also works if you want to keep your versions in separate YAML files as long as you keep all definitions under the same namespace and you remember to update your [`MANIFEST` file](#monk-manifest).

Splitting separate versions into separate files might help to keep the definitions clean and works well in scenarios where you want to generate templates programmatically as a part of your CI process for example.

Consider the following filesystem layout:

```
repo/
    MANIFEST
    common.yaml
    v1.0.0.yaml
    v2.0.0.yaml
    latest.yaml
```

Contents of these files are just obtained by splitting the previous example:

```yaml title="common.yaml"
namespace: gizmotron

common:
    containers:
        defines: containers
        app:
            image: docker.io/gizmotron
    ...
```

```yaml title="v1.0.0.yaml"
namespace: gizmotron

v1.0.0:
    defines: runnable
    inherits: ./common
    version: 1.0.0
    containers:
        app:
            image-tag: v1.0.0
```

```yaml title="v2.0.0.yaml"
namespace: gizmotron

v2.0.0:
    defines: runnable
    inherits: ./v1.0.0
    version: 2.0.0
    containers:
        app:
            image-tag: v2.0.0
```

```yaml title="latest.yaml"
namespace: gizmotron

latest:
    defines: runnable
    inherits: ./v2.0.0
```

The `MANIFEST` file should then look as follows:

```text title="templates/MANIFEST"
REPO monk-gizmotron
LOAD common.yaml v1.0.0.yaml v2.0.0.yaml latest.yaml
```

In case you want to generate the version files programmatically, you just need to produce a new `vx.y.z.yaml` file using string templating, then update `latest.yaml` to point to the new version and finally append the name of your new file to the `LOAD` list in the `MANIFEST`.
