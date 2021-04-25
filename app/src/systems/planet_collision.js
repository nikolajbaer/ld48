import { System } from "ecsy"
import { Int8BufferAttribute } from "three"
import { HUDDataComponent } from "../../../src/core/components/hud"
import { Physics2dComponent,Collision2dComponent } from "../../../src/core/components/physics2d"
import { LocRotComponent } from "../../../src/core/components/position"
import { Vector3 } from "../../../src/core/ecs_types"
import { DistanceTraveledComponent } from "../components/distance"
import { ExplosionComponent } from "../components/explosion"
import { PlanetaryComponent } from "../components/gravity"

export class PlanetCollisionSystem extends System {
    execute(delta,time){
        this.queries.collide.results.forEach( e => {
            const c = e.getComponent(Collision2dComponent) 
            let max_vel = 0
            if(c.entity.hasComponent(PlanetaryComponent)){
                const planet = c.entity.getComponent(PlanetaryComponent)
                max_vel = planet.land_vel
            }
            if(c.normal_impulse > max_vel){
                const pos = e.getComponent(Physics2dComponent).body.getPosition()
                const ex = this.world.createEntity()
                ex.addComponent(ExplosionComponent)
                ex.addComponent(LocRotComponent,{location: new Vector3(pos.x,pos.y,0)})

                // Probably should be more explicit
                if(e.hasComponent(HUDDataComponent)){
                    const data = e.getComponent(HUDDataComponent).data
                    data.game_over = true
                    const gameover = this.world.createEntity()
                    gameover.addComponent(HUDDataComponent,{data:data})
                }
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