import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import { environment } from './../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ChatsService {

  // Base url
  baseurl = environment.baseurl + '/chats';
  
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
  
  GetChatsByItemAndUser(listing_id:number, user_id:number): Observable<any> {
    return this.http.get<any>(this.baseurl+'/chatsByItemAndUser' + '/?listing_id=' + listing_id + '&user_id='+ user_id, this.httpOptions)
    .pipe(
      retry(1),
      catchError(this.errorHandl),
    )
  }

  GetChatsByUser(user_id:number): Observable<any> {
    //console.log('in service!');
    return this.http.get<any>(this.baseurl+'/chatsByUser/?user_id=' + user_id, this.httpOptions)
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
