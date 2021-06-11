import { Component, OnDestroy, OnInit } from "@angular/core";
import { Subscription } from "rxjs";
import { ConnectionService } from "src/app/Services/connection.service";

@Component({
    selector : "app-consumer",
    templateUrl : "./consumer.component.html",
    styleUrls : ["./consumer.component.css"]
})
export class ConsumerComponent implements OnInit , OnDestroy
{
    finishedItemSubscription : Subscription ;
    itemsForSale : Array<Number> = []; 
    finishedItemSelected ; 
    selectedItem ; 
    price = "0.002" ; 

    constructor(private connectionService : ConnectionService)
    {}

    ngOnInit()
    {
        this.finishedItemSubscription = this.connectionService.finsihedItems.subscribe(Item =>{
            if(Item.Upc == 0){
                console.log("First Item")
            }
            if(Item.State == 5)
            {
                this.itemsForSale.push(Item.Upc)
            }
            if(Item.State == 6)
            {
                this.removeItemFromSale(Item.Upc);
            }
        })
    }

    removeItemFromSale(Upc)
    {
        for(var i =0 ; i< this.itemsForSale.length ; i++)
        {
            if(this.itemsForSale[i] == Upc)
            {
                delete this.itemsForSale[i];
            }
        }
    }

    selectedFinished()
    {
        console.log(this.finishedItemSelected);
    }

    onSubmit()
    {
        this.connectionService.buyItemForSale(this.selectedItem);
    }

    ngOnDestroy()
    {
        this.finishedItemSubscription.unsubscribe();
    }
}