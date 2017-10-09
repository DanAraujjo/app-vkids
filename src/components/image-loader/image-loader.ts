import { Component, Input, trigger, state, style, transition, animate, OnInit } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

@Component({
  selector: 'image-loader',
  templateUrl: 'image-loader.html',
  animations: [
    trigger('fadeInOut', [
      state('in', style({ opacity: 1, visibility: 'visible' })),
      state('out', style({ opacity: 0, visibility: 'hidden' })),
      transition('in <=> out', [
        animate('1s ease-out')
      ])
    ])
  ]
})

export class ImageLoader implements OnInit {
  @Input() src;
  @Input() id;
  @Input() type;

  public loaded = false;
  public fadeInState = 'in';
  public fadeOutState = 'out';
  private _imgSafe: SafeUrl;

  constructor(private sanitizer: DomSanitizer) {
  }

  public isLoaded(event: Event) {
    this.loaded = true;
    this.fadeInState = 'out';
    this.fadeOutState = 'in';
  }

  public ngOnInit() {
    this._imgSafe = this.sanitizer.bypassSecurityTrustUrl(this.src);
  }  
}