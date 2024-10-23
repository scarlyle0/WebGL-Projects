class Camera{
    
    constructor(canvas){
        this.fov = 60;
        this.eye = new Vector3([-10,10,-30]);
        this.at = new Vector3([0,0,100]);
        this.up = new Vector3([0,1,0]);
        this.speed = 0.2;
        this.alpha = 1.5;
        this.projMat = new Matrix4().setPerspective(this.fov, canvas.width/canvas.height, 0.1, 1000);
        this.viewMat = new Matrix4().setLookAt(this.eye.elements[0], this.eye.elements[1], this.eye.elements[2], 
            this.at.elements[0], this.at.elements[1], this.at.elements[2], this.up.elements[0], this.up.elements[1], this.up.elements[2]);
    }

    moveup(){
        var newup = this.up;
        newup.normalize();
        newup.mul(this.speed);
        this.eye.add(newup);
        this.at.add(newup)

        this.projMat = new Matrix4().setPerspective(this.fov, canvas.width/canvas.height, 0.1, 1000);
        this.viewMat = new Matrix4().setLookAt(this.eye.elements[0], this.eye.elements[1], this.eye.elements[2], 
            this.at.elements[0], this.at.elements[1], this.at.elements[2], this.up.elements[0], this.up.elements[1], this.up.elements[2]);
    }

    movedown(){
        var newup = this.up;
        newup.normalize();
        newup.mul(this.speed);
        this.eye.sub(newup);
        this.at.sub(newup)

        this.projMat = new Matrix4().setPerspective(this.fov, canvas.width/canvas.height, 0.1, 1000);
        this.viewMat = new Matrix4().setLookAt(this.eye.elements[0], this.eye.elements[1], this.eye.elements[2], 
            this.at.elements[0], this.at.elements[1], this.at.elements[2], this.up.elements[0], this.up.elements[1], this.up.elements[2]);
    }

    forward(){
        var f = new Vector3();
        f.set(this.at);
        f.sub(this.eye);
        f.normalize();
        f.mul(this.speed);
        this.eye.add(f);
        this.at.add(f);

        this.projMat = new Matrix4().setPerspective(this.fov, canvas.width/canvas.height, 0.1, 1000);
        this.viewMat = new Matrix4().setLookAt(this.eye.elements[0], this.eye.elements[1], this.eye.elements[2], 
            this.at.elements[0], this.at.elements[1], this.at.elements[2], this.up.elements[0], this.up.elements[1], this.up.elements[2]);
    }

    backward(){
        var f = new Vector3();
        f.set(this.eye);
        f.sub(this.at);
        f.normalize();
        f.mul(this.speed);
        this.eye.add(f);
        this.at.add(f);

        this.projMat = new Matrix4().setPerspective(this.fov, canvas.width/canvas.height, 0.1, 1000);
        this.viewMat = new Matrix4().setLookAt(this.eye.elements[0], this.eye.elements[1], this.eye.elements[2], 
            this.at.elements[0], this.at.elements[1], this.at.elements[2], this.up.elements[0], this.up.elements[1], this.up.elements[2]);
    }

    left(){
        var f = new Vector3();
        f.set(this.at);
        f.sub(this.eye);
        var s = Vector3.cross(this.up, f);
        s.normalize();
        s.mul(this.speed);
        this.eye.add(s);
        this.at.add(s);

        this.projMat = new Matrix4().setPerspective(this.fov, canvas.width/canvas.height, 0.1, 1000);
        this.viewMat = new Matrix4().setLookAt(this.eye.elements[0], this.eye.elements[1], this.eye.elements[2], 
            this.at.elements[0], this.at.elements[1], this.at.elements[2], this.up.elements[0], this.up.elements[1], this.up.elements[2]);
    }

    right(){
        var f = new Vector3();
        f.set(this.at);
        f.sub(this.eye);
        var s = Vector3.cross(f, this.up);
        s.normalize();
        s.mul(this.speed);
        this.eye.add(s);
        this.at.add(s);

        this.projMat = new Matrix4().setPerspective(this.fov, canvas.width/canvas.height, 0.1, 1000);
        this.viewMat = new Matrix4().setLookAt(this.eye.elements[0], this.eye.elements[1], this.eye.elements[2], 
            this.at.elements[0], this.at.elements[1], this.at.elements[2], this.up.elements[0], this.up.elements[1], this.up.elements[2]);
    }

    panLeft(){
        var f = new Vector3();
        f.set(this.at);
        f.sub(this.eye);
        let rotationMatrix = new Matrix4().setIdentity();
        rotationMatrix.setRotate(this.alpha, this.up.elements[0], this.up.elements[1], this.up.elements[2]);
        let fprime = rotationMatrix.multiplyVector3(f);
        this.at = fprime.add(this.eye);

        this.projMat = new Matrix4().setPerspective(this.fov, canvas.width/canvas.height, 0.1, 1000);
        this.viewMat = new Matrix4().setLookAt(this.eye.elements[0], this.eye.elements[1], this.eye.elements[2], 
            this.at.elements[0], this.at.elements[1], this.at.elements[2], this.up.elements[0], this.up.elements[1], this.up.elements[2]);
    }
    
    panRight(){
        var f = new Vector3();
        f.set(this.at);
        f.sub(this.eye);
        let rotationMatrix = new Matrix4().setIdentity();
        rotationMatrix.setRotate(-this.alpha, this.up.elements[0], this.up.elements[1], this.up.elements[2]);
        let fprime = rotationMatrix.multiplyVector3(f);
        this.at = fprime.add(this.eye);

        this.projMat = new Matrix4().setPerspective(this.fov, canvas.width/canvas.height, 0.1, 1000);
        this.viewMat = new Matrix4().setLookAt(this.eye.elements[0], this.eye.elements[1], this.eye.elements[2], 
            this.at.elements[0], this.at.elements[1], this.at.elements[2], this.up.elements[0], this.up.elements[1], this.up.elements[2]);
    }

    panUp(){
        var f = new Vector3();
        var i = new Vector3([0, this.alpha + 1.5, 0]);
        f.set(this.at);
        f.add(i);
        f.sub(this.eye);
        let rotationMatrix = new Matrix4().setIdentity();
        let fprime = rotationMatrix.multiplyVector3(f);
        this.at = fprime.add(this.eye);

        this.projMat = new Matrix4().setPerspective(this.fov, canvas.width/canvas.height, 0.1, 1000);
        this.viewMat = new Matrix4().setLookAt(this.eye.elements[0], this.eye.elements[1], this.eye.elements[2], 
            this.at.elements[0], this.at.elements[1], this.at.elements[2], this.up.elements[0], this.up.elements[1], this.up.elements[2]);
    }

    panDown(){
        var f = new Vector3();
        var i = new Vector3([0, this.alpha + 1.5, 0]);
        f.set(this.at);
        f.sub(i);
        f.sub(this.eye);
        let rotationMatrix = new Matrix4().setIdentity();
        let fprime = rotationMatrix.multiplyVector3(f);
        this.at = fprime.add(this.eye);

        this.projMat = new Matrix4().setPerspective(this.fov, canvas.width/canvas.height, 0.1, 1000);
        this.viewMat = new Matrix4().setLookAt(this.eye.elements[0], this.eye.elements[1], this.eye.elements[2], 
            this.at.elements[0], this.at.elements[1], this.at.elements[2], this.up.elements[0], this.up.elements[1], this.up.elements[2]);
    }
}