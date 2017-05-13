/**
 * @author Jonathan Concepcion
 * @email jonathan.concepcion@prudential.com | me@j17n.com
 * @title Bootstrap Icon Tooltip
 * @description Bootstrap, Tooltip component
 * @url http://getbootstrap.com/javascript/#tooltips
 */
import { Component, Input, AfterViewInit, OnDestroy, ElementRef } from '@angular/core';

declare var $: any;

@Component({
  selector: 'pru-icon-tooltip',
  template: '<ng-content></ng-content>',
})
export class IconTooltipComponent implements AfterViewInit, OnDestroy {

  @Input() placement: string = 'right';
  @Input() icon: string = 'glyphicon glyphicon-info-sign';
  @Input() event: string = 'hover';

  constructor(private elementRef: ElementRef) {
    // Some stuff
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.init();
    }, 1);
  }

  ngOnDestroy() {
    $(this.elementRef['nativeElement'])
      .tooltip('destroy');
  }

  private init() {
    let title = this.elementRef['nativeElement']['innerText'];
    let placement = this.placement;
    let event = this.event;

    this.elementRef['nativeElement']['innerText'] = '';

    $(this.elementRef['nativeElement'])
      .tooltip({
        placement: 'auto ' + placement,
        title: title,
        trigger: event,
        container: 'body'
      })
      .addClass(this.icon);
  }
}
