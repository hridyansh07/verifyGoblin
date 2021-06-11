import { Component, OnDestroy, OnInit } from "@angular/core";
import { Subscription } from "rxjs";
import { connectableObservableDescriptor } from "rxjs/internal/observable/ConnectableObservable";
import { ConnectionService } from "src/app/Services/connection.service";

@Component({
    selector : "app-producer",
    templateUrl : "./producer.component.html",
    styleUrls : ["./producer.component.css"]
})
export class ProducerComponent implements OnInit , OnDestroy
{
    processedRawItem : Array<number> = [];
    rawAndFinishedItem : Array<number> = [];
    inspectedItem : Array<number> = [];
    itemSelected ; 
    rawItemSelected;
    finishedItemSelected;
    rawItemSubscription : Subscription;
    finishedItemSubscription : Subscription;
    bookedRawItemSubscription : Subscription ; 
    booking : boolean  = false ;
    producing : boolean = false ;
    packaging : boolean = false ; 
    selectedLevel ;
    data : Array<Object>  = [
        {id : 0 , name : "Book a Raw Item for Finished Product" , disabled : true},
        {id: 1 , name : "Produe a Finished Item" , disabled : true},
        {id : 2 , name: "Package a Finished Product" , disabled : true}];

    constructor(private connectionService : ConnectionService)
    {}

    ngOnInit()
    {
        
        this.rawItemSubscription = this.connectionService.rawItems.subscribe((rawItem)=> {
            if(rawItem.Upc == 0)
            {
                console.log("First Item");
            }
            else
            {
                if(rawItem.State == 4)
                {
                    this.processedRawItem.push(rawItem.Upc);
                }
            }
            console.log(this.processedRawItem);
        })
        this.finishedItemSubscription = this.connectionService.finsihedItems.subscribe(finishedItem => {
           
            if(finishedItem.Upc == 0)
            {
                console.log("First Item");
            }
            else
            {
                if(finishedItem.State == 2)
                {
                    this.removeRawAndProduced(finishedItem.Upc);
                }
                if(finishedItem.State == 3)
                {
                    this.inspectedItem.push(finishedItem.Upc);
                    console.log(this.inspectedItem);
                }
                if(finishedItem.State == 4)
                {
                    this.removeInspectedItem(finishedItem.Upc);
                }
            }
        })
        this.bookedRawItemSubscription = this.connectionService.bookedRawItems.subscribe(Upc => {
            if(Upc == 0)
            {
                console.log("first Item");
            }
            else{
            this.removeProcessedItem(Upc);
            this.rawAndFinishedItem.push(Upc);
        }
        })
    }

    removeRawAndProduced(Upc)
    {
        for(var i=0 ; i < this.rawAndFinishedItem.length ; i++)
        {
            if(this.rawAndFinishedItem[i] == Upc)
            {
                delete this.rawAndFinishedItem[i];
            }
        }
    }

    removeInspectedItem(Upc)
    {
        for(var i=0 ; i < this.inspectedItem.length ; i++)
        {
            if(this.inspectedItem[i] == Upc)
            {
                delete this.inspectedItem[i]
            }
        }
    }

    removeProcessedItem(Upc)
    {
        for(var i=0 ; i < this.processedRawItem.length ; i++)
        {
            if(this.processedRawItem[i] == Upc)
            {
                delete this.processedRawItem[i];
            }
        }
    }

    onSubmit(form)
    {
        for(let key in this.selectedLevel)
        {
            if(this.selectedLevel[key] == 0)
            {
                this.connectionService.createFinishedProduct(this.rawItemSelected, form.productId);
                this.removeProcessedItem(form.upc);
                break;
            }
            if(this.selectedLevel[key] == 1)
            {
                this.connectionService.produceFinishedProduct(this.itemSelected , form.productNotes , form.price);
                this.removeRawAndProduced(form.upc);
                break;
            }
        
            if(this.selectedLevel[key] == 2)
            {
                this.connectionService.packageFinishedProdcut(this.finishedItemSelected);
                break;
            }
        
        }
    }

    selectedItem()
    {
        console.log(this.selectedItem);
    }

    selectedRaw()
    {
        console.log("Here");
    }

    selected()
    {
        console.log(this.selectedLevel);
        for (let key in this.selectedLevel)
        {
            if(this.selectedLevel[key] == 0)
            {
                this.booking = true;
                this.producing = false;
                this.packaging = false;
                break;
            }
            if(this.selectedLevel[key]==1)
            {
                this.booking = false;
                this.producing = true;
                this.packaging=false;
                break;
            }
            if(this.selectedLevel[key]==2)
            {
                this.booking = false;
                this.producing = false;
                this.packaging = true;
                break;
            }
        }
    }

    ngOnDestroy()
    {
        this.rawItemSubscription.unsubscribe();
        this.finishedItemSubscription.unsubscribe();
        this.bookedRawItemSubscription.unsubscribe();
    }
}