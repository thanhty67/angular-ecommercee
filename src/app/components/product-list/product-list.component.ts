import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { Product } from '../../common/product';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list-grid.component.html',
  // templateUrl: './product-list-table.component.html',
  // templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.css',
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];
  currnentCategoryId: number | undefined;
  constructor(
    private productService: ProductService,
    private route: ActivatedRoute
  ) {}
  ngOnInit(): void {
    this.route.paramMap.subscribe(() => {
      this.listProduct();
    });
  }
  listProduct() {
    //check if "id" param is avalable
    const hasCategoryId: boolean = this.route.snapshot.paramMap.has('id');
    if (hasCategoryId) {
      //get the "id" param string. convert string to a number using the Number
      this.currnentCategoryId = Number(this.route.snapshot.paramMap.get('id'));
    } else {
      //default is 1
      this.currnentCategoryId = 1;
    }
    //now get the products for the given category id
    this.productService
      .getProductList(this.currnentCategoryId)
      .subscribe((data) => {
        this.products = data;
      });
  }
}
