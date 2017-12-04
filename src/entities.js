import * as THREE from 'three';

export default class ENTITIES {

  static load ( STATE ) {

    let loader = new THREE.TextureLoader();

    STATE.loader.changeCount(2);

    // load turret image

    loader.load( 'resources/entities/turret.png',
    function (texture) {

      //texture settings

      STATE.materials.mats['turret'] = new THREE.MeshLambertMaterial({ map: texture });
      STATE.materials.mats['turret'].transparent = true;
      STATE.materials.mats['turret'].magFilter = THREE.NearestFilter;
      STATE.materials.dmats['turret'] = new THREE.MeshDepthMaterial( {
        depthPacking: THREE.RGBADepthPacking,
        map: texture,
        alphaTest: 0.5
      });

      STATE.loader.changeCount(-1);
     });

     // Load projectiles
     loader.load( 'resources/entities/projectile.png',
     function (texture) {

       //texture settings

       STATE.materials.mats['projectile'] = new THREE.MeshLambertMaterial({ map: texture });
       STATE.materials.mats['projectile'].transparent = true;
       STATE.materials.mats['projectile'].magFilter = THREE.NearestFilter;

       STATE.loader.changeCount(-1);
      });

   }

  static init ( STATE ) {

    // Initialize turrets
    let turretGeo = new THREE.BoxBufferGeometry(20,30,.001);
    let turretMat = STATE.materials.get('turret');

    let turretMesh = new THREE.Mesh(turretGeo, turretMat);
    let turretMesh2 = new THREE.Mesh(turretGeo, turretMat);
    let turretMesh3 = new THREE.Mesh(turretGeo, turretMat);
    let turretMesh4 = new THREE.Mesh(turretGeo, turretMat);
    let turretMesh5 = new THREE.Mesh(turretGeo, turretMat);
    let turretMesh6 = new THREE.Mesh(turretGeo, turretMat);
    let turretMesh7 = new THREE.Mesh(turretGeo, turretMat);
    let turretMesh8 = new THREE.Mesh(turretGeo, turretMat);
    let turretMesh9 = new THREE.Mesh(turretGeo, turretMat);
    let turretMesh10 = new THREE.Mesh(turretGeo, turretMat);
    let turretMesh11 = new THREE.Mesh(turretGeo, turretMat);
    let turretMesh12 = new THREE.Mesh(turretGeo, turretMat);

    turretMesh.position.set(-5460, 105, -10);
    turretMesh2.position.set(-4915, 125, -10);
    turretMesh3.position.set(-4350, 305, -10);
    turretMesh4.position.set(-3800, 465, -10);
    turretMesh5.position.set(-1560, 305, -10);
    turretMesh6.position.set(-1560, 665, -10);
    turretMesh7.position.set(-755, 130, -10);
    turretMesh8.position.set(-385, 170, -10);
    turretMesh9.position.set(-175, 225, -10);
    turretMesh10.position.set(-1560, 695, -10);
    turretMesh11.position.set(-2800, 127, -10);
    turretMesh12.position.set(-2660, 485, -10);

    turretMesh.castShadow = true;
    turretMesh2.castShadow = true;
    turretMesh3.castShadow = true;
    turretMesh4.castShadow = true;
    turretMesh5.castShadow = true;
    turretMesh6.castShadow = true;
    turretMesh7.castShadow = true;
    turretMesh8.castShadow = true;
    turretMesh9.castShadow = true;
    turretMesh10.castShadow = true;
    turretMesh11.castShadow = true;
    turretMesh12.castShadow = true;

    turretMesh.customDepthMaterial = STATE.materials.dget('turret');
    turretMesh2.customDepthMaterial = STATE.materials.dget('turret');
    turretMesh3.customDepthMaterial = STATE.materials.dget('turret');
    turretMesh4.customDepthMaterial = STATE.materials.dget('turret');
    turretMesh5.customDepthMaterial = STATE.materials.dget('turret');
    turretMesh6.customDepthMaterial = STATE.materials.dget('turret');
    turretMesh7.customDepthMaterial = STATE.materials.dget('turret');
    turretMesh8.customDepthMaterial = STATE.materials.dget('turret');
    turretMesh9.customDepthMaterial = STATE.materials.dget('turret');
    turretMesh10.customDepthMaterial = STATE.materials.dget('turret');
    turretMesh11.customDepthMaterial = STATE.materials.dget('turret');
    turretMesh12.customDepthMaterial = STATE.materials.dget('turret');


    // Initialize projectiles
    let projectileGeo = new THREE.BoxBufferGeometry(8, 8, 0.001);
    let projectileMat = STATE.materials.get('projectile');



    // Instantiate entities.

    STATE.turrets = [{
      mesh: turretMesh,
      timer: 0, rotate: false,}, { mesh: turretMesh2, timer: 0, rotate: false,},
      { mesh: turretMesh3, timer: 0, rotate: false,},
      { mesh: turretMesh4, timer: 0, rotate: false,},
      { mesh: turretMesh5, timer: 0, rotate: false,},
      { mesh: turretMesh6, timer: 0, rotate: false,},
      { mesh: turretMesh7, timer: 0, rotate: false,},
      { mesh: turretMesh8, timer: 0, rotate: false,},
      { mesh: turretMesh9, timer: 0, rotate: false,},
      { mesh: turretMesh10, timer: 0, rotate: false,},
      { mesh: turretMesh11, timer: 0, rotate: false,},
      { mesh: turretMesh12, timer: 0, rotate: false,}];




    STATE.projectiles = [];

    STATE.lastUsed = 0;

    // Add to scene.

    for (let i = 0; i < STATE.turrets.length; i++)
      STATE.scene.add(STATE.turrets[i].mesh);

    //console.log(STATE.turrets);

    for (let i = 0; i < 5; i++) {
      let projectileMesh = new THREE.Mesh(projectileGeo, projectileMat);
      projectileMesh.castShadow = true;
      STATE.projectiles[i] = {
        mesh: projectileMesh,
        velocity_x: 200,
        active: false,
        turret: null,
      }
      STATE.scene.add(STATE.projectiles[i].mesh);
    }

    //console.log(STATE.projectiles)
  }

  static update ( STATE, deltaTime ) {

    if (STATE.player.jump_state != STATE.player.jump_states.FREEZE) {
      // Detection distance for turrets to begin firing
      const turretDist = 500;


      // Update


      for (let i = 0; i < STATE.turrets.length; i++) {
        const dx = STATE.turrets[i].mesh.position.x - STATE.player.obj.position.x;
        const dy = STATE.turrets[i].mesh.position.y - STATE.player.obj.position.y;

        // While player is in range, select projectiles and activate
        if (dx*dx + dy*dy < turretDist*turretDist) {
          STATE.turrets[i].timer += deltaTime;
          if (STATE.turrets[i].timer >= 1) {
            STATE.turrets[i].timer = 0;
            STATE.projectiles[STATE.lastUsed].active = true;
            //STATE.projectiles[i].visible = true;
            STATE.projectiles[STATE.lastUsed].turret = STATE.turrets[i];
            STATE.projectiles[STATE.lastUsed].mesh.position.x = STATE.turrets[i].mesh.position.x;
            STATE.projectiles[STATE.lastUsed].mesh.position.y = STATE.turrets[i].mesh.position.y;
            STATE.projectiles[STATE.lastUsed].mesh.position.z = STATE.turrets[i].mesh.position.z;
            STATE.lastUsed++;

            if (STATE.lastUsed == STATE.projectiles.length) {
              STATE.lastUsed = 0;
            }
          }
        }
        // Out of range, reset timer
        else STATE.turrets[i].timer = 0;
      }


      for (let i = 0; i < STATE.projectiles.length; i++) {
        // Fire every activated projectile in fixed direction
        if (STATE.projectiles[i].active) {
          STATE.projectiles[i].mesh.position.x -= STATE.projectiles[i].velocity_x * deltaTime;
          // If projectile travels too far past player, reset projectile position
          //if ((STATE.player.obj.position.x - STATE.projectiles[i].mesh.position.x > turretDist) && STATE.projectiles[i].turret != null) {
          //  STATE.projectiles[i].active = false;
          //STATE.projectiles[i].visible = false;
          //  }
        }
      }
    }
  }
}
