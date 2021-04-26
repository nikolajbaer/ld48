import { System } from "ecsy"
import { ActionListenerComponent } from "../../../src/core/components/controls"
import { HUDDataComponent } from "../../../src/core/components/hud"
import { Physics2dComponent,Collision2dComponent, Joint2dComponent } from "../../../src/core/components/physics2d"
import { LocRotComponent } from "../../../src/core/components/position"
import { Project2dComponent } from "../../../src/core/components/render"
import { Vector3 } from "../../../src/core/ecs_types"
import { ExplosionComponent } from "../components/explosion"
import { PlanetaryComponent } from "../components/gravity"
import { PlanetLandingComponent } from "../components/planet"
import { ThrusterComponent } from "../components/thrusters"

export class PlanetCollisionSystem extends System {
    execute(delta,time){
        this.queries.collide.results.forEach( e => {
            const c = e.getComponent(Collision2dComponent) 
            let max_vel = 0
            let planet = null
            if(c.entity.hasComponent(PlanetaryComponent)){
                planet = c.entity.getComponent(PlanetaryComponent)
                max_vel = planet.land_vel
            }
            const body = e.getComponent(Physics2dComponent).body
            const pos = body.getPosition()
            if(c.normal_impulse > max_vel){
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
            }else if(planet != null){
                if(!e.hasComponent(PlanetLandingComponent)){
                    e.addComponent(Joint2dComponent,{
                        entity: c.entity,
                        joint_type: "weld",
                        joint_config: { collideConnected: false },
                        anchor_a: pos,
                    })
                    console.log("Landed on ",c.entity.name)
                    e.addComponent(PlanetLandingComponent,{entity:c.entity})
                    if(!c.entity.hasComponent(Project2dComponent)){
                        c.entity.addComponent(Project2dComponent)
                    }
                }
                e.removeComponent(Collision2dComponent)
            }else{
                console.log("collided with ",c.entity)
                e.removeComponent(Collision2dComponent)
            }
        })

        this.queries.landed.results.forEach( e => {
            if(e.getComponent(ThrusterComponent).on){
                e.removeComponent(PlanetLandingComponent)
                e.removeComponent(Joint2dComponent)
                e.removeComponent(Project2dComponent)
                console.log("Taking Off!")
            }
        })
    }
}

PlanetCollisionSystem.queries = {
    collide:{
        components: [Collision2dComponent]
    },
    landed: {
        components: [PlanetLandingComponent,ThrusterComponent]
    }
}