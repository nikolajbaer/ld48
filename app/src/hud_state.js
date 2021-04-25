import { makeAutoObservable } from "mobx"

export class GameHudState {
    distance = 0
    fuel = 100
    game_over = false

    constructor(){
        makeAutoObservable(this)
    }

}