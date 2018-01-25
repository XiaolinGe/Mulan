import {Component, Input, OnInit} from '@angular/core';
import {AbstractControl, FormControl, FormGroup} from '@angular/forms';

@Component({
  selector: 'validation-error',
  templateUrl: 'validation-error.component.html'
})
export class ValidationErrorComponent implements OnInit {


  @Input('control')
  public control: AbstractControl;

  constructor() {

  }

  ngOnInit(): void {
    if (!this.control) {
      this.control = new FormControl();
    }
  }
}


