import { Component,TagComponent, Types } from "ecsy"

export class GravityComponent extends TagComponent {}

export class PlanetaryComponent extends Component{}
PlanetaryComponent.schema = {
    mass: { type: Types.Number, default: 1000 }  // Static Bodies don't have Mass
}