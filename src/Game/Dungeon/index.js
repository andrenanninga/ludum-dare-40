import * as THREE from 'three';
import Matter from 'matter-js'
import { differenceWith, uniqWith, isEqual } from 'lodash';

import Game from '../index';
import Level from '../Level';
import Hero from './Hero';

export default class Dungeon extends THREE.Group {
	constructor(game, level) {
		super();

		this.game = game;
		this.level = level;

		this.hero = new Hero(this.game, this.level);
		this.add(this.hero);

		this.bodies = [];
		this.rooms = new THREE.Group();

		Matter.Events.on(game.physics.engine, 'collisionStart', this.collision);
	}

	build = (snake) => {
		let walls = [];
		
		snake.rooms.forEach((room, i) => {
			const position = snake.children[i].position;

			const mesh = new THREE.Mesh(
				new THREE.BoxGeometry(1, 1, 1),
				new THREE.MeshBasicMaterial({ color: room.color, wireframe: true })
			);

			mesh.position.add(position);
			mesh.position.y = 0.5;
			this.rooms.add(mesh);

			if (room === Level.ROOMS.START) {
				Matter.Body.setPosition(this.hero.body, { x: position.x * 32, y: position.z * 32 });
			}

			if (room === Level.ROOMS.EXIT) {
				const body = this.game.physics.addRectangle(position.x, position.z, 0.5, 0.5, { isStatic: true, isSensor: true });
				body.label = 'exit';
				this.bodies.push(body);
			}

			walls = walls.concat(this.addWalls(position));
		});

		this.add(this.rooms);

		const gaps = this.rooms.children.map(c => ({ x: c.position.x, z: c.position.z }));
		walls = uniqWith(walls, isEqual);
		walls = differenceWith(walls, gaps, isEqual);

		walls.forEach(wall => {
			this.bodies.push(this.game.physics.addRectangle(wall.x, wall.z, 1, 1, { isStatic: true }));
		});
	}

	reset = () => {
		this.bodies.forEach(body => {
			this.game.physics.remove(body);
		});

		for (let i = this.rooms.children.length - 1; i >= 0; i--) {
			this.rooms.remove(this.rooms.children[i]);
		}

		this.bodies = [];
		this.rooms = new THREE.Group();
	}

	update = (delta) => {
		this.hero.update(delta);
	}

	collision = (event) => {
		event.pairs.forEach(pair => {
			const labelA = pair.bodyA.label;
			const labelB = pair.bodyB.label;

			if ((labelA === 'hero' && labelB === 'exit') || (labelA === 'exit' && labelB === 'hero')) {
				this.reset();
				this.game.setState(Game.STATE.SNAKE);
			}
		});
	}

	addWalls(position) {
		const walls = [
			{ x: 0, z: 1 },
			{ x: 0, z: -1 },
			{ x: 1, z: 0 },
			{ x: -1, z: 0 },
		];

		return walls.map(wall => {
			wall.x += position.x;
			wall.z += position.z;
			return wall;
		});
	}
}