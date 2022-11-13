shroom_types = {
  "Poganka" : {
    stipe_shapes: [
      function(shroom_height) {
        return new THREE.CatmullRomCurve3( [
          new THREE.Vector3( 0, 0, 0 ),
          new THREE.Vector3( rnd(-1, 1), shroom_height * 0.25 + rnd(-0.1, 0.1), 0 ),
          new THREE.Vector3( rnd(-6, 6), shroom_height * 0.5 + rnd(-0.15, 0.15), rnd(-1, 1)),
          new THREE.Vector3( rnd(-6, 6), shroom_height * 0.75 + rnd(-0.1, 0.1), rnd(-2, 0)),
          new THREE.Vector3( rnd(-5, 5), shroom_height, rnd(-3, 1) ),
        ], closed=false )
      },
      function(shroom_height) {
        return new THREE.CatmullRomCurve3( [
          new THREE.Vector3( 0, 0, 0 ),
          new THREE.Vector3( rnd(-1, 1), shroom_height * 0.25 + rnd(-0.1, 0.1), 0 ),
          new THREE.Vector3( rnd(-1, 1), shroom_height * 0.5 + rnd(-0.15, 0.15), rnd(-1, 0)),
          new THREE.Vector3( rnd(-2, 2), shroom_height * 0.75 + rnd(-0.1, 0.1), rnd(-1, 0)),
          new THREE.Vector3( rnd(-3, 3), shroom_height, rnd(-2, 0) ),
        ], closed=false )
      },
      function(shroom_height) {
        return new THREE.CatmullRomCurve3( [
          new THREE.Vector3( 0, 0, 0 ),
          new THREE.Vector3( rnd(-1, 1), shroom_height * 0.25 + rnd(-0.1, 0.1), 0 ),
          new THREE.Vector3( rnd(-3, 3), shroom_height * 0.5 + rnd(-0.15, 0.15), rnd(-1, 1)),
          new THREE.Vector3( rnd(-3, 3), shroom_height * 0.75 + rnd(-0.1, 0.1), rnd(-2, 0)),
          new THREE.Vector3( rnd(-3, 3), shroom_height, rnd(-3, 1) ),
        ], closed=false )
      },
    ],
    stipe_radiuses: [
      function(this_stipe_base_radius) {
        return (a, t)=>{
          return this_stipe_base_radius + (1 - t)*(1 + rackrand())*0.2;
        }
      },
      function(this_stipe_base_radius) {
        var scl = rnd(0.5, 5);
        return (a, t)=>{
          return this_stipe_base_radius + Math.cos(t*2.5 - 0.8)**2 * scl + (1 - t)*(1 + rackrand())*0.2;
        }
      },
      function(this_stipe_base_radius) {
        return (a, t)=>{
          return this_stipe_base_radius * (1 + t*0.5) + (1 - t)*(1 + rackrand())*0.2;
        }
      },
    ],
    pileus_shapes: [
      function() {
        return new THREE.CatmullRomCurve3( [
          new THREE.Vector3( 0, 0.3, 0 ),
          new THREE.Vector3( 0.5, -0.1, 0),
          new THREE.Vector3( 1 + rnd(-0.1, 0.1), -0.3, 0),
          new THREE.Vector3( 2.8 + rnd(-0.3, 0.3), -1.62 + rnd(-0.5, 0.5), 0),
          new THREE.Vector3( 4.9 + rnd(-0.8, 0.8), -3.0 + rnd(-0.5, 0.5), 0),
          new THREE.Vector3( 8.5 + rnd(-1.5, 1.5), -6.5 + rnd(-0.5, 0.5), 0),
        ], closed=false );
      },
      function() {
        return new THREE.CatmullRomCurve3( [
          new THREE.Vector3( 0, -0.3, 0 ),
          new THREE.Vector3( 0.5, 0.1, 0),
          new THREE.Vector3( 1 + rnd(-0.1, 0.1), 0.3, 0),
          new THREE.Vector3( 2.8 + rnd(-0.3, 0.3), 1.62 + rnd(-0.5, 0.5), 0),
          new THREE.Vector3( 4.9 + rnd(-0.8, 0.8), 3.0 + rnd(-0.5, 0.5), 0),
          new THREE.Vector3( 8.5 + rnd(-1.5, 1.5), 6.5 + rnd(-0.5, 0.5), 0),
        ], closed=false );
      },
      function() {
        return new THREE.CatmullRomCurve3( [
          new THREE.Vector3( 0, 0.3, 0 ),
          new THREE.Vector3( 0.7, 0, 0),
          new THREE.Vector3( 1 + rnd(-0.1, 0.1), -0.5, 0),
          new THREE.Vector3( 2.8 + rnd(-0.3, 0.3), -1.62 + rnd(-0.5, 0.5), 0),
          new THREE.Vector3( 4.9 + rnd(-0.8, 0.8), -2.0 + rnd(-0.5, 0.5), 0),
          new THREE.Vector3( 8.5 + rnd(-1.5, 1.5), -3.5 + rnd(-0.5, 0.5), 0),
        ], closed=false );
      },
      function() {
        return new THREE.CatmullRomCurve3( [
          new THREE.Vector3( 0, 0.3, 0 ),
          new THREE.Vector3( 4 + rnd(-0.1, 0.1), -1.5, 0),
          new THREE.Vector3( 6.6 + rnd(-0.3, 0.3), -4.62 + rnd(-0.5, 0.5), 0),
          new THREE.Vector3( 6.8 + rnd(-0.1, 0.1), -6.0 + rnd(-0.5, 0.5), 0),
          new THREE.Vector3( 6.9 + rnd(-0.5, 0.5), -7.5 + rnd(-0.5, 0.5), 0),
        ], closed=false );
      },
      function() {
        return new THREE.CatmullRomCurve3( [
          new THREE.Vector3( 0, 0.3, 0 ),
          new THREE.Vector3( 3 + rnd(-0.1, 0.1), -0.5, 0),
          new THREE.Vector3( 4.6 + rnd(-0.3, 0.3), -3.62 + rnd(-0.5, 0.5), 0),
          new THREE.Vector3( 5.1 + rnd(-0.5, 0.5), -5.0 + rnd(-0.5, 0.5), 0),
          new THREE.Vector3( 5 + rnd(-0.5, 0.5), -6.5 + rnd(-0.5, 0.5), 0),
        ], closed=false );
      },
      function() {
        return new THREE.CatmullRomCurve3( [
          new THREE.Vector3( 0, 0.3, 0 ),
          new THREE.Vector3( 2 + rnd(-0.1, 0.1), -0.5, 0),
          new THREE.Vector3( 3.6 + rnd(-0.3, 0.3), -1.0 + rnd(-0.5, 0.5), 0),
          new THREE.Vector3( 5.8 + rnd(-0.1, 0.1), -2.3 + rnd(-0.5, 0.5), 0),
          new THREE.Vector3( 7.9 + rnd(-0.5, 0.5), -3.0 + rnd(-0.5, 0.5), 0),
        ], closed=false );
      },
    ],
    skirt_threshold: 0.1,
    stipe_colors: [
      function(c, v) {
        return (a, t)=>{
          var nn = rackrand() * 0.4;
          return [c[0] + t * v[0] + nn, c[1] + t * v[1] + nn, c[2] + t * v[2] + nn];
        }
      }
    ],
    pileus_colors: [
      function(c, v) {
        return (a, t)=>{
          var nn = rackrand() * 0.1;
          return [c[0] + t * v[0] + nn, c[1] + t * v[1] + nn, c[2] + t * v[2] + nn];
        }
      }
    ],
    plates_colors: [
      function(c, v) {
        return (a, t)=>{
          var nn = rackrand() * 0.1;
          return [c[0] + t * v[0] + nn, c[1] + t * v[1] + nn, c[2] + t * v[2] + nn];
        }
      }
    ]
  },




  "Psylocibe" : {
    stipe_shapes: [
      function(shroom_height) {
        return new THREE.CatmullRomCurve3( [
          new THREE.Vector3( 0, 0, 0 ),
          new THREE.Vector3( rnd(-1, 1), shroom_height * 0.25 + rnd(-0.1, 0.1), 0 ),
          new THREE.Vector3( rnd(-6, 6), shroom_height * 0.5 + rnd(-0.15, 0.15), rnd(-1, 1)),
          new THREE.Vector3( rnd(-6, 6), shroom_height * 0.75 + rnd(-0.1, 0.1), rnd(-2, 0)),
          new THREE.Vector3( rnd(-5, 5), shroom_height, rnd(-3, 1) ),
        ], closed=false )
      },
      function(shroom_height) {
        return new THREE.CatmullRomCurve3( [
          new THREE.Vector3( 0, 0, 0 ),
          new THREE.Vector3( rnd(-1, 1), shroom_height * 0.25 + rnd(-0.1, 0.1), 0 ),
          new THREE.Vector3( rnd(-2, 2), shroom_height * 0.5 + rnd(-0.15, 0.15), rnd(-1, 0)),
          new THREE.Vector3( rnd(-2, 2), shroom_height * 0.75 + rnd(-0.1, 0.1), rnd(-1, 0)),
          new THREE.Vector3( rnd(-3, 3), shroom_height, rnd(-2, 0) ),
        ], closed=false )
      },
    ],
    stipe_radiuses: [
      function(this_stipe_base_radius) {
        return (a, t)=>{
          return this_stipe_base_radius / 3 + (1 - t)*(1 + rackrand())*0.1;
        }
      },
      function(this_stipe_base_radius) {
        return (a, t)=>{
          return this_stipe_base_radius / 3 + (1 - t)*(1 + rackrand())*0.1;
        }
      }
    ],
    pileus_shapes: [
      function() {
        return new THREE.CatmullRomCurve3( [
          new THREE.Vector3( 0, 0.3, 0 ),
          new THREE.Vector3( 0.5, -0.1, 0),
          new THREE.Vector3( 1, -0.3, 0),
          new THREE.Vector3( 2.8 + rnd(-0.5, 0.5), -2.62 + rnd(-0.5, 0.5), 0),
          new THREE.Vector3( 4.9 + rnd(-0.8, 0.8), -4.0 + rnd(-0.5, 0.5), 0),
          new THREE.Vector3( 7.5 + rnd(-0.8, 0.8), -6.5 + rnd(-0.5, 0.5), 0),
        ], closed=false );
      },
      function() {
        return new THREE.CatmullRomCurve3( [
          new THREE.Vector3( 0, 0.3, 0 ),
          new THREE.Vector3( 0.5, -0.1, 0),
          new THREE.Vector3( 1, -0.3, 0),
          new THREE.Vector3( 1.8 + rnd(-0.5, 0.5), -1.62 + rnd(-0.5, 0.5), 0),
          new THREE.Vector3( 2.9 + rnd(-0.8, 0.8), -4.0 + rnd(-0.5, 0.5), 0),
          new THREE.Vector3( 4.5 + rnd(-0.8, 0.8), -6.5 + rnd(-0.5, 0.5), 0),
        ], closed=false );
      }
    ],
    skirt_threshold: 0.1,
    stipe_colors: [
      function(c, v) {
        return (a, t)=>{
          var nn = rackrand() * 0.4;
          return [c[0] + t * v[0] + nn, c[1] + t * v[1] + nn, c[2] + t * v[2] + nn];
        }
      }
    ],
    pileus_colors: [
      function(c, v) {
        return (a, t)=>{
          var nn = rackrand() * 0.1;
          return [c[0] + t * v[0] + nn, c[1] + t * v[1] + nn, c[2] + t * v[2] + nn];
        }
      }
    ],
    plates_colors: [
      function(c, v) {
        return (a, t)=>{
          var nn = rackrand() * 0.1;
          return [c[0] + t * v[0] + nn, c[1] + t * v[1] + nn, c[2] + t * v[2] + nn];
        }
      }
    ]
  }
}