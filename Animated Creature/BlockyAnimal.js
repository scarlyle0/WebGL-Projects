// Vertex shader program
var VSHADER_SOURCE = `
  attribute vec4 a_Position;
  attribute vec4 a_Color;
  varying vec4 v_Color;
  uniform mat4 u_ModelMatrix;
  uniform mat4 u_GlobalRotateMatrix;
  //uniform mat4 u_ProjectionMatrix;
  //uniform mat4 u_ViewMatrix;
  void main() {
    v_Color = a_Color;
    gl_Position = u_GlobalRotateMatrix * u_ModelMatrix * a_Position;
  }`

// Fragment shader program
var FSHADER_SOURCE = `
  precision mediump float;
  varying vec4 v_Color;
  void main() {
    gl_FragColor = v_Color;
  }`

// Global Variables
let canvas;
let gl;
let a_Position;
let a_Color;
let u_Size;
let u_ModelMatrix;
let u_GlobalRotateMatrix;

function setupWebGL(){
  // Retrieve <canvas> element
  canvas = document.getElementById('webgl');

  gl = canvas.getContext("webgl", { preserveDrawingBuffer: true});
  if (!gl) {
    console.log('Failed to get the rendering context for WebGL');
    return;
  }
  gl.enable(gl.DEPTH_TEST);
}

function connectVariablesToGLSL(){
    // Initialize shaders
    if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
      console.log('Failed to intialize shaders.');
      return;
    }
  
    // Get the storage location of a_Position
    a_Position = gl.getAttribLocation(gl.program, 'a_Position');
    if (a_Position < 0) {
      console.log('Failed to get the storage location of a_Position');
      return;
    }

    a_Color = gl.getAttribLocation(gl.program, 'a_Color');
    if (a_Color < 0) {
      console.log('Failed to get the storage location of a_Color');
      return;
    }

    // Get the storage location of u_ModelMatrix
    u_ModelMatrix = gl.getUniformLocation(gl.program, 'u_ModelMatrix');
    if (!u_ModelMatrix) {
      console.log('Failed to get the storage location of u_ModelMatrix');
      return;
    }

    // Get the storage location of u_ModelMatrix
    u_GlobalRotateMatrix = gl.getUniformLocation(gl.program, 'u_GlobalRotateMatrix');
    if (!u_GlobalRotateMatrix) {
      console.log('Failed to get the storage location of u_GlobalRotateMatrix');
      return;
    }

    // u_ProjectionMatrix = gl.getUniformLocation(gl.program, 'u_ProjectionMatrix');
    // if (!u_ProjectionMatrix){
    //   console.log('Failed to get the storage location of u_ProjectionMatrix');
    //   return false;
    // }

    // u_ViewMatrix = gl.getUniformLocation(gl.program, 'u_ViewMatrix');
    // if (!u_ViewMatrix){
    //   console.log('Failed to get the storage location of u_ViewMatrix');
    //   return false;
    // }

    // set initial value for this matrix as identity
    var identityM = new Matrix4();
    gl.uniformMatrix4fv(u_ModelMatrix, false, identityM.elements);
}

// Global Variables UI
let g_globalAngleX = 30;
let g_globalAngleY = 65;
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


let g_AnimationOn = false;
let startx = 0;
let starty = 0;

function addHtmlUi(){

  document.getElementById('animationOn').onclick = function () { g_AnimationOn = true; requestAnimationFrame(tick); };
  document.getElementById('animationOff').onclick = function () { g_AnimationOn = false; };

  document.getElementById('angleSlideX').addEventListener('mousemove', function () { g_globalAngleX = parseFloat(this.value); renderScene(); });
  document.getElementById('angleSlideY').addEventListener('mousemove', function () { g_globalAngleY = parseFloat(this.value); renderScene(); });
  document.getElementById('angleSlideZ').addEventListener('mousemove', function () { g_globalAngleZ = parseFloat(this.value); renderScene(); });
  document.getElementById('tailSlide').addEventListener('mousemove', function () { g_tailAngle = this.value; renderScene(); });
  document.getElementById('tailSlideSecond').addEventListener('mousemove', function () { g_tailSecondAngle = this.value; renderScene() });
  document.getElementById('bodySlide').addEventListener('mousemove', function () { g_bodyAngle = this.value; renderScene(); });
  
}

function main() {

  setupWebGL();

  connectVariablesToGLSL();

  addHtmlUi();

  // Specify the color for clearing <canvas>
  gl.clearColor(34/255, 59/255, 109/255, 1);

  canvas.onmousedown = function (ev) { [startx, starty] = [x, y] = convertCoordinatesEventToGL(ev); click(ev);}
  canvas.onmousemove = function(ev) {if(!ev.shiftKey && ev.buttons == 1) { click(ev); }} ;

  requestAnimationFrame(tick);

}

function click(ev) {

  if(ev.shiftKey && g_AnimationOn){
    if (g_shiftAnimationOn == false){
      g_globalEyeColor = [1, 0, 0, 1];
      g_eyeAngleSpeed = 3;
      g_tailAngleSpeed = 6;
      g_bodyAngleSpeed = 6;
      g_shiftAnimationOn = true;
    } else if (g_shiftAnimationOn == true){
      g_globalEyeColor = [173/255 ,125/255 ,103/255, 1.0];
      g_eyeAngleSpeed = 1;
      g_tailAngleSpeed = 3;
      g_bodyAngleSpeed = 3;
      g_shiftAnimationOn = false;
    }
  }
  // Extract the event click and return it in WebGL coordinates
  let [x,y] = convertCoordinatesEventToGL(ev);
  let factor = 100;

  let dy = factor * (y - starty);
  g_globalAngleX = (g_globalAngleX + dy) % 360;
  if (Math.round(g_globalAngleX < 0)){
    g_globalAngleX += 360;
  }

  let dx = factor * (x - startx);
  g_globalAngleY = (g_globalAngleY + dx) % 360;
  if (Math.round(g_globalAngleY < 0)){
    g_globalAngleY += 360;
  }

     
  document.getElementById("angleSlideX").value = g_globalAngleX;
  document.getElementById("angleSlideY").value = g_globalAngleY;

  starty = y;
  startx = x;

  if (g_AnimationOn == false){
     renderScene();
   }
}


function convertCoordinatesEventToGL(ev){
  var x = ev.clientX; // x coordinate of a mouse pointer
  var y = ev.clientY; // y coordinate of a mouse pointer
  var rect = ev.target.getBoundingClientRect();
  
  x = ((x - rect.left) - canvas.width/2)/(canvas.width/2);
  y = (canvas.height/2 - (y - rect.top))/(canvas.height/2);

  return ([x,y]);
}


var g_startTime = performance.now()/1000.0;
var g_seconds=performance.now()/1000.0-g_startTime;

function tick() {

  g_seconds = performance.now()/1000.0-g_startTime;

  updateAnimationAngles();

  renderScene();

  reqtick = requestAnimationFrame(tick);

  if (g_AnimationOn == false){
    cancelAnimationFrame(reqtick);
  }
}

function updateAnimationAngles() {
  g_tailAngle = 45*Math.sin(g_tailAngleSpeed*g_seconds);
  g_tailSecondAngle = 45*Math.sin(g_tailAngleSpeed*g_seconds);
  g_bodyAngle = 10*Math.sin(g_bodyAngleSpeed*g_seconds);
}

function renderScene(){

  // gl.uniformMatrix4fv(u_ProjectionMatrix, false, g_mainCamera.projMat.elements);

  // gl.uniformMatrix4fv(u_ViewMatrix, false, g_mainCamera.viewMat.elements);

  var startTime = performance.now();

  var globalRotMat = new Matrix4()
  globalRotMat.rotate(g_globalAngleX, -1 , 0, 0);
  globalRotMat.rotate(g_globalAngleY, 0, 1, 0);
  globalRotMat.rotate(g_globalAngleZ, 0, 0, 1);
  gl.uniformMatrix4fv(u_GlobalRotateMatrix, false, globalRotMat.elements);

  // Clear <canvas>
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  renderGuardianParts();

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


let flipspike1 = false;
let flipspike2 = false;
let flipspike3 = false;
let flipspike4 = false;
let flipspike5 = false;
let flipspike6 = false;
let flipspike7 = false;
let flipspike8 = false;
let flipspike9 = false;
let flipspike10 = false;
let flipspike11 = false;
let flipspike12 = false;

function renderGuardianParts(){
  var body = new Cube(0.8, 0.9, 1, 0.6, 0.9, 0.6);
  body.color = [171/200, 169/200, 159/200, 1.0];
  body.matrix.translate(-.5, -.4 + Math.sin(.5*g_seconds)*0.3, -.5);
  body.matrix.rotate(-g_bodyAngle, 0, 1, 0);


  var bodymat = new Matrix4(body.matrix);
  var bodymat2 = new Matrix4(body.matrix);
  var bodymat3 = new Matrix4(body.matrix);
  var bodymat4 = new Matrix4(body.matrix);
  var bodymat5 = new Matrix4(body.matrix);
  var bodymat6 = new Matrix4(body.matrix);
  var facemat1 = new Matrix4(body.matrix);
  var facemat2 = new Matrix4(body.matrix);
  var facemat3 = new Matrix4(body.matrix);
  var tailmat1 = new Matrix4(body.matrix);
  var spikemat1 = new Matrix4(body.matrix);
  var spikemat2 = new Matrix4(body.matrix);
  var spikemat3 = new Matrix4(body.matrix);
  var spikemat4 = new Matrix4(body.matrix);
  var spikemat5 = new Matrix4(body.matrix);
  var spikemat6 = new Matrix4(body.matrix);
  var spikemat7 = new Matrix4(body.matrix);
  var spikemat8 = new Matrix4(body.matrix);
  var spikemat9 = new Matrix4(body.matrix);
  var spikemat10 = new Matrix4(body.matrix);
  var spikemat11 = new Matrix4(body.matrix);
  var spikemat12 = new Matrix4(body.matrix);
  var conemat = new Matrix4(body.matrix);

  body.matrix.scale(.65*0.8, .65*0.8, .65*0.8);
  body.render();

  // bodypart
  var bodypart1 = new Cube(0.8, 0.9, 1, 0.6, 0.9, 0.6);
  bodypart1.color = [140/255, 137/255, 125/255, 1.0];
  bodypart1.matrix = bodymat;
  bodypart1.matrix.translate(0.056, .059, -.059);
  bodypart1.matrix.scale(.4, .4, .4);
  bodypart1.render();

  var bodypart2 = new Cube(0.8, 0.9, 1, 0.6, 0.9, 0.6);
  bodypart2.color = [140/255, 137/255, 125/255, 1.0];
  bodypart2.matrix = bodymat2;
  bodypart2.matrix.translate(.18, .05, 0.06);
  bodypart2.matrix.scale(.4, .4, .4);
  bodypart2.render();

  var bodypart3 = new Cube(0.8, 0.9, 1, 0.6, 0.9, 0.6);
  bodypart3.color = [140/255, 137/255, 125/255, 1.0];
  bodypart3.matrix = bodymat3;
  bodypart3.matrix.translate(-.061, .05, 0.06);
  bodypart3.matrix.scale(.4, .4, .4);
  bodypart3.render(); 

  var bodypart4 = new Cube(0.8, 0.9, 1, 0.6, 0.9, 0.6);
  bodypart4.color = [140/255, 137/255, 125/255, 1.0];
  bodypart4.matrix = bodymat4;
  bodypart4.matrix.translate(0.056, .059, .18);
  bodypart4.matrix.scale(.4, .4, .4);
  bodypart4.render();

  var bodypart5 = new Cube(0.8, 0.9, 1, 0.6, 0.9, 0.6);
  bodypart5.color = [140/255, 137/255, 125/255, 1.0];
  bodypart5.matrix = bodymat5;
  bodypart5.matrix.translate(.06, -.067, 0.06);
  bodypart5.matrix.scale(.4, .4, .4);
  bodypart5.render();

  var bodypart6 = new Cube(0.8, 0.9, 1, 0.6, 0.9, 0.6);
  bodypart6.color = [140/255, 137/255, 125/255, 1.0];
  bodypart6.matrix = bodymat6;
  bodypart6.matrix.translate(.06, .186, 0.06);
  bodypart6.matrix.scale(.4, .4, .4);
  bodypart6.render();

  // SPIKES

  // Z SPIKES

  var spike1 = new Cube(0.8, 0.9, 1, 0.6, 0.9, 0.6);
  spike1.color = [36/255, 38/255, 60/255, 1.0];
  spike1.matrix = spikemat1;
  if (g_shiftAnimationOn){
    if (flipspike1 == false){
      spike1.matrix.translate(.195, .405, 0.03);
      flipspike1 = true;
    } else {
      spike1.matrix.translate(.205, .395, 0.03);
      flipspike1 = false;
    }
  } else {
    spike1.matrix.translate(.2, .4, 0.03);
  }
  spike1.matrix.rotate(45, -1, 0, 0)
  var matforsubspike1 = new Matrix4(spike1.matrix);
  spike1.matrix.scale(.11, 0.3, .11);
  spike1.render();

  var subspike1 = new Cube(0.8, 0.9, 1, 0.6, 0.9, 0.6);
  subspike1.color = [75/255, 75/255, 84/255, 1.0];
  subspike1.matrix = matforsubspike1;
  subspike1.matrix.translate(-0.003, 0.3, 0);
  subspike1.matrix.scale(.11, 0.1, .11);
  subspike1.render();

  var spike2 = new Cube(0.8, 0.9, 1, 0.6, 0.9, 0.6);
  spike2.color = [36/255, 38/255, 60/255, 1.0];
  spike2.matrix = spikemat2;
  if (g_shiftAnimationOn){
    if (flipspike2 == false){
      spike2.matrix.translate(.195, 0.025, 0.09);
      flipspike2 = true;
    } else {
      spike2.matrix.translate(.205, 0.035, 0.09);
      flipspike2 = false;
    }
  } else {
    spike2.matrix.translate(.2, 0.03, 0.09);
  }
  spike2.matrix.rotate(225, 1, 0, 0)
  var matforsubspike2 = new Matrix4(spike2.matrix);
  spike2.matrix.scale(.11, 0.3, .11);
  spike2.render();

  var subspike2 = new Cube(0.8, 0.9, 1, 0.6, 0.9, 0.6);
  subspike2.color = [75/255, 75/255, 84/255, 1.0];
  subspike2.matrix = matforsubspike2;
  subspike2.matrix.translate(-0.003, 0.3, 0);
  subspike2.matrix.scale(.11, 0.1, .11);
  subspike2.render();

  var spike3 = new Cube(0.8, 0.9, 1, 0.6, 0.9, 0.6);
  spike3.color = [36/255, 38/255, 60/255, 1.0];
  spike3.matrix = spikemat3;
  if (g_shiftAnimationOn){
    if (flipspike3 == false){
      spike3.matrix.translate(.195, .4795, 0.42);
      flipspike3 = true;
    } else {
      spike3.matrix.translate(.205, .4805, 0.42);
      flipspike3 = false;
    }
  } else {
    spike3.matrix.translate(.2, .48, 0.42);
  }
  spike3.matrix.rotate(45, 1, 0, 0)
  var matforsubspike3 = new Matrix4(spike3.matrix);
  spike3.matrix.scale(.11, 0.3, .11);
  spike3.render();

  var subspike3 = new Cube(0.8, 0.9, 1, 0.6, 0.9, 0.6);
  subspike3.color = [75/255, 75/255, 84/255, 1.0];
  subspike3.matrix = matforsubspike3;
  subspike3.matrix.translate(-0.003, 0.3, 0);
  subspike3.matrix.scale(.11, 0.1, .11);
  subspike3.render();

  var spike4 = new Cube(0.8, 0.9, 1, 0.6, 0.9, 0.6);
  spike4.color = [36/255, 38/255, 60/255, 1.0];
  spike4.matrix = spikemat4;
  if (g_shiftAnimationOn){
    if (flipspike4 == false){
      spike4.matrix.translate(.195, 0.1295, 0.47);
      flipspike4 = true;
    } else {
      spike4.matrix.translate(.205, 0.1305, 0.47);
      flipspike4 = false;
    }
  } else {
    spike4.matrix.translate(.2, 0.13, 0.47);
  }
  spike4.matrix.rotate(-225, 1, 0, 0)
  var matforsubspike4 = new Matrix4(spike4.matrix);
  spike4.matrix.scale(.11, 0.3, .11);
  spike4.render();

  var subspike4 = new Cube(0.8, 0.9, 1, 0.6, 0.9, 0.6);
  subspike4.color = [75/255, 75/255, 84/255, 1.0];
  subspike4.matrix = matforsubspike4;
  subspike4.matrix.translate(-0.003, 0.3, 0);
  subspike4.matrix.scale(.11, 0.1, .11);
  subspike4.render();

  // Y SPIKES

  var spike5 = new Cube(0.8, 0.9, 1, 0.6, 0.9, 0.6);
  spike5.color = [36/255, 38/255, 60/255, 1.0];
  spike5.matrix = spikemat5;
  if (g_shiftAnimationOn){
    if (flipspike5 == false){
      spike5.matrix.translate(.605, -.1795, 0.21);
      flipspike5 = true;
    } else {
      spike5.matrix.translate(.595, -.1805, 0.21);;
      flipspike5 = false;
    }
  } else {
    spike5.matrix.translate(.6, -.18, 0.21);
  }
  spike5.matrix.rotate(45, 0, 0, 1)
  var matforsubspike5 = new Matrix4(spike5.matrix);
  spike5.matrix.scale(.11, 0.3, .11);
  spike5.render();

  var subspike5 = new Cube(0.8, 0.9, 1, 0.6, 0.9, 0.6);
  subspike5.color = [75/255, 75/255, 84/255, 1.0];
  subspike5.matrix = matforsubspike5;
  subspike5.matrix.translate(0, -0.1, 0);
  subspike5.matrix.scale(.11, 0.1, .11);
  subspike5.render();

  var spike6 = new Cube(0.6, 0.8, 0.6, 0.6, 0.6, 0.6);
  spike6.color = [36/255, 38/255, 60/255, 1.0];
  spike6.matrix = spikemat6;
  if (g_shiftAnimationOn){
    if (flipspike6 == false){
      spike6.matrix.translate(-.1705, -.0905, 0.205);
      flipspike6 = true;
    } else {
      spike6.matrix.translate(-.1695, -.0895, 0.215);
      flipspike6 = false;
    }
  } else {
    spike6.matrix.translate(-.17, -.09, 0.21);
  }
  spike6.matrix.rotate(-45, 0, 0, 1)
  var matforsubspike6 = new Matrix4(spike6.matrix);
  spike6.matrix.scale(.11, 0.3, .11);
  spike6.render();

  var subspike6 = new Cube(0.6, 0.8, 0.6, 0.6, 0.6, 0.6);
  subspike6.color = [75/255, 75/255, 84/255, 1.0];
  subspike6.matrix = matforsubspike6;
  subspike6.matrix.translate(0, -0.1, 0);
  subspike6.matrix.scale(.11, 0.1, .11);
  subspike6.render();

  var spike7 = new Cube(0.8, 0.9, 0.6, 1, 0.8, 0.8);
  spike7.color = [36/255, 38/255, 60/255, 1.0];
  spike7.matrix = spikemat7;
  if (g_shiftAnimationOn){
    if (flipspike7 == false){
      spike7.matrix.translate(-.1, .705, 0.201);
      flipspike7 = true;
    } else {
      spike7.matrix.translate(-.1, .695, 0.219);
      flipspike7 = false;
    }
  } else {
    spike7.matrix.translate(-.1, .7, 0.21);
  }
  spike7.matrix.rotate(225, 0, 0, 1)
  var matforsubspike7 = new Matrix4(spike7.matrix);
  spike7.matrix.scale(.11, 0.3, .11);
  spike7.render();

  var subspike7 = new Cube(0.8, 0.9, 0.6, 1, 0.8, 0.8);
  subspike7.color = [75/255, 75/255, 84/255, 1.0];
  subspike7.matrix = matforsubspike7;
  subspike7.matrix.translate(0, -0.1, 0);
  subspike7.matrix.scale(.11, 0.1, .11);
  subspike7.render();

  var spike8 = new Cube(0.8, 1, 0.9, 0.6, 0, 0);
  spike8.color = [36/255, 38/255, 60/255, 1.0];
  spike8.matrix = spikemat8;
  if (g_shiftAnimationOn){
    if (flipspike8 == false){
      spike8.matrix.translate(.705, .605, 0.21);
      flipspike8 = true;
    } else {
      spike8.matrix.translate(.695, .595, 0.21);
      flipspike8 = false;
    }
  } else {
    spike8.matrix.translate(.7, .6, 0.21);
  }
  spike8.matrix.rotate(135, 0, 0, 1)
  var matforsubspike8 = new Matrix4(spike8.matrix);
  spike8.matrix.scale(.11, 0.3, .11);
  spike8.render();

  var subspike8 = new Cube(0.8, 1, 0.9, 0.6, 1, 1);
  subspike8.color = [75/255, 75/255, 84/255, 1.0];
  subspike8.matrix = matforsubspike8;
  subspike8.matrix.translate(0, -0.1, 0);
  subspike8.matrix.scale(.11, 0.1, .11);
  subspike8.render();

  // X SPIKES

  var spike9 = new Cube(1, 0.6, 1, 0.7, 0, 0);
  spike9.color = [36/255, 38/255, 60/255, 1.0];
  spike9.matrix = spikemat9;
  if (g_shiftAnimationOn){
    if (flipspike9 == false){
      spike9.matrix.translate(.651, 0.31, -.21);
      flipspike9 = true;
    } else {
      spike9.matrix.translate(.649, 0.31, -.19);
      flipspike9 = false;
    }
  } else {
    spike9.matrix.translate(.65, 0.31, -.2);
  }
  spike9.matrix.rotate(90, 1, 0, 0)
  spike9.matrix.rotate(45, 0, 0, 1)
  var matforsubspike9 = new Matrix4(spike9.matrix);
  spike9.matrix.scale(.11, 0.3, .11);
  spike9.render();

  var subspike9 = new Cube(1, 0.6, 1, 0.7, 0.8, 0.8);
  subspike9.color = [75/255, 75/255, 84/255, 1.0];
  subspike9.matrix = matforsubspike9;
  subspike9.matrix.translate(0, -0.1, 0);
  subspike9.matrix.scale(.11, 0.1, .11);
  subspike9.render();

  var spike10 = new Cube(1, 0.6, 0.8, 0.8, 0.9, 0.9);
  spike10.color = [36/255, 38/255, 60/255, 1.0];
  spike10.matrix = spikemat10;
  if (g_shiftAnimationOn){
    if (flipspike10 == false){
      spike10.matrix.translate(.705, 0.312, .62);
      flipspike10 = true;
    } else {
      spike10.matrix.translate(.695, 0.308, .64);
      flipspike10 = false;
    }
  } else {
    spike10.matrix.translate(.7, 0.31, .63);
  }
  spike10.matrix.rotate(90, 1, 0, 0)
  spike10.matrix.rotate(135, 0, 0, 1)
  var matforsubspike10 = new Matrix4(spike10.matrix);
  spike10.matrix.scale(.11, 0.3, .11);
  spike10.render();

  var subspike10 = new Cube(1, 0.6, 0.8, 0.8, 0.9, 0.9);
  subspike10.color = [75/255, 75/255, 84/255, 1.0];
  subspike10.matrix = matforsubspike10;
  subspike10.matrix.translate(0, -0.1, 0);
  subspike10.matrix.scale(.11, 0.1, .11);
  subspike10.render();
  
  var spike11 = new Cube(0.9, 0.6, 0.7, 1, 0, 0);
  spike11.color = [36/255, 38/255, 60/255, 1.0];
  spike11.matrix = spikemat11;
  if (g_shiftAnimationOn){
    if (flipspike11 == false){
      spike11.matrix.translate(-.11, 0.31, .73);
      flipspike11 = true;
    } else {
      spike11.matrix.translate(-.09, 0.31, .71);
      flipspike11 = false;
    }
  } else {
    spike11.matrix.translate(-.1, 0.31, .72);
  }
  spike11.matrix.rotate(90, 1, 0, 0)
  spike11.matrix.rotate(-135, 0, 0, 1)
  var matforsubspike11 = new Matrix4(spike11.matrix);
  spike11.matrix.scale(.11, 0.3, .11);
  spike11.render();

  var subspike11 = new Cube(0.9, 0.6, 0.7, 1, 0.8, 0.8);
  subspike11.color = [75/255, 75/255, 84/255, 1.0];
  subspike11.matrix = matforsubspike11;
  subspike11.matrix.translate(0, -0.1, 0);
  subspike11.matrix.scale(.11, 0.1, .11);
  subspike11.render();

  var spike12 = new Cube(0.8, 0.6, 0.8, 0.8, 0.6, 0.6);
  spike12.color = [36/255, 38/255, 60/255, 1.0];
  spike12.matrix = spikemat12;
  if (g_shiftAnimationOn){
    if (flipspike12 == false){
      spike12.matrix.translate(-.2, 0.31, -.11);
      flipspike12 = true;
    } else {
      spike12.matrix.translate(-.18, 0.31, -.09);
      flipspike12 = false;
    }
  } else {
    spike12.matrix.translate(-.19, 0.31, -.1);
  }
  spike12.matrix.rotate(90, 1, 0, 0)
  spike12.matrix.rotate(-45, 0, 0, 1)
  var matforsubspike12 = new Matrix4(spike12.matrix);
  spike12.matrix.scale(.11, 0.3, .11);
  spike12.render();

  var subspike12 = new Cube(0.8, 0.6, 0.8, 0.8, 0.6, 0.6);
  subspike12.color = [75/255, 75/255, 84/255, 1.0];
  subspike12.matrix = matforsubspike12;
  subspike12.matrix.translate(0, -0.1, 0);
  subspike12.matrix.scale(.11, 0.1, .11);
  subspike12.render();

  // FACE
  var eyebrow = new Cube(0.8, 0.9, 1, 0.6, 0.9, 0.6);
  eyebrow.color = [87/255, 82/255, 67/255, 1.0];
  eyebrow.matrix = facemat1;
  eyebrow.matrix.translate(0.095, .3, -.08);
  eyebrow.matrix.scale(.4*0.8, .075*0.8, .5*0.8);
  eyebrow.render();

  var eye = new Cube(0.8, 0.9, 1, 0.6, 0.9, 0.6);
  eye.color = g_globalEyeColor;
  eye.matrix = facemat2;
  eye.matrix.translate(0.138, .17, -.075);
  eye.matrix.scale(.3*0.8, .19*0.8, .37*0.8);
  eye.render();

  var pupil = new Cube(0.8, 0.9, 1, 0.6, 0.9, 0.6);
  pupil.color = [192/255, 184/255, 183/255, 1.0];
  pupil.matrix = facemat3;
  pupil.matrix.translate(0.195 + Math.sin(g_seconds*g_eyeAngleSpeed)*0.05, .2, -.077);
  pupil.matrix.scale(.15*0.8, .15*0.8, .15*0.8);
  pupil.render();

  // Tail
  var tail1 = new Cube(0.8, 0.9, 1, 0.6, 0.9, 0.6);
  tail1.color = [140/255, 137/255, 125/255, 1.0];
  tail1.matrix = tailmat1;
  tail1.matrix.translate(0.13, .15, .4);
  tail1.matrix.rotate(g_tailAngle*0.2, 0, 1, 0);
  var matfortail2 = new Matrix4(tail1.matrix);
  tail1.matrix.scale(.3*0.8, .25*0.8, .45*0.8);
  tail1.render();

  var tail2 = new Cube(0.8, 0.9, 1, 0.6, 0.9, 0.6);
  tail2.color = [78/255,79/255,73/255, 1.0];
  tail2.matrix = matfortail2;
  tail2.matrix.translate(0.04, .02, .3);
  tail2.matrix.rotate(g_tailAngle*0.3, 0, 1, 0);
  var matfortail3 = new Matrix4(tail2.matrix);
  var matforcone2 = new Matrix4(tail2.matrix);
  var matforcone3 = new Matrix4(tail2.matrix);
  tail2.matrix.scale(.2*0.8, .15*0.8, .45*0.8);
  tail2.render();

  var tail3 = new Cube(0.8, 0.9, 1, 0.6, 0.9, 0.6);
  tail3.color = [78/255,79/255,73/255, 1.0];
  tail3.matrix = matfortail3;
  tail3.matrix.translate(.025, 0.025, .3);
  tail3.matrix.rotate(g_tailSecondAngle*0.3, 0, 1, 0);
  var matfortail4 = new Matrix4(tail3.matrix);
  tail3.matrix.scale(.15*0.8, .1*0.8, .3*0.8);
  tail3.render();

  var tail4 = new Cube(0.8, 0.9, 1, 0.6, 0.9, 0.6);
  tail4.color = [78/255,79/255,73/255, 1.0];
  tail4.matrix = matfortail4;
  tail4.matrix.translate(.05, -.1, .24);
  tail4.matrix.rotate(g_tailAngle*0.3, 0, 1, 0);
  tail4.matrix.scale(.03*0.8, .35*0.8, .15*0.8);
  tail4.render();

  // CONE!

  var cone = new Cone();
  cone.color = [61/255, 66/255, 113/255, 1.0];
  cone.matrix = conemat;
  cone.matrix.translate(0.27, 0.55, 0.27);
  cone.matrix.rotate(-90, 1, 0, 0);
  cone.matrix.scale(0.3, 0.3, 0.2);
  cone.segments = 50;
  cone.render();

  var cone2 = new Cone();
  cone2.color = [61/255, 66/255, 113/255, 1.0];
  cone2.matrix = matforcone2;
  cone2.matrix.translate(0.08, 0.1, 0.15);
  cone2.matrix.rotate(-90, 1, 0, 0);
  cone2.matrix.scale(0.15, 0.15, 0.1);
  cone2.segments = 50;
  cone2.render();

  var cone3 = new Cone();
  cone3.color = [61/255, 66/255, 113/255, 1.0];
  cone3.matrix = matforcone3;
  cone3.matrix.translate(0.08, 0.1, 0.27);
  cone3.matrix.rotate(-90, 1, 0, 0);
  cone3.matrix.scale(0.12, 0.12, 0.08);
  cone3.segments = 50;
  cone3.render();
}