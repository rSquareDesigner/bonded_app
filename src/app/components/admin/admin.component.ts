import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

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
      this.shaper_id = params['shaper_id']; 
    });
  }

  ngOnInit() {

    if (this.shaper_id){
      this.view = 'shaper-details';
    }
    else if (!this.view) this.view = 'users';

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

  goHome(route){
    $(".navbar-collapse").collapse('hide');
    
    this.router.navigate([route]);
  }

  goto(view){
    this.redirectTo(['admin/'+ view],{});
  }

  redirectTo(route,params){
    this.router.navigateByUrl('/', {skipLocationChange: true}).then(()=>
    this.router.navigate(route, params));
 }

}
