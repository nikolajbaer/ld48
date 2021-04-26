import { World } from "ecsy"
import { CameraComponent, Obj3dComponent, ModelComponent, LightComponent } from "../../src/core/components/render"
import { LocRotComponent } from "../../src/core/components/position"
import { Body2dComponent, Collision2dComponent, Joint2dComponent, Physics2dComponent, PhysicsJoint2dComponent  } from "../../src/core/components/physics2d"
import { HUDDataComponent } from "../../src/core/components/hud"
import { RenderSystem } from "../../src/core/systems/render"
import { Physics2dMeshUpdateSystem, Physics2dSystem } from "../../src/core/systems/physics2d"
import { HUDSystem } from "../../src/core/systems/hud"
import { Vector3, Vector2 } from "../../src/core/ecs_types"
import { ControlsSystem } from "../../src/core/systems/controls"
import { ActionListenerComponent } from "../../src/core/components/controls"
import { TagComponent } from "ecsy"
import { OrbitComponent } from "./components/orbit"
import { OrbitSystem } from "./systems/orbit"
import { PlanetMeshCreator } from "./mesh_creator"
import { PlanetarySystem } from "./systems/planetary_system"
import { GravityComponent, PlanetaryComponent } from "./components/gravity"
import { GravitySystem } from "./systems/gravity"
import { ThrusterComponent } from "./components/thrusters"
import { ThrustersSystem } from "./systems/thrusters"
import { PredictorComponent, TargetedComponent } from "./components/path_predict"
import { PathPredictorSystem } from "./systems/path_predict"
import { PlanetCollisionSystem } from "./systems/planet_collision"
import { ExplosionComponent } from "./components/explosion"
import { FuelComponent } from "./components/fuel"
import { ExplosionSystem } from "./systems/explosion"
import { GameHudState } from "./hud_state"
import { DistanceTraveledComponent } from "./components/distance"
import { DistanceSystem } from "./systems/distance"
import { PlanetHUDUpdateSystem } from "./systems/hud"
import { PlanetLandingComponent } from "./components/planet"

class HitComponent extends TagComponent {}


export function load_assets(){
    return new Promise((resolve,reject) => {
        resolve()
    })
}

export function game_init(options){
    console.log("initializing game")
    const world = new World()

    // register components we are using
    world.registerComponent(Obj3dComponent)
    world.registerComponent(ModelComponent)
    world.registerComponent(Body2dComponent)
    world.registerComponent(Physics2dComponent)
    world.registerComponent(LocRotComponent)
    world.registerComponent(HUDDataComponent)
    world.registerComponent(ActionListenerComponent)
    world.registerComponent(CameraComponent)
    world.registerComponent(LightComponent)
    world.registerComponent(GravityComponent)
    world.registerComponent(OrbitComponent)
    world.registerComponent(PlanetaryComponent)
    world.registerComponent(ThrusterComponent)
    world.registerComponent(PredictorComponent)
    world.registerComponent(Collision2dComponent)
    world.registerComponent(ExplosionComponent)
    world.registerComponent(DistanceTraveledComponent)
    world.registerComponent(TargetedComponent)
    world.registerComponent(Joint2dComponent)
    world.registerComponent(PhysicsJoint2dComponent)
    world.registerComponent(PlanetLandingComponent)
    world.registerComponent(FuelComponent)


    // register our systems
    if(options.touch){
        // todo init touch controls
    }else{
        world.registerSystem(ControlsSystem,{listen_element_id:options.render_element})
    }

    const game_hud_state = new GameHudState()
    world.registerSystem(HUDSystem,{hud_state: game_hud_state })
    world.registerSystem(OrbitSystem)
    world.registerSystem(GravitySystem)
    world.registerSystem(ThrustersSystem)
    world.registerSystem(PathPredictorSystem)
    world.registerSystem(PlanetCollisionSystem)
    world.registerSystem(DistanceSystem)
    world.registerSystem(ExplosionSystem)
    world.registerSystem(Physics2dMeshUpdateSystem)
    world.registerSystem(PlanetHUDUpdateSystem)
    world.registerSystem(PlanetarySystem)
    world.registerSystem(RenderSystem,{
        render_element_id:options.render_element,
        mesh_creator: options.mesh_creator,
    })

    // Physics we have to tie in any custom collision handlers, where 
    // entity_a has a PhysicsComponent with track_collisions enabled 
    world.registerSystem(Physics2dSystem)

    const c = world.createEntity()
    c.addComponent(CameraComponent,{
        lookAt: new Vector3(0,0,-5),
        current: true,
        upVec: new Vector3(0,0,1),
        fov: 50,
    })
    c.addComponent(LocRotComponent,{location: new Vector3(0,-30,20)})

    const l1 = world.createEntity()
    l1.addComponent(LocRotComponent,{location: new Vector3(0,0,0)})
    l1.addComponent(LightComponent,{type:"ambient",color: 0x555555})

    const sun_light = world.createEntity()
    sun_light.addComponent(LocRotComponent,{location: new Vector3(0,0,0)})
    sun_light.addComponent(LightComponent,{type:"point",cast_shadow:true,intensity:0.9,decay:1000,color: 0xFFFFaa })

    const stars = world.createEntity()
    stars.addComponent(ModelComponent,{geometry:"stars"})
    stars.addComponent(LocRotComponent)

    const PLANET_DENSITY = 1000
    const planet_mass = r => PLANET_DENSITY * 4/3 * Math.PI * Math.pow(r,3)

    // add a sun 
    const sun  = world.createEntity()
    const SR = 3 // sun radius
    sun.addComponent(ModelComponent,{geometry:"sphere",material:"sun",scale:new Vector3(3,3,3),receive_shadow:false})
    sun.addComponent(LocRotComponent,{location: new Vector3(0,0,0)})
    sun.addComponent(Body2dComponent,{body_type: "static",width:SR,height:SR})
    sun.addComponent(PlanetaryComponent,{mass:planet_mass(SR),radius:SR/2})
    sun.name = "sun"

    const n = 12 // num planets
    for(var i=0; i<n; i++){
        const p = world.createEntity()
        const r = 5 + i * 1.5 
        const s = Math.random()*1 + 0.5
        p.addComponent(ModelComponent,{geometry:"planet",scale:new Vector3(s,s,s)})
        p.addComponent(LocRotComponent,{location: new Vector3(r,0,0)})
        p.addComponent(Body2dComponent,{
            body_type: "kinematic",
            width:s,
            height:s,
        })
        p.addComponent(OrbitComponent,{
            radius: r, 
            avel: Math.random()*0.05 + 0.05,
            aoffset: Math.random() * Math.PI * 2,
        })
        p.addComponent(PlanetaryComponent,{
            mass:planet_mass(s),
            radius:s/2,
            land_vel:5,
            rotSpeed: (Math.random() - 0.5) / 10, // degrees per tick?
            axis: Math.random() * 2 * Math.PI, // 0-360 degrees of axis rotation
            satRotSpeed: (Math.random() - 0.5) / 20
        })
        p.name = "Planet "+ (i+1)

        const ring = world.createEntity()
        ring.addComponent(ModelComponent,{
            geometry:"orbit",
            scale:new Vector3(r,r,r),
            material:"trail",
            cast_shadow: false,
            receive_shadow: false,
        })
        ring.addComponent(LocRotComponent)
    }
 
    const b = world.createEntity()    
    b.addComponent(ModelComponent,{geometry:"sputnik",scale:new Vector3(0.2,0.2,0.2),material:"red"})
    b.addComponent(LocRotComponent,{location:new Vector2(50,0,0)})
    b.addComponent(Body2dComponent,{
        body_type:"dynamic",
        width:0.2/2,
        height:0.2/2,
        velocity: new Vector2(-5,1),
        mass:1,
        track_collisions: true,
    })
    b.addComponent(GravityComponent) 
    b.addComponent(ThrusterComponent,{thrust:3})
    b.addComponent(ActionListenerComponent)
    b.addComponent(PredictorComponent,{ticks:500,delta:1/30})
    b.addComponent(HUDDataComponent,{data:{distance:0,fuel:100,game_over:false,velocity:0}})
    b.addComponent(DistanceTraveledComponent)
    b.addComponent(FuelComponent)
    b.name = "sputnik"

    start_game(world)

    return world
}

function start_game(world){
    let lastTime = performance.now() / 1000

    let paused = false

    window.addEventListener("keypress", (e) => {
        if(e.code == " "){
            paused = !paused
        }
    })

    function animate() {
        requestAnimationFrame( animate );            
        if(paused){ return }

        let time = performance.now() / 1000
        let delta = time - lastTime
        world.execute(delta,time) 
    }
    animate();
}