class Cube{


    constructor(frontshadeC, backshadeC, rightshadeC, leftshadeC, topshadeC, bottomshadeC){
      this.type='cube';
      this.color = [1.0, 1.0, 1.0, 1.0]
      this.matrix = new Matrix4();
      this.frontshade = frontshadeC;
      this.backshade = backshadeC;
      this.rightshade = rightshadeC;
      this.leftshade = leftshadeC;
      this.topshade = topshadeC;
      this.bottomshade = bottomshadeC;
    }
  
    render() {
    var frontshade = this.frontshade;
    var backshade = this.backshade;
    var rightshade = this.rightshade;
    var leftshade = this.leftshade;
    var topshade = this.topshade;
    var bottomshade = this.bottomshade;

    var rgba = this.color;

    var cubevertices = [
      // FRONT OF CUBE
      0.0, 0.0, 0.0,     frontshade*rgba[0], frontshade*rgba[1], frontshade*rgba[2], rgba[3], 
      1.0, 1.0, 0.0,     frontshade*rgba[0], frontshade*rgba[1], frontshade*rgba[2], rgba[3],
      1.0, 0.0, 0.0,     frontshade*rgba[0], frontshade*rgba[1], frontshade*rgba[2], rgba[3],
      0.0, 0.0, 0.0,     frontshade*rgba[0], frontshade*rgba[1], frontshade*rgba[2], rgba[3],
      0.0, 1.0, 0.0,     frontshade*rgba[0], frontshade*rgba[1], frontshade*rgba[2], rgba[3],
      1.0, 1.0, 0.0,     frontshade*rgba[0], frontshade*rgba[1], frontshade*rgba[2], rgba[3],
      
      // BACK OF CUBE
      1.0, 0.0, 1.0,     backshade*rgba[0], backshade*rgba[1], backshade*rgba[2], rgba[3],
      1.0, 1.0, 1.0,     backshade*rgba[0], backshade*rgba[1], backshade*rgba[2], rgba[3],
      0.0, 1.0, 1.0,     backshade*rgba[0], backshade*rgba[1], backshade*rgba[2], rgba[3],
      1.0, 0.0, 1.0,     backshade*rgba[0], backshade*rgba[1], backshade*rgba[2], rgba[3],
      0.0, 1.0, 1.0,     backshade*rgba[0], backshade*rgba[1], backshade*rgba[2], rgba[3],
      0.0, 0.0, 1.0,     backshade*rgba[0], backshade*rgba[1], backshade*rgba[2], rgba[3],

      // RIGHT OF CUBE
      1.0, 0.0, 0.0,     rightshade*rgba[0], rightshade*rgba[1], rightshade*rgba[2], rgba[3],
      1.0, 1.0, 0.0,     rightshade*rgba[0], rightshade*rgba[1], rightshade*rgba[2], rgba[3],
      1.0, 1.0, 1.0,     rightshade*rgba[0], rightshade*rgba[1], rightshade*rgba[2], rgba[3],
      1.0, 0.0, 0.0,     rightshade*rgba[0], rightshade*rgba[1], rightshade*rgba[2], rgba[3],
      1.0, 1.0, 1.0,     rightshade*rgba[0], rightshade*rgba[1], rightshade*rgba[2], rgba[3],
      1.0, 0.0, 1.0,     rightshade*rgba[0], rightshade*rgba[1], rightshade*rgba[2], rgba[3],

      // LEFT OF CUBE

      0.0, 0.0, 1.0,     leftshade*rgba[0], leftshade*rgba[1], leftshade*rgba[2], rgba[3],
      0.0, 1.0, 1.0,     leftshade*rgba[0], leftshade*rgba[1], leftshade*rgba[2], rgba[3],
      0.0, 1.0, 0.0,     leftshade*rgba[0], leftshade*rgba[1], leftshade*rgba[2], rgba[3],
      0.0, 0.0, 1.0,     leftshade*rgba[0], leftshade*rgba[1], leftshade*rgba[2], rgba[3],
      0.0, 1.0, 0.0,     leftshade*rgba[0], leftshade*rgba[1], leftshade*rgba[2], rgba[3],
      0.0, 0.0, 0.0,     leftshade*rgba[0], leftshade*rgba[1], leftshade*rgba[2], rgba[3],

      // TOP OF CUBE
      0.0, 1.0, 0.0,     topshade*rgba[0], topshade*rgba[1], topshade*rgba[2], rgba[3], 
      0.0, 1.0, 1.0,     topshade*rgba[0], topshade*rgba[1], topshade*rgba[2], rgba[3],
      1.0, 1.0, 1.0,     topshade*rgba[0], topshade*rgba[1], topshade*rgba[2], rgba[3],
      0.0, 1.0, 0.0,     topshade*rgba[0], topshade*rgba[1], topshade*rgba[2], rgba[3],
      1.0, 1.0, 1.0,     topshade*rgba[0], topshade*rgba[1], topshade*rgba[2], rgba[3],
      1.0, 1.0, 0.0,     topshade*rgba[0], topshade*rgba[1], topshade*rgba[2], rgba[3],

      // BOTTOM OF CUBE

      1.0, 0.0, 1.0,     bottomshade*rgba[0], bottomshade*rgba[1], bottomshade*rgba[2], rgba[3],
      0.0, 0.0, 1.0,     bottomshade*rgba[0], bottomshade*rgba[1], bottomshade*rgba[2], rgba[3],
      0.0, 0.0, 0.0,     bottomshade*rgba[0], bottomshade*rgba[1], bottomshade*rgba[2], rgba[3],
      1.0, 0.0, 1.0,     bottomshade*rgba[0], bottomshade*rgba[1], bottomshade*rgba[2], rgba[3],
      0.0, 0.0, 0.0,     bottomshade*rgba[0], bottomshade*rgba[1], bottomshade*rgba[2], rgba[3],
      1.0, 0.0, 0.0,     bottomshade*rgba[0], bottomshade*rgba[1], bottomshade*rgba[2], rgba[3],


    ]
    let cv = new Float32Array(cubevertices)


    gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);


    // DRAW CUBE
    var n = 3; // The number of vertices
    var tr = 12; // The number of triangles
  
    // Create a buffer object
    var cubevertexBuffer = gl.createBuffer();
    if (!cubevertexBuffer) {
      console.log('Failed to create the buffer object');
      return -1;
    }
  
    // Bind the buffer object to target
    gl.bindBuffer(gl.ARRAY_BUFFER, cubevertexBuffer);
  
    // Write date into the buffer object
    gl.bufferData(gl.ARRAY_BUFFER, cv, gl.DYNAMIC_DRAW);
  
    // Assign the buffer object to a_Position variable
    gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, 7*cv.BYTES_PER_ELEMENT, 0);
  
    // Enable the assignment to a_Position variable
    gl.enableVertexAttribArray(a_Position);

    gl.vertexAttribPointer(a_Color, 4, gl.FLOAT, false, 7*cv.BYTES_PER_ELEMENT, 3*cv.BYTES_PER_ELEMENT);
    gl.enableVertexAttribArray(a_Color);
  
    gl.drawArrays(gl.TRIANGLES, 0, tr*n);
  
  }
}