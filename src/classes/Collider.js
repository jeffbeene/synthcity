import {
  Raycaster,
  Object3D,
  Matrix4,
  Vector2,
  Vector3,
  Sphere,
  MeshBasicMaterial
} from 'three';

class Collider {

  constructor() {

    this.debug = true;

    this.meshes = [];

    this.rayCaster = new Raycaster();

    // distance optimization

    this.maxDist = 600;
    this.updateDist = 160;

    this.meshesInRange = [];
    this.vectorFromPrev = null;
    
    this.vectorFrom = new Vector2();
    this.vectorTo = new Vector2();

  }

  add(mesh) {

    this.meshes.push(mesh);

    // console.log(this.meshes);

  }

  remove(uuid) {

    const index = this.meshes.findIndex(e => e.uuid === uuid);
    this.meshes.splice(index, 1);

  }

  // broken...
  /*
  intersectsSphere(pos, rad) {

    const obj = new Object3D();
		obj.position.set( pos.x, pos.y, pos.z )
		obj.updateMatrixWorld();

		for (let i=0; i<this.meshes.length; i++) {
			let transformMatrix = new Matrix4().copy( this.meshes[i].matrixWorld ).invert().multiply( obj.matrixWorld );
			let sphere = new Sphere( new Vector3(), rad );
			sphere.applyMatrix4( transformMatrix );
			let hit = this.meshes[i].geometry.boundsTree.intersectsSphere( this.meshes[i], sphere );
			if (hit) return true;
		}

		return false;

  }
  */

  raycast(origin, dir) {

    // determine whether to update meshesInRange
    let updateMeshesInRange = false;
    if (this.vectorFromPrev===null) {
      this.vectorFromPrev = new Vector2(origin.x, origin.z);
      updateMeshesInRange = true;
    }
    else {
      if (Math.round(origin.x/this.updateDist)*this.updateDist != Math.round(this.vectorFromPrev.x/this.updateDist)*this.updateDist ||
          Math.round(origin.z/this.updateDist)*this.updateDist != Math.round(this.vectorFromPrev.y/this.updateDist)*this.updateDist)
      {
        this.vectorFromPrev.set(origin.x, origin.z);
        updateMeshesInRange = true;
      }
    }

    // update meshesInRange
    if (updateMeshesInRange) {
      console.log('updateMeshesInRange');
      this.meshesInRange = [];
      for (let i=0; i<this.meshes.length; i++) {
        this.vectorFrom.set( origin.x, origin.z );
        this.vectorTo.set( this.meshes[i].position.x, this.meshes[i].position.z );
        if ( this.vectorFrom.distanceTo(this.vectorTo) < this.maxDist ) {
          this.meshesInRange.push(this.meshes[i]);
          // debug
          if (this.debug) {
            this.meshes[i].material = new MeshBasicMaterial({
              color: 0x444444,
              wireframe: true
            });
          }
        }
      }
    }

    // raycast
		this.rayCaster.set( origin, dir );
		return this.rayCaster.intersectObjects(this.meshesInRange);

	}

}

export { Collider }