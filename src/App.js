import React, { PureComponent } from 'react';
import _ from 'lodash';

import Game from './Game';

import Score from './ui/Score';
import Eaten from './ui/Eaten';
import Lives from './ui/Lives';
import Loading from './ui/Loading';
import GameOver from './ui/GameOver';
import Controls from './ui/Controls';

export default class App extends PureComponent {
	state = {
		score: 0,
		eaten: 0,
		hunger: 3,
		lives: 3,
		hearts: 3,
		loading: true,
		controls: true,
	}

	componentDidMount() {
		this.game = new Game(this.refs.container, this);
		window.game = this.game;
		window._ = _;
	}

	restart = () => {
		this.game.restart();
	}

	render = () => {
		const { score, eaten, hunger, hearts, lives, loading, controls } = this.state;

		return (
			<div>
				<div style={{ width: '100vw', height: '100vh' }} ref="container" />

				{loading && <Loading />}
				{!loading && controls && <Controls />}
				{lives === 0 && <GameOver onRestart={this.restart} />}


				<Score score={score} />
				<Eaten eaten={eaten} hunger={hunger} />
				<Lives hearts={hearts} lives={lives} />
			</div>
		);
	}
}