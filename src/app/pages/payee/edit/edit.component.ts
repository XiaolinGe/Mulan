import { Component, OnInit, ViewEncapsulation  } from '@angular/core';

@Component({
  selector: 'mrp-payee-edit',
  encapsulation: ViewEncapsulation.None,
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss'],
  providers: []
})
export class PayeeEditComponent {
public isCollapsed = true;
    constructor(){
          this.isCollapsed = true;
    }

}
