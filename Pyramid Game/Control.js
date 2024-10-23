function keydown(ev){
    if (ev.keyCode == 67){
      doClick(1);
    }
    if (ev.keyCode == 88){
      doClick(2);
    }
    if (ev.keyCode == 87){
      g_wkey = 1;
    }
    if (ev.keyCode == 65){
      g_akey = 1;
    }
    if (ev.keyCode == 83){
      g_skey = 1;
    }
    if (ev.keyCode == 68){
      g_dkey = 1;
    }
    if (ev.keyCode == 38){
      ev.preventDefault();
      g_upkey = 1;
    }
    if (ev.keyCode == 40){
      ev.preventDefault();
      g_downkey = 1;
    }
    if (ev.keyCode == 37){
      ev.preventDefault();
      g_leftkey = 1;
    }
    if (ev.keyCode == 39){
      ev.preventDefault();
      g_rightkey = 1;
    }
    if (ev.keyCode == 81){
      g_qkey = 1;
    }
    if (ev.keyCode == 69){
      g_ekey = 1;
    }
    if (ev.keyCode == 32){
      ev.preventDefault();
      g_spacekey = 1;
    }
    if (ev.keyCode == 16){
      g_shiftkey = 1;
    }
  }
  
  function keyup(ev){
    if (ev.keyCode == 87){
      g_wkey = 0;
      controlCam();
    }
    if (ev.keyCode == 65){
      g_akey = 0;
    }
    if (ev.keyCode == 83){
      g_skey = 0;
    }
    if (ev.keyCode == 68){
      g_dkey = 0;
    }
    if (ev.keyCode == 38){
      g_upkey = 0;
    }
    if (ev.keyCode == 40){
      g_downkey = 0;
    }
    if (ev.keyCode == 37){
      g_leftkey = 0;
    }
    if (ev.keyCode == 39){
      g_rightkey = 0;
    }
    if (ev.keyCode == 81){
      g_qkey = 0;
    }
    if (ev.keyCode == 69){
      g_ekey = 0;
    }
    if (ev.keyCode == 32){
      g_spacekey = 0;
    }
    if (ev.keyCode == 16){
      g_shiftkey = 0;
    }
  }
  
  function controlCam(){
    if (g_wkey == 1){
      g_mainCamera.forward();
    }
    if (g_akey == 1){
      g_mainCamera.left();
    }
    if (g_skey == 1){
      g_mainCamera.backward();
    }
    if (g_dkey == 1){
      g_mainCamera.right();
    }
    if (g_upkey == 1){
      g_mainCamera.panUp();
    }
    if (g_downkey == 1){
      g_mainCamera.panDown();
    }
    if (g_leftkey == 1){
      g_mainCamera.panLeft();
    }
    if (g_rightkey == 1){
      g_mainCamera.panRight();
    }
    if (g_qkey == 1){
      g_mainCamera.panLeft();
    }
    if (g_ekey == 1){
      g_mainCamera.panRight();
    }
    if (g_spacekey == 1){
      g_mainCamera.moveup();
    }
    if (g_shiftkey == 1){
      g_mainCamera.movedown();
    }
  }
  
  // function click(ev) {
  
  //   if(ev.shiftKey){
  //     if (g_shiftAnimationOn == false){
  //       g_globalEyeColor = [1, 0, 0, 1];
  //       g_eyeAngleSpeed = 3;
  //       g_tailAngleSpeed = 6;
  //       g_bodyAngleSpeed = 6;
  //       g_shiftAnimationOn = true;
  //     } else if (g_shiftAnimationOn == true){
  //       g_globalEyeColor = [173/255 ,125/255 ,103/255, 1.0];
  //       g_eyeAngleSpeed = 1;
  //       g_tailAngleSpeed = 3;
  //       g_bodyAngleSpeed = 3;
  //       g_shiftAnimationOn = false;
  //     }
  //   }
    // Extract the event click and return it in WebGL coordinates
    // let [x,y] = convertCoordinatesEventToGL(ev);
    // let factor = 100;
  
    // let dy = factor * (y - starty);
    // g_globalAngleX = (g_globalAngleX + dy) % 360;
    // if (Math.round(g_globalAngleX < 0)){
    //   g_globalAngleX += 360;
    // }
  
    // let dx = factor * (x - startx);
    // g_globalAngleY = (g_globalAngleY + dx) % 360;
    // if (Math.round(g_globalAngleY < 0)){
    //   g_globalAngleY += 360;
    // }
  
       
    // document.getElementById("angleSlideX").value = g_globalAngleX;
    // document.getElementById("angleSlideY").value = g_globalAngleY;
  
    // starty = y;
    // startx = x;
  
    // console.log("X", g_globalAngleX);
    // console.log("Y", g_globalAngleY);
    // g_mainCamera.panLeft();
  
  
  // }

  
  function mouseCamMovement(ev){
    let [x,y] = convertCoordinatesEventToGL(ev);

    if (first == 0){
      startx = x;
      starty = y;
      first = 1
    }
  
    if (starty < y) {
        g_mainCamera.panUp();
    } else if (starty > y) {
        g_mainCamera.panDown();
    }

    if (startx < x) {
        g_mainCamera.panRight();
    } else if (startx > x) {
        g_mainCamera.panLeft();
    }
  
    
    startx = x;
    starty = y;
  }
  
  
  function convertCoordinatesEventToGL(ev){
    var x = ev.clientX; // x coordinate of a mouse pointer
    var y = ev.clientY; // y coordinate of a mouse pointer
    var rect = ev.target.getBoundingClientRect();
    
    x = ((x - rect.left) - canvas.width/2)/(canvas.width/2);
    y = (canvas.height/2 - (y - rect.top))/(canvas.height/2);
  
    return ([x,y]);
  }