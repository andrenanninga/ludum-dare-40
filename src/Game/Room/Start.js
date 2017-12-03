import * as THREE from 'three';

import Level from '../Level';
import Cave from '../Cave';

export default class Start extends THREE.Group {
	constructor(game, level) {
		super();

		this.game = game;
		this.level = level;

		const start = this.game.loader.models.start.clone();
		start.position.x = 0;
		start.position.y = 0;
		start.position.z = 0;
		this.add(start);
	}

	fillTile(x, y) {
	}
}