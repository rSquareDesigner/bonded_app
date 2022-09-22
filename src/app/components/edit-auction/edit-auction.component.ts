import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { UserService } from '../../services/user.service';
import {Router, ActivatedRoute} from "@angular/router";
declare var $: any;

@Component({
  selector: 'app-edit-auction',
  templateUrl: './edit-auction.component.html',
  styleUrls: ['./edit-auction.component.scss']
})
export class EditAuctionComponent implements OnInit {

  user: any;
  auction_id: Number = 0;
  itemx: any = {};
  show_image_upload: boolean = false;

  has_changed: boolean = false;
  uploaded_image: boolean = false;
  
  //date selector
  selected_date: any = undefined;
  show_calendar_popup: boolean = false;

  //Subscriptions
  userServiceSubscription: Subscription = this.userService._getUser.subscribe((currentUser) => {
    this.user = currentUser;
  });

  constructor(
    public userService: UserService,
    private router: Router,
    private route: ActivatedRoute,
  ) { 
    this.route.params.subscribe( params => {
      this.auction_id = params['auction_id']; 
    });
  }

  ngOnInit(): void {

    //existing auction
    if (this.auction_id > 0){
      //load auction
    }
    
  }

  evalEdit(item:any){

  }

  deleteImage(index:number){

  }

  dateSelected(){
    console.log('date selected!', this.selected_date);
    if (this.selected_date) this.show_calendar_popup = false;
  }

  uploadImage(){
    $('#addImageModal').modal('show');
   }

  photoSelected(image: Event){
    this.uploaded_image = true;
    this.has_changed = true;
    if (!this.itemx.images_urls) {
      this.itemx.images_urls = [];
    }
    this.itemx.images_urls.push(image);
    //this.itemx.image = this.images_urls[0];
    this.show_image_upload = false;
    $('#addImageModal').modal('hide');

  }

  uploadCancelled(){

  }

  closeModal(name:string){
    $('#' + name).modal('hide');
  }

}
