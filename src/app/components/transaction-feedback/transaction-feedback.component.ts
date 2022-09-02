import { Component, OnInit } from '@angular/core';
import {Router, ActivatedRoute} from "@angular/router";
import { TablesService } from '../../services/tables.service';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-transaction-feedback',
  templateUrl: './transaction-feedback.component.html',
  styleUrls: ['./transaction-feedback.component.scss']
})
export class TransactionFeedbackComponent implements OnInit {

  transaction_id: number;
  transaction: any;
  seller: any;
  user: any;

  page: number;

  overall_experience_stars: number = 1;

  item_as_described: boolean =false;
  on_time: boolean =false;
  good_communication: boolean =false;
  friendly: boolean =false;


  constructor(
    public tablesService: TablesService,
    public userService: UserService,
    private route: ActivatedRoute,
    private router: Router,
  ) { 
    this.route.params.subscribe( params => {
      this.transaction_id = params['transaction_id']; 
    });
  }

  ngOnInit() {

    this.userService._getUser.subscribe((currentUser) => {
      this.user = currentUser;
      if (!this.user) this.router.navigate(['home']); 
    });

    
    if (this.transaction_id){
      this.tablesService.GetFiltered('transactions','id',this.transaction_id).subscribe((data:any) => {
        this.transaction = data[0];

        //get seller profile
        this.tablesService.GetFiltered('users','id',this.transaction.seller_user_id).subscribe((res:any) => {
          this.seller = res[0];
        });

        //check that user has not already submitted this review
        this.tablesService.GetFiltered3('reviews','transaction_id', this.transaction_id, 'reviewer_user_id', this.user.id, 'recipient_user_id', this.transaction.seller_user_id).subscribe((res: any) => {
          var review = res[0];
          if (review) this.page = 2;
          else this.page = 1;
        });
      });
    }
  }

  toggle(field){
    if (field == 'item-as-described') {
      if (this.item_as_described != true) this.item_as_described = true;
      else this.item_as_described = false;
    }
    if (field == 'on-time') {
      if (this.on_time != true) this.on_time = true;
      else this.on_time = false;
    }
    if (field == 'friendly') {
      if (this.friendly != true) this.friendly = true;
      else this.friendly = false;
    }
    if (field == 'good-communication') {
      if (this.good_communication != true) this.good_communication = true;
      else this.good_communication = false;
    }
  }

  submitFeedback(){

    var review_object = {
      transaction_id: this.transaction_id,
      reviewer_user_id: this.user.id,
      recipient_user_id: this.seller.id,
      overall_experience: this.overall_experience_stars,
      was_friendly: this.friendly,
      good_communication: this.good_communication,
      item_as_described: this.item_as_described,
      was_on_time: this.on_time 
    }

    this.tablesService.AddItem('reviews', review_object).subscribe(() => {
      this.page = 2;
    });

  }

  gotoHome(){
    this.router.navigate(['home']); 
  }



}
