import {
  Mesh
} from 'three';

import { GeneratorUtils } from './GeneratorUtils.js';

class GeneratorItem_CityBlock {
  constructor(x,z) {

    this.x = x;
    this.z = z;

    this.utils = new GeneratorUtils();

    this.cityBlockSize = window.game.cityBlockSize;
    this.roadWidth = window.game.roadWidth;
    this.noise = window.game.cityBlockNoise;
    this.noiseFactor = window.game.cityBlockNoiseFactor;

    this.meshes = []; // no collision
    this.meshesCollid = [];
    this.updateables = [];

    // buildings

    let typeNoise = this.utils.fixNoise(this.noise.noise((this.x)*this.noiseFactor, (this.z)*this.noiseFactor));
    let subtypeNoise = this.utils.fixNoise(this.noise.noise(this.x*5, this.z*5));

    // rare mega building
    if (typeNoise<0.2) {
      if ( this.x % ((this.cityBlockSize+this.roadWidth)*6) == 0 && this.z % ((this.cityBlockSize+this.roadWidth)*6) == 0 ) {

        let xOff = this.cityBlockSize/2;
        let zOff = this.cityBlockSize/2;

        // don't place too close to path of player car
        if ( !(this.x+xOff<128 && this.x+xOff>-128)) {

          let rotateNoise = this.utils.fixNoise(this.noise.noise((this.x+xOff)*5, (this.z+zOff)*5));
          let rotate = this.utils.getBuildingRotation(rotateNoise);

          let scale = 0.75+(rotateNoise*0.25);

          let type = null;
          if (subtypeNoise<0.16) type = 'mega_01';
          else if (subtypeNoise<0.32) type = 'mega_02';
          else if (subtypeNoise<0.48) type = 'mega_03';
          else if (subtypeNoise<0.64) type = 'mega_04';
          else if (subtypeNoise<0.8) type = 'mega_05';
          else type = 'mega_06';

          let mesh = new Mesh( window.game.assets.getModel(type), window.game.assets.getMaterial('mega_building_01') );
          mesh.position.set( this.x+xOff, 0, this.z+zOff );
          mesh.scale.set(1, scale, 1);
          mesh.rotateY(rotate*Math.PI/180);
          this.meshesCollid.push(mesh);

        }
      }
    }

    if (typeNoise<0.1) {
      // nothing
    }
    else if (typeNoise<0.8) {
      for (let i=0; i<2; i++) {
        for (let j=0; j<2; j++) {

          let xOff = (i*(this.cityBlockSize/2))+this.cityBlockSize/4;
          let zOff = (j*(this.cityBlockSize/2))+this.cityBlockSize/4;

          let rotateNoise = this.utils.fixNoise(this.noise.noise((this.x+xOff)*5, (this.z+zOff)*5));
          let rotate = this.utils.getBuildingRotation(rotateNoise);

          let scale = 0.75+(rotateNoise*0.45);

          let topper = false;
          let smoke = false;

          typeNoise = this.utils.fixNoise(this.noise.noise((this.x+xOff)*this.noiseFactor, (this.z+zOff)*this.noiseFactor)); // update to subdivided location
          subtypeNoise = this.utils.fixNoise(this.noise.noise((this.x+xOff)*5, (this.z+zOff)*5));
          let type = null;
          let adsType = null;
          if (typeNoise<0.267) {
            if (subtypeNoise<0.33) type = 's_01_01';
            else if (subtypeNoise<0.66) type = 's_01_02';
            else type = 's_01_03';
            adsType = (Math.round(typeNoise*100)%2==0) ? 'ads_s_01_01' : 'ads_s_01_02';
          }
          else if (typeNoise<0.534) {
            if (subtypeNoise<0.33) type = 's_02_01';
            else if (subtypeNoise<0.66) type = 's_02_02';
            else type = 's_02_03';
            adsType = (Math.round(typeNoise*100)%2==0) ? 'ads_s_02_01' : 'ads_s_02_02';
          }
          else {
            if (subtypeNoise<0.33) type = 's_03_01';
            else if (subtypeNoise<0.66) type = 's_03_02';
            else type = 's_03_03';
            adsType = (Math.round(typeNoise*100)%2==0) ? 'ads_s_03_01' : 'ads_s_03_02';
            // topper
            let topperNoise = this.utils.fixNoise(this.noise.noise((this.x+xOff)*6, (this.z+zOff)*6));
            topper = (topperNoise>0.998);
            // spotlight
            if (window.game.environment.spotLights) {
              if (Math.random()<0.1 && subtypeNoise>0.8 && !topper) this.updateables.push(new Spotlight(this.x+xOff, 160*scale, this.z+zOff));
            }
          }

          // remove ads
          if (typeNoise>0.33 && typeNoise<0.66) adsType = null;

          let matNoise = this.utils.fixNoise(this.noise.noise((this.x+xOff)*-3, (this.z+zOff)*-3));
          let mat = this.utils.getBuildingMat(matNoise);

          // topper
          if (topper && adsType!=null) this.updateables.push(new Topper(this.x+xOff, 190*scale, this.z+zOff));

          // smoke
          if (Math.random()<0.05) this.updateables.push(new Smoke(this.x+xOff, 190*scale, this.z+zOff));

          let mesh = new Mesh( window.game.assets.getModel(type), mat );
          mesh.position.set( this.x+xOff, 0, this.z+zOff );
          mesh.scale.set(1, scale, 1);
          mesh.rotateY(rotate*Math.PI/180);
          this.meshesCollid.push(mesh);

          if (adsType!=null) {
            let ad = new Advert( this.x+xOff, 0, this.z+zOff, window.game.assets.getModel(adsType), false );
            ad.mesh.scale.set(1, scale, 1);
            ad.mesh.rotateY(-rotate*Math.PI/180);
            this.updateables.push(ad);
          }

        }
      }
    }
    else {

      let isTower = typeNoise>0.975;

      var xOff = this.cityBlockSize/2;
      var zOff = this.cityBlockSize/2;

      let subtypeNoise = this.utils.fixNoise(this.noise.noise((this.x)*4, (this.z)*4));
      let type = null;

      if (isTower) {
        if (subtypeNoise<0.33) type = 's_05_01';
        else if (subtypeNoise<0.66) type = 's_05_02';
        else type = 's_05_03';
      }
      else {
        if (subtypeNoise<0.33) type = 's_04_01';
        else if (subtypeNoise<0.66) type = 's_04_02';
        else type = 's_04_03';
      }

      let matNoise = this.utils.fixNoise(this.noise.noise((this.x+xOff)*-3, (this.z+zOff)*-3));
      let mat = this.utils.getBigBuildingMat(matNoise, subtypeNoise>0.9);

      let rotateNoise = this.utils.fixNoise(this.noise.noise((this.x+xOff)*4, (this.z+zOff)*4));
      let rotate = this.utils.getBuildingRotation(rotateNoise);

      // maybe have ads
      let adsType = null;
      let adsTypes;
      if ((Math.round(rotateNoise*100)%2==0)) {
        let adsNoise = this.utils.fixNoise(this.noise.noise((this.x+xOff)*6, (this.z+zOff)*6));
        if (isTower) {
          adsTypes = ['ads_s_05_01','ads_s_05_02','ads_s_05_03','ads_s_05_04'];
        }
        else {
          adsTypes = ['ads_s_04_01','ads_s_04_02','ads_s_04_03','ads_s_04_04'];
        }
        adsType = adsTypes[Math.floor(adsNoise*adsTypes.length)];
      }

      let scale = 1+(rotateNoise*0.5);

      let mesh = new Mesh( window.game.assets.getModel(type), mat );
      mesh.position.set( this.x+xOff, 0, this.z+zOff );
      mesh.scale.set(1, scale, 1);
      mesh.rotateY(rotate*Math.PI/180);
      this.meshesCollid.push(mesh);

      if (adsType!=null) {
        let ad = new Advert( this.x+xOff, 0, this.z+zOff, window.game.assets.getModel(adsType), isTower );
        ad.mesh.scale.set(1, scale, 1);
        ad.mesh.rotateY(-rotate*Math.PI/180);
        this.updateables.push(ad);
      }

    }

    // ground plane
    let groundMesh = new Mesh( window.game.assets.getModel('ground'), window.game.assets.getMaterial('ground') );
    groundMesh.rotateX(-Math.PI/2);
    groundMesh.position.set( this.x+(this.cityBlockSize/2), 0, this.z+(this.cityBlockSize/2) );
    this.meshes.push(groundMesh);

    // storefronts and tramways
    if ( x % ((this.cityBlockSize+this.roadWidth)*2) == 0 && z % ((this.cityBlockSize+this.roadWidth)*2) == 0 ) {
      let mats = ['storefronts','building_02','building_03','building_07'];
      let mat = mats[Math.floor(subtypeNoise*mats.length)];
      if (!mat) mat = 'storefronts';
      var mesh = new Mesh( window.game.assets.getModel('storefronts'), window.game.assets.getMaterial(mat) );
      mesh.position.set( this.x+this.cityBlockSize+this.roadWidth/2, 0, this.z+this.cityBlockSize+this.roadWidth/2);
      this.meshesCollid.push(mesh);
    }

    // add meshes to scene
    for (var i=0; i<this.meshes.length; i++) {
      window.game.scene.add(this.meshes[i]);
    }
    // add collision meshes to scene and collider
    for (var i=0; i<this.meshesCollid.length; i++) {
      window.game.scene.add(this.meshesCollid[i]);
      window.game.collider.add(this.meshesCollid[i]);
    }

  }
  remove() {
    // remove meshes
    for (var i=0; i<this.meshes.length; i++) {
      window.game.scene.remove(this.meshes[i]);
    }
    for (var i=0; i<this.updateables.length; i++) {
      this.updateables[i].remove();
    }
    // remove collision meshes
    for (var i=0; i<this.meshesCollid.length; i++) {
      window.game.collider.remove(this.meshesCollid[i].uuid);
      window.game.scene.remove(this.meshesCollid[i]);
    }
  }
  update() {
    for (var i=0; i<this.updateables.length; i++) {
      this.updateables[i].update();
    }
  }
}

// building decorations

class Advert {
  constructor(x, y, z, geo, is_tower) {

    if (is_tower) {
      this.adsMats = ['ads_large_01','ads_large_02','ads_large_03','ads_large_04','ads_large_05'];
    }
    else {
      this.adsMats = ['ads_01','ads_02','ads_03','ads_04','ads_05'];
    }
    let mat = window.game.assets.getMaterial(this.adsMats[Math.floor(Math.random()*this.adsMats.length)]);

    this.mesh = new Mesh( geo, mat );
    this.mesh.position.set(x,y,z);
    window.game.scene.add( this.mesh );
    
    this.interval = 200+Math.random()*800;
    this.counter = Math.random()*this.interval;
    this.switches = Math.random()<0.5;

  }
  remove() {
    window.game.scene.remove(this.mesh);
  }
  update(){
    if (this.switches) {
      this.counter++;
      if (this.counter>this.interval) {
        this.counter=0;
        this.mesh.material = window.game.assets.getMaterial(this.adsMats[Math.floor(Math.random()*this.adsMats.length)]);
      }
    }
  }
}

class Topper {
  constructor(x, y, z) {

    let topperGeos = [
      'topper_01',
      'topper_02',
      'topper_03',
      'topper_04',
      'topper_05',
      'topper_06',
      'topper_07',
      'topper_08',
      'topper_09',
      'topper_10',
      'topper_11',
      'topper_12'
    ];

    let mats = ['ads_large_01','ads_large_02','ads_large_03','ads_large_04','ads_large_05'];
    let mat = window.game.assets.getMaterial(mats[Math.floor(Math.random()*mats.length)]);

    let geo = window.game.assets.getModel(topperGeos[Math.floor(Math.random()*topperGeos.length)]);

    this.mesh = new Mesh( geo, mat );
    this.mesh.position.set(x,y,z);
    let s = 0.8+Math.random();
    this.mesh.scale.set(s,s,s);          
    window.game.scene.add( this.mesh );

    this.rdir = Math.random()<=0.5 ? Math.random()*0.01 : -Math.random()*0.01;

  }
  remove() {
    window.game.scene.remove(this.mesh);
  }
  update(){
    this.mesh.rotation.y = this.mesh.rotation.y+this.rdir;
  }
}

class Smoke {
  constructor(x, y, z) {
    let mats = ['smoke_01','smoke_02','smoke_03'];
    let mat = window.game.assets.getMaterial(mats[Math.floor(Math.random()*mats.length)]);
    this.mesh = new Mesh( window.game.assets.getModel('smoke'), mat );
    this.mesh.position.set(x,y,z);
    var s = 1+Math.random()*8;
    var sy = s * (1+Math.random()*0.5);
    this.mesh.scale.set(s,sy,s);          
    window.game.scene.add( this.mesh );
    this.rstep = Math.random()*7;
  }
  remove() {
    window.game.scene.remove(this.mesh);
  }
  update(){
    this.rstep+=0.0025;
    this.mesh.lookAt(window.game.player.camera.position);
    this.mesh.rotation.x += Math.cos(this.rstep)*0.25;
  }
}

class Spotlight {
  constructor(x, y, z) {
    let mats = ['spotlight_01','spotlight_02','spotlight_03','spotlight_04'];
    let mat = window.game.assets.getMaterial(mats[Math.floor(Math.random()*mats.length)]);
    this.mesh = new Mesh( window.game.assets.getModel('spotlight'), mat );
    this.mesh.position.set(x,y,z);
    var s = 10+Math.random()*10;
    this.mesh.scale.set(s,s,s);          
    window.game.scene.add( this.mesh );
    this.rstep = Math.random()*7;
  }
  remove() {
    window.game.scene.remove(this.mesh);
  }
  update(){
    this.rstep+=0.01;
    this.mesh.lookAt(window.game.player.camera.position);
    this.mesh.rotation.x += Math.cos(this.rstep)*0.4;
  }
}

export { GeneratorItem_CityBlock }