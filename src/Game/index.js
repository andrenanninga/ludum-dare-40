import * as THREE from 'three';
import OrbitControls from 'orbit-controls-es6';

import Physics from './Physics';
import Level from './Level';

export default class Game {
	static DEBUG = process.env.NODE_ENV === 'development';

	static STATE = {
		BOOT: 'BOOT',
		SNAKE: 'SNAKE',
		DUNGEON: 'DUNGEON',
	}

	static KEYS = {
		'W': 87,
		'S': 83,
		'A': 65,
		'D': 68,
	}

	constructor(container) {
		this.scene = new THREE.Scene();

		this.state = Game.STATE.BOOT;

		this.camera = new THREE.PerspectiveCamera(60, 1, 0.1, 1000);
		this.camera.position.set(0, 15, 7);
		this.camera.lookAt(new THREE.Vector3());

		this.clock = new THREE.Clock(true);
		this.physics = new Physics(this);

		this.renderer = new THREE.WebGLRenderer({ antialias: false });
		this.renderer.setClearColor(0xeeeeee);
		container.appendChild(this.renderer.domElement);

		this.keys = {};
		window.addEventListener('keydown', e => this.keys[e.keyCode] = true, false);
		window.addEventListener('keyup', e => this.keys[e.keyCode] = false, false);
		window.addEventListener('resize', this.resize);

		if (Game.DEBUG) {
			this.scene.add(new THREE.AxesHelper());
			this.controls = new OrbitControls(this.camera, this.renderer.domElement);
			this.controls.enabled = true;
			this.controls.maxDistance = 1500;
			this.controls.minDistance = 0;
		}

		this.level = new Level(this, 15, 15);
		this.scene.add(this.level);

		this.setState(Game.STATE.SNAKE);

		this.resize();
		this.update();
	}

	update = () => {
		const delta = this.clock.getDelta();

		this.physics.update(delta);
		this.level.update(delta);

		this.renderer.render(this.scene, this.camera);
		requestAnimationFrame(this.update);
	}

	setState = (state) => {
		this.state = state;
		this.level.updateState(state);
	}

	resize = () => {
		this.camera.aspect = window.innerWidth / window.innerHeight;
		this.camera.updateProjectionMatrix();
		this.renderer.setSize(window.innerWidth, window.innerHeight);
	}
}