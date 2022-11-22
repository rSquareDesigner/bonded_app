import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-recently-viewed',
  templateUrl: './recently-viewed.component.html',
  styleUrls: ['./recently-viewed.component.scss']
})
export class RecentlyViewedComponent implements OnInit {

  recently_viewed_auctions: any[];

  constructor() { }

  ngOnInit(): void {
    this.loadRecentlyViewedAuctions();
  }

  loadRecentlyViewedAuctions(){
    this.recently_viewed_auctions = [
      {
        id:0,
        title: 'Auction 1',
        image: 'https://images.unsplash.com/photo-1627125288918-35254117cf92?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1471&q=80',
        description: 'Lorem ipsum dolor sit amet. Lorem, ipsum dolor.'
      },
      {
        id:1,
        title: 'Auction 2',
        image: 'https://images.unsplash.com/photo-1627125288918-35254117cf92?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1471&q=80',
        description: 'Lorem ipsum dolor sit amet. Lorem, ipsum dolor.'
      },
      {
        id:2,
        title: 'Auction 3',
        image: 'https://images.unsplash.com/photo-1627125288918-35254117cf92?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1471&q=80',
        description: 'Lorem ipsum dolor sit amet. Lorem, ipsum dolor.'
      },
      {
        id:3,
        title: 'Auction 4',
        image: 'https://images.unsplash.com/photo-1627125288918-35254117cf92?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1471&q=80',
        description: 'Lorem ipsum dolor sit amet. Lorem, ipsum dolor.'
      },
      {
        id:4,
        title: 'Auction 5',
        image: 'https://images.unsplash.com/photo-1627125288918-35254117cf92?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1471&q=80',
        description: 'Lorem ipsum dolor sit amet. Lorem, ipsum dolor.'
      },
      {
        id:5,
        title: 'Auction 6',
        image: 'https://images.unsplash.com/photo-1627125288918-35254117cf92?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1471&q=80',
        description: 'Lorem ipsum dolor sit amet. Lorem, ipsum dolor.'
      }
    ];
  }

}
