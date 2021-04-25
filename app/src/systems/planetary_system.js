
import { System } from "ecsy"
import { PlanetaryComponent } from "../components/gravity"
import { Obj3dComponent } from "../../../src/core/components/render"

export class PlanetarySystem extends System {
    execute(delta, _t) {
        this.queries.planets.results.forEach((p) => {
            const planet_spec = p.getComponent(PlanetaryComponent)
            const obj = p.getComponent(Obj3dComponent).obj
            if (obj.children.length > 0){
                obj.children[0].rotateZ(planet_spec.rotSpeed)
            }
        });
    }
}

PlanetarySystem.queries = {
    planets: {
        components: [PlanetaryComponent, Obj3dComponent]
    }
}