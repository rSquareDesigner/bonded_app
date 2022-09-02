import { Injectable } from '@angular/core';
import { TablesService } from './tables.service';
import { CommonService } from './common.service';
import { MailingService } from './mailing.service';
import { NavigationService } from './navigation.service';
import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import * as sha512 from 'js-sha512';
import { environment } from './../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  user: any;
  error: any;
  redirectOnLogin: string = '';

  public _getUser = new BehaviorSubject<any>(undefined);
  public _loginFailed = new BehaviorSubject<any>(undefined);

  constructor(
    public tablesService: TablesService,
    public commonService: CommonService,
    public mailingService: MailingService,
    public navigationService: NavigationService,
    private http: HttpClient,
    private router: Router
  ) {
    
    var userx = localStorage.getItem('user');
    if (userx) { 
      try { this.user = JSON.parse(userx); }
      catch (e) {
        this.user = undefined;
      }
    }


    this._getUser.next(this.user);
    if (this.user) {
      //pull from database most updated record for the user
      /*
      this.tablesService.GetFiltered('users', 'id', this.user.id).subscribe((data: any) => {
        this.user = data[0];
        
        if (this.user) {
          this.tablesService.GetFiltered('saves', 'user_id', this.user.id).subscribe((data2: any) => {
            this.user.saves = data2;
            localStorage.setItem('user', JSON.stringify(this.user));
            this._getUser.next(this.user);
          });
        }

      })
      */
    }
    
  }

  httpOptions = {
    //withCredentials: true,
    headers: new HttpHeaders({
      //'Accepts': 'application/json',
      //'Content-Type': 'application/json'
    })
    
  }

  loginUser(email:string, password:string) {

    this.redirectOnLogin = this.navigationService.getRedirectUrl();
    console.log('redirect url ', this.redirectOnLogin);

    var userObj = {
      email: email.toLowerCase(),
      password: sha512.sha512(password)
    }

    this.loginReq(userObj).subscribe((data: any) => {
      if (data) {

        this.user = data;

        this.tablesService.GetFiltered('saves', 'user_id', this.user.id).subscribe((data: any) => {
          this.user.saves = data;
          localStorage.setItem('user', JSON.stringify(this.user));
          this._getUser.next(this.user);

          if (this.redirectOnLogin) {
            console.log('sent navigate command',this.redirectOnLogin);
            this.router.navigate([this.redirectOnLogin]);
          }
          //else this.router.navigate(['/admin/profile/' + this.user.id]);
          else this.router.navigate(['home']);

        });

      }
    });
  }

  signUpUser(name:string, email:string, password:any){
    var user_object = {
      name: name,
      email: email.toLowerCase(),
      password: sha512.sha512(password),
      sign_up_date: Date.now()
    }

    this.tablesService.AddItem('users', user_object).subscribe((data:any) => {
      //this.mailingService.sendRequestToVerifyEmail(data.id, user_object.name, user_object.email);
      this.loginUser(user_object.email, password);
    });

  }

  loginReq(obj:any): Observable<any> {
    return this.http.post<any>(environment.baseurl + '/login', obj, this.httpOptions)
    .pipe(
      retry(0),
      catchError(this.errorHandl.bind(this)),
    )
  }

  logoutUser(){
    this.user = undefined;
    this._getUser.next(this.user);
    localStorage.removeItem('user');
    this.router.navigate(['/home']);
    console.log('user logged out');
  }

  updateUser(field:string,val:any){
    this.user[field] = val;
  }

  getByEmail(email:string){
    this.tablesService.GetFiltered('users','email',email).subscribe((data: any) => { 
      if (data[0]) {
          this._loginFailed.next(
            {
              text: 'User found',
              user: data[0],
            }
          );
          //this._getUser.next(data[0]);
        }
      else {
        this._loginFailed.next(
          {
            text: 'User not found. Verify email or contact platform manager.',
            user: undefined
          }
        );
        //console.log('user not found');
      }
    });
  }
  

  // Error handling
  errorHandl(error:any) {
    
    if (error.error.message) {
      this._loginFailed.next(
        {
          text: error.error.message,
          user: undefined
        }
      )
    }
   
    let errorMessage = '';
    if(error.error instanceof ErrorEvent) {
      // Get client-side error
      errorMessage = error.error.message;
    } else {
      // Get server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    console.log(errorMessage);
    return throwError(errorMessage);
 }

}
