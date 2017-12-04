import * as THREE from 'three';

export default class PLAYER {

  static load ( STATE ) { }

  static init ( STATE ) {

    // Instantiate all player properties (eg. accel_ground_xeleration, state, etc.)

    let geo = new THREE.BoxBufferGeometry( 23, 25, 0.01);
    let mat = STATE.materials.get('playerR');
    let obj = new THREE.Mesh( geo, mat );
    obj.customDepthMaterial = STATE.materials.dget('playerR');
    //obj.position.set( -2880, -495, -10 );
    obj.position.set( -6840, -495, -10 );
    obj.castShadow = true;

    STATE.player = {
      obj: obj,
      velocity_x: 0, //positive value = moving right
      velocity_y: 0, //positive value = moving up
      accel_ground_x: 5,
      accel_air_x: 10,
      friction_x: 7,
      fast_friction_x: 12,
      max_velocity_x: 150,
      jump_state_old: -1,
      jump_state: -1,
      jump_states: {
        INIT_STATE: -1,
        NEUTRAL_STATE: 0,
        JUMP_STATE_UP_BUTTON: 1,
        JUMP_STATE_NO_UP_BUTTON: 2,
        FALL_STATE: 3,
        JUMP_STATE_WALL: 4,
        FALL_STATE_WALL: 5,
        DASH_STATE_GROUND: 6,
        DASH_STATE_AIR: 7,
        FREEZE: 8
      },
      /* 0 = neutral state, can jump
       * 1 = in jumping state, up button held down
       * 2 = in jumping state, up button not held down
       * 3 = falling state, can't jump
       * 4 = neutral, can't jump
       * 5 = in jumping state, no up button, on touching_wall
       * 6 = in falling state, on touching_wall
       * 7 = kick (ground)
       * 8 = kick (air)
       */
      direction: 1,
      directions: {
        LEFT: 0,
        RIGHT: 1,
      },
      kick_state: false,
      dash: {
        count: 0,
        timeout: 0,
        has_kicked_in_air: false,
        max_distance: 4000,
        remaining_x_distance: 0,
        remaining_y_distance: 0,
        old_jump_state: null,
        old_velocity_x: 0,
        old_velocity_y: 0
      },
      hurt: {
        state: false,
        invuln: false,
        invuln_time: 0
      },
      health: 100,
      game_over: false
    };

    // Add player to scene.
    STATE.scene.add( STATE.player.obj );
    //console.log(STATE.player.obj);
    //console.log(STATE.sounds.pool['steps']);
  }

  static print_state(STATE) {
    switch (STATE.player.jump_state) {
      case STATE.player.jump_states.INIT_STATE:
        console.log("Init State");
        break;
      case STATE.player.jump_states.NEUTRAL_STATE:
        console.log("Neutral State, can jump");
        break;
      case STATE.player.jump_states.JUMP_STATE_UP_BUTTON:
        console.log("Jump State, with up pressed");
        break;
      case STATE.player.jump_states.JUMP_STATE_NO_UP_BUTTON:
        console.log("Jump State, with up not pressed");
        break;
      case STATE.player.jump_states.FALL_STATE:
        console.log("Fall State");
        break;
      case STATE.player.jump_states.JUMP_STATE_WALL:
        console.log("Jump State, touching wall");
        break;
      case STATE.player.jump_states.FALL_STATE_WALL:
        console.log("Fall State, touching wall");
        break;
      case STATE.player.jump_states.DASH_STATE_GROUND:
        console.log("Dash state, on ground");
        break;
      case STATE.player.jump_states.DASH_STATE_AIR:
        console.log("Dash state, in air");
        break;
    }
  }

  static exit_dash(STATE) {
    if (STATE.player.jump_state == STATE.player.jump_states.DASH_STATE_GROUND) {
      STATE.player.dash.timeout = 0.25;
    }
    if (STATE.player.velocity_x > 0) {
      STATE.player.velocity_x = 0.7 * STATE.player.max_velocity_x;
    } else if (STATE.player.velocity_x < 0) {
      STATE.player.velocity_x = -0.7 * STATE.player.max_velocity_x;
    }
    if (STATE.player.velocity_y > 0) {
      STATE.player.velocity_y = 300;
    } else if (STATE.player.velocity_y < 0) {
      STATE.player.velocity_y = -300;
    }
    if (STATE.player.velocity_y > 0) {
      STATE.player.jump_state = STATE.player.jump_states.JUMP_STATE_UP_BUTTON;
    } else {
      STATE.player.jump_state = STATE.player.jump_states.FALL_STATE;
    }
    STATE.player.dash.old_velocity_x = 0;
    STATE.player.dash.old_velocity_y = 0;
  }

  static exit_invuln(STATE) {
    STATE.player.hurt.invuln_time = 0;
    STATE.player.hurt.invuln = false;
    STATE.passes[0].renderToScreen = true;
    STATE.passes[2].renderToScreen = false;
  }

  static freeze_game(STATE) {
    if (STATE.player.kick_state) {
      STATE.player.kick_state = false;
    }
    PLAYER.exit_dash(STATE);
    STATE.player.jump_state = STATE.player.jump_states.FREEZE;
    STATE.player.velocity_y = 0;
    STATE.player.velocity_x = 0;
    STATE.sounds.stop('steps');
  }

  static update ( STATE, deltaTime ) {

    if (STATE.player.jump_state != STATE.player.jump_states.FREEZE) {
      if (STATE.player.jump_state_old != STATE.player.jump_state)  {
        //PLAYER.print_state(STATE);
      }
      STATE.player.jump_state_old = STATE.player.jump_state;

      if (STATE.player.dash.count_old != STATE.player.dash.count) {
        //console.log("Dash count is " + STATE.player.dash.count);
      }
      STATE.player.dash.count_old = STATE.player.dash.count;

      var left_key_down = false;
      var right_key_down = false;
      var up_key_begin_pressed = false;
      var up_key_down = false;
      var down_key_down = false;
      var shift_key_begin_pressed = false;
      var z_key_begin_pressed = false;

      //player facing last direction
      if (STATE.materials.faceLeft == true) {
        STATE.player.obj.material = STATE.materials.get('playerL');
      }
      else {
        STATE.player.obj.material = STATE.materials.get('playerR');
      }


      if (!STATE.player.game_over ||
          STATE.player.jump_state == STATE.player.jump_states.FREEZE) {
        // left
        if (STATE.keyboard.isPressed(37)) {
          left_key_down = true;
        }

        // Right
        if (STATE.keyboard.isPressed(39)) {
          right_key_down = true;
        }

        // Up
        if (STATE.keyboard.startPressed(38)) {
          up_key_begin_pressed = true;
        }
        if (STATE.keyboard.isPressed(38)) {
          up_key_down = true;
        }

        // Down
        if (STATE.keyboard.isPressed(40)) {
          down_key_down = true;
        }

        // Space
        if (STATE.keyboard.startPressed(32)) {
          STATE.sounds.play('test');
        }

        // Z
        if (STATE.keyboard.startPressed(90)) {
          z_key_begin_pressed = true;
        }

        // Shift
        if (STATE.keyboard.startPressed(16)) {
          shift_key_begin_pressed = true;
        }
      }

      //animation function
      function animator(st) {

        STATE.player.obj.material = STATE.materials.get(st);
        STATE.player.obj.customDepthMaterial = STATE.materials.dget(st);
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



       /* Pre-movement Misc. Behaviors */
      //
      //In left & right key down, don't let any left/right_key_down events trigger if currently kicking on ground.
      //Also, don't update direction or animate running.
      if (left_key_down) {
        if (!STATE.player.kick_state && !STATE.player.hurt.state) {
          if (STATE.player.jump_state == STATE.player.jump_states.NEUTRAL_STATE) {
            STATE.sounds.play('steps');
          }
          STATE.player.direction = STATE.player.directions.LEFT;
          animator('runL');
          STATE.materials.faceLeft = true;
        }/* else {
          left_key_down = false;
        }
        */
      }

      if (right_key_down) {
        if (!STATE.player.kick_state && !STATE.player.hurt.state) {
          if (STATE.player.jump_state == STATE.player.jump_states.NEUTRAL_STATE) {
            STATE.sounds.play('steps');
          }
          STATE.player.direction = STATE.player.directions.RIGHT;
          animator('runR');
          STATE.materials.faceLeft = false;
        }/* else {
          left_key_down = false;
        }
        */
      }

      if ((!left_key_down && !right_key_down) ||
           STATE.player.jump_state != STATE.player.jump_states.NEUTRAL_STATE) {
        STATE.sounds.stop('steps');
      }

      if (z_key_begin_pressed) {
        if (STATE.player.kick_state) {
          z_key_begin_pressed = false;
        }
      }

      // Show kick sprite.
      if (STATE.player.kick_state) {
        if (STATE.player.direction == STATE.player.directions.RIGHT) {
          animator('kickR');
        } else {
          animator('kickL');
        }
      } else if
        (STATE.player.jump_state == STATE.player.jump_states.JUMP_STATE_UP_BUTTON ||
        STATE.player.jump_state == STATE.player.jump_states.JUMP_STATE_NO_UP_BUTTON ||
        STATE.player.jump_state == STATE.player.jump_states.JUMP_STATE_WALL) {
          if (STATE.player.direction == STATE.player.directions.RIGHT) {
            animator('jumpR');
          } else {
            animator('jumpL');
          }
      } else if
        (STATE.player.jump_state == STATE.player.jump_states.FALL_STATE ||
        STATE.player.jump_state == STATE.player.jump_states.FALL_STATE_WALL) {
          if (STATE.player.direction == STATE.player.directions.RIGHT) {
            animator('downR');
          } else {
            animator('downL');
          }
      } else if
        (STATE.player.jump_state == STATE.player.jump_states.DASH_STATE_AIR ||
        STATE.player.jump_state == STATE.player.jump_states.DASH_STATE_GROUND) {
          if (STATE.player.velocity_y > 0) {
            if (STATE.player.direction == STATE.player.directions.RIGHT) {
              animator('dashUpR');
            } else {
              animator('dashUpL');
            }
          } else if (STATE.player.velocity_y == 0) {
            if (STATE.player.direction == STATE.player.directions.RIGHT) {
              animator('dashR');
            } else {
              animator('dashL');
            }
          } else {
            if (STATE.player.direction == STATE.player.directions.RIGHT) {
              animator('downR');
            } else {
              animator('downL');
            }
          }
      }

      if (STATE.player.dash.timeout > 0) {
        if (deltaTime > STATE.player.dash.timeout) {
          STATE.player.dash.timeout = 0;
        } else {
          STATE.player.dash.timeout -= deltaTime;
        }
      }

      if (STATE.player.hurt.state) {
        if (STATE.player.jump_state == STATE.player.jump_states.NEUTRAL_STATE) {
          STATE.player.hurt.state = false;
        }
      }

      if (STATE.player.hurt.invuln) {
        STATE.player.hurt.invuln_time -= deltaTime;
        if (STATE.player.hurt.invuln_time <= 0) {
          STATE.player.hurt.invuln = false;
          STATE.player.hurt.invuln_time = 0;
          STATE.passes[0].renderToScreen = true;
          STATE.passes[2].renderToScreen = false;
        }
      }

      /* */


       /* State Switching */
      //
      switch (STATE.player.jump_state) {
        //While in Neutral w/ Jump, pressing UP will set velocity to 300 and go to Jump w/ UP Button
        case STATE.player.jump_states.NEUTRAL_STATE:
          STATE.player.dash.count = 0;
          STATE.player.dash.has_kicked_in_air = false;
          if (up_key_begin_pressed) {
            STATE.player.velocity_y = 300;
            STATE.player.jump_state = STATE.player.jump_states.JUMP_STATE_UP_BUTTON;
            STATE.sounds.play('jump');
            STATE.player.check_landing = 1;
            STATE.player.kick_state = false;
          }
          break;
        //While in Jump w/ UP button, as soon as up key is let go, swith to Jump w/ No UP Button
        case STATE.player.jump_states.JUMP_STATE_UP_BUTTON:
          if (!up_key_down) {
            STATE.player.jump_state = STATE.player.jump_states.JUMP_STATE_NO_UP_BUTTON;
          }
          break;
      }

      //exit kick state after slowing down to a certain velociy
      if (STATE.player.kick_state &&
          STATE.player.velocity_x < (STATE.player.max_velocity_x * 0.2) &&
          STATE.player.velocity_x > (STATE.player.max_velocity_x * -0.2)) {
        STATE.player.kick_state = false;
      }

      //Transitioning to falling states from jumping states
      if (STATE.player.velocity_y < 0) {
        switch (STATE.player.jump_state) {
          case STATE.player.jump_states.JUMP_STATE_UP_BUTTON:
          case STATE.player.jump_states.JUMP_STATE_NO_UP_BUTTON:
            STATE.player.jump_state = STATE.player.jump_states.FALL_STATE;
            break;
          case STATE.player.jump_states.JUMP_STATE_WALL:
            STATE.player.jump_state = STATE.player.jump_states.FALL_STATE_WALL;
        }
      }

      //If kicking while in the air, force assumption that a dash had been made before
      if ((
           STATE.player.jump_state == STATE.player.jump_states.JUMP_STATE_UP_BUTTON ||
           STATE.player.jump_state == STATE.player.jump_states.JUMP_STATE_NO_UP_BUTTON ||
           STATE.player.jump_state == STATE.player.jump_states.JUMP_STATE_WALL
          ) &&
          STATE.player.kick_state &&
          STATE.player.dash.count == 0) {
        STATE.player.dash.count = 1;
      }

      //If person is not touching ground, disable shift from being recognized if not kicked yet
      if (
          (
           (
            STATE.player.jump_state == STATE.player.jump_states.JUMP_STATE_UP_BUTTON ||
            STATE.player.jump_state == STATE.player.jump_states.JUMP_STATE_NO_UP_BUTTON ||
            STATE.player.jump_state == STATE.player.jump_states.FALL_STATE ||
            STATE.player.jump_state == STATE.player.jump_states.JUMP_STATE_WALL ||
            STATE.player.jump_state == STATE.player.jump_states.FALL_STATE_WALL
           ) && !STATE.player.dash.has_kicked_in_air &&
           STATE.player.dash.count > 0
          ) ||
          (
           STATE.player.jump_state == STATE.player.jump_states.NEUTRAL_STATE &&
           //!up_key_down &&
           STATE.player.dash.timeout > 0
          )
         ) {
        shift_key_begin_pressed = false;
      }

      //Switch to DASH state if conditions met
      if (shift_key_begin_pressed && STATE.player.dash.count < 2 &&
        STATE.player.jump_state != STATE.player.jump_states.DASH_STATE_GROUND &&
        STATE.player.jump_state != STATE.player.jump_states.DASH_STATE_AIR) {
        STATE.player.dash.old_jump_state = STATE.player.jump_state;
        STATE.player.dash.old_velocity_x = STATE.player.velocity_x;
        STATE.player.dash.old_velocity_y = STATE.player.velocity_y;
        STATE.sounds.play('dash');
        if ((up_key_down && STATE.player.jump_state == STATE.player.jump_states.NEUTRAL_STATE) ||
            (
             STATE.player.jump_state == STATE.player.jump_states.JUMP_STATE_UP_BUTTON ||
             STATE.player.jump_state == STATE.player.jump_states.JUMP_STATE_NO_UP_BUTTON ||
             STATE.player.jump_state == STATE.player.jump_states.FALL_STATE ||
             STATE.player.jump_state == STATE.player.jump_states.JUMP_STATE_WALL ||
             STATE.player.jump_state == STATE.player.jump_states.FALL_STATE_WALL
            )
           ) {
          STATE.player.jump_state = STATE.player.jump_states.DASH_STATE_AIR;
          ++STATE.player.dash.count;
        } else {
          STATE.player.jump_state = STATE.player.jump_states.DASH_STATE_GROUND;
        }
        if (right_key_down) {
          STATE.player.dash.remaining_x_distance = STATE.player.dash.max_distance;
        }
        if (left_key_down) {
          STATE.player.dash.remaining_x_distance = -1 * STATE.player.dash.max_distance;
        }
        if (up_key_down) {
          STATE.player.dash.remaining_y_distance = STATE.player.dash.max_distance;
        }
        if (down_key_down && STATE.player.jump_state == STATE.player.jump_states.DASH_STATE_AIR) {
          STATE.player.dash.remaining_y_distance = -1 * STATE.player.dash.max_distance;
        }
        if (!(left_key_down || right_key_down || up_key_down || down_key_down)) {
          if (STATE.player.direction == STATE.player.directions.RIGHT) {
            STATE.player.dash.remaining_x_distance = STATE.player.dash.max_distance;
          } else {
            STATE.player.dash.remaining_x_distance = -1 * STATE.player.dash.max_distance;
          }
        }
        STATE.player.kick_state = false;
        STATE.player.hurt.state = false;
      }

      //Exit code for if no longer DASHING
      if ((STATE.player.jump_state == STATE.player.jump_states.DASH_STATE_GROUND ||
           STATE.player.jump_state == STATE.player.jump_states.DASH_STATE_AIR) &&
          STATE.player.dash.remaining_x_distance == 0 &&
          STATE.player.dash.remaining_y_distance == 0) {
        PLAYER.exit_dash(STATE);
      }

      /* */



      /* X Velocity calculations */
      //
      if (!STATE.player.kick_state && !STATE.player.hurt.state &&
          STATE.player.jump_state != STATE.player.jump_states.DASH_STATE_GROUND &&
          STATE.player.jump_state != STATE.player.jump_states.DASH_STATE_AIR) {
        //Conditions for Left Key Pressed
        if (left_key_down) {
          //If player has some velocity towards the right, slow down faster to reach 0 speed quickly
          if (STATE.player.velocity_x > 0) {
            STATE.player.velocity_x -= STATE.player.fast_friction_x
            //otherwise, speed up left movement as long as it's below the max velocity allowed
          } else if (STATE.player.velocity_x > STATE.player.max_velocity_x * -1) {
            if (STATE.player.jump_state == STATE.player.jump_states.NEUTRAL_STATE) {
              STATE.player.velocity_x -= STATE.player.accel_ground_x;
            } else {
              STATE.player.velocity_x -= STATE.player.accel_air_x;
            }
          }
        }

        //Conditions for Right Key Pressed
        if (right_key_down) {
          //If player has some velocity towards the left, slow down faster to reach 0 speed quickly
          if (STATE.player.velocity_x < 0) {
            STATE.player.velocity_x += STATE.player.fast_friction_x
            //otherwise, speed up right movement as long as it's below the max velocity allowed
          } else if (STATE.player.velocity_x < STATE.player.max_velocity_x) {
            if (STATE.player.jump_state == STATE.player.jump_states.NEUTRAL_STATE) {
              STATE.player.velocity_x += STATE.player.accel_ground_x;
            } else {
              STATE.player.velocity_x += STATE.player.accel_air_x;
            }
          }
        }

        //X Velocity friction for when left/right keys aren't pressed
        if (!left_key_down && !right_key_down) {
          //Is player moving towards the left?
          if (STATE.player.velocity_x < 0) {
            //If adding speed will NOT cause velocity_x to go past 0 and thus start moving right, then add it
            if (STATE.player.velocity_x < STATE.player.friction_x * -1) {
              STATE.player.velocity_x += STATE.player.friction_x;
              //Otherwise, just set velocity_x to 0
            } else {
              STATE.player.velocity_x = 0;
            }
          } else {
            //If subtracting speed will NOT cause velocity_x to go past 0 and thus start moving left, then add it
            if (STATE.player.velocity_x > STATE.player.friction_x) {
              STATE.player.velocity_x -= STATE.player.friction_x;
              //Otherwise, just set velocity_x to 0
            } else {
              STATE.player.velocity_x = 0;
            }
          }
        }
      } else if (STATE.player.kick_state) {
        if (STATE.player.direction == STATE.player.directions.RIGHT) {
          STATE.player.velocity_x -= STATE.player.friction_x;
        } else {
          STATE.player.velocity_x += STATE.player.friction_x;
        }
      } else if (STATE.player.jump_state == STATE.player.jump_states.DASH_STATE_GROUND ||
                 STATE.player.jump_state == STATE.player.jump_states.DASH_STATE_AIR) {
        if (STATE.player.dash.remaining_x_distance > 0) {
          STATE.player.velocity_x = 32000 * deltaTime;
          STATE.player.dash.remaining_x_distance -= STATE.player.velocity_x;
          if (STATE.player.dash.remaining_x_distance <= 0) {
            /*
            if (STATE.player.dash.remaining_x_distance * -1 > STATE.player.velocity_x) {
              STATE.player.velocity_x = 0
            } else {
            */
              STATE.player.velocity_x += STATE.player.dash.remaining_x_distance;
            //}
            STATE.player.dash.remaining_x_distance = 0;
          }
        } else {
          STATE.player.velocity_x = -32000 * deltaTime;
          STATE.player.dash.remaining_x_distance -= STATE.player.velocity_x;
          if (STATE.player.dash.remaining_x_distance >= 0) {
            /*
            if (STATE.player.dash.remaining_x_distance * -1 > STATE.player.velocity_x) {
              STATE.player.velocity_x = 0
            } else {
            */
              STATE.player.velocity_x += STATE.player.dash.remaining_x_distance;
            //}
            STATE.player.dash.remaining_x_distance = 0;
          }
        }
      }

      //Code for kicking off kicking when z is pressed
      if (z_key_begin_pressed &&
        !STATE.player.kick_state) {
        if (STATE.player.direction == 1) {
          STATE.player.velocity_x = 300;
        } else {
          STATE.player.velocity_x = -300;
        }
      }


      /* */



       /* Y Velocity calculations */
      //
      //Decelerate Y velocity based on what jump state we're in
      switch (STATE.player.jump_state) {
        case STATE.player.jump_states.INIT_STATE:
          STATE.player.velocity_y = -4000 * deltaTime;
          break;
        case STATE.player.jump_states.NEUTRAL_STATE:
          STATE.player.velocity_y = -9000 * deltaTime;
          break;
        case STATE.player.jump_states.JUMP_STATE_UP_BUTTON:
          STATE.player.velocity_y -= 700 * deltaTime; //TODO fix hardcode
          break;
        case STATE.player.jump_states.JUMP_STATE_NO_UP_BUTTON:
        case STATE.player.jump_states.FALL_STATE:
        case STATE.player.jump_states.JUMP_STATE_WALL:
        case STATE.player.jump_states.FALL_STATE_WALL:
          STATE.player.velocity_y -= 900 * deltaTime; //TODO fix hardcode
          break;
        case STATE.player.jump_states.DASH_STATE_GROUND:
        case STATE.player.jump_states.DASH_STATE_AIR:
          if (STATE.player.dash.remaining_y_distance > 0 || STATE.player.jump_state == STATE.player.jump_states.DASH_STATE_GROUND) {
            STATE.player.velocity_y = 64000 * deltaTime;
            STATE.player.dash.remaining_y_distance -= STATE.player.velocity_y;
            if (STATE.player.dash.remaining_y_distance <= 0) {
              if (STATE.player.dash.remaining_y_distance * -1 > STATE.player.velocity_y) {
                STATE.player.velocity_y = 0
              } else {
                STATE.player.velocity_y += STATE.player.dash.remaining_y_distance;
              }
              STATE.player.dash.remaining_y_distance = 0;
            }
          } else {
            STATE.player.velocity_y = -64000 * deltaTime;
            STATE.player.dash.remaining_y_distance -= STATE.player.velocity_y;
            if (STATE.player.dash.remaining_y_distance >= 0) {
              if (STATE.player.dash.remaining_y_distance * -1 < STATE.player.velocity_y) {
                STATE.player.velocity_y = 0
              } else {
                STATE.player.velocity_y += STATE.player.dash.remaining_y_distance;
              }
              STATE.player.dash.remaining_y_distance = 0;
            }
          }
          break;
      }

      //If kicking, screw the current Y velocity; we're gonna override that with something else!
      if (z_key_begin_pressed && !STATE.player.kick_state) {
        STATE.player.velocity_y = 100;
      }

      //Conditions for Down Key Pressed
      if (down_key_down) {
        STATE.player.obj.position.y -= 100 * deltaTime;
      }

      /* */



       /* Apply velocity calculations to positions */
      //
      STATE.player.obj.position.x += STATE.player.velocity_x * deltaTime;
      if (STATE.player.velocity_y > -500) {
        STATE.player.obj.position.y += STATE.player.velocity_y * deltaTime;
      } else {
        STATE.player.obj.position.y -= 500 * deltaTime;
      }


      /* */

       /* Post-movement Misc. Behaviors */
      //
      if (z_key_begin_pressed && !STATE.player.kick_state) {
        STATE.player.kick_state = true;
        STATE.player.hurt.state = false;
        STATE.sounds.stop('kick');
        STATE.sounds.play('kick');
        /*
        switch (STATE.player.jump_state) {
          case STATE.player.jump_states.JUMP_STATE_WALL:
          case STATE.player.jump_states.FALL_STATE_WALL:
          case STATE.player.jump_states.JUMP_STATE_UP_BUTTON:
          case STATE.player.jump_states.JUMP_STATE_NO_UP_BUTTON:
          case STATE.player.jump_states.FALL_STATE:
            STATE.player.dash.has_kicked_in_air = true;
        }
        */
        STATE.player.dash.has_kicked_in_air = true;
        if (STATE.player.jump_state == STATE.player.jump_states.DASH_STATE_GROUND ||
            STATE.player.jump_state == STATE.player.jump_states.DASH_STATE_AIR) {
          STATE.player.jump_state = STATE.player.jump_states.FALL_STATE;
        }
      }


       /* Collision Code */
      //
      var has_collided = false;
      var touching_wall = false;


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
              for (var k = 0; k < STATE.projectiles.length; ++k) {
                var projectile = {
                  x: STATE.projectiles[k].mesh.position.x,
                  y: STATE.projectiles[k].mesh.position.y,
                  height: STATE.projectiles[k].mesh.geometry.parameters.height,
                  width: STATE.projectiles[k].mesh.geometry.parameters.width
                }
                if (projectile.x < rect2.x + rect2.width &&
                    projectile.x + projectile.width > rect2.x &&
                    projectile.y < rect2.y + rect2.height &&
                    projectile.height + projectile.y > rect2.y) {
                  STATE.projectiles[k].mesh.position.y = 10000;
                }
              }
              // AABB collision
              if (rect1.x < rect2.x + rect2.width &&
                  rect1.x + rect1.width > rect2.x &&
                  rect1.y < rect2.y + rect2.height &&
                  rect1.height + rect1.y > rect2.y) {
                // Minkowski Sum for detecting collision
                const wy = (rect1.width + rect2.width) * (rect1.y - rect2.y);
                const hx = (rect1.height + rect2.height) * (rect1.x - rect2.x);

                if (wy > hx) {
                  if (wy > -hx) {
                    //top
                    if (!STATE.collision.map[i][j+1]) {
                      STATE.player.obj.position.y = rect2.y + (rect2.height * 0.5) + (rect1.height * 0.5) - 2.4; //TODO re-evalue if this equation is right
                      if (STATE.player.jump_state != STATE.player.jump_states.DASH_STATE_GROUND) {
                        if (STATE.player.jump_state == STATE.player.jump_states.DASH_STATE_AIR) {
                          PLAYER.exit_dash(STATE);
                        }
                        STATE.player.jump_state = STATE.player.jump_states.NEUTRAL_STATE;
                        if (STATE.player.check_landing == 1) {
                          STATE.sounds.play('landing');
                          STATE.player.check_landing = 0;
                        }
                      }
                      has_collided = true;
                    }
                  } else {
                    //left
                    if (typeof STATE.collision.map[i-1] !== "undefined" && !STATE.collision.map[i-1][j]) {
                      if (STATE.player.velocity_x < 0) {
                        if (STATE.player.velocity_y < 0) {
                          //top collisoin
                          STATE.player.obj.position.y = rect2.y + (rect2.height * 0.5) + (rect1.height * 0.5) - 2.4; //TODO re-evalue if this equation is right
                        } else if (STATE.player.velocity_y > 0) {
                          //bottom collision
                          STATE.player.obj.position.y = rect2.y - (rect2.height * 0.5) - (rect1.height * 0.5);
                        }
                        /*
                        */
                      } else {
                        STATE.player.obj.position.x = rect2.x - (rect2.width * 0.5) - (rect1.width * 0.5) - 1.5; //TODO re-evaluate if this equation is right
                        if (STATE.player.velocity_y > 0 &&
                          STATE.player.jump_state != STATE.player.jump_states.JUMP_STATE_WALL &&
                          STATE.player.jump_state != STATE.player.jump_states.FALL_STATE_WALL &&
                          STATE.player.jump_state != STATE.player.jump_states.NEUTRAL_STATE) {
                          if (STATE.player.jump_state == STATE.player.jump_states.DASH_STATE_AIR ||
                              STATE.player.jump_state == STATE.player.jump_states.DASH_STATE_GROUND) {
                            PLAYER.exit_dash(STATE);
                          }
                          if (STATE.player.velocity_x < STATE.player.max_velocity_x) {
                            STATE.player.velocity_y += STATE.player.velocity_x;
                          } else {
                            STATE.player.velocity_y += STATE.player.max_velocity_x;
                          }
                          STATE.player.jump_state = STATE.player.jump_states.JUMP_STATE_WALL;
                        } else if (STATE.player.velocity_y < 0 &&
                          STATE.player.jump_state != STATE.player.jump_states.JUMP_STATE_WALL &&
                          STATE.player.jump_state != STATE.player.jump_states.FALL_STATE_WALL &&
                          STATE.player.jump_state != STATE.player.jump_states.NEUTRAL_STATE) {
                          if (STATE.player.jump_state == STATE.player.jump_states.DASH_STATE_AIR ||
                              STATE.player.jump_state == STATE.player.jump_states.DASH_STATE_GROUND) {
                            PLAYER.exit_dash(STATE);
                          }
                          if (STATE.player.velocity_x < STATE.player.max_velocity_x) {
                            STATE.player.velocity_y -= STATE.player.velocity_x;
                          } else {
                            STATE.player.velocity_y -= STATE.player.max_velocity_x;
                          }
                          STATE.player.jump_state = STATE.player.jump_states.FALL_STATE_WALL;
                        }
                        STATE.player.velocity_x = 0;
                      }
                      has_collided = true;
                    } else if (STATE.player.jump_state == STATE.player.jump_states.DASH_STATE_AIR &&
                               STATE.player.dash.remaining_y_distance > 0) {
                      STATE.player.obj.position.y = rect2.y - (rect2.height * 0.5) - (rect1.height * 0.5);
                      if (STATE.player.jump_state == STATE.player.jump_states.DASH_STATE_AIR) {
                        PLAYER.exit_dash(STATE);
                        STATE.player.velocity_y = 100;
                      }
                      if (STATE.player.velocity_y > 0) {
                        STATE.player.velocity_y = STATE.player.velocity_y * -0.5;
                        STATE.player.velocity_x = STATE.player.velocity_x * 0.75;
                      }
                      has_collided = true;
                    }
                    touching_wall = true;
                  }
                } else {
                  if (wy > -hx) {
                    //right
                    if (typeof STATE.collision.map[i+1] !== "undefined" && !STATE.collision.map[i+1][j]) { // TODO don't check value if STATE.collision.map[i] is null
                      if (STATE.player.velocity_x > 0) {
                        if (STATE.player.velocity_y < 0) {
                          //top collision
                          STATE.player.obj.position.y = rect2.y + (rect2.height * 0.5) + (rect1.height * 0.5) - 2.4; //TODO re-evaluate if this equation is right
                        } else if (STATE.player.velocity_y > 0) {
                          //bottom collision
                          STATE.player.obj.position.y = rect2.y - (rect2.height * 0.5) - (rect1.height * 0.5);
                        }
                      } else {
                        STATE.player.obj.position.x = rect2.x + (rect2.width * 0.5) + (rect1.width * 0.5) - 1.5;
                        if (STATE.player.velocity_y > 0 &&
                          STATE.player.jump_state != STATE.player.jump_states.JUMP_STATE_WALL &&
                          STATE.player.jump_state != STATE.player.jump_states.FALL_STATE_WALL &&
                          STATE.player.jump_state != STATE.player.jump_states.NEUTRAL_STATE) {
                          if (STATE.player.jump_state == STATE.player.jump_states.DASH_STATE_AIR ||
                              STATE.player.jump_state == STATE.player.jump_states.DASH_STATE_GROUND) {
                            PLAYER.exit_dash(STATE);
                          }
                          if (STATE.player.velocity_x < STATE.player.max_velocity_x) {
                            STATE.player.velocity_y -= STATE.player.velocity_x;
                          } else {
                            STATE.player.velocity_y -= STATE.player.max_velocity_x;
                          }
                          STATE.player.jump_state = STATE.player.jump_states.JUMP_STATE_WALL;
                        } else if (STATE.player.velocity_y < 0 &&
                          STATE.player.jump_state != STATE.player.jump_states.JUMP_STATE_WALL &&
                          STATE.player.jump_state != STATE.player.jump_states.FALL_STATE_WALL &&
                          STATE.player.jump_state != STATE.player.jump_states.NEUTRAL_STATE) {
                          if (STATE.player.jump_state == STATE.player.jump_states.DASH_STATE_AIR ||
                              STATE.player.jump_state == STATE.player.jump_states.DASH_STATE_GROUND) {
                            PLAYER.exit_dash(STATE);
                          }
                          if (STATE.player.velocity_x < STATE.player.max_velocity_x) {
                            STATE.player.velocity_y += STATE.player.velocity_x;
                          } else {
                            STATE.player.velocity_y += STATE.player.max_velocity_x;
                          }
                          STATE.player.jump_state = STATE.player.jump_states.FALL_STATE_WALL;
                        }
                        STATE.player.velocity_x = 0;
                      }
                      has_collided = true;
                    } else if (STATE.player.jump_state == STATE.player.jump_states.DASH_STATE_AIR &&
                               STATE.player.dash.remaining_y_distance > 0) {
                      STATE.player.obj.position.y = rect2.y - (rect2.height * 0.5) - (rect1.height * 0.5);
                      if (STATE.player.jump_state == STATE.player.jump_states.DASH_STATE_AIR) {
                        PLAYER.exit_dash(STATE);
                        STATE.player.velocity_y = 100;
                      }
                      if (STATE.player.velocity_y > 0) {
                        STATE.player.velocity_y = STATE.player.velocity_y * -0.5;
                        STATE.player.velocity_x = STATE.player.velocity_x * 0.75;
                      }
                      has_collided = true;
                    }
                    touching_wall = true;
                  } else {
                    //bottom
                    if (!STATE.collision.map[i][j-1]) {
                      STATE.player.obj.position.y = rect2.y - (rect2.height * 0.5) - (rect1.height * 0.5);
                      if (STATE.player.jump_state == STATE.player.jump_states.DASH_STATE_AIR) {
                        PLAYER.exit_dash(STATE);
                        STATE.player.velocity_y = 100;
                      }
                      if (STATE.player.velocity_y > 0) {
                        STATE.player.velocity_y = STATE.player.velocity_y * -0.5;
                        STATE.player.velocity_x = STATE.player.velocity_x * 0.75;
                      }
                      has_collided = true;
                    }
                  }
                }
              }
            }
          }
        }
      }


      //If the player isn't colliding with anything, isn't in the init jump state, or isn't doing any kicks, switch to the falling state
      if (!has_collided &&
          STATE.player.jump_state != STATE.player.jump_states.INIT_STATE &&
          STATE.player.jump_state != STATE.player.jump_states.JUMP_STATE_UP_BUTTON &&
          STATE.player.jump_state != STATE.player.jump_states.JUMP_STATE_NO_UP_BUTTON &&
          STATE.player.jump_state != STATE.player.jump_states.DASH_STATE_AIR &&
          STATE.player.jump_state != STATE.player.jump_states.DASH_STATE_GROUND &&
          !STATE.player.kick_state) {
        STATE.player.jump_state = STATE.player.jump_states.FALL_STATE;
      }

      //If the player isn't touching a wall, switch over the state to its non-wall equivalent.
      if (!touching_wall) {
        if (STATE.player.jump_state == STATE.player.jump_states.JUMP_STATE_WALL) {
          STATE.player.jump_state == STATE.player.jump_states.JUMP_STATE_NO_UP_BUTTON;
        } else if (STATE.player.jump_state == STATE.player.jump_states.FALL_STATE_WALL) {
          STATE.player.jump_state == STATE.player.jump_states.FALL_STATE;
        }
      }

      /* */

      /* Projectile collision code */
      //
      if (!STATE.player.hurt.invuln) {
        for (var i = 0; i < STATE.projectiles.length; ++i) {
          var projectile = {
            x: STATE.projectiles[i].mesh.position.x,
            y: STATE.projectiles[i].mesh.position.y,
            height: STATE.projectiles[i].mesh.geometry.parameters.height,
            width: STATE.projectiles[i].mesh.geometry.parameters.width
          }
          var player = {
            x: STATE.player.obj.position.x,
            y: STATE.player.obj.position.y,
            height: STATE.player.obj.geometry.parameters.height - 1.5,
            width: STATE.player.obj.geometry.parameters.width - 10
          }
          if (player.x < projectile.x + projectile.width &&
            player.x + player.width > projectile.x &&
            player.y < projectile.y + projectile.height &&
            player.height + player.y > projectile.y) {
            if (player.x < projectile.x) {
              //hit right
              STATE.player.velocity_x = -200;
            } else {
              //hit left
              STATE.player.velocity_x = 200;
            }
            PLAYER.exit_dash(STATE);
            STATE.player.kick_state = false;
            STATE.player.velocity_y = 200;
            STATE.player.obj.position.y += 20
            STATE.player.jump_state = STATE.player.jump_states.JUMP_STATE_NO_UP_BUTTON;
            STATE.player.hurt.state = true;
            STATE.player.hurt.invuln = true;
            STATE.player.hurt.invuln_time = 0.25;
            STATE.passes[0].renderToScreen = false;
            STATE.passes[2].renderToScreen = true;
            STATE.player.health -= 10;
            STATE.sounds.play('hurt');
            updateHealth(10);
            STATE.projectiles[i].mesh.position.x = STATE.turrets[i].mesh.position.x;
            STATE.projectiles[i].mesh.position.y = STATE.turrets[i].mesh.position.y;
            STATE.projectiles[i].mesh.position.z = STATE.turrets[i].mesh.position.z - 1;
            STATE.turrets[i].timer = 0;
            //console.log("Health = " + STATE.player.health);
          }
        }
      }

      if (STATE.player.health <= 0 && !STATE.player.game_over) {
        STATE.player.game_over = true;
        gameOver();
        PLAYER.freeze_game(STATE);
      }

      if (STATE.player.obj.position.x > 494) {
        gameWin()
        PLAYER.freeze_game(STATE);
      } else if (STATE.player.obj.position.x < -7094) {
        specialWin()
        PLAYER.freeze_game(STATE);
      }

      //console.log(STATE.player.obj.position.x + " " + STATE.player.obj.position.y);
      /* */


      // Use the above the modify player state.

      // Check for collisions, respond appropriately.

      // Adjust camera as necessary.
      STATE.camera.position.set(
        STATE.player.obj.position.x,
        STATE.player.obj.position.y + 75,
        STATE.player.obj.position.z + 225
      );

      STATE.directionalLight.position.set(
        STATE.player.obj.position.x - 300,
        STATE.player.obj.position.y + 250,
        STATE.player.obj.position.z + 225
      )
    }
  }

}
