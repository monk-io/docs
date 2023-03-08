---
title: Multiple Environments 
---

Each Project can have multiple environments, for example, you might want to keep your Staging environment separate from your Production environment or create a temporary Dev environment to test out changes without impacting any existing environment.

Each environment is almost completely separated from the others, however, they can share secrets and variables if you chose so. Each environment has its own Monk cluster to use.

To switch between environments use the **Environment Switcher** in the middle of the navigation bar. Selecting an environment will immediately place you in context of that environment. ![(blue star)](https://monk-io.atlassian.net/wiki/s/481958474/6452/fd6418f9b90c3778951784f56d6337a7b98af733/_/images/icons/emoticons/72/2714.png) indicates which environment is currently shown.

![](/img/docs/gui/gui36.png)

To add new environment hover over **Environment Switcher** and select **Create new environment**.

![](/img/docs/gui/gui51.png)

This opens a dialog box in which you can set the following:

*   **Type** - environment type, Production/Staging/Development. This has no special function, it’s used to indicate what kind of environment it will be.
    
*   **Name** - name of the new environment,
    
*   **Expiry** - When set, will make the environment self-destruct after set period of time. Useful for ephemeral development environments,
    
*   **Schedule** - Choose either “All days” of “Weekdays”. If “Weekdays” is selected then the environment will be destroyed at midnight on Friday night and recreated at midnight on Sunday. Useful for saving costs.
    

Click **Save** to confirm.

![](/img/docs/gui/gui42.png)

New environment is created. Since each environment has its own cluster, like with a fresh project you will have to wait 2-3 minutes for the cluster to finish setting up before the first deployment of your new environment.

Environments can be edited by clciking **Environment settings** within the **Environment Switcher.**

![](/img/docs/gui/gui45.png)

Edit environment **Type**, **Name**, **Expiry** and **Schedule** of the environment using this view. You can also manage secrets and variables within the environment here.

![](/img/docs/gui/gui27.png)

Delete the environment by clicking **Delete Environment**. You will be asked to **Confirm** your action.

![](/img/docs/gui/gui49.png)

After deleting the environment context will switch to the next available environment within the project.

Deleting the last environment from the project deletes the project.