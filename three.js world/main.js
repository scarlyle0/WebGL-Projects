import * as THREE from 'three';
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';
import {OBJLoader} from 'three/addons/loaders/OBJLoader.js';
import {MTLLoader} from 'three/addons/loaders/MTLLoader.js';
import {GUI} from 'three/addons/libs/lil-gui.module.min.js';

function main() {
  const canvas = document.querySelector('#c');
  const renderer = new THREE.WebGLRenderer({antialias: true, canvas});
  renderer.outputColorSpace = THREE.SRGBColorSpace;

  const fov = 45;
  const aspect = 2;  // the canvas default
  const near = 0.1;
  const far = 1000;
  const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
  camera.position.set(0, 10, 50);

  const controls = new OrbitControls(camera, canvas);
  controls.target.set(0, 5, 0);
  controls.update();

  const scene = new THREE.Scene();

  // Fog
  const fognear = 1;
  const fogfar = 80;
  const color = 'lightblue';
  scene.background = new THREE.Color('white');
  scene.fog = new THREE.Fog(color, fognear, fogfar);


  // {
  //   const planeSize = 40;

  //   const loader = new THREE.TextureLoader();
  //   const texture = loader.load('resources/images/checker.png');
  //   texture.colorSpace = THREE.SRGBColorSpace;
  //   texture.wrapS = THREE.RepeatWrapping;
  //   texture.wrapT = THREE.RepeatWrapping;
  //   texture.magFilter = THREE.NearestFilter;
  //   const repeats = planeSize / 2;
  //   texture.repeat.set(repeats, repeats);

  //   const planeGeo = new THREE.PlaneGeometry(planeSize, planeSize);
  //   const planeMat = new THREE.MeshPhongMaterial({
  //     map: texture,
  //     side: THREE.DoubleSide,
  //   });
  //   const mesh = new THREE.Mesh(planeGeo, planeMat);
  //   mesh.rotation.x = Math.PI * -.5;
  //   scene.add(mesh);
  // }

  // Billboards

  const labelGeometry = new THREE.PlaneGeometry(1, 1);

  function makeLabelCanvas(size, name) {
    const borderSize = 2;
    const ctx = document.createElement('canvas').getContext('2d');
    const font =  `${size}px bold sans-serif`;
    ctx.font = font;
    // measure how long the name will be
    const doubleBorderSize = borderSize * 2;
    const width = ctx.measureText(name).width + doubleBorderSize;
    const height = size + doubleBorderSize;
    ctx.canvas.width = width;
    ctx.canvas.height = height;

    // need to set font again after resizing canvas
    ctx.font = font;
    ctx.textBaseline = 'top';

    ctx.fillStyle = 'blue';
    ctx.fillRect(0, 0, width, height);
    ctx.fillStyle = 'white';
    ctx.fillText(name, borderSize, borderSize);

    return ctx.canvas;
  }

  function makeBill(x, y, z, size, name, color) {
    const canvas = makeLabelCanvas(size, name);
    const texture = new THREE.CanvasTexture(canvas);
    // because our canvas is likely not a power of 2
    // in both dimensions set the filtering appropriately.
    texture.minFilter = THREE.LinearFilter;
    texture.wrapS = THREE.ClampToEdgeWrapping;
    texture.wrapT = THREE.ClampToEdgeWrapping;

    const labelMaterial = new THREE.SpriteMaterial({
      map: texture,
      transparent: true,
    });

    const root = new THREE.Object3D();
    root.position.x = x;

    // const cubeSize = 4;
    // const cubeGeo = new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize);
    // const cubeMat = new THREE.MeshPhongMaterial({color: '#8AC'});
    // cubeMat.opacity = 0.6;
    // cubeMat.transparent = true;
    // const mesh = new THREE.Mesh(cubeGeo, cubeMat);
    // mesh.scale.set(0.5,.5,0.5)
    // mesh.position.set(9, 9, 9);
    // root.add(mesh);

    const label = new THREE.Sprite(labelMaterial);
    root.add(label);
    label.position.y = y;
    label.position.z = z;

    // if units are meters then 0.01 here makes size
    // of the label into centimeters.
    const labelBaseScale = 0.01;
    label.scale.x = canvas.width  * labelBaseScale;
    label.scale.y = canvas.height * labelBaseScale;

    scene.add(root);
    return root;
  }

  makeBill(-1, 9, -5, 60, 'Giant Octopus', 'purple');
  makeBill(-20, 11, 0, 60, 'Magical Lantern', 'green');
  makeBill(10, 15, 18, 60, 'Magical Tower of Rendering a Cube inside a Cube', 'red');

  // Cylinder Objects
  {
    const cgeometry = new THREE.CylinderGeometry( 1, 1, 10, 100 ); 
    const cmaterial = new THREE.MeshBasicMaterial( {color: 0x808080} ); 
    const cylinder = new THREE.Mesh( cgeometry, cmaterial ); 
    cylinder.position.x = -20;
    cylinder.position.y = 0;
    cylinder.position.z = 0;
    scene.add( cylinder );
  }
  {
    const cgeometry = new THREE.CylinderGeometry( 1, 1, 10, 100 ); 
    const cmaterial = new THREE.MeshBasicMaterial( {color: 0x808080} ); 
    const cylinder = new THREE.Mesh( cgeometry, cmaterial ); 
    cylinder.position.x = -30;
    cylinder.position.y = 0;
    cylinder.position.z = 0;
    scene.add( cylinder );
  }
  {
    const cgeometry = new THREE.CylinderGeometry( 1, 1, 10, 100 ); 
    const cmaterial = new THREE.MeshBasicMaterial( {color: 0x808080} ); 
    const cylinder = new THREE.Mesh( cgeometry, cmaterial ); 
    cylinder.position.x = -10;
    cylinder.position.y = 0;
    cylinder.position.z = 0;
    scene.add( cylinder );
  }
  {
    const cgeometry = new THREE.CylinderGeometry( 1, 1, 10, 100 ); 
    const cmaterial = new THREE.MeshBasicMaterial( {color: 0x808080} ); 
    const cylinder = new THREE.Mesh( cgeometry, cmaterial ); 
    cylinder.position.x = -20;
    cylinder.position.y = 0;
    cylinder.position.z = 10;
    scene.add( cylinder );
  }
  {
    const cgeometry = new THREE.CylinderGeometry( 1, 1, 10, 100 ); 
    const cmaterial = new THREE.MeshBasicMaterial( {color: 0x808080} ); 
    const cylinder = new THREE.Mesh( cgeometry, cmaterial ); 
    cylinder.position.x = -20;
    cylinder.position.y = 0;
    cylinder.position.z = -10;
    scene.add( cylinder );
  }

  // Textures Cubes
  const textcubes = [];  // just an array we can use to rotate the cubes
  {
    const boxWidth = 1;
    const boxHeight = 1;
    const boxDepth = 1;
    const geometry = new THREE.BoxGeometry(boxWidth, boxHeight, boxDepth);

    const loader = new THREE.TextureLoader();
    loader.load('resources/images/water.png', (texture) => {
      const material = new THREE.MeshBasicMaterial({
        map: texture,
      });
      const cube = new THREE.Mesh(geometry, material);
      cube.position.x = -30;
      cube.position.y = 7;
      scene.add(cube);
      textcubes.push(cube);  // add to our list of cubes to rotate
    });
  }
  {
    const boxWidth = 1;
    const boxHeight = 1;
    const boxDepth = 1;
    const geometry = new THREE.BoxGeometry(boxWidth, boxHeight, boxDepth);

    const loader = new THREE.TextureLoader();
    loader.load('resources/images/water.png', (texture) => {
      const material = new THREE.MeshBasicMaterial({
        map: texture,
      });
      const cube = new THREE.Mesh(geometry, material);
      cube.position.x = -10;
      cube.position.y = 7;
      scene.add(cube);
      textcubes.push(cube);  // add to our list of cubes to rotate
    });
  }
  {
    const boxWidth = 1;
    const boxHeight = 1;
    const boxDepth = 1;
    const geometry = new THREE.BoxGeometry(boxWidth, boxHeight, boxDepth);

    const loader = new THREE.TextureLoader();
    loader.load('resources/images/water.png', (texture) => {
      const material = new THREE.MeshBasicMaterial({
        map: texture,
      });
      const cube = new THREE.Mesh(geometry, material);
      cube.position.x = -20;
      cube.position.y = 7;
      cube.position.z = -10;
      scene.add(cube);
      textcubes.push(cube);  // add to our list of cubes to rotate
    });
  }
  {
    const boxWidth = 1;
    const boxHeight = 1;
    const boxDepth = 1;
    const geometry = new THREE.BoxGeometry(boxWidth, boxHeight, boxDepth);

    const loader = new THREE.TextureLoader();
    loader.load('resources/images/water.png', (texture) => {
      const material = new THREE.MeshBasicMaterial({
        map: texture,
      });
      const cube = new THREE.Mesh(geometry, material);
      cube.position.x = -20;
      cube.position.y = 7;
      cube.position.z = 10;
      scene.add(cube);
      textcubes.push(cube);  // add to our list of cubes to rotate
    });
  }
  
 

  // Cube Object

  function makeCubeInstance(size, color, x, y, z, texture) {
    const cubeSize = size;
    const cubeGeo = new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize);
    const material = new THREE.MeshPhongMaterial({color});


    material.opacity = 0.6;
    material.transparent = true;
   
    const cube = new THREE.Mesh(cubeGeo, material);
    scene.add(cube);
   
    cube.position.x = x;
    cube.position.y = y;
    cube.position.z = z;
   
    return cube;
  }

  const cubes = [
    makeCubeInstance(0.5, '#8AC',  10, 2, 0, null),
    makeCubeInstance(0.75, '#8AC', 12, 3, 1, null),
    makeCubeInstance(1, '#8AC',  10, 4, -1, null),
    makeCubeInstance(1.25, '#8AC',  13, 6, null),
    makeCubeInstance(1.25, '#8AC',  11, 8, null),
    makeCubeInstance(1.5, '#8AC', 9, 9, 1, null),
    makeCubeInstance(1.75, '#8AC',  10, 11, -1, null),
    makeCubeInstance(2, '#8AC', 9, 13, 1, null),
    makeCubeInstance(3, '#8AC',  14, 14, 0, null),
    
  ];
  //scene.add(makeCubeInstance(0x88aacc, 20, 0, 0, 0))
  // {
  //   const cubeSize = 4;
  //   const cubeGeo = new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize);
  //   const cubeMat = new THREE.MeshPhongMaterial({color: '#8AC'});

  //   cubeMat.opacity = 0.6;
  //   cubeMat.transparent = true;
  //   const mesh = new THREE.Mesh(cubeGeo, cubeMat);
  //   mesh.scale.set(0.5,.5,0.5)
  //   mesh.position.set(cubeSize + 1, cubeSize / 2, 10);
  //   scene.add(mesh);
  // }

  // Render Targets
  const rtWidth = 512;
  const rtHeight = 512;
  const renderTarget = new THREE.WebGLRenderTarget(rtWidth, rtHeight);

  const rtFov = 75;
  const rtAspect = rtWidth / rtHeight;
  const rtNear = 0.1;
  const rtFar = 5;
  const rtCamera = new THREE.PerspectiveCamera(rtFov, rtAspect, rtNear, rtFar);
  rtCamera.position.z = 2;
  
  const rtScene = new THREE.Scene();
  rtScene.background = new THREE.Color('blue');

  {
    const color = 0xFFFFFF;
    const intensity = 1;
    const light = new THREE.DirectionalLight(color, intensity);
    light.position.set(-1, 2, 4);
    rtScene.add(light);
  }
    
  const boxWidth = 0.5;
  const boxHeight = 0.5;
  const boxDepth = 0.5;
  const geometry = new THREE.BoxGeometry(boxWidth, boxHeight, boxDepth);
    
  function makeInstance(geometry, color, x) {
    const material = new THREE.MeshPhongMaterial({color});
    
    const cube = new THREE.Mesh(geometry, material);
    rtScene.add(cube);
    
    cube.position.x = x;
    
    return cube;
  }
    
  const rtCubes = [
    makeInstance(geometry, 0x44aa88,  0),
    makeInstance(geometry, 0x8844aa, -2),
    makeInstance(geometry, 0xaa8844,  2),
  ];

  const material = new THREE.MeshPhongMaterial({
    map: renderTarget.texture,
  });

  const cube = new THREE.Mesh(geometry, material);
  cube.scale.set(5, 100, 5);
  cube.position.x = 10;
  cube.position.y = 10;
  cube.position.z = 10;
  scene.add(cube);


  class ColorGUIHelper {
    constructor(object, prop) {
      this.object = object;
      this.prop = prop;
    }
    get value() {
      return `#${this.object[this.prop].getHexString()}`;
    }
    set value(hexString) {
      this.object[this.prop].set(hexString);
    }
  }

  const gui = new GUI();

  function makeXYZGUI(gui, vector3, name, onChangeFn) {
    const folder = gui.addFolder(name);
    folder.add(vector3, 'x', -20, 20).onChange(onChangeFn);
    folder.add(vector3, 'y', -20, 20).onChange(onChangeFn);
    folder.add(vector3, 'z', -20, 20).onChange(onChangeFn);
    folder.open();
  }

  // Hemisphere Light
  {
    const skyColor = 0xB1E1FF;  // light blue
    const groundColor = 0x2B65EC;  // ocean blue
    const intensity = 0.6;
    const light = new THREE.HemisphereLight(skyColor, groundColor, intensity);
    scene.add(light);

    gui.addColor(new ColorGUIHelper(light, 'color'), 'value').name('skyColor');
    gui.addColor(new ColorGUIHelper(light, 'groundColor'), 'value').name('groundColor');
    gui.add(light, 'intensity', 0, 2, 0.01).name('hemisphereIntensity');
  }

  // Directional Light
  {
    const color = 0xFFFFFF;
    const intensity = 0.8;
    const light = new THREE.DirectionalLight(color, intensity);
    light.position.set(0, 10, 0);
    light.target.position.set(-5, 0, 0);
    scene.add(light);
    scene.add(light.target);

    const helper = new THREE.DirectionalLightHelper(light);
    scene.add(helper);

    function updateLight() {
      light.target.updateMatrixWorld();
      helper.update();
    }
    updateLight();

    gui.addColor(new ColorGUIHelper(light, 'color'), 'value').name('directionalColor');
    gui.add(light, 'intensity', 0, 2, 0.01).name('directionalIntensity');

    makeXYZGUI(gui, light.position, 'directionalPosition', updateLight);
    makeXYZGUI(gui, light.target.position, 'directionalTarget', updateLight);
  }

  //PointLight
  {
    const spherecolor = new THREE.Color("#FDB813");
    const geometry = new THREE.IcosahedronGeometry(1, 15);
    const material = new THREE.MeshBasicMaterial({ color: spherecolor });
    const sphere = new THREE.Mesh(geometry, material);
    sphere.position.set(-20, 8, 0);
    scene.add(sphere);


    const color = 0xFFFFFF;
    const intensity = 1;
    const light = new THREE.PointLight(color, intensity);
    light.position.set(-20, 8, 0);
    scene.add(light);

    const helper = new THREE.PointLightHelper(light);
    scene.add(helper);

    function updateLight() {
      helper.update();
    }

    gui.addColor(new ColorGUIHelper(light, 'color'), 'value').name('pointColor');
    gui.add(light, 'intensity', 0, 2, 0.01).name('pointIntensity');
    gui.add(light, 'distance', 0, 40).onChange(updateLight);

    makeXYZGUI(gui, light.position, 'pointPosition', updateLight);
  }

  {
    const mtlLoader = new MTLLoader();
    mtlLoader.load('resources/models/Octopus.mtl', (mtl) => {
      mtl.preload();
      const objLoader = new OBJLoader();
      objLoader.setMaterials(mtl);
      objLoader.load('resources/models/Octopus.obj', (root) => {
        //root.scale.setScalar(0.5);
        root.position.set(-1, -1.9, 0);
        scene.add(root);

        const box = new THREE.Box3().setFromObject(root);
        const boxSize = box.getSize(new THREE.Vector3()).length();
        const boxCenter = box.getCenter(new THREE.Vector3());
        console.log(boxSize);
        console.log(boxCenter);
      });
    });
  }

  {
    const mtlLoader = new MTLLoader();
    mtlLoader.load('resources/models/Wave.mtl', (mtl) => {
      mtl.preload();
      const objLoader = new OBJLoader();
      objLoader.setMaterials(mtl);
      objLoader.load('resources/models/Wave.obj', (root) => {
        root.scale.setScalar(0.00003);
        root.position.set(13, -4, 1);
        scene.add(root);

        // const box = new THREE.Box3().setFromObject(root);
        // const boxSize = box.getSize(new THREE.Vector3()).length();
        // const boxCenter = box.getCenter(new THREE.Vector3());
        // console.log(boxSize);
        // console.log(boxCenter);
      });
    });
  }

  {
    const loader = new THREE.TextureLoader();
    const texture = loader.load(
      'resources/images/ocean.jpg',
      () => {
        const rt = new THREE.WebGLCubeRenderTarget(texture.image.height);
        rt.fromEquirectangularTexture(renderer, texture);
        scene.background = rt.texture;
      });
  }

  

  function resizeRendererToDisplaySize(renderer) {
    const canvas = renderer.domElement;
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    const needResize = canvas.width !== width || canvas.height !== height;
    if (needResize) {
      renderer.setSize(width, height, false);
    }
    return needResize;
  }

  function render(time) {

    time *= 0.001;

    rtCubes.forEach((cube, ndx) => {
      const speed = 1 + ndx * .1;
      const rot = time * speed;
      cube.rotation.x = rot;
      cube.rotation.y = rot;
    });

    cubes.forEach((cube, ndx) => {
      const speed = 1 + ndx * .1;
      const rot = time * speed;
      cube.rotation.x = rot;
      cube.rotation.y = rot;
    });

    textcubes.forEach((cube, ndx) => {
      const speed = 1 + ndx * .1;
      const rot = time * speed;
      cube.rotation.x = rot;
      cube.rotation.y = rot;
    });

    renderer.setRenderTarget(renderTarget);
    renderer.render(rtScene, rtCamera);
    renderer.setRenderTarget(null);
  

    if (resizeRendererToDisplaySize(renderer)) {
      const canvas = renderer.domElement;
      camera.aspect = canvas.clientWidth / canvas.clientHeight;
      camera.updateProjectionMatrix();
    }

    renderer.render(scene, camera);

    requestAnimationFrame(render);
  }

  requestAnimationFrame(render);
}

main();