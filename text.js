function dcText(txt, hWorldTxt, hWorldAll, hPxTxt, fgcolor, bgcolor) { // the routine
  // txt is the text.
  // hWorldTxt is world height of text in the plane.
  // hWorldAll is world height of whole rectangle containing the text.
  // hPxTxt is px height of text in the texture canvas; larger gives sharper text.
  // The plane and texture canvas are created wide enough to hold the text.
  // And wider if hWorldAll/hWorldTxt > 1 which indicates padding is desired.
  var kPxToWorld = hWorldTxt/hPxTxt;                // Px to World multplication factor
  // hWorldTxt, hWorldAll, and hPxTxt are given; get hPxAll
  var hPxAll = Math.ceil(hWorldAll/kPxToWorld);     // hPxAll: height of the whole texture canvas
  // create the canvas for the texture
  var txtcanvas = document.createElement("canvas"); // create the canvas for the texture
  var ctx = txtcanvas.getContext("2d");
  ctx.font = "italic " + hPxTxt + "px Cursive";        
  // now get the widths
  var wPxTxt = ctx.measureText(txt).width;         // wPxTxt: width of the text in the texture canvas
  var wWorldTxt = wPxTxt*kPxToWorld;               // wWorldTxt: world width of text in the plane
  var wWorldAll = wWorldTxt+(hWorldAll-hWorldTxt); // wWorldAll: world width of the whole plane
  var wPxAll = Math.ceil(wWorldAll/kPxToWorld);    // wPxAll: width of the whole texture canvas
  // next, resize the texture canvas and fill the text
  txtcanvas.width =  wPxAll*1.5;
  txtcanvas.height = hPxAll*1.5;
  if (bgcolor != undefined) { // fill background if desired (transparent if none)
    ctx.strokeStyle = "#" + bgcolor.toString(16).padStart(6, '0');
    ctx.lineWidth = 5;
    ctx.strokeRect( wPxAll*0.2,hPxAll*0.05, wPxAll*1.1,hPxAll*1.4);
  } 
  ctx.textAlign = "center";
  ctx.textBaseline = "middle"; 
  ctx.fillStyle = "#" + fgcolor.toString(16).padStart(6, '0'); // fgcolor
  ctx.font = "italic " + hPxTxt + "px Cursive";   // needed after resize
  ctx.fillText(txt, wPxAll/2*1.5, hPxAll/2*1.5); // the deed is done
  // next, make the texture
  var texture = new THREE.Texture(txtcanvas); // now make texture
  texture.minFilter = THREE.LinearFilter;     // eliminate console message
  texture.needsUpdate = true;                 // duh
  // and make the world plane with the texture
  geometry = new THREE.PlaneGeometry(wWorldAll, hWorldAll);
  var material = new THREE.MeshBasicMaterial( 
    { side:THREE.DoubleSide, map:texture, transparent:true, opacity:1.0 } );
  // and finally, the mesh
  var mesh = new THREE.Mesh(geometry, material);
  mesh.wWorldTxt = wWorldTxt; // return the width of the text in the plane
  mesh.wWorldAll = wWorldAll; //    and the width of the whole plane
  mesh.wPxTxt = wPxTxt;       //    and the width of the text in the texture canvas
                              // (the heights of the above items are known)
  mesh.wPxAll = wPxAll;       //    and the width of the whole texture canvas
  mesh.hPxAll = hPxAll;       //    and the height of the whole texture canvas
  mesh.ctx = ctx;             //    and the 2d texture context, for any glitter
  // console.log(wPxTxt, hPxTxt, wPxAll, hPxAll);
  // console.log(wWorldTxt, hWorldTxt, wWorldAll, hWorldAll);
  return mesh;
}