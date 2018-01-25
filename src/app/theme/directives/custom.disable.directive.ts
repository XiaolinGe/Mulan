import {Directive, ElementRef, Input, Renderer} from '@angular/core';

@Directive({selector: '[customDisabled]'})
export class CustomDisabledDirective {

    @Input() customDisabled: boolean;

    constructor(private el: ElementRef, private renderer: Renderer) {
    }

    ngOnChanges() {
        if (this.customDisabled) {
            this.renderer.setElementAttribute(this.el.nativeElement, 'disabled', 'true');
        } else {
            this.renderer.setElementAttribute(this.el.nativeElement, 'disabled', null);
        }
    }
}