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
  tokenId : string;


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
     this.getURL();
     this.getToken();
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
    });
  }


  ngOnDestroy()
  {
    this.responseSubscription.unsubscribe();
  }

}
