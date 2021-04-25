import { System } from "ecsy"
import { Physics2dComponent } from "../../../src/core/components/physics2d"
import * as planck from "planck-js"
import { GravityComponent, PlanetaryComponent } from "../components/gravity"

export class GravitySystem extends System {
    init(attributes){
        this.G = attributes && attributes.G?attributes.G:0.001
    }

    planet_positions(){
        return this.queries.planets.results.map( p => { 
            const planet = {
                pos:p.getComponent(Physics2dComponent).body.getPosition().clone(),
                mass:p.getComponent(PlanetaryComponent).mass,
                radius: p.getComponent(PlanetaryComponent).radius,
                land_vel: p.getComponent(PlanetaryComponent).land_vel,
            }
            return planet
        })
    }

    execute(delta,time){
        this.queries.bodies.results.forEach( e => {
            const body = e.getComponent(Physics2dComponent).body
            const pos = body.getPosition()
            const m = body.getMass()
            const g = this.cumulative_gravity(pos,m,this.planet_positions())
            body.applyForce(g,pos)
        })
    }

    cumulative_gravity(pos,mass,planets){
        const g = new planck.Vec2(0,0)
        planets.forEach( p => {
            const gv = p.pos.clone()
            gv.sub(pos)
            p.distance = gv.length()
            const gf = (p.distance==0)?0:this.G * ((p.mass * mass)/Math.pow(gv.length(),2))
            gv.normalize()
            gv.mul(gf)
            g.add(gv) // add gravitational force from this body
        })
        return g
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