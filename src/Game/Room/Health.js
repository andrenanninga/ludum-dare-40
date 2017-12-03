import * as THREE from 'three';

import Cave from '../Cave';

export default class Test extends THREE.Group {
	constructor(game, level, room) {
		super();

		this.game = game;
		this.level = level;

		const outline = this.game.loader.models.outline.clone();
		outline.children[0].material = outline.children[0].material.clone();
		outline.children[0].material.color = new THREE.Color(room.color);
		outline.children[0].material.opacity = 0.5;
		outline.position.x = 0;
		outline.position.y = 0.1;
		outline.position.z = 0;
		this.add(outline);
	}

	fillTile(x, y) {
		
	}
}