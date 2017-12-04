import * as THREE from 'three';
import axios from 'axios';

import GLTFLoader from 'three-gltf2-loader';
GLTFLoader(THREE);

export default class WORLD {

  static load ( STATE ) {

    STATE.loader.changeCount(1);

    //axios.get('resources/test_city/level.txt')
    axios.get('resources/level/level.txt')
      .then( (response) => { //response.data
        STATE.collision = {}
        STATE.collision.map = []
        const data = response.data.split("\n")
        //STATE.collision.offset = 100 //test_city
        STATE.collision.offset = 400
        for (var i = 0; i < data.length; ++i) {
          if (data[i].charAt(0) == '#') {
            continue;
          }
          var line = data[i].split(" ");
          if (line[1] == 8) {
            if (typeof STATE.collision.map[parseInt(line[0]) + STATE.collision.offset] === "undefined") {
              STATE.collision.map[parseInt(line[0]) + STATE.collision.offset] = [];
            }
            STATE.collision.map[parseInt(line[0]) + STATE.collision.offset][parseInt(line[2]) + STATE.collision.offset] = true;
          }
        }
        //STATE.collision.trans = {x: -140, y: -135}; //test_city
        STATE.collision.trans = {x: -139, y: -135};
        STATE.collision.scale = 20;
        console.log(STATE.collision.map);
      });

      console.log(THREE);

    let loader = new THREE.GLTFLoader();
    //loader.load( 'resources/test_city/level.json', ( obj ) => {
    loader.load( 'resources/level/level.gltf', ( gltf ) => {

      for (let i = 0; i < gltf.scene.children.length; i++) {
        let obj = gltf.scene.children[i];
        obj.scale.set(20, 20, 20);
        obj.traverse( (child) => {
          if (child instanceof THREE.Mesh) {
            child.castShadow = true;
            child.receiveShadow = true;
            if (Array.isArray(child.material)) {
              for (let i = 0; i < child.material.length; i++) {
                if (typeof child.material[i].map !== "undefined" &&
                  typeof child.material[i].map.magFilter !== "undefined") {
                  child.material[i].map.magFilter = THREE.NearestFilter;
                }
              }
            } else {
              if (child.material.map != null &&
                typeof child.material.map.magFilter !== "undefined") {
                child.material.map.magFilter = THREE.NearestFilter;
              }
            }
          }
        });
        console.log(obj);
        STATE.scene.add( obj );

        /*
        STATE.world = obj;
        STATE.world.scale.set(20, 20, 20);
        STATE.world.traverse ( (child) => {
          if (child instanceof THREE.Mesh) {
            child.castShadow = true;
            child.receiveShadow = true;
            if (Array.isArray(child.material)) {
              for (let i = 0; i < child.material.length; i++) {
                if (typeof child.material[i].map !== "undefined" &&
                  typeof child.material[i].map.magFilter !== "undefined") {
                  child.material[i].map.magFilter = THREE.NearestFilter;
                }
              }
            } else {
              if (child.material.map != null &&
                typeof child.material.map.magFilter !== "undefined") {
                child.material.map.magFilter = THREE.NearestFilter;
              }
            }
          }
        });

        STATE.scene.add( STATE.world );
        */
      }

      STATE.loader.changeCount(-1);

    }, (xhr) => { // onProgress
      if (xhr.lengthComputable) {
        const percentComplete = xhr.loaded / xhr.total * 100;
        console.log( Math.round(percentComplete, 2) + '% downloaded' );
      }
    }, (xhr) => { // onError
      console.log('Error loading WORLD.');
      console.log(xhr);
    });


  }

  static init ( STATE ) { }

  static update ( STATE, deltaTime ) { }

}
