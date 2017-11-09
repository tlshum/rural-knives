import * as THREE from 'three';

export default class WORLD {

  static load ( STATE ) {

    STATE.loader.changeCount(1);

    let loader = new THREE.ObjectLoader();
    loader.load( 'resources/test_city/level.json', ( obj ) => {

      STATE.world = obj;
      STATE.world.scale.set(20, 20, 20);
      STATE.world.traverse ( (child) => {
        if (child instanceof THREE.Mesh) {
          child.castShadow = true;
          child.receiveShadow = true;
          for (let i = 0; i < child.material.length; i++) {
            child.material[i].map.magFilter = THREE.NearestFilter;
          }
        }
      });
      STATE.scene.add( STATE.world );
      STATE.loader.changeCount(-1);

    }, (xhr) => { // onProgress
      if (xhr.lengthComputable) {
        const percentComplete = xhr.loaded / xhr.total * 100;
        console.log( Math.round(percentComplete, 2) + '% downloaded' );
      }
    }, (xhr) => { // onError
      console.log('Error loading WORLD.');
    });


  }

  static init ( STATE ) { }

  static update ( STATE, deltaTime ) { }

}
