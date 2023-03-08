---
title: Adding Your Own Services
---

A PostgreSQL database is not that useful by itself. With Monk you can add your services straight from GitHub - Monk converts your app into a private Kit and takes care of building it for you using Buildpacks. If you already have an app running on Heroku, Railway or other PaaS providers you can spin it up with Monk by just adding your existing repo.

Click ![(plus)](https://monk-io.atlassian.net/wiki/s/481958474/6452/fd6418f9b90c3778951784f56d6337a7b98af733/_/images/icons/emoticons/add.png) and select **Add kit** just like before.

![](/img/docs/gui/gui16.png)

Click **Import repositories** on the top-right.

![](/img/docs/gui/gui6.png)

A dialog will appear prompting you to select a repo. Since there are no existing connections you need to add one. Click **Connect** next to **GitHub**.

![](/img/docs/gui/gui30.png)

You will be redirected to GitHub to authorize Monk app. Once you complete this process you will see the connection on the list. Click **Import** on your new GitHub connection.

![](/img/docs/gui/gui4.png)

In the next step you are prompted to choose from which GitHub organization you want to import. Pick one and confirm with **Next.**

![](/img/docs/gui/gui44.png)

Now you can select one or more repositories from the organization using a multiple choice list. Select your repository and confirm with **Next**.

![](/img/docs/gui/gui5.png)

Now **Kit Browser** will display all your private kits under **All Kits** in **PRIVATE** section. They will also appear in searches when using the search bar. Select your app in the same way as any other kit and click **\+ Import** to place it on the board.

![](/img/docs/gui/gui18.png)

Monk will rebuild your services and deploy changes whenever you push to master branch in your repos that were imported.

Place your app inside the empty instance so that it doesn’t clash with the **db**. With two kits on the board you are ready to connect them.

![](/img/docs/gui/gui40.png)