import { Injectable } from '@angular/core';
import { Store, StoreConfig } from '@datorama/akita';
import { User } from '../interfaces/user';
import { Post } from '../interfaces/post';

export interface UserState {
  users: User[];
  selectedUser: User | null;
  postsByUserId: { [key: number]: Post[] };
}

export function createInitialState(): UserState {
  return {
    users: [],
    selectedUser: null,
    postsByUserId: {}
  };
}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'user' })
export class UserStore extends Store<UserState> {
  constructor() {
    if (typeof window !== 'undefined' && window.localStorage) {
      const savedState = localStorage.getItem('userState');
      const initialState = savedState ? JSON.parse(savedState) : createInitialState();
      super(initialState);
    } else {
      super(createInitialState());
    }
  }

  updateUser(updatedUser: User) {
    this.update(state => ({
      users: state.users.map(user =>
        user.id === updatedUser.id ? updatedUser : user
      )
    }));
    this.saveState();
  }

  addUser(newUser: User) {
    this.update(state => ({
      users: [...state.users, newUser]
    }));
    this.saveState();
  }

  setUsers(users: User[]) {
    this.update({ users });
    this.saveState();
  }

  setSelectedUser(user: User) {
    this.update({ selectedUser: user });
    this.saveState();
  }

  setPostsForUser(userId: number, posts: Post[]) {
    this.update(state => ({
      ...state,
      postsByUserId: {
        ...state.postsByUserId,
        [userId]: posts
      }
    }));
    this.saveState();
  }

  private saveState() {
    const currentState = this.getValue();
    localStorage.setItem('userState', JSON.stringify(currentState));
  }
}