import React from 'react';
import Layout from '@theme/Layout';

import './index.scss';
import BigNavItem from '../components/bigNavItem';

export default function Home() {
  const navItems = [
    {
      to: '/docs',
      title: 'Doc link 1',
      desc: 'Doc link 1 desc'
    },
    {
      to: '/docs',
      title: 'Doc link 2',
      desc: 'Doc link 2 desc'
    },
    {
      to: '/docs',
      title: 'Doc link 3',
      desc: 'Doc link 3 desc'
    },
    {
      to: '/docs',
      title: 'Doc link 4',
      desc: 'Doc link 4 desc'
    },
    {
      to: '/docs',
      title: 'Doc link 5',
      desc: 'Doc link 5 desc'
    },
    {
      to: '/docs',
      title: 'Doc link 6',
      desc: 'Doc link 6 desc'
    },
  ];
  return (
    <Layout
      // title={`Hello from ${siteConfig.title}`}
      // description="Description will go into a meta tag in <head />"
    >
      <div className="main-page">
        <div className="container">
          <h1 className="main-title">Lorem ipsum dolor sit amet consectetur</h1>
          <div className="row">
            {navItems.map(i => <BigNavItem key={i.title} {...i} />)}
          </div>
        </div>
      </div>
    </Layout>
  )
}
