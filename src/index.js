import * as THREE from 'three';
import { EffectComposer, Bokeh2Pass, RenderPass } from 'postprocessing';
import dat from 'dat.gui/build/dat.gui.js';
import Stats from 'stats.js';


import * as STATE from './state.js';
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

    //skybox
    var geometry = new THREE.CubeGeometry( 5000, 2000, 2000 );
    let cmat = STATE.materials.get('skyCube');
    var cubeMaterials = 
    [
      //new THREE.MeshBasicMaterial( { color: 0x00FF00, side: THREE.DoubleSide }),
      STATE.materials.get('skyBox'),
      STATE.materials.get('skyBox'),
      STATE.materials.get('skyBox'),
      STATE.materials.get('skyBox'),
      STATE.materials.get('skyBox'),
      STATE.materials.get('skyBox')
    ];

    var cube = new THREE.Mesh( geometry, cubeMaterials );
    STATE.scene.add( cube );

    // Renderer

    STATE.renderer = new THREE.WebGLRenderer();
    STATE.renderer.setPixelRatio( window.devicePixelRatio );
    STATE.renderer.setSize( window.innerWidth, window.innerHeight );
    STATE.renderer.shadowMap.enabled = true;
    STATE.renderer.shadowMap.type = THREE.PCFShadowMap;

    STATE.composer = new EffectComposer(STATE.renderer, { depthTexture: true });
    STATE.composer.addPass(new RenderPass(STATE.scene, STATE.camera));

    let pass = new Bokeh2Pass(STATE.camera, {
        rings: 6,
        samples: 1,
        showFocus: false,
        manualDoF: false,
        vignette: true,
        pentagon: false,
        shaderFocus: true,
        noise: false
    });
    pass.bokehMaterial.uniforms.focalStop.value = 1;
    pass.bokehMaterial.uniforms.focalDepth.value = 0.1;
    pass.bokehMaterial.uniforms.focusCoords.value.x = 0.5;
    pass.bokehMaterial.uniforms.focusCoords.value.y = 0.5;
    pass.bokehMaterial.uniforms.maxBlur.value = 1.5;
    pass.bokehMaterial.uniforms.bias.value = 0;
    pass.bokehMaterial.uniforms.fringe.value = 0;
    pass.bokehMaterial.uniforms.ditherStrength.value = 0;
    pass.bokehMaterial.uniforms.luminanceThreshold.value = 0;
    pass.bokehMaterial.uniforms.luminanceGain.value = 0;
    pass.renderToScreen = true;
    STATE.composer.addPass(pass);

    // let gui = new dat.GUI();

    STATE.stats.showPanel( 0 );
    document.body.appendChild( STATE.stats.dom );

    STATE.container = document.getElementById('app');
    STATE.container.appendChild( STATE.renderer.domElement );

    // Controllers

    window.addEventListener( 'resize', onWindowResize, false );
    window.addEventListener( 'keydown', onKeyDown, false );
    window.addEventListener( 'keyup', onKeyUp, false );

    // Test voice commands

    if (annyang) {
        let commands = {
            'please respond': function() {
                let msg = new SpeechSynthesisUtterance();
          msg.text = "Hello Jonathan.";
          window.speechSynthesis.speak(msg);
            },
            'default message': function() {
                let msg = new SpeechSynthesisUtterance();
          msg.text = "Hello, CMPS 115-02. I hope you are having a nice day.";
          window.speechSynthesis.speak(msg);
            },
            'thank you': function() {
                let msg = new SpeechSynthesisUtterance();
          msg.text = "You are very welcome.";
          window.speechSynthesis.speak(msg);
            }
        };
        annyang.addCommands(commands);
        annyang.start();
    }

    loop();

}

function loop() {

    let deltaTime = STATE.clock.getDelta();

    STATE.stats.begin();
        update(deltaTime);
        render(deltaTime);
    STATE.stats.end();

    requestAnimationFrame( loop );

}

function update(deltaTime) {

    PLAYER.update(STATE, deltaTime);
    ENTITIES.update(STATE, deltaTime);
    WORLD.update(STATE, deltaTime);
    STATE.keyboard.update( deltaTime );

}

function render(deltaTime) {
    STATE.composer.render(deltaTime);
}

function onKeyDown(evt) {

    if (typeof STATE.keyboard.keys[evt.keyCode] !== "undefined" || STATE.keyboard.keys[evt.keyCode] === 0)
        STATE.keyboard.keys[evt.keyCode] = 1;

}

function onKeyUp(evt) {

    STATE.keyboard.keys[evt.keyCode] = 0;

}

function onWindowResize() {

    STATE.camera.aspect = window.innerWidth / window.innerHeight;
    STATE.camera.updateProjectionMatrix();

    STATE.renderer.setSize( window.innerWidth, window.innerHeight );

}
