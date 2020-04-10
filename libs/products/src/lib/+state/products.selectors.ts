import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ProductsState, ProductsData } from './products.reducer';
import * as fromProduct from './products.reducer';

const getProductsState = createFeatureSelector<ProductsData>('products');

const getProducts = createSelector(
  getProductsState,
  fromProduct.selectAllProducts
);
const getProductEntnites = createSelector(
  getProductsState,
  fromProduct.selectProductEntities
);
const getSelectedProductId = createSelector(
  getProductsState,
  fromProduct.getSelectedProductId
);
const getSelectedProduct = createSelector(
  getProductEntnites,
  getSelectedProductId,
  (productsDictionary, id) => {
    return productsDictionary[id];
  }
);

export const productsQuery = {
  getProducts,
  getProductEntnites,
  getSelectedProductId,
  getSelectedProduct
};
