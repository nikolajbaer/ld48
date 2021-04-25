
import { System } from "ecsy"
import { PlanetaryComponent } from "../components/gravity"
import { Obj3dComponent } from "../../../src/core/components/render"

export class PlanetarySystem extends System {
    findMesh(list, name) {
        var result = null;
        list.forEach((i) => {
            if (i.name == name) {
                result = i;
                return i;
            }
        });
        return result;
   }
    execute(delta, _t) {
        this.queries.planets.results.forEach((p) => {
            const planet_spec = p.getComponent(PlanetaryComponent)
            const obj = p.getComponent(Obj3dComponent).obj
            if (obj.children.length > 0){
                obj.children[0].rotateZ(planet_spec.rotSpeed)
                const clouds = this.findMesh(obj.children[0].children, "Clouds");
                if (clouds) {
                    clouds.rotateZ(planet_spec.satRotSpeed);
                    clouds.rotateX(planet_spec.satRotSpeed / 2);
                }
                const satellite = this.findMesh(obj.children[0].children, "Satellite");
                if (satellite) {
                    satellite.rotateZ(planet_spec.satRotSpeed);
                    satellite.rotateX(planet_spec.satRotSpeed/2);
                    satellite.rotateY(planet_spec.satRotSpeed/4);
                }
            }
        });
    }
}

PlanetarySystem.queries = {
    planets: {
        components: [PlanetaryComponent, Obj3dComponent]
    }
}