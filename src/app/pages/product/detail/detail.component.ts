import {FormGroup} from '@angular/forms/forms';
import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {AuthenticationService} from '../../../services/authentication.service';
import {Product} from "../../../models/product.model";
import {ProductService} from "../../../services/product.service";

@Component({
  selector: 'product-detail',
  encapsulation: ViewEncapsulation.None,
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss'],
  providers: []
})
export class ProductDetailComponent implements OnInit {
  public product: Product;
  public productId: number;

  public myForm: FormGroup;
  public isCollapsed = true;
  public config: any;
  public loading: boolean;

  constructor(public productService: ProductService,
              public router: Router,
              public authenticationService: AuthenticationService,
             ) {


    this.config = {
      headers: {'Authorization': 'Bearer ' + this.authenticationService.token},
      addRemoveLinks: true,
      clickable: true
    };

  }

  ngOnInit() {
   this.getProduct();
  }



  getProduct() {
    this.loading = true;
    this.productService.getProduct(this.productId).subscribe(resp => {
      this.loading = false;
      this.product = resp;
    }, err => {
      this.loading = false;
    });
  }

  onSubmit({value, valid}: { value: any, valid: boolean }) {
    console.log(value, valid);
    // this.beneficiaryService.add(value).subscribe(resp => {
    //   console.log(resp);
    //   this.router.navigate(['pages/beneficiary/all']);
    // });
  }
}
