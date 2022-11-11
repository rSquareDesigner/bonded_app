import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { ListingDetailsComponent } from './components/listing-details/listing-details.component';
import { EditAuctionComponent } from './components/edit-auction/edit-auction.component';
import { AccountComponent } from './components/account/account.component';
import { AdminComponent } from './components/admin/admin.component';
import { AuctionsComponent } from './components/auctions/auctions.component';
import { NotFoundComponent } from './components/not-found/not-found.component';

const routes: Routes = [
  {path: '', component: HomeComponent },
  {path: 'auctions/:type', component: AuctionsComponent },
  {path: 'auction-details/:auction_id', component: ListingDetailsComponent },
  {path: 'edit-auction/:auction_id', component: EditAuctionComponent },
  {path: 'account', component: AccountComponent },
  {path: 'admin', component: AdminComponent },
  {path: 'admin/:view', component: AdminComponent },
  {path: '**', component: NotFoundComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
export const routingComponents = [
  HomeComponent,
  ListingDetailsComponent,
  EditAuctionComponent,
  AccountComponent,
  AdminComponent,
  NotFoundComponent,
  AuctionsComponent
];