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
      textSet = new tileSet(texture, 8, 4, 3, 0, 1);

      STATE.materials.mats['playerR'] = new THREE.MeshLambertMaterial({ map: texture });
      STATE.materials.mats['playerR'].transparent = true;
      STATE.materials.mats['playerR'].magFilter = THREE.NearestFilter;

     });

    // load first texutre
    loader.load( 'resources/player/player.png',
    function (texture) {

      //texture settings
      textSet = new tileSet(texture, 8, 4, 3, -7, 1 );

      //flip horizontal
      texture.repeat.x = texture.repeat.x * -1;
      
      STATE.materials.mats['playerL'] = new THREE.MeshLambertMaterial({ map: texture });
      STATE.materials.mats['playerL'].transparent = true;
      STATE.materials.mats['playerL'].magFilter = THREE.NearestFilter;

     });


    // load first texutre
    loader.load( 'resources/player/player.png',
    function (texture) {

      //texture settings
      textSet = new tileSet(texture, 8, 4, 3, 6, 1);

      STATE.materials.mats['jumpUpR'] = new THREE.MeshLambertMaterial({ map: texture });
      STATE.materials.mats['jumpUpR'].transparent = true;
      STATE.materials.mats['jumpUpR'].magFilter = THREE.NearestFilter;

     });

    // load first texutre
    loader.load( 'resources/player/player.png',
    function (texture) {

      //texture settings
      textSet = new tileSet(texture, 8, 4, 3, -1, 1 );

      //flip horizontal
      texture.repeat.x = texture.repeat.x * -1;
      
      STATE.materials.mats['jumpUpL'] = new THREE.MeshLambertMaterial({ map: texture });
      STATE.materials.mats['jumpUpL'].transparent = true;
      STATE.materials.mats['jumpUpL'].magFilter = THREE.NearestFilter;

     });

    // load first texutre
    loader.load( 'resources/player/player.png',
    function (texture) {

      //texture settings
      textSet = new tileSet(texture, 8, 4, 3, 7, 1);

      STATE.materials.mats['jumpDownR'] = new THREE.MeshLambertMaterial({ map: texture });
      STATE.materials.mats['jumpDownR'].transparent = true;
      STATE.materials.mats['jumpDownR'].magFilter = THREE.NearestFilter;

     });

    // load first texutre
    loader.load( 'resources/player/player.png',
    function (texture) {

      //texture settings
      textSet = new tileSet(texture, 8, 4, 3, 0, 1 );

      //flip horizontal
      texture.repeat.x = texture.repeat.x * -1;
      
      STATE.materials.mats['jumpDownL'] = new THREE.MeshLambertMaterial({ map: texture });
      STATE.materials.mats['jumpDownL'].transparent = true;
      STATE.materials.mats['jumpDownL'].magFilter = THREE.NearestFilter;

     });

    // load first texutre
    loader.load( 'resources/player/player.png',
    function (texture) {

      //texture settings
      textSet = new tileSet(texture, 8, 4, 3, 1, 1);

      STATE.materials.mats['crouchR'] = new THREE.MeshLambertMaterial({ map: texture });
      STATE.materials.mats['crouchR'].transparent = true;
      STATE.materials.mats['crouchR'].magFilter = THREE.NearestFilter;

     });

    // load first texutre
    loader.load( 'resources/player/player.png',
    function (texture) {

      //texture settings
      textSet = new tileSet(texture, 8, 4, 3, -6, 1 );

      //flip horizontal
      texture.repeat.x = texture.repeat.x * -1;
      
      STATE.materials.mats['crouchL'] = new THREE.MeshLambertMaterial({ map: texture });
      STATE.materials.mats['crouchL'].transparent = true;
      STATE.materials.mats['crouchL'].magFilter = THREE.NearestFilter;

     });

    //load 2nd texture
    loader.load( 'resources/player/player.png',
    function (texture) {

      //texture settings
      textSet = new tileSet( texture, 8, 4, 0, 0, 8 );

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
      textSet = new tileSet( texture, 8, 4, 0, 1, 8 );

      STATE.materials.mats['runR'] = new THREE.MeshLambertMaterial({ map: texture });
      STATE.materials.mats['runR'].transparent = true;
      STATE.materials.mats['runR'].magFilter = THREE.NearestFilter;

    });

    // skybox background
    loader.load( 'resources/motherboard.png',
    function (texture) {

      //texture settings
      textSet = new tileSet(texture, 1, 1, 0, 1, 1 );
      //texture.repeat.set(1,1);
      STATE.materials.mats['skyBox'] = new THREE.MeshLambertMaterial({ map: texture, side: THREE.DoubleSide });


     });

    //sets dimensions and position of tiles
    function tileSet(texture, tilesHoriz, tilesVert, tileR, tileC, nTiles) {
      this.tilesHorizontal = tilesHoriz;
      this.tilesVertical = tilesVert;
      this.numOfTiles = nTiles;

      // bottom row = 0
      this.tileRow = tileR;
      
      // first col = 0
      this.tileCol = tileC;

      texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
      texture.repeat.set( 1 / this.tilesHorizontal, 1 / this.tilesVertical );
      texture.tileWidth = 1 / this.tilesHorizontal;
      texture.offset.y = this.tileRow * (1 / this.tilesVertical);
      texture.offset.x = this.tileCol * (1 / this.tilesHorizontal);
      texture.numTiles = this.numOfTiles;
      texture.tileCount = this.numOfTiles;
      texture.col = this.tileCol;
    }

    //end loading materials
    STATE.loader.changeCount(-1);

  }

  static init (STATE) {
  }

}
