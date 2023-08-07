import React from 'react';
import {useLocation} from '@docusaurus/router';
import useIsBrowser from '@docusaurus/useIsBrowser';

const handleEvent = (routePath = 'unhandled') => {
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
      event: "Page View",
      // page_title: routeName, // Hidden because docusaurus doesn't provide this
      page_domain: window.location.hostname,
      page_path: routePath, // window.location.pathname,
      page_url: window.location.href,
  });
}

const PageRoute = () => {
  const isBrowser = useIsBrowser();
  if (!isBrowser) return null;

  const location = useLocation();

  React.useEffect(() => {
    handleEvent(location.pathname);
  }, [location]);

  return null;
}

export default PageRoute;