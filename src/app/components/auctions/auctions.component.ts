import { Component, OnInit } from '@angular/core';
import {Router, ActivatedRoute} from "@angular/router";
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-auctions',
  templateUrl: './auctions.component.html',
  styleUrls: ['./auctions.component.scss']
})
export class AuctionsComponent implements OnInit {

  type:string = '';
  type_label: string = '';
  hero_image: string = '';

  auctions: any[] = [];

  slider_images: string[] = [];
  show_auction_options: boolean = false;

  constructor(
    public commonService: CommonService,
    private route: ActivatedRoute,
    private router: Router
    ) { 
    this.route.params.subscribe( params => {
      this.type = params['type']; 
    });
  }

  ngOnInit(): void {

    window.scrollTo(0,0);
    /*
    setTimeout(()=>{
      //document.getElementsByClassName("cc")[0].scrollTo(0,0);
      window.scrollTo(0,0);
    },0);
    */

    this.slider_images = [
      'https://images.unsplash.com/photo-1627125288918-35254117cf92?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1471&q=80',
      'https://images.unsplash.com/photo-1529264978834-666a0e99f884?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80',
      'https://images.unsplash.com/photo-1617146145481-e1e212ae68fd?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80',
      'https://images.unsplash.com/photo-1643087448435-72f70bd4ce88?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1631&q=80'
    ]

    if (this.type == 'malt-whiskey') {
      this.type_label = 'Malt Whiskey';
      this.hero_image = this.slider_images[0];
    }
    else if (this.type == 'other-spirits') {
      this.type_label = 'Other Spirits';
      this.hero_image = this.slider_images[1];
    }
    else if (this.type == 'rye') {
      this.type_label = 'Rye';
      this.hero_image = this.slider_images[2];
    }
    else if (this.type == 'bourbon') {
      this.type_label = 'Bourbon';
      this.hero_image = this.slider_images[3];
    }
    else if (this.type == 'open-market-auctions') {
      this.type_label = 'Open Market Auctions';
      this.hero_image = this.slider_images[0];
    }
    else if (this.type == 'premium-auctions') {
      this.type_label = 'Premium Auctions';
      this.hero_image = this.slider_images[1];
    }
    else {
      //go home
    }

    

    this.auctions = [
      {
        id:0,
        title: 'Auction 1',
        image: this.slider_images[0],
        description: 'Lorem ipsum dolor sit amet. Lorem, ipsum dolor.'
      },
      {
        id:1,
        title: 'Auction 2',
        image: this.slider_images[1],
        description: 'Lorem ipsum dolor sit amet. Lorem, ipsum dolor.'
      },
      {
        id:2,
        title: 'Auction 3',
        image: this.slider_images[2],
        description: 'Lorem ipsum dolor sit amet. Lorem, ipsum dolor.'
      },
      {
        id:3,
        title: 'Auction 4',
        image: this.slider_images[3],
        description: 'Lorem ipsum dolor sit amet. Lorem, ipsum dolor.'
      },
      {
        id:0,
        title: 'Auction 1',
        image: this.slider_images[0],
        description: 'Lorem ipsum dolor sit amet. Lorem, ipsum dolor.'
      },
      {
        id:1,
        title: 'Auction 2',
        image: this.slider_images[1],
        description: 'Lorem ipsum dolor sit amet. Lorem, ipsum dolor.'
      },
      {
        id:2,
        title: 'Auction 3',
        image: this.slider_images[2],
        description: 'Lorem ipsum dolor sit amet. Lorem, ipsum dolor.'
      },
      {
        id:3,
        title: 'Auction 4',
        image: this.slider_images[3],
        description: 'Lorem ipsum dolor sit amet. Lorem, ipsum dolor.'
      },
      {
        id:0,
        title: 'Auction 1',
        image: this.slider_images[0],
        description: 'Lorem ipsum dolor sit amet. Lorem, ipsum dolor.'
      },
      {
        id:1,
        title: 'Auction 2',
        image: this.slider_images[1],
        description: 'Lorem ipsum dolor sit amet. Lorem, ipsum dolor.'
      },
      {
        id:2,
        title: 'Auction 3',
        image: this.slider_images[2],
        description: 'Lorem ipsum dolor sit amet. Lorem, ipsum dolor.'
      },
      {
        id:3,
        title: 'Auction 4',
        image: this.slider_images[3],
        description: 'Lorem ipsum dolor sit amet. Lorem, ipsum dolor.'
      }
  
    ];

    this.auctions = this.commonService.shuffle(this.auctions);

  }

  goto(route:any){
    this.router.navigate([route]);
  }

  toogleShowAuctions(){
    if (this.show_auction_options != true) this.show_auction_options = true;
    else this.show_auction_options = false;
  }

  gotoAuctions(auctions_type:string){
    this.show_auction_options = false;
    this.redirectTo(['auctions/' + auctions_type],{});
  }

  redirectTo(route:any[],params:any){
    this.router.navigateByUrl('/no-page', {skipLocationChange: true}).then(()=>
    this.router.navigate(route, params));
 }



}
