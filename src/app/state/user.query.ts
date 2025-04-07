import { Injectable } from "@angular/core";
import { Query } from "@datorama/akita";
import { UserState, UserStore } from "./user.store";
import { User } from "../interfaces/user";
import { Post } from "../interfaces/post";

@Injectable({ providedIn: 'root' })
export class UserQuery extends Query<UserState> {
  users$ = this.select(state => state.users);

  constructor(
    protected override store: UserStore
  ) {
    super(store);

    this.loadState()
  }

  getUserById(id: number): User | undefined {
    return this.getValue().users.find(user => user.id === id);
  }

  getUserPostsById(id: number): Post[] {
    return this.getValue().postsByUserId[id] || [];
  }

  loadState() {
    if (typeof window !== 'undefined' && window.localStorage) {
      const savedState = localStorage.getItem('userState');

      if (savedState) {
        this.store._setState(JSON.parse(savedState));
      }
    }
  }

  saveState() {
    if (typeof window !== 'undefined' && window.localStorage) {
      const state = this.store.getValue();
      localStorage.setItem('userState', JSON.stringify(state));
    }
  }
}