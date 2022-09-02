import { Injectable } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { Observable, BehaviorSubject, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NavigationService {

  page_history: any[] = [];
  redirect_after_login_url: string = '';

  public _showLoginModal = new BehaviorSubject<any>(undefined);

  constructor(
    private router: Router,
  ) {

    this.router.events.subscribe((val) => {
      // see also 
      if (val instanceof NavigationEnd) {

        //check if go-back by browser
        if (this.router.url == this.page_history[this.page_history.length-2]){
          this.page_history.splice(this.page_history.length-1, 1);
        }
        else this.saveUrl(this.router.url);

      }
    });
  
  }

  saveUrl(url:string){
    if (url == '/coming-soon') return;

    if (url != this.page_history[this.page_history.length-1]) this.page_history.push(url);
  }

  goBack(){
    //remove last url
    if (this.page_history.length < 2) this.router.navigate(['/home']); 

    this.page_history.splice(this.page_history.length-1, 1);
    
    if (this.page_history[this.page_history.length - 1]) {
      var page_history = this.page_history[this.page_history.length - 1];
      if (page_history.indexOf('?') > -1) {
        var queryString = page_history.slice(page_history.indexOf('?'));
        
        var urlParams =  this.getQueryParams(queryString);
        this.router.navigate([this.page_history[this.page_history.length-1].slice(0,page_history.indexOf('?'))],{ queryParams: urlParams });
      }
      else this.router.navigate([this.page_history[this.page_history.length-1]]);
    }
    else this.router.navigate(['/home']); 
    
  }

  getQueryParams(query_string:string){
    
    var params_str = query_string.slice(1);
    var pairs = params_str.split('&');
    var parameter_object:any = {};
    
    pairs.forEach(x => {
      var pairx = x.split('=');
      parameter_object[pairx[0]] = decodeURIComponent(pairx[1]);
    });

    return parameter_object;

  }

  goHome(){
    var home_urls = this.page_history.filter(x => {return x.indexOf('/home') > -1});
    if (home_urls.length == 0) this.router.navigate(['/home']);
    else {
      var home_url = home_urls[home_urls.length - 1];

      if (home_url.indexOf('?') > -1) {

      var queryString = home_url.slice(home_url.indexOf('?'));
        
        var urlParams =  this.getQueryParams(queryString);
        var idx = home_url.indexOf('?');
        this.router.navigate([home_url.slice(0,idx)],{ queryParams: urlParams });
      }
      else this.router.navigate(['/home']); 
    }
  }

  saveRedirectUrl(url:string){
    this.redirect_after_login_url = url;
  }

  getRedirectUrl(){
    return this.redirect_after_login_url;
  }

  requestLoginModal(){
    this._showLoginModal.next(true);
  }


}
