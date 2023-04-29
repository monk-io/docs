import React from 'react';
import useBaseUrl from '@docusaurus/useBaseUrl';

function Figure(props) {
  let {alt, caption, src, ...rest} = props;
  if(!alt) alt = caption;
  return (
    <figure {...rest}>
      <img alt={alt} src={useBaseUrl(src)} title={caption}/>
      {caption && <figcaption>{caption}</figcaption>}
    </figure>
  );
}

export default Figure;