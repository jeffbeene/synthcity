// "spawn_obj" must have methods: constructor(x, y)
// "spawn_obj" optional methods: remove(), and update()

class Generator {

  constructor(options) {

  	// defaults
  	var defaults = {
  		camera: false,
			cell_size: 1,
			cell_count: 10,
			debug: false,
			spawn_obj: false
  	}

  	// init vars
  	this.camera = options.camera || defaults.camera;
  	
  	this.cell_size = options.cell_size || defaults.cell_size;
  	this.cell_count = options.cell_count || defaults.cell_count;

  	this.debug = options.debug || defaults.debug;
  	this.debug_canvas = false;
  	this.debug_canvas_ctx = false;

  	this.noise = options.noise || defaults.noise;
  	this.noise_scale = options.noise_scale || defaults.noise_scale;

  	this.spawn_obj = options.spawn_obj || defaults.spawn_obj;

		// init position
  	this.x = Math.floor(this.camera.position.x / this.cell_size);
  	this.z = Math.floor(this.camera.position.z / this.cell_size);
  	this.px = this.x;
  	this.pz = this.z;

  	// init grid
  	this.grid = new Array(this.cell_count);
		for (var i=0; i<this.cell_count; i++) {
		  this.grid[i] = new Array();
		  for (var j=0; j<this.cell_count; j++) {
		  	this.grid[i][j] = null;
		  }
		}

  	// add items
		this.add_items();

  }

  update() {

  	// update position
  	this.px = this.x;
  	this.pz = this.z;
		this.x = Math.floor(this.camera.position.x / this.cell_size);
  	this.z = Math.floor(this.camera.position.z / this.cell_size);

		// update grid
		if ( this.px!=this.x || this.pz!=this.z ) {

			// remove items
			this.remove_items( this.px-this.x, this.pz-this.z );

			// shift array
			this.shift_grid( this.px-this.x, this.pz-this.z );

			// add items
			this.add_items();

		}

		// update items
		this.update_items();

  }

  remove_items( x, y ) {
  	var i, j;
  	if (x<0) {
  		for (i=0; i<this.grid.length; i++) {
		  	for (j=0; j<-x; j++) {
		  		if ( this.grid[i][j] != null ) {
		  			if (typeof this.grid[i][j].remove === "function") {
			  			this.grid[i][j].remove();
			  		}
		  			this.grid[i][j] = null;
		  		}
			  }
			}
  	}
  	if (x>0) {
  		for (i=0; i<this.grid.length; i++) {
		  	for (j=this.grid[i].length-x; j<this.grid[i].length; j++) {
		  		if ( this.grid[i][j] != null ) {
		  			if (typeof this.grid[i][j].remove === "function") {
			  			this.grid[i][j].remove();
			  		}
			  		this.grid[i][j] = null;
		  		}
			  }
			}
  	}
  	if (y<0) {
  		for (i=0; i<-y; i++) {
		  	for (j=0; j<this.grid[i].length; j++) {
		  		if ( this.grid[i][j] != null ) {
		  			if (typeof this.grid[i][j].remove === "function") {
			  			this.grid[i][j].remove();
			  		}
			  		this.grid[i][j] = null;
		  		}
			  }
			}
  	}
  	if (y>0) {
  		for (i=this.grid.length-y; i<this.grid.length; i++) {
		  	for (j=0; j<this.grid[i].length; j++) {
		  		if ( this.grid[i][j] != null ) {
		  			if (typeof this.grid[i][j].remove === "function") {
			  			this.grid[i][j].remove();
			  		}
			  		this.grid[i][j] = null;
		  		}
			  }
			}
  	}
  }

	shift_grid( x, y ) {
		var val, i, j;
		var temp_arr = new Array(this.grid.length);
		for (i=0; i<this.grid.length; ++i) {
	    temp_arr[i] = this.grid[i].slice(0);
	  }
		for (i=0; i<temp_arr.length; i++) {
		  for (j=0; j<temp_arr[i].length; j++) {
		  	if ( i-y<0 || i-y>=temp_arr.length || j-x<0 || j-x>=temp_arr[i].length ) {
		  		val = null;
		  	}
		  	else {
		  		val = temp_arr[i-y][j-x];
		  	}
		  	this.grid[i][j] = val;
		  }
		}
	}

  add_items() {
  	var i, j, xx, zz;
  	var rad = Math.ceil(this.cell_count/2);
  	for (i=0; i<this.grid.length; i++) {
	  	for (j=0; j<this.grid[i].length; j++) {
	  		if ( this.distance( {x:rad, y:rad}, {x:i, y:j} )<=rad ) {
		  		if (this.grid[i][j]==null) {
			  		xx = (Math.floor(this.camera.position.x / this.cell_size) * this.cell_size) + (j*this.cell_size) - Math.floor((this.cell_count*this.cell_size)/2);
			  		zz = (Math.floor(this.camera.position.z / this.cell_size) * this.cell_size) + (i*this.cell_size) - Math.floor((this.cell_count*this.cell_size)/2);
			  		this.grid[i][j] = new this.spawn_obj(xx, zz);
			  	}
			  }
	  	}
	  }
  }

  update_items() {
  	var i, j;
  	for (i=0; i<this.grid.length; i++) {
	  	for (j=0; j<this.grid[i].length; j++) {
	  		if (this.grid[i][j]!=null) {
	  			if (typeof this.grid[i][j].update === "function") {
		  			this.grid[i][j].update();
		  		}
	  		}
	  	}
	  }
  }

  distance(p1,p2) {
  	var dx = p2.x-p1.x;
  	var dy = p2.y-p1.y;
  	return Math.sqrt(dx*dx + dy*dy);
  }

}

export { Generator };