import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { ListingDetailsComponent } from './components/listing-details/listing-details.component';

const routes: Routes = [
  {path: '**', redirectTo: '/', pathMatch: 'full'},
  {path: '', component: HomeComponent },
  {path: 'listings-details', component: ListingDetailsComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
export const routingComponents = [
  HomeComponent,
  ListingDetailsComponent
];