import { Component, OnInit } from '@angular/core';
import { catchError, Observable, of } from 'rxjs';
import { User } from '../../interfaces/user';
import { CommonModule } from '@angular/common';
import { UserService } from '../../services/user.service';
import { Router, RouterModule } from '@angular/router';
import { UserDetailComponent } from '../user-detail/user-detail.component';
import { UserQuery } from '../../state/user.query';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    UserDetailComponent
  ],
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.scss'
})
export class UserListComponent implements OnInit {

  users$!: Observable<User[]>;
  loading: boolean = true;
  errorMessage: string = '';

  constructor(
    private userService: UserService,
    private router: Router,
    private userQuery: UserQuery,
  ) {}

  ngOnInit(): void {
    this.getUsersList();
  }

  getUsersList() {
    if (this.userQuery.getValue().users.length === 0) {
      this.users$ = this.userService.getUsersList().pipe(
        catchError(error => {
          this.loading = false;
          this.errorMessage = 'Failed to load users. Please try again later.';
          return of([]);
        })
      );
    } else {
      this.users$ = this.userQuery.select(state => state.users);
      this.loading = false;
    }
    this.userQuery.saveState();
  }

  trackByUserId(index: number, user: any): number {
    return user.id;
  }
}
