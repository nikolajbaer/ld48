import { System,Not } from "ecsy"
import { ModelComponent, Obj3dComponent } from "../../../src/core/components/render"
import { ExplosionComponent } from "../components/explosion"

export class ExplosionSystem extends System {
    execute(delta,time){
        this.queries.uninitialized_explosions.results.forEach( e => {
            const explosion = e.getMutableComponent(ExplosionComponent)
            e.addComponent( ModelComponent, { 
                geometry: "sphere", 
                material: "explosion",
                scale: 0.1 ,
                shadow: false
            } )
            explosion.start = time
        })

        this.queries.active_explosions.results.forEach( e => {
            const explosion = e.getComponent(ExplosionComponent)
            const mesh = e.getComponent(Obj3dComponent).obj
            const s = (explosion.start + explosion.duration ) - time 
            if( s <= 0 ){
                e.remove()
            }else{
                // Scale  Factor
                const sv = ( s / explosion.duration ) * explosion.size
                mesh.scale.set(sv,sv,sv)
            }
        })
    }
}

ExplosionSystem.queries = {
    uninitialized_explosions: {
        components: [ExplosionComponent,Not(ModelComponent)]
    },
    active_explosions: {
        components: [ExplosionComponent,ModelComponent,Obj3dComponent]
    },
}