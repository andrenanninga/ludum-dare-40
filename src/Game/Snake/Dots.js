import * as THREE from 'three';
import { sample, random } from 'lodash';

import Level from '../Level';

export default class Dots extends THREE.Group {
	static COOLDOWN = 0.5;

	constructor(game, level) {
		super();

		this.game = game;
		this.level = level;
		this.cooldown = Dots.COOLDOWN / 2;

		this.reset();
	}

	update = (delta) => {
		if (this.level.snake.isMoving()) {
			this.cooldown -= delta;
		}

		if (this.cooldown < 0) {
			const spawned = this.spawn();

			if (spawned) {
				this.cooldown = Dots.COOLDOWN;
			}
		}
	}

	spawn = () => {
		const room = sample(Level.ROOMS);

		// Don't spawn more START rooms
		if (room.name === 'START') {
			return false;
		}

		const dot = new THREE.Mesh(
			new THREE.SphereGeometry(0.5, 5, 4),
			new THREE.MeshBasicMaterial({ color: room.color }),
		);

		dot.position.x = Math.round(random(this.level.width - 1) - this.level.width / 2 + 0.5);
		dot.position.y = 0.5;
		dot.position.z = Math.round(random(this.level.height - 1) - this.level.height / 2 + 0.5);

		dot.room = room;

		// Don't spawn dots on top of other dots
		for (let i = 0; i < this.children.length; i++) {
			const child = this.children[i];

			if (dot.position.equals(child.position)) {
				return false;
			}
		}

		this.add(dot);
		return true;
	}

	spawnExit = () => {
		const room = Level.ROOMS.EXIT;
		const dot = new THREE.Mesh(
			new THREE.SphereGeometry(0.5, 5, 4),
			new THREE.MeshBasicMaterial({ color: room.color }),
		);

		dot.position.x = Math.round(random(this.level.width - 1) - this.level.width / 2 + 0.5);
		dot.position.y = 0.5;
		dot.position.z = Math.round(random(this.level.height - 1) - this.level.height / 2 + 0.5);

		dot.room = room;
		this.add(dot);
	}

	reset = () => {
		for (let i = this.children.length - 1; i >= 0; i--) {
			this.remove(this.children[i]);
		}

		this.spawnExit();
	}
}