import * as THREE from 'three';
import { Howl } from 'howler'

import Game from './index';
import Level from './Level';
import Cave from './Cave';

export default class Snake extends THREE.Group {
	static SPEED = 0.25;

	static SOUND = {
		DEATH: new Howl({ src: ['assets/music/death.mp3', 'assets/music/death.webm', 'assets/music/death.wav'] }),
		EAT: new Howl({ src: ['assets/music/eat.mp3', 'assets/music/eat.webm', 'assets/music/eat.wav'] }),
	}

	constructor(game, level, x, y, length) {
		super();

		this.game = game;
		this.level = level;
		this.x = x;
		this.y = y;

		this.direction = new THREE.Vector3(0, 0, 0);
		this.prevDirection = new THREE.Vector3(0, 0, 0);
		this.cooldown = 0;

		this.eaten = 0;
		this.hunger = 3;
		this.hearts = 3;
		this.lives = 3;

		this.target = new THREE.Mesh(
			new THREE.CylinderGeometry(0.2, 0.1, 0.1, 8),
			new THREE.MeshBasicMaterial({ color: 0x53777a })
		);
		this.target.position.y = 0.02;

		this.head = this.game.loader.models.snakeStart.clone();
		this.body = new THREE.Group();
		this.rooms = [];
		
		this.add(this.head);
		this.add(this.body);
		this.add(this.target);
	}

	isMoving = () => {
		return this.direction.x !== 0 || this.direction.z !== 0;
	}

	isHungry = () => {
		return this.eaten < this.hunger;
	}

	updateDirection = () => {
		if (this.game.keys[Game.KEYS.W] && this.prevDirection.z !== 1) {
			this.direction.set(0, 0, -1);
		}
		if (this.game.keys[Game.KEYS.S] && this.prevDirection.z !== -1) {
			this.direction.set(0, 0, 1);
		}
		if (this.game.keys[Game.KEYS.A] && this.prevDirection.x !== 1) {
			this.direction.set(-1, 0, 0);
		}
		if (this.game.keys[Game.KEYS.D] && this.prevDirection.x !== -1) {
			this.direction.set(1, 0, 0);
		}
	}

	update = (delta) => {
		this.cooldown -= delta;

		if (this.lives === 0) {
			return;
		}

		if (this.game.state === Game.STATE.DYING) {
			this.die();
			return;
		}

		if (this.game.state === Game.STATE.EXITING) {
			if (this.cooldown < 0) {
				this.exit();
			}

			return;
		}

		if (this.cooldown < 0 && this.isMoving()) {
			this.prevDirection.copy(this.direction);
			this.slither();
		}

		this.updateDirection();

		if (this.game.keys[Game.KEYS.W] && this.prevDirection.z !== 1) {
			this.direction.set(0, 0, -1);
		}
		if (this.game.keys[Game.KEYS.S] && this.prevDirection.z !== -1) {
			this.direction.set(0, 0, 1);
		}
		if (this.game.keys[Game.KEYS.A] && this.prevDirection.x !== 1) {
			this.direction.set(-1, 0, 0);
		}
		if (this.game.keys[Game.KEYS.D] && this.prevDirection.x !== -1) {
			this.direction.set(1, 0, 0);
		}

		this.target.position.copy(this.head.position).add(this.direction);

		for (let i = this.level.cave.gems.children.length - 1; i >= 0; i--) {
			const gem = this.level.cave.gems.children[i];
			if (this.head.position.x === gem.position.x && this.head.position.z === gem.position.z) {
				this.level.cave.gems.remove(gem);

				if (gem.room === Level.ROOM.HEALTH) {
					this.lives = Math.min(this.lives + 1, this.hearts);
					console.log(this.lives, this.hearts);
					this.game.ui.setState({ lives: this.lives });
					break;
				}

				this.rooms.push(gem.room);
				this.eaten += 1;
				this.game.ui.setState({ eaten: this.eaten });
				Snake.SOUND.EAT.play();

				break;
			}
		}
	}

	slither = (force = false) => {
		this.head.rotation.y = this.getHeadAngle(this.direction)

		if (!force) {
			const next = this.head.position.clone().add(this.direction);

			for (let i = 1; i < this.body.children.length - 1; i++) {
				const child = this.body.children[i];
				if (child.position.x === next.x && child.position.z === next.z) {
					this.game.camera.shake(10, 10);
					Snake.SOUND.DEATH.play();
					this.lives = Math.max(0, this.lives - 1);
					this.game.ui.setState({ lives: this.lives });
					this.game.setState(Game.STATE.DYING);
					return;
				}
			}
	
			const tile = this.level.cave.map[`${next.x},${next.z}`];
	
			if (!tile || tile === Cave.TILE.WALL) {
				this.game.camera.shake(2, 2);
				Snake.SOUND.DEATH.play();
				this.lives = Math.max(0, this.lives - 1);
				this.game.ui.setState({ lives: this.lives });
				this.game.setState(Game.STATE.DYING);
				return;
			}

			if (!this.isHungry() && tile === Cave.TILE.EXIT) {
				setTimeout(() => {
					this.game.camera.tracking = false;
					this.game.setState(Game.STATE.EXITING);
				})
			}
		}

		if (this.body.children.length < this.rooms.length) {
			const room = this.rooms[this.body.children.length];
			const part = room.model.clone();

			part.room = room;
			// part.children[0].material = part.children[0].material.clone();
			// part.children[0].material.color = new THREE.Color(room.color);
			part.position.add((this.body.children[0] || this.head).position);

			for (let i = 0; i < this.body.children.length; i += 1) {
				const part = this.body.children[i];
				const prev = this.body.children[i + 1] || this.head;
				part.position.set(prev.position.x, prev.position.y, prev.position.z);
			}

			this.body.children.reverse();
			this.body.add(part);
			this.body.children.reverse();
		}

		for (let i = this.body.children.length - 1; i >= 0; i -= 1) {
			const part = this.body.children[i];
			const prev = this.body.children[i - 1] || this.head;
			part.position.set(prev.position.x, prev.position.y, prev.position.z);
		}

		this.head.position.x += this.direction.x;
		this.head.position.z += this.direction.z;
		this.head.rotation.y = this.getHeadAngle(this.direction)

		for (let i = this.body.children.length - 1; i >= 0; i--) {
			const part = this.body.children[i];
			const next = this.body.children[i - 1] || this.head;
			const prev = this.body.children[i + 1];
			part.rotation.y = this.getBodyAngle(part.position, next.position, prev && prev.position);

			const scale = 0.5 + (0.8 - (i / this.body.children.length)) * 0.5;
			part.scale.set(0.5, scale / 2, scale / 2);
		}

		this.cooldown = Snake.SPEED;

		if (force) {
			return;
		}
	}

	exit = () => {
		if (this.head.visible) {
			this._head = this.head.clone();
			this._body = new THREE.Group();
			this._body.children = this.body.children.map(child => {
				const clone = child.clone();
				clone.room = child.room;
				clone.position.copy(child.position.clone());
				return clone;
			});

			this.head.visible = false;
			this.slither(true);
			this.cooldown = Snake.SPEED;
			return;
		}
		
		this.slither(true);
		this.cooldown = Math.min(1 / this.body.children.length, Snake.SPEED);

		for (let i = 0; i < this.body.children.length; i += 1) {
			const part = this.body.children[i];

			if (part.visible) {
				part.visible = false;
				return;
			}
		}

		this.game.ui.setState({ score: this.game.ui.state.score + this.eaten });

		const _head = this.head;
		const _body = this.body

		this.head = this._head;
		this.body = this._body;

		this.level.cave.buildFromSnake();

		this.head = _head;
		this.body = _body;
		this.head.position.copy(this._head.position);

		delete this._head;
		delete this._body;

		this.reset();
		this.game.camera.reset();
		this.game.setState(Game.STATE.SNAKE);
	}

	die = () => {
		if (this.position.y > -0.1) {
			this.scale.y = Math.max(0.1, this.scale.y - 0.02);
			this.position.y -= 0.001;
		}
		else {
			this.reset();
			this.game.setState(Game.STATE.SNAKE);
		}

		if (this.game.keys[Game.KEYS.SPACE]) {
			this.reset();
			this.game.setState(Game.STATE.SNAKE);
		}
	}

	reset = () => {
		this.scale.set(1, 1, 1);
		this.position.set(0, 0, 0);
		this.prevDirection.set(0, 0, 0);
		this.head.visible = true;
		this.head.position.copy(this.level.cave.spawn);
		this.eaten = 0;
		this.game.ui.setState({ eaten: this.eaten });

		for (let i = this.body.children.length - 1; i >= 0; i--) {
			this.body.remove(this.body.children[i]);
		}

		this.direction.set(1, 0, 0);
		this.rooms = [
			Level.ROOM.END,
			Level.ROOM.CORRIDOR,
			Level.ROOM.CORRIDOR,
			Level.ROOM.CORRIDOR,
		];

		this.direction.set(0, 0, 0);
	}

	// Math is hard!
	getHeadAngle = (direction) => {
		if (direction.x > 0 && direction.z === 0) { return 0; }
		if (direction.x < 0 && direction.z === 0) { return Math.PI; }
		if (direction.x === 0 && direction.z > 0) { return Math.PI / -2; }
		if (direction.x === 0 && direction.z < 0) { return Math.PI / 2; }

		return 0;
	}

	// Math is hard!
	getBodyAngle = (body, next, prev) => {
		const degrees = x => x * Math.PI / 180;

		if (next && prev) {
			const a = body.clone().sub(next);
			const b = body.clone().sub(prev);

			if (a.x === -1 && b.x === 1) { return degrees(0); }
			if (a.z === 1 && b.z === -1) { return degrees(90); }
			if (a.x === 1 && b.x === -1) { return degrees(180); }
			if (a.z === -1 && b.z === 1) { return degrees(270); }

			if (a.x === 0 && a.z === 1 && b.x === 1) { return degrees(45); }
			if (a.x === 0 && a.z === 1 && b.x === -1) { return degrees(135); }
			if (a.x === 0 && a.z === -1 && b.x === -1) { return degrees(225); }
			if (a.x === 0 && a.z === -1 && b.x === 1) { return degrees(315); }

			if (a.x === 1 && a.z === 0 && b.z === 1) { return degrees(225); }
			if (a.x === 1 && a.z === 0 && b.z === -1) { return degrees(135); }
			if (a.x === -1 && a.z === 0 && b.z === 1) { return degrees(315); }
			if (a.x === -1 && a.z === 0 && b.z === -1) { return degrees(45); }
		}
		else {
			const a = body.clone().sub(next);
			if (a.x > 0 && a.z === 0) { return degrees(180) }
			if (a.x < 0 && a.z === 0) { return degrees(0); }
			if (a.x === 0 && a.z > 0) { return degrees(90); }
			if (a.x === 0 && a.z < 0) { return degrees(270); }
		}

		return 0;
	}
}