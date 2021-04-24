import { makeAutoObservable } from "mobx"

export class GameHudState {
    distance = 0
    fuel = 0

    constructor(){
        makeAutoObservable(this)
    }

}