---
title: Inspecting Kits
---

import Figure from "@site/src/components/figure";

After first deployment when the project is running it is possible to inspect the running kits by simply clicking on them. You can access basic CPU, memory and disk usage stats of a kit, check its network endpoints and read the logs from the **Kit Configuration** panel at any time. 
This is meant for a quick preview - more options are available in the **Monitor** tab of your environment. See Monitoring your project.


## Viewing endpoints of a kit

To view kit’s network endpoints select the kit by clicking on it, **Kit Configuration** panel will appear. Select **Network** tab on the **Kit Configuration** panel. You can copy the endpoint address or visit it new tab by clicking “Preview” next to the endpoint.

<Figure src="/img/docs/gui/gui12.png" />

## Viewing kit metrics

To view metrics of a kit select the kit by clicking on it, **Kit Configuration** panel will appear. Select **Metrics** tab on the **Kit Configuration** panel. Metrics are updated in real-time and show current values as well as historical values on a mini graph.

<Figure src="/img/docs/gui/gui20.png" />

## Viewing kit logs

To view kit’s logs select the kit by clicking on it, **Kit Configuration** panel will appear. Select **Logs** tab on the **Kit Configuration** panel. Logs are streamed in real-time.

<Figure src="/img/docs/gui/gui24.png" />

## Helpful tips

* Click-to-inspect requires that the project is running. If the project is not running, the tabs mentioned above will be inactive, because there is no data to fill them. 

* The first deploy may take up to 10 minutes as the cloud creates underlying resources. This is a limitation of the cloud providers and outside Monk's control and applies to all BYOI products. For real-time updates, check the log window on the right side of your screen

* Some kits do not have any network connections exposed by default. The globe icon next to ports can be used to open port that show up in the network tabe
