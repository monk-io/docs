---
title: Adding Secrets
---

One of the crucial requirements of any deployment is storing secrets in a secure way. Monk offers a built-in secret storage that is backed by the Cloud KMS on your cloud account. Monk ensures that all your secrets stored within your infrastructure are always encrypted at rest with frequent key rotation.

Secrets can be shared between multiple kits within the project’s environment.

To change database password into a secret: Select the **db** kit and find **postgres\_password** in the **Settings tab** in the **Kit configuration** panel. Click blue **<-x** button next to the text input field containing the password.

![](/img/docs/gui/gui55.png)

A dialog box opens up. As there are no secrets yet the list will be empty - click **Create Secret** to add new secret

![](/img/docs/gui/gui23.png)

**Add New Secret** dialog will pop up prompting you for secret **Name** and **Value**. If your secret is stored in a file you can use the blue button next to the **Value** field to upload it from your computer instead of pasting it in.

If the project contains more environments you can also choose in which of them the secret will be visible using the **Environment** dropdown.

![](/img/docs/gui/gui28.png)

Pick a name for the secret and fill out the fields. Secret values are initially visible at the time of creation but will be never shown again after saving. Confirm by clicking **Save**.

![](/img/docs/gui/gui39.png)

The secret was added to the environment, select it and confirm with **Apply**.

![](/img/docs/gui/gui59.png)

The **postgres\_password** field will now contain a padlock icon with the name of the secret whose value is assigned to this field. Confirm by clicking **Save changes** button.

At this point the password is not directly editable and must be changed via the secret in **Project settings**. To clear the secret click on **X** on the right side of the field.

![](/img/docs/gui/gui47.png)

Repeat applying the secret to your own service by selecting the database password field, clicking **<-x** next to it and selecting the **DB PASSWORD** secret.

![](/img/docs/gui/gui35.png)

Monk also offers **Variables**, which work in exactly the same way as secrets but are not encrypted and can be reviewed and edited at any time. If you do not care if the value is stored securely it is better to use a Variable instead of a Secret - the usage is the same as described above.

Secrets and Variables can be also added and removed from the **Settings** tab.

![](/img/docs/gui/gui56.png)