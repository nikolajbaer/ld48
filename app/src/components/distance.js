import { Component, Types } from "ecsy"
import { Vector2Type } from "../../../src/core/ecs_types"

export class DistanceTraveledComponent extends Component {}
DistanceTraveledComponent.schema = {
    distance: { type: Types.Number, default: 0 },
    last_pos: { type: Vector2Type, default: null },
}