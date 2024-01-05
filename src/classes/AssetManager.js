import {
  LoadingManager,
  TextureLoader,
  EquirectangularReflectionMapping,
  LinearFilter,
  SRGBColorSpace,
  RepeatWrapping,
  PlaneGeometry,
  MeshBasicMaterial,
  MeshPhongMaterial,
  MeshStandardMaterial,
  MeshPhysicalMaterial,
  Color,
  AdditiveBlending,
  DoubleSide
} from 'three';

import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';

class AssetManager {

  constructor() {

    this.path = '';

    this.textureAnisotropy = 8;
    this.buildingWindowsEmissiveIntensity = window.game.environment.windowLights ? 1.5 : 0;;
    this.adsEmissiveIntensity = 0.1;

    this.textures = {};
    this.models = {};
    this.materials = {};

  }

  setPath(path) {
    this.path = path;
  }

  load() {

    console.log( 'AssetManager: Loading assets' );

    const self = this;

    /*----- loaders -----*/

    this.loadingManager = new LoadingManager();
    this.loadingManager.onProgress = function ( url, itemsLoaded, itemsTotal ) {
      window.writeAsset(url, itemsLoaded, itemsTotal);
    };
    this.loadingManager.onLoad = function () {
      console.log( 'AssetManager: Assets loaded' );
      window.game.onLoad();
    };
    this.loadingManager.onError = function ( url ) {
      console.error( 'AssetManager: Failed to load ' + url );
    };

    this.textureLoader = new TextureLoader(this.loadingManager);
    this.objLoader = new OBJLoader(this.loadingManager);

    /*----- textures -----*/

    this.textures['sky_night'] = this.textureLoader.load(this.path+'textures/sky_night.jpg');
    this.textures['sky_night'].colorSpace = SRGBColorSpace;
    this.textures['sky_night'].mapping = EquirectangularReflectionMapping;
    this.textures['sky_night'].magFilter = LinearFilter;

    this.textures['sky_day'] = this.textureLoader.load(this.path+'textures/sky_day.jpg');
    this.textures['sky_day'].colorSpace = SRGBColorSpace;
    this.textures['sky_day'].mapping = EquirectangularReflectionMapping;
    this.textures['sky_day'].magFilter = LinearFilter;

    this.textures['env_night'] = this.textureLoader.load(this.path+'textures/environment_night.jpg');
    this.textures['env_night'].mapping = EquirectangularReflectionMapping;
    this.textures['env_night'].magFilter = LinearFilter;

    this.textures['env_night_windshield'] = this.textureLoader.load(this.path+'textures/environment_night_windshield.jpg');
    this.textures['env_night_windshield'].mapping = EquirectangularReflectionMapping;
    this.textures['env_night_windshield'].magFilter = LinearFilter;

    this.textures['ground'] = this.textureLoader.load(this.path+'textures/ground.jpg');
    this.textures['ground_em'] = this.textureLoader.load(this.path+'textures/ground_em.jpg');

    this.textures['spinner_interior'] = this.textureLoader.load(this.path+'textures/0QuazDeckardCarLowpoly_interior_BaseColor.png');
    this.textures['spinner_interior_norm'] = this.textureLoader.load(this.path+'textures/0QuazDeckardCarLowpoly_interior_Normal.png');
    this.textures['spinner_interior_em'] = this.textureLoader.load(this.path+'textures/0QuazDeckardCarLowpoly_interior_Emissive.png');
    this.textures['spinner_interior_ao'] = this.textureLoader.load(this.path+'textures/0QuazDeckardCarLowpoly_interior_AmbientOcclusion.png');
    this.textures['spinner_exterior'] = this.textureLoader.load(this.path+'textures/0QuazDeckardCarLowpoly_car_BaseColor.png');

    this.textures['spinner_windows_norm'] = this.textureLoader.load(this.path+'textures/rain_normal_1024.jpg');
      this.textures['spinner_windows_norm'].wrapS = RepeatWrapping;
      this.textures['spinner_windows_norm'].wrapT = RepeatWrapping;
      this.textures['spinner_windows_norm'].repeat.set( 2.5, 2.5 );
    this.textures['spinner_windows_rough'] = this.textureLoader.load(this.path+'textures/smudges2_1024.jpg');
      this.textures['spinner_windows_rough'].wrapS = RepeatWrapping;
      this.textures['spinner_windows_rough'].wrapT = RepeatWrapping;
      this.textures['spinner_windows_rough'].repeat.set( 2.5, 2.5 );
    this.textures['spinner_windows_trans'] = this.textureLoader.load(this.path+'textures/smudges_inverted_1024.jpg');
      this.textures['spinner_windows_trans'].wrapS = RepeatWrapping;
      this.textures['spinner_windows_trans'].wrapT = RepeatWrapping;
      this.textures['spinner_windows_trans'].repeat.set( 2.5, 2.5 );

    this.textures['cars'] = this.textureLoader.load(this.path+'textures/cars.jpg');
    this.textures['cars_em'] = this.textureLoader.load(this.path+'textures/cars_em.jpg');

    this.textures['storefronts'] = this.textureLoader.load(this.path+'textures/storefronts_01.jpg');
      this.textures['storefronts'].wrapS = RepeatWrapping;
      this.textures['storefronts'].wrapT = RepeatWrapping;
      this.textures['storefronts'].anisotropy = this.textureAnisotropy;
    this.textures['storefronts_em'] = this.textureLoader.load(this.path+'textures/storefronts_01_em.jpg');
      this.textures['storefronts_em'].wrapS = RepeatWrapping;
      this.textures['storefronts_em'].wrapT = RepeatWrapping;
      this.textures['storefronts_em'].anisotropy = this.textureAnisotropy;

    this.textures['mega_building_01'] = this.textureLoader.load(this.path+'textures/mega_building_01.jpg');
      this.textures['mega_building_01'].wrapS = RepeatWrapping;
      this.textures['mega_building_01'].wrapT = RepeatWrapping;
      this.textures['mega_building_01'].anisotropy = this.textureAnisotropy;
    this.textures['mega_building_01_em'] = this.textureLoader.load(this.path+'textures/mega_building_01_em.jpg');
      this.textures['mega_building_01_em'].wrapS = RepeatWrapping;
      this.textures['mega_building_01_em'].wrapT = RepeatWrapping;
      this.textures['mega_building_01_em'].anisotropy = this.textureAnisotropy;

    // buildings
    for (let i=0; i<10; i++) {
      let id = this.padNumber(i+1);
      this.textures['building_'+id] = this.textureLoader.load(this.path+'textures/building_'+id+'.jpg');
        this.textures['building_'+id].wrapS = RepeatWrapping;
        this.textures['building_'+id].wrapT = RepeatWrapping;
        this.textures['building_'+id].anisotropy = this.textureAnisotropy;
      this.textures['building_'+id+'_em'] = this.textureLoader.load(this.path+'textures/building_'+id+'_em.jpg');
        this.textures['building_'+id+'_em'].wrapS = RepeatWrapping;
        this.textures['building_'+id+'_em'].wrapT = RepeatWrapping;
        this.textures['building_'+id+'_em'].anisotropy = this.textureAnisotropy;
      this.textures['building_'+id+'_rough'] = this.textureLoader.load(this.path+'textures/building_'+id+'_spec.jpg');
        this.textures['building_'+id+'_rough'].wrapS = RepeatWrapping;
        this.textures['building_'+id+'_rough'].wrapT = RepeatWrapping;
        this.textures['building_'+id+'_rough'].anisotropy = this.textureAnisotropy;
    }

    // small ads
    for (let i=0; i<5; i++) {
      let id = this.padNumber(i+1);
      this.textures['ads_'+id] = this.textureLoader.load(this.path+'textures/ads_'+id+'.jpg');
    }

    // large ads
    for (let i=0; i<5; i++) {
      let id = this.padNumber(i+1);
      this.textures['ads_large_'+id] = this.textureLoader.load(this.path+'textures/ads_large_'+id+'.jpg');
    }

    // smoke
    for (let i=0; i<3; i++) {
      let id = this.padNumber(i+1);
      this.textures['smoke_'+id] = this.textureLoader.load(this.path+'textures/smoke_'+id+'.jpg');
    }

    // spotlights
    for (let i=0; i<4; i++) {
      let id = this.padNumber(i+1);
      this.textures['spotlight_'+id] = this.textureLoader.load(this.path+'textures/spotlight_'+id+'.jpg');
    }

    /*----- models -----*/

    // car
    this.objLoader.load(this.path+'models/spinner.obj', function (obj) {
      self.models['spinner'] = obj.children[0].geometry;
      self.models['spinner'].rotateY(-Math.PI/2);
    });
    this.objLoader.load(this.path+'models/spinner_windows.obj', function (obj) {
      self.models['spinner_windows'] = obj.children[0].geometry;
      self.models['spinner_windows'].rotateY(-Math.PI/2);
    });

    // ground plane
    this.models['ground'] = new PlaneGeometry( window.game.cityBlockSize+window.game.roadWidth, window.game.cityBlockSize+window.game.roadWidth );

    // storefronts
    this.objLoader.load(this.path+'models/storefronts.obj', function (obj) {
      self.models['storefronts'] = obj.children[0].geometry;
      self.models['storefronts'].computeBoundsTree();
    });

    // buildings
    this.objLoader.load(this.path+'models/s_01_01.obj', function (obj) { 
      self.models['s_01_01'] = obj.children[0].geometry;
      self.models['s_01_01'].computeBoundsTree();
    });
    this.objLoader.load(this.path+'models/s_01_02.obj', function (obj) { 
      self.models['s_01_02'] = obj.children[0].geometry;
      self.models['s_01_02'].computeBoundsTree();
    });
    this.objLoader.load(this.path+'models/s_01_03.obj', function (obj) { 
      self.models['s_01_03'] = obj.children[0].geometry;
      self.models['s_01_03'].computeBoundsTree();
    });
    this.objLoader.load(this.path+'models/s_02_01.obj', function (obj) { 
      self.models['s_02_01'] = obj.children[0].geometry;
      self.models['s_02_01'].computeBoundsTree();
    });
    this.objLoader.load(this.path+'models/s_02_02.obj', function (obj) { 
      self.models['s_02_02'] = obj.children[0].geometry;
      self.models['s_02_02'].computeBoundsTree();
    });
    this.objLoader.load(this.path+'models/s_02_03.obj', function (obj) { 
      self.models['s_02_03'] = obj.children[0].geometry;
      self.models['s_02_03'].computeBoundsTree();
    });
    this.objLoader.load(this.path+'models/s_03_01.obj', function (obj) { 
      self.models['s_03_01'] = obj.children[0].geometry;
      self.models['s_03_01'].computeBoundsTree();
    });
    this.objLoader.load(this.path+'models/s_03_02.obj', function (obj) { 
      self.models['s_03_02'] = obj.children[0].geometry;
      self.models['s_03_02'].computeBoundsTree();
    });
    this.objLoader.load(this.path+'models/s_03_03.obj', function (obj) { 
      self.models['s_03_03'] = obj.children[0].geometry;
      self.models['s_03_03'].computeBoundsTree();
    });
    this.objLoader.load(this.path+'models/s_04_01.obj', function (obj) { 
      self.models['s_04_01'] = obj.children[0].geometry;
      self.models['s_04_01'].computeBoundsTree();
    });
    this.objLoader.load(this.path+'models/s_04_02.obj', function (obj) { 
      self.models['s_04_02'] = obj.children[0].geometry;
      self.models['s_04_02'].computeBoundsTree();
    });
    this.objLoader.load(this.path+'models/s_04_03.obj', function (obj) { 
      self.models['s_04_03'] = obj.children[0].geometry;
      self.models['s_04_03'].computeBoundsTree();
    });
    this.objLoader.load(this.path+'models/s_05_01.obj', function (obj) { 
      self.models['s_05_01'] = obj.children[0].geometry;
      self.models['s_05_01'].computeBoundsTree();
    });
    this.objLoader.load(this.path+'models/s_05_02.obj', function (obj) { 
      self.models['s_05_02'] = obj.children[0].geometry;
      self.models['s_05_02'].computeBoundsTree();
    });
    this.objLoader.load(this.path+'models/s_05_03.obj', function (obj) { 
      self.models['s_05_03'] = obj.children[0].geometry;
      self.models['s_05_03'].computeBoundsTree();
    });

    // mega buildings
    for (let i=0; i<6; i++) {
      let id = this.padNumber(i+1);
      this.objLoader.load(this.path+'models/mega_'+id+'.obj', function (obj) {
        self.models['mega_'+id] = obj.children[0].geometry;
        self.models['mega_'+id].computeBoundsTree();
      });
    }

    // ads
    this.objLoader.load(this.path+'models/ads_s_01_01.obj', function (obj) { self.models['ads_s_01_01'] = obj.children[0].geometry; });
    this.objLoader.load(this.path+'models/ads_s_01_02.obj', function (obj) { self.models['ads_s_01_02'] = obj.children[0].geometry; });
    this.objLoader.load(this.path+'models/ads_s_02_01.obj', function (obj) { self.models['ads_s_02_01'] = obj.children[0].geometry; });
    this.objLoader.load(this.path+'models/ads_s_02_02.obj', function (obj) { self.models['ads_s_02_02'] = obj.children[0].geometry; });
    this.objLoader.load(this.path+'models/ads_s_03_01.obj', function (obj) { self.models['ads_s_03_01'] = obj.children[0].geometry; });
    this.objLoader.load(this.path+'models/ads_s_03_02.obj', function (obj) { self.models['ads_s_03_02'] = obj.children[0].geometry; });
    this.objLoader.load(this.path+'models/ads_s_04_01.obj', function (obj) { self.models['ads_s_04_01'] = obj.children[0].geometry; });
    this.objLoader.load(this.path+'models/ads_s_04_02.obj', function (obj) { self.models['ads_s_04_02'] = obj.children[0].geometry; });
    this.objLoader.load(this.path+'models/ads_s_04_03.obj', function (obj) { self.models['ads_s_04_03'] = obj.children[0].geometry; });
    this.objLoader.load(this.path+'models/ads_s_04_04.obj', function (obj) { self.models['ads_s_04_04'] = obj.children[0].geometry; });
    this.objLoader.load(this.path+'models/ads_s_05_01.obj', function (obj) { self.models['ads_s_05_01'] = obj.children[0].geometry; });
    this.objLoader.load(this.path+'models/ads_s_05_02.obj', function (obj) { self.models['ads_s_05_02'] = obj.children[0].geometry; });
    this.objLoader.load(this.path+'models/ads_s_05_03.obj', function (obj) { self.models['ads_s_05_03'] = obj.children[0].geometry; });
    this.objLoader.load(this.path+'models/ads_s_05_04.obj', function (obj) { self.models['ads_s_05_04'] = obj.children[0].geometry; });

    // toppers
    for (let i=0; i<12; i++) {
      let id = this.padNumber(i+1);
      this.objLoader.load(this.path+'models/topper_'+id+'.obj', function (obj) { self.models['topper_'+id] = obj.children[0].geometry; });
    }

    // cars
    for (let i=0; i<8; i++) {
      let id = this.padNumber(i+1);
      this.objLoader.load(this.path+'models/car_'+id+'.obj', function (obj) { self.models['car_'+id] = obj.children[0].geometry; });
    }

    // smoke
    this.models['smoke'] = new PlaneGeometry( 64, 64 );

    // spotlight
    this.objLoader.load(this.path+'models/spotlight.obj', function (obj) { self.models['spotlight'] = obj.children[0].geometry; });

    /*----- materials -----*/

    this.materials['ground'] = new MeshPhongMaterial({
      map: this.getTexture('ground'),
      emissive: 0x0090ff,
      emissiveMap: this.getTexture('ground_em'),
      emissiveIntensity: window.game.environment.name=='night' ? 0.2 : 0,
      shininess: 0
    });

    this.materials['spinner_interior'] = new MeshStandardMaterial( {
      map: this.getTexture('spinner_interior'),
      normalMap: this.getTexture('spinner_interior_norm'),
      aoMap: this.getTexture('spinner_interior_ao'),
      aoMapIntensity: 1,
      roughness: 0.6,
      metalness: 0,
      emissive: 0xffffff,
      emissiveMap: this.getTexture('spinner_interior_em'),
      emissiveIntensity: 0.1,
    } );
    this.materials['spinner_exterior'] = new MeshPhongMaterial( {
      map: this.getTexture('spinner_exterior'),
      shininess: 0
    } );

    this.materials['spinner_windows_advanced'] = new MeshPhysicalMaterial( {
      color: 0xffffff,
      transparent: false,
      opacity: 1,
      roughness: 0.5,
      roughnessMap: this.getTexture('spinner_windows_rough'),
      metalness: 0,
      reflectivity: 1, //0.5
      transmission: 1,
      transmissionMap: this.getTexture('spinner_windows_trans'),
      thickness: 0.01,
      normalMap: this.getTexture('spinner_windows_norm')
    } );
   
    this.materials['spinner_windows_simple'] = new MeshStandardMaterial( {
      color: 0x808080,
      transparent: true,
      opacity: 0.1,
      envMap: this.getTexture('env_night_windshield'),
      roughness: 0,
      metalness: 1,
      normalMap: this.getTexture('spinner_windows_norm'),
      blending: AdditiveBlending
    } );

    this.materials['cars'] = new MeshPhongMaterial({
      map: this.getTexture('cars'),
      emissive: 0xffffff,
      emissiveMap: this.getTexture('cars_em'),
      emissiveIntensity: 1.0,
      side: DoubleSide
    });

    this.materials['storefronts'] = new MeshPhongMaterial({
      map: this.getTexture('storefronts'),
      emissive: 0xffffff,
      emissiveMap: this.getTexture('storefronts_em'),
      emissiveIntensity: this.buildingWindowsEmissiveIntensity,
      shininess: 0
    });

    // buildings
    for (let i=0; i<10; i++) {
      let id = this.padNumber(i+1);
      this.materials['building_'+id] = new MeshPhongMaterial({
        map: this.getTexture('building_'+id),
        specular: 0xffffff,
        specularMap: this.getTexture('building_'+id+'_rough'),
        envMap: this.getTexture('env_night'),
        emissive: new Color("hsl("+(Math.random()*360)+", 100%, 95%)"),
        emissiveMap: this.getTexture('building_'+id+'_em'),
        emissiveIntensity: this.buildingWindowsEmissiveIntensity,
        bumpMap: this.getTexture('building_'+id),
        bumpScale: 5
      });
    }

    // mega building
    this.materials['mega_building_01'] = new MeshPhongMaterial({
      map: this.getTexture('mega_building_01'),
      specular: 0x777777,
      shininess: 1,
      emissive: 0xffffff,
      emissiveMap: this.getTexture('mega_building_01_em'),
      emissiveIntensity: this.buildingWindowsEmissiveIntensity,
      bumpMap: this.getTexture('mega_building_01'),
      bumpScale: 10
    });

    // ads small
    for (let i=0; i<5; i++) {
      let id = this.padNumber(i+1);
      this.materials['ads_'+id] = new MeshPhongMaterial({
        // map: this.getTexture('ads_'+id),
        emissive: 0xffffff,
        emissiveMap: this.getTexture('ads_'+id),
        emissiveIntensity: this.adsEmissiveIntensity,
        blending: AdditiveBlending,
        fog: false,
        side: DoubleSide
      });
    }

    // ads large
    for (let i=0; i<5; i++) {
      let id = this.padNumber(i+1);
      this.materials['ads_large_'+id] = new MeshPhongMaterial({
        // map: this.getTexture('ads_large_'+id),
        emissive: 0xffffff,
        emissiveMap: this.getTexture('ads_large_'+id),
        emissiveIntensity: this.adsEmissiveIntensity,
        blending: AdditiveBlending,
        fog: false,
        side: DoubleSide
      });
    }

    // smoke
    for (let i=0; i<3; i++) {
      let id = this.padNumber(i+1);
      this.materials['smoke_'+id] = new MeshPhongMaterial({
        alphaMap: this.getTexture('smoke_'+id),
				color: 0xffffff,
				shininess: 0,
				specular: 0x000000,
				blending: AdditiveBlending,
				depthWrite: false,
				transparent: false
      });
    }

    // spotlights
    for (let i=0; i<4; i++) {
      let id = this.padNumber(i+1);
      this.materials['spotlight_'+id] = new MeshPhongMaterial({
        alphaMap: this.getTexture('spotlight_'+id),
				color: 0xffffff,
				shininess: 0,
				specular: 0x000000,
				blending: AdditiveBlending,
				depthWrite: false,
				transparent: false
      });
    }

  }

  getTexture(id) {
    return this.textures[id];
  }

  getModel(id) {
    return this.models[id];
  }

  getMaterial(id) {
    return this.materials[id];
  }

  // utils

  padNumber(num) {
    let i = num.toString();
    return i.padStart(2,'0');
  }

}

export { AssetManager };