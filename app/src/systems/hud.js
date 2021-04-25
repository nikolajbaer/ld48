import { System } from "ecsy"
import { HUDDataComponent } from "../../../src/core/components/hud"
import { Physics2dComponent } from "../../../src/core/components/physics2d"
import { DistanceTraveledComponent } from "../components/distance"
import { PlanetaryComponent } from "../components/gravity"
import { TargetedComponent } from "../components/path_predict"

export class PlanetHUDUpdateSystem extends System {
    execute(delta,time){
        this.queries.hud.results.forEach( e => {
            const data = e.getMutableComponent(HUDDataComponent).data
            const dist = e.getComponent(DistanceTraveledComponent)
            const body = e.getComponent(Physics2dComponent).body
            data.distance = dist.distance
            data.velocity = body.getLinearVelocity().length()

            if(this.queries.targeted.results.length){
                const e = this.queries.targeted.results[0]
                const targeted = e.getComponent(TargetedComponent)
                const planet = e.getComponent(PlanetaryComponent)
                data.targeted_planet = e.name
                data.impact_vel = targeted.impact_vel
                data.land_Vel = planet.land_vel
            }else{
                data.targeted_planet = null
            }

            // TODO add fuel?

        })
    }
}

PlanetHUDUpdateSystem.queries = {
    hud: {
        components: [HUDDataComponent,DistanceTraveledComponent,Physics2dComponent]
    },
    targeted: {
        components: [TargetedComponent,PlanetaryComponent]
    },
}