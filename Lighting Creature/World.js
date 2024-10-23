// Global Variables
let canvas;
let gl;
let a_Position;
let a_UV;
let a_Color;
let u_Size;
let u_ModelMatrix;
let u_GlobalRotateMatrix;
let u_Sampler0;
let u_Sampler1;
let u_Sampler2;
let u_Sampler3;
let u_Sampler4;
let u_Sampler5;
let u_Sampler6;
let u_whichTexture;
let u_ProjectionMatrix;
let u_ViewMatrix;

// Global Variables UI
let g_globalAngleX = 0;
let g_globalAngleY = 0;
let g_globalAngleZ = 0;
let g_tailAngle = 0;
let g_tailSecondAngle = 0;
let g_bodyAngle = 0;

// Shift animation variables
let g_shiftAnimationOn = false;
let g_globalEyeColor = [173/255 ,125/255 ,103/255, 1.0];
let g_eyeAngleSpeed = 1;
let g_tailAngleSpeed = 3;
let g_bodyAngleSpeed = 3;

var startx = 0;
var starty = 0;

var first = 0;

var g_mainCamera;

var g_wkey = 0;
var g_skey = 0;
var g_akey = 0;
var g_dkey = 0;
var g_qkey = 0;
var g_ekey = 0;
var g_spacekey = 0;
var g_shiftkey = 0;

var g_gaurdian1dead = 0;
var g_gaurdian2dead = 0;
var g_gaurdian3dead = 0;
var g_gaurdian4dead = 0;


var g_upkey = 0;
var g_downkey = 0;
var g_rightkey = 0;
var g_leftkey = 0;

randarray = [];

function main() {
  LoadFromObjectFile('objects/pasta.obj', 1, [1,0,0,1]);
  LoadFromObjectFile('objects/cloud.obj', 2, [1,1,1,1]);
  LoadFromObjectFile('objects/seaweed.obj', 3, [0,1,0,1]);
  LoadFromObjectFile('objects/crab.obj', 4, [1,165/255,0,1]);
  LoadFromObjectFile('objects/coral.obj', 5, [211/255, 162/255, 185/255,1]);

  setupWebGL();

  connectVariablesToGLSL();

  addHtmlUi();

  g_mainCamera = new Camera(canvas);
  
  document.addEventListener('keydown', (ev) => { keydown(ev);} )
  document.addEventListener('keyup', (ev) => { keyup(ev);} )
  document.body.onclick = function(ev) { if (ev.button == 0) { doClick(ev); } }

  initTextures();

  // Specify the color for clearing <canvas>
  gl.clearColor(34/255, 59/255, 109/255, 1);

  canvas.onmousemove = function (ev) { if (ev.buttons == 1) {mouseCamMovement(ev);} }

  //canvas.onmousedown = function (ev) { [startx, starty] = [x, y] = convertCoordinatesEventToGL(ev); click(ev);}
  //canvas.onmousemove = function(ev) {if(!ev.shiftKey && ev.buttons == 1) { click(ev); }} ;

  findRandom();
  // console.log(randarray);

  requestAnimationFrame(tick);


  
}

function doClick(num){
  var x = Math.round(g_mainCamera.eye.elements[0]);
  var y = Math.round(g_mainCamera.eye.elements[1]);
  var z = Math.round(g_mainCamera.eye.elements[2]); 

  if (num == 2){
    console.log("hi")
    deleteBlock(x,y,z);
  }
  if (num == 1){
    console.log("bye")
    addBlock(x,y,z);
  }
}


var g_startTime = performance.now()/1000.0;
var g_seconds=performance.now()/1000.0-g_startTime;

function tick() {

  g_seconds = performance.now()/1000.0-g_startTime;

  updateAnimationAngles();

  renderScene();

  controlCam();

  requestAnimationFrame(tick);
}

function updateAnimationAngles() {
  g_tailAngle = 45*Math.sin(g_tailAngleSpeed*g_seconds);
  g_tailSecondAngle = 45*Math.sin(g_tailAngleSpeed*g_seconds);
  g_bodyAngle = 10*Math.sin(g_bodyAngleSpeed*g_seconds);
}

function renderScene(){

  var startTime = performance.now();

  gl.uniformMatrix4fv(u_ProjectionMatrix, false, g_mainCamera.projMat.elements);

  gl.uniformMatrix4fv(u_ViewMatrix, false, g_mainCamera.viewMat.elements);
  //console.log(g_mainCamera.viewMat.elements)



  var globalRotMat = new Matrix4()
  // globalRotMat.rotate(g_globalAngleX, 1 , 0, 0);
  // globalRotMat.rotate(g_globalAngleY, 0, 1, 0);
  // globalRotMat.rotate(g_globalAngleZ, 0, 0, 1);

  var x = Math.round(g_mainCamera.eye.elements[0]);
  var y = Math.round(g_mainCamera.eye.elements[1]);
  var z = Math.round(g_mainCamera.eye.elements[2]);
  // console.log(x, y, z);
  if (-1 < x && x < 1 && -1 < y && y < 1 && 6 < z && z < 8){
    g_gaurdian1dead = 1;
  }
  if (-12 < x && x < -8 && -1 < y && y < 1 && -1 < z && z < 2){
    g_gaurdian2dead = 1;
  }
  if (11 < x && x < 15 && -1 < y && y < 1 && 11 < z && z < 15){
    g_gaurdian3dead = 1;
  }
  if (10 < x && x < 14 && -1 < y && y < 1 && -14 < z && z < -10){
    g_gaurdian4dead = 1;
  }
  gl.uniformMatrix4fv(u_GlobalRotateMatrix, false, globalRotMat.elements);

  // Clear <canvas>
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  if (g_gaurdian1dead == 0){
    renderGuardianParts(0, 7, 90);
  }
  if (g_gaurdian2dead == 0){
    renderGuardianParts(-10, .5, 0);
  }
  if (g_gaurdian3dead == 0){
    renderGuardianParts(13, 13, 45);
  }
  if (g_gaurdian4dead == 0){
    renderGuardianParts(12, -12, 120);
  }
  

  renderParts();

  var duration = performance.now() - startTime;
  sendTextToHTML(" ms: " + Math.floor(duration) + " fps: " + Math.floor(10000/duration)/10, "counter");
  
}

function sendTextToHTML(text, htmlID){
  var htmlElem = document.getElementById(htmlID);
  if (!htmlElem) {
    console.log("Failed to get " + htmlID + " from HTML");
    return;
  }
  htmlElem.innerHTML = text;
}

function randomNumber(min, max) {
  return Math.random() * (max - min) + min;
}

function findRandom(){
  for (var j = 0; j < 19; j++){
    randarray.push(randomNumber(-14.5, 14.5));
    randarray.push(randomNumber(-14.5, 14.5));
    randarray.push(Math.random() * 360);
  }
}

function renderParts(){

  if (g_objDoc1 != null){
    g_objDoc1.matrix.setTranslate(-3, -0.9, 0)
    g_objDoc1.matrix.scale(0.01, 0.01, 0.01)
    g_objDoc1.matrix.rotate(90, 0, 1, 0);
    g_objDoc1.render();
  }

  // if (g_objDoc2 != null){
  //   g_objDoc2.matrix.setTranslate(0, -15, 25);
  //   g_objDoc2.matrix.rotate(30, 0, 1, 0)
  //   g_objDoc2.matrix.scale(100, 100, 100);
  //   g_objDoc2.render();
  //   g_objDoc2.matrix.setTranslate(0, -15, -30);
  //   g_objDoc2.matrix.rotate(20, 0, 1, 0)
  //   g_objDoc2.matrix.scale(100, 100, 100);
  //   g_objDoc2.render();
  //   g_objDoc2.matrix.setTranslate(-25, -15, 25);
  //   g_objDoc2.matrix.rotate(70, 0, 1, 0)
  //   g_objDoc2.matrix.scale(100, 100, 100);
  //   g_objDoc2.render();
  //   g_objDoc2.matrix.setTranslate(25, -15, 25);
  //   g_objDoc2.matrix.rotate(230, 0, 1, 0)
  //   g_objDoc2.matrix.scale(100, 100, 100);
  //   g_objDoc2.render();
  // }
  // if (g_objDoc3 != null){

  //   // -14.5, -6.5 // 14.5, 6.5

  //   for (var i = 0; i < 48; i += 3){
  //     g_objDoc3.matrix.setTranslate((randarray[i]), -0.68, randarray[i+1]);
  //     g_objDoc3.matrix.rotate(randarray[i+2] * 360, 0, 1, 0);
  //     g_objDoc3.render();
  //   }
    
  // }

  // if (g_objDoc4 != null){
  //   for (var j = 0; j < 9; j += 3){
  //     g_objDoc4.matrix.setTranslate((randarray[j+48]), -0.68, randarray[j+48+1]);
  //     g_objDoc4.matrix.rotate(randarray[j+48+2] * 360, 0, 1, 0);
  //     g_objDoc4.matrix.scale(0.001, 0.001, 0.001)
  //     g_objDoc4.render();
      
  //   }
  // }

  // if (g_objDoc5 != null){
  //   g_objDoc5.matrix.setTranslate(7.5, 0.15, 0);
  //   g_objDoc5.render();
  //   g_objDoc5.matrix.setTranslate(7.5, 0.15, 0);
  //   g_objDoc5.render();
  //   g_objDoc5.matrix.setTranslate(-10.5, 0.15, 5);
  //   g_objDoc3.matrix.rotate(70, 0, 1, 0);
  //   g_objDoc5.render();
  // }

  



  drawMap();

  // DRAW FLOOR
  var floor = new Cube(0.8, 0.9, 1, 0.6, 0.9, 0.6);
  floor.color = [61/255, 66/255, 113/255, 1.0];
  floor.textureNum = 1;
  floor.matrix.translate(0.0 ,-501, 0.0);
  floor.matrix.scale(32, 500, 32);
  floor.matrix.translate(-.5, 0, -.5)   
  floor.render()

  // DRAW SKYBOX
  var sky = new Cube(0.9,1,1,1,1,1);
  sky.color = [0, 1, 1, 1.0];
  sky.matrix.scale(1000,1000,1000)
  sky.textureNum = 0;
  sky.cubetype = 1;
  sky.matrix.translate(-.5, -.35,-.5);
  sky.render();

  var bodywater = new Cube(1, 1, 1, 1, 1, 1);
  bodywater.color = [0, 0.5, 1, 0.6];
  bodywater.matrix.translate(-15.01 , -1.1, -15.01);
  bodywater.textureNum = -2;
  bodywater.cubetype = 0;
  bodywater.matrix.scale(31, 1.95, 31)
  bodywater.render();
}