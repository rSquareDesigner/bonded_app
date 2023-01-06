import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
declare var $: any;

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {

  view: string;
  shaper_id: number;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
  ) { 
    this.route.params.subscribe( params => {
      this.view = params['view'];
    });
  }

  ngOnInit() {

    if (!this.view) this.view = 'users';

    /*
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    
    this.view = urlParams.get('view');
    
    if (this.view == 'shaper-details'){
      this.shaper_id = Number(urlParams.get('id'));
    }

    if (!this.view) this.view = 'users';

    console.log('this.view', this.view);
    */
  }

  goHome(){
    $(".navbar-collapse").collapse('hide');
    
    this.router.navigate(['']);
  }

  goto(view:string){
    this.redirectTo(['admin/'+ view],{});
  }

  redirectTo(route:string[],params:any){
    this.router.navigateByUrl('/', {skipLocationChange: true}).then(()=>
    this.router.navigate(route, params));
 }

}
