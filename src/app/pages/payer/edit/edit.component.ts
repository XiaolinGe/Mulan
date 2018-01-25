import { Component, OnInit, ViewEncapsulation  } from '@angular/core';

@Component({
  selector: 'mrp-payer-edit',
  encapsulation: ViewEncapsulation.None,
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss'],
  providers: []
})
export class PayerEditComponent {
public isCollapsed = true;
    constructor(){
          this.isCollapsed = true;
    }

}
