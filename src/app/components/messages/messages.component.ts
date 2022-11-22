import { Component, OnDestroy, OnInit } from '@angular/core';
import {Router, ActivatedRoute} from "@angular/router";
import { TablesService } from '../../services/tables.service';
import { CommonService } from '../../services/common.service';
import { UserService } from '../../services/user.service';
import { KrakenService } from '../../services/kraken.service';
import { MailingService } from '../../services/mailing.service';
//import { TwilioService } from '../../services/twilio.service';
import { NavigationService } from '../../services/navigation.service';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.scss']
})
export class MessagesComponent implements OnInit, OnDestroy {

  chat_id: number;
  chat: any;
  listing: any;
  user: any;

  user_message: string | undefined;

  messages: any[] = [];
  messages_interval: any;

  constructor(
    public tablesService: TablesService,
    public commonService: CommonService,
    public userService: UserService,
    public krakenService: KrakenService,
    public mailingService: MailingService,
    //public twilioService: TwilioService,
    public navigationService: NavigationService,
    private route: ActivatedRoute,
    private router: Router
  ) { 
    this.route.params.subscribe( params => {
      this.chat_id = params['chat_id']; 
    });
  }

  ngOnInit() {

    this.userService._getUser.subscribe((currentUser) => {
      this.user = currentUser;
      if (this.user) {
        this.loadChat();
        this.loadMessages();

      
        this.messages_interval = setInterval(() => {
          this.loadMessages();
        }, 20000)
        
      }
      //if user not logged in, save url in redirectAfterLogIn in navigation service
      else{
        this.navigationService.saveRedirectUrl(this.router.url);
        this.router.navigate(['home'],{queryParams: { login:true }});
      }
    });

  }

  ngOnDestroy(): void {
    if (this.messages_interval) clearInterval(this.messages_interval);
  }

  loadMessages(){
    this.tablesService.GetFiltered('messages','chat_id', this.chat_id).subscribe((data:any) => {

      if (this.messages.length == data.length) return;

      this.messages = data.sort((a:any,b:any) => {return a.timestmp - b.timestmp});
      
      this.messages.forEach(x => {
        x.date_time = this.commonService.getDateTime(x.timestmp);
        if (x.status == 'unread' && x.user_id != this.user.id){
          
          x.status = 'read';
          //update message status
          var message_object = {
            id: x.id,
            status: 'read'
          };

          this.tablesService.UpdateItem('messages',message_object).subscribe();

        }
      });

      this.rollToBottom();
    })
  }

  loadChat(){
    this.tablesService.GetFiltered('chats','id', this.chat_id).subscribe((data:any) => {
      this.chat = data[0];
      
      if (this.chat) {
        //load item details
        this.tablesService.GetFiltered('listings', 'id', this.chat.listing_id).subscribe((res: any) => {
          this.listing = res[0];
          
          if (this.listing) {
            if (this.listing.images) {
              this.listing.images = JSON.parse(this.listing.images);
              this.listing.images_urls = this.listing.images.map((n:any) => {
                if (this.listing.image_optimization_complete == true)
                  return 'https://surfgenie.blob.core.windows.net/listings/' + this.listing.id + '/' + n.replace('.jpeg', '_sm.jpeg');
                else
                  return 'https://surfgenie.blob.core.windows.net/listings/' + this.listing.id + '/' + n;;
              });
              this.listing.image = 'https://surfgenie.blob.core.windows.net/listings/' + this.listing.id + '/' + this.listing.images[0].replace('.jpeg', '_lg.jpeg');
            }

            if (this.listing.image_optimization_complete == true)
              this.listing.image = 'https://surfgenie.blob.core.windows.net/listings/' + this.listing.id + '/' + this.listing.images[0].replace('.jpeg', '_lg.jpeg');
            else {
              this.listing.image = 'https://surfgenie.blob.core.windows.net/listings/' + this.listing.id + '/' + this.listing.images[0];
              this.krakenService.optimizeListingImages(this.listing.id).subscribe();
            }
          }

        });

        //get chat user image
        var user_id;
        if (this.chat.user_id == this.user.id) user_id = this.chat.user2_id;
        else if (this.chat.user2_id == this.user.id) user_id = this.chat.user_id;

        if (user_id){
          this.tablesService.GetFilteredX('users','id',user_id,'id,name,image,sign_up_date,number_of_reviews').subscribe((res:any) => {
            var user_record = res[0];
            if (user_record){
              this.chat.user_image = user_record.image;
              this.chat.user_name = user_record.name;
            }
            else {
              this.chat.user_image = '../../../assets/images/noimage.png';
              this.chat.user_name = 'User';
              this.chat.user_is_disabled = true;
            }
            
          });
        }

        //set chat has unread messages flag
        if (this.chat.has_unread_messages == true && this.chat.user_id == this.user.id) {
          if (this.messages.filter(x => { return x.status == 'unread' }).length == 0) {

            //update chat object
            var chat_object = {
              id: this.chat.id,
              has_unread_messages: false
            }

            this.tablesService.UpdateItem('chats', chat_object).subscribe();
          }
        }
        else if (this.chat.has_unread_messages2 == true && this.chat.user2_id == this.user.id) {
          if (this.messages.filter(x => { return x.status == 'unread' }).length == 0) {

            //update chat object
            var chat_object2 = {
              id: this.chat.id,
              has_unread_messages2: false
            }

            this.tablesService.UpdateItem('chats', chat_object2).subscribe();
          }
        }
      }
    })
  }

  sendMessage(){

    //ignore if message is blank
    if (!this.user_message || this.user_message.length == 0 || this.user_message.replace(/\s/g,'').length == 0) return;

    var message_object = {
      chat_id: this.chat.id,
      text: this.user_message,
      timestmp: Date.now(),
      status: 'unread',
      user_id: this.user.id,
      user_name: this.user.name,
      is_seller: this.listing.user_id == this.user.id
    }

    this.tablesService.AddItem('messages', message_object).subscribe(() => {
      this.loadMessages();
      this.user_message = undefined;
    });

    //update chat's last message
    var chat_object:any = {
      id: this.chat.id,
      last_message: this.user_message,
    }

    if (this.chat.user_id == this.user.id) chat_object['has_unread_messages2'] = true;
    else if (this.chat.user2_id == this.user.id) chat_object['has_unread_messages'] = true;

    this.tablesService.UpdateItem('chats',chat_object).subscribe();

    this.mailingService.messageNotification(
      this.chat.user_id == this.user.id ? this.chat.user2_id:this.chat.user_id,
      this.chat.id,
      this.user.name,
      this.user.image,
      this.user_message,
      this.listing.type + ', $' + this.listing.price,
      this.listing.image.replace('_lg.jpeg','_sm.jpeg'),
      this.listing.description);

      /*
    this.twilioService.messageNotification({
      user_id: this.chat.user_id == this.user.id ? this.chat.user2_id:this.chat.user_id,
      chat_id: this.chat.id
    });
    */

  }

  /*
  onContentChanged = () =>{
    //adjust height of messages container in case user input takes more than 1 row 
    var x = document.getElementById("msgc" + this.chatIdx);
    var y = document.getElementById("userinput" + this.chatIdx);

    if (x) x['style'].height = "calc(100vh - " + (255 + (y['offsetHeight'] - 40) - 1)  + "px)";
    var objDiv = document.getElementById("msgc" + this.chatIdx);
    if (objDiv) objDiv.scrollTop = objDiv.scrollHeight;

  }
  */

  rollToBottom(){
    setTimeout(() => {
      var objDiv = document.getElementById("messages_container");
      if (objDiv) objDiv.scrollTop = objDiv.scrollHeight;

      //this.onContentChanged();
    }, 200);
  }

  goto(routename:string){
    this.router.navigate([routename]); 
  }

  showImage(image:string){
    this.listing.image = image.replace('_sm.jpeg','_lg.jpeg');
  }



}
