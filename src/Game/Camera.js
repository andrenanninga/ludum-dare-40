import * as THREE from 'three';
import { random } from 'lodash';

export default class Camera extends THREE.PerspectiveCamera {
	static SPEED = 1;
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

		this.position.x += (snake.head.position.x - this.position.x) * Camera.SPEED * delta;
		this.position.y += (16 - this.position.y) * Camera.SPEED * delta;
		this.position.z += (snake.head.position.z - this.position.z + 6) * Camera.SPEED * delta;
		this.lookAt(new THREE.Vector3(this.position.x, 0, this.position.z - 6));
	}

	reset = () => {
		const snake = this.game.level.snake;
		
		this.position.x = snake.head.position.x;
		this.position.y = 16;
		this.position.z = snake.head.position.z + 6;
		this.tracking = true;
	}

	shake = (x, y) => {
		this.shaking.set(x, y);
	}
}