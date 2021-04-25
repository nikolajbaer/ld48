import { System } from "ecsy"
import { HUDDataComponent } from "../../../src/core/components/hud"
import { Physics2dComponent } from "../../../src/core/components/physics2d"
import { DistanceTraveledComponent } from "../components/distance"

export class PlanetHUDUpdateSystem extends System {
    execute(delta,time){
        this.queries.hud.results.forEach( e => {
            const data = e.getMutableComponent(HUDDataComponent).data
            const dist = e.getComponent(DistanceTraveledComponent)
            const body = e.getComponent(Physics2dComponent).body
            data.distance = dist.distance
            data.velocity = body.getLinearVelocity().length()

            // TODO add fuel?

        })
    }
}

PlanetHUDUpdateSystem.queries = {
    hud: {
        components: [HUDDataComponent,DistanceTraveledComponent,Physics2dComponent]
    }
}