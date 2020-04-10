import { Component, OnInit } from '@angular/core';
import { ProductsState } from './../../+state/products.reducer';
import { Store, select } from '@ngrx/store';
//import { productsQuery } from '../../+state/products.reducer';
import { getProducts } from './../../+state';
import { Observable } from 'rxjs';
import { Product } from '@myorg/data';
import { LoadProducts } from './../../+state/products.actions';

@Component({
    selector: 'app-products',
    templateUrl: './products.component.html',
    styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit {
  products$: Observable<Product[]>;

  constructor(private store: Store<ProductsState>) { }

  ngOnInit() {
    this.store.dispatch(new LoadProducts());
    this.products$ = this.store.pipe(select(getProducts));
  }

}
