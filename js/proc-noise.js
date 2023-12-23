// PERLIN NOISE
// based 99.999% on Processing's implementation, found here:
// https://github.com/processing/processing/blob/master/core/src/processing/core/PApplet.java
// credit goes entirely to them. i just ported it to javascript.

var Perlin = function(seed) {
	if (seed != undefined) {
		this.alea_rand = new Alea(seed); // use provided seed
	} else {
		this.alea_rand = new Alea(); // use random seed
	}
	this.PERLIN_YWRAPB = 4;
	this.PERLIN_YWRAP = 1 << this.PERLIN_YWRAPB;
	this.PERLIN_ZWRAPB = 8;
	this.PERLIN_ZWRAP = 1 << this.PERLIN_ZWRAPB;
	this.PERLIN_SIZE = 4095;
	this.perlin_octaves = 4; // default to medium smooth
	this.perlin_amp_falloff = 0.5; // 50% reduction/octave
	this.perlin_array = new Array();
	// generate cos lookup table
	var DEG_TO_RAD = 0.0174532925;
	var SINCOS_PRECISION = 0.5;
	var SINCOS_LENGTH = Math.floor(360/SINCOS_PRECISION);
	this.cosLUT = new Array();
	for (var i = 0; i < SINCOS_LENGTH; i++) {
		this.cosLUT[i] = Math.cos(i * DEG_TO_RAD * SINCOS_PRECISION);
	}
	this.perlin_TWOPI = SINCOS_LENGTH;
	this.perlin_PI = SINCOS_LENGTH;
	this.perlin_PI >>= 1;
}

Perlin.prototype.noiseReseed = function() {
	this.alea_rand = new Alea(); // new random seed
	this.perlin_array = new Array(); // start the perlin array fresh
}

Perlin.prototype.noiseSeed = function(seed) {
	this.alea_rand = new Alea(seed); // use provided seed
	this.perlin_array = new Array(); // start the perlin array fresh
}


Perlin.prototype.noiseDetail = function(lod, falloff) {
	if (Math.floor(lod) > 0) this.perlin_octaves = Math.floor(lod);
	if (falloff != undefined && falloff > 0) this.perlin_amp_falloff = falloff;
}

Perlin.prototype.noise_fsc = function(i) {
	return 0.5 * (1.0 - this.cosLUT[Math.floor(i * this.perlin_PI) % this.perlin_TWOPI]);
}

Perlin.prototype.noise = function(x, y, z) {
	if (x == undefined) {
		return false; // we need at least one param
	}
	if (y == undefined) {
		y = 0; // use 0 if not provided
	}
	if (z == undefined) {
		z = 0; // use 0 if not provided
	}
	
	// build the first perlin array if there isn't one
	if (this.perlin_array.length == 0) {
		this.perlin_array = new Array();
		for (var i = 0; i < this.PERLIN_SIZE + 1; i++) {
			this.perlin_array[i] = this.alea_rand();
		}
	}

	var xi = Math.floor(x);
	var yi = Math.floor(y);
	var zi = Math.floor(z);
	var xf = x - xi;
	var yf = y - yi;
	var zf = z - zi;
	var r = 0;
	var ampl = 0.5;
	var rxf, ryf, n1, n2, n3;
	
	for (var i = 0; i < this.perlin_octaves; i++) {
		// look at all this math stuff
		var of = xi + (yi << this.PERLIN_YWRAPB) + (zi << this.PERLIN_ZWRAPB);
		rxf = this.noise_fsc(xf);
		ryf = this.noise_fsc(yf);
		n1  = this.perlin_array[of & this.PERLIN_SIZE];
		n1 += rxf * (this.perlin_array[(of + 1) & this.PERLIN_SIZE] - n1);
		n2  = this.perlin_array[(of + this.PERLIN_YWRAP) & this.PERLIN_SIZE];
		n2 += rxf * (this.perlin_array[(of + this.PERLIN_YWRAP + 1) & this.PERLIN_SIZE] - n2);
		n1 += ryf * (n2-n1);
		of += this.PERLIN_ZWRAP;
		n2  = this.perlin_array[of & this.PERLIN_SIZE];
		n2 += rxf * (this.perlin_array[(of + 1) & this.PERLIN_SIZE] - n2);
		n3  = this.perlin_array[(of + this.PERLIN_YWRAP) & this.PERLIN_SIZE];
		n3 += rxf * (this.perlin_array[(of + this.PERLIN_YWRAP + 1) & this.PERLIN_SIZE] - n3);
		n2 += ryf * (n3 - n2);
		n1 += this.noise_fsc(zf) * (n2 - n1);
		r += n1 * ampl;
		ampl *= this.perlin_amp_falloff;
		xi <<= 1;
		xf *= 2;
		yi <<= 1;
		yf *= 2;
		zi <<= 1; 
		zf *= 2;
		if (xf >= 1) { xi++; xf--; }
		if (yf >= 1) { yi++; yf--; }
		if (zf >= 1) { zi++; zf--; }
	}
	return r;
}