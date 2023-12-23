import {
  Clock,
  Scene,
  WebGLRenderer,
  ACESFilmicToneMapping,
  PerspectiveCamera,
  BoxGeometry,
  MeshBasicMaterial,
  Mesh,
  Fog,
  DirectionalLight,
  AmbientLight
} from 'three';

import { PointerLockControls }  from 'three/examples/jsm/controls/PointerLockControls.js';

import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';

import { AssetManager } from './classes/AssetManager.js';

import { Player } from './classes/Player.js';
import { PlayerController } from './classes/PlayerController.js';

new Game();

class Game {

  constructor() {

    // settings

    this.environment = this.getEnvironment('night');
    this.pixelRatioFactor = 1.0;

    // load

    this.assets = new AssetManager(this, 'assets/');
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

    /*----- environment -----*/

    // sky and fog

    this.scene.background = this.assets.getTexture(this.environment.sky);
    
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

    // test stuff

    const geometry = new BoxGeometry( 1, 1, 1 );
    const material = new MeshBasicMaterial( { color: 0x00ff00 } );
    const cube = new Mesh( geometry, material );
    this.scene.add( cube );

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

    // render

    this.composer.render();

  }

  getEnvironment(id) {

    const environments = {
      night: {
        sky: 'sky_night',
        evironmentMap: 'env_night',
        cityLights: true,
        windowLights: true,
        spotLights: true,
        fog: {
          color: 0x0f0d2d,
          start: 0,
          end: 2700
        },
        sun: {
          color: 0x080d27,
          intensity: 2.0,
          x: 64,
          y: 52,
          z: -15,
        },
        ambient: {
          color: 0x080d27,
          intensity: 1.0,
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