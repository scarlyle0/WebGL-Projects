class Cube{


    constructor(frontshadeC, backshadeC, rightshadeC, leftshadeC, topshadeC, bottomshadeC){
      this.type='cube';
      this.color = [1.0, 1.0, 1.0, 1.0];
      this.matrix = new Matrix4();
      this.alpha = 1;
      this.textureNum=-2;
      this.frontshade = frontshadeC;
      this.backshade = backshadeC;
      this.rightshade = rightshadeC;
      this.leftshade = leftshadeC;
      this.topshade = topshadeC;
      this.bottomshade = bottomshadeC;
      this.cubetype = 0;
    }
  

    render() {


      var rgba = this.color;

      if (this.cubetype == 0){
        var cubevertices = [
          // FRONT OF CUBE
          0.0, 0.0, 0.0,     this.frontshade*rgba[0], this.frontshade*rgba[1], this.frontshade*rgba[2], rgba[3], 1, 0,
          1.0, 1.0, 0.0,     this.frontshade*rgba[0], this.frontshade*rgba[1], this.frontshade*rgba[2], rgba[3], 0, 1,
          1.0, 0.0, 0.0,     this.frontshade*rgba[0], this.frontshade*rgba[1], this.frontshade*rgba[2], rgba[3], 0, 0,
          0.0, 0.0, 0.0,     this.frontshade*rgba[0], this.frontshade*rgba[1], this.frontshade*rgba[2], rgba[3], 1, 0,
          0.0, 1.0, 0.0,     this.frontshade*rgba[0], this.frontshade*rgba[1], this.frontshade*rgba[2], rgba[3], 1, 1,
          1.0, 1.0, 0.0,     this.frontshade*rgba[0], this.frontshade*rgba[1], this.frontshade*rgba[2], rgba[3], 0, 1,
          
          // BACK OF CUBE
          1.0, 0.0, 1.0,     this.backshade*rgba[0], this.backshade*rgba[1], this.backshade*rgba[2], rgba[3], 1, 0,
          1.0, 1.0, 1.0,     this.backshade*rgba[0], this.backshade*rgba[1], this.backshade*rgba[2], rgba[3], 1, 1,
          0.0, 1.0, 1.0,     this.backshade*rgba[0], this.backshade*rgba[1], this.backshade*rgba[2], rgba[3], 0, 1,
          1.0, 0.0, 1.0,     this.backshade*rgba[0], this.backshade*rgba[1], this.backshade*rgba[2], rgba[3], 1, 0,
          0.0, 1.0, 1.0,     this.backshade*rgba[0], this.backshade*rgba[1], this.backshade*rgba[2], rgba[3], 0, 1,
          0.0, 0.0, 1.0,     this.backshade*rgba[0], this.backshade*rgba[1], this.backshade*rgba[2], rgba[3], 0, 0,

          // RIGHT OF CUBE
          1.0, 0.0, 0.0,     this.rightshade*rgba[0], this.rightshade*rgba[1], this.rightshade*rgba[2], rgba[3], 1, 0,
          1.0, 1.0, 0.0,     this.rightshade*rgba[0], this.rightshade*rgba[1], this.rightshade*rgba[2], rgba[3], 1, 1,
          1.0, 1.0, 1.0,     this.rightshade*rgba[0], this.rightshade*rgba[1], this.rightshade*rgba[2], rgba[3], 0, 1,
          1.0, 0.0, 0.0,     this.rightshade*rgba[0], this.rightshade*rgba[1], this.rightshade*rgba[2], rgba[3], 1, 0,
          1.0, 1.0, 1.0,     this.rightshade*rgba[0], this.rightshade*rgba[1], this.rightshade*rgba[2], rgba[3], 0, 1,
          1.0, 0.0, 1.0,     this.rightshade*rgba[0], this.rightshade*rgba[1], this.rightshade*rgba[2], rgba[3], 0, 0,

          // LEFT OF CUBE

          0.0, 0.0, 1.0,     this.leftshade*rgba[0], this.leftshade*rgba[1], this.leftshade*rgba[2], rgba[3], 1, 0,
          0.0, 1.0, 1.0,     this.leftshade*rgba[0], this.leftshade*rgba[1], this.leftshade*rgba[2], rgba[3], 1, 1,
          0.0, 1.0, 0.0,     this.leftshade*rgba[0], this.leftshade*rgba[1], this.leftshade*rgba[2], rgba[3], 0, 1,
          0.0, 0.0, 1.0,     this.leftshade*rgba[0], this.leftshade*rgba[1], this.leftshade*rgba[2], rgba[3], 1, 0,
          0.0, 1.0, 0.0,     this.leftshade*rgba[0], this.leftshade*rgba[1], this.leftshade*rgba[2], rgba[3], 0, 1,
          0.0, 0.0, 0.0,     this.leftshade*rgba[0], this.leftshade*rgba[1], this.leftshade*rgba[2], rgba[3], 0, 0,

          // TOP OF CUBE
          0.0, 1.0, 0.0,     this.topshade*rgba[0], this.topshade*rgba[1], this.topshade*rgba[2], rgba[3], 1, 0,
          0.0, 1.0, 1.0,     this.topshade*rgba[0], this.topshade*rgba[1], this.topshade*rgba[2], rgba[3], 1, 1,
          1.0, 1.0, 1.0,     this.topshade*rgba[0], this.topshade*rgba[1], this.topshade*rgba[2], rgba[3], 0, 1,
          0.0, 1.0, 0.0,     this.topshade*rgba[0], this.topshade*rgba[1], this.topshade*rgba[2], rgba[3], 1, 0,
          1.0, 1.0, 1.0,     this.topshade*rgba[0], this.topshade*rgba[1], this.topshade*rgba[2], rgba[3], 0, 1,
          1.0, 1.0, 0.0,     this.topshade*rgba[0], this.topshade*rgba[1], this.topshade*rgba[2], rgba[3], 0, 0,

          // BOTTOM OF CUBE

          1.0, 0.0, 1.0,     this.bottomshade*rgba[0], this.bottomshade*rgba[1], this.bottomshade*rgba[2], rgba[3], 0, 1,
          0.0, 0.0, 1.0,     this.bottomshade*rgba[0], this.bottomshade*rgba[1], this.bottomshade*rgba[2], rgba[3], 1, 1,
          0.0, 0.0, 0.0,     this.bottomshade*rgba[0], this.bottomshade*rgba[1], this.bottomshade*rgba[2], rgba[3], 1, 0,
          1.0, 0.0, 1.0,     this.bottomshade*rgba[0], this.bottomshade*rgba[1], this.bottomshade*rgba[2], rgba[3], 0, 1,
          0.0, 0.0, 0.0,     this.bottomshade*rgba[0], this.bottomshade*rgba[1], this.bottomshade*rgba[2], rgba[3], 1, 0,
          1.0, 0.0, 0.0,     this.bottomshade*rgba[0], this.bottomshade*rgba[1], this.bottomshade*rgba[2], rgba[3], 0, 0,
        ]
    } else {
        var cubevertices = [
          // FRONT OF CUBE
          0.0, 0.0, 0.0,     this.frontshade*rgba[0], this.frontshade*rgba[1], this.frontshade*rgba[2], rgba[3], 1/4, 1/3,
          1.0, 1.0, 0.0,     this.frontshade*rgba[0], this.frontshade*rgba[1], this.frontshade*rgba[2], rgba[3], 2/4, 2/3,
          1.0, 0.0, 0.0,     this.frontshade*rgba[0], this.frontshade*rgba[1], this.frontshade*rgba[2], rgba[3], 2/4, 1/3,
          0.0, 0.0, 0.0,     this.frontshade*rgba[0], this.frontshade*rgba[1], this.frontshade*rgba[2], rgba[3], 1/4, 1/3,
          0.0, 1.0, 0.0,     this.frontshade*rgba[0], this.frontshade*rgba[1], this.frontshade*rgba[2], rgba[3], 1/4, 2/3,
          1.0, 1.0, 0.0,     this.frontshade*rgba[0], this.frontshade*rgba[1], this.frontshade*rgba[2], rgba[3], 2/4, 2/3,
          
          // BACK OF CUBE
          1.0, 0.0, 1.0,     this.backshade*rgba[0], this.backshade*rgba[1], this.backshade*rgba[2], rgba[3], 3/4, 1/3,
          1.0, 1.0, 1.0,     this.backshade*rgba[0], this.backshade*rgba[1], this.backshade*rgba[2], rgba[3], 3/4, 2/3,
          0.0, 1.0, 1.0,     this.backshade*rgba[0], this.backshade*rgba[1], this.backshade*rgba[2], rgba[3], 1, 2/3,
          1.0, 0.0, 1.0,     this.backshade*rgba[0], this.backshade*rgba[1], this.backshade*rgba[2], rgba[3], 3/4, 1/3,
          0.0, 1.0, 1.0,     this.backshade*rgba[0], this.backshade*rgba[1], this.backshade*rgba[2], rgba[3], 1, 2/3,
          0.0, 0.0, 1.0,     this.backshade*rgba[0], this.backshade*rgba[1], this.backshade*rgba[2], rgba[3], 1, 1/3,

          // RIGHT OF CUBE
          1.0, 0.0, 0.0,     this.rightshade*rgba[0], this.rightshade*rgba[1], this.rightshade*rgba[2], rgba[3], 2/4, 1/3,
          1.0, 1.0, 0.0,     this.rightshade*rgba[0], this.rightshade*rgba[1], this.rightshade*rgba[2], rgba[3], 2/4, 2/3,
          1.0, 1.0, 1.0,     this.rightshade*rgba[0], this.rightshade*rgba[1], this.rightshade*rgba[2], rgba[3], 3/4, 2/3,
          1.0, 0.0, 0.0,     this.rightshade*rgba[0], this.rightshade*rgba[1], this.rightshade*rgba[2], rgba[3], 2/4, 1/3,
          1.0, 1.0, 1.0,     this.rightshade*rgba[0], this.rightshade*rgba[1], this.rightshade*rgba[2], rgba[3], 3/4, 2/3,
          1.0, 0.0, 1.0,     this.rightshade*rgba[0], this.rightshade*rgba[1], this.rightshade*rgba[2], rgba[3], 3/4, 1/3,

          // LEFT OF CUBE

          0.0, 0.0, 1.0,     this.leftshade*rgba[0], this.leftshade*rgba[1], this.leftshade*rgba[2], rgba[3], 0, 1/3,
          0.0, 1.0, 1.0,     this.leftshade*rgba[0], this.leftshade*rgba[1], this.leftshade*rgba[2], rgba[3], 0, 2/3,
          0.0, 1.0, 0.0,     this.leftshade*rgba[0], this.leftshade*rgba[1], this.leftshade*rgba[2], rgba[3], 1/4, 2/3,
          0.0, 0.0, 1.0,     this.leftshade*rgba[0], this.leftshade*rgba[1], this.leftshade*rgba[2], rgba[3], 0, 1/3,
          0.0, 1.0, 0.0,     this.leftshade*rgba[0], this.leftshade*rgba[1], this.leftshade*rgba[2], rgba[3], 1/4, 2/3,
          0.0, 0.0, 0.0,     this.leftshade*rgba[0], this.leftshade*rgba[1], this.leftshade*rgba[2], rgba[3], 1/4, 1/3,

          // TOP OF CUBE
          0.0, 1.0, 0.0,     this.topshade*rgba[0], this.topshade*rgba[1], this.topshade*rgba[2], rgba[3], 1/4, 2/3,
          0.0, 1.0, 1.0,     this.topshade*rgba[0], this.topshade*rgba[1], this.topshade*rgba[2], rgba[3], 1/4, 1,
          1.0, 1.0, 1.0,     this.topshade*rgba[0], this.topshade*rgba[1], this.topshade*rgba[2], rgba[3], 2/4, 1,
          0.0, 1.0, 0.0,     this.topshade*rgba[0], this.topshade*rgba[1], this.topshade*rgba[2], rgba[3], 1/4, 2/3,
          1.0, 1.0, 1.0,     this.topshade*rgba[0], this.topshade*rgba[1], this.topshade*rgba[2], rgba[3], 2/4, 1,
          1.0, 1.0, 0.0,     this.topshade*rgba[0], this.topshade*rgba[1], this.topshade*rgba[2], rgba[3], 2/4, 2/3,

          // BOTTOM OF CUBE

          1.0, 0.0, 1.0,     this.bottomshade*rgba[0], this.bottomshade*rgba[1], this.bottomshade*rgba[2], rgba[3], 2/4, 0,
          0.0, 0.0, 1.0,     this.bottomshade*rgba[0], this.bottomshade*rgba[1], this.bottomshade*rgba[2], rgba[3], 1/4, 0,
          0.0, 0.0, 0.0,     this.bottomshade*rgba[0], this.bottomshade*rgba[1], this.bottomshade*rgba[2], rgba[3], 1/4, 1/3,
          1.0, 0.0, 1.0,     this.bottomshade*rgba[0], this.bottomshade*rgba[1], this.bottomshade*rgba[2], rgba[3], 2/4, 0,
          0.0, 0.0, 0.0,     this.bottomshade*rgba[0], this.bottomshade*rgba[1], this.bottomshade*rgba[2], rgba[3], 1/4, 1/3,
          1.0, 0.0, 0.0,     this.bottomshade*rgba[0], this.bottomshade*rgba[1], this.bottomshade*rgba[2], rgba[3], 2/4, 1/3,
        ]
    }

      

      var tricount = 12;
      var verticescount = 3;

      let cv = new Float32Array(cubevertices);

      gl.uniform1i(u_whichTexture, this.textureNum);

      gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);

      // DRAW CUBE
      if (g_cubevertexBuffer == null){
        initRender(cv);
      }
    
      // Write date into the buffer object
      gl.bufferData(gl.ARRAY_BUFFER, cv, gl.DYNAMIC_DRAW);
      

      //console.log(g_cubevertexBuffer);
      gl.drawArrays(gl.TRIANGLES, 0, verticescount * tricount);
  }
}

var g_cubevertexBuffer = null;
function initRender(cv) {

  // Create a buffer object
  var g_cubevertexBuffer = gl.createBuffer();
  if (!g_cubevertexBuffer) {
    console.log('Failed to create the buffer object');
    return -1;
  }

  // Bind the buffer object to target
  gl.bindBuffer(gl.ARRAY_BUFFER, g_cubevertexBuffer);

  // Assign the buffer object to each a_variable
  gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, 9*cv.BYTES_PER_ELEMENT, 0);
  gl.vertexAttribPointer(a_Color, 4, gl.FLOAT, false, 9*cv.BYTES_PER_ELEMENT, 3*cv.BYTES_PER_ELEMENT);
  gl.vertexAttribPointer(a_UV, 2, gl.FLOAT, false, 9*cv.BYTES_PER_ELEMENT, 7*cv.BYTES_PER_ELEMENT);

  // Enable the assignment to a_Position variable
  gl.enableVertexAttribArray(a_Position);
  gl.enableVertexAttribArray(a_Color);
  gl.enableVertexAttribArray(a_UV);
}