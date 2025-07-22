import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { Product } from '../../../models/product.model';
import { ProductService } from '../../../services/product.service';
import { CategoryService } from '../../../services/category.service';
import { Category } from '../../../models/category.model';
import { CustomInputComponent, CustomTextareaComponent, CustomSelectComponent, SelectOption } from '../../../shared/components/form-controls';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatCheckboxModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    CustomInputComponent,
    CustomTextareaComponent,
    CustomSelectComponent
  ],
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.scss']
})
export class ProductFormComponent implements OnInit {
  productForm!: FormGroup;
  productId: number | null = null;
  isEditMode = false;
  loading = false;
  categories: Category[] = [];
  categoryOptions: SelectOption[] = [];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService,
    private categoryService: CategoryService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.initForm();
    this.loadCategories();

    this.route.params.subscribe(params => {
      if (params['id'] && params['id'] !== 'new') {
        this.productId = +params['id'];
        this.isEditMode = true;
        this.loadProduct(this.productId);
      }
    });
  }

  initForm(): void {
    this.productForm = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(100)]],
      description: ['', [Validators.maxLength(255)]],
      price: [0, [Validators.required, Validators.min(0.01)]],
      status: [true, [Validators.required]],
      code: [''],
      categoryId: ['', [Validators.required]]
    });
  }

  loadCategories(): void {
    this.categoryService.getAllCategories().subscribe({
      next: (data) => {
        this.categories = data;
        this.categoryOptions = [
          { value: '', label: 'Select a category' },
          ...data.map(category => ({ 
            value: category.id, 
            label: category.name 
          }))
        ];
      },
      error: (error) => {
        console.error('Error loading categories', error);
        this.snackBar.open('Error loading categories', 'Close', { duration: 3000 });
      }
    });
  }

  loadProduct(id: number): void {
    this.loading = true;
    this.productService.getProductById(id).subscribe({
      next: (product) => {
        this.productForm.patchValue({
          name: product.name,
          description: product.description || '',
          price: product.price,
          status: product.status,
          code: product.code || '',
          categoryId: product.category?.id || ''
        });
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading product', error);
        this.snackBar.open('Error loading product', 'Close', { duration: 3000 });
        this.loading = false;
        this.router.navigate(['/products']);
      }
    });
  }

  onSubmit(): void {
    if (this.productForm.invalid) {
      return;
    }

    this.loading = true;
    const productData: Product = {
      ...this.productForm.value
    };

    if (this.isEditMode && this.productId) {
      this.productService.updateProduct(this.productId, productData).subscribe({
        next: (_) => {
          this.snackBar.open('Product updated successfully', 'Close', { duration: 3000 });
          this.loading = false;
          this.router.navigate(['/products']);
        },
        error: (error) => {
          console.error('Error updating product', error);
          this.snackBar.open('Error updating product', 'Close', { duration: 3000 });
          this.loading = false;
        }
      });
    } else {
      this.productService.createProduct(productData).subscribe({
        next: (_) => {
          this.snackBar.open('Product created successfully', 'Close', { duration: 3000 });
          this.loading = false;
          this.router.navigate(['/products']);
        },
        error: (error) => {
          console.error('Error creating product', error);
          this.snackBar.open('Error creating product', 'Close', { duration: 3000 });
          this.loading = false;
        }
      });
    }
  }

  getErrorMessage(fieldName: string): string {
    const control = this.productForm.get(fieldName);
    if (!control || !control.errors) return '';

    if (control.errors['required']) {
      return `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} is required`;
    }
    if (control.errors['maxlength']) {
      const maxLength = control.errors['maxlength'].requiredLength;
      return `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} must not exceed ${maxLength} characters`;
    }
    if (control.errors['min']) {
      return `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} must be greater than 0`;
    }
    return '';
  }
}