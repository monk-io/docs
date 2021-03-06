import React from "react";
import Layout from "@theme/Layout";

import "./index.scss";
import BigNavItem from "../components/bigNavItem";

export default function Home() {
    const navItems = [
        {
            to: "/docs",
            title: "About Monk",
            desc: "Learn about Monk and its features.",
            icon: "/img/mainNavItems/about-monk.svg"
        },
        {
            to: "/docs/monk-in-10",
            title: "Monk Basics",
            desc: "From zero to cluster in 10 min.",
            icon: "/img/mainNavItems/monk-basics.svg"
        },
        {
            to: "/docs/get-monk",
            title: "Install Monk",
            desc: "Download, install and update Monk.",
            icon: "/img/mainNavItems/install-monk.svg"
        },
        {
            to: "/docs/lifecycle/cluster-overview",
            title: "Guides",
            desc: "Learn Monk hands on.",
            icon: "/img/mainNavItems/guides.svg"
        },
        {
            to: "/docs/support",
            title: "Support & Contact",
            desc: "Join the community, get in touch.",
            icon: "/img/mainNavItems/support-contact.svg"
        },
        {
            to: "/docs/monkscript",
            title: "MonkScript Reference",
            desc: "Monk templating language in detail.",
            icon: "/img/mainNavItems/monkscript.svg"
        },
    ];
    return (
        <Layout
        // title={`Hello from ${siteConfig.title}`}
        // description="Description will go into a meta tag in <head />"
        >
            <div className="main-page">
                <div className="container">
                    <h1 className="main-title">Explore Monk Docs</h1>
                    <div className="row">
                        {navItems.map((i) => (
                            <BigNavItem key={i.title} {...i} />
                        ))}
                    </div>
                </div>
            </div>
        </Layout>
    );
}
