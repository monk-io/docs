/**
 * Creating a sidebar enables you to:
 - create an ordered group of docs
 - render a sidebar for each doc of that group
 - provide next/previous navigation

 The sidebars can be generated from the filesystem, or explicitly defined here.

 Create as many sidebars as you want.
 */

module.exports = {
  // By default, Docusaurus generates a sidebar from the docs folder structure
  // tutorialSidebar: [{type: 'autogenerated', dirName: '.'}],
  mainSidebar: [
    {
      type: "category",
      label: "About MonkOS",
      collapsible: false,
      items: [
        "welcome",
        "about/use-cases",
        "about/key-concepts",
        "about/features",
        "about/support",
        "about/monk-privacy",
      ],
    },
    {
      type: "category",
      label: "GUI",
      collapsed: false,
      items: [
        "gui/overview",
        "gui/project-setup",
        "gui/add-cloud-providers",
        "gui/instance-create",
        "gui/kits-adding",
        "gui/repo-import",
        "gui/scaling",
        "gui/kits-connecting",
        "gui/secrets",
        "gui/deployment",
        "gui/kits-inspecting",
        "gui/code-inspecting",
        "gui/environments",
        "gui/ai-agent",
      ],
    },
    {
      type: "category",
      label: "CLI",
      collapsed: false,
      items: [
        {
          type: "category",
          label: "Basics",
          collapsed: true,
          items: [
            "get-started/get-monk",
            "get-started/acc-and-auth",
            "basics/monk-in-10",
            "basics/running-templates",
            "basics/inspecting-workloads",
          ],
        },
        {
          type: "category",
          label: "Spin up a cluster",
          collapsed: true,
          items: [
            "lifecycle/cluster-overview",
            "lifecycle/cluster-create-1",
            "lifecycle/cluster-operate-1",
            "lifecycle/cluster-switch-1",
            "lifecycle/running-templates-cluster",
          ],
        },
        {
          type: "category",
          label: "Deploy Kits",
          collapsed: true,
          items: [
            "develop/basic-app",
            "develop/connecting-runnables",
            "develop/readiness-and-dependency-checks",
            "develop/persistent-storage",
            "develop/config-files",
            "develop/passing-secrets",
            "develop/provisioning-via-templates",
            "develop/affinity",
            "develop/load-balancers",
            "develop/hooks",
            "develop/entities",
          ],
        },
        {
          type: "category",
          label: "Guides",
          collapsed: true,
          items: [
            "improve/ci-cd",
            "improve/multi-cloud",
            "improve/cloud-provider",
          ],
        },
        {
          type: "category",
          label: "Reference",
          collapsed: true,
          items: ["cli/monk", "cli/monkd"],
        },
        "troubleshooting/common-issues",
      ],
    },
    {
      type: "category",
      label: "Develop Kits",
      collapsed: false,
      items: [
        {
          type: "category",
          label: "MonkScript",
          collapsed: true,
          items: [
            "monkscript/index",
            "monkscript/working",
            // FIXME describe MANIFEST
          ],
        },
        {
          type: "category",
          label: "Reference",
          collapsed: true,
          items: [
            {
              type: "category",
              label: "YAML",
              collapsed: true,
              items: [
                "monkscript/yaml/index",
                "monkscript/yaml/runnables",
                "monkscript/yaml/groups",
                // FIXME decribe entities
              ],
            },
            // FIXME describe entity JS
            {
              type: "category",
              label: "Scripting",
              collapsed: true,
              items: [
                "monkscript/scripting/index",
                "monkscript/scripting/cheatsheet",
                // FIXME describe repl
                {
                  type: "category",
                  label: "Operators",
                  collapsed: true,
                  items: [
                    "monkscript/scripting/operators/HTTP",
                    "monkscript/scripting/operators/JSON-RPC",
                    "monkscript/scripting/operators/JSON",
                    "monkscript/scripting/operators/actions",
                    "monkscript/scripting/operators/boolean",
                    "monkscript/scripting/operators/containers",
                    "monkscript/scripting/operators/internals",
                    "monkscript/scripting/operators/math",
                    "monkscript/scripting/operators/network",
                    "monkscript/scripting/operators/numbers",
                    "monkscript/scripting/operators/random",
                    "monkscript/scripting/operators/strings",
                    "monkscript/scripting/operators/types",
                    "monkscript/scripting/operators/variables",
                    "monkscript/scripting/operators/entities",
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
    {
      type: "category",
      label: "Contributors",
      collapsed: false,
      items: [
        "community/index",
        "community/publishers",
        "community/content",
        "community/bugs",
      ],
    },
  ],
};
