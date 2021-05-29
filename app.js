//Variables for scenes, camera, lights, meshes and textures
var scene, camera, renderer, mesh, clock;
var meshFloor, ambientLight, light;
var crate, crateTexture, crateNormalMap, crateBumpMap;
var floorTexture, floorNormalMap, floorBumpMap;
var skyTexture;

//Loading Screen
var loadingScreen = {
    scene: new THREE.Scene(),
    camera: new THREE.PerspectiveCamera(90, 1600/920, 0.1, 1000), //1280/720       (window.innerHeight - 50)/(window.innerHeight - 50)
    box: new THREE.Mesh(
        new THREE.BoxGeometry(0.5, 0.5, 0.5),
        new THREE.MeshBasicMaterial({color: 0x4444ff})
    )
};

var RESOURCES_LOADED = false;
var loadingManager = null;

//Models
var models = {
    tent: {
        obj:"3D Objects/tent_detailedOpen.obj",
        mtl:"Textures/Tent/tent_detailedOpen.mtl",
        mesh:null
    },
    campfire: {
        obj:"3D Objects/Campfire_01.obj",
        mtl:"Textures/Campfire/Campfire_01.mtl",
        mesh:null
    },
    pirate: {
        obj:"3D Objects/Pirateship.obj",
        mtl:"Textures/Pirate/Pirateship.mtl",
        mesh:null
    },
    weapon:{
        obj:"3D Objects/blasterL.obj",
        mtl:"Textures/Weapon/blasterL.mtl",
        mesh:null,
        castShadow: false
    },
    riverEnd:{
        obj:"3D Objects/ground_riverEndClosed.obj",
        mtl:"Textures/River/ground_riverEndClosed.mtl",
        mesh:null
    },
    carrot:{
        obj:"3D Objects/crop_carrot.obj",
        mtl:"Textures/Crops/crop_carrot.mtl",
        mesh:null
    },
    pumpkin:{
        obj:"3D Objects/crop_pumpkin.obj",
        mtl:"Textures/Crops/crop_pumpkin.mtl",
        mesh:null
    },
    turnip:{
        obj:"3D Objects/crop_turnip.obj",
        mtl:"Textures/Crops/crop_turnip.mtl",
        mesh:null
    },
    fenceBody:{
        obj:"3D Objects/fence_planksDouble.obj",
        mtl:"Textures/Fence/fence_planksDouble.mtl",
        mesh:null
    },
    foamBullets:{
        obj:"3D Objects/foamBulletB.obj",
        mtl:"Textures/Bullets/foamBulletB.mtl",
        mesh:null
    },
    rocketLauncher:{
        obj:"3D Objects/rocketlauncher.obj",
        mtl:"Textures/RocketLauncher/rocketlauncher.mtl",
        castShadow:false,
        mesh:null
    },
    rocketLauncherAmmo:{
        obj:"3D Objects/ammo_rocket.obj",
        mtl:"Textures/RocketLauncher/ammo_rocket.mtl",
        mesh:null
    }
};

var meshes = {};

//Bullets
var bullets = [];

//Logic
var keyboard = {};
var player = {height: 1.8, speed:0.08, turnSpeed: Math.PI * 0.007, canShoot: 0}
var USE_WIREFRAME = false;
var canJump = true;

/*---------------Tree---------------*/
function Arvore(){

    const arvore = new THREE.Group();

    const folhas = new THREE.Mesh(
        new THREE.SphereGeometry(1, 3, 3),
        new THREE.MeshLambertMaterial({color: 0x00ff00})
    );

    folhas.position.y = 1.4;

    const tronco = new THREE.Mesh(
        new THREE.CylinderGeometry(0.1,0.2,1),
        new THREE.MeshLambertMaterial({color: 0x964B00})
    );

    folhas.castShadow = true;
    folhas.receiveShadow = false;
    tronco.castShadow = true;
    tronco.receiveShadow = true;

    arvore.add(folhas);
    arvore.add(tronco);

    return arvore;
}
/*---------------Tree---------------*/

//Sound Effects (SFX)
var listenerSFX = new THREE.AudioListener();
var sfx1 = new THREE.Audio(listenerSFX);

var sfxLoader = new THREE.AudioLoader();
sfxLoader.load( 'Music/laser1.ogg', function( buffer ) {
sfx1.setBuffer( buffer );
sfx1.setLoop( false );
sfx1.setVolume( 0.5 );
});

//MouseClick event
var isClicked = 0;
document.addEventListener('mousedown', ev =>{
    if(player.canShoot <= 0){
        isClicked = 1;
    }
    
    controls.lock();
});

function Start(){
    //Scene
    var textLoadSky = new THREE.TextureLoader();
    skyTexture = textLoadSky.load("Textures/Sky/sunset.jpg");
    scene = new THREE.Scene();
    scene.background = skyTexture;
    //scene.background = new THREE.Color(0x229dd0);
    //scene.background = new THREE.Color(0x5bbce4);

    //Skybox 1
    /*{
        const loader = new THREE.TextureLoader();
        const texture = loader.load(
          'Textures/Skybox/skybox1.jpg',
          () => {
            const rt = new THREE.WebGLCubeRenderTarget(texture.image.height);
            rt.fromEquirectangularTexture(renderer, texture);
            scene.background = rt.texture;
          });
    }*/

    //Skybox 2
    var skyboxGeometry = new THREE.BoxGeometry(1000, 1000, 1000);
    var skyboxMaterials = [
        new THREE.MeshBasicMaterial( {map: new THREE.TextureLoader().load("Textures/Skybox/front.bmp"), side:THREE.DoubleSide} ),
        new THREE.MeshBasicMaterial( {map: new THREE.TextureLoader().load("Textures/Skybox/back.bmp"), side:THREE.DoubleSide} ),
        new THREE.MeshBasicMaterial( {map: new THREE.TextureLoader().load("Textures/Skybox/up.bmp"), side:THREE.DoubleSide} ),
        new THREE.MeshBasicMaterial( {map: new THREE.TextureLoader().load("Textures/Skybox/bottom.bmp"), side:THREE.DoubleSide} ),
        new THREE.MeshBasicMaterial( {map: new THREE.TextureLoader().load("Textures/Skybox/right.bmp"), side:THREE.DoubleSide} ),
        new THREE.MeshBasicMaterial( {map: new THREE.TextureLoader().load("Textures/Skybox/left.bmp"), side:THREE.DoubleSide} )
    ];

    var skyboxMaterial = new THREE.MeshFaceMaterial(skyboxMaterials);
    var skybox = new THREE.Mesh(skyboxGeometry, skyboxMaterial);
    scene.add(skybox);
    
    //Camera
    camera = new THREE.PerspectiveCamera(90, 1280/720, 0.1, 1000);

    //Clock for animations
    clock = new THREE.Clock();

    //Loading Screen
    loadingScreen.box.position.set(0, 0, 5);
    loadingScreen.camera.lookAt(loadingScreen.box.position);
    loadingScreen.scene.add(loadingScreen.box);

    loadingManager = new THREE.LoadingManager();
    loadingManager.onProgress = function(item, loaded, total){
        console.log(item, loaded, total);
    }
    loadingManager.onLoad = function(){
        console.log("Loaded all resources");
        RESOURCES_LOADED = true;
        onResourcesLoaded();
    }

    //Rotating Cube
    mesh = new THREE.Mesh(
        new THREE.BoxGeometry(1,1,1),
        new THREE.MeshPhongMaterial({color:0xff4444, wireframe:false})
    );
    mesh.position.y += 2;
    mesh.receiveShadow = true;
    mesh.castShadow = true;
    scene.add(mesh);
    
    //Floor
    var textLoadFloor = new THREE.TextureLoader(loadingManager);
    floorTexture = textLoadFloor.load("Textures/Floor/floorTexture.jpg");
    floorNormalMap = textLoadFloor.load("Textures/Floor/floorNormal.jpg");
    //floorBumpMap = textLoadFloor.load("Textures/Floor/floorBump2.jpg");

    meshFloor = new THREE.Mesh(
        new THREE.PlaneGeometry(50, 50, 10, 10),
        new THREE.MeshPhongMaterial({
            color: 0xffffff,
            map:floorTexture,
            normalMap:floorNormalMap
        })
    );
    meshFloor.rotation.x += (3 * Math.PI) / 2; //270º
    meshFloor.receiveShadow = true;
    scene.add(meshFloor);

    //Music
    const listener = new THREE.AudioListener();
    camera.add(listener);
    const sound = new THREE.Audio( listener );

    const audioLoader = new THREE.AudioLoader(loadingManager);
    audioLoader.load( 'Music/puipui3.ogg', function( buffer ) {
	sound.setBuffer( buffer );
	sound.setLoop( true );
	sound.setVolume( 0.5 );
	sound.play();
    });

    //Lights
    ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
    ambientLight.castShadow = true;
    scene.add(ambientLight);

    light = new THREE.PointLight(0xffffff, 0.8, 18);
    light.position.set(6, 5, -3);
    light.castShadow = true;
    light.shadow.camera.near = 0.1;
    light.shadow.camera.far = 25;
    scene.add(light);

    //Crates
    var textureLoader = new THREE.TextureLoader(loadingManager);
    crateTexture = textureLoader.load("Textures/Crate/crate1_diffuse.png");
    crateBumpMap = textureLoader.load("Textures/Crate/crate1_bump.png");
    crateNormalMap = textureLoader.load("Textures/Crate/crate1_normal.png");

    crate = new THREE.Mesh(
        new THREE.BoxGeometry(3, 3, 3),
        new THREE.MeshPhongMaterial(
            {color:0xffffff,
            map:crateTexture,
            bumpMap:crateBumpMap,
            normalMap:crateNormalMap
            })
    );
    scene.add(crate);
    crate.position.set(2.5, 3/2, 2.5);
    crate.receiveShadow = true;
    crate.castShadow = true;

    //Object/Material Loader
    //var mtlLoader = new THREE.MTLLoader(loadingManager);
    //var objLoader = new THREE.OBJLoader(loadingManager);

    /*
    //Tent
    mtlLoader.load("Textures/Tent/tent_detailedOpen.mtl", function(materials){
        
        materials.preload();
        //var objLoader = new THREE.OBJLoader();
        objLoader.setMaterials(materials);

        objLoader.load("3D Objects/tent_detailedOpen.obj", function(mesh){
            
            mesh.traverse(function(node){
                if(node instanceof THREE.Mesh){
                    node.castShadow = true;
                    node.receiveShadow = true; 
                }
            });

            scene.add(mesh);
            mesh.position.set(-4, 0, 2);
            mesh.rotation.y += Math.PI; 
            mesh.scale.set(4, 4, 4);
        });
    });
    */

    //Load multiple models
    for( var _key in models ){
		(function(key){
			var mtlLoader = new THREE.MTLLoader(loadingManager);
			mtlLoader.load(models[key].mtl, function(materials){
				materials.preload();

				var objLoader = new THREE.OBJLoader(loadingManager);
				objLoader.setMaterials(materials);
				objLoader.load(models[key].obj, function(mesh){
					
					mesh.traverse(function(node){
						if( node instanceof THREE.Mesh ){
                            if('castShadow' in models[key])
							node.castShadow = models[key].castShadow;
                            else
                            node.castShadow = true;

                            if('receiveShadow' in models[key])
							node.receiveShadow = models[key].receiveShadow;
                            else
							node.receiveShadow = true;
						}
					});
					models[key].mesh = mesh;
					
				});
			});
			
		})(_key);
	}

    //Trees
    var novaArvore = Arvore();
    scene.add(novaArvore);
    novaArvore.position.set(6, 0.3, -2);
    
    var i, randX, randZ;
    for(i = 0; i < 20; i++){
        randX = THREE.Math.randInt(-25, 25);
        randZ = THREE.Math.randInt(-25, 25);

        novaArvore = Arvore();
        scene.add(novaArvore);
        novaArvore.position.set(randX, 0.3, randZ);
    }

    //Cameras
    camera.position.set(0,player.height,-5);
    camera.lookAt(new THREE.Vector3(0,player.height,0));
    //camera.lookAt(mesh);

    //Renderer
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(1600, 920); //1280/720      window.innerWidth - 50, window.innerHeight - 50

    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.BasicShadowMap;

    //Controls
    controls = new THREE.PointerLockControls(camera, renderer.domElement);
    //controls.update();

    document.body.appendChild(renderer.domElement);

    Update();
}

//Runs when all resources are loaded
function onResourcesLoaded(){
    //Clone models
    meshes["tent1"] = models.tent.mesh.clone();
    meshes["tent2"] = models.tent.mesh.clone();
    meshes["campfire1"] = models.campfire.mesh.clone();
    meshes["campfire2"] = models.campfire.mesh.clone();
    meshes["pirateship"] = models.pirate.mesh.clone();
    meshes["riverEnd"] = models.riverEnd.mesh.clone();
    meshes["pumpkin"] = models.pumpkin.mesh.clone();
    meshes["turnip"] = models.turnip.mesh.clone();
    meshes["carrot"] = models.carrot.mesh.clone();
    meshes["fenceBody"] = models.fenceBody.mesh.clone();
    meshes["fenceBody2"] = models.fenceBody.mesh.clone();
    meshes["fenceBody3"] = models.fenceBody.mesh.clone();
    meshes["fenceBody4"] = models.fenceBody.mesh.clone();
    meshes["fenceBody5"] = models.fenceBody.mesh.clone();

    //Add models to scene
    meshes["tent1"].position.set(-4, 0, 2);
    meshes["tent1"].rotation.y += Math.PI;
    meshes["tent1"].scale.set(4, 4, 4);
    scene.add(meshes["tent1"]);

    meshes["tent2"].position.set(-8, 0, 0);
    meshes["tent2"].rotation.y += (4 * Math.PI) / 6;
    meshes["tent2"].scale.set(4, 4, 4);
    scene.add(meshes["tent2"]);

    meshes["campfire1"].position.set(-4.5, 0, -1);
    scene.add(meshes["campfire1"]);

    meshes["pirateship"].position.set(10, 0, 0);
    meshes["pirateship"].rotation.y += Math.PI;
    //meshes["pirateship"].rotation.x += (1 * Math.PI) / 6;
    scene.add(meshes["pirateship"]);

    meshes["riverEnd"].position.set(15, 0.3, 0);
    meshes["riverEnd"].scale.set(4, 4, 4);
    scene.add(meshes["riverEnd"]);

    meshes["carrot"].position.set(-10, -0.4, -4);
    meshes["carrot"].scale.set(2,2,2);
    scene.add(meshes["carrot"]);

    meshes["pumpkin"].position.set(-10, 0.08, -5);
    meshes["pumpkin"].scale.set(2,2,2);
    scene.add(meshes["pumpkin"]);
    
    meshes["turnip"].position.set(-10, -0.5, -6);
    meshes["turnip"].scale.set(2,2,2);
    scene.add(meshes["turnip"]);

    meshes["fenceBody"].position.set(0, 0, -26.5); 
    meshes["fenceBody"].scale.set(4, 4, 4);
    scene.add(meshes["fenceBody"]);

    meshes["fenceBody2"].position.set(3.7, 0, -26.5); 
    meshes["fenceBody2"].scale.set(4, 4, 4);
    scene.add(meshes["fenceBody2"]);

    meshes["fenceBody3"].position.set(7.4, 0, -26.5); 
    meshes["fenceBody3"].scale.set(4, 4, 4);
    scene.add(meshes["fenceBody3"]);

    meshes["fenceBody4"].position.set(11.1, 0, -26.5); 
    meshes["fenceBody4"].scale.set(4, 4, 4);
    scene.add(meshes["fenceBody4"]);

    meshes["fenceBody5"].position.set(14.8, 0, -26.5); 
    meshes["fenceBody5"].scale.set(4, 4, 4);
    scene.add(meshes["fenceBody5"]);
    
    //Player Weapon
    meshes["weapon"] = models.weapon.mesh.clone();
    meshes["weapon"].position.set(0, 1, 0);
    meshes["weapon"].scale.set(1, 1, 1);
    scene.add(meshes["weapon"]);

    //Player Rocket Launcher
    //meshes["rocketLauncher"] = models.rocketLauncher.mesh.clone();
    //meshes["rocketLauncher"].position.set(0, 1, 0);
    //meshes["rocketLauncher"].scale.set(5, 5, 5);
    //scene.add(meshes["rocketLauncher"]);

    //Axis
    const axesHelper = new THREE.AxesHelper( 5 );
    scene.add( axesHelper );
}

var ola = 0; //Loading screen
var goRight = false;

function Update(){

    /*---------------Loading Screen---------------*/
    if(RESOURCES_LOADED == false){
        requestAnimationFrame(Update);

        
       if(loadingScreen.box.position.x > -5 && ola < 100){
           loadingScreen.box.position.x -= 0.05;

           loadingScreen.box.rotation.x += 0.03;
           loadingScreen.box.rotation.y += 0.05;
           ola++;
       }else if(loadingScreen.box.position.x < 5){
           loadingScreen.box.position.x += 0.05;   

           loadingScreen.box.rotation.x += 0.03;
           loadingScreen.box.rotation.y += 0.05;
       }
        loadingScreen.box.position.y = Math.sin(loadingScreen.box.position.x);

        renderer.render(loadingScreen.scene, loadingScreen.camera);
        return;
    }
    /*--------------------------------------------*/

    requestAnimationFrame(Update);

    //Clock Settings for animations
    var time = Date.now() * 0.0005;
    var delta = clock.getDelta();

    //Rotation of the red cube
    mesh.rotation.x += 0.01;
    mesh.rotation.y += 0.02;

    //Add velocity to bullets
    for(var index = 0; index < bullets.length; index+=1){
        if(bullets[index] === undefined) continue;
        if(bullets[index].alive == false){
            bullets.splice(index, 1);
            continue;
        }
        bullets[index].position.add(bullets[index].velocity)
    }
    
    //Movement
    if(keyboard[87]){ //W
        //camera.position.x -= Math.sin(camera.rotation.y) * player.speed;
        //camera.position.z -= -Math.cos(camera.rotation.y) * player.speed;
        controls.moveForward(player.speed); 
    }
    if(keyboard[83]){ //S
        //camera.position.x += Math.sin(camera.rotation.y) * player.speed;
        //camera.position.z += -Math.cos(camera.rotation.y) * player.speed;
        controls.moveForward(-player.speed);
    }
    if(keyboard[65]){ //A
        //camera.position.x += Math.sin(camera.rotation.y + Math.PI/2) * player.speed;
        //camera.position.z += -Math.cos(camera.rotation.y + Math.PI/2) * player.speed;
        controls.moveRight(-player.speed);
    }
    if(keyboard[68]){ //D
        //camera.position.x += Math.sin(camera.rotation.y - Math.PI/2) * player.speed;
        //camera.position.z += -Math.cos(camera.rotation.y - Math.PI/2) * player.speed;
        controls.moveRight(player.speed);
    }
    if(keyboard[16] && keyboard[87]){ //Shift + W (Run)
        controls.moveForward(player.speed * 2);
    }

    //Fly
    if(keyboard[32] /*&& canJump == true*/){ //Spacebar
        //canJump = false;
        camera.position.y += 0.3;
    }
    if(keyboard[67]){ //Shift
        camera.position.y -= 0.2;
    }

    //Rotation
    if(keyboard[37]){ //Left arrow key
        camera.rotation.y -= player.turnSpeed;
    }
    if(keyboard[39]){ //Right arrow key
        camera.rotation.y += player.turnSpeed;
    }
    if(keyboard[38]){ //Up arrow key
        camera.rotation.x -= player.turnSpeed;
    }
    if(keyboard[40]){ //Down arrow key
        camera.rotation.x += player.turnSpeed;
    }

    //MouseClick
    if(isClicked == 1 && player.canShoot <= 0){
        //Play sfx
        sfx1.play();

        //Bullet fire
        /*var bullet = new THREE.Mesh(
            new THREE.SphereGeometry(0.05, 8, 8),
            new THREE.MeshBasicMaterial({color: 0xffffff})
        );*/

        var bullet = models.rocketLauncherAmmo.mesh.clone();
        bullet.rotation.set(
            meshes["weapon"].rotation.x,
            meshes["weapon"].rotation.y,
            meshes["weapon"].rotation.z
            );

        bullet.scale.set(10, 10, 10);
        
        bullet.position.set(
            meshes["weapon"].position.x,
            meshes["weapon"].position.y,
            meshes["weapon"].position.z
        );

        bullet.velocity = new THREE.Vector3(
            -Math.sin(camera.rotation.y),
            0,
            Math.cos(camera.rotation.y)
        );

        bullet.alive = true;
        setTimeout(
            function(){
                bullet.alive = false;
                scene.remove(bullet);
            },
            1000
        );
        bullets.push(bullet);
        scene.add(bullet);
        player.canShoot = 80;

        
        //Reset click
        isClicked = 0;
    }

        if(player.canShoot > -1)
        player.canShoot -= 1;

    //Update weapon position in relation to camera
    meshes["weapon"].position.set(
        camera.position.x - Math.sin(camera.rotation.y + Math.PI/6) * 0.3,
        camera.position.y - 0.3 + Math.sin(time * 2 + camera.position.x + camera.position.z) * 0.01,
        camera.position.z + Math.cos(camera.rotation.y + Math.PI/6) * 0.3
    );
    meshes["weapon"].rotation.set(
        camera.rotation.x,
        camera.rotation.y,
        camera.rotation.z
    );

    renderer.render(scene, camera);
}

//Turn off lights with button
function turnLightOff(){
    if(light.visible == true)
    light.visible = false;
    else
    light.visible = true;
}

function turnAmbientLightOff(){
    if(ambientLight.visible == true)
        ambientLight.visible = false;
    else
        ambientLight.visible = true;
}

function keyDown(event){
    keyboard[event.keyCode] = true;
}
function keyUp(event){
    keyboard[event.keyCode] = false;
}

window.addEventListener('keydown', keyDown);
window.addEventListener('keyup', keyUp);

window.onload = Start;