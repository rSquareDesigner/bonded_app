import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import { environment } from './../../environments/environment';
//import { UserService } from 'src/app/services/user.service';

@Injectable({
  providedIn: 'root'
})
export class VerificationsService {


  // Base url
  baseurl = environment.baseurl + '/verify';
  
  constructor(
    //public userService: UserService,
    private http: HttpClient
  ) {}

   // Http Headers
   
   httpOptions = {
    //withCredentials: true,  
    headers: new HttpHeaders({
      //'x-access-token': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoxLCJlbWFpbCI6ImFtb2N0ZXp1bWE4MUBnbWFpbC5jb20iLCJpYXQiOjE2MzMwNzA5MTAsImV4cCI6MTYzMzA3ODExMH0.PzY47gJtKbAd8QUcyLGCJQldmE0BrciHhs2KiT_WMUg'
      //'Accepts': 'application/json',
      //'Content-Type': 'application/json'
    })
    
  }
  
  // Verify Email
  verifyEmail(user_id:number, code:string): Observable<any> {
    var data = {
      user_id: user_id,
      code: code
    }
    return this.http.post<any>(this.baseurl+'/email', data, this.httpOptions)
    .pipe(
      retry(1),
      catchError(this.errorHandl),
    )
  }

  // Verify Phone
  verifyPhone(user_id:number, code:string): Observable<any> {
    var data = {
      user_id: user_id,
      code: code
    }
    return this.http.post<any>(this.baseurl+'/phone', data, this.httpOptions)
    .pipe(
      retry(1),
      catchError(this.errorHandl),
    )
  }


  // Error handling
  errorHandl(error:any) {
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
