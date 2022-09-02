import { Component, OnInit, Renderer2 } from '@angular/core';
import { UserService } from './../../services/user.service';
import { MailingService } from './../../services/mailing.service';
import { NavigationService } from './../../services/navigation.service';
import { TablesService } from './../../services/tables.service';
import { ChatsService } from './../../services/chats.service';
import { Router, NavigationEnd } from '@angular/router';
import { forkJoin, BehaviorSubject } from 'rxjs';
declare var $: any;

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  show_top_navbar: boolean = false;
  show_bottom_navbar: boolean = false;

  search_input: string = '';

  name: string = '';
  email: string = '';
  password: string = '';
  user: any;
  showAlert: boolean = false;
  alertMsg: string = '';
  userx: any;

  login_modal_page: number = 1;

  user_menu_visible: boolean = false;
  user_menu_click: boolean = false;

  search_menu_visible: boolean = false;
  search_menu_click: boolean = false;

  forgot_password_active: boolean = false;
  formSubmitted: boolean = false;

  //invalid
  invalid_name: string = '';
  invalid_email: string = '';
  invalid_password: string = '';

  notifications_interval:any;
  user_has_notifications: boolean = false;

  search_suggestions: string[] = [];

  slide_menu_out: boolean = false;
  forgot_password_request: boolean = false;

  constructor(
    public userService: UserService,
    public mailingService: MailingService,
    public navigationService: NavigationService,
    public tablesService: TablesService,
    public chatsService: ChatsService,
    private router: Router,
    private renderer: Renderer2
  ) {

    this.renderer.listen('window', 'click', (e: Event) => {
      setTimeout(() => {
        if (this.user_menu_click == false) this.user_menu_visible = false;
        if (this.search_menu_click == false) this.search_menu_visible = false;
      },100);
      
    });

   }

  ngOnInit() {

    //Notify google analytics of route changes
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {

        this.getFiltersFromUrl();

      }

    });

    this.navigationService._showLoginModal.subscribe((showModal) => {
      if (showModal == true) this.showLogin(1);
    });

    //this.getFiltersFromUrl();

    this.showAlert = false;
    this.userService._getUser.subscribe((currentUser) => {
      this.user = currentUser;
      
      if (this.user) {
        this.lookForNotification();
      }

    });
    this.userService._loginFailed.subscribe((error) => {
      //this.spinner.hide();
      if (error) {
        this.showAlert = true;
        this.userx = error.user;
        if (error.text.indexOf('not found') > -1) this.invalid_email = error.text;
        else {
          if (this.forgot_password_request == true) this.forgotPassword();
          else this.invalid_password = error.text;
        }
        //else this.forgotPassword();
        
      }
    });

  }

  ngOnDestroy(): void {
    if (this.notifications_interval)  clearInterval(this.notifications_interval);
  }

  showLogin(page:number){
    this.showAlert = false;
    this.login_modal_page = page ? page:1;
    this.clearLoginAlerts();
    $('#loginModal').modal('show');
  }

  loginUser(){
    console.log('loginUser');
    if (!this.email || this.email.length == 0) this.invalid_email = 'Please enter your email';
    else if (!this.password || this.password.length == 0) this.invalid_password = 'Please enter your password';
    else {
      //this.spinner.show();
      this.userService.loginUser(this.email,this.password);
    }
  }

  logout(){
    this.userService.logoutUser();
  }

  goto(route:string){
    $(".navbar-collapse").collapse('hide');
    this.user_menu_visible = false;

    if (!this.user){
      if (route == 'saved-items' || route == 'inbox' || route == 'my-listings' || route == 'account'){
        $('#loginModal').modal('show');
        return;
      }
    }

    this.router.navigate([route]);
  }

  goHome(){
    this.navigationService.goHome();
  }

  signUpUser(){
    
    if (!this.name || this.name.length == 0) this.invalid_name = 'Please enter a valid name';
    
    if (!this.email || this.email.length == 0) this.invalid_email = 'Please enter a valid email';
    else {
      var emailPatternMatch = this.email.match(/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$/);
      if (!emailPatternMatch) this.invalid_email = 'Please enter a valid email';
    }
    
    if (!this.password || this.password.length == 0) this.invalid_password = 'Please enter a password';
    else if (this.password.length < 8) this.invalid_password = 'Password must be at least 8 characters';

    if (this.invalid_name || this.invalid_email || this.invalid_password) return;

    this.tablesService.GetFiltered('users','email',this.email.toLowerCase()).subscribe((data:any) => {
      var user_object = data[0];
      if (user_object)  this.invalid_email = 'Email already exists';
      else this.userService.signUpUser(this.name, this.email, this.password);
    })

    //this.userService.signUpUser(this.name, this.email, this.password);
    
  }

  clearLoginAlerts(){
    this.invalid_name = '';
    this.invalid_email = '';
    this.invalid_password = '';
  }

  toggleUserMenu(){
    if (this.user_menu_visible != true) this.user_menu_visible = true;
    else this.user_menu_visible = false;

    this.userMenuClick();
  }

  userMenuClick(){
    this.user_menu_click = true;
    setTimeout(()=>{
      this.user_menu_click = false;
    },200);
  }

  toggleSearchMenu(){
    if (this.search_menu_visible != true) this.search_menu_visible = true;
    else this.search_menu_visible = false;

    this.advancedSearchMenuClick();
  }

  advancedSearchMenuClick(){
    this.search_menu_click = true;
    setTimeout(()=>{
      this.search_menu_click = false;
    },200);
  }

  
  forgotPassword(){
    //if user already known
    this.forgot_password_request = true;
    if (this.userx){
      $('#loginModal').modal('hide');
      this.mailingService.sendResetPasswordLink(this.userx.name, this.userx.email,this.userx.id);
      $('#emailSentModal').modal('show');
      this.forgot_password_request = false;
    }
    //verify email exists
    else if (this.email){
      this.userService.getByEmail(this.email);
    }
    else {
      this.showAlert = true;
      this.alertMsg = 'Please enter your email';
    }
  }


  redirectTo(route:string[],params:any){
    this.router.navigateByUrl('/', {skipLocationChange: true}).then(()=>
    this.router.navigate(route, params));
 }

  goSearch(){

    //this.number_of_filters = 0;
    var queryParams = {};

    this.search_menu_visible = false;

    this.redirectTo(['home'],{ queryParams: queryParams});

  }

  getFiltersFromUrl(){
    
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    
    var login_required = urlParams.get('login') == 'true';
    if (login_required == true){
      this.showLogin(2);
      return;
    }

  }

  clearFilters(){
    this.search_menu_visible = false;
    this.redirectTo(['home'],{ queryParams: {}});
  }

  lookForNotification(){
    this.getNotifications();
    /*
    this.notifications_interval = setInterval(() => {
      //check if there are unread messages
      if (this.user) this.getNotifications();
    },20000);
    */
  }

  getNotifications(){
    forkJoin([
      //this.chatsService.GetChatsByUser(this.user.id),
      //this.tablesService.GetFiltered('notifications','user_id', this.user.id)
    ]).subscribe((data: any) => {
      var chats = data[0];
      var notifications = data[1];

      var user_has_chat_notifications = chats.filter((x:any) => {
        return this.user.id == x.user_id ? (x.has_unread_messages == true):(x.has_unread_messages2 == true);
      }).length > 0;

      var user_has_notifications = notifications.filter((x:any) => {
        return x.has_been_read != true;
      }).length > 0;

      this.user_has_notifications = user_has_chat_notifications || user_has_notifications; 
    })
    //this.chatsService.GetChatsByUser(this.user.id).subscribe((data:any) => {
      
      
    //});
  }

  getSuggestions(){

    if (!this.search_input) {
      this.clearQuery();
      return
    }
    
    var types: any[] = [];
    
    var query = this.search_input.toLowerCase();
    this.search_suggestions = types.filter(x => {return x.indexOf(query) > -1});
  }

  searchSuggestion(selection:string){

    this.search_input = selection;
    
    var queryParams = {};

    this.search_suggestions = [];

    this.redirectTo(['home'],{ queryParams: queryParams});
  }

  searchQuery(){
    var queryParams:any = {};
    queryParams.query = this.search_input;
    this.search_suggestions = [];
    
    this.redirectTo(['home'],{ queryParams: queryParams});

  }

  clearQuery(){
    this.search_suggestions = [];
    this.search_input = '';
    var queryParams = {};
    this.redirectTo(['home'],{ queryParams: queryParams });
  }

  closeMenu(){
    this.slide_menu_out = true;
    setTimeout(() => {
      this.slide_menu_out  = false;
      this.search_menu_visible = false;
    },400);
  }

  localShapers(){
    var queryParams = {};
    this.redirectTo(['local-shapers'],{ queryParams: queryParams});
  }

}
