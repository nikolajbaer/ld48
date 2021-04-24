import { System } from "ecsy"
import { ActionListenerComponent } from "../../../src/core/components/controls"
import { Physics2dComponent } from "../../../src/core/components/physics2d"
import { ThrusterComponent } from "../components/thrusters"
import { Obj3dComponent } from "../../../src/core/components/render"
import * as planck from "planck-js"

export class ThrustersSystem extends System {
    execute(delta,time){
        this.queries.movers.results.forEach( e => {
            const actions =  e.getComponent(ActionListenerComponent).actions
            const body = e.getComponent(Physics2dComponent).body
            const thruster = e.getComponent(ThrusterComponent)
            const obj3d = e.getComponent(Obj3dComponent).obj

            const v = new planck.Vec2()
            const boost = actions.shift?thruster.boost:1

            // scale thruster models based on boost
            const bscale = boost>1?1.5:1
            obj3d.children[0].scale.set(bscale,bscale,bscale)
            obj3d.children[1].scale.set(bscale,bscale,bscale)
            obj3d.children[2].scale.set(bscale,bscale,bscale)
            obj3d.children[3].scale.set(bscale,bscale,bscale) 
            
            if(actions.up){ 
                v.y += actions.up 
                obj3d.children[0].visible = true
            }else{
                obj3d.children[0].visible = false
            }
            if(actions.down){ 
                v.y -= actions.down 
                obj3d.children[1].visible = true
            }else{
                obj3d.children[1].visible = false
            }
            if(actions.left){ 
                v.x -= actions.left 
                obj3d.children[2].visible = true
            }else{
                obj3d.children[2].visible = false
            }
            if(actions.right){ 
                v.x += actions.right 
                obj3d.children[3].visible = true
            }else{
                obj3d.children[3].visible = false
            }
            v.normalize()

            v.mul(thruster.thrust * boost)

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
        components: [ActionListenerComponent,Physics2dComponent,ThrusterComponent,Obj3dComponent]
    }
}