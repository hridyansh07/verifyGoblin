import { Component, OnInit } from '@angular/core';
import { ConnectionService } from './Services/connection.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'GoblinTown';
  connectionSuccesful : boolean = false;

  constructor(private connectionServie : ConnectionService )
  {}

  ngOnInit(): void {
    this.connectionServie.walletDetect();
  }


  async Connect()  
  {
     this.connectionSuccesful = await this.connectionServie.walletDetect();
  }

}
