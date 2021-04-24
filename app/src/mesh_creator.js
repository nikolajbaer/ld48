import * as THREE from "three"
import { BaseMeshCreator } from "../../src/core/systems/render"

export class PlanetMeshCreator extends BaseMeshCreator {
    BASE_GEOMETRIES = {
        "box": new THREE.BoxGeometry(),
        "sphere": new THREE.SphereGeometry(0.5,32,32),
        "plane": new THREE.PlaneGeometry(0,1,5,5),
        "ground": new THREE.PlaneGeometry(1000,1000, 50, 50),
        "orbit": new THREE.RingGeometry(1,1.005,64),
    }

    BASE_MATERIALS = {
        "ground": new THREE.MeshLambertMaterial( { color: 0x333332 } ),
        "default": new THREE.MeshLambertMaterial( { color: 0x9999fe } ),
        "trail": new THREE.MeshBasicMaterial( { color: 0xffffff, opacity: 0.1, transparent: true }),
    }

    create_mesh(geometry,material,receiveShadow,castShadow){
        const m =new THREE.Mesh(
            this.BASE_GEOMETRIES[geometry],
            this.BASE_MATERIALS[material]?this.BASE_MATERIALS[material]:new THREE.MeshLambertMaterial({ color: material })
        )
        m.receiveShadow = receiveShadow
        m.castShadow = castShadow
        return m
    }
}
