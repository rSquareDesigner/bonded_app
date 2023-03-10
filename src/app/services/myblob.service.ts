import { Injectable } from '@angular/core';
//import { BlobService, UploadConfig, UploadParams,  } from 'angular-azure-blob-service';
import { BlobServiceClient } from '@azure/storage-blob';
//const { BlobServiceClient } = require('@azure/storage-blob');
//import { BlockBlobClient } from "@azure/storage-blob";
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { retry, catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { KrakenService } from './kraken.service';


@Injectable({
  providedIn: 'root'
})
export class MyblobService {

  blobParams: any;
  blobConfig: any;
  sas: string;

  container_name: string = 'auctions';

  blobServiceClient: any;

  public _imageUploaded = new BehaviorSubject<boolean>(false);
  public _profileImageUploaded = new BehaviorSubject<boolean>(false);

  constructor(
    //public blobService: BlobService,
    //public blobServiceClient: BlobServiceClient,
    public krakenService: KrakenService,
    private http: HttpClient,
  ) {

    this.sas = '?sv=2021-06-08&ss=bf&srt=c&sp=rwdlaciytfx&se=2027-10-01T05:19:52Z&st=2022-09-30T21:19:52Z&spr=https,http&sig=xqsYMTckUTMv5nPDrOiv2QGoO1ccPQiKBtrqA1%2FTMQ0%3D';
    /*
    this.blobParams = {
      sas: '?sv=2020-08-04&ss=bfqt&srt=co&sp=rwdlacutfx&se=2026-10-03T00:11:03Z&st=2022-03-18T16:11:03Z&spr=https,http&sig=r0gMYnDTESvmyzf%2Fq71H7cBENcTitoE8e7NhafRbYNo%3D',
      storageAccount: 'seelbach',
      containerName: 'auctions'
    };
    */
    this.blobServiceClient = new BlobServiceClient('https://seelbach.blob.core.windows.net' + this.sas);

  }

  httpOptions = {
    headers: new HttpHeaders({
      //'Accepts': 'application/json',
      //'Content-Type': 'application/json'
    })
  }

  dataURItoBlob(dataURI:any) {
    // convert base64 to raw binary data held in a string
    // doesn't handle URLEncoded DataURIs - see SO answer #6850276 for code that does this
    var byteString = atob(dataURI.split(',')[1]);

    // separate out the mime component
    var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0]

    // write the bytes of the string to an ArrayBuffer
    var ab = new ArrayBuffer(byteString.length);
    var ia = new Uint8Array(ab);
    for (var i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }

    // write the ArrayBuffer to a blob, and you're done
    var bb = new Blob([ab]);
    return bb;
  }


  uploadBlob(data:any, filename:any) {
    //console.log('upload new blob');
    var file = this.dataURItoBlob(data);
    if (file !== null) {

      // Create a unique name for the blob
      const blobName = filename;
      const containerClient = this.blobServiceClient.getContainerClient('auctions');

      // Get a block blob client
      const blockBlobClient = containerClient.getBlockBlobClient(blobName);

      // Upload data to the blob
      blockBlobClient.upload(file, 1024 * 64).then((result: any) => {
        this._imageUploaded.next(true);
        //optimize image for thumbnail width 150px
        this.krakenService.optimizeImage(filename, 'auctions', 300).subscribe(data => { });
        //optimize image for website width 800 px
        //setTimeout(() => {
        this.krakenService.optimizeImage(filename, 'auctions', 800).subscribe(data => { });
        //},1000);
      });
    }

  }

  uploadProfileImageBlob(data:any, filename:any) {
    var file = this.dataURItoBlob(data);
    if (file !== null) {
      // Create a unique name for the blob
      const blobName = filename;
      const containerClient = this.blobServiceClient.getContainerClient('users');

      // Get a block blob client
      const blockBlobClient = containerClient.getBlockBlobClient(blobName);

      // Upload data to the blob
      blockBlobClient.upload(file, 1024 * 64).then((result: any) => {
        this._profileImageUploaded.next(true);
        //optimize image for thumbnail width 150px
        this.krakenService.optimizeImage(filename, 'users', 150).subscribe(data => { });
      });
    }
  }

  deleteBlob(filename:any): Observable<any> {
    return this.http.delete<any>(filename + this.sas, this.httpOptions).pipe(
      retry(1),
      catchError(this.errorHandl),
    )
  }

  getFiles(item_id:number): Observable<any> {
    return this.http.get<any>( environment.baseurl + '/blob/getFiles/' + item_id, this.httpOptions).pipe(
      retry(1),
      catchError(this.errorHandl),
    )
  }

  setContainer(containerName:string){
    this.container_name = containerName;
  }

  // Error handling
  errorHandl(error:any) {
    let errorMessage = '';
    if(error.error instanceof ErrorEvent) {
      // Get client-side error
      errorMessage = error.error.message;
    } else {
      // Get server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    //console.log(errorMessage);
    return throwError(errorMessage);
 }
}
