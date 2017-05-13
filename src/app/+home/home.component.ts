import { Component, OnInit } from '@angular/core';
import { LifeService } from '../shared/gi-life-service';

@Component({
  selector: 'pru-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  responseData: any = false;
  userData: any = false;

  constructor(
    private lifeService: LifeService) {
    // Do stuff
  }

  ngOnInit() {
    // Some init
  }

  doAjaxCall() {
    this.lifeService.postData({
        'DOB': '03/07/1985',
        'Gender': 'M',
        'Spouse': 'Y',
        'NumChildren': '3',
        'YoungestChildDOB': '09/18/2014',
        'Salary': '125000'
      })
      .subscribe(
        (data) => {
          this.responseData = this.lifeService.getData();
          this.userData = this.lifeService.getUserData();
        },
        (error) => {
          console.log(error);
        }
      );
  }

}
