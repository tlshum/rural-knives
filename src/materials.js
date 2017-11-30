import * as THREE from 'three';

export default class MATERIALS {

  static load ( STATE ) {

    // loader
    let loader = new THREE.TextureLoader();

    // Sets dimensions and position of tiles
    function tileSet(texture, tilesHoriz, tilesVert, tileR, tileC, nTiles) {
      texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
      texture.repeat.set( 1 / tilesHoriz, 1 / tilesVert );
      texture.tileWidth = 1 / tilesHoriz;
      texture.offset.y = tileR * (1 / tilesVert);
      texture.offset.x = tileC * (1 / tilesHoriz);
      texture.numTiles = nTiles;
      texture.tileCount = nTiles;
      texture.col = tileC;
    }

    // playerR
    STATE.loader.changeCount(1);
    loader.load( 'resources/player/player.png',
    function (texture) {
      tileSet(texture, 8, 4, 3, 0, 1);
      STATE.materials.mats['playerR'] = new THREE.MeshLambertMaterial({ map: texture });
      STATE.materials.mats['playerR'].transparent = true;
      STATE.materials.mats['playerR'].magFilter = THREE.NearestFilter;
      STATE.loader.changeCount(-1);
    });

    // playerL
    STATE.loader.changeCount(1);
    loader.load( 'resources/player/player.png',
    function (texture) {
      tileSet(texture, 8, 4, 3, 1, 1 );
      texture.repeat.x = texture.repeat.x * -1; // flip horizontal
      STATE.materials.mats['playerL'] = new THREE.MeshLambertMaterial({ map: texture });
      STATE.materials.mats['playerL'].transparent = true;
      STATE.materials.mats['playerL'].magFilter = THREE.NearestFilter;
      STATE.loader.changeCount(-1);
    });

    // runR
    STATE.loader.changeCount(1);
    loader.load( 'resources/player/player.png',
    function (texture) {
      tileSet(texture, 8, 4, 0, 0, 8);
      STATE.materials.mats['runR'] = new THREE.MeshLambertMaterial({ map: texture });
      STATE.materials.mats['runR'].transparent = true;
      STATE.materials.mats['runR'].magFilter = THREE.NearestFilter;
      STATE.loader.changeCount(-1);
    });

    // runL
    STATE.loader.changeCount(1);
    loader.load( 'resources/player/player.png',
    function (texture) {
      tileSet(texture, 8, 4, 0, 0, 8 );
      texture.repeat.x = texture.repeat.x * -1; // flip horizontal
      STATE.materials.mats['runL'] = new THREE.MeshLambertMaterial({ map: texture });
      STATE.materials.mats['runL'].transparent = true;
      STATE.materials.mats['runL'].magFilter = THREE.NearestFilter;
      STATE.loader.changeCount(-1);
    });

    // kickR
    STATE.loader.changeCount(1);
    loader.load( 'resources/player/player.png',
    function (texture) {
      tileSet(texture, 8, 4, 1, 1, 1);
      STATE.materials.mats['kickR'] = new THREE.MeshLambertMaterial({ map: texture });
      STATE.materials.mats['kickR'].transparent = true;
      STATE.materials.mats['kickR'].magFilter = THREE.NearestFilter;
      STATE.loader.changeCount(-1);
     });

    // kickL
    STATE.loader.changeCount(1);
    loader.load( 'resources/player/player.png',
    function (texture) {
      tileSet(texture, 8, 4, 1, 2, 1 );
      texture.repeat.x = texture.repeat.x * -1; // flip horizontal
      STATE.materials.mats['kickL'] = new THREE.MeshLambertMaterial({ map: texture });
      STATE.materials.mats['kickL'].transparent = true;
      STATE.materials.mats['kickL'].magFilter = THREE.NearestFilter;
      STATE.loader.changeCount(-1);
     });

    // dashUpR
    STATE.loader.changeCount(1);
    loader.load( 'resources/player/player.png',
    function (texture) {
      tileSet(texture, 8, 4, 2, 2, 1);
      STATE.materials.mats['dashUpR'] = new THREE.MeshLambertMaterial({ map: texture });
      STATE.materials.mats['dashUpR'].transparent = true;
      STATE.materials.mats['dashUpR'].magFilter = THREE.NearestFilter;
      STATE.loader.changeCount(-1);
     });

    // dashUpL
    STATE.loader.changeCount(1);
    loader.load( 'resources/player/player.png',
    function (texture) {
      tileSet(texture, 8, 4, 2, 3, 1 );
      texture.repeat.x = texture.repeat.x * -1; // flip horizontal
      STATE.materials.mats['dashUpL'] = new THREE.MeshLambertMaterial({ map: texture });
      STATE.materials.mats['dashUpL'].transparent = true;
      STATE.materials.mats['dashUpL'].magFilter = THREE.NearestFilter;
      STATE.loader.changeCount(-1);
     });

    // downR
    STATE.loader.changeCount(1);
    loader.load( 'resources/player/player.png',
    function (texture) {
      tileSet(texture, 8, 4, 3, 7, 1);
      STATE.materials.mats['downR'] = new THREE.MeshLambertMaterial({ map: texture });
      STATE.materials.mats['downR'].transparent = true;
      STATE.materials.mats['downR'].magFilter = THREE.NearestFilter;
      STATE.loader.changeCount(-1);
     });

    // downL
    STATE.loader.changeCount(1);
    loader.load( 'resources/player/player.png',
    function (texture) {
      tileSet(texture, 8, 4, 3, 0, 1 );
      texture.repeat.x = texture.repeat.x * -1; // flip horizontal
      STATE.materials.mats['downL'] = new THREE.MeshLambertMaterial({ map: texture });
      STATE.materials.mats['downL'].transparent = true;
      STATE.materials.mats['downL'].magFilter = THREE.NearestFilter;
      STATE.loader.changeCount(-1);
     });

    // jumpR
    STATE.loader.changeCount(1);
    loader.load( 'resources/player/player.png',
    function (texture) {
      tileSet( texture, 8, 4, 2, 5, 1 );
      STATE.materials.mats['jumpR'] = new THREE.MeshLambertMaterial({ map: texture });
      STATE.materials.mats['jumpR'].transparent = true;
      STATE.materials.mats['jumpR'].magFilter = THREE.NearestFilter;
      STATE.loader.changeCount(-1);
     });

    // jumpL
    STATE.loader.changeCount(1);
    loader.load( 'resources/player/player.png',
    function (texture) {
      tileSet( texture, 8, 4, 2, 6, 1 );
      texture.repeat.x = texture.repeat.x * -1; // flip horizontal
      STATE.materials.mats['jumpL'] = new THREE.MeshLambertMaterial({ map: texture });
      STATE.materials.mats['jumpL'].transparent = true;
      STATE.materials.mats['jumpL'].magFilter = THREE.NearestFilter;
      STATE.loader.changeCount(-1);
    });

    // dashR
    STATE.loader.changeCount(1);
    loader.load( 'resources/player/player.png',
    function (texture) {
      tileSet( texture, 8, 4, 3, 6, 1 );
      STATE.materials.mats['dashR'] = new THREE.MeshLambertMaterial({ map: texture });
      STATE.materials.mats['dashR'].transparent = true;
      STATE.materials.mats['dashR'].magFilter = THREE.NearestFilter;
      STATE.loader.changeCount(-1);
     });

    // dashL
    STATE.loader.changeCount(1);
    loader.load( 'resources/player/player.png',
    function (texture) {
      tileSet( texture, 8, 4, 3, 7, 1 );
      texture.repeat.x = texture.repeat.x * -1; // flip horizontal
      STATE.materials.mats['dashL'] = new THREE.MeshLambertMaterial({ map: texture });
      STATE.materials.mats['dashL'].transparent = true;
      STATE.materials.mats['dashL'].magFilter = THREE.NearestFilter;
      STATE.loader.changeCount(-1);
    });

    // Skybox Background
    STATE.loader.changeCount(1);
    loader.load( 'resources/motherboard.png',
    function (texture) {
      tileSet(texture, 1, 1, 0, 1, 1 );
      // texture.repeat.set(1,1);
      STATE.materials.mats['skyBox'] = new THREE.MeshLambertMaterial({ map: texture, side: THREE.DoubleSide });
      STATE.loader.changeCount(-1);
     });

  }

  static init (STATE) {
  }

}
