import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AuthComponent} from './Components/Auth/auth.component';
import {OwnerComponent} from './Components/Owner/owner.component';
import {FarmerComponent} from './Components/Farmer/farmer.component';
import { InspectorComponent } from './Components/Inspector/inspector.component';
import { ProducerComponent } from './Components/Producer/producer.component';
import {DistributorComponent } from "./Components/Distributor/distributor.component";
import { ConsumerComponent } from './Components/Consumer/consumer.component';


const routes: Routes = [  
  {path : "owner" , component : OwnerComponent},
  {path : "farmer", component : FarmerComponent},
  {path:  "auditor" , component : InspectorComponent},
  {path : "producer" , component : ProducerComponent},
  {path : "distributor" , component: DistributorComponent},
  {path : "consumer" , component:ConsumerComponent},
  { path: "" , component : AuthComponent },];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
