import React from 'react';
import OriginalLayout from '@theme-original/Layout';

import PageViewEventHandler from '../components/pageViewEventHandler';

function Layout(props) {
  return (
    <OriginalLayout {...props}>
      <PageViewEventHandler />
      {props.children}
    </OriginalLayout>
  );
}

export default Layout;