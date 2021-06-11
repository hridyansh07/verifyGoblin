export class FinishedItem
{
    private state ;

    constructor(private upc : number , state)
    {
        this.state = state;
    }

    get Upc()
    {
        return this.upc;
    }

    set State(number)
    {
        this.state = number;
    }

    get State()
    {
        return this.state
    }
}