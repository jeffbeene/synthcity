export { PlayerController };

class PlayerController {

	constructor() {

		this.enabled = false;

		this.mouse_move_x = 0;
		this.mouse_move_y = 0;
    this.mouse_scroll = 0;

		this.key_right = false;
		this.key_down = false;
		this.key_left = false;
		this.key_up = false;

		this.key_shift = false;

    this.key_plus = false;
    this.key_minus = false;

		this.key_f = false;
    this.key_r = false;
		this.key_pressed_f = false;
		this.key_pressed_r = false;
    this.key_pressed_right_bracket = false;
		this.key_pressed_left_bracket = false;
    this.key_pressed_p = false;
    this.key_pressed_space = false;
		this.key_pressed_1 = false;
		this.key_pressed_2 = false;
		this.key_pressed_3 = false;

		this.mb_right = false;
		this.mb_middle = false;
		this.mb_left = false;

		this.mb_left_released = false;

		var self = this;

		document.addEventListener("mousemove", function(event) { self.on_mouse_move(event) }, false);
		document.addEventListener("mousedown", function(event) { self.on_mouse_down(event) }, false);
		document.addEventListener("mouseup", function(event) { self.on_mouse_up(event) }, false);
		document.addEventListener("keydown", function(event) { self.on_key_down(event) }, false);
		document.addEventListener("keyup", function(event) { self.on_key_up(event) }, false);
    document.addEventListener("mousewheel", function(event) { self.on_mouse_wheel(event) }, false);

	}

	update() {
		this.mouse_move_x = 0;
		this.mouse_move_y = 0;
		this.key_pressed_f = false;
		this.key_pressed_r = false;
    this.key_pressed_right_bracket = false;
		this.key_pressed_left_bracket = false;
    this.key_pressed_p = false;
    this.key_pressed_space = false;
		this.key_pressed_1 = false;
		this.key_pressed_2 = false;
		this.key_pressed_3 = false;
		this.mb_left_released = false;
	}

  on_mouse_wheel(event) {
    this.mouse_scroll = event.deltaY;
  }
  get_mouse_wheel() {
    let v = this.mouse_scroll;
    this.mouse_scroll = 0;
    return v;
  }

	on_mouse_move(event) {
		if (this.enabled) {
			this.mouse_move_x = event.movementX || event.mozMovementX || event.webkitMovementX || 0;
			this.mouse_move_y = event.movementY || event.mozMovementY || event.webkitMovementY || 0;
		}
	}

	on_key_down(event) {
		if (this.enabled) {
		  switch (event.code) {
				case 'Digit1': //1
		      this.key_pressed_1 = true;
		      break;
				case 'Digit2': //2
		      this.key_pressed_2 = true;
		      break;
				case 'Digit3': //3
		      this.key_pressed_3 = true;
		      break;
		    case 'KeyD': //d
		      this.key_right = true;
		      break;
		    case 'KeyS': //s
		      this.key_down = true;
		      break;
		    case 'KeyA': //a
		      this.key_left = true;
		      break;
		    case 'KeyW': //w
		      this.key_up = true;
		      break;
				case 'ShiftLeft': //shift
		      this.key_shift = true;
		      break;
        case 'Equal': //plus
		      this.key_plus = true;
		      break;
        case 'Minus': //minus
		      this.key_minus = true;
		      break;
        case 'BracketLeft': //left bracket
		      this.key_pressed_left_bracket = true;
		      break;
        case 'BracketRight': //right bracket
		      this.key_pressed_right_bracket = true;
		      break;
        case 'KeyP': //p
		      this.key_pressed_p = true;
		      break;
        case 'Space': //space
		      this.key_pressed_space = true;
		      break;
		    case 'KeyF': //f
		      this.key_f = true;
		      this.key_pressed_f = true;
		      break;
				case 'KeyR': //r
          this.key_r = true;
		      this.key_pressed_r = true;
		      break;
		  }
		}
	}

	on_key_up(event) {
		if (this.enabled) {
		  switch (event.code) {
		    case 'KeyD': //d
		      this.key_right = false;
		      break;
		    case 'KeyS': //s
		      this.key_down = false;
		      break;
		    case 'KeyA': //a
		      this.key_left = false;
		      break;
		    case 'KeyW': //w
		      this.key_up = false;
		      break;
				case 'ShiftLeft': //shift
		      this.key_shift = false;
		      break;
        case 'Equal': //plus
		      this.key_plus = false;
		      break;
        case 'Minus': //minus
		      this.key_minus = false;
		      break;
        case 'KeyF': //f
		      this.key_f = false;
		      break;
		    case 'KeyR': //r
		      this.key_r = false;
		      break;
		  }
		}
	}

	on_mouse_down(event) {
		if (this.enabled) {
			switch (event.which) {
			  case 1:
			    this.mb_left = true;
			    break;
			  case 2:
			    this.mb_middle = true;
			    break;
			  case 3:
			    this.mb_right = true;
			    break;
			}
		}
	}

	on_mouse_up(event) {
		if (this.enabled) {
			switch (event.which) {
			  case 1:
			    this.mb_left = false;
					this.mb_left_released = true;
			    break;
			  case 2:
			    this.mb_middle = false;
			    break;
			  case 3:
			    this.mb_right = false;
			    break;
			}
		}
	}

}