import { Component, OnChanges,  EventEmitter, Input, Output, ViewChild} from '@angular/core';
import 'hammerjs';
import { ImageCroppedEvent, ImageCropperComponent } from 'ngx-image-cropper';

@Component({
  selector: 'app-image-upload',
  templateUrl: './image-upload.component.html',
  styleUrls: ['./image-upload.component.scss']
})
export class ImageUploadComponent implements OnChanges {

  @Input() ratio: any;
  @Input() shape: string = '';
  
  @Output() imageLoadedEvent = new EventEmitter();
  @Output() imageCancelEvent = new EventEmitter();

  @ViewChild('cropper') imageCropper: ImageCropperComponent;
  

  imageChangedEvent: any;
  croppedImage: any;
  previewUrlo: any;
  previewUrl: any;

  image_width: number = 0;
  image_height: number = 0;

  image_uploaded: boolean = false;
  
  image_orientation_memory:number = 1;
  

  constructor() { }

  ngOnChanges() {
    this.previewUrlo = this.previewUrl;
  }

  fileChangeEvent(event: any): void {

    console.log('fileChangeEvent', event);
    this.imageChangedEvent = event;

    const reader = new FileReader();
    this.image_uploaded = true;
    

    
    reader.onload = function(e){
      console.log('bbbb');
      // convert image file to base64 string
      (<HTMLImageElement>document.getElementsByClassName('image_preview')[0]).src = reader.result ? reader.result.toString():'';

    };

    if (event) {
      console.log('aaaa');
      reader.readAsDataURL(event.target.files[0]);
      
      //get dimensions of original file
      var image = new Image();
      image.src = window.URL.createObjectURL(event.target.files[0]);
      console.log('image.src', image.src);
      image.onload = () => {
        console.log('cccc');
        this.image_width = image.width;
        this.image_height = image.height;
        setTimeout(() => {
          this.reDraw();
        },250);
      }
    }
    
   }

  imageCropped(event: ImageCroppedEvent) {
    console.log('imageCropped');
    this.croppedImage = event.base64;
    this.previewUrl = event.base64;
    //console.log('this.previewUrl',this.previewUrl);
  }

  imageLoaded() {
    // show cropper
  }
  
  cropperReady() {
    // cropper ready
  }
  
  loadImageFailed() {
    // show message
  }

  cancelImageOnAdd(){
    this.imageChangedEvent=undefined;
    this.previewUrl = this.previewUrlo;
    this.imageLoadedEvent.emit(this.previewUrl);
  }

  setImageOnAdd(){
    console.log('setImageOnAdd');
    var img = <HTMLImageElement>document.getElementsByClassName('image_preview')[0];


    //this.imageCropper.crop();
    //setTimeout(() => {
      //this.previewUrl = this.croppedImage;
      //this.imageChangedEvent=undefined;
      this.imageLoadedEvent.emit(img.src);
    //},100);
  }

  rotateImage(){
    this.rotate();
    this.image_orientation_memory++;
  }

  rotate() {

    var img = <HTMLImageElement>document.getElementsByClassName('image_preview')[0];

    var width = this.image_orientation_memory % 2 == 0 ? this.image_height : this.image_width;
    var height = this.image_orientation_memory % 2 == 0 ? this.image_width : this.image_height;
    var canvas = document.createElement('canvas');
    var ctx = canvas.getContext("2d");


    canvas.width = height;
    canvas.height = width;

    console.log('_srcOrientation', this.image_orientation_memory, canvas.width, canvas.height);
    //ctx.drawImage(img, 0, 0);
    if (ctx) {
      ctx.translate(canvas.width, 0);
      ctx.rotate(90 * (Math.PI / 180));
      //ctx.drawImage(img, 0, 0);
      ctx.drawImage(img, 0, 0, width, height);
    }



    img.src = canvas.toDataURL();

    this.imageChangedEvent = null;

  }

  reDraw() {

    //this function redraws the image to avoid rotation by mobile images taken directly from camera
    var img = <HTMLImageElement>document.getElementsByClassName('image_preview')[0];

    var width = this.image_width;
    var height = this.image_height;
    var canvas = document.createElement('canvas');
    var ctx = canvas.getContext("2d");

    console.log('ctx', ctx);


    canvas.width = width;
    canvas.height = height;

    //console.log('_srcOrientation', this.image_orientation_memory, canvas.width, canvas.height);
    //ctx.drawImage(img, 0, 0);
    //ctx.translate(canvas.width, 0);
    //ctx.rotate(90 * (Math.PI / 180));
    //ctx.drawImage(img, 0, 0);
    if (ctx) ctx.drawImage(img, 0, 0, width, height);



    img.src = canvas.toDataURL();

    this.imageChangedEvent = null;

  }

  cancelAddingImage(){
    this.imageCancelEvent.emit();
  }

}

