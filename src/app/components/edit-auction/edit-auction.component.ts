import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { UserService } from '../../services/user.service';
import { TablesService } from './../../services/tables.service';
import {Router, ActivatedRoute} from "@angular/router";
import { CommonService } from 'src/app/services/common.service';
import { MyblobService } from '../../services/myblob.service';
import { FormBuilder, FormGroup, Validators, ValidatorFn, AbstractControl, AsyncValidatorFn } from '@angular/forms';
declare var $: any;

@Component({
  selector: 'app-edit-auction',
  templateUrl: './edit-auction.component.html',
  styleUrls: ['./edit-auction.component.scss']
})
export class EditAuctionComponent implements OnInit {

  user: any;
  auction_id: Number = 0;
  auction: any = {};
  itemx: any = {};
  show_image_upload: boolean = false;

  has_changed: boolean = false;
  uploaded_image: boolean = false;

  //date selector
  selected_date: any = undefined;
  show_calendar_popup: boolean = false;
  categories: string[] = ['Rye','Bourbon','Malt Whiskey','Other Spirits'];
  duration_options: string[] = ['3 days','5 days','7 days'];
  schedule_options: string[] = ['Today','Tomorrow','3 days','5 days','7 days'];

  auction_form: FormGroup;
  form_submitted: boolean = false;

  mash_total: number = 0;

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
    public formBuilder: FormBuilder
  ) { 
    this.route.params.subscribe( params => {
      this.auction_id = params['auction_id']; 
    });
  }

  ngOnInit(): void {

    this.initializeForm();

    //existing auction
    if (this.auction_id > 0){
      //load auction
      this.tablesService.GetFiltered('auctions','id', this.auction_id).subscribe((data:any) => {
        this.auction = data[0];
        if (this.auction) this.loadForm();
      })
    }
    
  }

  initializeForm(){

    this.auction_form = this.formBuilder.group({
      title: ['',[Validators.required]],
      category: ['',[Validators.required]],
      distillery: ['',[Validators.required]],
      barrel_number: ['',[Validators.required]],
      internal_spirit: ['',[Validators.required]],
      last_fill_date: ['',[Validators.required]],
      total_age_of_spirits: ['',[Validators.required]],
      lot_id: ['',[Validators.required]],
      description: ['',[Validators.required]],
      starting_bid: ['',[Validators.required]],
      auction_duration: ['',[Validators.required]],
      schedule: ['',[Validators.required]],
      allow_offers: ['',[Validators.required]],
      reserve_price: ['',[Validators.required]],
      buy_now_price: ['',[Validators.required]],
      mash_corn_pct: ['',[Validators.required]],
      mash_wheat_pct: ['',[Validators.required]],
      mash_rye_pct: ['',[Validators.required]],
      mash_malt_pct: ['',[Validators.required]],
      
    });

    this.form_submitted = false;
  }

  loadForm(){
    
      this.auction_form.setValue({
        title:    this.auction.title,
        category: this.auction.category,
        distillery: this.auction.distillery,
        barrel_number: this.auction.barrel_number,
        internal_spirit: this.auction.internal_spirit,
        last_fill_date: this.auction.last_fill_date,
        total_age_of_spirits: this.auction.total_age_of_spirits,
        lot_id: this.auction.lot_id,
        description: this.auction.description,
        starting_bid: this.auction.starting_bid,
        auction_duration: this.auction.auction_duration,
        allow_offers: this.auction.allow_offers,
        schedule: this.auction.schedule,
        reserve_price: this.auction.reserve_price,
        buy_now_price: this.auction.buy_now_price,
        mash_corn_pct: this.auction.mash_corn_pct,
        mash_wheat_pct: this.auction.mash_wheat_pct,
        mash_rye_pct: this.auction.mash_rye_pct,
        mash_malt_pct: this.auction.mash_malt_pct
      });
    
  }

  evalEdit(item:any){

    console.log('this.auction_form', this.auction_form);

    this.mash_total = 
    (this.auction_form.value.mash_corn_pct ? (isNaN(this.auction_form.value.mash_corn_pct) == true ? 0:Number(this.auction_form.value.mash_corn_pct)):0) +
    (this.auction_form.value.mash_wheat_pct ? (isNaN(this.auction_form.value.mash_wheat_pct) == true ? 0:Number(this.auction_form.value.mash_wheat_pct)):0) +
    (this.auction_form.value.mash_rye_pct ? (isNaN(this.auction_form.value.mash_rye_pct) == true ? 0:Number(this.auction_form.value.mash_rye_pct)):0) + 
    (this.auction_form.value.mash_malt_pct ? (isNaN(this.auction_form.value.mash_malt_pct) == true ? 0:Number(this.auction_form.value.mash_malt_pct)):0);

  }

  dateSelected(){
    if (this.itemx.last_fill_date_raw) {
      console.log('this.itemx.last_fill_date',this.itemx.last_fill_date_raw);
      this.show_calendar_popup = false;
      this.itemx.last_fill_date = JSON.stringify(this.itemx.last_fill_date_raw).slice(1,11);
    }
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

  saveAuction({ value, valid }: { value: any, valid: boolean }) {
    this.form_submitted = true;
    console.log(value, valid);
    if (valid){
      //this.userService.signUpUser(value);
      var listing_object = value;
      listing_object['timestmp'] = Date.now();
      listing_object['static_page_needs_update'] = true;

      if (this.auction_id == 0){
        this.tablesService.AddItem('auctions',listing_object).subscribe((data:any) => {
          listing_object.id = data.id;
          
          //this.processImages(listing_object.id);
          this.router.navigate(['']);
          
        });
      }
      else {
        this.tablesService.UpdateItem('auctions',listing_object).subscribe((data:any) => {
          //this.processImages(this.itemx.id);
          
          Object.assign(this.itemx, listing_object);
          this.router.navigate(['']);
        });
      }
    }
  }

  /*
  saveListing(){
    
    var listing_object = {
      id: this.itemx.id ? this.itemx.id: null,
      title: this.itemx.title,
      category: this.itemx.category,
      distillery: this.itemx.distillery,
      barrel_number: this.itemx.barrel_number,
      internal_spirit: this.itemx.internal_spirit,
      last_fill_date: this.itemx.last_fill_date,
      total_age_of_spirits: this.itemx.total_age_of_spirits,
      lot_id: this.itemx.lot_id,
      description: this.itemx.description,
      starting_bid: this.itemx.starting_bid,
      auction_duration: this.itemx.auction_duration,
      allow_offers: this.itemx.allow_offers,
      reserve_price: this.itemx.reserve_price,
      buy_now_price: this.itemx.buy_now_price,
      //end_time: Date.parse(this.selected_date),
      //price: this.itemx.price,
      timestamp: Date.now(),
      static_page_needs_update: true
    }

    if (!this.itemx.id){
      this.tablesService.AddItem('auctions',listing_object).subscribe((data:any) => {
        listing_object.id = data.id;
        
        //this.processImages(listing_object.id);
        this.router.navigate(['']);
        
      });
    }

    else {
      this.tablesService.UpdateItem('auctions',listing_object).subscribe((data:any) => {
        //this.processImages(this.itemx.id);
        
        Object.assign(this.itemx, listing_object);
        this.router.navigate(['']);
      });
    }
  }
  */

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

  goto(route:any){
    this.router.navigate([route]);
  }

}
