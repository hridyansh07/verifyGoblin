import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ConnectionService } from './Services/connection.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'GoblinTown';
  connectionSuccesful : boolean = false;
  url : string;
  responseSubscription : Subscription;
  balance : any = 0;
  tokenId : any = null;
  image : any;

  constructor(private connectionServie : ConnectionService )
  {}

  async ngOnInit() {
    this.Connect(); 
  }


  async Connect()  
  {
     this.connectionSuccesful = await this.connectionServie.walletDetect();
     this.balance = await this.connectionServie.getBalance();
     console.log(this.balance);
     if(this.balance != 0)
     {
        this.getURL();
        this.getToken();
     }  
  }

  async getURL()
  {
   (await this.connectionServie.getURL()).subscribe((value)=>{
    console.log(value);
    this.url = value.toString();
  });
  }

  async getToken()
  {
    let tokenId =await this.connectionServie.getTokenIdFromContract();
    if(tokenId == null)
    {
      this.tokenId = null;
    }
    else{
      this.tokenId = tokenId;
    }
  }


  ngOnDestroy()
  {
    this.responseSubscription.unsubscribe();
  }
}
