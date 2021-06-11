import { Injectable, OnDestroy, OnInit } from "@angular/core";
import { Subscription } from "rxjs";
import { environment } from "src/environments/environment";
import { RawItem } from "../Models/rawItemModel";
import { ConnectionService } from "./connection.service";

@Injectable({providedIn : "root"})
export class GetItems implements OnDestroy
{
    private subscription : Subscription ; 
    plantedRawItems : Array<number>;
    harvestedRawItems : Array<number>;
    inspectedRawItems : Array<number>; 
    processedRawItems : Array<number>;
    _RawItems : Array<RawItem> ;
    
    
    constructor(private connnectionService : ConnectionService)
    {
        console.log("Checking");
        console.log("Here");
        // this.subscription = this.connnectionService._rawItemsUpc.subscribe(Upc => {
        //     var index = this._RawItems.findIndex(Item => {
        //         Item.Upc == Upc;
        //     });
        //     if (index == -1)
        //     {
        //         this._RawItems.push(new RawItem(Upc , environment.rawItemState.Planted));
        //         this.plantedRawItems.push(Upc);
        //     }
        //     else
        //     {
        //         this._RawItems[index].State = this._RawItems[index].State + 1; 
                
        //     }
        // })
    }

 
    // filterRawItems()
    // {
    //     this._RawItems.forEach((Item)=>{
    //         if(Item.State == 1)
    //         {
    //             this.plantedRawItems.push(Item);
    //         }
    //         if(Item.State == 2)
    //         {
    //             this.harvestedRawItems.push(Item);
    //             var index = this.plantedRawItems.findIndex(item => {
    //                 Item.Upc == item.Upc
    //             });
    //             delete this.plantedRawItems[index];
    //         }
    //         if(Item.State == 3)
    //         {
    //             this.inspectedRawItems.push(Item);
    //             var index = this.harvestedRawItems.findIndex(item => {
    //                 Item.Upc == item.Upc
    //             });
    //             delete this.harvestedRawItems[index];
            
    //         }
    //         if(Item.State == 4)
    //         {
    //             this.processedRawItems.push(Item);
    //             var index = this.inspectedRawItems.findIndex(item => {
    //                 Item.Upc == item.Upc
    //             });
    //             delete this.inspectedRawItems[index];
    //         }
    //     })
    //     console.log(this.plantedRawItems);
    // }

    ngOnDestroy()
    {
        this.subscription.unsubscribe();
    }
}