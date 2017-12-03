import * as THREE from 'three';
import path from 'path';

import OBJLoader from './OBJLoader';
import MTLLoader from './MTLLoader';

export default class Loader {
	constructor(game) {
		this.game = game;

		this.models = {};
	}

	loadModel = async (name, url) => {
		console.log(`Load ${name} model from ${url}`);
		const mtl = path.join(path.dirname(url), `${path.basename(url)}.mtl`);
		const obj = path.join(path.dirname(url), `${path.basename(url)}.obj`);

		const manager = new THREE.LoadingManager();
		const mtlLoader = new MTLLoader(manager);
		const objLoader = new OBJLoader(manager);
		console.log(objLoader);

		console.log(`Load material from ${mtl}`);
		const materials = await new Promise(resolve => mtlLoader.load(mtl, resolve));
		materials.baseUrl = `${path.dirname(url)}/`;
		materials.preload();

		Object.keys(materials.materials).forEach(key => {
			const phong = materials.materials[key];
			const material = new THREE.MeshBasicMaterial({
				map: phong.map,
			});

			if (material.map) {
				material.map.magFilter = THREE.NearestFilter;
				material.map.minFilter = THREE.NearestMipMapLinearFilter;
			}

			materials.materials[key] = material;
		});

		console.log(`Load object from ${obj}`);
		objLoader.setMaterials(materials);
		const model = await new Promise(resolve => objLoader.load(obj, resolve));

		console.log(`Finished loading ${name}`);
		this.models[name] = model;
	}
}
