import { Component,TagComponent, Types } from "ecsy"

export class GravityComponent extends TagComponent {}

export class PlanetaryComponent extends Component{}
PlanetaryComponent.schema = {
    mass: { type: Types.Number, default: 1000 },  // Static Bodies don't have Mass
    radius: { type: Types.Number, default: 1 }, // store here as well for easy impact calculation on path predictions
    land_vel: { type: Types.Number, default: 0 }, // CONSIDER maybe landing speed instead?
    axis: {type: Types.Number, default: Math.PI / 8},
    rotSpeed: {type: Types.Number, default: 0},
    satRotSpeed: {type: Types.Number, default: 0}
}