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
            label: "About Monk",
            collapsible: false,
            items: [
                "welcome",
                "about/use-cases",
                "about/key-concepts",
                "about/comparison",
                "about/features",
                "about/support",
                "about/monk-privacy",
            ],
        },
        {
            type: "category",
            label: "Getting Started",
            collapsed: true,
            items: [
                "get-started/get-monk",
                "get-started/acc-and-auth"
            ],
        },
        {
            type: "category",
            label: "Basics",
            collapsed: true,
            items: [
                "basics/monk-in-10",
                "basics/running-templates",
                "basics/inspecting-workloads"
            ],
        },
        {
            type: "category",
            label: "Deploy",
            collapsed: true,
            items: [
                "lifecycle/cluster-overview",
                "lifecycle/cluster-create-1",
                "lifecycle/cluster-operate-1",
                "lifecycle/cluster-switch-1",
                "lifecycle/running-templates-cluster",
            ],
        },
        // FIXME - Marcin: I think this should be "GUI" instead of "Sandbox UI" because the "Sandbox" is the one at sandbox.monk.io that does not require an account and doesn't allow you to deploy.
        //         Some instructions apply to both the "Sandbox" ad "Main App UI" when it come3s to editing the graph, settings etc. but the Sandbox is missing project creation, deploymetn, monitoring etc.   
        {
            type: "category",
            label: "Sandbox UI", 
            collapsed: true,
            items: [
                "gui/project-setup",
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
            ],
        },
        {
            type: "category",
            label: "Develop Templates",
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
            label: "Level Up",
            collapsed: true,
            items: [
                "improve/k8s-migrate",
                "improve/ci-cd",
                "improve/multi-cloud",
                "improve/cloud-provider"
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
                "community/bugs"
            ],
        },
        // {
        //     type: "category",
        //     label: "Case Studies",
        //     collapsed: false,
        //     items: ["cases/chainlink"],
        // },
        {
            type: "category",
            label: "Reference",
            collapsed: false,
            items: [
                {
                    type: "category",
                    label: "MonkScript",
                    collapsed: true,
                    items: [
                        "monkscript/index",
                        "monkscript/working",
                        {
                            type: "category",
                            label: "YAML",
                            collapsed: true,
                            items: [
                                "monkscript/yaml/index",
                                "monkscript/yaml/runnables",
                                "monkscript/yaml/groups",
                                "monkscript/yaml/services",
                            ],
                        },
                        {
                            type: "category",
                            label: "Scripting",
                            collapsed: true,
                            items: [
                                "monkscript/scripting/index",
                                "monkscript/scripting/cheatsheet",
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
                {
                    type: "category",
                    label: "CLI",
                    collapsed: true,
                    items: ["cli/monk", "cli/monkd"],
                },
                // "gui/index",
            ],
        },
        {
            type: "category",
            label: "Troubleshooting",
            collapsed: false,
            items: ["troubleshooting/templates", "troubleshooting/common-issues"],
        },
    ],
};
