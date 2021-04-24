import { System } from "ecsy"
import { Physics2dComponent,Collision2dComponent } from "../../../src/core/components/physics2d"
import { LocRotComponent } from "../../../src/core/components/position"
import { ModelComponent } from "../../../src/core/components/render"
import { Vector3 } from "../../../src/core/ecs_types"
import { ExplosionComponent } from "../components/explosion"

export class PlanetCollisionSystem extends System {
    init(attributes){
        this.crash_min = (attributes && attributes.crash_min)?attributes.crash_min:5
    }
    execute(delta,time){
        this.queries.collide.results.forEach( e => {
            const c = e.getComponent(Collision2dComponent) 
            if(c.normal_impulse > this.crash_min){
                const pos = e.getComponent(Physics2dComponent).body.getPosition()
                const ex = this.world.createEntity()
                ex.addComponent(ExplosionComponent)
                ex.addComponent(LocRotComponent,{location: new Vector3(pos.x,pos.y,0)})
                e.remove()
            }else{
                // TODO land?
                e.removeComponent(Collision2dComponent)
            }
        })
    }
}

PlanetCollisionSystem.queries = {
    collide:{
        components: [Collision2dComponent]
    }
}