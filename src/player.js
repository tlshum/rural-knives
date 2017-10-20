import * as THREE from 'three';

export default class PLAYER {

  static init ( STATE ) {

    // Instantiate all player properties (eg. acceleration, state, etc.)

    let geo = new THREE.PlaneGeometry( 20, 32 );
    let mat = new THREE.MeshBasicMaterial( { color: 0xff0000 } );
    let obj = new THREE.Mesh( geo, mat );
    obj.position.set( -150, 50, 25 );

    STATE.player = {
      obj: obj
    };

    // Add player to scene.
    STATE.scene.add( STATE.player.obj );

  }

  static update ( STATE, deltaTime ) {

    // left
    if (STATE.keyboard.getKey(37) === 1) {
      STATE.player.obj.position.x -= 75 * deltaTime;
    }

    // Up
    if (STATE.keyboard.getKey(38) === 1) {
      STATE.player.obj.position.y += 75 * deltaTime;
    }

    // Right
    if (STATE.keyboard.getKey(39) === 1) {
      STATE.player.obj.position.x += 75 * deltaTime;
    }

    // Down
    if (STATE.keyboard.getKey(40) === 1) {
      STATE.player.obj.position.y -= 75 * deltaTime;
    }

    // Use the above the modify player state.

    // Check for collisions, respond appropriately.

    // Adjust camera as necessary.
    STATE.camera.position.set(
      STATE.player.obj.position.x,
      STATE.player.obj.position.y + 25,
      300
    );

  }

}
