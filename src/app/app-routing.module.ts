import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { ListingDetailsComponent } from './components/listing-details/listing-details.component';
import { EditAuctionComponent } from './components/edit-auction/edit-auction.component';
import { AccountComponent } from './components/account/account.component';
import { AdminComponent } from './components/admin/admin.component';
import { AuctionsComponent } from './components/auctions/auctions.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { PasswordResetComponent } from './components/password-reset/password-reset.component';
import { RecentlyViewedComponent } from './components/recently-viewed/recently-viewed.component';
import { BidsAndOffersComponent } from './components/bids-and-offers/bids-and-offers.component';
import { PurchasesComponent } from './components/purchases/purchases.component';
import { WatchlistComponent } from './components/watchlist/watchlist.component';
import { SellingComponent } from './components/selling/selling.component';
import { AccountDetailsComponent } from './components/account-details/account-details.component';
import { InboxComponent } from './components/inbox/inbox.component';

const routes: Routes = [
  {path: '', component: HomeComponent },
  {path: 'auctions/:type', component: AuctionsComponent },
  {path: 'listing-details/:listing_id', component: ListingDetailsComponent },
  {path: 'edit-auction/:auction_id', component: EditAuctionComponent },
  {path: 'account', component: AccountDetailsComponent },
  {path: 'login', component: LoginComponent },
  {path: 'register', component: RegisterComponent },
  {path: 'recently-viewed', component: RecentlyViewedComponent },
  {path: 'bids-and-offers', component: BidsAndOffersComponent },
  {path: 'purchases', component: PurchasesComponent },
  {path: 'watchlist', component: WatchlistComponent },
  {path: 'selling', component: SellingComponent },
  {path: 'inbox', component: InboxComponent },
  {path: 'admin/:view', component: AdminComponent },
  {path: 'password-reset', component: PasswordResetComponent },
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
  AuctionsComponent,
  LoginComponent,
  RegisterComponent,
  PasswordResetComponent,
  RecentlyViewedComponent,
  BidsAndOffersComponent,
  PurchasesComponent,
  WatchlistComponent,
  SellingComponent,
  AccountDetailsComponent,
  AccountComponent,
  InboxComponent
];