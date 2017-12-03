import * as THREE from 'three';

import Game from './index';
import Snake from './Snake';
import Cave from './Cave';

export default class Level extends THREE.Group {
	static ROOM = {
		START: { name: 'START', color: 0xffffff, chance: 0 },
		END: { name: 'END', color: 0xffff00, chance: 0 },
		CORRIDOR: { name: 'CORRIDOR', color: 0xe6f2e9, chance: 0.8 },
		HEALTH: { name: 'HEALTH', color: 0xfe4365, chance: 0.05 },

		// LOOT: { name: 'LOOT', color: 0x00ffff },
		// BOSS: { name: 'BOSS', color: 0xff00ff },
		// PUZZLE: { name: 'PUZZLE', color: 0x00ff00 },
	}

	constructor(game) {
		super();

		this.game = game;

		Level.ROOM.START.model = game.loader.models.snakeCorridor;
		Level.ROOM.CORRIDOR.model = game.loader.models.snakeBody;
		Level.ROOM.HEALTH.model = game.loader.models.snakeHealth;
		Level.ROOM.END.model = game.loader.models.snakeEnd;

		this.snake = new Snake(game, this, 0, 0, 3);
		this.cave = new Cave(game, this);

		this.snake.reset();
		this.snake.direction.set(0, 0, 1);
		this.snake.slither(true);
		this.snake.slither(true);
		this.cave.buildFromSnake(this.snake);
		this.snake.reset();

		this.add(this.snake);
		this.add(this.cave);
	}

	update = (delta, time) => {
		if (this.game.state === Game.STATE.SNAKE) {
			this.cave.update(delta, time);
			this.snake.update(delta, time);
		}

		if (this.game.state === Game.STATE.DYING) {
			this.snake.update(delta, time);
		}

		if (this.game.state === Game.STATE.EXITING) {
			this.snake.update(delta, time);
		}
	}
}