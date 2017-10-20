import * as THREE from 'three';
import * as STATE from './state.js';

import PLAYER from './player.js';
import ENTITIES from './entities.js';
import WORLD from './world.js';

// Set up scene.

STATE.scene = new THREE.Scene();
STATE.scene.background = new THREE.Color( 0xffffff );

STATE.camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 1, 2000 );
STATE.camera.position.set( -75, 75, 300 );

STATE.clock = new THREE.Clock();

// Instantiate all game objects.

STATE.loader = new THREE.LoadingManager();
STATE.loader.onProgress = (item, loaded, total) => {
	console.log( item, loaded, total );
};

PLAYER.init(STATE);
WORLD.init(STATE);
ENTITIES.init(STATE);

// TEST lighting

let light = new THREE.AmbientLight( 0xaaaaaa );
STATE.scene.add( light );

let directionalLight = new THREE.DirectionalLight( 0xffeedd, 1.5 );
directionalLight.position.set( -2, 1, 1 );
STATE.scene.add( directionalLight );

// Renderer

let renderer = new THREE.WebGLRenderer();
renderer.setPixelRatio( window.devicePixelRatio );
renderer.setSize( window.innerWidth, window.innerHeight );

let container = document.getElementById('app');
container.appendChild( renderer.domElement );

// Controllers

window.addEventListener( 'resize', onWindowResize, false );
window.addEventListener( 'keydown', onKeyDown, false );
window.addEventListener( 'keyup', onKeyUp, false );

loop();

function loop() {

	let deltaTime = STATE.clock.getDelta();

	update(deltaTime);
	requestAnimationFrame( loop );
	render();

}

function update(deltaTime) {

	PLAYER.update(STATE, deltaTime);
	ENTITIES.update(STATE, deltaTime);
	WORLD.update(STATE, deltaTime);

}

function render() {
	renderer.render( STATE.scene, STATE.camera );
}

function onKeyDown(evt) {

	STATE.keyboard.keys[evt.keyCode] = {
		prev: STATE.keyboard[evt.keyCode] ? STATE.keyboard[evt.keyCode] : null,
		curr: 1
	};

}

function onKeyUp(evt) {

	STATE.keyboard.keys[evt.keyCode] = {
		prev: STATE.keyboard[evt.keyCode] ? STATE.keyboard[evt.keyCode] : null,
		curr: 0
	};

}

function onWindowResize() {

	STATE.camera.aspect = window.innerWidth / window.innerHeight;
	STATE.camera.updateProjectionMatrix();

	renderer.setSize( window.innerWidth, window.innerHeight );

}
