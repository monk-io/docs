---
sidebar_position: 4
title: "Switch Clusters"
---

You can have multiple Monk clusters at any given time but you can manage just one at a time. When you're working with a cluster, you're essentially joining the cluster as a member from youor local machine.

Monk introduces `exit` and `switch` commands which make it possible to hop between clusters. You can also join somebody else's cluster if they add you as an admin and as long as you have their _Monkcode_

## Monkcodes

_Monkcodes_ are encrypted and compressed connection strings for Monk clusters. Each Monk cluster has its own Monkcode, find it with:

    monk cluster info

Monkcode should look more or less like this:

    H4sIAAAAAABA/6TMva7CIBQA4Be88xwOIsVRu5FoQrSDI9Kk/MTkhLWWhzc
    +grp90+eevvV4sjmfb5OZtRvGHOOoFmulrvLCvOzNdXec2uOu3TZ39qWzX1
    NJa/XFb8iS/0Oqoaf2Nn42/mFihSQHEAAAsAVGpYSg76+DBNIGCEj89r0CA
    AD//8oRarscAQAA

Monkcodes can be passed around as "invitations" to a cluster, or stored securely as credentials for a number of your own clusters.

:::note info

It's useful to obtain a fresh Monkcode before using it because they might change over time as new nodes are added and removed.

:::

:::caution warning

Monkcodes are sensitive information, protect them with great care. Even though it's impossible to join a cluster without being added as an admin, it's still best to keep Monkcodes away from prying eyes.

:::

## Admin access

By default, only the cluster creator is able to connect to the cluster of their own making. In order to permit another user to join the cluster, use:

    monk user add

You'll need the email they signed up with for their Monk account. They'll need to have a Monk account, obviously.

### User management

To check who has access to your current cluster, use:

    monk user list

To remove a member from the cluster, use:

    monk user remove

## Exiting a cluster

To exit a cluster and return back to local only mode (the same state as before creating/joining a cluster), use:

    monk cluster exit

This command will display the cluster's Monkcode so that you can come back at any time using it.

## Switching a cluster

In order to switch to another cluster from either local mode or current cluster use:

    monk cluster switch

This command will prompt you for a Monkcode of the target cluster. If this is your cluster you should be connected immediately. If this is somebody's else cluster - you may need to connect them so that they add your email with `monk user add`.

If you are currently in a cluster, Monk will exit that cluster before joining the target one.
