import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'pru-about-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.scss']
})

export class AboutItemComponent implements OnInit, OnDestroy {
  id: any;
  paramsSub: any;

  constructor(
    private activatedRoute: ActivatedRoute) {
      // Some stuff
  }

  ngOnInit() {
    this.paramsSub = this.activatedRoute.params.subscribe(params => {
      this.id = + params['id'];
    });
  }

  ngOnDestroy() {
    this.paramsSub.unsubscribe();
  }
}
