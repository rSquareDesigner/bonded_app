import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from './../../environments/environment';
import { EmailValidator } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class MailingService {

  baseurl = environment.baseurl  +'/sendgrid';
  baseurl2 = environment.baseurl  +'/sendgrid2';
  
  constructor(
    private http: HttpClient,
  ) { }

  httpOptions = {
    headers: new HttpHeaders({
      //'Accepts': 'application/json',
      //'Content-Type': 'application/json'
    })
  }

  sendResetPasswordLink(name:string, email:string, user_id:number){
    console.log('mailing.resetPassword');
       
      var data = {
        name: name,
        email:email,
        user_id: user_id
      }
      
      this.sendMailRequest('passwordReset',data).subscribe((data: any) => { 
        //console.log('Password reset has been sent');
      });
  }

  sendUserMessage(user_name:string, user_email:string, message:string){
       
      var data = {
        user_name: user_name,
        user_email: user_email,
        message: message
      }
      
      this.sendMailRequest('userMessage',data).subscribe((data: any) => { 
        //console.log('Password reset has been sent');
      });
  }

  verifyEmail(user_id:number,email:string){
    
    var obj = {
      user_id: user_id,
      email: email
    }

    this.sendMailRequest('verifyEmail',obj).subscribe((data: any) => { 
      //console.log('admin newSignup email has been sent');
    });

  };

  messageNotification(recipient_user_id:number, chat_id:number, user_name:string,user_image:string, user_message:string,listing_title:string, listings_image:string, listing_description:string){
    
    var obj = {
      recipient_user_id: recipient_user_id,
      chat_id: chat_id,
      user_name: user_name,
      user_image: user_image,
      user_message: user_message,
      listing_title: listing_title,
      listing_image: listings_image,
      listing_description: listing_description
    }

    this.sendMailRequest('messageNotification',obj).subscribe((data: any) => { 
      //console.log('admin newSignup email has been sent');
    });

  };

  rateYourPurchase(seller_id:number, buyer_id:number, listing_title:string, listing_description:string, listing_image:string, transaction_id:number){

    var obj = {
      seller_user_id: seller_id,
      buyer_user_id: buyer_id,
      listing_title: listing_title,
      listing_description: listing_description,
      listing_image: listing_image,
      transaction_id: transaction_id
    }

    this.sendMailRequest('rateYourPurchase',obj).subscribe((data: any) => { 
      //console.log('admin newSignup email has been sent');
    });

  };

  listingReported(obj:any){
    this.sendMailRequest('listingReported',obj).subscribe(() => { 
      
    });
  }

  sendNewsletter(email:string, template:string){
    var obj = {
      email: email,
      template: template
    }

    this.sendMailRequest2('sendNewsletter',obj).subscribe((data: any) => { 
      //console.log('admin newSignup email has been sent');
    });

  }


  sendMailRequest(type:string,data:any): Observable<any> {
    return this.http.post<any>(this.baseurl + '/' + type, data, this.httpOptions)
    .pipe(
      retry(0),
      catchError(this.errorHandl),
    ) 
  }

  sendMailRequest2(type:string,data:any): Observable<any> {
    return this.http.post<any>(this.baseurl2 + '/' + type, data, this.httpOptions)
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

