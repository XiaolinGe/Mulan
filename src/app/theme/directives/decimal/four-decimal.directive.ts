import {Directive, HostListener, ElementRef, OnInit} from '@angular/core';
import {FourDecimalPipe} from '../../pipes/decimalPipe/four-decimal.pipe';

@Directive({selector: '[fourDecimal]'})
export class FourDecimalDirective implements OnInit {

  private el: any;

  constructor(private elementRef: ElementRef,
              private currencyPipe: FourDecimalPipe) {
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

  @HostListener('blur', ['$event.target.value'])
  onBlur(value) {
    console.log(value);
    console.log(this.currencyPipe.transform(value));
    this.el.value = this.currencyPipe.transform(value);
  }

}
