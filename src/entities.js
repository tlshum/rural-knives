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
    turretMesh.position.set(-6534, -695, -10);
    turretMesh2.position.set(120, 50, 80);
    turretMesh3.position.set(170, 60, 80);
    turretMesh4.position.set(320, 80, 80);
    turretMesh.castShadow = true;
    turretMesh2.castShadow = true;
    turretMesh3.castShadow = true;
    turretMesh4.castShadow = true;

    // Initialize projectiles
    let projectileGeo = new THREE.BoxBufferGeometry(10, 15, 0.001);
    let projectileMat = STATE.materials.get('projectile');
    let projectileMesh = new THREE.Mesh(projectileGeo, projectileMat);
    let projectileMesh2 = new THREE.Mesh(projectileGeo, projectileMat);
    let projectileMesh3 = new THREE.Mesh(projectileGeo, projectileMat);
    let projectileMesh4 = new THREE.Mesh(projectileGeo, projectileMat);
    projectileMesh.position.set(-6534, -695, -10);
    projectileMesh2.position.set(120, 50, 79);
    projectileMesh3.position.set(170, 60, 79);
    projectileMesh4.position.set(320, 80, 79);
    projectileMesh.castShadow = true;
    projectileMesh2.castShadow = true;
    projectileMesh3.castShadow = true;
    projectileMesh4.castShadow = true;


    // Instantiate entities.

    STATE.turrets = [{
      mesh: turretMesh,
      timer: 0, rotate: false,}, { mesh: turretMesh2, timer: 0, rotate: false,},
      { mesh: turretMesh3, timer: 0, rotate: false,},
      { mesh: turretMesh4, timer: 0, rotate: false,}];



    STATE.projectiles = [{mesh: projectileMesh, velocity_x: 200, velocity_y: 10,},
      {mesh: projectileMesh2, velocity_x: 200, velocity_y: 10,},
      {mesh: projectileMesh3, velocity_x: 200, velocity_y: 10,},
      {mesh: projectileMesh4, velocity_x: 200, velocity_y: 10,}];


    // Add to scene.

    for (let i = 0; i < STATE.turrets.length; i++) {
      STATE.scene.add( STATE.turrets[i].mesh);
      console.log(STATE.turrets[i].mesh);
    }

    for (let i = 0; i < STATE.projectiles.length; i++) {
      STATE.scene.add( STATE.projectiles[i].mesh);
      console.log(STATE.projectiles[i].mesh);
    }

  }

  static update ( STATE, deltaTime ) {

    // Detection distance for turrets to begin firing
    const turretDist = 150;

    // Update
    for (let i = 0; i < STATE.turrets.length; i++) {

      const dx = STATE.turrets[i].mesh.position.x - STATE.player.obj.position.x;
      const dy = STATE.turrets[i].mesh.position.y - STATE.player.obj.position.y;

      // Rotate turret when player goes by
    //  if (dx < 0 && !STATE.turrets[i].rotate) {
    //    STATE.turrets[i].mesh.flipX = true;
    //    STATE.turrets[i].rotate = true;
    //  }

      // While player is in range, fire projectile
      if (dx*dx + dy*dy < turretDist*turretDist) {
        STATE.turrets[i].timer += deltaTime;

        if (STATE.turrets[i].timer >= 1) {
          // FIRE meshes from projectiles array
          STATE.projectiles[i].mesh.position.x -= STATE.projectiles[i].velocity_x * deltaTime;
          STATE.projectiles[i].mesh.position.y -= STATE.projectiles[i].velocity_y * deltaTime;
        }

        // Reset projectile and fire again
        if (STATE.turrets[i].mesh.position.x - STATE.projectiles[i].mesh.position.x > 300)
        {
          STATE.projectiles[i].mesh.position.x = STATE.turrets[i].mesh.position.x;
          STATE.projectiles[i].mesh.position.y = STATE.turrets[i].mesh.position.y;
          STATE.projectiles[i].mesh.position.z = STATE.turrets[i].mesh.position.z - 1;
        }

      }

      // Reset projectile when player out of range, don't fire
      else {
        STATE.turrets[i].timer = 0;
        STATE.projectiles[i].mesh.position.x = STATE.turrets[i].mesh.position.x;
        STATE.projectiles[i].mesh.position.y = STATE.turrets[i].mesh.position.y;
        STATE.projectiles[i].mesh.position.z = STATE.turrets[i].mesh.position.z - 1;
      }

    }

    //for (let i = 0; i < STATE.projectiles.length; i++) {

  //    STATE.projectiles[i].mesh.position += STATE.projectiles[i].
  //  }
    // Check interactions

  }

}
