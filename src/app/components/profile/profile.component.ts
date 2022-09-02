import { Component, OnInit } from '@angular/core';
import {Router, ActivatedRoute} from "@angular/router";
import { TablesService } from '../../services/tables.service';
import { CommonService } from '../../services/common.service';
import { NavigationService } from '../../services/navigation.service';


@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  profile_id: number;
  profile: any;

  listings: any[];
  reviews: any;

  number_bought: number;
  number_sold: number;

  constructor(
    public tablesService: TablesService,
    public commonService: CommonService,
    public navigationService: NavigationService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.route.params.subscribe( params => {
      this.profile_id = params['id']; 
    });
   }

  ngOnInit() {
    this.loadProfile();
    this.getNumberSoldAndBought();
  }

  loadProfile() {
    this.tablesService.GetFiltered('users', 'id', this.profile_id).subscribe((data: any) => {
      this.profile = data[0];
      
      if (this.profile) {

        if (this.profile.sign_up_date) this.profile.sign_up_date_humanized = this.commonService.getDate(this.profile.sign_up_date);

        //load listings
        this.tablesService.GetFiltered('listings', 'user_id', this.profile.id).subscribe((res: any) => {
          this.listings = res;
        });

        if (this.profile.sign_up_date) this.profile.sign_up_date_humanized = this.commonService.getDate(this.profile.sign_up_date);

        this.loadReviews();

      }
    })
  }

  getNumberSoldAndBought(){
    this.tablesService.GetFiltered('transactions','buyer_user_id', this.profile_id).subscribe((data:any) => {
      this.number_bought = data.length;
    });

    this.tablesService.GetFiltered('transactions','seller_user_id', this.profile_id).subscribe((data:any) => {
      this.number_sold = data.length;
    });
  }

  gotoItem(item){
    this.router.navigate(['item-details/'+item.id]); 
  }

  goBack(){
    this.navigationService.goBack();
  }

  loadReviews(){
    this.tablesService.GetFiltered('reviews','recipient_user_id', this.profile_id).subscribe((data:any) => {
      //console.log('reviews', data);
      this.reviews = this.commonService.computeReviews(data);
    });
  }

}
