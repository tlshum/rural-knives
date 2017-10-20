import * as THREE from 'three';

export default class WORLD {

  static init ( STATE ) {

    let loader = new THREE.ObjectLoader( STATE.loader );
    loader.load( 'resources/test_level/level.json', ( obj ) => {
      STATE.world = obj;
      STATE.world.scale.set(20, 20, 20);
      STATE.scene.add( STATE.world );
    }, (xhr) => { // onProgress
      if (xhr.lengthComputable) {
        const percentComplete = xhr.loaded / xhr.total * 100;
        console.log( Math.round(percentComplete, 2) + '% downloaded' );
      }
    }, (xhr) => { // onError
      console.log('Error loading WORLD.');
    });

  }

  static update ( STATE, deltaTime ) {

    // Probably nothing?

  }

}
