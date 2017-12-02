import * as THREE from 'three';
import Matter from 'matter-js';

import Game from '../index';

export default class Hero extends THREE.Group {
	static SPEED = 0.0002;

	constructor(game, level) {
		super();

		this.game = game;
		this.level = level;
		this.name = 'hero';
		this.radius = 0.2;

		const mesh = new THREE.Mesh(
			new THREE.CylinderGeometry(0.1, 0.2, 0.4, 8),
			new THREE.MeshNormalMaterial()
		);

		this.position.y = 0.2;

		this.add(mesh);
		this.body = this.game.physics.addEntity(this);
		this.body.frictionAir = 0.2;
		this.body.restitution = 0;
		this.body.density = 1;
		this.body.label = 'hero';

		this.movement = { x: 0, y: 0 };
	}

	update = (delta) => {
		this.movement = { x: 0, y: 0 };

		if (this.game.keys[Game.KEYS.W]) {
			this.movement.y -= Hero.SPEED;
		}
		if (this.game.keys[Game.KEYS.S]) {
			this.movement.y += Hero.SPEED;
		}
		if (this.game.keys[Game.KEYS.A]) {
			this.movement.x -= Hero.SPEED;
		}
		if (this.game.keys[Game.KEYS.D]) {
			this.movement.x += Hero.SPEED;
		}

		this.body.force.x = this.movement.x;
		this.body.force.y = this.movement.y;
	}
}