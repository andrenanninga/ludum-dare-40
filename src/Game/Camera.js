import * as THREE from 'three';
import { random } from 'lodash';

import Game from './index';

export default class Camera extends THREE.PerspectiveCamera {
	static SPEED = 1.5;
	static DAMPING = 0.9;

	constructor(game, fov, aspect, near, far) {
		super(fov, aspect, near, far);

		this.game = game;
		this.shaking = new THREE.Vector2(0, 0);
		this.tracking = true;
	}

	update = (delta) => {
		const snake = this.game.level.snake;

		this.position.x += random(0, this.shaking.x, true);
		this.position.z += random(0, this.shaking.y, true);;
		
		this.shaking.multiplyScalar(Camera.DAMPING).multiplyScalar(-1);

		if (!this.tracking) {
			return;
		}

		const zoom = this.game.state === Game.STATE.INTRO ? 4 : 1;

		this.position.x += (snake.head.position.x - this.position.x) * Camera.SPEED * delta;
		this.position.y += ((16 / zoom) - this.position.y) * Camera.SPEED * delta;
		this.position.z += (snake.head.position.z - this.position.z + (6 / zoom)) * Camera.SPEED * delta;
		this.lookAt(new THREE.Vector3(this.position.x, 0, this.position.z - (6 / zoom)));
	}

	reset = () => {
		const snake = this.game.level.snake;
		
		const zoom = this.game.state === Game.STATE.INTRO ? 4 : 1;

		this.position.x = snake.head.position.x;
		this.position.y = 16 / zoom;
		this.position.z = snake.head.position.z + (6 / zoom);
		this.lookAt(new THREE.Vector3(this.position.x, 0, this.position.z - (6 / zoom)));
		this.tracking = true;
	}

	shake = (x, y) => {
		this.shaking.set(x, y);
	}
}