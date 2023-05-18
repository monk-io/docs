---
title: Adding your cloud providers
---

import Figure from "@site/src/components/figure";

In [Setting Up Your Project](project-setup), you were prompted to add credentials
to your first project. You can also add, and manage, your credentials in your
Account Settings.

## How to add a new token

To reach your account settings, you can click on your avatar in the upper right
of your screen and select **Account Settings**.

<Figure src="/img/docs/gui/gui60.png" caption="Account navigation drop-down"/>

You can also go directly to: [app.monk.io/settings/account](https://app.monk.io/settings/account).

Your account settings page will look similar to the below.

<Figure src="/img/docs/gui/gui61.png" caption="Account settings page" />

In this example we haven't yet added a cloud provider. Let's add and modify a token for
Digital Ocean. First, we click on **+ Add** in th Cloud Credentials section. The same
credentials window appears:

<Figure src="/img/docs/gui/gui9.png" caption="Add cloud provider selector" />

Select your provider, in our case Digital Ocean. The next window prompts us to add a
our new cloud credentials. Click **Add new cloud credentials**.

<Figure src="/img/docs/gui/gui57.png" caption="Choose credentials menu" />

Since Digital Ocean uses API tokens, you are given the ability to name and add your
token. Once you are done, click **Next**.

<Figure src="/img/docs/gui/gui62.png" caption="Add token value" />

Once complete, you will be back on your Account Settings page with the new token
visible.

<Figure src="/img/docs/gui/gui63.png" caption="Account settings page with new token" />

## How to modify and delete tokens

You can rename your existing tokens at any time. To do so, click the meatball
menu and then click the pencil.

<Figure src="/img/docs/gui/gui64.png" caption="Token menu with pencil and bin" />

Let's change the name of the token from `DigitalOcean Token` to `Digital Ocean Token`. In the
prompt that appears, we can do this by just altering the name in the text area:

<Figure src="/img/docs/gui/gui65.png" caption="Change name field" />

And then click **Save**. Our token now has the updated name `Digital Ocean Token`:

<Figure src="/img/docs/gui/gui66.png" caption="Token with new name displayed" />

If the value of your token itself changes, rather than just updating the name, you will
need to add the new credentials separately. If the pre-existing token(s) are now outdated
you can delete them. To delete them, instead of clicking the pencil above you click the
trash can:

<Figure src="/img/docs/gui/gui64.png" caption="Token menu with pencil and bin" />

When you click the trash can to delete, you will have a prompt to verify that you are
looking to delete that specific token. To confirm, click **Remove**.

<Figure src="/img/docs/gui/gui67.png" caption="Token delete prompt" />