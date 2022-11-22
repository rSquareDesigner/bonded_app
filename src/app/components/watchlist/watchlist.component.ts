import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-watchlist',
  templateUrl: './watchlist.component.html',
  styleUrls: ['./watchlist.component.scss']
})
export class WatchlistComponent implements OnInit {

  watchlist_auctions: any[];

  constructor() { }

  ngOnInit(): void {
    this.loadWatchlistItems();
  }

  loadWatchlistItems(){
    this.watchlist_auctions = [
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
      }
    ];
  }

}
