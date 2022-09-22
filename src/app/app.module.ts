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
    SystemComponent
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
