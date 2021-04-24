import { System } from "ecsy"
import { Body2dComponent, Physics2dComponent } from "../../../src/core/components/physics2d"
import { OrbitComponent } from "../components/orbit"
import * as planck from "planck-js"

export class OrbitSystem extends System {
    execute(delta,time){
        this.queries.orbiters.results.forEach( e => {
            const body = e.getComponent(Physics2dComponent).body
            const orbit = e.getComponent(OrbitComponent)
            const a = orbit.avel * time + orbit.aoffset
            const pos = new planck.Vec2(
                Math.cos(a)*orbit.radius + orbit.center.x,
                Math.sin(a)*orbit.radius + orbit.center.y
            )
            const ra = orbit.arot * time
            body.setTransform(pos,ra)
        })
    }
}

OrbitSystem.queries = {
    orbiters: {
        components: [OrbitComponent,Physics2dComponent]
    }
}