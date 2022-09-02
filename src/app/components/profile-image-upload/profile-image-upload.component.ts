import { Component, OnChanges,  EventEmitter, Input, Output } from '@angular/core';
import 'hammerjs';
import { ImageCroppedEvent } from 'ngx-image-cropper';

@Component({
  selector: 'app-profile-image-upload',
  templateUrl: './profile-image-upload.component.html',
  styleUrls: ['./profile-image-upload.component.scss']
})
export class ProfileImageUploadComponent implements OnChanges {


  @Input() previewUrl: any;
  @Input() ratio: any;
  @Input() shape: string;
  
  @Output() imageLoadedEvent = new EventEmitter();
  @Output() cropperActiveEvent = new EventEmitter();

  imageChangedEvent: any;
  croppedImage: any;
  previewUrlo: any;
  

  constructor() { }

  ngOnChanges() {
    this.previewUrlo = this.previewUrl;
  }

  fileChangeEvent(event: any): void {
    console.log('fileChangedEvent');
    this.imageChangedEvent = event;
    this.cropperActiveEvent.emit(true);
  }

  imageCropped(event: ImageCroppedEvent) {
    //console.log('imageCropped');
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
    this.previewUrl = this.croppedImage;
    this.imageChangedEvent = undefined;
    this.imageLoadedEvent.emit(this.previewUrl);
    this.cropperActiveEvent.emit(false);
  }

}
