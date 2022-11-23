import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule, routingComponents } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { ImageUploadComponent } from './components/image-upload/image-upload.component';
import { DlDateTimeDateModule, DlDateTimePickerModule } from 'angular-bootstrap-datetimepicker';
import { UsersComponent } from './components/users/users.component';
import { AuctionsComponent } from './components/auctions/auctions.component';
import { TransactionsComponent } from './components/transactions/transactions.component';
import { AccountsManagerComponent } from './components/accounts-manager/accounts-manager.component';
import { ResolutionCenterComponent } from './components/resolution-center/resolution-center.component';
import { DatabaseComponent } from './components/database/database.component';
import { SystemComponent } from './components/system/system.component';
import { ResultCardComponent } from './components/result-card/result-card.component';
import { FooterComponent } from './components/footer/footer.component';
import { RecentlyViewedComponent } from './components/recently-viewed/recently-viewed.component';
import { BidsAndOffersComponent } from './components/bids-and-offers/bids-and-offers.component';
import { PurchasesComponent } from './components/purchases/purchases.component';
import { WatchlistComponent } from './components/watchlist/watchlist.component';
import { SellingComponent } from './components/selling/selling.component';
import { AccountDetailsComponent } from './components/account-details/account-details.component';
import { AccountComponent } from './components/account/account.component';
import { InboxComponent } from './components/inbox/inbox.component';
import { MessagesComponent } from './components/messages/messages.component';
import { SubMenuComponent } from './components/sub-menu/sub-menu.component';



@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    routingComponents,
    ImageUploadComponent,
    UsersComponent,
    AuctionsComponent,
    TransactionsComponent,
    AccountsManagerComponent,
    ResolutionCenterComponent,
    DatabaseComponent,
    SystemComponent,
    ResultCardComponent,
    FooterComponent,
    RecentlyViewedComponent,
    BidsAndOffersComponent,
    PurchasesComponent,
    WatchlistComponent,
    SellingComponent,
    AccountDetailsComponent,
    AccountComponent,
    InboxComponent,
    MessagesComponent,
    SubMenuComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    DlDateTimeDateModule,  // <--- Determines the data type of the model
    DlDateTimePickerModule
  ],
  providers: [],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule { }
