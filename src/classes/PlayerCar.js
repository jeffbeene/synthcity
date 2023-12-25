import {
  Mesh,
  PointLight,
  PerspectiveCamera,
  Object3D,
  Vector3
} from 'three';

class PlayerCar {

	constructor(params) {

		// params

    this.scene = params.scene;
    this.renderer = params.renderer;
		this.controller = params.controller;

		// settings

		this.player_height = 250;//1.67;
		this.mouse_sensitivity = 0.001;//0.002;
		this.look_smooth = 0.1;//0.075;
		this.look_roll_factor = -0.065;
		this.max_look_speed = 200;

		this.move_accel = 0.02;//0.01;

		this.walk_speed = 1;//0.01;
		this.run_speed = 3;//0.2;

		this.light = new PointLight( 0x00d2ed, 0.25, 3 );
    this.light.decay = 1;
    this.scene.add( this.light );

		// init

    this.car = null;
    this.car_windows = null;
    this.car = new Mesh( window.game.assets.getModel('spinner'), [window.game.assets.getMaterial('spinner_interior'), window.game.assets.getMaterial('spinner_exterior')]);
    this.car_windows = new Mesh(window.game.assets.getModel('spinner_windows'), window.game.assets.getMaterial('spinner_windows'));
    if (this.car) this.scene.add(this.car);
    if (this.car_windows) this.scene.add(this.car_windows);

		this.camera = new PerspectiveCamera( 50, window.innerWidth / window.innerHeight, .1, 2800 );
		this.camera.rotation.order = 'YXZ';
		this.camera.rotation.y = Math.PI;
		this.camera.position.y = this.player_height;
		
		this.camera_target = new Object3D(); // used to get camera rotation set by PointerLockControls
		this.camera_target.rotation.order = 'YXZ';
		this.camera_target.rotation.y = Math.PI;

		this.body = new Object3D();
		this.body.position.x = params.x;
		this.body.position.z = params.z;
		this.body.position.y = this.player_height;

    this.noise_shake = new Perlin();
    this.noise_shake.noiseDetail(8, 0.5);

    this.car_dir = 0;
    this.car_dir_to = 0;

    this.car_pitch = 0;
    this.car_pitch_to = 0;

		this.velocity = new Vector3();
		this.move_max_speed = 0;
		this.move_max_speed_current = 0;
    this.autopilot = true;

    this.height_step = Math.PI;
    
  }

	update() {

		/*--- UPDATE CAMERA ---*/

		var movementX = this.controller.mouse_move_x;
		var movementY = this.controller.mouse_move_y;
		// limit movement
		if (movementX>this.max_look_speed) movementX = this.max_look_speed;
		if (movementX<-this.max_look_speed) movementX = -this.max_look_speed;
		if (movementY>this.max_look_speed) movementY = this.max_look_speed;
		if (movementY<-this.max_look_speed) movementY = -this.max_look_speed;
		// pitch
		this.camera_target.rotation.x -= movementY*this.mouse_sensitivity;
		if (this.camera_target.rotation.x < -Math.PI/2+0.1) this.camera_target.rotation.x = -Math.PI/2+0.1;
		if (this.camera_target.rotation.x > Math.PI/2-0.1) this.camera_target.rotation.x = Math.PI/2-0.1;
		// yaw
		this.camera_target.rotation.y -= movementX*this.mouse_sensitivity;

		// set camera postion to body position
		this.camera.position.z = this.body.position.z;
		this.camera.position.x = this.body.position.x;
		this.camera.position.y = this.body.position.y;

		// roll
		this.camera_target.rotation.z = -this.angle_dist(this.camera_target.rotation.y, this.camera.rotation.y)*this.look_roll_factor;

    // shake camera position
    var n = (this.noise_shake.noise(this.body.position.x*0.001, this.body.position.z*0.001) - 0.5);
    this.camera.position.x = this.camera.position.x + n*0.15;
    this.camera.position.z = this.camera.position.z + n*0.15;
    this.camera.position.y = this.camera.position.y + n*0.25;
    // shake camera rotation
    var n = (this.noise_shake.noise(this.body.position.x*0.1, this.body.position.z*0.1) - 0.5);
    this.camera.rotation.x = this.camera.rotation.x + n * 0.02 * Math.max(-this.car_pitch, 0);
    this.camera.rotation.z = this.camera.rotation.z + n * -0.01 * Math.max(-this.car_pitch, 0);
    this.camera.rotation.y = this.camera.rotation.y + n * 0.01 * Math.max(-this.car_pitch, 0);

		// smooth look
		this.camera.quaternion.slerp(this.camera_target.quaternion, this.look_smooth);

    /*--- UPDATE CAR ---*/

    if (this.controller.key_pressed_1) {
      if (this.autopilot) this.camera_target.rotation.y = this.car_dir+Math.PI;
      this.autopilot = !this.autopilot;
    }

    if (this.autopilot) {
      this.height_step+=0.001;
      this.body.position.y = (( (Math.cos(this.height_step) )+1)*150)+115;
    }
    else {
      this.car_dir_to = this.camera.rotation.y+Math.PI;
      this.car_pitch_to = this.camera.rotation.x;
      // if (this.body.position.y<60) this.car_pitch_to += this.angle_dist(this.car_pitch_to, Math.max(-this.car_pitch_to, 0));
      // if (this.body.position.y>1000) this.car_pitch_to += this.angle_dist(this.car_pitch_to, Math.min(-this.car_pitch_to, 0));
    }

    this.car_dir += this.angle_dist(this.car_dir, this.car_dir_to)*0.0075;
    this.car_pitch += this.angle_dist(this.car_pitch, this.car_pitch_to)*0.03;

    this.car.rotation.set(0, this.car_dir, 0);
    var forward = new Vector3(0, 0, 1);
    var left = new Vector3(-1, 0, 0);
    this.car.rotateOnAxis(forward, this.angle_dist(this.car_dir,this.car_dir_to) * -0.5);
    this.car.rotateOnAxis(left, this.car_pitch);

    this.car.position.set(this.camera.position.x, this.camera.position.y, this.camera.position.z);

    // shake car (affects direction)
    if (!this.autopilot) {
      let n = (this.noise_shake.noise(this.body.position.x*0.01, this.body.position.z*0.01) - 0.5);
      this.car_dir += n*0.0015;
      this.car_pitch += n*0.003;
    }

    // windows
    if (this.car_windows) this.car_windows.position.set(this.car.position.x, this.car.position.y, this.car.position.z);
    if (this.car_windows) this.car_windows.rotation.set(this.car.rotation.x, this.car.rotation.y, this.car.rotation.z);

    // light
    this.light.position.set(this.car.position.x, this.car.position.y, this.car.position.z);

    // disable car
    // this.car.position.set(0,0,0);
    // this.car_windows.position.set(0,0,0);
    // this.light.position.set(0,0,0);

    /*--- UPDATE POSITION ---*/

    this.velocity.z -= Math.cos(-this.car_dir+Math.PI) * Math.cos(this.car_pitch) * this.move_accel;
    this.velocity.x += Math.sin(-this.car_dir+Math.PI) * Math.cos(this.car_pitch) * this.move_accel;
    this.velocity.y += Math.sin(this.car_pitch) * this.move_accel;

    // max speed
		this.move_max_speed = this.controller.key_shift ? this.run_speed : this.walk_speed;
		if (this.move_max_speed_current < this.move_max_speed) this.move_max_speed_current = this.move_max_speed;
		if (this.move_max_speed_current > this.move_max_speed) this.move_max_speed_current -= this.move_accel;

    // momentum
		this.velocity.clampLength(0, this.move_max_speed_current * ( 1 + (-this.car_pitch / Math.PI ) * 2 ) );

    // update body position (no collision)
    this.body.position.x += this.velocity.x;
    this.body.position.z += this.velocity.z;
    if (!this.autopilot) {
      this.body.position.y += this.velocity.y;
    }

	}

	// window resize callback
	onWindowResize() {
		this.camera.aspect = window.innerWidth / window.innerHeight;
		this.camera.updateProjectionMatrix();
	}

	/*----- UTILS -----*/

	// shortest signed distance between two angles (radians)
	angle_dist(a, b) {
		var posDist, negDist;
		a = this.fix_angle(a);
		b = this.fix_angle(b);
		if (b > a) {
		  posDist = b - a;
		  negDist = a + ((Math.PI*2)-b);
		}
		else {
		  posDist = b + ((Math.PI*2)-a);
		  negDist = a - b;
		}
		if (posDist < negDist) {
		  return posDist;
		}
		else {
		  return -negDist;
		}
  }

  // ensures angle is between 0 and 360 (radians)
  fix_angle(a) {
  	return a - (Math.PI*2)*Math.floor(a/(Math.PI*2));
  }

}

export { PlayerCar };