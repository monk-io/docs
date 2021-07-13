import React from 'react';
import Link from '@docusaurus/Link';

import './index.scss';

export default ({to, title, desc}) => {
  return (
    <Link to={to} className="col col--4 big-nav-item">
      <div className="big-nav-item__content">
        <span className="big-nav-item__title">{title}</span>
        <p className="big-nav-item__desc">{desc}</p>
      </div>
    </Link>
  );
}