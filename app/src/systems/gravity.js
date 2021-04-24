import { System } from "ecsy"
import { Physics2dComponent } from "../../../src/core/components/physics2d"
import * as planck from "planck-js"
import { GravityComponent, PlanetaryComponent } from "../components/gravity"

export class GravitySystem extends System {
    init(attributes){
        this.G = attributes && attributes.G?attributes.G:0.001
    }

    execute(delta,time){
        this.queries.bodies.results.forEach( e => {
            const body = e.getComponent(Physics2dComponent).body
            const pos = body.getPosition()
            const m = body.getMass()

            const g = new planck.Vec2(0,0)
            this.queries.planets.results.forEach( e => {
                const pbody = e.getComponent(Physics2dComponent).body
                const planet = e.getComponent(PlanetaryComponent)
                const ppos = pbody.getPosition()
                const gv = ppos.clone()
                gv.sub(pos)
                const gf = this.G * ((planet.mass * m)/Math.pow(gv.length(),2))
                gv.normalize()
                gv.mul(gf)
                g.add(gv) // add gravitational force from this body
            })
            body.applyForce(g,pos)
        })
    }
}

GravitySystem.queries = {
    planets: {
        components: [PlanetaryComponent,Physics2dComponent]
    },
    bodies: {
        components: [Physics2dComponent,GravityComponent]
    }
}