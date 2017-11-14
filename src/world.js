import * as THREE from 'three';
import axios from 'axios';

export default class WORLD {

  static load ( STATE ) {

    STATE.loader.changeCount(1);

    axios.get('resources/test_city/level.txt')
      .then( (response) => { //response.data
        STATE.collision = {}
        STATE.collision.map = []
        const data = response.data.split("\n")
        STATE.collision.offset = 100
        for (var i = 0; i < data.length; ++i) {
          if (data[i].charAt(0) == '#') {
            continue;
          }
          var line = data[i].split(" ");
          if (line[1] == 4) {
            if (typeof STATE.collision.map[parseInt(line[0]) + STATE.collision.offset] === "undefined") {
              STATE.collision.map[parseInt(line[0]) + STATE.collision.offset] = [];
            }
            STATE.collision.map[parseInt(line[0]) + STATE.collision.offset][parseInt(line[2]) + STATE.collision.offset] = true;
          }
        }
        STATE.collision.trans = {x: -140, y: -135};
        STATE.collision.scale = 20;
        console.log(STATE.collision.map);
      });


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
