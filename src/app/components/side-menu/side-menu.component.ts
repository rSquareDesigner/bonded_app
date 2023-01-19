import { Component, OnInit } from '@angular/core';
import { UserService } from './../../services/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-side-menu',
  templateUrl: './side-menu.component.html',
  styleUrls: ['./side-menu.component.scss']
})
export class SideMenuComponent implements OnInit {

  user: any;

  constructor(
    public userService: UserService,
    private router: Router,
  ) { }

  ngOnInit(): void {

    this.userService._getUser.subscribe((currentUser) => {
      this.user = currentUser;
    });

  }

  goto(route_name:string){
    console.log('go to', route_name);
    this.redirectTo([route_name],{}); 
  }

  redirectTo(route:string[],params:any){
    this.router.navigateByUrl('/no-page', {skipLocationChange: true}).then(()=>
    this.router.navigate(route, params));
 }

}
