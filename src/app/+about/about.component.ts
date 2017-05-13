import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'pru-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
})
export class AboutComponent implements OnInit {

  items: Object;

  constructor() {
    // Do stuff
    this.items = [{
      id: 1,
      name: 'Company'
    }, {
      id: 2,
      name: 'Policy'
    }];
  }

  ngOnInit() {
    console.log('Hello About');
  }

}
