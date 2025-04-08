import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { environment } from '../../../../../environments/environment';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  createdAt: string;
}

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {
  users: User[] = [];
  displayedColumns: string[] = ['id', 'name', 'email', 'role', 'createdAt', 'actions'];

  constructor(
    private http: HttpClient,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.http.get<User[]>(`${environment.apiUrl}/api/users`)
      .subscribe({
        next: (users) => {
          this.users = users;
        },
        error: (error) => {
          this.snackBar.open(
            error.error?.message || 'Erro ao carregar usuários',
            'Fechar',
            { duration: 3000 }
          );
        }
      });
  }

  editUser(user: User): void {
    // Implementar edição de usuário
    console.log('Editar usuário:', user);
  }

  deleteUser(user: User): void {
    if (confirm(`Tem certeza que deseja excluir o usuário ${user.name}?`)) {
      this.http.delete(`${environment.apiUrl}/api/users/${user.id}`)
        .subscribe({
          next: () => {
            this.snackBar.open('Usuário excluído com sucesso!', 'Fechar', { duration: 3000 });
            this.loadUsers();
          },
          error: (error) => {
            this.snackBar.open(
              error.error?.message || 'Erro ao excluir usuário',
              'Fechar',
              { duration: 3000 }
            );
          }
        });
    }
  }
} 