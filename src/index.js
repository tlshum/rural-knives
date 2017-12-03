import * as THREE from 'three';
import { EffectComposer, Bokeh2Pass, GlitchPass, GlitchMode, RenderPass } from 'postprocessing';
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
STATE.scene.background = new THREE.Color( 0x000000 );

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

WORLD.load(STATE);
ENTITIES.load(STATE);
MATERIALS.load(STATE);
SOUNDS.load(STATE);
PLAYER.load(STATE);

function loaded () {

    WORLD.init(STATE);
    ENTITIES.init(STATE);
    MATERIALS.init(STATE);
    SOUNDS.init(STATE);
    PLAYER.init(STATE);

    // TEST lighting

    let light = new THREE.AmbientLight( 0x555555 );
    STATE.scene.add( light );

    STATE.directionalLight = new THREE.DirectionalLight( 0xddeedd, 1.75 );
    //STATE.directionalLight.position.set( -500, 200, 300 );
    STATE.directionalLight.target = STATE.player.obj;
    STATE.directionalLight.castShadow = true;

    STATE.directionalLight.shadow.mapSize.width = 1024;
    STATE.directionalLight.shadow.mapSize.height = 1024;

    STATE.directionalLight.shadow.camera.near = 0.5;
    STATE.directionalLight.shadow.camera.far = 1500;
    STATE.directionalLight.shadow.camera.left = -350;
    STATE.directionalLight.shadow.camera.bottom = -350;
    STATE.directionalLight.shadow.camera.right = 350;
    STATE.directionalLight.shadow.camera.top = 350;

    STATE.scene.add( STATE.directionalLight );

    //skybox
    let geometry = new THREE.CubeGeometry( 8000, 2000, 2000 );
    let cmat = STATE.materials.get('skyCube');
    let cubeMaterials =
    [
      //new THREE.MeshBasicMaterial( { color: 0x00FF00, side: THREE.DoubleSide }),
      STATE.materials.get('skyBox'),
      STATE.materials.get('skyBox'),
      STATE.materials.get('skyBox'),
      STATE.materials.get('skyBox'),
      STATE.materials.get('skyBox'),
      STATE.materials.get('skyBox')
    ];

    let cube = new THREE.Mesh( geometry, cubeMaterials );
    cube.position.x = -3200;
    STATE.scene.add( cube );

    // Renderer

    STATE.renderer = new THREE.WebGLRenderer({ alpha: true });
    STATE.renderer.setPixelRatio( window.devicePixelRatio );
    STATE.renderer.setSize( window.innerWidth, window.innerHeight );
    STATE.renderer.shadowMap.enabled = true;
    STATE.renderer.shadowMap.type = THREE.PCFShadowMap;

    STATE.composer = new EffectComposer(STATE.renderer, { depthBuffer: true, depthTexture: true });
    STATE.passes = [];

    STATE.passes[0] = new RenderPass(STATE.scene, STATE.camera);
    STATE.passes[0].renderToScreen = true;
    STATE.composer.addPass(STATE.passes[0]);

    STATE.passes[1] = new Bokeh2Pass(STATE.camera, {
        rings: 6,
        samples: 1,
        showFocus: false,
        manualDoF: false,
        vignette: true,
        pentagon: false,
        shaderFocus: true,
        noise: false
    });
    STATE.passes[1].bokehMaterial.uniforms.focalStop.value = 1;
    STATE.passes[1].bokehMaterial.uniforms.focalDepth.value = 0.1;
    STATE.passes[1].bokehMaterial.uniforms.focusCoords.value.x = 0.5;
    STATE.passes[1].bokehMaterial.uniforms.focusCoords.value.y = 0.5;
    STATE.passes[1].bokehMaterial.uniforms.maxBlur.value = 1.5;
    STATE.passes[1].bokehMaterial.uniforms.bias.value = 0;
    STATE.passes[1].bokehMaterial.uniforms.fringe.value = 0;
    STATE.passes[1].bokehMaterial.uniforms.ditherStrength.value = 0;
    STATE.passes[1].bokehMaterial.uniforms.luminanceThreshold.value = 0;
    STATE.passes[1].bokehMaterial.uniforms.luminanceGain.value = 0;
    STATE.passes[1].renderToScreen = false;
    // STATE.composer.addPass(STATE.passes[1]);

    STATE.passes[2] = new GlitchPass();
    STATE.passes[2].mode = GlitchMode.CONSTANT_MILD;
    STATE.passes[2].renderToScreen = false;
    STATE.composer.addPass(STATE.passes[2]);

    // let gui = new dat.GUI();

    STATE.stats.showPanel( 0 );
    document.body.appendChild( STATE.stats.dom );

    STATE.container = document.getElementById('app');
    STATE.container.appendChild( STATE.renderer.domElement );

    // Controllers

    window.addEventListener( 'resize', onWindowResize, false );
    window.addEventListener( 'keydown', onKeyDown, false );
    window.addEventListener( 'keyup', onKeyUp, false );

    // Music
    STATE.sounds.play('music');

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
    if (deltaTime > 0.02) {
      deltaTime = 0.02;
    }
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

    if (typeof STATE.keyboard.keys[evt.keyCode] === "undefined" || STATE.keyboard.keys[evt.keyCode] === 0)
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
