class Sphere{


    constructor(){
      this.type='sphere';
      this.color = [1.0, 1.0, 1.0, 1.0]
      this.matrix = new Matrix4();
    }
  
    render() {

      let sin = Math.sin;
      let cos = Math.cos;
  
      var rgba = this.color;
  
      var spherevertices = []

      var d = Math.PI/10;
      var dd = Math.PI/10;

      var tricount = 0;
      var verticescount = 3;

      for (var t=0; t < Math.PI; t += d) {
        for (var r = 0; r < (2*Math.PI); r += d) {
            var p1 = [sin(t)*cos(r), sin(t)*sin(r), cos(t)];
            
            var p2 = [sin(t+dd)*cos(r), sin(t+dd)*sin(r), cos(t+dd)];
            var p3 = [sin(t)*cos(r+dd), sin(t)*sin(r+dd), cos(t)];
            var p4 = [sin(t+dd)*cos(r+dd), sin(t+dd)*sin(r+dd), cos(t+dd)];

            spherevertices.push(p1[0], p1[1], p1[2], 0, 0, 1, 1, p1[0], p1[1], p1[2]);
            spherevertices.push(p2[0], p2[1], p2[2], rgba[0], rgba[1], rgba[2], rgba[3], p2[0], p2[1], p2[2]);
            spherevertices.push(p4[0], p4[1], p4[2], rgba[0], rgba[1], rgba[2], rgba[3], p4[0], p4[1], p4[2]);

            spherevertices.push(p1[0], p1[1], p1[2], 0, 0, 1, 1, p1[0], p1[1], p1[2]);
            spherevertices.push(p4[0], p4[1], p4[2], rgba[0], rgba[1], rgba[2], rgba[3], p4[0], p4[1], p4[2]);
            spherevertices.push(p3[0], p3[1], p3[2], rgba[0], rgba[1], rgba[2], rgba[3], p3[0], p3[1], p3[2]);

            tricount += 2;
        }
      }
  
      let cv = new Float32Array(spherevertices);
      
      
      gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);
  
      // DRAW CUBE
      if (spherevertexBuffer == null){
        initRender(cv);
      }
  
      // Write date into the buffer object
      gl.bufferData(gl.ARRAY_BUFFER, cv, gl.DYNAMIC_DRAW);
      
  
      //console.log(g_cubevertexBuffer);
      gl.drawArrays(gl.TRIANGLES, 0, verticescount * tricount);
    }
  }
  
  var spherevertexBuffer = null;
  function initRender(cv) {
  
    // Create a buffer object
    var spherevertexBuffer = gl.createBuffer();
    if (!spherevertexBuffer) {
      console.log('Failed to create the buffer object');
      return -1;
    }
  
    // Bind the buffer object to target
    gl.bindBuffer(gl.ARRAY_BUFFER, spherevertexBuffer);
  
    // Assign the buffer object to each a_variable
    gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, 10*cv.BYTES_PER_ELEMENT, 0);
    gl.vertexAttribPointer(a_Color, 4, gl.FLOAT, false, 10*cv.BYTES_PER_ELEMENT, 3*cv.BYTES_PER_ELEMENT);
    gl.vertexAttribPointer(a_Normal, 3, gl.FLOAT, false, 10*cv.BYTES_PER_ELEMENT, 7*cv.BYTES_PER_ELEMENT);
  
    // Enable the assignment to a_Position variable
    gl.enableVertexAttribArray(a_Position);
    gl.enableVertexAttribArray(a_Color);
    gl.enableVertexAttribArray(a_Normal);
  }