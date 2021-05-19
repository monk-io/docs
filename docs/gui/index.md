# Monk GUI

## Launching the GUI

You can launch your self-hosted Monk GUI with a simple command.

    $ monk gui

The GUI depends on `monkd`, so please ensure it's running on your machine.

Once ready you should see similar output - the GUI is accessible from <http://127.0.0.1:44004>

```
$ monk gui
Starting GUI on http://127.0.0.1:44004
✔ Starting the job... DONE
✔ Stopping containers DONE
✔ Preparing nodes DONE
✔ Preparing containers DONE
✔ Checking/pulling images DONE
✔ Starting containers DONE
✔ New container e436189d0b41d966b1e3559c6f316bea7e170a4bf04bcb04f4ba63d1ba3a134d created DONE
✔ Moncc GUI started successfully and running on http://127.0.0.1:44004
```

## GUI Sections

### Peers

This section summarizes all cluster peers that are currently running and their details.

<figure>
  <img src="/assets/gui1.png" />
</figure>
---
<figure>
  <img src="/assets/gui2.png" />
</figure>

### Workloads

This section summarizes all workloads which have been deployed to the cluster.

<figure>
  <img src="/assets/gui3.png" />
</figure>
---
<figure>
  <img src="/assets/gui4.png" />
</figure>

### Templates

The Templates section is a UI interface to Monk Hub. You can browse, compose and deploy any of the available public templates.

### Select and Run

In this mode, you can simply deploy any of the templates by clicking on Runbutton and specifying target such as your local environment or your cluster.

<figure>
  <img src="/assets/gui5.png" />
</figure>

### Wizard Mode

In the Wizard mode, you can select all required components that you would like to deploy as part of a single template.

<figure>
  <img src="/assets/gui6.png" />
</figure>

Once selected, continue to Compose button to open the Wizard for final tweaks.

<figure>
  <img src="/assets/gui7.png" />
</figure>

The Wizard allows you to quickly design your system, configure its variables and cloud provisioning into Monk manifest yaml.

When you decide your template is ready, you can load your new template to your local Monk environment.

<figure>
  <img src="/assets/gui8.png" />
</figure>

After it loads, you should be able to see your new components and system under Templates.

<figure>
  <img src="/assets/gui9.png" />
</figure>

The final step is to deploy your brand new system by clicking Run and selecting its target environment.

<figure>
  <img src="/assets/gui10.png" />
</figure>
