import { Component, OnDestroy, OnInit } from "@angular/core";
import { Subscription } from "rxjs";
import { ConnectionService } from "src/app/Services/connection.service";

@Component({
    selector : "app-distributor",
    templateUrl : "./distributor.component.html",
    styleUrls : ['./distributor.component.css']
})
export class DistributorComponent implements OnInit, OnDestroy
{
    finishedItemSubscription  : Subscription
    selectedItem;
    forSaleItems : Array<Number>=[];
    constructor(private connectionService : ConnectionService)
    {}

    ngOnInit()
    {
        this.finishedItemSubscription = this.connectionService.finsihedItems.subscribe(Item => {
            if(Item.Upc == 0)
            {
                console.log("First Item");
            }
            if(Item.State == 4)
            {
                this.forSaleItems.push(Item.Upc);
            }
            if(Item.State == 5)
            {
                this.removeForSaleItems(Item.Upc);
            }
        })
    }

    selected()
    {
        console.log(this.selectedItem);
    }


    removeForSaleItems(Upc)
    {
        for(var i=0 ; i< this.forSaleItems.length ; i++)
        {
            if(this.forSaleItems[i] == Upc)
            {
                delete this.forSaleItems[i];
            }
        }
    }

    onSubmit()
    {
        if(this.selectedItem !== 0)
        {
            this.connectionService.setItemForSale(this.selectedItem);
        }
        else{
            alert("Select A Product")
        }

    }

    ngOnDestroy()
    {
        this.finishedItemSubscription.unsubscribe();
    }
}