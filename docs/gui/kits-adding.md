---
title: Adding and Fine-tuning Kits
---

Having one or two instances set up, we are ready to add some services to the board. Click ![(plus)](https://monk-io.atlassian.net/wiki/s/481958474/6452/fd6418f9b90c3778951784f56d6337a7b98af733/_/images/icons/emoticons/add.png) and select **Add kit**.

<Figure src="/img/docs/gui/gui16.png" />

This opens up the **Kit Browser**. MonkOS offers many pre-built packages to chose from. For this guide, we will host a PostgreSQL on one of our instances. Search for **PostgreSQL**, find **postgresql/db** and select it by clicking **\+ Add Kit**, this will mark it as **Selected** and show a little box with **\+ Import** button at the bottom of the screen. You can select more kits to be added at once this way. Click **\+ Import** to add selected kit(s) to the board.

<Figure src="/img/docs/gui/gui14.png" />

Once the kit is imported, you will see it as a box on the board, it can be dragged freely but let’s put it on **node-1**. When the kit is selected, **Kit Configuration** panel pops up on the right side of the screen.

<Figure src="/img/docs/gui/gui46.png" />

Each MonkOS kit exposes different configuration options - you can modify them in the **Settings** tab of the **Kit Configuration** panel under **Variables**. This way you are able to override the sane defaults included in the kit and fine-tune it to your needs. You can also change the name of the kit on the board - it is displayed on the top bar of the kit.

Apart from **Settings**, there are other tabs in the **Kit Configuration** panel: **Scale** allows you to control (auto)scaling of the kit, **Network** lists endpoints exposed by the kit, **Metrics** shows basic runtime metrics, **Logs** shows logs coming from the kit. These become active after first deployment when runtime information becomes available. Read more here.
