import {
  Clock,
  Scene,
  WebGLRenderer,
  ACESFilmicToneMapping,
  SRGBColorSpace,
  PerspectiveCamera,
  Vector2,
  Fog,
  DirectionalLight,
  AmbientLight,
  PointLight,
  Audio,
  AudioLoader,
  AudioListener
} from 'three';

import { PointerLockControls }  from 'three/examples/jsm/controls/PointerLockControls.js';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';
import { FXAAShader } from 'three/examples/jsm/shaders/FXAAShader.js';

import { AssetManager } from './classes/AssetManager.js';
import { Shaders } from './classes/Shaders.js';

import { Player } from './classes/Player.js';
import { PlayerCar } from './classes/PlayerCar.js';
import { PlayerController } from './classes/PlayerController.js';

import { Generator } from './classes/Generator.js';
import { GeneratorItem_CityBlock } from './classes/GeneratorItem_CityBlock.js';
import { GeneratorItem_CityLight } from './classes/GeneratorItem_CityLight.js';
import { GeneratorItem_Traffic } from './classes/GeneratorItem_Traffic.js';

window.game = new Game();

class Game {

  constructor() {

    // user settings

    const url = new URL(window.location.href);
    const params = new URLSearchParams(url.search);

    this.settings = {
      mode: 'car',
      music: true,
      soundFx: true
    };

    if (params.has('mode')) this.settings.mode = params.get('mode');
    if (params.has('music')) this.settings.music = params.get('music');
    if (params.has('soundFx')) this.settings.soundFx = params.get('soundFx');

    //urlParams.get('soundFx')

    // internal settings

    this.environment = this.getEnvironment('night');
    this.pixelRatioFactor = 1.5;

    // 9746
    // 4217
    // 5794
    this.seed = Math.round(Math.random()*10000);

    // elements

    this.blocker = document.getElementById( 'blocker' );
    this.canvas = document.getElementById('canvas');

    // load

    this.assets = new AssetManager();
    this.assets.setPath('assets/');
    this.assets.load();

  }

  onLoad() {

    this.init();

  }

  init() {

    console.log('Game: Initializing');

    /*----- setup -----*/

    // audio loader

    this.audioLoader = new AudioLoader();
    this.audioInitialized = false;

    // renderer

    this.renderer = new WebGLRenderer({canvas: this.canvas});
    this.renderer.setPixelRatio( window.devicePixelRatio*this.pixelRatioFactor );
    this.renderer.setSize( window.innerWidth, window.innerHeight );
    this.renderer.toneMapping = ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.0;
    this.renderer.outputColorSpace = SRGBColorSpace;
    document.body.appendChild( this.renderer.domElement );

    // scene

    this.scene = new Scene();

    // camera (for pointer lock controls, player creates own camera)

    this.camera = new PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 1000 );

    // controls

    this.controls = new PointerLockControls( this.camera, document.body );
    this.playerController = new PlayerController();

    // create player

    if (this.settings.mode=='car') {
      this.player = new PlayerCar({
        scene: this.scene,
        renderer: this.renderer,
        controller: this.playerController,
        x: -12,
        z: 0
      });
    }
    else {
      this.player = new Player({
        scene: this.scene,
        renderer: this.renderer,
        controller: this.playerController,
        x: 0,
        z: 0
      });
    }

    /*----- post processing -----*/

    this.composer = new EffectComposer( this.renderer );

    // render pass
    this.composer.addPass(  new RenderPass( this.scene, this.player.camera ) );

    // anti aliasing
    const fxaa = new ShaderPass( FXAAShader );
    const pixelRatio = this.renderer.getPixelRatio();
    fxaa.material.uniforms[ 'resolution' ].value.x = 1 / ( window.innerWidth * pixelRatio );
    fxaa.material.uniforms[ 'resolution' ].value.y = 1 / ( window.innerHeight * pixelRatio );
    this.composer.addPass( fxaa );

    // bloom
    const bloomPass = new UnrealBloomPass( new Vector2( window.innerWidth, window.innerHeight ), 0, 0, 0 );
    bloomPass.threshold = 0.0;
    bloomPass.strength = 7.0;
    bloomPass.radius = 1.0;
    this.composer.addPass( bloomPass );

    /*----- environment -----*/

    // sky and fog

    this.scene.background = this.assets.getTexture(this.environment.sky);

    // this.scene.environment = this.assets.getTexture(this.environment.environmentMap);
    
    this.scene.fog = new Fog(this.environment.fog.color, this.environment.fog.start, this.environment.fog.end);

    // lights

    const light_sun = new DirectionalLight( this.environment.sun.color, this.environment.sun.intensity );
    light_sun.castShadow = false;
    light_sun.position.x = this.environment.sun.x;
    light_sun.position.y = this.environment.sun.y;
    light_sun.position.z = this.environment.sun.z;
    this.scene.add( light_sun );
    this.scene.add( light_sun.target );

    const light_ambient = new AmbientLight( this.environment.ambient.color, this.environment.ambient.intensity );
    this.scene.add( light_ambient );

    /*----- generators -----*/

    this.cityBlockSize = 128;
    this.roadWidth = 24;

    this.cityBlockNoise = new Perlin(this.seed);
    this.cityBlockNoise.noiseDetail(8, 0.5);
    this.cityBlockNoiseFactor = 0.0017;//0.0017;

    this.generatorCityBlock = new Generator({
      camera: this.player.camera,
      cell_size: this.cityBlockSize+this.roadWidth,
      cell_count: 40,
      spawn_obj: GeneratorItem_CityBlock
    });

    this.cityLights = [];
    this.generatorCityLights = null;
    if (this.environment.cityLights) {
      // create lights
      for (let i=0; i<10; i++) {
        let light = new PointLight( 0x000000, 100, 2000 );
        light.decay = 1;
        let l = {
          light: light,
          free: true
        }
        this.scene.add(l.light);
        this.cityLights.push(l);
      }
      // create generator
      this.generatorCityLights = new Generator({
        camera: this.player.camera,
        cell_size: (this.cityBlockSize+this.roadWidth)*4,
        cell_count: 8,
        spawn_obj: GeneratorItem_CityLight
      });
    }

    this.generatorTraffic = new Generator({
      camera: this.player.camera,
      cell_size: this.cityBlockSize+this.roadWidth,
      cell_count: 12,
      debug: false,
      spawn_obj: GeneratorItem_Traffic
    });

    /*----- animate -----*/

    // time

    this.clock = new Clock();
    this.clockDelta = 0;

    // animate

    this.animate();

    /*----- event listeners -----*/

    window.addEventListener( 'resize', () => this.onWindowResize(), false );

    this.blocker.addEventListener( 'click', () => this.onBlockerClick(), false );
    this.controls.addEventListener( 'lock', () => this.onControlsLock(), false );
    this.controls.addEventListener( 'unlock', () => this.onControlsUnlock(), false );

  }

  initAudio() {

    const self = this;

    if (!this.audioInitialized) {

      const audioListener = new AudioListener();
      this.player.camera.add( audioListener );

      // music
      if ( this.settings.music == 1 ) {
        const soundMusic = new Audio( audioListener );
        this.audioLoader.load( 'assets/sounds/music.wav', function( buffer ) {
          soundMusic.setBuffer( buffer );
          soundMusic.setLoop(true);
          soundMusic.setVolume(1);
          soundMusic.play();
        });
      }
      // sound effects
      if ( this.settings.soundFx == 1 ) {
        // traffic ambient
        const soundTrafficAmbient = new Audio( audioListener );
        this.audioLoader.load( 'assets/sounds/traffic_ambient.wav', function( buffer ) {
          soundTrafficAmbient.setBuffer( buffer );
          soundTrafficAmbient.setLoop(true);
          soundTrafficAmbient.setVolume(1);
          soundTrafficAmbient.play();
        });
        // car sounds
        if ( this.settings.mode == 'car' ) {
          const soundCarAmbient = new Audio( audioListener );
          this.audioLoader.load( 'assets/sounds/car_ambient.wav', function( buffer ) {
            soundCarAmbient.setBuffer( buffer );
            soundCarAmbient.setLoop(true);
            soundCarAmbient.setVolume(1);
            soundCarAmbient.play();
          });
          const soundCarWind = new Audio( audioListener );
          this.audioLoader.load( 'assets/sounds/car_wind.wav', function( buffer ) {
            soundCarWind.setBuffer( buffer );
            soundCarWind.setLoop(true);
            soundCarWind.setVolume(0);
            soundCarWind.play();
            self.player.soundWind = soundCarWind;
          });
        }
        // city sounds
        else {
          const soundCityAmbient = new Audio( audioListener );
          this.audioLoader.load( 'assets/sounds/city_ambient.wav', function( buffer ) {
            soundCityAmbient.setBuffer( buffer );
            soundCityAmbient.setLoop(true);
            soundCityAmbient.setVolume(0);
            soundCityAmbient.play();
            self.player.soundCityAmbient = soundCityAmbient;
          });
          const soundWind = new Audio( audioListener );
          this.audioLoader.load( 'assets/sounds/car_wind.wav', function( buffer ) {
            soundWind.setBuffer( buffer );
            soundWind.setLoop(true);
            soundWind.setVolume(0);
            soundWind.play();
            self.player.soundWind = soundWind;
          });
        }
      }

      this.audioInitialized = true;

    }

  }

  animate(now) {

    // animate

    requestAnimationFrame(() => this.animate());
    let delta = this.clock.getDelta(); // seconds
    this.clockDelta += delta;

    // update

    this.player.update();
    this.playerController.update();

    this.generatorCityBlock.update();
    if (this.generatorCityLights!==null) this.generatorCityLights.update();
    this.generatorTraffic.update();

    // render

    this.composer.render();
    // this.renderer.render(this.scene, this.player.camera);

  }

  getEnvironment(id) {

    const environments = {
      night: {
        sky: 'sky_night',
        environmentMap: 'env_night',
        cityLights: true,
        windowLights: true,
        spotLights: true,
        fog: {
          color: 0x12122a,
          start: 0,
          end: 2700
        },
        sun: {
          color: 0x8b79ff,
          intensity: 0.1,
          x: 1,
          y: 0.5,
          z: 0.25,
        },
        ambient: {
          color: 0x1b2c80,
          intensity: 0.5,
        }
      }
    };

    return environments[id];

  }

  // event listener callbacks

  onWindowResize() {

    const width = window.innerWidth;
    const height = window.innerHeight;
  
    this.renderer.setSize( width, height );
    this.composer.setSize( width, height );

    this.player.onWindowResize();
  
  }

  onBlockerClick() {
    this.controls.lock();
  }
  onControlsLock() {
    this.playerController.enabled = true;
    // this.blocker.style.display = 'none';
    this.blocker.classList.add('hide');
    this.initAudio();
  }
  onControlsUnlock() {
    this.playerController.enabled = false;
    // this.blocker.style.display = 'block';
    this.blocker.classList.remove('hide');
  }

}