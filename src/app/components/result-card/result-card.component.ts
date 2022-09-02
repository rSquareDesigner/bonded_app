import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-result-card',
  templateUrl: './result-card.component.html',
  styleUrls: ['./result-card.component.scss']
})
export class ResultCardComponent implements OnInit {

  
  @Input() listing: any;

  constructor(
    private router: Router,
  ) { }

  ngOnInit() {
    if (this.listing) this.unwrapImages();
  }

  unwrapImages(){
    //unwrap image
    if (this.listing.images) {
      
      this.listing.images_urls = JSON.parse(this.listing.images).map(n => {return 'https://surfgenie.blob.core.windows.net/listings/' + this.listing.id + '/' + n});
      if (this.listing.image_optimization_complete == true) this.listing.imagex = this.listing.images_urls[0].replace('.jpeg','_sm.jpeg');
      else this.listing.imagex = this.listing.images_urls[0];
    } 
  }

  gotoItem(item){
    var queryParams = {};
    this.redirectTo(['item-details/'+item.id], { queryParams: queryParams });
  }

  redirectTo(route,params){
    this.router.navigateByUrl('/', {skipLocationChange: true}).then(()=>
    this.router.navigate(route, params));
 }

}
