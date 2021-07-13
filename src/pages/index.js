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
        },
        {
            to: "/docs/monk-in-10",
            title: "Monk Basics",
            desc: "From zero to cluster in 10 min.",
        },
        {
            to: "/docs/get-monk",
            title: "Install Monk",
            desc: "Download, install and update Monk.",
        },
        {
            to: "/docs/lifecycle/cluster-overview",
            title: "Guides",
            desc: "Learn Monk hands on.",
        },
        {
            to: "/docs/support",
            title: "Support & Contact",
            desc: "Join the community, get in touch.",
        },
        {
            to: "/docs/monkscript",
            title: "MonkScript Reference",
            desc: "Monk templating language in detail.",
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
