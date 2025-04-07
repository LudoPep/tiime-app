import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { catchError, Observable, of, switchMap } from 'rxjs';
import { CommonModule } from '@angular/common';
import { Post } from '../../interfaces/post';
import { UserFormComponent } from '../user-form/user-form.component';
import { UserQuery } from '../../state/user.query';
import { User } from '../../interfaces/user';
import { UserStore } from '../../state/user.store';

@Component({
  selector: 'app-user-detail',
  standalone: true,
  imports: [
    CommonModule,
    UserFormComponent,
    RouterModule
  ],
  templateUrl: './user-detail.component.html',
  styleUrl: './user-detail.component.scss'
})
export class UserDetailComponent implements OnInit {

  user$!: Observable<User>;
  posts$!: Observable<Post[]>;
  openedPostIndex: number | null = null;
  loading: boolean = true;
  errorMessage: string = '';
  userId!: null | number;

  constructor(
    private userService: UserService,
    private route: ActivatedRoute,
    private router: Router,
    private userQuery: UserQuery,
    private userStore: UserStore
  ) {}

  ngOnInit(): void {
    this.getUserInfos();
    this.getUserPosts();
  }

  getUserInfos() {
    this.user$ = this.route.paramMap.pipe(
      switchMap(params => {
        const id = Number(params.get('id'));
        this.userId = id;

        const userInStore = this.userQuery.getUserById(id);
        if (userInStore) {
          return of(userInStore);
        }

        return this.userService.getUserById(id).pipe(
          catchError((error) => {
            this.errorMessage = 'Erreur lors du chargement des informations.';
            return of();
          })
        );
      })
    );
  }
  
  getUserPosts() {
    this.posts$ = this.route.paramMap.pipe(
      switchMap(params => {
        const id = Number(params.get('id'));
        this.userId = id;
  
        const userPostsInStore = this.userQuery.getUserPostsById(id);
        if (userPostsInStore && userPostsInStore.length > 0) {
          return of(userPostsInStore);
        }
  
        return this.userService.getUserPosts(id).pipe(
          catchError((error) => {
            this.errorMessage = 'Erreur lors du chargement des posts.';
            return of([]);
          })
        );
      })
    );
  }
  
  togglePost(index: number) {
    this.openedPostIndex = this.openedPostIndex === index ? null : index;
  }

  goBack() {
    this.router.navigate(['']);
  }

  saveUserState(user: User) {
    this.userQuery.saveState();
    this.userStore.updateUser(user);
  }
}
