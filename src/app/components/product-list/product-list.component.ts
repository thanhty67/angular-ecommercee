import { CartService } from './../../services/cart.service';
import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { Product } from '../../common/product';
import { ActivatedRoute } from '@angular/router';
import { CartItem } from '../../common/cart-item';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list-grid.component.html',
  styleUrl: './product-list.component.css',
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];
  currnentCategoryId: number = 1;
  previousCategoryId: number = 1;

  searchMode: boolean = false;

  //new properties for pagination
  thePageNumber: number = 1;
  thePageSize: number = 5;
  theTotalElements: number = 0;

  previousKeyword: string = "";

  constructor(
              private productService: ProductService,
              private cartService: CartService,
              private route: ActivatedRoute
            ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(() => {
      this.listProduct();
    });
  }

  listProduct() {
    this.searchMode = this.route.snapshot.paramMap.has('keyword');

    if (this.searchMode) {
      this.handleSearchProducts();
    }
    else {
      this.handleListProducts();
    }
  }

  handleSearchProducts() {
    const theKeyWord: string = this.route.snapshot.paramMap.get('keyword')!;

    // if we have a different keyword than previous
    // then set thePageNumber to 1

    if (this.previousKeyword != theKeyWord){
      this.thePageNumber = 1;
    }

    this.previousKeyword = theKeyWord;

    console.log(`keyword = ${theKeyWord}`)

    //now search for the products ussing keyword
    this.productService.searchProductsPaginate(this.thePageNumber - 1,
                                                this.thePageSize,
                                                theKeyWord).subscribe(this.processResult());
  }
  

  handleListProducts() {
    //check if "id" param is avalable
    const hasCategoryId: boolean = this.route.snapshot.paramMap.has('id');
    if (hasCategoryId) {
      //get the "id" param string. convert string to a number using the Number
      this.currnentCategoryId = Number(this.route.snapshot.paramMap.get('id'));
    } else {
      //default is 1
      this.currnentCategoryId = 1;
    }

    //
    //Check if we have a differnet category than previous
    //Note: Angular will reuse a component if it is currently being viewed
    //

    if (this.previousCategoryId != this.currnentCategoryId) {
      this.thePageNumber = 1;
    }

    this.previousCategoryId = this.currnentCategoryId;
    console.log(`currentCategoryId =${this.currnentCategoryId}, thePageNumber ${this.thePageNumber}`)

    //If we have a different category id than previous
    // then set thePageNumber back to 1

    //now get the products for the given category id
    this.productService
      .getProductListPaginate(this.thePageNumber - 1,
        this.thePageSize,
        this.currnentCategoryId)
      .subscribe(this.processResult());
  }
  updatePageSize(pageSize: String) {
    this.thePageSize = +pageSize;
    this.thePageNumber = 1;
    this.listProduct();
  }

  processResult() {
    return (data: any) => {
      this.products = data._embedded.products;
      this.thePageNumber = data.page.number + 1;
      this.thePageSize = data.page.size;
      this.theTotalElements = data.page.totalElements
    }
  }
  addToCart(theProduct: Product){
    console.log(`Adding to cart: ${theProduct.name}, ${theProduct.unitPrice}`)

    const theCartItem = new CartItem(theProduct);

    this.cartService.addToCart(theCartItem)
  }
}
