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
  tokenId : any;
  image : any;

  constructor(private connectionServie : ConnectionService )
  {}

  async ngOnInit() {
    this.Connect();
    if(this.connectionSuccesful)
    {
      var res = await this.connectionServie.getURL();
      this.responseSubscription =res.subscribe((value) => {
        this.url = value.toString();
        console.log(value);
      })
    }
    
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
    (await this.connectionServie.getTokenId()).subscribe((value) => {
      let json=JSON.parse(value.toString());
      this.tokenId = json.assets.token_id;
      this.image = json.assets.image_thumbnail_url;
      console.log(this.tokenId);
      console.log(this.image);
    });
  }


  ngOnDestroy()
  {
    this.responseSubscription.unsubscribe();
  }

}
