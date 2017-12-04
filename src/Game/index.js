import * as THREE from 'three';
import Stats from 'stats.js';
import Hammer from 'hammerjs';

import Camera from './Camera';
import Loader from './Loader';
import Level from './Level';

export default class Game {
	static DEBUG = false && process.env.NODE_ENV === 'development';

	static STATE = {
		BOOT: 'BOOT',
		INTRO: 'INTRO',
		SNAKE: 'SNAKE',
		DYING: 'DYING',
		EXITING: 'EXITING',
		GAMEOVER: 'GAMEOVER',
	}

	static KEYS = {
		'W': 87,
		'S': 83,
		'A': 65,
		'D': 68,
		'SPACE': 32,
	}

	constructor(container, ui) {
		this.scene = new THREE.Scene();

		this.ui = ui;
		this.hammer = new Hammer.Manager(container);
		this.hammer.add(new Hammer.Pan({ threshold: 0 }));
		this.state = Game.STATE.BOOT;

		this.camera = new Camera(this, 60, 1, 0.1, 1000);
		this.camera.position.set(0, 15, 7);
		this.camera.lookAt(new THREE.Vector3());

		this.clock = new THREE.Clock(true);
		this.loader = new Loader(this);

		this.renderer = new THREE.WebGLRenderer({ antialias: false });
		this.renderer.setClearColor(0x556270);
		this.renderer.setPixelRatio(window.devicePixelRatio);
		container.appendChild(this.renderer.domElement);

		this.keys = {};
		window.addEventListener('keydown', e => this.keys[e.keyCode] = true, false);
		window.addEventListener('keyup', e => this.keys[e.keyCode] = false, false);
		window.addEventListener('resize', this.resize);

		const zero = { x: 0, y: 0 };
		const direction = 0;

		this.hammer.on('pan', (e) => {
			const up = e.direction === Hammer.DIRECTION_UP && zero.y - e.deltaY > 20;
			const down = e.direction === Hammer.DIRECTION_DOWN && zero.y - e.deltaY < -20;
			const left = e.direction === Hammer.DIRECTION_LEFT && zero.x - e.deltaX > 20;
			const right = e.direction === Hammer.DIRECTION_RIGHT && zero.x - e.deltaX < -20;

			if (up || down || left || right) {
				zero.x = e.deltaX;
				zero.y = e.deltaY;
			}

			this.keys[Game.KEYS.W] = up;
			this.keys[Game.KEYS.S] = down;
			this.keys[Game.KEYS.A] = left;
			this.keys[Game.KEYS.D] = right;

			this.level.snake.updateDirection();
		});

		this.stats = new Stats();

		this.resize();
		this.create();
	}

	create = async () => {
		await this.loader.loadModel('wall', 'assets/models/wall');
		await this.loader.loadModel('snakeStart', 'assets/models/snake-head');
		await this.loader.loadModel('snakeCorridor', 'assets/models/snake-body-corridor');
		await this.loader.loadModel('snakeHealth', 'assets/models/snake-body-health');
		await this.loader.loadModel('snakeEnd', 'assets/models/snake-body');
		await this.loader.loadModel('snakeBody', 'assets/models/snake-body');
		await this.loader.loadModel('start', 'assets/models/start');
		await this.loader.loadModel('end', 'assets/models/end');
		await this.loader.loadModel('pillar', 'assets/models/pillar');
		await this.loader.loadModel('gem', 'assets/models/gem');
		await this.loader.loadModel('outline', 'assets/models/outline');
		
		this.loader.models.snakeStart.scale.set(0.5, 0.5, 0.5);
		this.loader.models.snakeCorridor.scale.set(0.5, 0.5, 0.5);
		this.loader.models.snakeEnd.scale.set(0.5, 0.5, 0.5);
		this.loader.models.snakeBody.scale.set(0.5, 0.5, 0.5);
		this.loader.models.wall.scale.set(0.16666, 0.16666, 0.16666);
		this.loader.models.pillar.scale.set(0.7, 0.7, 0.7);
		this.loader.models.gem.scale.set(0.7, 0.7, 0.7);

		this.loader.models.outline.children[0].material.transparent = true;

		this.level = new Level(this);
		this.scene.add(this.level);
		this.camera.reset();

		this.setState(Game.STATE.INTRO);
		this.update();
		this.ui.setState({ loading: false });
	}

	restart = () => {
		this.scene.remove(this.level);
		this.level = new Level(this);
		this.scene.add(this.level);

		this.ui.setState({
			score: 0,
			eaten: 0,
			lives: this.level.snake.lives,
			hearts: this.level.snake.hearts,
			hunger: this.level.snake.hunger,
		});

		this.level.snake.reset();
		this.camera.reset();
		this.setState(Game.STATE.SNAKE);
	}

	update = () => {
		this.stats.begin();
		const delta = this.clock.getDelta();
		const time = this.clock.getElapsedTime();

		this.level.update(delta, time);
		this.camera.update(delta, time);

		this.renderer.render(this.scene, this.camera);
		this.stats.end();
		requestAnimationFrame(this.update);
	}

	setState = (state) => {
		Object.keys(this.keys).forEach(code => this.keys[code] = false);

		this.state = state;
	}

	resize = () => {
		this.camera.aspect = window.innerWidth / window.innerHeight;
		this.camera.updateProjectionMatrix();
		this.renderer.setSize(window.innerWidth, window.innerHeight);
	}
}