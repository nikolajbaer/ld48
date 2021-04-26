import * as THREE from "three"
import { BaseMeshCreator } from "../../src/core/systems/render"
import sputnikFBX from "../assets/ufo.fbx"
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

export class PlanetMeshCreator extends BaseMeshCreator {
    BASE_GEOMETRIES = {
        "box": new THREE.BoxGeometry(),
        "sphere": new THREE.SphereGeometry(0.5,32,32),
        "plane": new THREE.PlaneGeometry(0,1,5,5),
        "ground": new THREE.PlaneGeometry(1000,1000, 50, 50),
        "orbit": new THREE.RingGeometry(1,1.005,64),
        "planet_highlight_": new THREE.BoxGeometry(),
        "planet_highlight": new THREE.BufferGeometry().setFromPoints(
            [  new THREE.Vector3(-1,-1,-1), new THREE.Vector3(-.75,-1,-1),
               new THREE.Vector3(-1,-1,-1),  new THREE.Vector3(-1,-.75,-1),
               new THREE.Vector3(-1,-1,-1),  new THREE.Vector3(-1,-1,-.75) ] )
    }

    BASE_MATERIALS = {
        "ground": new THREE.MeshLambertMaterial( { color: 0x333332 } ),
        "default": new THREE.MeshLambertMaterial( { color: 0x9999fe } ),
        "trail": new THREE.MeshBasicMaterial( { color: 0xffffff, opacity: 0.1, transparent: true }),
        "sun": new THREE.MeshBasicMaterial({ color: 0xFFFF00 }),
        "explosion": new THREE.MeshBasicMaterial({ color: 0xFFAA00 }),
        "planet_highlight": new THREE.LineBasicMaterial({color: 0xFFFFFF}),
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
            return Promise.all(
                Object.values(this.PREFABS).map( prefab => {
                    return new Promise((resolve,reject) => {
                        loader.load(prefab.url, (fbx) =>{
                            prefab.obj = fbx
                            resolve()
                        })
                    })
                }),
                this.PLANETS.map(prefab => {
                    return new Promise((resolve, _reject) => {
                        loader.load(prefab.url, (fbx) => {
                            prefab.obj = fbx
                            prefab.obj.scale.set(0.0025, 0.0025, 0.0025);
                            prefab.obj.castShadow = true;
                            prefab.obj.receiveShadow = true;
                            resolve();
                        })
                    })
                })
            ).then(() => {
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
            case "sun":
                return this.create_sun()
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

        this.add_highlight(obj)
        window.planet_ins.push(obj);
        return obj;

    }

    add_highlight(obj,scale=0.75){
        const highlight = new THREE.Object3D()
        // top
        const UP = new THREE.Vector3(0,0,1)
        const AHEAD = new THREE.Vector3(0,1,0)
        highlight.add(new THREE.LineSegments(this.BASE_GEOMETRIES["planet_highlight"],this.BASE_MATERIALS["planet_highlight"]))
        highlight.add(new THREE.LineSegments(this.BASE_GEOMETRIES["planet_highlight"],this.BASE_MATERIALS["planet_highlight"]))
        highlight.children[1].rotateOnAxis(UP,Math.PI/2)
        highlight.add(new THREE.LineSegments(this.BASE_GEOMETRIES["planet_highlight"],this.BASE_MATERIALS["planet_highlight"]))
        highlight.children[2].rotateOnAxis(UP,Math.PI)
        highlight.add(new THREE.LineSegments(this.BASE_GEOMETRIES["planet_highlight"],this.BASE_MATERIALS["planet_highlight"]))
        highlight.children[3].rotateOnAxis(UP,Math.PI*1.5)

        // bottom
        highlight.add(new THREE.LineSegments(this.BASE_GEOMETRIES["planet_highlight"],this.BASE_MATERIALS["planet_highlight"]))
        highlight.children[4].rotateOnAxis(AHEAD,Math.PI)
        highlight.add(new THREE.LineSegments(this.BASE_GEOMETRIES["planet_highlight"],this.BASE_MATERIALS["planet_highlight"]))
        highlight.children[5].rotateOnAxis(AHEAD,Math.PI)
        highlight.children[5].rotateOnAxis(UP,Math.PI/2)
        highlight.add(new THREE.LineSegments(this.BASE_GEOMETRIES["planet_highlight"],this.BASE_MATERIALS["planet_highlight"]))
        highlight.children[6].rotateOnAxis(AHEAD,Math.PI)
        highlight.children[6].rotateOnAxis(UP,Math.PI)
        highlight.add(new THREE.LineSegments(this.BASE_GEOMETRIES["planet_highlight"],this.BASE_MATERIALS["planet_highlight"]))
        highlight.children[7].rotateOnAxis(AHEAD,Math.PI)
        highlight.children[7].rotateOnAxis(UP,Math.PI*1.5)

        highlight.scale.set(scale,scale,scale)
        highlight.visible = false
        obj.add(highlight)
    }

    create_sun(){
        const sun = new THREE.Mesh(this.BASE_GEOMETRIES["sphere"],this.BASE_MATERIALS["sun"])
        this.add_highlight(sun,5)
        return sun
    }
}
