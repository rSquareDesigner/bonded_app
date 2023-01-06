import { Component, OnInit } from '@angular/core';
import { forkJoin } from 'rxjs';
import { CommonService } from 'src/app/services/common.service';
import { TablesService } from 'src/app/services/tables.service';
import { UserService } from './../../services/user.service';
import { NavigationService } from './../../services/navigation.service';
import { Router } from '@angular/router';
declare var $: any;

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {

  user:any;

  users: any[];
  users_o: any[];
  states_counties: any[];
  group_assignments: any[];
  user_roles: any[];
  search_user: string;

  userx: any;
  userx_delete: any;
  usero: any;
  hasChanged: boolean;
  data_is_valid: boolean;

  constructor(
    public commonService: CommonService,
    public tablesService: TablesService,
    public navigationService: NavigationService,
    private router: Router,
    public userService: UserService,
  ) { }

  ngOnInit() {

    this.userService._getUser.subscribe((currentUser) => {
      this.user = currentUser;
      
      if (!this.user) this.router.navigate(['login']);
    });

    
    forkJoin([
      this.tablesService.GetAll('users'),
      
    ]).subscribe((data:any) => {
      this.users = data[0];
      this.users_o = JSON.parse(JSON.stringify(this.users));
    });

  }

  loadUsers(){
    this.tablesService.GetAll('users').subscribe((data:any) => {
      this.users = data;
      this.users_o = JSON.parse(JSON.stringify(this.users));
    })
  }
  
  showUserModal(item:any) {

    
    this.userx = item;

    this.usero = JSON.parse(JSON.stringify(this.userx));
    
    this.hasChanged = false;
    $('#userModal').modal('show');

  }

  closeUserModal(){
    if (this.userx.id) Object.assign(this.userx, this.usero);
  }

  evalEdit(item:any) {
    //compare current object been edited with original
    //this.hasChanged = this.commonService.objectChanged(item,this.usero,['name','description']);
    this.hasChanged = true;

  }

  saveUser(item:any){
    
    var objx = this.commonService.fixObject(item, ['id', 'name', 'email', 'phone','role']);
    
    this.tablesService.UpdateItem('users',objx).subscribe();
    //this.updateAssignments(item.id);

    $('#userModal').modal('hide');
  }

  updateUser(item:any) {

    var objx = this.commonService.fixObject(item, ['id', 'name', 'email', 'role','has_been_approved']);

    this.tablesService.UpdateItem('users', objx).subscribe((data:any) => {
      var userid = data.id;
      //this.updateAssignments(userid);
      this.loadUsers();
    });

    $('#userModal').modal('hide');
  }

  removeUserRole(user:any,role_index:any){
    user.roles.splice(role_index,1);

    if (user.roles.length == 0) user.roles.push({ group_id:null, user_role_id:null });
    this.hasChanged = true;
  }

  goBack(){
    //this.router.navigate(['user/dashboard' ]);
    this.navigationService.goBack();
  }

  confirmDeleteUser(item:any){
    this.userx_delete = item;
    $('#confirmDeleteUserModal').modal('show');
  }

  deleteUser(){
    this.tablesService.DeleteItem('users',this.userx_delete.id).subscribe(() => {
      this.loadUsers();
    });

    $('#confirmDeleteUserModal').modal('hide');
  }

  gotoUserProfile(item:any){
    this.router.navigate(['profile/' + item.id]);
  }

  unblockUser(user:any){
    //TODO
  }

  logInAs(user:any){
    console.log('log in as');
    //use this user account to allow adding items
    //this.userService.adminLogInAs(user);
  }

  filterUsers(){
    if (!this.search_user){
      this.users = this.users_o;
      return;
    }

    var query = this.search_user.toLowerCase();
    this.users = this.users_o.filter(x => {
      return (x.name.toLowerCase().indexOf(query) > -1 || x.email.toLowerCase().indexOf(query) > -1);
    });
  }

  closeModal(name:string){
    $('#' + name).modal('hide');
  }

}
