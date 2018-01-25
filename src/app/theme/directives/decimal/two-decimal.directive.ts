import {Directive, HostListener, ElementRef, OnInit, OnChanges, Input} from '@angular/core';
import {FourDecimalPipe} from '../../pipes/decimalPipe/four-decimal.pipe';
import {TwoDecimalPipe} from "../../pipes/decimalPipe/two-decimal.pipe";
import {NgModel} from "@angular/forms";

@Directive({
  selector: '[twoDecimal]',
  providers: [NgModel]
})
export class TwoDecimalDirective implements OnInit {

  private el: any;
  @Input() public twoDecimal: any;

  constructor(private elementRef: ElementRef,
              private currencyPipe: TwoDecimalPipe) {
    this.el = this.elementRef.nativeElement;
    this.el.value = this.currencyPipe.transform(this.el.value);
  }

  ngOnInit() {
    this.el.value = this.currencyPipe.transform(this.el.value);
  }

  @HostListener('focus', ['$event.target.value'])
  onFocus(value) {
    console.log(value);
    console.log(this.currencyPipe.parse(value));
    this.el.value = this.currencyPipe.parse(value); // opossite of transform
  }

  // //http://plnkr.co/edit/Ygd9CDWg2OxG6n88zRqD?p=preview
  // ngOnChanges(changes) {
  //   console.log(changes);
  //   if (changes.twoDecimal.currentValue) {
  //     console.log('input changed');
  //     changes.twoDecimal.currentValue = this.currencyPipe.parse(changes.twoDecimal.currentValue);
  //   }
  // }

  @HostListener('blur', ['$event.target.value'])
  onBlur(value) {
    console.log(value);
    console.log(this.currencyPipe.transform(value));
    this.el.value = this.currencyPipe.transform(value);
  }

}
