import * as THREE from 'three';
import * as STATE from './state.js';
import Stats from 'stats.js';

import PLAYER from './player.js';
import ENTITIES from './entities.js';
import WORLD from './world.js';
import MATERIALS from './materials.js';
import SOUNDS from './sounds.js';

// Set up scene.

STATE.scene = new THREE.Scene();
STATE.scene.background = new THREE.Color( 0xffffff );

STATE.camera = new THREE.PerspectiveCamera( 55, window.innerWidth / window.innerHeight, 1, 2000 );
STATE.camera.rotation.x = -(Math.PI*0.1);
STATE.camera.position.set( -75, 75, 300 );

STATE.clock = new THREE.Clock();

STATE.stats = new Stats();

// Instantiate all game objects.

STATE.loadingManager = new THREE.LoadingManager();
STATE.loadingManager.onProgress = (item, loaded, total) => {
	console.log( item, loaded, total );
};

STATE.loader.finishedLoading = loaded;

PLAYER.load(STATE);
WORLD.load(STATE);
ENTITIES.load(STATE);
MATERIALS.load(STATE);
SOUNDS.load(STATE);

function loaded () {

	PLAYER.init(STATE);
	WORLD.init(STATE);
	ENTITIES.init(STATE);
	MATERIALS.init(STATE);
	SOUNDS.init(STATE);

	// TEST lighting

	let light = new THREE.AmbientLight( 0x555555 );
	STATE.scene.add( light );

	let directionalLight = new THREE.DirectionalLight( 0xddeedd, 1.75 );
	directionalLight.position.set( -500, 200, 300 );
	directionalLight.castShadow = true;

	directionalLight.shadow.mapSize.width = 512;
	directionalLight.shadow.mapSize.height = 512;

	directionalLight.shadow.camera.near = 0.5;
	directionalLight.shadow.camera.far = 1500;
	directionalLight.shadow.camera.left = -250;
	directionalLight.shadow.camera.bottom = -250;
	directionalLight.shadow.camera.right = 250;
	directionalLight.shadow.camera.top = 250;

	STATE.scene.add( directionalLight );

	// Renderer

	STATE.renderer = new THREE.WebGLRenderer();
	STATE.renderer.setPixelRatio( window.devicePixelRatio );
	STATE.renderer.setSize( window.innerWidth, window.innerHeight );
	STATE.renderer.shadowMap.enabled = true;
	STATE.renderer.shadowMap.type = THREE.PCFShadowMap;

	STATE.stats.showPanel( 0 );
	document.body.appendChild( STATE.stats.dom );

	STATE.container = document.getElementById('app');
	STATE.container.appendChild( STATE.renderer.domElement );

	// Controllers

	window.addEventListener( 'resize', onWindowResize, false );
	window.addEventListener( 'keydown', onKeyDown, false );
	window.addEventListener( 'keyup', onKeyUp, false );

	loop();

}

function loop() {

	let deltaTime = STATE.clock.getDelta();

	STATE.stats.begin();
		update(deltaTime);
		render();
	STATE.stats.end();

	requestAnimationFrame( loop );

}

function update(deltaTime) {

	PLAYER.update(STATE, deltaTime);
	ENTITIES.update(STATE, deltaTime);
	WORLD.update(STATE, deltaTime);
	STATE.keyboard.update( deltaTime );

}

function render() {
	STATE.renderer.render( STATE.scene, STATE.camera );
}

function onKeyDown(evt) {

	if (STATE.keyboard.keys[evt.keyCode] === 0)
		STATE.keyboard.keys[evt.keyCode] = 1;

}

function onKeyUp(evt) {

	STATE.keyboard.keys[evt.keyCode] = 0;

}

function onWindowResize() {

	STATE.camera.aspect = window.innerWidth / window.innerHeight;
	STATE.camera.updateProjectionMatrix();

	renderer.setSize( window.innerWidth, window.innerHeight );

}
