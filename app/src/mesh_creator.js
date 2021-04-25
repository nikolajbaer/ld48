import * as THREE from "three"
import { BaseMeshCreator } from "../../src/core/systems/render"
import sputnikFBX from "../assets/sputnik.fbx"
import planet1FBX from "../assets/planets/p1.fbx"
import planet2FBX from "../assets/planets/p2.fbx"
import planet3FBX from "../assets/planets/p3.fbx"
import planet4FBX from "../assets/planets/p4.fbx"
import planet5FBX from "../assets/planets/p5.fbx"
import planet6FBX from "../assets/planets/p6.fbx"
import planet7FBX from "../assets/planets/p7.fbx"
import planet8FBX from "../assets/planets/p8.fbx"
import planet9FBX from "../assets/planets/p9.fbx"


import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';
console.log(sputnikFBX);

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
        "sun": new THREE.MeshBasicMaterial({ color: 0xFFFF00 }),
        "explosion": new THREE.MeshBasicMaterial({ color: 0xFFAA00 }),
    }

    PREFABS = {
        "sputnik": {url:sputnikFBX,obj:null}
    }

    PLANETS = [
        {url: planet1FBX, obj:null},
        {url: planet2FBX, obj:null},
        {url: planet3FBX, obj:null},
        {url: planet4FBX, obj:null},
        {url: planet5FBX, obj:null},
        {url: planet6FBX, obj:null},
        {url: planet7FBX, obj:null},
        {url: planet8FBX, obj:null},
        {url: planet9FBX, obj:null},

    ]

    load(){
        // TODO DEBUGGING NEVER DO THIS
        window.PLANETS = this.PLANETS;

        // Todo don't make empty promises
        const manager = new THREE.LoadingManager()
        const loader = new FBXLoader(manager)

        return new Promise((all_resolve,all_reject) => {
            console.log("loading prefabs ")
            return Promise.all(
                Object.values(this.PREFABS).map( prefab => {
                    return new Promise((resolve,reject) => {
                        loader.load(prefab.url, (fbx) =>{
                            prefab.obj = fbx
                            console.log("loaded ",prefab.url,prefab.obj)
                            resolve()
                        })
                    })
                }),
                this.PLANETS.map(prefab => {
                    return new Promise((resolve, _reject) => {
                        loader.load(prefab.url, (fbx) => {
                            prefab.obj = fbx
                            prefab.obj.scale.set(0.003, 0.003, 0.003);
                            prefab.obj.castShadow = true;
                            prefab.obj.receiveShadow = true;
                            console.log("loaded planet ", prefab.url, prefab.obj);
                            resolve();
                        })
                    })
                })
            ).then(() => {
                console.log("prefabs loaded")
                all_resolve()
            })
        })
    }

    create_mesh(geometry,material,receiveShadow,castShadow){
        switch(geometry){
            case "sputnik":
                return this.create_sputnik()
            case "stars":
                return this.create_stars()
            case "planet":
                return this.create_planet()
            default:
                const m =new THREE.Mesh(
                    this.BASE_GEOMETRIES[geometry],
                    this.BASE_MATERIALS[material]?this.BASE_MATERIALS[material]:new THREE.MeshLambertMaterial({ color: material })
                )
                m.receiveShadow = receiveShadow
                m.castShadow = castShadow
                return m
        }
    }
    
    create_stars(){
        const R = 250
        const vertices = [];
        for ( let i = 0; i < 5000; i ++ ) {
            const p = new THREE.Vector3(R,0,0)
            const a = new THREE.Euler( -Math.random() * Math.PI, 0, Math.random() * Math.PI, 'XYZ' );
            p.applyEuler(a)
        	vertices.push( p.x, p.y, p.z );
        }

        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute( 'position', new THREE.Float32BufferAttribute( vertices, 3 ) );
        const material = new THREE.PointsMaterial( { color: 0x888888 } );
        return new THREE.Points( geometry, material );
    }

    create_sputnik(){
        const geom = new THREE.BoxGeometry()
        const mat = new THREE.MeshLambertMaterial({ color: 0xff0000 })
        const mesh = new THREE.Mesh(geom,mat)
        mesh.receiveShadow = true
        mesh.castShadow = true
        /*
        // TODO size sputnk, and also change the way we visualize thrusters..
        const mesh = new THREE.Object3D()
        mesh.add(this.PREFABS['sputnik'].obj)
        */ 

        // Create Thrust indicators
        const tgeom = new THREE.ConeGeometry(0.5,2,3,2,false)
        const tmat = new THREE.MeshBasicMaterial({ color: 0xffaa00 })

        const t_offset = 2
        const t_up = new THREE.Mesh(tgeom,tmat)
        t_up.position.y = -t_offset
        t_up.rotation.z = Math.PI
        t_up.visible = false 
        mesh.add(t_up)

        const t_down = new THREE.Mesh(tgeom,tmat)
        t_down.position.y = t_offset 
        t_down.visible = false
        mesh.add(t_down)

        const t_left = new THREE.Mesh(tgeom,tmat)
        t_left.rotation.z = -Math.PI/2
        t_left.position.x = t_offset 
        t_left.visible = false
        mesh.add(t_left)

        const t_right = new THREE.Mesh(tgeom,tmat)
        t_right.rotation.z = Math.PI/2
        t_right.position.x = -t_offset
        t_right.visible = false
        mesh.add(t_right)

        // Create Prediction child mesh
        const pgeom = new THREE.BufferGeometry()
        const pmat = new THREE.LineBasicMaterial({ color: 0x0033ff, transparent: true, opacity: 0.8 })
        const predictor = new THREE.Line(pgeom,pmat)
        mesh.add(predictor)

        return mesh
    }

    create_planet() {
        const obj = new THREE.Object3D()
        const planet_idx = Math.floor(Math.random() * this.PLANETS.length)
        const planet = PLANETS[planet_idx].obj.clone();
        window.planet_ins ||= [];
        obj.add(planet);
        window.planet_ins.push(obj);
        return obj;
    }
}
