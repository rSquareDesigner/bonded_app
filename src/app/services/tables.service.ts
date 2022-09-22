import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import { environment } from './../../environments/environment';
//import { UserService } from 'src/app/services/user.service';

@Injectable({
  providedIn: 'root'
})
export class TablesService {


  // Base url
  baseurl = environment.baseurl + '/tables';
  
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
  
  // GET
  GetAll(table:string): Observable<any> {
    return this.http.get<any>(this.baseurl+'/'+table, this.httpOptions)
    .pipe(
      retry(1),
      catchError(this.errorHandl),
    )
  }

  // GET 
  GetFiltered(table:string,field:string,val:any): Observable<any> {
    return this.http.get<any>(this.baseurl+'/'+ table + '/?field=' + field + '&val='+ val, this.httpOptions)
    .pipe(
      retry(1),
      catchError(this.errorHandl),
    )
  }

  GetFiltered2(table:string,field:string,val:any, field2:string, val2:any): Observable<any> {
    return this.http.get<any>(this.baseurl+'/'+ table + '/?field=' + field + '&val='+ val  + '&field2='+ field2  + '&val2='+ val2, this.httpOptions)
    .pipe(
      retry(1),
      catchError(this.errorHandl),
    )
  }

  GetChatsByItemAndUser(listing_id:number, user_id:number): Observable<any> {
    return this.http.get<any>(this.baseurl+'/chatsByItemAndUser' + '/?listing_id=' + listing_id + '&user_id='+ user_id, this.httpOptions)
    .pipe(
      retry(1),
      catchError(this.errorHandl),
    )
  }

  GetChatsByUser(user_id:number): Observable<any> {
    return this.http.get<any>(this.baseurl+'/chatsByUser/?user_id=' + user_id, this.httpOptions)
    .pipe(
      retry(1),
      catchError(this.errorHandl),
    )
  }

  GetFiltered3(table:string,field:string,val:any, field2:string, val2:any, field3:string, val3:any): Observable<any> {
    return this.http.get<any>(this.baseurl+'/'+ table + '/?field=' + field + '&val='+ val  + '&field2='+ field2  + '&val2='+ val2 + '&field3='+ field3  + '&val3='+ val3, this.httpOptions)
    .pipe(
      retry(1),
      catchError(this.errorHandl),
    )
  }

  //option to specify columns
  GetFilteredX(table:string,field:string,val:any,columns:string): Observable<any> {
    return this.http.get<any>(this.baseurl+'/'+ table + '/?field=' + field + '&val='+ val + '&columns=' + columns, this.httpOptions)
    .pipe(
      retry(1),
      catchError(this.errorHandl),
    )
  }

  // ADD object to database
  AddItem(table:string, obj:any): Observable<any> {
    return this.http.post<any>(this.baseurl+'/'+ table + '/add', obj, this.httpOptions)
    .pipe(
      retry(0),
      catchError(this.errorHandl),
    )
  }

  // ADD object to database
  UpdateItem(table:string, obj:any): Observable<any> {
    return this.http.put<any>(this.baseurl+'/'+table + '/update/'+ obj.id, obj, this.httpOptions)
    .pipe(
      retry(0),
      catchError(this.errorHandl),
    )
  }

  DeleteItem(table:string, id:any): Observable<any> {
    return this.http.delete<any>(this.baseurl+'/'+table + '/delete?field=id&val=' + id, this.httpOptions)
    .pipe(
      retry(0),
      catchError(this.errorHandl),
    )
  }

  // GET 
  DeleteFiltered(table:string,field:string,val:any): Observable<any> {
    return this.http.delete<any>(this.baseurl+'/'+ table + '/delete?field=' + field + '&val='+ val, this.httpOptions)
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
