class GeneratorUtils {

  constructor() {}

  getBuildingMat(noise) {
    let mats = [
      'building_01',
      'building_02',
      'building_03',
      'building_04',
      'building_05',
      'building_07'
    ];
    return window.game.assets.getMaterial(mats[Math.floor(noise*mats.length)]);
  }

  getBigBuildingMat(noise, rare) {
    let mats = [
      'building_01',
      'building_02',
      'building_03',
      'building_04',
      'building_05'
    ];
    let matsRare = [
      'building_06',
      'building_08',
      'building_09',
      'building_10'
    ];
    if (!rare) return window.game.assets.getMaterial(mats[Math.floor(noise*mats.length)]);
    else return window.game.assets.getMaterial(matsRare[Math.floor(noise*matsRare.length)]);
  }

  getBuildingRotation(noise) {
    let angles = [0,90,180,270];
    return angles[Math.floor(noise*angles.length)];
  }

  // greatly improves proc-noise distribution
  fixNoise(noise) {
    let inMin = 0.2;
    let inMax = 0.75;
    let outMin = 0;
    let outMax = 0.9999;
    let n = (noise - inMin) * (outMax - outMin) / (inMax - inMin) + outMin;
    if (n<outMin) n = outMin;
    if (n>outMax) n = outMax;
    return n;
  }

}

export { GeneratorUtils }