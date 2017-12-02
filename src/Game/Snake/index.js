import * as THREE from 'three';
import { random } from 'lodash';

import Game from '../index';
import Level from '../Level';

export default class Snake extends THREE.Group {
	static SPEED = 0.1;

	constructor(game, level, x, y, length) {
		super();

		this.game = game;
		this.level = level;
		this.x = x;
		this.y = y;

		this.rooms = [
			Level.ROOMS.START,
			Level.ROOMS.CORRIDOR,
			Level.ROOMS.CORRIDOR,
		];

		this.position.y = 0.5;
		this.direction = new THREE.Vector3(0, 0, 0);
		this.cooldown = 0;

		this.head = new THREE.Mesh(
			new THREE.BoxGeometry(0.9, 0.9, 0.9),
			new THREE.MeshNormalMaterial({ wireframe: false })
		);

		this.add(this.head);
	}

	isMoving = () => {
		return this.direction.x !== 0 || this.direction.z !== 0;
	}

	update = (delta) => {
		this.cooldown -= delta;

		if (this.game.keys[Game.KEYS.W] && this.direction.z !== 1) {
			this.direction.set(0, 0, -1);
		}
		if (this.game.keys[Game.KEYS.S] && this.direction.z !== -1) {
			this.direction.set(0, 0, 1);
		}
		if (this.game.keys[Game.KEYS.A] && this.direction.x !== 1) {
			this.direction.set(-1, 0, 0);
		}
		if (this.game.keys[Game.KEYS.D] && this.direction.x !== -1) {
			this.direction.set(1, 0, 0);
		}

		if (this.cooldown < 0 && this.isMoving()) {
			this.move();
		}

		for (let i = this.level.dots.children.length - 1; i >= 0; i--) {
			const dot = this.level.dots.children[i];
			if (this.head.position.x === dot.position.x && this.head.position.z === dot.position.z) {
				this.level.dots.remove(dot);
				this.rooms.push(dot.room);

				if (dot.room === Level.ROOMS.EXIT) {
					setTimeout(() => {
						this.direction.set(0, 0, 0);
						this.game.setState(Game.STATE.DUNGEON);
					}, Snake.SPEED * 1000 * 1.5);
				}

				break;
			}
		}
	}

	move = () => {
		const tail = this.children[this.children.length - 1];

		if (this.children.length < this.rooms.length) {
			const room = this.rooms[this.children.length];
			const part = new THREE.Mesh(
				new THREE.BoxGeometry(0.9, 0.9, 0.9),
				new THREE.MeshBasicMaterial({ color: room.color }),
			);

			part.position.add(tail.position);

			this.add(part);
		}

				for (let i = this.children.length - 1; i > 0; i--) {
			const part = this.children[i];
			const next = this.children[i - 1].position;
			part.position.set(next.x, next.y, next.z);
		}

		this.head.position.add(this.direction);
		this.cooldown = Snake.SPEED;

		for (let i = 1; i < this.children.length; i++) {
			const child = this.children[i];
			if (child.position.x === this.head.position.x && child.position.z === this.head.position.z) {
				this.reset();
			}
		}

		if (this.head.position.x > this.level.width / 2 ||
			this.head.position.x < this.level.width / -2 ||
			this.head.position.z > this.level.height / 2 ||
			this.head.position.z < this.level.height / -2) {
			this.reset();
		}
	}

	reset = () => {
		for (let i = this.children.length - 1; i > 0; i--) {
			this.remove(this.children[i]);
		}

		this.head.position.set(this.x, 0, this.y);
		this.direction.set(0, 0, 0);
		this.rooms = [
			Level.ROOMS.START,
			Level.ROOMS.CORRIDOR,
			Level.ROOMS.CORRIDOR,
		];
	}
}