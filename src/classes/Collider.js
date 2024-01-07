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

    this.enabled = false;

    this.debug = false;

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

  intersectsSphere(pos, rad) {

    if (!this.enabled) return false;

    this.updateMeshesInRange(pos);

    const obj = new Object3D();
		obj.position.set( pos.x, pos.y, pos.z )
		obj.updateMatrixWorld();

		for (let i=0; i<this.meshesInRange.length; i++) {
			let transformMatrix = new Matrix4().copy( this.meshesInRange[i].matrixWorld ).invert().multiply( obj.matrixWorld );
			let sphere = new Sphere( undefined, rad );
			sphere.applyMatrix4( transformMatrix );
			let hit = this.meshesInRange[i].geometry.boundsTree.intersectsSphere( sphere );
			if (hit) return true;
		}

		return false;

  }

  raycast(origin, dir) {

    if (!this.enabled) return [];

    // update meshes
    this.updateMeshesInRange(origin);

    // raycast
		this.rayCaster.set( origin, dir );
		return this.rayCaster.intersectObjects(this.meshesInRange);

	}

  updateMeshesInRange(pos) {

    // determine whether to update meshesInRange
    let updateMeshesInRange = false;
    if (this.vectorFromPrev===null) {
      this.vectorFromPrev = new Vector2(pos.x, pos.z);
      updateMeshesInRange = true;
    }
    else {
      if (Math.round(pos.x/this.updateDist)*this.updateDist != Math.round(this.vectorFromPrev.x/this.updateDist)*this.updateDist ||
          Math.round(pos.z/this.updateDist)*this.updateDist != Math.round(this.vectorFromPrev.y/this.updateDist)*this.updateDist)
      {
        this.vectorFromPrev.set(pos.x, pos.z);
        updateMeshesInRange = true;
      }
    }

    // update meshesInRange
    if (updateMeshesInRange) {
      this.meshesInRange = [];
      for (let i=0; i<this.meshes.length; i++) {
        this.vectorFrom.set( pos.x, pos.z );
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

  }

}

export { Collider }