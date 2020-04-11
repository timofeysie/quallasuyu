import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Product } from '@myorg/data';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss']
})
export class ProductListComponent {
  @Input() products: Product[];
  @Output() filter = new EventEmitter<string>();

  onFilter(category: string) {
    this.filter.emit(category);
  }
}
