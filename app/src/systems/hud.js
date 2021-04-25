import { System } from "ecsy"
import { HUDDataComponent } from "../../../src/core/components/hud"
import { DistanceTraveledComponent } from "../components/distance"

export class PlanetHUDUpdateSystem extends System {
    execute(delta,time){
        this.queries.hud.results.forEach( e => {
            const data = e.getMutableComponent(HUDDataComponent).data
            const dist = e.getComponent(DistanceTraveledComponent)
            data.distance = dist.distance

            // TODO add fuel?

        })
    }
}

PlanetHUDUpdateSystem.queries = {
    hud: {
        components: [HUDDataComponent,DistanceTraveledComponent]
    }
}