import { System, Not } from "ecsy";
import { LocRotComponent } from "../../../src/core/components/position"
import { Obj3dComponent, ModelComponent, CameraComponent, LightComponent } from "../../../src/core/components/render"
import {RenderSystem} from "../../../src/core/systems/render"
import {PlanetaryComponent} from "../components/gravity"
import { vertexShader } from "../../shaders/planet.vert"
import { fragmentShader } from "../../shaders/planet.frag"
import * as THREE from "three"

console.log("vertexShader", vertexShader)

export class PlanetRenderSystem extends RenderSystem {
    
    create_mesh(e){
        console.log('making mesh for', e);
        const loc = e.getComponent(LocRotComponent)
        const model = e.getComponent(ModelComponent)
        
        const mesh = this.mesh_creator.create_mesh(model.geometry,model.material,model.receiveShadow,model.castShadow)
        mesh.scale.set( model.scale.x,model.scale.y,model.scale.z)
        mesh.position.set(loc.location.x,loc.location.y,loc.location.z)
        mesh.rotation.set(loc.rotation.x,loc.rotation.y,loc.rotation.z)
        this.scene.add( mesh )
        e.addComponent( Obj3dComponent, { obj: mesh })
    }

    create_planet(e) {
        console.log('making planet for', e); 
        console.log(vertexShader);
        const loc = e.getComponent(LocRotComponent)
        const model = e.getComponent(ModelComponent)
        const u = {
            time: { type: "f", value: 1.0 },
            resolution: { type: "v2", value: new THREE.Vector2() }
        }
        const planetSurface = new THREE.Mesh(
            new THREE.SphereGeometry(0.5, 8, 6), 
            new THREE.ShaderMaterial({
                uniforms: u, vertexShader: vertexShader, fragmentShader: fragmentShader
            })
        )
        
        planetSurface.scale.set(model.scale.x, model.scale.y, model.scale.z)
        planetSurface.position.set(loc.location.x, loc.location.y, loc.location.z)
        planetSurface.position.set(loc.rotation.x, loc.rotation.y, loc.rotation.z)

        const group = new THREE.Group();
        group.add(planetSurface)
        this.scene.add(group)
        e.addComponent( Obj3dComponent, { obj: group })
    }

    execute(delta,time){
        // Initialize meshes for any uninitialized models
        this.queries.unitialized_meshes.results.forEach( e => {
            this.create_mesh(e)
        })
        this.queries.unitialized_lights.results.forEach( e => {
            this.create_light(e)
        })
        this.queries.unitialized_cameras.results.forEach( e => {
            this.create_camera(e)
        })

        this.queries.uninitialized_planets.results.forEach( e => {
            this.create_planet(e)
        })

        // cleanup removed
        this.queries.remove.results.forEach( e => {
            const obj = e.getComponent(Obj3dComponent).obj
            if(obj.parent){
                obj.parent.remove(obj)
            }else{
                this.scene.remove(obj)
            }
            e.removeComponent(Obj3dComponent)
        })

        if(this.queries.camera.results.length > 0){
            const e = this.queries.camera.results[0]
            const camera = e.getComponent(Obj3dComponent).obj
            this.renderer.render( this.scene, camera )
        }
    }
}

PlanetRenderSystem.queries = Object.assign(RenderSystem.queries, {
    uninitialized_planets: {
        components: [ ModelComponent, LocRotComponent, Not(Obj3dComponent), PlanetaryComponent]
    },
    unitialized_meshes: {
        components: [ ModelComponent, LocRotComponent, Not(Obj3dComponent), Not(PlanetaryComponent)]
    },
});