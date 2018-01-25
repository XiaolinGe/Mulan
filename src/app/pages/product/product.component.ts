import { Component, OnInit, ViewEncapsulation  } from '@angular/core';

@Component({
  selector: 'mrp-trx',
  encapsulation: ViewEncapsulation.None,
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss'],
  providers: []
})
export class TrxComponent {
public isCollapsed = true;
    constructor(){
          this.isCollapsed = true;
    }

}
