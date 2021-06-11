export class RawItem{

    private state;

    constructor(private upc : number  ,  state)
    {
        this.state = state;
    }

    set State(state)
    {
        this.state = state;
        console.log("Changing State");
    }

    get State() {
        return this.state
    }

    get Upc()
    {
        return this.upc
    }

}