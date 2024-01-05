import {
  PerspectiveCamera,
  Object3D,
  Vector3
} from 'three';

class Player {

	constructor(params) {

		// params

		this.scene = params.scene;
    this.renderer = params.renderer;
		this.controller = params.controller;

		// settings

		this.player_height = 250; // 1.67
		this.mouse_sensitivity = 0.00125;//0.002;
		this.look_smooth = 0.15;//0.075;
		this.look_roll_factor = 0.1;
		this.max_look_speed = 200;

		this.move_accel = 0.25;//0.01;

		this.walk_speed = 0.65;//0.1;
		this.run_speed = 4;//0.2;

    // audio

    this.soundWind = null;
    this.soundCityAmbient = null;

		// init

    this.camera_fov = 80;
    this.camera_fov_to = this.camera_fov;

		this.camera = new PerspectiveCamera( this.camera_fov, window.innerWidth / window.innerHeight, 1, 2800 );
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

		this.velocity = new Vector3();
		this.move_max_speed = 0;
		this.move_max_speed_current = 0;

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
		if (this.camera_target.rotation.x < -Math.PI/2+0.01) this.camera_target.rotation.x = -Math.PI/2+0.01;
		if (this.camera_target.rotation.x > Math.PI/2-0.01) this.camera_target.rotation.x = Math.PI/2-0.01;
		// yaw
		this.camera_target.rotation.y -= movementX*this.mouse_sensitivity;

    // zoom
    let mouse_wheel_delta = this.controller.get_mouse_wheel();
    if (mouse_wheel_delta!==0) {
      this.camera_fov_to += mouse_wheel_delta * 0.05;
      this.camera_fov_to = Math.max( Math.min( this.camera_fov_to, 90 ), 30 );
    }
    this.camera.fov += (this.camera_fov_to-this.camera.fov)*0.1;
    this.camera.updateProjectionMatrix();

		// set camera postion to body position
		this.camera.position.z = this.body.position.z;
		this.camera.position.x = this.body.position.x;
		this.camera.position.y = this.body.position.y;

		// roll
		this.camera_target.rotation.z = -this.angle_dist(this.camera_target.rotation.y, this.camera.rotation.y)*this.look_roll_factor;

		// smooth look
		this.camera.quaternion.slerp(this.camera_target.quaternion, this.look_smooth);

    /*--- UPDATE VELOCITY ---*/

    // accelerate
		if (this.controller.key_up || this.controller.key_down || this.controller.key_left || this.controller.key_right) {
			if (this.controller.key_up) {
				this.velocity.z -= Math.cos(-this.camera.rotation.y)*this.move_accel;
				this.velocity.x += Math.sin(-this.camera.rotation.y)*this.move_accel;
			}
			if (this.controller.key_down) {
				this.velocity.z -= Math.cos(-this.camera.rotation.y+Math.PI)*this.move_accel;
				this.velocity.x += Math.sin(-this.camera.rotation.y+Math.PI)*this.move_accel;
			}
			if (this.controller.key_left) {
				this.velocity.z -= Math.cos(-this.camera.rotation.y-Math.PI/2)*this.move_accel;
				this.velocity.x += Math.sin(-this.camera.rotation.y-Math.PI/2)*this.move_accel;
			}
			if (this.controller.key_right) {
				this.velocity.z -= Math.cos(-this.camera.rotation.y+Math.PI/2)*this.move_accel;
				this.velocity.x += Math.sin(-this.camera.rotation.y+Math.PI/2)*this.move_accel;
			}
		}
		// decelerate
		else {
			this.velocity.clampLength(0, this.velocity.length()-this.move_accel) ;
		}

    // max speed
		this.move_max_speed = this.controller.key_shift ? this.run_speed : this.walk_speed;
		if (this.move_max_speed_current < this.move_max_speed) this.move_max_speed_current = this.move_max_speed;
		if (this.move_max_speed_current > this.move_max_speed) this.move_max_speed_current -= this.move_accel;
		this.velocity.clampLength(0, this.move_max_speed_current);

    /*--- UPDATE POSITION ---*/

    // x, z
    this.body.position.x += this.velocity.x * (this.body.position.y*0.01);
    this.body.position.z += this.velocity.z * (this.body.position.y*0.01);

    // y
    if (this.controller.key_r) {
      this.body.position.y = this.body.position.y*1.02;
    }
    if (this.controller.key_f) {
      this.body.position.y = this.body.position.y/1.02;
    }
    if (this.body.position.y<15) this.body.position.y = 15;
    if (this.body.position.y>800) this.body.position.y = 800;

    /*--- UPDATE AUDIO ---*/

    if (this.soundWind) this.soundWind.setVolume( Math.min(Math.max(this.velocity.length() - this.walk_speed , 0), 1)*0.1 );
    if (this.soundCityAmbient) this.soundCityAmbient.setVolume( 1 - (this.body.position.y/800) );

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

export { Player };