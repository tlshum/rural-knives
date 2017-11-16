import * as THREE from 'three';

export default class PLAYER {

  static load ( STATE ) { }

  static init ( STATE ) {

    // Instantiate all player properties (eg. acceleration, state, etc.)

    let geo = new THREE.BoxBufferGeometry( 23, 25, 0.01);
    let mat = STATE.materials.get('playerR');
    mat.transparent = true;
    let obj = new THREE.Mesh( geo, mat );
    console.log(this.obj);
    obj.position.set( 0, 50, 75 );
    //obj.position.set( -150, 50, 75 );
    obj.castShadow = true;

    STATE.player = {
      obj: obj,
      xspeed: 0,
      acc: 3,
      frc: 7,
      fastfrc: 12,
      max: 150,
      jumpStateOld: -1,
      jumpState: -1,
      /* 0 = neutral state, can jump
       * 1 = in jumping state, up button held down
       * 2 = in jumping state, up button not held down
       * 3 = falling state, can't jump
       * 4 = neutral, can't jump
       * 5 = in jumping state, no up button, on wall
       * 6 = in falling state, on wall
       * 7 = kick (ground)
       * 8 = kick (air)
       */
      direction: 1,
      /* 0 = left
       * 1 = right
       */
      vely: 0
    };
     
    // Add player to scene.
    STATE.scene.add( STATE.player.obj );
    console.log(STATE.player.obj);
  }

  static update ( STATE, deltaTime ) {
    
    if (STATE.player.jumpStateOld != STATE.player.jumpState)  {
      console.log("Jump State = " + STATE.player.jumpState);
    }
    STATE.player.jumpStateOld = STATE.player.jumpState;

    var lrKeyDown = false;
    var upKeyDown = false;
    var wall = false;
    
    //player facing last direction
    if (STATE.materials.faceLeft == true) {
      STATE.player.obj.material = STATE.materials.get('playerL');
    }
    else {
      STATE.player.obj.material = STATE.materials.get('playerR');
    }


if (STATE.player.jumpState != 7) {
    // left
    if (STATE.keyboard.isPressed(37)) {
      STATE.player.direction = 0;
      animator('runL');
      STATE.materials.faceLeft = true;
      if (STATE.player.xspeed > 0) {
        STATE.player.xspeed -= STATE.player.fastfrc
      } else if (STATE.player.xspeed > STATE.player.max * -1) {
        STATE.player.xspeed -= STATE.player.acc
      }
      lrKeyDown = true
      STATE.player.obj.position.x -= 100 * deltaTime;
    }

    // Right
    if (STATE.keyboard.isPressed(39)) {
      STATE.player.direction = 1;
      animator('runR');
      STATE.materials.faceLeft = false;
      if (STATE.player.xspeed < 0) {
        STATE.player.xspeed += STATE.player.fastfrc
      } else if (STATE.player.xspeed < STATE.player.max) {
        STATE.player.xspeed += STATE.player.acc
      }
      lrKeyDown = true
      STATE.player.obj.position.x += 100 * deltaTime;
    }
}

    // Up
    if (STATE.keyboard.isPressed(38)) {
      upKeyDown = true
    }


    // Down
    if (STATE.keyboard.isPressed(40)) {
      STATE.player.obj.position.y -= 100 * deltaTime;
    }

    // Space
    if (STATE.keyboard.startPressed(32)) {
      STATE.sounds.play('test');
    }

    // Z
    if (STATE.keyboard.startPressed(90)) {
      if (STATE.player.jumpState != 7 && STATE.player.jumpState != 8) {
        if (STATE.player.direction == 1) {
          STATE.player.xspeed = 300;
          STATE.player.jumpState = 7;
        } else {
          STATE.player.xspeed = -300;
          STATE.player.jumpState = 7;
        }
        console.log("dash")
      }
    }

    //animation function
    function animator(st) {
    
      STATE.player.obj.material = STATE.materials.get(st); 
      STATE.materials.ctime += 1000 * deltaTime;
      

      while (STATE.materials.ctime > 75) {
        STATE.materials.ctime -= 75;
        if (STATE.player.obj.material.map.tileCount > 1){
          STATE.player.obj.material.map.offset.x += STATE.player.obj.material.map.tileWidth;
          STATE.player.obj.material.map.tileCount -= 1;
        } else {
          STATE.player.obj.material.map.offset.x = STATE.player.obj.material.map.col * STATE.player.obj.material.map.tileWidth;
          STATE.player.obj.material.map.tileCount = STATE.player.obj.material.map.numTiles;
        }
      }
    }

    if (!lrKeyDown) {
      if (STATE.player.xspeed < 0) {
        if (STATE.player.xspeed < STATE.player.frc * -1) {
          STATE.player.xspeed += STATE.player.frc;
        } else {
          STATE.player.xspeed = 0;
        }
      } else {
        if (STATE.player.xspeed > STATE.player.frc) {
          STATE.player.xspeed -= STATE.player.frc;
        } else {
          STATE.player.xspeed = 0;
        }
      }
    }

    if (STATE.player.jumpState == 4 && !upKeyDown) {
      STATE.player.jumpState = 0;
    } else if (STATE.player.jumpState == 0 && upKeyDown) {
      STATE.player.vely = 300;
      STATE.player.jumpState = 1;
    } else if (STATE.player.jumpState == 1 && !upKeyDown) {
      STATE.player.jumpState = 2;
    } else if (STATE.player.jumpState == 7) {
      if (STATE.player.xspeed < STATE.player.max && STATE.player.xspeed > (STATE.player.max * -1)) {
        STATE.player.jumpState = 0;
        console.log("dash end")
      }
    }
    

    if (STATE.player.vely < 0) {
      if (STATE.player.jumpState == 1 || STATE.player.jumpState == 2) {
        STATE.player.jumpState = 3;
      } else if (STATE.player.jumpState == 5) {
        STATE.player.jumpState = 6;
      }
    }

    if (STATE.player.jumpState == -1) {
      STATE.player.vely = -100 * deltaTime;
    } else if (STATE.player.jumpState == 0) {
      STATE.player.vely = -18000 * deltaTime;
    } else if (STATE.player.jumpState == 1) {
      STATE.player.vely -= 700 * deltaTime; //TODO fix hardcode
    } else if (STATE.player.jumpState == 2 || STATE.player.jumpState == 5) {
      STATE.player.vely -= 900 * deltaTime; //TODO fix hardcode
    } else if (STATE.player.jumpState == 3 || STATE.player.jumpState == 6) {
      STATE.player.vely -= 900 * deltaTime;
    } else if (STATE.player.jumpState == 7) {
      if (STATE.player.direction == 1) {
        STATE.player.xspeed -= STATE.player.fastfrc * deltaTime;
      } else {
        STATE.player.xspeed += STATE.player.fastfrc * deltaTime;
      }
    }

    STATE.player.obj.position.x += STATE.player.xspeed * deltaTime
    STATE.player.obj.position.y += STATE.player.vely * deltaTime

    var collide = false;

    for (var i = 0; i < STATE.collision.map.length; ++i) {
      if (typeof STATE.collision.map[i] !== "undefined") {
        for (var j = 0; j < STATE.collision.map[i].length; ++j) {
          if (STATE.collision.map[i][j]) {
            const rect1 = {x:      STATE.player.obj.position.x,
                           y:      STATE.player.obj.position.y,
                           width:  23,
                           height: 25};
            const rect2 = {x:      ((i - STATE.collision.offset) * STATE.collision.scale) + STATE.collision.trans.x,
                           y:      ((j - STATE.collision.offset) * STATE.collision.scale) + STATE.collision.trans.y,
                           width:  STATE.collision.scale,
                           height: STATE.collision.scale};
            if (rect1.x < rect2.x + rect2.width &&
                rect1.x + rect1.width > rect2.x &&
                rect1.y < rect2.y + rect2.height &&
                rect1.height + rect1.y > rect2.y) {
              collide = true;
              const wy = (rect1.width + rect2.width) * (rect1.y - rect2.y);
              const hx = (rect1.height + rect2.height) * (rect1.x - rect2.x);

              if (wy > hx) {
                if (wy > -hx) {
                  //top
                  if (!STATE.collision.map[i][j+1]) {
                    STATE.player.obj.position.y = rect2.y + (rect2.height * 0.5) + (rect1.height * 0.5)/* - 2.4*/; //TODO fix hack
                    STATE.player.jumpState = 0;
                  }
                  break;
                } else {
                  //left
                  if (STATE.player.xspeed < 0) {
                    console.log("left 1")
                    if (STATE.player.vely < 0) {
                    STATE.player.obj.position.y = rect2.y + (rect2.height * 0.5) + (rect1.height * 0.5)/* - 2.4*/; //TODO fix hack
                    } else if (STATE.player.vely > 0) {
                    STATE.player.obj.position.y = rect2.y - (rect2.height * 0.5) - (rect1.height * 0.5);
                    }
                  } else if (!STATE.collision.map[i-1][j]) { // TODO don't check index i - 1 if i = 0
                    STATE.player.obj.position.x = rect2.x - (rect2.width * 0.5) - (rect1.width * 0.5);
                    if (STATE.player.vely > 0 && STATE.player.jumpState != 5 && STATE.player.jumpState != 6) {
                      STATE.player.vely += STATE.player.xspeed;
                      STATE.player.xspeed = 0;
                      STATE.player.jumpState = 5
                    } else if (STATE.player.vely < 0 && STATE.player.jumpState != 5 && STATE.player.jumpState != 6) {
                      STATE.player.vely -= STATE.player.xspeed;
                      STATE.player.xspeed = 0;
                      STATE.player.jumpState = 6
                    }
                  }
                  console.log("left");
                  wall = true;
                }
                break;
              } else {
                if (wy > -hx) {
                  //right
                  if (STATE.player.xspeed > 0) {
                    if (STATE.player.vely < 0) {
                    STATE.player.obj.position.y = rect2.y + (rect2.height * 0.5) + (rect1.height * 0.5)/* - 2.4*/; //TODO fix hack
                    } else if (STATE.player.vely > 0) {
                    STATE.player.obj.position.y = rect2.y - (rect2.height * 0.5) - (rect1.height * 0.5);
                    }
                  } else if (!STATE.collision.map[i+1][j]) { // TODO don't check index i + 1 if i > max size
                    STATE.player.obj.position.x = rect2.x + (rect2.width * 0.5) + (rect1.width * 0.5);
                    if (STATE.player.vely > 0 && STATE.player.jumpState != 5 && STATE.player.jumpState != 6) {
                      STATE.player.vely -= STATE.player.xspeed;
                      STATE.player.xspeed = 0;
                      STATE.player.jumpState = 5
                    } else if (STATE.player.vely < 0 && STATE.player.jumpState != 5 && STATE.player.jumpState != 6) {
                      STATE.player.vely += STATE.player.xspeed;
                      STATE.player.xspeed = 0;
                      STATE.player.jumpState = 6
                    }
                  }
                  console.log("right");
                  break;
                } else {
                  //bottom
                  if (STATE.player.xspeed > 0) {
                    if (STATE.player.vely < 0) {
                    STATE.player.obj.position.y = rect2.y + (rect2.height * 0.5) + (rect1.height * 0.5)/* - 2.4*/; //TODO fix hack
                    } else if (STATE.player.vely > 0) {
                    STATE.player.obj.position.y = rect2.y - (rect2.height * 0.5) - (rect1.height * 0.5);
                    }
                  } else if (!STATE.collision.map[i][j-1]) {
                    STATE.player.obj.position.y = rect2.y - (rect2.height * 0.5) - (rect1.height * 0.5);
                    if (STATE.player.vely > 0) {
                      STATE.player.vely = STATE.player.vely * -0.5;
                      STATE.player.xspeed = STATE.player.xspeed * 0.75;
                    }
                  }
                  break;
                }
              }
            }
          }
        }
      }
    }


    if (!collide && STATE.player.jumpState != -1 && STATE.player.jumpState != 7 && STATE.player.jumpState != 8) {
      STATE.player.jumpState = 3;
    } else if (!wall) {
      if (STATE.player.jumpState == 5) {
        STATE.player.jumpState == 2;
      } else if (STATE.player.jumpState == 6) {
        STATE.player.jumpState == 3;
      }
    }

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
