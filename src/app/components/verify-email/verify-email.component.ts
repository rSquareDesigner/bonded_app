import { Component, OnInit } from '@angular/core';
import { TablesService } from '../../services/tables.service';

@Component({
  selector: 'app-verify-email',
  templateUrl: './verify-email.component.html',
  styleUrls: ['./verify-email.component.scss']
})
export class VerifyEmailComponent implements OnInit {

  hoa: any;

  constructor(
    public tablesService: TablesService
  ) {   }

  ngOnInit() {

    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const token1 = urlParams.get('token1');
    const token2 = urlParams.get('token2');

    if (token1) {
      this.tablesService.GetFiltered('hoas','token1', token1).subscribe((data:any) => {
        if (data[0]){
          this.hoa = data[0];

          var hoa_data = {
            id: this.hoa.id,
            contact1_email_verified: true
          }

          this.tablesService.UpdateItem('hoas',hoa_data).subscribe(() => {
            this.showSuccessModal();
          });
        }
      });
    }

    else if (token2) {
      this.tablesService.GetFiltered('hoas','token2', token2).subscribe((data:any) => {
        if (data[0]){
          this.hoa = data[0];

          var hoa_data = {
            id: this.hoa.id,
            contact2_email_verified: true
          }

          this.tablesService.UpdateItem('hoas',hoa_data).subscribe(() => {
            this.showSuccessModal();
          })
        }
      });
    }

    else {
      this.showErrorModal();
    }

  }

  showSuccessModal(){
    $('#successModal').modal('show');
  }

  showErrorModal(){
    $('#errorModal').modal('show');
  }

}
