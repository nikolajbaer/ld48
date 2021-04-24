import { Component, Types } from "ecsy"

export class ExplosionComponent extends Component {}
ExplosionComponent.schema = {
    size: { type: Types.Number, default: 1 },
    start: { type: Types.Number },
    duration: { type: Types.Number, default: 1 },
}