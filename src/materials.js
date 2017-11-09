import * as THREE from 'three';

export default class MATERIALS {


  static load ( STATE ) {

    // texture settings
    var textSet;

    //loader
    let loader = new THREE.TextureLoader();

    //load materials
    STATE.loader.changeCount(1);

    // load first texutre
    loader.load( 'resources/player/player.png',
    function (texture) {

      //texture settings
      textSet = new tileSet(texture, 8, 4, 3 );

      STATE.materials.mats['playerR'] = new THREE.MeshLambertMaterial({ map: texture });
      STATE.materials.mats['playerR'].transparent = true;
      STATE.materials.mats['playerR'].magFilter = THREE.NearestFilter;

     });

    // load first texutre
    loader.load( 'resources/player/player.png',
    function (texture) {

      //texture settings
      textSet = new tileSet(texture, 8, 4, 3 );

      //flip horizontal
      texture.repeat.x = texture.repeat.x * -1;
      texture.offset.x = 1/8;
      STATE.materials.mats['playerL'] = new THREE.MeshLambertMaterial({ map: texture });
      STATE.materials.mats['playerL'].transparent = true;
      STATE.materials.mats['playerL'].magFilter = THREE.NearestFilter;

     });

    //load 2nd texture
    loader.load( 'resources/player/player.png',
    function (texture) {

      //texture settings
      textSet = new tileSet( texture, 8, 4, 0 );

      //flip horizontal
      texture.repeat.x = texture.repeat.x * -1;
      STATE.materials.mats['runL'] = new THREE.MeshLambertMaterial({ map: texture });
      STATE.materials.mats['runL'].transparent = true;
      STATE.materials.mats['runL'].magFilter = THREE.NearestFilter;

     });

    //load 3rd texture
    loader.load( 'resources/player/player.png',
    function (texture) {

      //texture settings
      textSet = new tileSet( texture, 8, 4, 0 );

      STATE.materials.mats['runR'] = new THREE.MeshLambertMaterial({ map: texture });
      STATE.materials.mats['runR'].transparent = true;
      STATE.materials.mats['runR'].magFilter = THREE.NearestFilter;

    });

    //sets dimensions and position of tiles
    function tileSet(texture, tilesHoriz, tilesVert, tileR) {
      this.tilesHorizontal = tilesHoriz;
      this.tilesVertical = tilesVert;

      // bottom row = 0
      this.tileRow = tileR;

      texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
      texture.repeat.set( 1 / this.tilesHorizontal, 1 / this.tilesVertical );
      texture.tileWidth = 1 / this.tilesHorizontal;
      texture.offset.y = this.tileRow * (1 / this.tilesVertical);
    }

    //end loading materials
    STATE.loader.changeCount(-1);

  }

  static init (STATE) {
  }

}
