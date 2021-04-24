import { System } from "ecsy"
import { ActionListenerComponent } from "../../../src/core/components/controls"
import { Physics2dComponent } from "../../../src/core/components/physics2d"
import { ThrusterComponent } from "../components/thrusters"
import * as planck from "planck-js"

export class ThrustersSystem extends System {
    execute(delta,time){
        this.queries.movers.results.forEach( e => {
            const actions =  e.getComponent(ActionListenerComponent).actions
            const body = e.getComponent(Physics2dComponent).body
            const thruster = e.getComponent(ThrusterComponent)

            const v = new planck.Vec2()
            if(actions.up){ v.y += actions.up }
            if(actions.down){ v.y -= actions.down }
            if(actions.left){ v.x -= actions.left }
            if(actions.right){ v.x += actions.right }
            v.normalize()
            v.mul(thruster.thrust)
            if(thruster.local){
                const a = body.getAngle()
                v.x = Math.cos(a) * v.x - Math.sin(a) * v.y
                v.y = Math.sin(a) * v.x + Math.cos(a) * v.y
            }

            body.applyForce(v,body.getPosition())

        })
    }
}

ThrustersSystem.queries = {
    movers: {
        components: [ActionListenerComponent,Physics2dComponent,ThrusterComponent]
    }
}