import { Component, OnInit } from '@angular/core';
import {Router, ActivatedRoute} from "@angular/router";
import { ChatsService } from '../../services/chats.service';
import { TablesService } from '../../services/tables.service';
import { UserService } from '../../services/user.service';
import { CommonService } from '../../services/common.service';

@Component({
  selector: 'app-inbox',
  templateUrl: './inbox.component.html',
  styleUrls: ['./inbox.component.scss']
})
export class InboxComponent implements OnInit {

  user: any;
  chats: any[];
  notifications: any[];

  selection: string = 'messages';
  check_notification_read_status: boolean;

  constructor(
    public tablesService: TablesService,
    public chatsService: ChatsService,
    public userService: UserService,
    public commonService: CommonService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit() {
    this.userService._getUser.subscribe((currentUser) => {
      this.user = currentUser;
      if (this.user) {
        //this.getChats();
        //this.getNotifications();
        //this.userService.updateLastActivity();
      }
    });
  }

  getChats(){

    this.chatsService.GetChatsByUser(this.user.id).subscribe((data:any) => {
      this.chats = data.sort((a:any,b:any) => {return b.timestmp - a.timestmp});

      
      //get user's image
      this.chats.forEach(x => {
        var user_id;
        if (x.user_id == this.user.id) user_id = x.user2_id;
        else if (x.user2_id == this.user.id) user_id = x.user_id;

        if (user_id){
          this.tablesService.GetFilteredX('users','id',user_id,'id,name,image,sign_up_date,number_of_reviews').subscribe((res:any) => {
            var user_record = res[0];
            if (user_record){
              x.user_image = user_record.image;
              x.user_name = user_record.name;
            }
            else {
              x.user_image = '../../../assets/images/noimage.png';
              x.user_name = 'User';
              x.user_is_disabled = true;
            }
            
          });
        }

        x.when = this.commonService.getWhen(x.timestmp);
        x.message_unread = x.user_id == this.user.id ? x.has_unread_messages: x.has_unread_messages2;

      });
    })
  }

  getNotifications(){
    this.tablesService.GetFiltered('notifications','user_id', this.user.id).subscribe((data:any) => {
      this.notifications = data.filter((x:any) => { return x.has_been_read != true; });
      this.notifications.forEach(x => {
        x.when = this.commonService.getWhen(x.timestmp);
      });

    });
  }

  gotoChat(item:any){
    this.router.navigate(['messages/'+item.id]);
  }

  gotoTransactionFeedback(item:any){
    this.router.navigate(['transaction-feedback/'+item.transaction_id]);
  }

  changeSelection(selection:string){
    this.selection = selection;
    if (this.selection == 'notifications' && this.check_notification_read_status != true) this.checkNotificationReadStatus();
  }

  checkNotificationReadStatus(){
    this.notifications.forEach(x => {
      if (x.has_been_read != true) {
        
        var notification_object = {
          id: x.id,
          has_been_read: true
        }

        this.tablesService.UpdateItem('notifications', notification_object).subscribe();
      }
    })
  }


}
