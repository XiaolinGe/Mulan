
import {Component, Input} from "@angular/core";

@Component({
  selector: 'validation-message',
  template: '<div *ngIf="show"><ng-content></ng-content></div>'
})
export class ValidationMessageComponent {
  @Input() name: string;
  show: boolean = false;

  showsErrorIncludedIn(errors: string[]): boolean {
    return errors.some(error => error === this.name);
  }
}
