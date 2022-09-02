import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApisService {

  baseurl = environment.baseurl + '/zipcodeapi';

  constructor(
    private http: HttpClient,
    //public userService: UserService,
  ) { }

  httpOptions = {
    headers: new HttpHeaders({
      //'Accepts': 'application/json',
      //'Content-Type': 'application/json'
    })
  }

  getCityFromZip(zipcode:any): Observable<any> {
    return this.http.get<any>(this.baseurl + '/zipcode/' + zipcode, this.httpOptions)
    .pipe(
      retry(0),
      catchError(this.errorHandl),
    ) 
  }

  getCoordinatesFromAddress(address:string): Observable<any> {
    var data = {
      address: address
    }
    return this.http.post<any>(this.baseurl + '/getAddressCoordinates', data, this.httpOptions)
    .pipe(
      retry(0),
      catchError(this.errorHandl),
    ) 
  }

  // Error handling
  errorHandl(error:any) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
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
