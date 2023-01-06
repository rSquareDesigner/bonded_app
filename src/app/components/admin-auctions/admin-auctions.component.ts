import { Component, OnInit } from '@angular/core';
import { ApisService } from '../../services/apis.service';
import { MailingService } from '../../services/mailing.service';
import { TablesService } from '../../services/tables.service';
import { CommonService } from '../../services/common.service';
import { MyblobService } from '../../services/myblob.service';
import { UserService } from './../../services/user.service';
import { Router } from '@angular/router';
declare var $: any;

@Component({
  selector: 'app-admin-auctions',
  templateUrl: './admin-auctions.component.html',
  styleUrls: ['./admin-auctions.component.scss']
})
export class AdminAuctionsComponent implements OnInit {

  itemx: any;
  itemx_delete: any;

  user: any;

  listing_modal_page: number = 1;
  show_image_upload: boolean;
  images_urls: any[];
  listings: any[];

  formSubmitted: boolean;
  
  //warnings
  invalid_image: string;
  invalid_type: string;
  invalid_length: string;
  invalid_brand: string;
  invalid_condition: string;
  invalid_description: string;
  invalid_style: string;
  invalid_price: string;
  invalid_zipcode: string;

  constructor(
    public mailingService: MailingService,
    public tablesService: TablesService,
    public apisService: ApisService,
    public commonService: CommonService,
    public myBlobService: MyblobService,
    public userService: UserService,
    private router: Router
  ) { }

  ngOnInit() {

    this.userService._getUser.subscribe((currentUser) => {
      this.user = currentUser;
      if (this.user) this.getListings();
    });
  
  }

  getListings(){

    //console.log('getListings!');
    this.tablesService.GetAll('auctions').subscribe((data:any) => {
      this.listings = data;
      //console.log('this.listings', this.listings);
      //unwrap images
    });
  }

  
  deleteListing(){

    this.myBlobService.getFiles(this.itemx_delete.id).subscribe((data:any) => {
      var images_blobs = data;
      //console.log('files', data);
      images_blobs.forEach((x:string) => {
        this.myBlobService.deleteBlob('https://surfgenie.blob.core.windows.net/listings/' + x);
      });
    });

    this.tablesService.DeleteItem('auctions',this.itemx_delete.id).subscribe((data:any) => {
      $('#confirmDeleteModal').modal('hide');
      this.getListings();
    });
    
  }

  toggleSelection(field:string){
    if (this.itemx[field] != true) this.itemx[field] = true;
    else this.itemx[field] = false;
  }

  gotoListing(item:any){
    this.router.navigate(['item-details/' + item.id], {});
  }

  gotoUserProfile(item:any){
    this.router.navigate(['profile/' + item.user_id], {});
  }

  confirmDelete(item:any){
    this.itemx_delete = item;
    $('#confirmDeleteModal').modal('show');
  }

}
