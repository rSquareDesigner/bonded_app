import { Component, OnInit } from '@angular/core';
import {Router, ActivatedRoute} from "@angular/router";
import { Subscription } from 'rxjs';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss']
})
export class AccountComponent implements OnInit {

  user: any = {};

  top_selection: string = 'activity';
  bottom_selection: string = 'recently viewed';

  //Subscriptions
  userServiceSubscription: Subscription;


  constructor(
    private router: Router,
    private route: ActivatedRoute,
    public userService: UserService
  ) { }

  ngOnInit(): void {
    this.userServiceSubscription = this.userService._getUser.subscribe((currentUser) => {
      this.user = currentUser;

      //if (this.user) this.userService.updateLastActivity();

    });
  }

  goto(route:any){
    this.router.navigate([route]);
  }

}
