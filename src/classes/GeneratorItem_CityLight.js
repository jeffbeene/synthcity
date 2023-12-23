import { GeneratorUtils } from './GeneratorUtils.js';

class GeneratorItem_CityLight {
  constructor(x,z) {

    this.x = x;
    this.z = z;

    this.utils = new GeneratorUtils();

    this.cityLights = window.game.cityLights;
    this.noise = window.game.cityBlockNoise;
    this.noiseFactor = window.game.cityBlockNoiseFactor;

    this.lightIndex = null;

    let typeNoise = this.utils.fixNoise(this.noise.noise(this.x*this.noiseFactor, this.z*this.noiseFactor));

    // light
    if (typeNoise<0.2 || typeNoise>0.8) {
      for (var i=0; i<this.cityLights.length; i++) {
        if (this.cityLights[i].free) {
          let colorNoise = this.utils.fixNoise(this.noise.noise((this.x)*4, (this.z)*4));
          let hue = 0.5 + ( colorNoise / 2 );
          this.cityLights[i].light.position.set(this.x, 100, this.z);
          this.cityLights[i].light.color.setHSL(hue, 1, 0.5);
          this.cityLights[i].free = false;
          this.lightIndex = i;
          // break
          i = this.cityLights.length;
        }
      }
    }

  }
  remove() {
    if (this.lightIndex!==null) {
      this.cityLights[this.lightIndex].free = true;
    }
  }
  update() {}
}

export { GeneratorItem_CityLight }