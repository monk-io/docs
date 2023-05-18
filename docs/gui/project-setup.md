---
title: Setting Up Your Project
---

:::note Prerequisites

In order to build a project you will need to have your credentials ready for one or more of the following cloud providers:
AWS, Digital Ocean, and/or GCP. 
:::

After successful sign up, you will see the list of your projects. This list is initially empty as there are no projects in your account yet. To create a new project click **Create project** button in the top right corner.

![](/img/docs/gui/gui43.png)

To create a completely new project, you will need to name your project and then select "Create a new cluster". (You can also connect to existing Monk clusters, but that is outside the scope of this tutorial.)

![](/img/docs/gui/gui52.png)

Now you will need to optionally choose a cloud provider to deploy to. Alternatively, you can skip this step for now (using "Skip"), and add your desired cloud provider later. The only impact this will have is that you will need to have connected to a cloud provider before you can deploy. When you are ready to deploy, make sure you add as many cloud providers as you intend to deploy to as MonkOS supports infrastructure and workloads across cloud providers and regions. (Read more on our [Adding your cloud providers](add-cloud-providers) article, which is the next page in this section.)

![](/img/docs/gui/gui9.png)

For the purpose of this tutorial we will pick just one cloud - GCP. You can choose different cloud - everything will work exactly the same regardless of your choice.  

Since you don’t have any cloud credentials stored in your account yet you will be prompted to add new credentials. Click **Add new cloud credentials**.

![](/img/docs/gui/gui57.png)

GCP credentials come in a JSON key file. You can obtain this file for your account by following this guide. Upload the file from your computer and pick a name for these credentials. Confirm with **Next**.

![](/img/docs/gui/gui41.png)

You will see your credentials added to the list. Be sure to check **Use GCP as default provider** - this tells MonkOS that the cluster should be initially created on this account. Confirm with **Next**.

![](/img/docs/gui/gui15.png)

Now you’re ready to continue with creating the project. You only need to add your credentials the first time, they will be securely stored and remembered for use with future projects. Confirm the selection with **Next**.

<!-- FIXME: Screenshot shows Azure, do we need to change that based on the change requested for the pre-requisite? -->
![](/img/docs/gui/gui54.png)

Project setup is complete. You are now entering the **Build** view. While the project has been created the underlying cluster still has to finish starting up on your cloud account. This process usually takes 3 to 5 minutes and doesn’t interfere with the process of building. The **Deploy** button will remain inactive until the cluster is created.

![](/img/docs/gui/gui48.png)

Dismiss the dialog box. You’ll see a blank board - this is where you build your infrastructure and services into a deployable diagram! You’ll notice ENV Staging in the top bar - you are currently in Staging environment that is automatically created for each project. (Read more on environments on our [Multiple environments](environments) article at the end of this section.)

![](/img/docs/gui/gui22.png)
