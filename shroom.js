function shroom({position, rotation, convex,
                 stipe_radius, stipe_shape, stipe_rSegments, stipe_vSegments, stipe_color,
                 pileus_shape, pileus_radnoise, pileus_angnoise, pileus_surfnoise, pileus_rSegments, 
                 pileus_cSegments, pileus_rimSegments, pileus_thickness, pileus_scale, pileus_color,
                 pileus_rotation_offset,
                 plates_height, plates_num, plates_resolution, plates_surfnoise, plates_color,
                 dots_num, dots_radius,
                 hasskirt, skirt_height, skirt_radnoise, skirt_angnoise, skirt_surfnoise, skirt_rotation_offset, skirt_shape,
                 skirt_color, skirt_scale, skirt_thickness
              }) {
  if (!position) position = new THREE.Vector3(0,0,0);
  if (!rotation) rotation = new THREE.Quaternion();
  if (!convex) convex = false;
  if (!stipe_radius) stipe_radius = (a, t) => {return 1};
  if (!stipe_shape) stipe_shape = new THREE.CatmullRomCurve3( [ new THREE.Vector3( 0, 0, 0 ), new THREE.Vector3( 0, 10, 0 ), ], closed=false );
  if (!stipe_rSegments) stipe_rSegments = 20;
  if (!stipe_vSegments) stipe_vSegments = 40;
  if (!stipe_color) stipe_color = (a, t) => {return [1, 1, 1]};
  
  if (!pileus_shape) pileus_shape = new THREE.CatmullRomCurve3( [ new THREE.Vector3( 0, 0, 0 ), new THREE.Vector3( 3, -1, 0 ), ], closed=false );
  if (!pileus_radnoise) pileus_radnoise = (a, t) => {return 0};
  if (!pileus_angnoise) pileus_angnoise = (a, t) => {return 0};
  if (!pileus_surfnoise) pileus_surfnoise = (a, t) => {return 0};
  if (!pileus_color) pileus_color = (a, t) => {return [1, 1, 1]};
  if (!pileus_rSegments) pileus_rSegments = 30;
  if (!pileus_cSegments) pileus_cSegments = 40;
  if (!pileus_rimSegments) pileus_rimSegments = 10;
  if (!pileus_thickness) pileus_thickness = 0.2;
  if (!pileus_rotation_offset) pileus_rotation_offset = 0;
  if (!pileus_scale) pileus_scale = 1;

  if (!plates_height) plates_height = 0.8;
  if (!plates_num) plates_num = 30;
  if (!plates_resolution) plates_resolution = 20;
  if (!plates_surfnoise) plates_surfnoise = (a, t) => {return 0};
  if (!plates_color) plates_color = (a, t) => {return [1, 1, 1]};

  if (!dots_num) dots_num = 0;
  if (!dots_radius) dots_radius = 1;

  if (!hasskirt) hasskirt = false;
  if (!skirt_height) skirt_height = 0.9;//plates_height;
  if (!skirt_radnoise) skirt_radnoise = (a, t) => {return 0};
  if (!skirt_angnoise) skirt_angnoise = (a, t) => {return 0};
  if (!skirt_surfnoise) skirt_surfnoise = (a, t) => {return 0};
  if (!skirt_rotation_offset) skirt_rotation_offset = 0;
  if (!skirt_shape) skirt_shape = new THREE.CatmullRomCurve3( [ new THREE.Vector3( 0, 0, 0 ), new THREE.Vector3(stipe_radius(0, skirt_height - 0.1), -stipe_shape.getPointAt(1).sub(stipe_shape.getPointAt(skirt_height - 0.1)).y, 0), ], closed=false );
  if (!skirt_color) skirt_color = (a, t) => {return [1, 1, 1]};
  if (!skirt_scale) skirt_scale = 1;
  if (!skirt_thickness) skirt_thickness = 0.1;

  // STIPE

  var stipe = new THREE.BufferGeometry();

  var stipe_points = [];
  var stipe_indices = [];
  var stipe_colors = [];
  var local_points;
  var local_translation;
  var tangent;

  var q = new THREE.Quaternion();

  for (var t = 0; t < 1; t += 1 / stipe_vSegments) {
    var curve = new THREE.CatmullRomCurve3( [
      new THREE.Vector3( 0, 0, stipe_radius(0, t)),
      new THREE.Vector3( stipe_radius(Math.PI / 2, t), 0, 0 ),
      new THREE.Vector3( 0, 0, -stipe_radius(Math.PI, t)),
      new THREE.Vector3( -stipe_radius(Math.PI * 1.5, t), 0, 0 ),
    ], closed=true, curveType='catmullrom', tension=0.75);

    local_points = curve.getPoints( stipe_rSegments );
    tangent = stipe_shape.getTangentAt(t);
    q.setFromUnitVectors( new THREE.Vector3( 0, 1, 0 ), tangent );
    local_translation = stipe_shape.getPointAt(t);

    for (var i = 0; i < local_points.length; i++) {
      var a = 2 * Math.PI / local_points.length * i;
      var v = local_points[i];
      v.applyQuaternion( rotation )
      v.applyQuaternion( q );
      stipe_points.push(v.x + local_translation.x, v.y + local_translation.y, v.z + local_translation.z);
      stipe_colors.push(...stipe_color(a, t))
    }
  }

  for (var i = 0; i < stipe_vSegments - 1; i ++) {
    for (var j = 0; j < stipe_rSegments; j ++) {
      stipe_indices.push(i * (stipe_rSegments + 1) + j,
                         i * (stipe_rSegments + 1) + j + 1,
                         (i + 1) * (stipe_rSegments + 1) + j);

      stipe_indices.push(i * (stipe_rSegments + 1) + j + 1,
                         (i + 1) * (stipe_rSegments + 1) + j + 1,
                         (i + 1) * (stipe_rSegments + 1) + j);
    }
  }

  stipe.setAttribute('position', new THREE.BufferAttribute(new Float32Array(stipe_points), 3));
  stipe.setAttribute('color', new THREE.BufferAttribute(new Float32Array(stipe_colors), 3));
  stipe.setIndex(stipe_indices);
  stipe.computeVertexNormals();
  stipe.translate(position.x, position.y, position.z);

  // PILEUS

  var pileus = new THREE.BufferGeometry();
  const pileus_rotation = stipe_shape.getTangentAt(1);
  const pileus_position = stipe_shape.getPointAt(1).add(pileus_rotation.clone().multiplyScalar(1));

  var pileus_points = [ pileus_shape.getPoint(0).x, pileus_shape.getPoint(0).y, pileus_shape.getPoint(0).z ];
  var pileus_indices = [];
  var pileus_normals = [];
  var pileus_colors = [0,0,0];

  var pileus_rotation_offset_q = (new THREE.Quaternion()).setFromAxisAngle(pileus_rotation, pileus_rotation_offset);

  const z1 = new THREE.Vector3(0,0,1);

  q.setFromUnitVectors( new THREE.Vector3( 0, 1, 0 ), pileus_rotation );

  var rim_da = new THREE.Quaternion();
  rim_da.setFromAxisAngle ( new THREE.Vector3(0, 0, -1), Math.PI / pileus_rimSegments )
  var rim_local_vector = new THREE.Vector3(0,0,0);

  function pileus_surface(a, t, rim_it=0) {
    var noisyt = t * (1 + pileus_radnoise(a, t));
    if (noisyt > 1) noisyt = 1;
    if (noisyt < 0) noisyt = 0;
    var shape_point = pileus_shape.getPointAt(noisyt).multiplyScalar(pileus_scale);
    var tangent = pileus_shape.getTangentAt(noisyt);
    var noisev = new THREE.Vector3(0,0,0);
    noisev.crossVectors(z1, tangent);

    var rim_local_vector = tangent.multiplyScalar(pileus_thickness).multiplyScalar(rim_it / pileus_rimSegments);
    if (rim_it == 0) rim_local_vector = new THREE.Vector3(0,0,0);
    for (var k = 0; k < rim_it; k ++) rim_local_vector.applyQuaternion(rim_da);

    var surface_point = new THREE.Vector3(0,0,0);
    surface_point.x = Math.cos(a + pileus_angnoise(a, noisyt)) * (shape_point.x + rim_local_vector.x);
    surface_point.y = shape_point.y + rim_local_vector.y;
    surface_point.z = Math.sin(a + pileus_angnoise(a, noisyt)) * (shape_point.x + rim_local_vector.x);

    var surfnoise_val = pileus_surfnoise(a, noisyt);
    surface_point.applyQuaternion(q);
    surface_point.applyQuaternion(pileus_rotation_offset_q);
    surface_point.x = surface_point.x + noisev.x * Math.cos(a) * surfnoise_val;
    surface_point.y = surface_point.y + noisev.y * surfnoise_val;
    surface_point.z = surface_point.z + noisev.x * Math.sin(a) * surfnoise_val;

    return surface_point;
  }

  // PILEUS SURFACE
  for (var i = 1; i <= pileus_rSegments; i++) {
    var t = Math.pow(1 / pileus_rSegments * i, 0.9);
    for (var j = 0; j < pileus_cSegments; j++) {
      var a = Math.PI * 2 / pileus_cSegments * j;
      var surface_point = pileus_surface(a, t);
      pileus_points.push(surface_point.x, surface_point.y, surface_point.z);
      pileus_colors.push(...pileus_color(a, t));
    }
  }

  // RIM
  for (var i = 1; i < pileus_rimSegments; i++) {
    for (var j = 0; j < pileus_cSegments; j++) {
      var a = Math.PI * 2 / pileus_cSegments * j;
      var surface_point = pileus_surface(a, 1, i);
      pileus_points.push(surface_point.x, surface_point.y, surface_point.z);
      pileus_colors.push(...pileus_color(a, 1));
    }
  }

  for (var i = 0; i < pileus_rSegments + pileus_rimSegments - 2; i ++) {
    if (i == 0) for (var j = 0; j < pileus_cSegments; j ++) pileus_indices.push(0, (j + 1) % pileus_cSegments + 1, j + 1);
    for (var j = 0; j < pileus_cSegments; j ++) {
      pileus_indices.push(i * pileus_cSegments + 1 + j,
                          (i + 1) * pileus_cSegments + 1 + (j + 1) % pileus_cSegments,
                          (i + 1) * pileus_cSegments + 1 + j);

      pileus_indices.push(i * pileus_cSegments + 1 + j,
                          i * pileus_cSegments + 1 + (j + 1) % pileus_cSegments,
                          (i + 1) * pileus_cSegments + 1 + (j + 1) % pileus_cSegments);
    }
  }

  // for (var i = 0; i < pileus_cSegments; i += 5) {
  //   for (var j = 0; j < pileus_rSegments - 1; j ++) {
  //     pileus_indices.push(0);
  //     pileus_indices.push(j * pileus_cSegments + i + 1);
  //     pileus_indices.push((j + 1) * pileus_cSegments + i + 1);
  //   }
  // }

  pileus.setAttribute('position', new THREE.BufferAttribute(new Float32Array(pileus_points), 3));
  pileus.setAttribute('color', new THREE.Float32BufferAttribute(pileus_colors, 3));
  pileus.setIndex(pileus_indices);
  pileus.computeVertexNormals();
  pileus.translate(position.x + pileus_position.x, position.y + pileus_position.y, position.z + pileus_position.z);

  // SKIRT
  var skirt = new THREE.BufferGeometry();

  const skirt_rotation = stipe_shape.getTangentAt(skirt_height);
  const skirt_position = stipe_shape.getPointAt(skirt_height);

  var skirt_points = [ skirt_shape.getPoint(0).x, skirt_shape.getPoint(0).y, skirt_shape.getPoint(0).z ];
  var skirt_points_v3 = [ skirt_shape.getPoint(0), ];
  var skirt_indices = [];
  var skirt_normals = [];
  var skirt_colors = [0,0,0];

  var skirt_rSegments = Math.max(Math.floor(20 * stipe_radius(0, skirt_height)), 5);
  var skirt_cSegments = Math.max(Math.floor(40 * stipe_radius(0, skirt_height)), 5);
  var skirt_rimSegments = 5;

  var skirt_q = new THREE.Quaternion();
  skirt_q.setFromUnitVectors( new THREE.Vector3( 0, 1, 0 ), skirt_rotation );

  var skirt_rotation_offset_q = (new THREE.Quaternion()).setFromAxisAngle(skirt_rotation, skirt_rotation_offset);

  var skirt_rim_da = new THREE.Quaternion();
  skirt_rim_da.setFromAxisAngle ( new THREE.Vector3(0, 0, -1), Math.PI / skirt_rimSegments )

  function skirt_surface(a, t, rim_it=0) {
    var noisyt = t * (1 + skirt_radnoise(a, t));
    if (noisyt > 1) noisyt = 1;
    if (noisyt < 0) noisyt = 0;
    var shape_point = skirt_shape.getPointAt(noisyt).multiplyScalar(skirt_scale);
    // shape_point.add(new THREE.Vector3(stipe_radius(skirt_height),0,0));
    var tangent = skirt_shape.getTangentAt(noisyt);
    var noisev = new THREE.Vector3(0,0,0);
    noisev.crossVectors(z1, tangent);

    var rim_lv = tangent.multiplyScalar(skirt_thickness).multiplyScalar(rim_it / skirt_rimSegments);
    if (rim_it == 0) rim_lv = new THREE.Vector3(0,0,0);
    for (var k = 0; k < rim_it; k ++) rim_lv.applyQuaternion(skirt_rim_da);

    var surface_point = new THREE.Vector3(0,0,0);
    surface_point.x = Math.cos(a + skirt_angnoise(a, noisyt)) * (shape_point.x + rim_local_vector.x);
    surface_point.y = shape_point.y + rim_local_vector.y;
    surface_point.z = Math.sin(a + skirt_angnoise(a, noisyt)) * (shape_point.x + rim_local_vector.x);
    // console.log(surface_point)

    var surfnoise_val = skirt_surfnoise(a, noisyt);
    surface_point.applyQuaternion(skirt_q);
    surface_point.applyQuaternion(skirt_rotation_offset_q);
    surface_point.x = surface_point.x + noisev.x * Math.cos(a) * surfnoise_val;
    surface_point.y = surface_point.y + noisev.y * surfnoise_val;
    surface_point.z = surface_point.z + noisev.x * Math.sin(a) * surfnoise_val;

    return surface_point;
  }

  if (hasskirt) {
    
    for (var i = 1; i <= skirt_rSegments; i++) {
      var t = Math.pow(1 / skirt_rSegments * i, 0.9);
      for (var j = 0; j < skirt_cSegments; j++) {
        var a = Math.PI * 2 / skirt_cSegments * j;
        var surface_point = skirt_surface(a, t);
        skirt_points.push(surface_point.x, surface_point.y, surface_point.z);
        skirt_points_v3.push(surface_point);
        skirt_colors.push(...skirt_color(a, t));
      }
    }

    for (var i = 1; i < skirt_rimSegments; i++) {
      for (var j = 0; j < skirt_cSegments; j++) {
        var a = Math.PI * 2 / skirt_cSegments * j;
        var surface_point = skirt_surface(a, 1, i);
        skirt_points.push(surface_point.x, surface_point.y, surface_point.z);
        // skirt_points_v3.push(surface_point);
        skirt_colors.push(...skirt_color(a, 1));
      }
    }

    for (var i = 0; i < skirt_rSegments + skirt_rimSegments - 2; i ++) {
      if (i == 0) for (var j = 0; j < skirt_cSegments; j ++) skirt_indices.push(0, (j + 1) % skirt_cSegments + 1, j + 1);
      for (var j = 0; j < skirt_cSegments; j ++) {
        skirt_indices.push(i * skirt_cSegments + 1 + j,
                          (i + 1) * skirt_cSegments + 1 + (j + 1) % skirt_cSegments,
                          (i + 1) * skirt_cSegments + 1 + j);

        skirt_indices.push(i * skirt_cSegments + 1 + j,
                          i * skirt_cSegments + 1 + (j + 1) % skirt_cSegments,
                          (i + 1) * skirt_cSegments + 1 + (j + 1) % skirt_cSegments);
      }
    }

    // skirt = new THREE.ConvexGeometry( skirt_points_v3 );
    skirt.setAttribute('position', new THREE.BufferAttribute(new Float32Array(skirt_points), 3));
    skirt.setAttribute('color', new THREE.Float32BufferAttribute(skirt_colors, 3));
    skirt.setIndex(skirt_indices);
    skirt.computeVertexNormals();
    skirt.translate(position.x + skirt_position.x, position.y + skirt_position.y, position.z + skirt_position.z);
  } else {
    skirt.setAttribute('position', new THREE.BufferAttribute(new Float32Array(skirt_points), 3));
    skirt.translate(position.x + skirt_position.x, position.y + skirt_position.y, position.z + skirt_position.z);
  }

  // DOTS
  var dots = new THREE.BufferGeometry();
  var bufgeoms = [];
  for (var i = 0; i < dots_num; i++) {
    var dots_points = [];
    var a = rackrand() * Math.PI * 2;
    var t = rackrand();
    var dot_center = pileus_surface(a, t);
    for (var j = 0; j < 35; j++) {
      dots_points.push(new THREE.Vector3(
        dot_center.x + (1 - rackrand() * 2) * dots_radius * pileus_scale, 
        dot_center.y + (1 - rackrand() * 2) * dots_radius * pileus_scale,
        dot_center.z + (1 - rackrand() * 2) * dots_radius * pileus_scale));
    }
    var dots_geometry = new THREE.ConvexGeometry( dots_points );
    // var dots_mesh = new THREE.Mesh(dots_geometry);
    // dots_mesh.updateMatrix();
    bufgeoms.push(dots_geometry);
  }

  if (bufgeoms.length > 0) dots = THREE.BufferGeometryUtils.mergeBufferGeometries(bufgeoms);

  dots.translate(position.x + pileus_position.x, position.y + pileus_position.y, position.z + pileus_position.z);

  // PLATES

  var plates_points = [];
  var plates_indices = [];
  var indices_offset=0;
  var plates_normals = [];
  var plates_colors = [];
  var plate_shape;
  var plates = new THREE.BufferGeometry();
  const y1 = new THREE.Vector3(0,1,0);
  var plate_offset = new THREE.Vector3(0,0,0);

  function get_plate_shape(a, t, c=1) {
    var plate_shape_0 = stipe_shape.getPointAt(plates_height + (1 - plates_height) * (1 - t)).sub(stipe_shape.getPointAt(1));
    var plate_shape_1 = pileus_surface(a, 0.9).add(stipe_shape.getTangent(1).multiplyScalar(-0.5 * pileus_scale));

    var plate_shape_points = [plate_shape_0];
    const points_num = 15;

    for (var m = 0; m < points_num; m ++) {
      var d = m / points_num;
      var surf_m = pileus_surface(a, d * 0.9).add(stipe_shape.getTangent(1).multiplyScalar(-0.5 * pileus_scale));
      var plate_base_m = plate_shape_0.clone().add(plate_shape_1.clone().sub(plate_shape_0.clone()).multiplyScalar(d));
      var plate_shape_m = plate_base_m.sub(surf_m);
      if (plate_shape_m.y > 0) plate_shape_m.multiplyScalar(-1);
      plate_shape_points.push(surf_m.add(plate_shape_m.normalize().multiplyScalar(c)));
    }

    plate_shape_points.push(plate_shape_1);

    var plate_shape = new THREE.CatmullRomCurve3( plate_shape_points, closed=false, curveType='catmullrom', tension=0.5);

    return plate_shape;
  }

  const divider = 10;

  for (var i = 0; i < plates_num; i++) {
    indices_offset = Math.floor(plates_points.length / 3);
    var a = 2 * Math.PI / plates_num * i;
    plate_shape = get_plate_shape(a, 0.9, 1);
    var plate_point;
    for (var j = 0; j < plates_resolution; j ++) {
      plate_point = plate_shape.getPointAt(j / plates_resolution);
      plates_points.push(plate_point.x, plate_point.y, plate_point.z);
      plates_colors.push(...plates_color(a, j / plates_resolution));
    }

    for (var k = 1; k < plates_resolution / divider; k ++) {
      plate_shape = get_plate_shape(a, (1 - k / plates_resolution * divider / 2) * 0.9, 1 - k / plates_resolution * divider);
      for (var j = 0; j < plates_resolution; j ++) {
        plate_point = plate_shape.getPointAt(j / plates_resolution);
        tangent = plate_shape.getTangentAt(j / plates_resolution);
        plate_offset.crossVectors(y1, tangent).normalize().multiplyScalar(0.1);
        var plate_surfnoise = new THREE.Vector3(0,0,0);
        plate_surfnoise.crossVectors(y1, tangent).normalize().multiplyScalar(plates_surfnoise(2 * Math.PI / plates_num * i, j / plates_resolution));
        plates_points.push(plate_point.x + plate_surfnoise.x + plate_offset.x, plate_point.y + plate_surfnoise.y + plate_offset.y, plate_point.z + plate_surfnoise.z + plate_offset.z);
        plates_points.push(plate_point.x + plate_surfnoise.x - plate_offset.x, plate_point.y + plate_surfnoise.y - plate_offset.y, plate_point.z + plate_surfnoise.z - plate_offset.z);
        plates_colors.push(...plates_color(a, j / plates_resolution));
        plates_colors.push(...plates_color(a, j / plates_resolution));
      }
    }

    for (var j = 0; j < plates_resolution - 1; j ++) {
      plates_indices.push(indices_offset + j, indices_offset + plates_resolution + j*2, indices_offset + j + 1);
      plates_indices.push(indices_offset + j + 1, indices_offset + plates_resolution + j*2, indices_offset + plates_resolution + j*2 + 2);

      plates_indices.push(indices_offset + j, indices_offset + j + 1, indices_offset + plates_resolution + j*2 + 1);
      plates_indices.push(indices_offset + j + 1, indices_offset + plates_resolution + j*2 + 3, indices_offset + plates_resolution + j*2 + 1);
    }

    for (var k = 0; k < plates_resolution / divider - 2; k ++) {
      for (var j = 0; j < plates_resolution - 1; j ++) {
        var local_offset = (k * 2 + 1) * plates_resolution + indices_offset;
        plates_indices.push(local_offset + j*2, local_offset + plates_resolution*2 + j*2, local_offset + (j+1)*2);
        plates_indices.push(local_offset + (j+1)*2, local_offset + plates_resolution*2 + j*2, local_offset + plates_resolution*2 + (j+1)*2);

        plates_indices.push(local_offset + j*2 + 1, local_offset + (j+1)*2 + 1, local_offset + plates_resolution*2 + j*2 + 1);
        plates_indices.push(local_offset + (j+1)*2 + 1, local_offset + plates_resolution*2 + (j+1)*2 + 1, local_offset + plates_resolution*2 + j*2 + 1);
      }
    }
  }

  for (var i = 0; i < plates_num - 1; i++) {
    var local_offset_1 = i * (2 * (plates_resolution / divider - 1) + 1) * plates_resolution + (2 * (plates_resolution / divider - 2) + 1) * plates_resolution;
    var local_offset_2 = ((i + 1) % plates_num) * (2 * (plates_resolution / divider - 1) + 1) * plates_resolution + (2 * (plates_resolution / divider - 2) + 1) * plates_resolution;

    for (var j = 0; j < plates_resolution - 1; j ++) {
      plates_indices.push(local_offset_1 + j*2 + 1, local_offset_1 + j*2 + 3, local_offset_2 + j*2);
      plates_indices.push(local_offset_1 + j*2 + 3, local_offset_2 + j*2 + 3, local_offset_2 + j*2);
    }
  }

  plates.setAttribute('position', new THREE.BufferAttribute(new Float32Array(plates_points), 3));
  plates.setAttribute('color', new THREE.Float32BufferAttribute(plates_colors, 3));
  plates.setIndex(plates_indices);
  plates.computeVertexNormals();
  plates.translate(position.x + pileus_position.x, position.y + pileus_position.y, position.z + pileus_position.z);

  if (convex) {
    var stipe_points_vector3 = [];
    for (var i = 0; i < stipe_points.length; i += 3) stipe_points_vector3.push(new THREE.Vector3(stipe_points[i], stipe_points[i+1], stipe_points[i+2]));
    const stipe_geometry = new THREE.ConvexGeometry( stipe_points_vector3 );
    stipe_geometry.translate(position.x, position.y, position.z)

    var pileus_points_vector3 = [];
    for (var i = 0; i < pileus_points.length; i += 3) pileus_points_vector3.push(new THREE.Vector3(pileus_points[i], pileus_points[i+1], pileus_points[i+2]));
    const pileus_geometry = new THREE.ConvexGeometry( pileus_points_vector3 );
    pileus_geometry.translate(position.x + pileus_position.x, position.y + pileus_position.y, position.z + pileus_position.z);

    var plates_points_vector3 = [];
    for (var i = 0; i < plates_points.length; i += 3) plates_points_vector3.push(new THREE.Vector3(plates_points[i], plates_points[i+1], plates_points[i+2]));
    const plates_geometry = new THREE.ConvexGeometry( plates_points_vector3 );
    plates_geometry.translate(position.x + pileus_position.x, position.y + pileus_position.y, position.z + pileus_position.z);

    return [stipe_geometry, pileus_geometry, plates_geometry, dots, skirt];
  }

  return [stipe, pileus, plates, dots, skirt];
}


function grass(position, size, color) {

  var grass = new THREE.BufferGeometry();

  var grass_res = 5;

  var grass_spline = new THREE.CatmullRomCurve3( [
    new THREE.Vector3( 0, 0, 0 ),
    new THREE.Vector3( rnd(-0.5, 0.5) * size, 2 * size, 0 ),
    new THREE.Vector3( rnd(-1, 1) * size, 4 * size, 0 ),
  ], closed=false )

  var grass_points = [];
  var grass_indices = [];
  var z1 = new THREE.Vector3(0,0,1);
  var orth = new THREE.Vector3(0,0,0);

  for (var i = 0; i < grass_res; i++) {
    var t = i / grass_res;
    var bpoint = grass_spline.getPointAt(t);
    var tangent = grass_spline.getTangentAt(t);
    orth.crossVectors(z1, tangent);
    grass_points.push(bpoint.x, bpoint.y, bpoint.z);
    var left = orth.clone().normalize().multiplyScalar(-0.2 * (1 - t + 0.01)**2);
    var right = orth.clone().normalize().multiplyScalar(0.2 * (1 - t + 0.01)**2);
    grass_points.push(bpoint.x + left.x, bpoint.y + left.y, bpoint.z + left.z);
    grass_points.push(bpoint.x + right.x, bpoint.y + right.y, bpoint.z + right.z);
    grass_points.push(bpoint.x, bpoint.y, bpoint.z - 0.1);
  }

  for (var i = 0; i < grass_res - 1; i ++) {
    grass_indices.push(i * 4, (i + 1) * 4 + 1, (i + 1) * 4);
    grass_indices.push(i * 4, i * 4 + 1, (i + 1) * 4 + 1);
    
    grass_indices.push(i * 4, (i + 1) * 4 + 2, i * 4 + 2);
    grass_indices.push(i * 4, (i + 1) * 4, (i + 1) * 4 + 2);

    grass_indices.push(i * 4 + 1, i * 4 + 3, (i + 1) * 4 + 3);
    grass_indices.push(i * 4 + 1, (i + 1) * 4 + 3, (i + 1) * 4 + 1);

    grass_indices.push(i * 4 + 2, (i + 1) * 4 + 3, i * 4 + 3);
    grass_indices.push(i * 4 + 2, (i + 1) * 4 + 2, (i + 1) * 4 + 3);
  }

  grass.setAttribute('position', new THREE.BufferAttribute(new Float32Array(grass_points), 3));
  // grass.setAttribute('color', new THREE.Float32BufferAttribute(skirt_colors, 3));
  grass.setIndex(grass_indices);
  grass.computeVertexNormals();
  grass.translate(position.x, position.y, position.z);

  return grass;
}