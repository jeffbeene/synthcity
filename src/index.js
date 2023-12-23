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
  PointLight
} from 'three';

import { PointerLockControls }  from 'three/examples/jsm/controls/PointerLockControls.js';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';
import { FXAAShader } from 'three/examples/jsm/shaders/FXAAShader.js';

import { AssetManager } from './classes/AssetManager.js';

import { Player } from './classes/Player.js';
import { PlayerController } from './classes/PlayerController.js';

import { Generator } from './classes/Generator.js';
import { GeneratorItem_CityBlock } from './classes/GeneratorItem_CityBlock.js';
import { GeneratorItem_CityLight } from './classes/GeneratorItem_CityLight.js';

window.game = new Game();

class Game {

  constructor() {

    // settings

    this.environment = this.getEnvironment('night');
    this.pixelRatioFactor = 1.5;

    // 9746
    // 4217
    // 5794
    this.seed = Math.round(Math.random()*10000);

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

    // elements

    this.blocker = document.getElementById( 'blocker' );
    this.canvas = document.getElementById('canvas');

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

    // camera

    this.camera = new PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 1000 ); // for pointer lock controls, player creates own camera

    // controls

    this.controls = new PointerLockControls( this.camera, document.body );
    this.playerController = new PlayerController();

    // player

    this.player = new Player({
      scene: this.scene,
      renderer: this.renderer,
      controller: this.playerController,
      x: 0,
      z: 0
    });

    /*----- post processing -----*/

    this.composer = new EffectComposer( this.renderer );
    this.composer.addPass( new RenderPass( this.scene, this.player.camera ) );

    // anti aliasing
    const fxaa = new ShaderPass( FXAAShader );
    const pixelRatio = this.renderer.getPixelRatio();
    fxaa.material.uniforms[ 'resolution' ].value.x = 1 / ( window.innerWidth * pixelRatio );
    fxaa.material.uniforms[ 'resolution' ].value.y = 1 / ( window.innerHeight * pixelRatio );
    this.composer.addPass( fxaa );

    // bloom fog
    const bloomPass = new UnrealBloomPass( new Vector2( window.innerWidth, window.innerHeight ), 0, 0, 0 );
    bloomPass.threshold = 0.0;
    bloomPass.strength = 10.0;
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
    this.cityBlockNoiseFactor = 0.0017;

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

    // render

    this.composer.render();

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
    this.blocker.style.display = 'none';
  }
  onControlsUnlock() {
    this.playerController.enabled = false;
    this.blocker.style.display = 'block';
  }

}