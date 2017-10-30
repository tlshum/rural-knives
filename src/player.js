import * as THREE from 'three';

export default class PLAYER {

  static load ( STATE ) { }

  static init ( STATE ) {

    // Instantiate all player properties (eg. acceleration, state, etc.)

    let geo = new THREE.BoxBufferGeometry( 20, 32, 1);
    let mat = STATE.materials.get('player');
    mat.transparent = true;
    let obj = new THREE.Mesh( geo, mat );
    console.log(this.obj);
    obj.position.set( -150, 50, 75 );
    obj.castShadow = true;

    STATE.player = {
      obj: obj,
      xspeed: 0,
      acc: 3,
      frc: 7,
      fastfrc: 12,
      max: 150,
      baseheight: obj.position.y
    };
     
    // Add player to scene.
    STATE.scene.add( STATE.player.obj );
    console.log(STATE.player.obj);
  }

  static update ( STATE, deltaTime ) {
    
    var keyDown = false
    STATE.player.obj.material = STATE.materials.get('player');
    
    // left
    if (STATE.keyboard.isPressed(37)) {
      animator('runL');
      //STATE.player.obj.position.x -= 100 * deltaTime;
      if (STATE.player.xspeed > 0) {
        STATE.player.xspeed -= STATE.player.fastfrc
      } else if (STATE.player.xspeed > STATE.player.max * -1) {
        STATE.player.xspeed -= STATE.player.acc
      }
      keyDown = true
    }

    // Up
    if (STATE.keyboard.isPressed(38)) {
      STATE.player.obj.position.y += 100 * deltaTime;
    }

    // Right
    if (STATE.keyboard.isPressed(39)) {
      animator('runR');
      if (STATE.player.xspeed < 0) {
        STATE.player.xspeed += STATE.player.fastfrc
      } else if (STATE.player.xspeed < STATE.player.max) {
        STATE.player.xspeed += STATE.player.acc
      }
      keyDown = true
    }

    // Down
    if (STATE.keyboard.isPressed(40)) {
      STATE.player.obj.position.y -= 100 * deltaTime;
    }

    // Space
    if (STATE.keyboard.startPressed(32)) {
      STATE.sounds.play('test');
    }

    //animation function
    function animator(st) {
	
      STATE.player.obj.material = STATE.materials.get(st); 
      STATE.materials.ctime += 1000 * deltaTime;
	
      while (STATE.materials.ctime > 75) {
        STATE.materials.ctime -= 75;
		if (STATE.player.obj.material.map.offset.x >= 1){
          STATE.player.obj.material.map.offset.x = STATE.player.obj.material.map.tileWidth;
        }
        else {
          STATE.player.obj.material.map.offset.x += STATE.player.obj.material.map.tileWidth;
        }
      }
    }

    if (!keyDown) {
      if (STATE.player.xspeed < 0) {
        if (STATE.player.xspeed < STATE.player.frc * -1) {
          STATE.player.xspeed += STATE.player.frc
        } else {
          STATE.player.xspeed = 0
        }
      } else {
        if (STATE.player.xspeed > STATE.player.frc) {
          STATE.player.xspeed -= STATE.player.frc
        } else {
          STATE.player.xspeed = 0
        }
      }
    }

    STATE.player.obj.position.x += STATE.player.xspeed * deltaTime

    // Use the above the modify player state.


    // Use the above the modify player state.
    
    // Check for collisions, respond appropriately.

    // Adjust camera as necessary.
    STATE.camera.position.set(
      STATE.player.obj.position.x,
      STATE.player.obj.position.y + 75,
      300
    );

  }

}
