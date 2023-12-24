import {
  Vector2,
  Mesh
} from 'three';

class GeneratorItem_Traffic {
  constructor(x,z) {

    this.x = x;
    this.z = z;

    this.roadWidth = window.game.roadWidth;

    this.cars = [];

    for (let j=0; j<3; j++) {
      for (let k=0; k<(Math.floor(Math.random()*3)); k++) 
        this.cars.push( new Car(j, this.x-this.roadWidth/2, this.z-this.roadWidth/2) );
    }

  }
  remove() {
    for (var i=0; i<this.cars.length; i++) {
      this.cars[i].remove();
    }
  }
  update() {
    for (var i=0; i<this.cars.length; i++) {
      this.cars[i].update();
    }
  }
}

class Car {
  constructor(dir, spawn_x, spawn_z) {

    this.dir = dir; // 0, 1, 2, 3

    this.spawn_x = spawn_x;
    this.spawn_z = spawn_z;

    this.x = spawn_x;
    this.z = spawn_z;
    this.alt = 0;
    this.alt_offset = 0;
    this.speed = 1.2;
    this.speed_factor = 1;
    this.v = new Vector2();

    // create mesh

    let carGeos = ['car_01','car_02','car_03','car_04','car_05','car_06','car_07','car_08'];
    let geo = window.game.assets.getModel(carGeos[Math.floor(Math.random()*8)]);
    let mat = window.game.assets.getMaterial('cars');

    this.mesh = new Mesh( geo, mat );
    this.mesh.position.set(this.spawn_x, this.alt, this.spawn_z);
    window.game.scene.add( this.mesh );

    // east
    if (this.dir==0) {
      this.v.set(this.speed, 0);
      this.alt = 20;
      this.mesh.rotateY(Math.PI/2);
      this.x -= Math.floor(Math.random()*20)*4;
    }
    // west
    if (this.dir==1) {
      this.v.set(-this.speed, 0);
      this.alt = 60;
      this.mesh.rotateY(-Math.PI/2);
      this.x -= Math.floor(Math.random()*20)*4;
    }
    // north
    if (this.dir==2) {
      this.v.set(0, -this.speed);
      this.alt = 40;
      this.mesh.rotateY(Math.PI);
      this.mesh.position.z = this.mesh.position.z-(Math.random()*2);
      this.z -= Math.floor(Math.random()*20)*4;
    }
    // south
    if (this.dir==3) {
      this.v.set(0, this.speed);
      this.alt = 80;
      this.mesh.position.z = this.mesh.position.z-(Math.random()*2);
      this.z -= Math.floor(Math.random()*20)*4;
    }

    // adjust alt
    if (Math.random()<0.5) this.alt_offset = 200;
    if (Math.random()<0.2) {
      this.alt_offset = 400;
      this.speed_factor = 2;
    }

  }
  remove() {
    window.game.scene.remove(this.mesh);
  }
  update(){

    if (this.mesh!=null) {

      this.x += this.v.x * this.speed_factor;
      this.z += this.v.y * this.speed_factor;

      this.mesh.position.set(this.x, this.alt+this.alt_offset, this.z);

      // destroy
      if (this.mesh.position.distanceTo(window.game.player.body.position) > (1000+Math.random()*500)) {
        // remove
        // if (this.mesh) {
        //   scene.remove(this.mesh);
        //   this.mesh = null;
        // }
        // reverse
        this.v.multiplyScalar(-1);
      }

    }
  }
}

export { GeneratorItem_Traffic }