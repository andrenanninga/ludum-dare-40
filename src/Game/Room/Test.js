import * as THREE from 'three';

import Cave from '../Cave';

export default class Test extends THREE.Group {
	constructor(game, level, room) {
		super();

		this.game = game;
		this.level = level;
	}

	fillTile(x, y) {
		
	}
}