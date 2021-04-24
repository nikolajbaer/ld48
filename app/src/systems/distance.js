import { System,Not } from "ecsy"
import { Physics2dComponent } from "../../../src/core/components/physics2d"
import { Vector2 } from "../../../src/core/ecs_types"
import { DistanceTraveledComponent } from "../components/distance"

export class DistanceSystem extends System {
    execute(delta,time){
        this.queries.distancer.results.forEach( e => {
            const dist = e.getMutableComponent(DistanceTraveledComponent)
            const body = e.getComponent(Physics2dComponent).body
            const pos = body.getPosition()
            if(dist.last_pos){
                dist.distance += Math.sqrt( Math.pow(pos.x - dist.last_pos.x,2) + Math.pow(pos.y - dist.last_pos.y,2) )
            }
            dist.last_pos = new Vector2(pos.x,pos.y)
        })
    }
}

DistanceSystem.queries = {
    distancer: {
        components: [DistanceTraveledComponent,Physics2dComponent]
    }
}