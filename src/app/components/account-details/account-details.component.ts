import { Component, OnInit, Input } from '@angular/core';
import { TablesService } from './../../services/tables.service';
import { UserService } from './../../services/user.service';
import { MailingService } from './../../services/mailing.service';
declare var $: any;

@Component({
  selector: 'app-account-details',
  templateUrl: './account-details.component.html',
  styleUrls: ['./account-details.component.scss']
})
export class AccountDetailsComponent implements OnInit {

  @Input() user: any;

  years: any[];
  itemx: any = {};

  constructor(
    public tablesService: TablesService,
    public userService: UserService,
    public mailingService: MailingService,
  ) { }

  ngOnInit(): void {

    //load user
    this.userService._getUser.subscribe((currentUser) => {
      
      this.user = currentUser;
      this.itemx = JSON.parse(JSON.stringify(this.user));

      //if (this.user) this.userService.updateLastActivity();

    });
    //this.itemx = JSON.parse(JSON.stringify(this.user));

    this.createYearsArray();
  }

  editEmail(){
    this.itemx.email = this.user.email;
    $('#editEmailModal').modal('show');
  }

  editPhone(){
    this.itemx.phone = this.user.phone;
    $('#editPhoneModal').modal('show');
  }

  editNameAndAddress(){

    this.itemx.first_name = this.user.first_name;
    this.itemx.last_name = this.user.last_name;
    this.itemx.address = this.user.location_address;
    this.itemx.city = this.user.location_city;
    this.itemx.state = this.user.location_state;
    this.itemx.zipcode = this.user.location_zipcode;
    $('#editNameAndAddressModal').modal('show');
  }

  editDateOfBirth(){
    $('#editDateOfBirthModal').modal('show');
  }

  saveField(field:string){
    var object:any = {
      id: this.user.id
    }

    if (field == 'email') object['email'] = this.itemx.email;
    if (field == 'phone') object['phone'] = this.itemx.phone;
    
    if (field == 'name_and_address') {
      object['first_name'] = this.itemx.first_name;
      object['last_name'] = this.itemx.last_name;
      object['location_address'] = this.itemx.location_address;
      object['location_city'] = this.itemx.location_city;
      object['location_state'] = this.itemx.location_state;
      object['location_zipcode'] = this.itemx.location_zipcode;
    } 

    if (field == 'dob'){
      object['dob_month'] = this.itemx.dob_month;
      object['dob_day'] = this.itemx.dob_day;
      object['dob_year'] = this.itemx.dob_year;
    }

    console.log('object', object);

    this.tablesService.UpdateItem('users', object).subscribe(() => {
      $('#editEmailModal').modal('hide');
      $('#editPhoneModal').modal('hide');
      $('#editNameAndAddressModal').modal('hide');
      $('#editDateOfBirthModal').modal('hide');

      this.loadUser();
      $('#successModal').modal('show');
    });

  }


  createYearsArray() {
    var numbers = [];

    for (let i = 1950; i <= 2003; i++) {
      numbers.push(i);
    }

    this.years = numbers;
  }

  closeModal(name:string){
    $('#'+ name).modal('hide');
  }

  loadUser(){
    this.tablesService.GetFiltered('users','id', this.user.id).subscribe((data:any) => {
      var user = data[0];
      if (user) {
        this.user = user;
        this.itemx = JSON.parse(JSON.stringify(this.user));
      }
    });
  }

  resetPassword(){
    $('#resetPasswordModal').modal('show');
  }

  sendResetPasswordLink(){
    this.mailingService.sendResetPasswordLink(this.user.first_name, this.user.email,this.user.id);
    $('#resetPasswordModal').modal('hide');
    $('#resetPasswordLinkSentModal').modal('show');
  }

}
