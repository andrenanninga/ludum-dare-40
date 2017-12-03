import * as THREE from 'three';
import { times, sample } from 'lodash';

import Level from './Level';

import Corridor from './Room/Corridor';
import End from './Room/End';
import Start from './Room/Start';
import Health from './Room/Health';
import Test from './Room/Test';

export default class Cave extends THREE.Group {
	static ROOM = 5;
	static GEM_COOLDOWN = 1;

	static TILE = {
		EMPTY: 1,
		WALL: 2,
		EXIT: 3
	}

	constructor(game, level) {
		super();

		this.game = game;
		this.level = level;

		this.map = null;
		this.gems = new THREE.Group();
		this.rooms = new THREE.Group();
		this.size = 0;

		this.spawn = new THREE.Vector3();

		this.add(this.gems);
		this.add(this.rooms);

		this.cooldown = 0;
	}

	update = (delta, time) => {
		const isFull = this.gems.children.length > this.size * 2;
		if (this.level.snake.isMoving() && this.level.snake.isHungry() && !isFull) {
			this.cooldown -= delta;
		}

		const exit = this.rooms.getObjectByName('end').exit;
		exit.position.y += ((this.level.snake.isHungry() ? -0.1 : 0) - exit.position.y) / 20;

		if (this.cooldown < 0) {
			const spawned = this.spawnGem();

			if (spawned) {
				this.cooldown = Cave.GEM_COOLDOWN;
			}
		}

		this.gems.children.forEach(gem => {
			gem.rotation.y += delta * 2;
			gem.position.y = Math.sin(time + gem.position.x + gem.position.z) / 3 + 0.1;
		})
	}

	spawnGem = () => {
		const room = sample(Level.ROOM);

		if (Math.random() > room.chance) {
			return false;
		}

		const gem = this.game.loader.models.gem.clone();
		gem.children[0].material = gem.children[0].material.clone();
		gem.children[0].material.color = new THREE.Color(room.color);
		const coord = sample(Object.keys(this.map).filter(x => this.map[x] !== Cave.TILE.WALL));
		const [x, y] = coord.split(',').map(x => parseInt(x, 10));

		gem.position.x = x;
		gem.position.y = -0.2;
		gem.position.z = y;
		gem.rotation.y = Math.random() * Math.PI * 2;

		gem.room = room;

		// Don't spawn gems on top of other gems
		for (let i = 0; i < this.gems.children.length; i++) {
			const child = this.gems.children[i];

			if (gem.position.equals(child.position)) {
				return false;
			}
		}

		for (let i = 0; i < this.level.snake.body.children.length; i++) {
			const part = this.level.snake.body.children[i];

			if (gem.position.equals(part.position)) {
				return false;
			}
		}

		this.gems.add(gem);
		return true;
	}

	buildFromSnake = () => {
		this.reset();

		const snake = this.level.snake;

		this.addRoom(snake, snake.head, Level.ROOM.START);
		this.spawn = snake.head.position.clone().multiplyScalar(Cave.ROOM);

		this.size = snake.body.children.length + 1;
		snake.body.children.forEach(child => {
			this.addRoom(snake, child, child.room);
		});

		Object.keys(this.map).map(coord => this.placeTile(coord));

		snake.hunger = Math.min(Math.ceil(snake.body.children.length / 2), snake.hunger + 2);
		this.game.ui.setState({ hunger: snake.hunger });
	}

	addRoom = (snake, part, room) => {
		const instance = this.newRoomInstance(part, room);
		this.rooms.add(instance);

		for (let x = 0; x < Cave.ROOM; x += 1) {
			for (let y = 0; y < Cave.ROOM; y += 1) {
				const rx = x + (part.position.x * Cave.ROOM) - Math.floor(Cave.ROOM / 2);
				const ry = y + (part.position.z * Cave.ROOM) - Math.floor(Cave.ROOM / 2);

				this.map[`${rx},${ry}`] = instance.fillTile(x, y) || Cave.TILE.EMPTY;
			}
		}
	}

	newRoomInstance = (part, room) => {
		let instance;

		switch (room) {
			case Level.ROOM.CORRIDOR:
				instance = new Corridor(this.game, this.level, room);
				break;

			case Level.ROOM.END:
				instance = new End(this.game, this.level, room);
				break;

			case Level.ROOM.START:
				instance = new Start(this.game, this.level, room);
				break;

			case Level.ROOM.HEALTH:
				instance = new Health(this.game, this.level, room);
				break;

			default:
				instance = new Test(this.game, this.level, room);
				break;
		}

		instance.position.add(part.position).setY(0).multiplyScalar(Cave.ROOM);
		return instance;
	}

	placeTile = (coord) => {
		const tile = this.map[coord];
		const [x, y] = coord.split(',').map(x => parseInt(x, 10));

		const color = (x + 1000000) % 2 === ((y + 100000) % 2 === 0 ? 0 : 1) ? 0x4d5865 : 0x454f5b;
		const ground = new THREE.Mesh(
			new THREE.PlaneGeometry(1, 1),
			new THREE.MeshBasicMaterial({ wireframe: false, color })
		);

		ground.rotation.x = -Math.PI / 2;
		ground.position.set(x, 0, y);
		this.rooms.add(ground);
	}

	reset = () => {
		for (let i = this.gems.children.length - 1; i >= 0; i--) {
			this.gems.remove(this.gems.children[i]);
		}

		for (let i = this.rooms.children.length - 1; i >= 0; i--) {
			this.rooms.remove(this.rooms.children[i]);
		}

		this.map = {};
		this.wall = {};
		this.cooldown = 0;
	}
}