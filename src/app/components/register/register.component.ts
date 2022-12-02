import { Component, OnInit } from '@angular/core';
import {Router, ActivatedRoute} from "@angular/router";
import { FormBuilder, FormGroup, Validators, ValidatorFn, AbstractControl, AsyncValidatorFn } from '@angular/forms';
import { Observable, of, pipe } from 'rxjs';
import { map, debounceTime } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { UserService } from './../../services/user.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  registration_form: FormGroup;
  form_submitted: boolean = false;

  // Base url
  baseurl = environment.baseurl;

  constructor(
    private http: HttpClient,
    private router: Router,
    public formBuilder: FormBuilder,
    public userService: UserService
  ) { }

  httpOptions = {
    headers: new HttpHeaders({ })
  }

  ngOnInit(): void {

    window.scrollTo(0,0);
    this.initializeForm();

    console.log('this.baseurl', this.baseurl);
  }

  initializeForm(){

    function passwordMismatch(thisx:any): ValidatorFn {
      return (control: AbstractControl): { [key: string]: boolean } | null => {
        
        if (thisx.registration_form){
          if (control.value != thisx.registration_form.controls.password.value) return { 'mismatch': true };
          else return null;
        }

        else return null;
      }
    }

    function passwordLength(thisx:any): ValidatorFn {
      return (control: AbstractControl): { [key: string]: boolean } | null => {
        
        if (thisx.registration_form){
          if (control.value.length < 8) return { 'length': true };
          else return null;
        }

        else return null;
      }
    }

    function emailExists(thisx: any): AsyncValidatorFn {
      return (control: AbstractControl): | Promise<{ [key: string]: any } | null> | Observable<{ [key: string]: any } | null> => {

        if (!control.value || control.value.length < 5) return of(null);
        return thisx.http.get(thisx.baseurl + '/users/exists?email=' + control.value, thisx.httpOptions)
          .pipe(
            debounceTime(500),
            map((data: any) => {
              if (data.exists == true) return ({ 'email_exists': true });
            })
          );
      };
    }

    var emailPattern = /^[a-zA-Z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/;

    this.registration_form = this.formBuilder.group({
      first_name: ['',[Validators.required]],
      last_name: ['',[Validators.required]],
      email: ['',[Validators.required, Validators.pattern(emailPattern)],[emailExists(this)]],
      password: ['',[Validators.required, passwordLength(this)]],
      password_confirm: ['',[Validators.required, passwordMismatch(this)]],
    });

    this.form_submitted = false;
  }

  goto(route:any){
    this.router.navigate([route]);
  }

  registerUser({ value, valid }: { value: any, valid: boolean }) {
    this.form_submitted = true;
    console.log(value, valid);
    if (valid){
      this.userService.signUpUser(value);  
    }
  }
  

  /*
  registerUser(){
    
    //TODO
    console.log('register user');
    this.form_submitted = true;
    */
  //}

}
