import React, { PureComponent } from 'react';
import _ from 'lodash';

import Game from './Game';

export default class App extends PureComponent {
	componentDidMount() {
		this.game = new Game(this.refs.container);
		window.game = this.game;
		window._ = _;
	}

	render() {
		return (
			<div style={{ width: '100vw', height: '100vh' }} ref="container" />
		);
	}
}