class ObjectModel{
    constructor(fileName){
      this.type='object';
      this.text = "";
      this.matrix = new Matrix4();
      this.fileName = fileName;
      this.vertices = null;
      this.facecount = null;
      this.textureNum= -2;
      //this.objvertexBuffer = null;
    }

    parse(textString, color){
        var rgba = color;
        console.log(rgba);
        var totalvertices = [];
        var vertpool = [];
        var facecount = 0;
        var array = textString.split("\n");
        for (var i=2; i < array.length; i++){
            var words = array[i].split(" ")
            if (words[0] == 'v'){
                vertpool.push([parseFloat(words[1]), parseFloat(words[2]), parseFloat(words[3])])
            }
            if (words[0] == 'f'){
                facecount += 1;
                for (var j = 1; j < 4; j++){
                    for (var k = 0; k < 3; k++){
                        // console.log(words[j]);
                        // console.log(vertpool[words[j] - 1]);
                        totalvertices.push(vertpool[words[j] - 1][k]);
                    }
                    totalvertices.push(rgba[0], rgba[1], rgba[2], rgba[3], 1, 1)
                }
            }
        }
        // console.log(vertpool);
        //console.log(totalvertices);
        this.vertices = totalvertices;
        this.facecount = facecount;
    }

    render(){
        var g_objvertexBuffer = null;
        var tricount = this.facecount;
        var verticescount = 3;
  
        let cv = new Float32Array(this.vertices);
  
        gl.uniform1i(u_whichTexture, this.textureNum);
  
        //console.log(this.matrix.elements);
        gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);
  
        // // DRAW
        // if (this.objvertexBuffer === null){
        //   this.objvertexbuffer = objInitRender(cv, this.objvertexbuffer);
        // }
          // Create a buffer object
        var g_objvertexBuffer = gl.createBuffer();
        if (!g_objvertexBuffer) {
            console.log('Failed to create the buffer object');
            return -1;
        }

        // Bind the buffer object to target
        gl.bindBuffer(gl.ARRAY_BUFFER, g_objvertexBuffer);

        // Assign the buffer object to each a_variable
        gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, 9*cv.BYTES_PER_ELEMENT, 0);
        gl.vertexAttribPointer(a_Color, 4, gl.FLOAT, false, 9*cv.BYTES_PER_ELEMENT, 3*cv.BYTES_PER_ELEMENT);
        gl.vertexAttribPointer(a_UV, 2, gl.FLOAT, false, 9*cv.BYTES_PER_ELEMENT, 7*cv.BYTES_PER_ELEMENT);

        // Enable the assignment to a_Position variable
        gl.enableVertexAttribArray(a_Position);
        gl.enableVertexAttribArray(a_Color);
        gl.enableVertexAttribArray(a_UV);
            
        // Write date into the buffer object
        gl.bufferData(gl.ARRAY_BUFFER, cv, gl.DYNAMIC_DRAW);
        
  
        //console.log(g_cubevertexBuffer);
        gl.drawArrays(gl.TRIANGLES, 0, verticescount * tricount);
    }
}

// function objInitRender(cv, g_objvertexBuffer) {
//     console.log("objinit")

//   // Create a buffer object
//   var g_objvertexBuffer = gl.createBuffer();
//   if (!g_objvertexBuffer) {
//     console.log('Failed to create the buffer object');
//     return -1;
//   }

//   // Bind the buffer object to target
//   gl.bindBuffer(gl.ARRAY_BUFFER, g_objvertexBuffer);

//   // Assign the buffer object to each a_variable
//   gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, 9*cv.BYTES_PER_ELEMENT, 0);
//   gl.vertexAttribPointer(a_Color, 4, gl.FLOAT, false, 9*cv.BYTES_PER_ELEMENT, 3*cv.BYTES_PER_ELEMENT);
//   gl.vertexAttribPointer(a_UV, 2, gl.FLOAT, false, 9*cv.BYTES_PER_ELEMENT, 7*cv.BYTES_PER_ELEMENT);

//   // Enable the assignment to a_Position variable
//   gl.enableVertexAttribArray(a_Position);
//   gl.enableVertexAttribArray(a_Color);
//   gl.enableVertexAttribArray(a_UV);

//   return g_objvertexBuffer;
// }

var g_objDoc1 = null;
var g_objDoc2 = null;
var g_objDoc3 = null;
var g_objDoc4 = null;
var g_objDoc5 = null;

function LoadFromObjectFile(file, num, color){
    var request = new XMLHttpRequest();
    request.open('GET', file);
    request.onreadystatechange = function() {
        if (request.readyState === 4 && request.status !== 404) {
            onReadObjectFile(request.responseText, file, num, color);
        }
    }
    request.send();
}

function onReadObjectFile(textString, file, num, color){
    var objDoc = new ObjectModel(file);
    var result = objDoc.parse(textString, color);
    // check result for error 
    objDoc.text = textString;
    if (num == 1){
        g_objDoc1 = objDoc;
    } else if (num == 2){
        g_objDoc2 = objDoc;
    } else if (num == 3){
        g_objDoc3 = objDoc;
    } else if (num == 4){
        g_objDoc4 = objDoc;
    } else if (num == 5){
        g_objDoc5 = objDoc;
    }
}