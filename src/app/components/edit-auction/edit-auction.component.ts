import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { UserService } from '../../services/user.service';
import { TablesService } from './../../services/tables.service';
import {Router, ActivatedRoute} from "@angular/router";
import { CommonService } from 'src/app/services/common.service';
import { MyblobService } from '../../services/myblob.service';
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
    public commonService: CommonService,
    public tablesService: TablesService,
    public myBlobService: MyblobService,
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

  dateSelected(){
    if (this.selected_date) this.show_calendar_popup = false;
  }

  uploadImage(){
    $('#addImageModal').modal('show');
   }

  photoSelected(image: Event){

    this.uploaded_image = true;
    this.has_changed = true;
    if (!this.itemx.images_urls) this.itemx.images_urls = [];
    
    this.itemx.images_urls.push(image);
    
    this.show_image_upload = false;
    $('#addImageModal').modal('hide');

  }

  uploadCancelled(){

  }

  closeModal(name:string){
    $('#' + name).modal('hide');
  }

  saveListing(){
    
    var listing_object = {
      id: this.itemx.id ? this.itemx.id: null,
      category: this.itemx.category,
      description: this.itemx.description,
      end_time: Date.parse(this.selected_date),
      price: this.itemx.price,
      timestamp: Date.now(),
      static_page_needs_update: true
    }

    if (!this.itemx.id){
      this.tablesService.AddItem('auctions',listing_object).subscribe((data:any) => {
        listing_object.id = data.id;
        
        this.processImages(listing_object.id);
        this.router.navigate(['auctions']);
        
      });
    }

    else {
      this.tablesService.UpdateItem('auctions',listing_object).subscribe((data:any) => {
        this.processImages(this.itemx.id);
        
        Object.assign(this.itemx, listing_object);
        this.router.navigate(['auctions']);
      });
    }
  }

  processImages(listing_id:number){
    
    var images_filenames: string[] = [];
    //this.myBlobService.setContainer('auctions');
    this.itemx.images_urls.forEach((x:any,i:number) => {
      //if image is not url, needs to be uploaded
      if (x.indexOf('data:image') > -1){
        var image_filename = this.commonService.generateImageName() + '.jpeg';
        images_filenames.push(image_filename);
        this.myBlobService.uploadBlob( x, listing_id + '/' + image_filename);
      }
      else {
        var filename = x.replace('https://seelbach.blob.core.windows.net/auctions/' + listing_id + '/','');
        images_filenames.push(filename.trim());
      }
    });

    //update images on listing
    var listing_object = {
      id: listing_id,
      images: JSON.stringify(images_filenames)
    }

    this.tablesService.UpdateItem('auctions',listing_object).subscribe();

  }

  deleteImage(index:number){
    this.itemx.images_urls.splice(index,1);
  }

  confirmDelete(){
    //console.log('this.itemx_delete',this.itemx_delete);
    $('#confirmDeleteModal').modal('show');
  }

  deleteAuction(){

    this.myBlobService.getFiles(this.itemx.id).subscribe((data:any) => {
      var images_blobs = data;
      //console.log('files', data);
      images_blobs.forEach( (x:any) => {
        this.myBlobService.deleteBlob('https://seelbach.blob.core.windows.net/listings/' + x);
      });
    });

    this.tablesService.DeleteItem('auctions',this.itemx.id).subscribe((data:any) => {
      this.router.navigate(['auctions']);
    });
    
  }

}
