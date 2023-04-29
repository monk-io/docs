---
title: Setting Up Your Project
---

:::note Prerequisites

In order to build a project you will need to have your credentials ready for one or more of the following cloud providers:
AWS, Azure, Digital Ocean, and/or GCP. 
:::

After successful sign up, you will see the list of your projects. This list is initially empty as there are no projects in your account yet. To create a new project click **Create project** button in the top right corner.

![](/img/docs/gui/gui43.png)

First step is to pick the name for your project and select the project type - choose the “Create a new cluster option” on the left. You want Monk to create a new cluster for your project on your own cloud infrastructure. The other option is useful for managing clusters that already exist but it’s beyond the scope of this tutorial. Read more here

![](/img/docs/gui/gui52.png)

Next step is to tell Monk about your cloud accounts. This is a multiple choice screen. You can add multiple cloud credentials to a single project because Monk is able to manage your infrastructure and workloads across multiple clouds and regions. Read more here

![](/img/docs/gui/gui9.png)

For the purpose of this tutorial we will pick just one cloud - GCP. You can choose different cloud - everything will work exactly the same regardless of your choice.  
Since you don’t have any cloud credentials stored in your account yet you will be prompted to add new credentials. Click **Add new cloud credentials**.

![](/img/docs/gui/gui57.png)

GCP credentials come in a JSON key file. You can obtain this file for your account by following this guide. Upload the file from your computer and pick a name for these credentials. Confirm with **Next**.

![](/img/docs/gui/gui41.png)

You will see your credentials added to the list. Be sure to check **Use GCP as default provider** - this tells Monk that the cluster should be initially created on this account. Confirm with **Next**.

![](/img/docs/gui/gui15.png)

Now you’re ready to continue with creating the project. You only need to add your credentials the first time, they will be securely stored and remembered for use with future projects. Confirm the selection with **Next**.

![](/img/docs/gui/gui54.png)

Project setup is complete. You are now entering the **Build** view. While the project has been created the underlying cluster still has to finish starting up on your cloud account. This process usually takes 3 to 5 minutes and doesn’t interfere with the process of building. The **Deploy** button will remain inactive until the cluster is created.

![](/img/docs/gui/gui48.png)

Dismiss the dialog box. You’ll see a blank board - this is where you build your infrastructure and services into a deployable diagram! You’ll notice ENV Staging in the top bar - you are currently in Staging environment that is automatically created for each project. Read more on environments here

![](/img/docs/gui/gui22.png)