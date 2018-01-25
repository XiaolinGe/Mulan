import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {Category} from "../../../models/category.model";
import {CategoryService} from "../../../services/category.service";

@Component({
  selector: 'category-list-component',
  encapsulation: ViewEncapsulation.None,
  templateUrl: './category-list.component.html',
 // styleUrls: ['./list.component.scss'],
  providers: []
})
export class CategoryListComponent implements OnInit {
  categories: Category[];
  public pageNumber: number;
  public pageSize: number;
  public totalSize: number;

  constructor(public categoryService: CategoryService) {
    this.pageNumber = 1;
    this.pageSize = 12;
  }

  ngOnInit(): void {
    this.refresh();
    console.log('get categories');
  }

  refresh() {
    this.categoryService.getAll().subscribe((resp) => {
      console.log(resp);
      this.categories = resp.content;
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

}
