import { Component } from '@angular/core';

import { ApiService } from './shared';

import '../style/app.scss';

@Component({
  selector: 'pru-app', // <pru-app></pru-app>
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {

  constructor(private api: ApiService) {
    // Do something with api
  }
}
