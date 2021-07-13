import React from 'react';

import './style.css';

export default class Item extends React.Component {
    state = {
        voted: false,
    }

    onLikePress = () => this.setState(
        { voted: true },
        () => this.rateThePage(true)
    );

    onDislikePress = () => this.setState(
        { voted: true },
        () => this.rateThePage(false)
    );

    rateThePage = ( like=false ) => {
        const body = {
            resourceName: window.location.pathname.replace('/docs', '').replace('.html', '/'),
            source: 'docs',
            dir: like ? 'up' : 'down'
        };

        fetch('https://front.monk.io/hub/api/v1/vote/add', {
            method: 'POST',
            body: JSON.stringify(body),
            headers: {
                'Content-Type': 'application/json',
            }
        })
        .then(response => response.json())
        .then((r) => null);
    };

    render() {
        return (
            <div className="row">
                <div className="col col--9 vote-wrapper">
                    {this.state.voted ?
                        <p className="vote-thanks">Thanks!</p> :
                        <div className="vote-container">
                            <span className="vote-title">Rate this page</span>
                            <div className="vote-btns">
                                <button className="vote-btn" id="vote-like" onClick={this.onLikePress}>👍</button>
                                <button className="vote-btn" id="vote-dislike" onClick={this.onDislikePress}>👎</button>
                            </div>
                        </div>
                    }
                </div>
            </div>
        );
    }
}