import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {ProductService} from "../../../services/product.service";
import {Product} from "../../../models/product.model";
import {CategoryService} from "../../../services/category.service";
import {Category} from "../../../models/category.model";

@Component({
  selector: 'product-list',
  encapsulation: ViewEncapsulation.None,
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
  providers: [CategoryService]

})
export class ProductListComponent implements OnInit {
  products: Product[];
  categories: Category[];
  public pageNumber: number;
  public pageSize: number;
  public totalSize: number;

  constructor(public  productService: ProductService,
              public categoryService: CategoryService) {

    this.pageNumber = 1;
    this.pageSize = 12;
  }

  ngOnInit(): void {
    this.refresh();
    console.log('get transactions');
  }

  refresh() {
    this.productService.getAllByPaging(this.pageNumber, this.pageSize).subscribe((resp) => {
      console.log(resp);
      this.products = resp.content;
      this.totalSize = resp.totalElements;
    });
  }

  pageChanged(event) {
    console.log(event);
    this.pageNumber = event;
    this.refresh();
  }

  onPageSizeChange(event) {
    this.pageSize = event;
    this.refresh();
  }

  getCategoryFormData() {
    debugger
    return this.categoryService.getAll();
  }

}
