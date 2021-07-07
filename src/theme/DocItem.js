import DocItem from '@theme-original/DocItem';
import React from 'react';

import Voting from '../components/voting';

export default (props) => (
    <>
        <DocItem {...props} />
        <Voting />
    </>
);