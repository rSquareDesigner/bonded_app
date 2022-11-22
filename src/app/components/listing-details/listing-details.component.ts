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
    if (this.listing_id) this.loadListing();
  }

  loadListing(){
    this.tablesService.GetFiltered('auctions','id', this.listing_id).subscribe((data:any) => {
      this.listing = data[0];
      console.log('this.listing', this.listing);
    })
  }

  goto(route:any){
    this.router.navigate([route]);
  }

}
