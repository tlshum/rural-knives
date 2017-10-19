import * as THREE from 'three';

var container;
var camera, scene, renderer;
var mouseX, mouseY;

var gltf;
var object;

var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;

init();
animate();

function init() {

	container = document.getElementById('app');
	document.body.appendChild( container );

	// stage

	camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 1, 2000 );
	camera.position.x = -75;
  camera.position.y = 75;
	camera.position.z = 300;

	scene = new THREE.Scene();
  scene.background = new THREE.Color( 0xffffff );

	// lights

  var light = new THREE.AmbientLight( 0xaaaaaa );
  scene.add( light );

	var directionalLight = new THREE.DirectionalLight( 0xffeedd, 1.5 );
	directionalLight.position.set( -2, 1, 1 );
	scene.add( directionalLight );

  // loading manager

	var manager = new THREE.LoadingManager();
	manager.onProgress = function ( item, loaded, total ) {
		console.log( item, loaded, total );
	};

	var onProgress = function ( xhr ) {
		if ( xhr.lengthComputable ) {
			var percentComplete = xhr.loaded / xhr.total * 100;
			console.log( Math.round(percentComplete, 2) + '% downloaded' );
		}
	};
	var onError = function ( xhr ) { };

	// model

  var loader = new THREE.ObjectLoader ( manager );
  loader.load( 'resources/test_level/level.json', function ( obj ) {

    object = obj;
    object.scale.set(20, 20, 20);

    scene.add( object );

  }, onProgress, onError );

	// renderer

	renderer = new THREE.WebGLRenderer();
	renderer.setPixelRatio( window.devicePixelRatio );
	renderer.setSize( window.innerWidth, window.innerHeight );
	container.appendChild( renderer.domElement );

	// listeners

	document.addEventListener( 'mousemove', onDocumentMouseMove, false );
	window.addEventListener( 'resize', onWindowResize, false );

}

function onWindowResize() {

	windowHalfX = window.innerWidth / 2;
	windowHalfY = window.innerHeight / 2;

	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();

	renderer.setSize( window.innerWidth, window.innerHeight );

}

function onDocumentMouseMove( event ) {

	mouseX = ( event.clientX - windowHalfX ) / 2;
	mouseY = ( event.clientY - windowHalfY ) / 2;

}

//

function animate() {

	requestAnimationFrame( animate );
	render();

}

function render() {

	renderer.render( scene, camera );

}
