import {Component, OnDestroy, OnInit} from "@angular/core";
import { Subscription } from "rxjs";
import { GetItems } from "src/app/Services/getItems.service";
import {ConnectionService} from "../../Services/connection.service";

@Component({
    selector : "app-farmer",
    templateUrl : "./farmer.component.html",
    styleUrls : ["./farmer.component.css"]
})

export class FarmerComponent implements OnInit,OnDestroy{
    constructor(private connectionService : ConnectionService, private getItems : GetItems){}
    plant : boolean  = false;
    harvest : boolean = false; 
    process : boolean = false;
    subscription : Subscription ; 
    selectedRaw : Object ; 
    selectedLevel : Object ;
    selectedHarvestItem : number; 
    selectedProcessItem : number;
    data : Array<Object>  = [
    {id : 0 , name : "Plant A Raw Item" , disabled : true},
    {id: 1 , name : "Harvest A Raw Item" , disabled : true},
    {id : 2 , name: "Process A Raw Item" , disabled : true}];
    InspectedItems : Array<number> = [];
    PlantedItems : Array<number> = [];
    


    ngOnInit()
    {
            this.subscription = this.connectionService.rawItems.subscribe((rawItem) => {
            var counter = 0; 
            console.log(counter);
            console.log(rawItem);
            if(rawItem.Upc === 0)
            {
                console.log("first Upc");
            }
            else
            {
            if(rawItem.State === 3)
            {
                this.InspectedItems.push(rawItem.Upc);
                this.removePlanted(rawItem.Upc);
            }
            if(rawItem.State === 1)
            {
                this.PlantedItems.push(rawItem.Upc);
            }
            // var found : boolean = false;
            // var length = this.PlantedItems.length
            // for(var i=0;i<=length ; i++)
            // {
            //     if(this.PlantedItems[i] == rawItem.Upc)
            //     {
            //         found = true;
            //     }
            // }
            // if(!found)
            // {
            //     this.PlantedItems.push(rawItem.Upc);
            // }
        }
            console.log(this.InspectedItems);
            console.log(this.PlantedItems);
        })
    
    }

    removePlanted(Upc)
    {
        for(var i = 0 ; i< this.PlantedItems.length ; i++)
        {
            if(this.PlantedItems[i] == Upc)
            {
                delete this.PlantedItems[i];
            }
        }
    }
    
    removeInspected(Upc)
    {
        for(var i = 0 ; i< this.InspectedItems.length ; i++)
        {
            if(this.InspectedItems[i] == Upc)
            {
                delete this.InspectedItems[i];
            }
        }
    }
   
    

    selectRaw()
    {
        console.log(this.selectedRaw)
    }

    selected()
    {
        console.log(this.getItems.plantedRawItems);
        this.plant = false;
        this.harvest = false;
        this.process = false;
        console.log(this.selectedLevel);
        for(let key in this.selectedLevel)
        {
            if(this.selectedLevel[key] == 0)
            {
                this.plant = true;
                this.harvest = false;
                this.process = false;
                break;
            }
            if(this.selectedLevel[key] == 1)
            {
                this.plant = false;
                this.process = false;
                this.harvest = true;
                break;

            }
            if(this.selectedLevel[key] == 2)
            {
                this.process = true;
                this.plant = false;
                this.harvest = false;
                break;
            }
        }
    }

    onSubmit(form)
    {
        for (let key in this.selectedLevel)
        {
            if(this.selectedLevel[key] == 0)
            {
                
                console.log("Adding A RawItem");
                console.log(form);
                this.connectionService.plantRawItem(form.upc , form.farmName , form.farmInformation ,form.Latitude , form.Longitude); 
                break;
            }
            
            if(this.selectedLevel[key] == 1)
            {
                console.log("Harvesting a Raw Item");
                this.connectionService.harvestRawItem(this.selectedHarvestItem , form.harvestNotes)
                this.removePlanted(this.selectedHarvestItem);
                break;
            }
            
            if(this.selectedLevel[key] == 2)
            {
                console.log("Processing a Raw Item");
                this.connectionService.processRawItem(this.selectedProcessItem);
                this.removeInspected(this.selectedProcessItem);
                break;
            }
            
        }
    }

    ngOnDestroy()
    {
        this.subscription.unsubscribe();
    }
}