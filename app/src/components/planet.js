import {Component,Types} from "ecsy"

export class PlanetLandingComponent extends Component {}
PlanetLandingComponent.schema = {
    entity: { type: Types.Ref },
}