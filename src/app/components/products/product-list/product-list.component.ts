import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';

import { Product } from '../../../models/product.model';
import { ProductService, PaginatedResponse } from '../../../services/product.service';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [
    CommonModule, 
    RouterModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatTooltipModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatPaginatorModule
  ],
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss']
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];
  displayedColumns: string[] = ['id', 'name', 'price', 'status', 'code', 'actions'];
  loading = true;
  
  // Pagination properties
  totalElements = 0;
  totalPages = 0;
  currentPage = 0;
  pageSize = 10;
  pageSizeOptions = [5, 10, 20, 50];

  constructor(
    private productService: ProductService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.loading = true;
    this.productService.getProducts(this.currentPage, this.pageSize).subscribe({
      next: (response: PaginatedResponse<Product>) => {
        this.products = response.content;
        this.totalElements = response.totalElements;
        this.totalPages = response.totalPages;
        this.currentPage = response.number;
        this.pageSize = response.size;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error fetching products', error);
        this.snackBar.open('Error loading products', 'Close', { duration: 3000 });
        this.loading = false;
      }
    });
  }

  onPageChange(event: PageEvent): void {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadProducts();
  }

  deleteProduct(id: number): void {
    if (confirm('Are you sure you want to delete this product?')) {
      this.productService.deleteProduct(id).subscribe({
        next: () => {
          this.snackBar.open('Product deleted successfully', 'Close', { duration: 3000 });
          this.loadProducts();
        },
        error: (error) => {
          console.error('Error deleting product', error);
          this.snackBar.open('Error deleting product', 'Close', { duration: 3000 });
        }
      });
    }
  }
}