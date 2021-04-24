import { System } from "ecsy"
import { Body2dComponent, Physics2dComponent } from "../../../src/core/components/physics2d"
import { OrbitComponent } from "../components/orbit"
import * as planck from "planck-js"

export class OrbitSystem extends System {
    step_orbit_pos(avel,aoffset,radius,center,time){
        const a = avel * time + aoffset
        const pos = new planck.Vec2(
            Math.cos(a)*radius + center.x,
            Math.sin(a)*radius + center.y
        )
        return pos
    }

    execute(delta,time){
        this.queries.orbiters.results.forEach( e => {
            const body = e.getComponent(Physics2dComponent).body
            const orbit = e.getComponent(OrbitComponent)
            const pos = this.step_orbit_pos(orbit.avel,orbit.aoffset,orbit.radius,orbit.center,time)
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