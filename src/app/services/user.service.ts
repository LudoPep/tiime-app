import { Injectable } from '@angular/core';
import { map, Observable, tap } from 'rxjs';
import { User } from '../interfaces/user';
import { HttpClient } from '@angular/common/http';
import { Post } from '../interfaces/post';
import { UserStore } from '../state/user.store';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  apiBaseUrl = `https://jsonplaceholder.typicode.com`;

  constructor(
    private http: HttpClient,
    private userStore: UserStore
  ) { }

  public getUsersList(): Observable<User[]> {
    const endpoint = `${this.apiBaseUrl}/users`;
    return this.http.get<User[]>(endpoint).pipe(
      tap(users => this.userStore.setUsers(users))
    );
  }

  public getUserById(userId: number): Observable<User> {
    const endpoint = `${this.apiBaseUrl}/users/${userId}`;
    return this.http.get<User>(endpoint).pipe(
      tap(user => this.userStore.setSelectedUser(user))
    );
  }

  public updateUser(user: User): Observable<User> {
    const endpoint = `${this.apiBaseUrl}/users/${user.id}`;
    return this.http.put<User>(endpoint, user).pipe(
      tap(updated => this.userStore.updateUser(updated))
    );
  }

  public addUser(user: User): Observable<User> {
    const endpoint = `${this.apiBaseUrl}/users`;
    return this.http.post<User>(endpoint, user).pipe(
      tap(added => this.userStore.addUser(added))
    );
  }

  public getUserPosts(id: number): Observable<Post[]> {
    const endpoint = `${this.apiBaseUrl}/users/${id}/posts`;
    return this.http.get<Post[]>(endpoint).pipe(
      map((posts) => {
        this.userStore.setPostsForUser(id, posts);
        return posts;
      })
    );
  }
}
