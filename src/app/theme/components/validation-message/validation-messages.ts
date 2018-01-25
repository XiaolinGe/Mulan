import { Component, OnInit, ContentChildren, QueryList, Input, OnDestroy } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Subscription } from 'rxjs';
import {ValidationMessageComponent} from "./validation-message";

@Component({
  selector: 'validation-messages',
  template: '<ng-content></ng-content>'
})
export class ValidationMessagesComponent implements OnInit, OnDestroy {
  @Input() for: FormControl;
  @ContentChildren(ValidationMessageComponent) messageComponents: QueryList<ValidationMessageComponent>;

  private statusChangesSubscription: Subscription;

  ngOnInit() {
    this.statusChangesSubscription = this.for.statusChanges.subscribe(x => {
      this.messageComponents.forEach(messageComponent => messageComponent.show = false);

      if (this.for.status === 'INVALID') {
        let firstErrorMessageComponent = this.messageComponents.find(messageComponent => {
          return messageComponent.showsErrorIncludedIn(Object.keys(this.for.errors));
        });

        firstErrorMessageComponent.show = true;
      }
    });
  }

  ngOnDestroy() {
    this.statusChangesSubscription.unsubscribe();
  }
}
