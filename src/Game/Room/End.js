import * as THREE from 'three';

import Level from '../Level';
import Cave from '../Cave';

export default class End extends THREE.Group {
	constructor(game, level) {
		super();

		this.game = game;
		this.level = level;
		this.name = 'end';


		this.exit = this.game.loader.models.end.clone();
		this.exit.position.x = 0;
		this.exit.position.z = 0;
		this.add(this.exit);
	}

	fillTile(x, y) {
		if (x === 2 && y === 2) {
			return Cave.TILE.EXIT;
		}
	}
}