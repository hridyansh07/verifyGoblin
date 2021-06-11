import { Component, OnInit } from "@angular/core";
import { AccountModel } from "src/app/Models/accountModel";
import {ConnectionService} from "../../Services/connection.service";

@Component({
    selector : "app-homepage",
    templateUrl : './homepage.component.html',
    styleUrls : ['./homepage.component.css']
})
export class HomePage  implements OnInit
{
    Role : string;
    account : AccountModel;
    address : string;
    
    

    constructor(private connectionService : ConnectionService)
    {
        this.account = this.connectionService.getAccount();
        this.address = this.account.Address;
        this.Role = this.account.Role;
    }

    ngOnInit()
    {
        if(this.account.Role == "owner")
        {
        
        }
    }


}