import { Component, OnInit } from '@angular/core';
import {Router, ActivatedRoute} from "@angular/router";
import { FormBuilder, FormGroup, Validators, ValidatorFn, AbstractControl, AsyncValidatorFn } from '@angular/forms';
import { UserService } from './../../services/user.service';
declare var $: any;


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  login_form: FormGroup;
  form_submitted: boolean = false;

  reset_password_form_submitted: boolean = false;
  invalid_email: string = '';

  email: string = '';

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    public formBuilder: FormBuilder,
    public userService: UserService
  ) { }

  ngOnInit(): void {

    window.scrollTo(0,0);
    this.initializeForm();
  }

  initializeForm(){

    var emailPattern = /^[a-zA-Z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/;

    this.login_form = this.formBuilder.group({
      email: ['',[Validators.required, Validators.pattern(emailPattern)]],
      password: ['',[Validators.required]]
    });

    this.form_submitted = false;
  }

  goto(route:any){
    this.router.navigate([route]);
  }

  loginUser({ value, valid }: { value: any, valid: boolean }) {
    this.form_submitted = true;
    console.log(value, valid);
    if (valid){
      this.userService.loginUser(value);  
    }
  }

  forgotPassword(){
    $('#forgotPasswordModal').modal('show');
  }

  sendForgotPassword(){
    //TODO
    $('#forgotPasswordModal').modal('hide');
    $('#sendForgotPasswordSuccessModal').modal('show');
  }

  closeModal(name:string){
    $('#'+ name).modal('hide');
  }

  clearLoginAlerts(){
    
  }


}
