/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import {useThemeConfig} from '@docusaurus/theme-common';
import useBaseUrl from '@docusaurus/useBaseUrl';

function FooterLink({to, href, label, prependBaseUrlToHref, ...props}) {
  const toUrl = useBaseUrl(to);
  const normalizedHref = useBaseUrl(href, {
    forcePrependBaseUrl: true,
  });
  return (
    <Link
      className="footer__link-item"
      {...(href
        ? {
            href: prependBaseUrlToHref ? normalizedHref : href,
          }
        : {
            to: toUrl,
          })}
      {...props}>
      {label}
    </Link>
  );
}

function Footer() {
  const {footer} = useThemeConfig();
  const {copyright, links = [], logo = {}} = footer || {};
  const sources = {
    light: useBaseUrl(logo.src),
    dark: useBaseUrl(logo.srcDark || logo.src),
  };

  if (!footer) {
    return null;
  }

  return (
    <footer
      className={clsx('footer', {
        'footer--dark': footer.style === 'dark',
      })}>
      <div className="container">
        <div className="row footer__content-row">
          <div className="col col--6 footer__logo-block">
            <a className="footer__logo-btn" href="https://monk.io" target="_blank">monk</a>
            <span className="copyright">{`© ${new Date().getFullYear()} MonkOS Inc.`}</span>
          </div>
          {links && links.length > 0 && (
            <div className="col col--6">
              <div className="row footer__links">
                {links.map((linkItem, i) => (
                  <div key={i} className="col footer__col">
                    {linkItem.title != null ? (
                      <div className="footer__title">{linkItem.title}</div>
                    ) : null}
                    {linkItem.items != null &&
                    Array.isArray(linkItem.items) &&
                    linkItem.items.length > 0 ? (
                      <ul className="footer__items">
                        {linkItem.items.map((item, key) =>
                          item.html ? (
                            <li
                              key={key}
                              className="footer__item" // Developer provided the HTML, so assume it's safe.
                              // eslint-disable-next-line react/no-danger
                              dangerouslySetInnerHTML={{
                                __html: item.html,
                              }}
                            />
                          ) : (
                            <li key={item.href || item.to} className="footer__item">
                              <FooterLink {...item} />
                            </li>
                          ),
                        )}
                      </ul>
                    ) : null}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </footer>
  );
}

export default Footer;
