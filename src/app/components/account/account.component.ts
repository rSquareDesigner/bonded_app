import { Component, OnInit, Inject } from '@angular/core';
import { UserService } from './../../services/user.service';
import { TablesService } from './../../services/tables.service';
import { VerificationsService } from './../../services/verifications.service';
import { MailingService } from './../../services/mailing.service';
//import { TwilioService } from './../../services/twilio.service';
import { ApisService } from './../../services/apis.service';
import { CommonService } from './../../services/common.service';
import { MyblobService } from './../../services/myblob.service';
import { NavigationService } from '../../services/navigation.service';
import { DOCUMENT } from '@angular/common';
import * as sha512 from 'js-sha512';
declare var $: any;

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss']
})
export class AccountComponent implements OnInit {

  user:any;

  user_name: string = '';
  user_email: string = '';
  user_zipcode: string = '';
  user_phone: string = '';
  password_current: string = '';
  password_new: string = '';
  password_new_confirm: string = '';

  invalid_user_name: string = '';
  invalid_user_email: string = '';
  invalid_user_phone: string = '';
  invalid_user_zipcode: string = '';

  invalid_password_current: string = '';
  invalid_password_new: string = '';
  invalid_password_new_confirm: string = '';

  email_change_step: number = 0;
  phone_change_step: number = 0;

  digit_1: string = '';
  digit_2: string = '';
  digit_3: string = '';
  digit_4: string = '';
  digit_5: string = '';
  digit_6: string = '';

  location: any = {};
  profile_image_filename: string = '';
  cropper_active: boolean = false;

  constructor(
    public userService: UserService,
    public tablesService: TablesService,
    public verificationsService: VerificationsService,
    public mailingService: MailingService,
    //public twilioService: TwilioService,
    public apisService: ApisService,
    public commonService: CommonService,
    public myblobService: MyblobService,
    public navigationService: NavigationService,
    @Inject(DOCUMENT) private document: Document
  ) { }

  ngOnInit() {

    this.userService._getUser.subscribe((currentUser) => {
      this.user = currentUser;
      if (this.user){
        if (this.user.sign_up_date) this.user.sign_up_date_humanized = this.commonService.getDate(this.user.sign_up_date);
      }
    });

  }

  showEditName(){
    this.user_name = this.user.name;
    $('#editNameModal').modal('show');
  }

  showEditEmail(){
    this.clearDigits();
    this.email_change_step = 1;
    this.user_email = this.user.email;
    $('#editEmailModal').modal('show');
  }

  showEditPhone(){
    this.clearDigits();
    this.phone_change_step = 1;
    this.user_phone = this.user.phone;
    $('#editPhoneModal').modal('show');
  }

  showEditLocation(){
    console.log('this.user', this.user);
    this.user_zipcode = this.user.location_zipcode;
    this.location.city = this.user.location_city;
    this.location.state = this.user.location_state;
    $('#editLocationModal').modal('show');
  }

  showEditPassword(){
    $('#editPasswordModal').modal('show');
  }

  saveName(){
    console.log('save name');
    if (!this.user_name){
      this.invalid_user_name = 'Please enter a valid name';
      return;
    }

    var user_object = {
      id: this.user.id,
      name: this.user_name
    }

    this.tablesService.UpdateItem('users', user_object).subscribe(() => {
      this.user.name = this.user_name;
      $('#editNameModal').modal('hide');
      this.saveUserObjectInMemory();
    });
  }

  clearAlerts(){
    this.invalid_user_name = '';
    this.invalid_user_email = '';
    this.invalid_user_phone = '';
    this.invalid_user_zipcode = '';

    this.invalid_password_current = '';
    this.invalid_password_new = '';
    this.invalid_password_new_confirm = '';
  }

  saveUserObjectInMemory(){
    localStorage.setItem('user', JSON.stringify(this.user));
  }

  verifyEmail(){

    if (!this.user_email) this.invalid_user_email = 'Please enter a valid email';
    else {
      var emailPatternMatch = this.user_email.match(/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/);
      if (!emailPatternMatch) this.invalid_user_email = 'Please enter a valid email';
    }

    if (this.invalid_user_email) return;

    this.mailingService.verifyEmail(this.user.id, this.user_email);
    this.email_change_step = 2;
  }

  evalAccessCode(digit:number){
    if (digit == 1){
      if (this.digit_1.length == 1) {
        var elem = this.document.getElementById("digit_2");
        if (elem) elem.focus();
      }
    }
    else if (digit == 2){
      if (this.digit_2.length == 1) {
        var elem = this.document.getElementById("digit_3");
        if (elem) elem.focus();
      }
    }
    else if (digit == 3){
      if (this.digit_3.length == 1) {
        var elem = this.document.getElementById("digit_4");
        if (elem) elem.focus();
      }
    }
    else if (digit == 4){
      if (this.digit_4.length == 1) {
        var elem = this.document.getElementById("digit_5");
        if (elem) elem.focus();
      }
    }
    else if (digit == 5){
      if (this.digit_5.length == 1) {
        var elem = this.document.getElementById("digit_6");
        if (elem) elem.focus();
      }
    }
    else if (digit == 6){
      //if (this.digit_6.length == 1) document.getElementById("digit_2").focus();
    }
  }

  submitEmailVerificationCode(){
    var code = this.digit_1 + this.digit_2 + this.digit_3 + this.digit_4 + this.digit_5 + this.digit_6;  
    this.verificationsService.verifyEmail(this.user.id, code).subscribe((data:any) => {
      if (data.result == true) {
        //code verification success
        console.log('success!');
        $('#editEmailModal').modal('hide');
        this.emailVerificationSuccess();
      }
      else {
        //code verification failed
        console.log('failed!');
      }
    });
  }

  emailVerificationSuccess(){
    $('#emailVerificationSuccessModal').modal('show');

    var user_object = {
      id: this.user.id,
      email_has_been_verified: true,
      email: this.user_email
    }

    this.user.email_has_been_verified = true;
    this.userService.updateUser('email_has_been_verified',true);

    this.tablesService.UpdateItem('users', user_object).subscribe();

  }

  sendPhoneCode(){

    if (!this.user_phone) this.invalid_user_phone = 'Please enter a valid phone number';
    else {
      var phonePatternMatch = this.user_phone.match(/^(\+\d{1,3}[- ]?)?\d{10}$/);
      if (!phonePatternMatch) this.invalid_user_phone = 'Please enter a valid phone';
    }

    if (this.invalid_user_phone) return;

    //this.twilioService.confirmPhoneNumber(this.user.id, this.user_phone);
    this.phone_change_step = 2;
  }

  confirmPhoneCode(){
    var code = this.digit_1 + this.digit_2 + this.digit_3 + this.digit_4 + this.digit_5 + this.digit_6;  
    this.verificationsService.verifyPhone(this.user.id, code).subscribe((data:any) => {
      if (data.result == true) {
        //code verification success
        console.log('success!');
        $('#editPhoneModal').modal('hide');
        this.phoneVerificationSuccess();
      }
      else {
        //code verification failed
        console.log('failed!');
      }
    });
  }

  phoneVerificationSuccess(){
    $('#phoneVerificationSuccessModal').modal('show');

    var user_object = {
      id: this.user.id,
      phone_has_been_verified: true,
      phone: this.user_phone
    }

    this.user.phone_has_been_verified = true;
    this.userService.updateUser('phone_has_been_verified',true);

    this.tablesService.UpdateItem('users', user_object).subscribe();

  }

  evalZipCode(){
    if (this.user_zipcode){
      var zipcodePatternMatch = this.user_zipcode.match(/^\d{5}/);
      if (zipcodePatternMatch){
        this.apisService.getCityFromZip(this.user_zipcode).subscribe((data:any) => {
          console.log('zip data', data);
         this.location.city = data.city;
         this.location.state = data.state;
         this.location.lat = data.lat;
         this.location.lng = data.lng;
      })
      }
    }
  }

  saveZipCode() {

    if (!this.user_zipcode) this.invalid_user_zipcode = 'Please enter a valid zip code';
    else {
      var zipcodePatternMatch = this.user_zipcode.match(/^\d{5}/);
      if (!zipcodePatternMatch) this.invalid_user_zipcode = 'Please enter a valid zip code';
    }

    if (this.invalid_user_zipcode) return;

    if (this.location) {
      var user_object = {
        id: this.user.id,
        location_zipcode: this.user_zipcode,
        location_city: this.location.city,
        location_state: this.location.state,
        location_lat: this.location.lat,
        location_lng: this.location.lng
      }

      this.tablesService.UpdateItem('users', user_object).subscribe(() => {
        $('#editLocationModal').modal('hide');
      })
    }

  }

  savePassword(){ 
    
    console.log('this.password_current', this.password_current);
    
    if (!this.password_current) this.invalid_password_current = 'Please enter your current password';
    else if (sha512.sha512(this.password_current) != this.user.password) this.invalid_password_current = 'Incorrect password';

    if (this.invalid_password_current) return;

    if (!this.password_new) this.invalid_password_new = 'Please enter a valid password';
    else if (this.password_new.length < 8) this.invalid_password_new = 'Password must be at least 8 characters';

    if (this.invalid_password_new) return;

    if (!this.password_new_confirm) this.invalid_password_new_confirm = 'Please confirm your password';
    else if (this.password_new != this.password_new_confirm) this.invalid_password_new_confirm = 'Passwords do not match';

    if (this.invalid_password_new_confirm) return;

    var user_object = {
      id: this.user.id,
      password: sha512.sha512(this.password_new)
    }

    this.tablesService.UpdateItem('users', user_object).subscribe(() => {
      $('#editPasswordModal').modal('hide');
      $('#changePasswordSuccessModal').modal('show');

    })

  }

  editProfileImage(){
    $('#profileImageModal').modal('show');
  }

  saveProfileImage(base64:Event) {
    this.profile_image_filename = this.commonService.generateImageName() + '.jpeg';
    //this.myblobService.setContainer('users');
    this.myblobService.uploadProfileImageBlob(base64, this.user.id + '/' + this.profile_image_filename);
    this.user.image = base64;

    var user_object = {
      id: this.user.id,
      image:  'https://seelbach.blob.core.windows.net/users/' + this.user.id +'/' + this.profile_image_filename
    }

    this.tablesService.UpdateItem('users', user_object).subscribe((data: any) => {
      //this.hasChangedPlatform = false;
    });
  }

  setCropperActive(value:any){
    this.cropper_active = value;
  }

  clearDigits(){
    this.digit_1 = '';
    this.digit_2 = '';
    this.digit_3 = '';
    this.digit_4 = '';
    this.digit_5 = '';
    this.digit_6 = '';
  }

  goBack(){
    this.navigationService.goBack();
  }

  logout(){
    this.userService.logoutUser();
  }


}
