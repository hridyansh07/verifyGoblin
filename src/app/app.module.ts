import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {AuthComponent} from './Components/Auth/auth.component';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {HttpClientModule} from '@angular/common/http';
import {HeaderComponent} from "./Components/Header/header.component";
import { FormsModule } from '@angular/forms';
import { OwnerComponent } from './Components/Owner/owner.component';
import {FarmerComponent} from "./Components/Farmer/farmer.component";
import { InspectorComponent } from './Components/Inspector/inspector.component';
import { ProducerComponent } from './Components/Producer/producer.component';
import { DistributorComponent } from './Components/Distributor/distributor.component';
import { ConsumerComponent } from './Components/Consumer/consumer.component';

@NgModule({
  declarations: [
    AppComponent,
    AuthComponent,
    HeaderComponent,
    OwnerComponent,
    FarmerComponent, 
    InspectorComponent,
    ProducerComponent,
    DistributorComponent,
    ConsumerComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule, 
    FormsModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
