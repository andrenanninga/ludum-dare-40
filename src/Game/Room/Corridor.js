import * as THREE from 'three';
import { random } from 'lodash';

import Cave from '../Cave';
import Level from '../Level';

export default class Corridor extends THREE.Group {
	constructor(game, level, room, part) {
		super();

		this.game = game;
		this.level = level;
		this.part = part;

		this.pillars = [
			{ x: 1, y: 1 },
			{ x: 3, y: 1 },
			{ x: 2, y: 2 },
			{ x: 1, y: 3 },
			{ x: 3, y: 3 },
		];

		this.pillars.forEach(p => {
			if (random(1, 4) === 1) {
				p.visible = true;
				const pillar = this.game.loader.models.pillar.clone();
				pillar.position.set(p.x - 2, 0, p.y - 2);
				this.add(pillar);
			}
		})
	}

	fillTile(x, y) {
		for (let i = 0; i < this.pillars.length; i++) {
			if (this.pillars[i].visible && this.pillars[i].x === x && this.pillars[i].y === y) {
				return Cave.TILE.WALL;
			}
		}
	}
}