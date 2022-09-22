import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonService } from './../../services/common.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  slider_interval:any;
  slider_index: number = 0;
  slider_images: string[] = [];
  slider_image: string = '';

  auctions: any[] = [];
  premium_auctions: any[] = [];
  trending_auctions: any[] = [];

  constructor(
    public commonService: CommonService,
    private router: Router,
  ) { }

  ngOnInit(): void {

    this.setHeroImagesSlider();
    this.getAuctions();
  }

  getAuctions(){

    this.auctions = [
      {
        id:0,
        title: 'Title 1',
        image: this.slider_images[0],
        price: '$20,000'
      },
      {
        id:1,
        title: 'Title 2',
        image: this.slider_images[1],
        price: '$17,500'
      },
      {
        id:2,
        title: 'Title 3',
        image: this.slider_images[2],
        price: '$2,000'
      },
      {
        id:3,
        title: 'Title 4',
        image: this.slider_images[3],
        price: '$60,000'
      },
      {
        id:4,
        title: 'Title 5',
        image: this.slider_images[0],
        price: '$7,000'
      },
      {
        id:5,
        title: 'Title 6',
        image: this.slider_images[1],
        price: '$12,000'
      }
    ];

    this.trending_auctions = this.commonService.shuffle(this.auctions);
    this.premium_auctions = this.commonService.shuffle(this.auctions);

  }

  setHeroImagesSlider(){

    this.slider_images = [
      'https://images.unsplash.com/photo-1627125288918-35254117cf92?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1471&q=80',
      'https://images.unsplash.com/photo-1529264978834-666a0e99f884?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80',
      'https://images.unsplash.com/photo-1617146145481-e1e212ae68fd?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80',
      'https://images.unsplash.com/photo-1643087448435-72f70bd4ce88?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1631&q=80'
    ]

    this.drawSlide();
  
   this.slider_interval = setInterval(() => {
    this.nextSlide();
   },4000) 
    
  }

  nextSlide(){
    this.slider_index++;
    if (this.slider_index > 3) this.slider_index = 0;
    this.drawSlide();
  }

  prevSlide(){
    this.slider_index--;
    if (this.slider_index < 0) this.slider_index = 3;
    this.drawSlide();
  }

  drawSlide(){
    this.slider_image = this.slider_images[this.slider_index];
  }

  goto(route_name:string){
    console.log('go to', route_name);
    this.router.navigate([route_name]); 
  }
}
