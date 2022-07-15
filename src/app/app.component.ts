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
     if(this.connectionSuccesful)
      console.log(process.env.TELEGRAM_URL);
  }

  async getURL()
  {
   (await this.connectionServie.getURL()).subscribe((value)=>{
    console.log(value);
    this.url = value.toString();
  });
  }


  ngOnDestroy()
  {
    this.responseSubscription.unsubscribe();
  }

}
