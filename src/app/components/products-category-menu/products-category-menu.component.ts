import { Component } from '@angular/core';
import { ProductCategory } from '../../common/product-category';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-products-category-menu',
  templateUrl: './products-category-menu.component.html',
  styleUrl: './products-category-menu.component.css',
})
export class ProductsCategoryMenuComponent {
  productCategories: ProductCategory[] = [];

  constructor(private productService: ProductService) {}
  ngOnInit() {
    this.listProductCategories();
  }
  listProductCategories() {
    this.productService.getProductCategories().subscribe((data) => {
      console.log('Product Category= ' + JSON.stringify(data));
      this.productCategories = data;
    });
  }
}
