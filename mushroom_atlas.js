let wp = document.documentElement.clientWidth;
let hp = document.documentElement.clientHeight;

collidableMeshList = [];
var scene;

function create_scene(shroom_name, maID, background_color) {
  scene = new THREE.Scene();
  var camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
  // const camera = new THREE.OrthographicCamera( wp / - 30, wp / 30, hp / 30, hp / - 30, 1, 1000 );
  camera.position.z = 40;
  camera.position.y = 0;
  var camera2048 = new THREE.PerspectiveCamera( 75, 1, 0.1, 1000 );
  // const camera = new THREE.OrthographicCamera( wp / - 30, wp / 30, hp / 30, hp / - 30, 1, 1000 );
  camera2048.position.z = camera.position.z;
  camera2048.position.y = camera.position.y;

  var renderer = new THREE.WebGLRenderer({antialias: true});
  renderer.setClearColor( 0xffffef, 1 );
  renderer.shadowMap.enabled = true;
  renderer.autoClear = false;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  var controls = new THREE.OrbitControls( camera, renderer.domElement );
  renderer.setSize( window.innerWidth, window.innerHeight );
  renderer.outputEncoding = THREE.sRGBEncoding;
  document.body.appendChild( renderer.domElement );

  var color = 0xFFFFFF;
  var intensity = 0.7;
  var light1 = new THREE.AmbientLight(color, intensity);
  scene.add(light1);

  var light2 = new THREE.DirectionalLight( 0xffffff, 0.4, 1000 );
  light2.position.set( 100, 10, 100 ).normalize();
  light2.castShadow = true;
  //Set up shadow properties for the light
  light2.shadow.mapSize.width = 512; // default
  light2.shadow.mapSize.height = 512; // default
  light2.shadow.camera.near = 0.5; // default
  light2.shadow.camera.far = 500; // default
  light2.shadow.camera.left = -100; // default
  light2.shadow.camera.right = 100; // default
  light2.shadow.camera.bottom = -100; // default
  light2.shadow.camera.top = 100; // default
  scene.add(light2);

  // BACKGROUND
  planeGeometry = new THREE.PlaneGeometry( 1000, 1000, 10, 10 );
  planeMaterial = new THREE.MeshToonMaterial( { color: background_color } );
  planeMaterial.opacity = 0.02;
  plane = new THREE.Mesh( planeGeometry, planeMaterial );
  plane.position.set(0, 0, -100);
  scene.add( plane );

  outline = new THREE.OutlineEffect( renderer , {thickness: 0.01, alpha: 1, defaultColor: [0.1, 0.1, 0.1]});
  var composer = new THREE.EffectComposer(outline);
  var composer2048 = new THREE.EffectComposer(outline);
  var renderPass = new THREE.RenderPass( scene, camera );
  var renderPass2048 = new THREE.RenderPass( scene, camera2048 );
  composer.addPass( renderPass );
  composer2048.addPass( renderPass2048 );

  var filmPass = new THREE.FilmPass(
      0.20,   // noise intensity
      0.025,  // scanline intensity
      648,    // scanline count
      false,  // grayscale
  );

  var filmPass2048 = new THREE.FilmPass(
      0.40,   // noise intensity
      0.025,  // scanline intensity
      965,    // scanline count
      false,  // grayscale
  );

  composer.addPass(filmPass);
  composer2048.addPass(filmPass2048);

  geometry = new THREE.BoxGeometry( 200, 200, 1 );
  material = new THREE.MeshBasicMaterial( {color: background_color} );
  cube = new THREE.Mesh( geometry, material );
  cube.position.set(0, 0, -99);
  scene.add( cube );

  mesh = dcText(shroom_name, 4, 4, 250, 0x1f1f1f);
  mesh.rotation.set(0, 0, -0.01 + rackrand() * 0.02);
  mesh.position.set(0,-20,0);
  scene.add(mesh);

  mesh = dcText("Mushroom atlas. Item #" + maID, 2, 2, 100, 0x1f1f1f);
  mesh.rotation.set(0, 0, -0.01 + rackrand() * 0.02);
  mesh.position.set(0,-25,0);
  scene.add(mesh);

  collidableMeshList = [];

  for (var i = 0; i < 150; i ++) {
    var alpha = rackrand() * Math.PI * 2;
    var rad = rnd(0, 30);
    grass_geom = grass(new THREE.Vector3(rad * Math.cos(alpha), rnd(-16, -15), -30 + rad * Math.sin(alpha)), rnd(0.7, 1.5), 0);
    // grass_material = new THREE.MeshPhongMaterial( { color: 0x000000 , wireframe: true} );
    grass_material = new THREE.MeshToonMaterial( { color: 0x304030 + (Math.floor(0x20 * rackrand()) << 8) } );
    // grass_material = new THREE.MeshToonMaterial( { color: 0xffffff, gradientMap: gradientMap, vertexColors: true } );
    grass_mesh = new THREE.Mesh( grass_geom, grass_material );
    scene.add(grass_mesh);
  }

  return [renderer, outline, controls, composer, composer2048];
}

function no_collisions(test_mesh, collidableMeshList) {

  if (collidableMeshList.length < 1) return 1;
  for (var vertexIndex = 0; vertexIndex < test_mesh.geometry.attributes.position.array.length; vertexIndex++)
  {       
    var localVertex = new THREE.Vector3().fromBufferAttribute(test_mesh.geometry.attributes.position, vertexIndex).clone();
    var globalVertex = localVertex.applyMatrix4(test_mesh.matrix);
    var directionVector = globalVertex.sub( test_mesh.position );

    var ray = new THREE.Raycaster( test_mesh.position, directionVector.clone().normalize() );
    var collisionResults = ray.intersectObjects( collidableMeshList );
    if ( collisionResults.length > 0 && collisionResults[0].distance < directionVector.length() ) 
    {
      return 0;
    }
  }
  return 1;
}

function create_shroom_and_add_to_scene (shroom_param) {
  shroom_param.stipe_rSegments = 200;
  shroom_param.stipe_vSegments = 200;
  shroom_param.pileus_rSegments = 200;
  shroom_param.pileus_cSegments = 270;
  [stipe, pileus, plates, dots, skirt] = shroom(shroom_param);
  shroom_param.stipe_rSegments = 4;
  shroom_param.stipe_vSegments = 10;
  shroom_param.pileus_rSegments = 3;
  shroom_param.pileus_cSegments = 10;
  shroom_param.plates_num = 5;
  shroom_param.plates_resolution = 2;
  shroom_param.convex = true;
  shroom_param.hasskirt = false;
  [stipe_collision, pileus_collision, plates_collision, dots_collision, skirt_collision] = shroom(shroom_param);

  const colors_num = 5;
  const colors = new Uint8Array( colors_num );
  const format = ( renderer.capabilities.isWebGL2 ) ? THREE.RedFormat : THREE.LuminanceFormat;
  for (var j = 0; j < colors_num; j ++) colors[j] = j / colors_num * 256;
  const gradientMap = new THREE.DataTexture( colors, colors.length, 1, format );
  gradientMap.needsUpdate = true; 

  stipe_material = new THREE.MeshPhongMaterial( { color: 0x000000 , wireframe: true} );
  stipe_material = new THREE.MeshToonMaterial( { color: 0xffffff } );
  stipe_material = new THREE.MeshToonMaterial( { color: 0xffffff, gradientMap: gradientMap, vertexColors: true } );
  stipe_mesh = new THREE.Mesh( stipe, stipe_material );
  stipe_mesh_simplified = new THREE.Mesh( stipe_collision, stipe_material );

  pileus_material = new THREE.MeshPhongMaterial( { color: 0xffffff , wireframe: true} );
  pileus_material = new THREE.MeshPhongMaterial( { color: 0xffffff } );
  // pileus_material = new THREE.MeshToonMaterial( { color: 0x6f5f4f } );
  pileus_material = new THREE.MeshToonMaterial( { color: 0xffffff, gradientMap: gradientMap, side: THREE.DoubleSide, vertexColors: true} );
  pileus_mesh = new THREE.Mesh( pileus, pileus_material );
  pileus_mesh_simplified = new THREE.Mesh( pileus_collision, pileus_material );

  plates_material = new THREE.MeshPhongMaterial( { color: 0x0f0000 , wireframe: true} );
  plates_material = new THREE.MeshToonMaterial( { color: 0x4f3f2f } );
  plates_material = new THREE.MeshToonMaterial( { color: 0xffffff, gradientMap: gradientMap, vertexColors: true} );
  plates_mesh = new THREE.Mesh( plates, plates_material );
  plates_mesh_simplified = new THREE.Mesh( plates_collision, pileus_material );

  // dots_material = new THREE.MeshPhongMaterial( { color: 0x000000 , wireframe: true} );
  dots_material = new THREE.MeshToonMaterial( { color: 0xffffff } );
  // dots_material = new THREE.MeshToonMaterial( { color: 0xffffff, gradientMap: gradientMap, vertexColors: true } );
  dots_mesh = new THREE.Mesh( dots, dots_material );
  // scene.add( dots_mesh );

  skirt_material = new THREE.MeshToonMaterial( { color: 0xffffff } );
  skirt_material = new THREE.MeshToonMaterial( { color: 0xffffff, gradientMap: gradientMap, vertexColors: true } );
  skirt_mesh = new THREE.Mesh( skirt, skirt_material );

  if (no_collisions(stipe_mesh_simplified, collidableMeshList) && 
      no_collisions(pileus_mesh_simplified, collidableMeshList) && 
      no_collisions(plates_mesh_simplified, collidableMeshList)) {
    scene.add( stipe_mesh );
    scene.add( pileus_mesh );
    scene.add( plates_mesh );
    scene.add( dots_mesh );
    scene.add( skirt_mesh );
    // scene.add( stipe_mesh_simplified );
    // scene.add( pileus_mesh_simplified );
    // scene.add( plates_mesh_simplified );
    collidableMeshList.push(pileus_mesh_simplified, plates_mesh_simplified, stipe_mesh_simplified);
    return true;
  } 
  return false;
}