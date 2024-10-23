// Vertex shader program
var VSHADER_SOURCE = `
  precision mediump float;
  attribute vec4 a_Position;
  attribute vec4 a_Color;
  attribute vec2 a_UV;
  varying vec2 v_UV;
  varying vec4 v_Color;
  uniform mat4 u_ModelMatrix;
  uniform mat4 u_GlobalRotateMatrix;
  uniform mat4 u_ProjectionMatrix;
  uniform mat4 u_ViewMatrix;
  void main() {
    v_Color = a_Color;
    gl_Position = u_ProjectionMatrix * u_ViewMatrix * u_GlobalRotateMatrix * u_ModelMatrix * a_Position;
    v_UV = a_UV;
  }`

// Fragment shader program
var FSHADER_SOURCE = `
  precision mediump float;
  varying vec2 v_UV;
  varying vec4 v_Color;
  uniform sampler2D u_Sampler0;
  uniform sampler2D u_Sampler1;
  uniform sampler2D u_Sampler2;
  uniform sampler2D u_Sampler3;
  uniform sampler2D u_Sampler4;
  uniform sampler2D u_Sampler5;
  uniform sampler2D u_Sampler6;
  uniform int u_whichTexture;
  void main() {
    if (u_whichTexture == -2){
      gl_FragColor = v_Color; // Use Color
    } else if (u_whichTexture == -1){
      gl_FragColor = vec4(v_UV, 1.0, 1.0); // Use UV Debug Texture
    } else if (u_whichTexture == 0){
      gl_FragColor = texture2D(u_Sampler0, v_UV); // Use texture0
    } else if (u_whichTexture == 1){
      gl_FragColor = texture2D(u_Sampler1, v_UV); // Use texture1
    } else if (u_whichTexture == 2){
      gl_FragColor = texture2D(u_Sampler2, v_UV); // Use texture2
    } else if (u_whichTexture == 3){
      gl_FragColor = texture2D(u_Sampler3, v_UV); // Use texture3
    } else if (u_whichTexture == 4){
      gl_FragColor = texture2D(u_Sampler4, v_UV); // Use texture4
    } else if (u_whichTexture == 5){
      gl_FragColor = texture2D(u_Sampler5, v_UV); // Use texture5
    } else if (u_whichTexture == 6){
      gl_FragColor = texture2D(u_Sampler6, v_UV); // Use texture6
    } else {
      gl_FragColor = vec4(1,.2,.2,1); // Error, put redish
    }
  }`
  
function setupWebGL(){
    // Retrieve <canvas> element
    canvas = document.getElementById('webgl');
    canvas.width = 1280;
    canvas.height = 720;
  
    gl = canvas.getContext("webgl", { preserveDrawingBuffer: true});
    if (!gl) {
      console.log('Failed to get the rendering context for WebGL');
      return;
    }
    
    gl.enable(gl.DEPTH_TEST);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

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
  
      a_UV = gl.getAttribLocation(gl.program, 'a_UV');
      if (a_UV < 0) {
        console.log('Failed to get the storage location of a_UV');
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
  
      u_Sampler0 = gl.getUniformLocation(gl.program, 'u_Sampler0');
      if (!u_Sampler0) {
        console.log('Failed to get the storage location of u_Sampler0');
        return false;
      }
  
      u_Sampler1 = gl.getUniformLocation(gl.program, 'u_Sampler1');
      if (!u_Sampler1) {
        console.log('Failed to get the storage location of u_Sampler1');
        return false;
      }

      u_Sampler2 = gl.getUniformLocation(gl.program, 'u_Sampler2');
      if (!u_Sampler2) {
        console.log('Failed to get the storage location of u_Sampler2');
        return false;
      }

      u_Sampler3 = gl.getUniformLocation(gl.program, 'u_Sampler3');
      if (!u_Sampler3) {
        console.log('Failed to get the storage location of u_Sampler3');
        return false;
      }

      u_Sampler4 = gl.getUniformLocation(gl.program, 'u_Sampler4');
      if (!u_Sampler4) {
        console.log('Failed to get the storage location of u_Sampler4');
        return false;
      }

      u_Sampler5 = gl.getUniformLocation(gl.program, 'u_Sampler5');
      if (!u_Sampler5) {
        console.log('Failed to get the storage location of u_Sampler5');
        return false;
      }

      u_Sampler6 = gl.getUniformLocation(gl.program, 'u_Sampler6');
      if (!u_Sampler6) {
        console.log('Failed to get the storage location of u_Sampler6');
        return false;
      }
  
      u_whichTexture = gl.getUniformLocation(gl.program, 'u_whichTexture');
      if (!u_whichTexture){
        console.log('Failed to get the storage location of u_whichTexture');
        return false;
      }
  
      u_ProjectionMatrix = gl.getUniformLocation(gl.program, 'u_ProjectionMatrix');
      if (!u_ProjectionMatrix){
        console.log('Failed to get the storage location of u_ProjectionMatrix');
        return false;
      }
  
      u_ViewMatrix = gl.getUniformLocation(gl.program, 'u_ViewMatrix');
      if (!u_ViewMatrix){
        console.log('Failed to get the storage location of u_ViewMatrix');
        return false;
      }
  
      // set initial value for this matrix as identity
      var identityM = new Matrix4();
      gl.uniformMatrix4fv(u_ModelMatrix, false, identityM.elements);
  }

  function addHtmlUi(){
    
  }
  
  function initTextures() {
    var skybox = new Image();
    if (!skybox) {
      console.log('Failed to create the skybox object');
      return false;
    }
    // Register the event handler to be called on loading an image
    skybox.onload = function(){ sendImageToTEXTURE(skybox, u_Sampler0, 0); };
    // Tell the browser to load an image
    skybox.src = 'textures/skybox.png';
  
    var ground = new Image();
    if (!ground) {
      console.log('Failed to create the ground object');
      return false;
    }
    ground.onload = function(){ sendImageToTEXTURE(ground, u_Sampler1, 1); };
    ground.src = 'textures/sandcolumn.png';

    var sand = new Image();
    if (!sand) {
      console.log('Failed to create the sand object');
      return false;
    }
    sand.onload = function(){ sendImageToTEXTURE(sand, u_Sampler2, 2); };
    sand.src = 'textures/sand.png';

    var diamond = new Image();
    if (!diamond) {
      console.log('Failed to create the diamond object');
      return false;
    }
    diamond.onload = function(){ sendImageToTEXTURE(diamond, u_Sampler3, 3); };
    diamond.src = 'textures/diamond.png';

    var sandstone = new Image();
    if (!sandstone) {
      console.log('Failed to create the sandstone object');
      return false;
    }
    sandstone.onload = function(){ sendImageToTEXTURE(sandstone, u_Sampler4, 4); };
    sandstone.src = 'textures/sandstone.png';

    var leaves = new Image();
    if (!leaves) {
      console.log('Failed to create the leaves object');
      return false;
    }
    leaves.onload = function(){ sendImageToTEXTURE(leaves, u_Sampler5, 5); };
    leaves.src = 'textures/leaves.png';

    var wood = new Image();
    if (!wood) {
      console.log('Failed to create the leaves bject');
      return false;
    }
    wood.onload = function(){ sendImageToTEXTURE(wood, u_Sampler6, 6); };
    wood.src = 'textures/wood.png';

  
    return true;
  }
  
  function sendImageToTEXTURE(image, sampler, num) {
    // Create Texture
    var texture = gl.createTexture();
    if (!texture) {
      console.log('Failed to create the texture object');
      return false;
    }
  
    // Flip the image's y axis
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1); 
  
    if (num == 0){
      // Enable texture unit0
      gl.activeTexture(gl.TEXTURE0);
    } else if (num == 1){
      // Enable texture unit1
      gl.activeTexture(gl.TEXTURE1);
    } else if (num == 2){
      gl.activeTexture(gl.TEXTURE2);
    } else if (num == 3){
      gl.activeTexture(gl.TEXTURE3);
    } else if (num == 4){
      gl.activeTexture(gl.TEXTURE4);
    } else if (num == 5){
      gl.activeTexture(gl.TEXTURE5);
    } else if (num == 6){
      gl.activeTexture(gl.TEXTURE6);
    }
  
    // Bind the texture object to the target
    gl.bindTexture(gl.TEXTURE_2D, texture);
  
    // Set the texture parameters
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  
    // Set the texture image
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);
    
    // Set the texture unit 0 to the sampler
    gl.uniform1i(sampler, num);
  }