---
title: Connecting Kits
---

MonkOS includes a secure encrypted overlay network that is configured automatically based on declared connections between kits. Connecting kits with MonkOS is very straightforward.

Each kit on the board has **ports** represented by circles on the edges of the kit. **Inputs** are on the left side of kits, **outputs** are on the right.

To connect your service to the database you need to connect **db-host** output on your app to the **db** port on the database.

Click on the **db-host** port. An arrow will appear and follow your mouse.

![](/img/docs/gui/gui33.png)

Move your mouse cursor over to the port labelled **db** and click on the port to confirm.

![](/img/docs/gui/gui8.png)

A connection is made and arrow points from **db-host** to **db**.

![](/img/docs/gui/gui21.png)

To sever the connection double-click on the line.

The direction of the arrow follows the direction of the network connection it represents meaning that, in this case, your service will connect to the database and not the other way round. Making a mistake is impossible as outputs cannot be connected to other outputs, inputs cannot be connected to other inputs and every input can only be connected to a single output at a time.

While the process of connecting kits is very straightforward, MonkOS ensures that the connection is made in a secure manner. Even if your instances are in different regions or clouds MonkOS will create an encrypted subnet on your cluster’s overlay network. Routing on this subnet is set up in such a way that only the connections represented by arrows are possible - if we added another kit to the board it couldn’t reach the database unless expressly connected with an arrow.

In addition to the above, **db**’s hostname is assigned to the db-host variable on the app so that the app knows where to connect.

You can freely move kits around between instances and the declared connections will always hold.