---
title: Scaling and Auto-scaling 
---


MonkOS enables easy manual and automatic scaling of any kit.

To set kit’s scale select it and go to **Scale** tab in **Kit Configuration** panel.

<Figure src="/img/docs/gui/gui1.png" />

You can manually set the number of replicas at any point by changing the number in the **Replicas** field and clicking **Save changes** to confirm. Current replica count is indicated on the kit’s top bar.

<Figure src="/img/docs/gui/gui26.png" />

To set up Auto-scaling, enable it by flipping the switch next to **Auto Scale**. This reveals more options.

<Figure src="/img/docs/gui/gui58.png" />

Auto-scaling is always constrained by a range between minimum and maximum replica counts. Set the range using two inputs in the **Replicas** section - left for minimum replica count, right for maximum replica count.

The Basic Metrics section allows to set resource utilization targets, it is possible to set multiple targets at once, one per metric: **CPU**, **RAM** and **Disk**. When a target is set monk will replicate all containers belonging to the scaled kit dynamically by observing kit’s usage of selected resource across the cluster.

The number of replicas is computed using the following formula per metric:

```
desiredReplicas = ceil(currentReplicas * (currentMetricValue / desiredMetricValue))
```

If multiple targets are enabled at once the autoscaler will average out the `desiredReplicas` calculated for each metric. Number of replicas will not fall below or above limits set in **Replicas** section.

Replica placement is fully automated and will place replicated containers on separate nodes when possible, this spreads the load evenly.

All network connections to and from replicas are handled transparently spreading the traffic evenly across replicas.

For example: Set **max replicas** to **3** and flip the switch next to **CPU usage**, set the slider to **50%**. Confirm by clicking **Save changes**.

<Figure src="/img/docs/gui/gui13.png" />

MonkOS autoscaler features target-oriented and algorithmic scaling modes, however only the target-oriented method is available in the GUI at this time. For more autoscaling options see the Monkscript documentation.

To disable auto-scaling just flip the switch nest to **Auto Scale** and confirm by clicking **Save changes**.
