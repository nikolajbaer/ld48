import { System } from "ecsy"
import { ActionListenerComponent } from "../../../src/core/components/controls"
import { Physics2dComponent } from "../../../src/core/components/physics2d"
import { ThrusterComponent } from "../components/thrusters"
import { FuelComponent } from "../components/fuel"
import { Obj3dComponent } from "../../../src/core/components/render"
import * as planck from "planck-js"

export class ThrustersSystem extends System {
    execute(delta,time){
        this.queries.movers.results.forEach( e => {
            const actions =  e.getComponent(ActionListenerComponent).actions
            const body = e.getComponent(Physics2dComponent).body
            const thruster = e.getMutableComponent(ThrusterComponent)
            const fuel = e.getMutableComponent(FuelComponent)
            const obj3d = e.getComponent(Obj3dComponent).obj
            const v = new planck.Vec2()
            const boost = actions.shift?thruster.boost:1

            
            // scale thruster models based on boost
            const bscale = boost>1?1.5:1
            obj3d.children[0].scale.set(bscale,bscale,bscale)
            obj3d.children[1].scale.set(bscale,bscale,bscale)
            obj3d.children[2].scale.set(bscale,bscale,bscale)
            obj3d.children[3].scale.set(bscale,bscale,bscale) 
            
            if (fuel.amount <= 0) {
                obj3d.children[0].visible = false
                obj3d.children[1].visible = false
                obj3d.children[2].visible = false
                obj3d.children[3].visible = false
                return;
            }


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

            thruster.on = v.length() > 0

            v.mul(thruster.thrust * boost)
            
            if (thruster.on) {
                fuel.amount -= fuel.costPerThrust
                if (boost > 1) {
                    fuel.amount -= fuel.costPerThrust / 2.0;
                }
            }

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
        components: [
            ActionListenerComponent,FuelComponent,
            Physics2dComponent,ThrusterComponent,
            Obj3dComponent
        ]
    }
}