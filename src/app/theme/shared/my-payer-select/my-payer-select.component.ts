import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Payer} from '../../../models/payer.model';
import {PayerService} from '../../../services/payer.service';
import {Subject} from "rxjs/Subject";

@Component({
  selector: 'my-payer-select',
  templateUrl: 'my-payer-select.component.html',
  styleUrls: ['my-payer-select.component.scss']
})
export class MyPayerSelectComponent implements OnInit {
  @Input('payerForLoad')
  public payerForLoad: Payer;

  @Input('payerIdForLoad')
  public payerIdForLoad: number;

  @Input('payerIdForLoadSubject')
  public payerIdForLoadSubject: Subject<number>;

  public payersForSelect: Payer[];

  // The parent can bind to this event
  @Output() payerSelected = new EventEmitter();

  public selectedPayer: Payer[];

  constructor(public payerService: PayerService) {

  }

  ngOnInit(): void {
    console.log('this.payerForLoad');
    console.log(this.payerForLoad);
    if (this.payersForSelect && this.payersForSelect.length > 0) {

    }
    this.getPayerList();
    this.subscribeParentEvent();
  }

  subscribeParentEvent() {
    if (this.payerIdForLoadSubject) {
      this.payerIdForLoadSubject.subscribe(event => {
        console.log(event);
        this.selectedPayer = [this.payersForSelect.find(p =>
          p.id === event
        )];
      });
    }
  }

  getPayerList() {
    this.payerService.getAllByPaging(1, 10000).subscribe(resp => {
      this.payersForSelect = resp.content;
      console.log(resp);
      if (this.payersForSelect && this.payersForSelect.length > 0) {
        this.payersForSelect.map(p => {
          p.text = p.name
        });

        // if have payerForLoad emit it
        // else emit the first one in payersForSelect
        if (this.payerForLoad) {
          // this.payerSelected.emit(this.payerForLoad)
          this.selectedPayer = [this.payersForSelect.find(p =>
            p.id === this.payerForLoad.id
          )];
          this.payerSelected.emit(this.selectedPayer[0]);
        }
        // else if (this.payerIdForLoad) {
        //   // this.payerSelected.emit(this.payerForLoad)
        //   this.selectedPayer = [this.payersForSelect.find(p =>
        //     p.id === this.payerIdForLoad
        //   )];
        //   // this.payerSelected.emit(this.selectedPayer[0]);
        // }
        else {
          this.selectedPayer = [this.payersForSelect[0]];
          this.payerSelected.emit(this.payersForSelect[0]);
        }
      }
    })
  }

  // ng2 select
  public selected(value: any): void {
    // console.log(value);
  }

  public removed(value: any): void {
    // console.log(value);
  }

  public typed(value: any): void {
    // console.log('New search input: ', value);
  }

  public refreshValue(value: any): void {
    console.log(value);
    if (this.payersForSelect) {
      this.payerSelected.emit(this.payersForSelect.find(p =>
        p.id === value.id
      ));
    }
  }

}
