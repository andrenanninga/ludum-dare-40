import * as THREE from 'three';
import Matter from 'matter-js';

import Game from './index';

export default class Physics {
	static SCALE = 32;

	constructor(game) {
		this.game = game;

		this.engine = Matter.Engine.create();
		this.engine.world.gravity = {
			x: 0,
			y: 0,
			scale: 0,
		};

		if (Game.DEBUG) {
			this.renderer = Matter.Render.create({
				element: document.body,
				engine: this.engine,
				options: {
					width: 480,
					height: 320,
					showVelocity: true,
					showAngleIndicator: true,
				},
			});

			this.renderer.canvas.style.position = 'absolute';
			this.renderer.canvas.style.bottom = '0px';
			this.renderer.canvas.style.right = '0px';

			Matter.Render.run(this.renderer);
		}
	}

	update = (delta) => {
		Matter.Engine.update(this.engine);

		if (Game.DEBUG) {
			const hero = this.game.scene.getObjectByName('hero');
			Matter.Render.lookAt(this.renderer, hero.body, { x: 5 * Physics.SCALE, y: 5 * Physics.SCALE }, true);
		}

		this.engine.world.bodies.forEach(body => {
			if (body.entity) {
				body.entity.position.x = body.position.x / Physics.SCALE;
				body.entity.position.z = body.position.y / Physics.SCALE;
			}
		});
	}

	addEntity(entity, options) {
		let body;

		if (entity.width && entity.height) {
			body = this.addRectangle(entity.position.x, entity.position.z, entity.width, entity.height, options);
		}
		else if (entity.radius) {
			body = this.addCircle(entity.position.x, entity.position.z, entity.radius, options);
		}
		else {
			throw new Error(`Unsure what kind of body to make for ${entity.name}`);
		}

		body.entity = entity;

		return body;
	}

	addCircle(x, y, radius, options) {
		const body = Matter.Bodies.circle(x * Physics.SCALE, y * Physics.SCALE, radius * Physics.SCALE, options);
		Matter.World.add(this.engine.world, body);

		return body;
	}

	addRectangle(x, y, width, height, options) {
		const body = Matter.Bodies.rectangle(x * Physics.SCALE, y * Physics.SCALE, width * Physics.SCALE, height * Physics.SCALE, options);
		Matter.World.add(this.engine.world, body);

		return body;
	}

	remove(body) {
		Matter.World.remove(this.engine.world, body);
	}
}
