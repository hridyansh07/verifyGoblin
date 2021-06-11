import { Component } from "@angular/core";
import {ConnectionService} from "../../Services/connection.service";

@Component({
    selector : "app-owner",
    templateUrl : "./owner.component.html",
    styleUrls : ['./owner.component.css']
})
export class OwnerComponent
{
    constructor(private connectionService : ConnectionService){}

    data : Array<Object> =  [
        {id : 0 , name : "Add Farmer"},
        {id : 1 , name : "Add Consumer"},
        {id : 2 , name : "Add Distributor"},
        {id : 3 , name : "Add Auditor"},
        {id : 4 , name : "Add Producer"},
    ]
    selectedLevel: Object ;

    selected(){
        console.log(this.selectedLevel);
    }

    onSubmit(data)
    {
        for(let key in this.selectedLevel)
        {
        if (this.selectedLevel[key] === 0 )
            {
                console.log(data);
                this.connectionService.addFarmer(data.address);
                break;
            }
        if (this.selectedLevel[key] == 1)
        {
            this.connectionService.addConsumer(data.address);
            break;
        }
        
        if (this.selectedLevel[key] == 2)
        {
            this.connectionService.addDistributor(data.address);
            break;
        }
        
        if (this.selectedLevel[key] == 3)
        {
            this.connectionService.addAuditor(data.address);
            break;
        }
        
        if (this.selectedLevel[key] == 4)
        {
            this.connectionService.addProducer(data.address);
            break;
        }
    
    }
    }

}