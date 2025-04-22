import {Component, Input, OnInit} from '@angular/core';
import {NgxSpinnerService} from "ngx-spinner";
import {Lightbox} from "ngx-lightbox";

const spineTypes = [
  "ball-atom",
  "ball-circus",
  "ball-beat",
  "ball-scale-multiple",
]

@Component({
  selector: 'app-image-with-loading',
  templateUrl: './image-with-loading.component.html',
  styleUrls: ['./image-with-loading.component.scss']
})
export class ImageWithLoadingComponent {

  @Input() width:number=150;
  @Input() height:number=150;
  @Input() image:string;
  @Input() name:string;

  isLoading:boolean;

  constructor(
    private spinnerService: NgxSpinnerService,
    private lightbox: Lightbox
  ) {
    this.isLoading=true;
  }

  ngOnInit() {
    const randomType = spineTypes[Math.floor(Math.random() * spineTypes.length)];

    this.spinnerService.show(this.name, {
      type: randomType,
      size: "medium",
      bdColor: 'rgba(160,146,146,0.0)',
      color: '#efb569'
    })
  }

  hideLoader(){
    this.isLoading=false;
    this.spinnerService.hide(this.name)
  }

  openImage(): void {
    // open lightbox

    let _albums:{ src: string; thumb: string; }[] = [];
    _albums.push(
      {
        src: this.image,
        thumb: this.image,
      }
    );

    this.lightbox.open(_albums, 0, {
      showZoom: true
    });

  }

}
