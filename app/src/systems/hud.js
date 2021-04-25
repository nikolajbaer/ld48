import { System } from "ecsy"
import { HUDDataComponent } from "../../../src/core/components/hud"
import { DistanceTraveledComponent } from "../components/distance"

export class PlanetHUDUpdateSystem extends System {
    execute(delta,time){
        this.queries.hud.results.forEach( e => {
            const hud = e.getMutableComponent(HUDDataComponent)
            const dist = e.getComponent(DistanceTraveledComponent)
            hud.key = "distance"
            hud.value = dist.distance
        })
    }
}

PlanetHUDUpdateSystem.queries = {
    hud: {
        components: [HUDDataComponent,DistanceTraveledComponent]
    }
}