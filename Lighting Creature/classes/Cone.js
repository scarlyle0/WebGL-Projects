class Cone{


    constructor(){
      this.type='cone';
      this.color = [1.0, 1.0, 1.0, 1.0]
      this.matrix = new Matrix4();
      this.segments = 10;
      this.size = 5.0;
    }
  
    render() {
    var shade = 0.8;
    var size = this.size;

    var rgba = this.color;
    let angleStep = 360/this.segments;
    var conevertices = [];
    var d = size/10.0;
    var tricount = 0;

    for(var angle = 0; angle < 360; angle=angle+angleStep){
        shade += 0.01;
        tricount += 2;
        let angle1 = angle;
        let angle2 = angle + angleStep;
        let vec1=[Math.cos(angle1*Math.PI/180)*d, Math.sin(angle1*Math.PI/180)*d]
        let vec2=[Math.cos(angle2*Math.PI/180)*d, Math.sin(angle2*Math.PI/180)*d]

        conevertices.push(
            vec1[0], vec1[1], 0,     shade*rgba[0], shade*rgba[1], shade*rgba[2], rgba[3], 0, 1,
            vec2[0], vec2[1], 0,     shade*rgba[0], shade*rgba[1], shade*rgba[2], rgba[3], 0, 1,
            0, 0, 1,                 shade*rgba[0], shade*rgba[1], shade*rgba[2], rgba[3], 0, 1,
            0, 0, 0,                 shade*rgba[0], shade*rgba[1], shade*rgba[2], rgba[3], 0, 1,
            vec1[0], vec1[1], 0,     shade*rgba[0], shade*rgba[1], shade*rgba[2], rgba[3], 0, 1,
            vec2[0], vec2[1], 0,     shade*rgba[0], shade*rgba[1], shade*rgba[2], rgba[3], 0, 1,
        )
    }

    let mv = new Float32Array(conevertices);


    gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);


    // DRAW CONE
    var verticescount = 3; // The number of vertices
  
    // Create a buffer object
    var conevertexBuffer = gl.createBuffer();
    if (!conevertexBuffer) {
      console.log('Failed to create the buffer object');
      return -1;
    }
  
    // Bind the buffer object to target
    gl.bindBuffer(gl.ARRAY_BUFFER, conevertexBuffer);
  
    // Write date into the buffer object
    gl.bufferData(gl.ARRAY_BUFFER, mv, gl.DYNAMIC_DRAW);
  


    // Assign the buffer object to a_Position variable
    gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false,  9*mv.BYTES_PER_ELEMENT, 0);
    gl.vertexAttribPointer(a_Color, 4, gl.FLOAT, false, 9*mv.BYTES_PER_ELEMENT, 3*mv.BYTES_PER_ELEMENT);
    gl.vertexAttribPointer(a_UV, 2, gl.FLOAT, false,  9*mv.BYTES_PER_ELEMENT, 7*mv.BYTES_PER_ELEMENTE);

    gl.enableVertexAttribArray(a_Color);
    gl.enableVertexAttribArray(a_Position);
    gl.enableVertexAttribArray(a_UV);
  
    gl.drawArrays(gl.TRIANGLES, 0, verticescount * tricount);
  
  }
}