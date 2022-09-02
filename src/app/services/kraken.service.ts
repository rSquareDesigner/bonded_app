import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from './../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class KrakenService {

  baseurl = environment.baseurl  +'/kraken';

  constructor(
    private http: HttpClient,
  ) { }

  httpOptions = {
    headers: new HttpHeaders({
      //'Accepts': 'application/json',
      //'Content-Type': 'application/json'
    })
  }

  optimizeImage(filename:string,container:string, width:number): Observable<any> {
    var data = {
      filename: filename,
      container: container,
      width: width
    }
    return this.http.post<any>(this.baseurl + '/optimizeImage', data, this.httpOptions)
    .pipe(
      retry(0),
      catchError(this.errorHandl),
    ) 
  }

  optimizeListingImages(listing_id:number): Observable<any> {
    var data = {
      listing_id: listing_id
    }
    return this.http.post<any>(this.baseurl + '/optimizeListingImages', data, this.httpOptions)
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

