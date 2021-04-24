import { Component,Types } from "ecsy"
import { Vector2 } from "three"
import { Vector2Type } from "../../../src/core/ecs_types"

export class OrbitComponent extends Component {}
OrbitComponent.schema = {
    center: { type: Vector2Type, default: new Vector2(0,0) }, // center point 
    avel: { type: Types.Number, default: 0.1 }, // angular velocity
    radius: { type: Types.Number, default: 5 }, // radius from center
    aoffset: { type: Types.Number, default: 0 }, // angular offset at t0
    arot: { type: Types.Number, default: 0 }, // angular rotation speed
}