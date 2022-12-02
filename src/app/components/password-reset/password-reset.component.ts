import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { TablesService } from '../../services/tables.service';
import { UserService } from '../../services/user.service';
import * as sha512 from 'js-sha512';
declare var $: any;


@Component({
  selector: 'app-password-reset',
  templateUrl: './password-reset.component.html',
  styleUrls: ['./password-reset.component.scss']
})
export class PasswordResetComponent implements OnInit {

    password:string = '';
    passwordc:string = '';
    user: any = {};
    showAlert: boolean = false;
    alertMsg: string = '';

    //modal variables
    msgTitle: string = '';
    msgBody: string = '';
    msgCallback: any = undefined;
    msgObject: any = {};

    //alerts
    invalid_password: string = '';
    invalid_passwordc: string = '';

  constructor(
    private router: Router,
    public tablesService: TablesService,
    public userService: UserService,
    
  ) { 
    this.showAlert = false;
  }

  ngOnInit() {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const token = urlParams.get('token');

    this.tablesService.GetFiltered('users','token',token).subscribe((data: any) => {
      if (data[0]){
        this.user = data[0];
        var token_has_expired = (this.user.token_expiration - Date.now()) < 0;

        if (token_has_expired == false) this.showPasswordDialog();
        else this.showTokenExpiredDialog();
      }
      else {
        this.showInvalidUserDialog();
        return;
      }
    });
  }

  showPasswordDialog(){
    this.invalid_password = '';
    this.invalid_passwordc = '';
    $('#passwordModal').modal('show');
  }

  showInvalidTokenDialog(){
    this.msgTitle = 'Error';
    this.msgBody =  'The link is invalid or has expired';
    $('#messageModal').modal('show');
  }

  showTokenExpiredDialog(){
    this.msgTitle = 'Error';
    this.msgBody =  'This link has expired';
    $('#messageModal').modal('show');
  }

  showInvalidUserDialog(){
    this.msgTitle = 'Error';
    this.msgBody =  'User could not be found';
    $('#messageModal').modal('show');
  }
  
 
  submitPassword() {
    if (!this.password){
      this.invalid_password = "Please enter a valid password";
    }
    if (!this.passwordc){
      this.invalid_passwordc = "Please confirm your password";
    }

    if (this.invalid_password || this.invalid_passwordc){
      return;
    }

    if (this.password.length < 8) {
      this.invalid_password = 'Password must be at least 8 characters';
      return;
    }

    else if (this.password != this.passwordc) {
      this.invalid_passwordc = 'Passwords dont match';
      return;
    }
    else {
      var userObj = {
        id: this.user.id,
        password: sha512.sha512(this.password),
      }

      this.tablesService.UpdateItem('users', userObj).subscribe((data: any) => {
        $('#passwordModal').modal('hide');
        $('#passwordResetSuccessfulModal').modal('show');
          //this.userService.loginUser(this.user.email, this.password);
          //this.router.navigate(['/home']);
      });
    }
    //this.router.navigate(['/admin']);
  }

  goLogin(){
    $('#passwordResetSuccessfulModal').modal('hide');
    this.router.navigate(['/']);
  }

}
