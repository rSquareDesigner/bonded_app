import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sub-menu',
  templateUrl: './sub-menu.component.html',
  styleUrls: ['./sub-menu.component.scss']
})
export class SubMenuComponent implements OnInit {

  @Input() color: string;
  show_auction_options: boolean = false;

  constructor(
    private router: Router,
  ) { }

  ngOnInit(): void {
  }

  gotoAuctions(auctions_type:string){
    this.show_auction_options = false;
    this.redirectTo(['auctions/' + auctions_type],{});
  }

  redirectTo(route:any[],params:any){
    this.router.navigateByUrl('/no-page', {skipLocationChange: true}).then(()=>
    this.router.navigate(route, params));
 }

 toogleShowAuctions(){
  if (this.show_auction_options != true) this.show_auction_options = true;
  else this.show_auction_options = false;
}

goto(route_name:string){
  this.router.navigate([route_name]); 
}

}
