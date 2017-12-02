import * as THREE from 'three';

import Game from './index';

import Snake from './Snake';
import Dots from './Snake/Dots';

import Dungeon from './Dungeon';

export default class Level extends THREE.Group {
	static ROOMS = {
		LOOT: { name: 'LOOT', color: 0x00ffff },
		BOSS: { name: 'BOSS', color: 0xff00ff },
		PUZZLE: { name: 'PUZZLE', color: 0x00ff00 },
		HEALTH: { name: 'HEALTH', color: 0xff0000 },
		EXIT: { name: 'EXIT', color: 0xffff00 },
		START: { name: 'START', color: 0xffffff },
		CORRIDOR: { name: 'CORRIDOR', color: 0x999999 },
	}

	constructor(game, width, height) {
		super();

		this.game = game;

		this.width = width;
		this.height = height;

		if (Game.DEBUG) {
			this.add(new THREE.GridHelper(Math.max(width, height), Math.max(width, height)));
		}

		this.snake = new Snake(game, this, 0, 0, 3);
		this.dots = new Dots(game, this);
		this.dungeon = new Dungeon(game, this);

		this.add(this.snake);
		this.add(this.dots);
		this.add(this.dungeon);
	}

	update = (delta) => {
		if (this.game.state === Game.STATE.SNAKE) {
			this.snake.update(delta);
			this.dots.update(delta);
		}

		if (this.game.state === Game.STATE.DUNGEON) {
			this.dungeon.update(delta);
		}
	}

	updateState = (state) => {
		if (state === Game.STATE.SNAKE) {
			this.snake.visible = true;
			this.dots.visible = true;
			this.dungeon.visible = false;

			this.snake.reset();
			this.dots.reset();
		}

		if (state === Game.STATE.DUNGEON) {
			this.snake.visible = false;
			this.dots.visible = false;
			this.dungeon.visible = true;

			this.dungeon.build(this.snake);
		}
	}
}