import { templateJitUrl } from "@angular/compiler";
import { Component, OnDestroy, OnInit } from "@angular/core";
import { Subscription } from "rxjs";
import { ConnectionService } from "src/app/Services/connection.service";

@Component({
    selector : "app-inspector",
    templateUrl : "./inspector.component.html",
    styleUrls : ["./inspector.component.css"]
})
export class InspectorComponent implements OnInit , OnDestroy
{
    selectedInspectedItem;
    selectedLevel;
    selectedAuditedItem;
    inspect: boolean  = false;
    audit: boolean = false; 
    rawItemSubscription : Subscription; 
    finishedItemSubscription : Subscription;
    rawItemToBeInspected : Array<number> = [] ;
    finishedItemToBeAudited : Array<number> = [];
    data : Array<Object> =  [
        {id : 0 , name : "Inspect Raw Item"},
        {id : 1 , name : "Audit Finished Product"},
    ]


    constructor(private connectionService : ConnectionService)
    {}

    ngOnInit()
    {
        this.rawItemSubscription = this.connectionService.rawItems.subscribe(Item => {
            if(Item.Upc == 0)
            {
                console.log("First Item")
            }
            if(Item.State == 2) {
                this.removeRawInspected(Item.Upc);
                this.rawItemToBeInspected.push(Item.Upc);
            }
            if(Item.State == 3)
            {
                this.removeRawInspected(Item.Upc);
            }
        });
        this.finishedItemSubscription = this.connectionService.finsihedItems.subscribe(Item=>{
            if(Item.Upc == 0)
            {
                console.log("first Item");
            }
            if(Item.State == 2)
            {
                this.removeFinishedInspected(Item.Upc);
                this.finishedItemToBeAudited.push(Item.Upc);
            }
            if(Item.State == 3)
            {
                this.removeFinishedInspected(Item.Upc);
            }
        })

    }

    selected()
    {
        this.audit = false ;
        this.inspect = false;
        for(let key in this.selectedLevel)
        {
            if(this.selectedLevel[key] == 0)
            {
                this.inspect = true;
                this.audit = false;
                break;
            }
            if(this.selectedLevel[key]==1)
            {
                this.inspect = false;
                this.audit = true;
                break;
            }
        }
    }

    onSubmit(form)
    {
        for(let key in this.selectedLevel)
        {
            if(this.selectedLevel[key] == 0)
            {
                this.connectionService.auditRawItem(this.selectedInspectedItem , form.inspectionNotes);
                this.removeRawInspected(this.selectedInspectedItem);
            }
            if(this.selectedLevel[key] == 1)
            {
                // console.log("Finished Item");
                this.connectionService.auditFinishedItem(this.selectedAuditedItem , form.auditNotes);
                this.removeFinishedInspected(this.selectedAuditedItem);
            }
        }
    }

    removeFinishedInspected(Upc)
    {
        for(var i=0;i<this.finishedItemToBeAudited.length ; i++)
        {
            if(this.finishedItemToBeAudited[i] === Upc)
            {
                delete this.finishedItemToBeAudited[i];
            }
        }
    }

    removeRawInspected(Upc)
    {
        for(var i=0;i<this.rawItemToBeInspected.length ; i++)
        {
            if(this.rawItemToBeInspected[i] === Upc)
            {
                delete this.rawItemToBeInspected[i];
            }
        }
    }

    selectRaw()
    {
        console.log(this.selectedLevel);
    }
    
    ngOnDestroy()
    {
        this.rawItemSubscription.unsubscribe();
    }


}