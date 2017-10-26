import * as THREE from 'three';

export default class MATERIALS {

  static load ( STATE ) {

    // fill STATE.materials with all game sprites (i.e., lots of THREE.(some kind of material))
    // maybe in the format: {
    //     mat: THREE.(some kind of material)
    //    name: 'some name'
    // }

  	//loader

    let loader = new THREE.TextureLoader();
    console.log('testing testing testing');

  	//load materials

    STATE.loader.changeCount(1);

  	loader.load( 'resources/player/player.png',

    	function (texture) {

    		console.log(texture);
    		console.log('testing');

    		//map texture
    		//let temporary = new THREE.MeshLambertMaterial({ map: texture });

    		STATE.materials.mats['player'] = new THREE.MeshLambertMaterial({ map: texture });

        STATE.loader.changeCount(-1);

    	},
    	function (xhr) { console.log( (xhr.loaded / xhr.total * 100) + '% loaded' ); },
    	function (xhr) { console.log( 'error ' + xhr.status + ' ' + xhr.statusText); }
    );

  }

  static init (STATE) { }

}
