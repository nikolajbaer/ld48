import { System, Not } from "ecsy";
import { Physics2dComponent, Body2dComponent } from "../components/physics2d.js"
import { LocRotComponent } from "../components/position.js"
import { Obj3dComponent } from "../components/render.js"
import * as pl from "planck-js"

export class Physics2dSystem extends System {
    init(attributes) {
        this.physics_world = pl.World((attributes && attributes.world_attributes)?attributes.world_attributes:{});

        if(attributes && attributes.collision_handler){
            this.collision_handler = attributes.collision_handler
        }
    }

    create_physics_body(e){
        const body = e.getComponent(Body2dComponent)
        const locrot = e.getComponent(LocRotComponent)

        const bdef = {
            position:pl.Vec2(locrot.location.x,locrot.location.y),
            type: body.body_type,
            userData: { ecsy_entity: e },
        }
        let body1 = this.physics_world.createBody(bdef)
   
        switch(body.bounds_type){
            case "box":
                body1.createFixture({
                    shape:pl.Box(body.width,body.height),
                    density: body.density,
                    friction: body.friction,
                })
            default:
                body1.createFixture({
                    shape:pl.Circle(body.width/2),
                    density: body.density,
                    friction: body.friction,
                })
                break;
        }
        e.addComponent(Physics2dComponent, { body: body1 })
    }

    execute(delta,time){
        if(!this.physics_world) return

        // first intialize any uninitialized bodies
        this.queries.uninitialized.results.forEach( e => {
            this.create_physics_body(e)
        })

        // todo then remove any removed bodies
        this.queries.remove.results.forEach( e => {
            const body = e.getComponent(Physics2dComponent).body
            body.userData.ecsy_entity = null // clear back reference
            this.physics_world.destroyBody(body)
            e.removeComponent(Physics2dComponent)
        })

        this.physics_world.step(1/60,5,2)
    }
 }

Physics2dSystem.queries = {
    uninitialized: { components: [LocRotComponent, Body2dComponent, Not(Physics2dComponent)]},
    entities: { 
        components: [Physics2dComponent] ,
        listen: {
            removed: true
        }
    },
    remove: {
        components: [Physics2dComponent,Not(Body2dComponent)]
    },
};


export class Physics2dMeshUpdateSystem extends System {
    execute(delta){
        let entities = this.queries.entities.results;
        entities.forEach( e => {
            const body = e.getComponent(Physics2dComponent).body
            const obj3d = e.getComponent(Obj3dComponent).obj
            const loc = e.getMutableComponent(LocRotComponent) 
            const pos = body.getPosition()
            const ang =body.getAngle()
            obj3d.position.x = pos.x
            obj3d.position.y = pos.y
            obj3d.rotation.z = ang

            loc.location.x = pos.x
            loc.location.y = pos.y
            loc.location.z = 0 
            loc.rotation.z = ang
        })
    }
}

Physics2dMeshUpdateSystem.queries = {
  entities: { components: [Physics2dComponent, Obj3dComponent] }
};