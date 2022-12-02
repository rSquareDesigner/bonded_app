import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { UserService } from '../../services/user.service';
import { TablesService } from './../../services/tables.service';
import {Router, ActivatedRoute} from "@angular/router";
import { CommonService } from 'src/app/services/common.service';
import { MyblobService } from '../../services/myblob.service';
declare var $: any;

@Component({
  selector: 'app-listing-details',
  templateUrl: './listing-details.component.html',
  styleUrls: ['./listing-details.component.scss']
})
export class ListingDetailsComponent implements OnInit {

  listing_id:number = -1;
  listing: any = {};

  constructor(
    public userService: UserService,
    public commonService: CommonService,
    public tablesService: TablesService,
    public myBlobService: MyblobService,
    private router: Router,
    private route: ActivatedRoute,
  ) { 
    this.route.params.subscribe( params => {
      this.listing_id = params['listing_id']; 
    });
  }

  ngOnInit(): void {
    window.scrollTo(0,0);
    if (this.listing_id) this.loadListing();
  }

  loadListing(){

    let dollarUSLocale = Intl.NumberFormat('en-US');

    this.tablesService.GetFiltered('auctions','id', this.listing_id).subscribe((data:any) => {
      this.listing = data[0];
      
      this.listing.current_bid_formatted = dollarUSLocale.format(this.listing.current_bid);
      this.listing.buy_now_price_formatted = dollarUSLocale.format(this.listing.buy_now_price);
      
      //console.log('this.listing', this.listing);
    })
  }

  goto(route:any){
    this.router.navigate([route]);
  }

}
