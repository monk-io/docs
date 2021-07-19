import React from 'react';
import Link from '@docusaurus/Link';

import './index.scss';

export default ({to, title, desc, icon}) => {
  return (
    <Link to={to} className="col col--4 big-nav-item">
      <div className="big-nav-item__content">
        {icon && <img src={icon} className="big-nav-item__icon" />}
        <span className="big-nav-item__title">{title}</span>
        <p className="big-nav-item__desc">{desc}</p>
      </div>
    </Link>
  );
}