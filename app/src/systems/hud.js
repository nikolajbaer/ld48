import { System } from "ecsy"
import { HUDDataComponent } from "../../../src/core/components/hud"
import { Physics2dComponent } from "../../../src/core/components/physics2d"
import { DistanceTraveledComponent } from "../components/distance"
import { PlanetaryComponent } from "../components/gravity"
import { TargetedComponent } from "../components/path_predict"
import { PlanetLandingComponent } from "../components/planet"
import { FuelComponent } from "../components/fuel"


export class PlanetHUDUpdateSystem extends System {
    execute(delta,time){
        this.queries.fuel.results.forEach( e => {
            const data = e.getMutableComponent(HUDDataComponent).data
            const fuel = e.getComponent(FuelComponent)
            data.fuel = fuel.amount
        })

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

            if(e.hasComponent(PlanetLandingComponent)){
                const planet = e.getComponent(PlanetLandingComponent)
                data.landed_planet = planet.entity.name
            }else{
                data.landed_planet = null
            }
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
    fuel: {
        components: [FuelComponent]
    }
}