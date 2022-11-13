rackrand = fxrand;

let maID = Math.floor(rackrand() * 200000);
let shroom_name = get_valid_fungi_name(rackrand);

FORCE_MIN = false;
FORCE_MAX = false;
rndscale = 1;

function rnd(lb, ub) {
  if (FORCE_MIN) return (ub + lb) / 2 - (ub - lb) * rndscale / 2;
  if (FORCE_MAX) return (ub + lb) / 2 + (ub - lb) * rndscale / 2;
  return (ub + lb) / 2 - (ub - lb) * rndscale / 2 + (ub - lb) * rndscale * rackrand();
}

// background_color = 0x7f6f5f + (0x10 * rackrand() << 16);
background_color = 0x4f4f4f + (0x20 * rackrand() << 16) + (0x20 * rackrand() << 8) + (0x20 * rackrand());
[renderer, outline, controls, composer, composer2048] = create_scene(shroom_name, maID, background_color);
shrooms_num = 0;

shroom_height = rnd(15, 40);
stipe_base_radius = rnd(0.01, 0.05) * shroom_height;
pileus_base_scale = rnd(0.8, 1.2);


var shroom_type_names = Object.keys(shroom_types);
shroom_type_name = shroom_type_names[Math.floor(rackrand() * shroom_type_names.length)];
shroom_type = shroom_types[shroom_type_name];

stipe_idx = Math.floor(shroom_type.stipe_shapes.length * rackrand());
stipe_color_idx = Math.floor(shroom_type.stipe_colors.length * rackrand());

pileus_idx = Math.floor(shroom_type.pileus_shapes.length * rackrand());
pileus_color_idx = Math.floor(shroom_type.pileus_colors.length * rackrand());

plates_color_idx = Math.floor(shroom_type.plates_colors.length * rackrand());

dots_num = (rackrand() < 0.1) * rnd(30, 100);
hasskirt = rackrand() > shroom_type.skirt_threshold;

stipe_base_color = [rnd(0.1, 0.5), rnd(0.1, 0.5), rnd(0.1, 0.5)];
stipe_color_var = [0.4, 0.4, 0.4];

pileus_base_color = [rnd(0.1, 0.6), rnd(0.1, 0.6), rnd(0.1, 0.6)];
pileus_color_var = [0.2, 0.2, 0.2];

plates_base_color = [rnd(0.1, 0.4), rnd(0.1, 0.4), rnd(0.1, 0.4)];
plates_color_var = [0.4, 0.4, 0.4];

plates_num = rnd(20, 100);

pileus_surfnoise_scale = rnd(0.2, 3);
pileus_surfnoise_octave = rnd(1, 3);

pileus_radnoise_octave = rnd(1, 4);
pileus_radnoise_scale = rnd(0.2, 0.8);

pileus_thickness = rnd(0.3, 1.3);

for (var i = 0; i < 5; i ++) {

  // console.log(i);

  NOISE.seed(rackrand());

  this_stipe_base_radius = stipe_base_radius + rnd(-stipe_base_radius / 10, stipe_base_radius / 10);

  rndscale = shroom_height / 40;

  stipe_shape = shroom_type.stipe_shapes[stipe_idx](shroom_height);
  stipe_radius = shroom_type.stipe_radiuses[stipe_idx](this_stipe_base_radius);
  pileus_shape = shroom_type.pileus_shapes[pileus_idx](shroom_height, this_stipe_base_radius);
  rndscale = 1;
  
  stipe_color = shroom_type.stipe_colors[stipe_color_idx](stipe_base_color, stipe_color_var);
  pileus_color = shroom_type.pileus_colors[pileus_color_idx](pileus_base_color, pileus_color_var);
  plates_color = shroom_type.plates_colors[plates_color_idx](plates_base_color, plates_color_var);

  // rndscale = 1;

  // pileus_shape = new THREE.CatmullRomCurve3( [
  //   new THREE.Vector3( 0, 0.3, 0 ),
  //   new THREE.Vector3( 3, -1.2, 0),
  //   new THREE.Vector3( 8.5, -3.5, 0),
  //   new THREE.Vector3( 9.5, -3.7, 0),
  // ], closed=false );

  base_pos = new THREE.Vector3(-15 + 30 * rackrand(), -15, -40 + 30 * rackrand());

  pileus_surface_power = rackrand() * 10;

  shroom_params = {
    position: base_pos,
    stipe_shape: stipe_shape,
    stipe_radius: stipe_radius,
    stipe_color: stipe_color,
    pileus_shape: pileus_shape,
    pileus_radnoise:(a, t)=>{
      return -Math.abs(NOISE.perlin2(t * Math.cos(a) * pileus_radnoise_octave, t * Math.sin(a) * pileus_radnoise_octave) * Math.pow(Math.abs(a - Math.PI) / Math.PI, pileus_surface_power) * pileus_radnoise_scale);
    },
    pileus_angnoise:(a, t)=>{
      return NOISE.perlin2(t * Math.cos(a) * 1, t * Math.sin(a) * 1) * 0.21;
    },
    pileus_surfnoise:(a, t)=>{
      return NOISE.perlin2(t * Math.cos(a) * pileus_surfnoise_octave, t * Math.sin(a) * pileus_surfnoise_octave) * pileus_surfnoise_scale * t + NOISE.perlin2(t * Math.cos(a) * 20, t * Math.sin(a) * 20) * 0.05;
    },
    pileus_color: pileus_color,
    pileus_scale: pileus_base_scale + rnd(-0.3, 0.3 * shroom_height / 30),
    pileus_thickness: pileus_thickness,
    plates_height: 0.7,
    plates_num: plates_num,
    plates_resolution: 50,
    pileus_rotation_offset: rackrand() * 180,
    plates_surfnoise:(a, t)=>{
      return NOISE.perlin2(t * Math.cos(a) * 2, t * Math.sin(a) * 2) * 1 * t;
    },
    plates_color: plates_color,
    dots_num: dots_num,
    dots_radius: 0.2,
    hasskirt: hasskirt,
    // skirt_scale: 0.8,
    skirt_color:(a, t)=>{
      return stipe_color(a, 1-t);
    },
    skirt_radnoise:(a, t)=>{
      return -Math.abs(NOISE.perlin2(t * Math.cos(a) * 3, t * Math.sin(a) * 3) * 0.55);
    },
    skirt_surfnoise:(a, t)=>{
      return NOISE.perlin2(t * Math.cos(a) * 2, t * Math.sin(a) * 2) * 1 * t + NOISE.perlin2(t * Math.cos(a) * 20, t * Math.sin(a) * 20) * 0.05;
    },
  };

  shrooms_num += create_shroom_and_add_to_scene(shroom_params);

}

window.$fxhashFeatures = {
  "Quantity": shrooms_num,
  "Name": shroom_name,
  "ID in atlas": maID,
  "Poisonous": rackrand() > 0.2,
  "Annulus": hasskirt,
  "Scales": dots_num > 0,
}

controls.update();
composer.render();

// function animate() {
//   requestAnimationFrame( animate );
//   controls.update();
//   // outline.render( scene, camera );
//   composer.render();
//   // renderer.render( scene, camera );
// }
// animate();