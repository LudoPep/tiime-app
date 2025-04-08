import { inject, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { UserService } from './user.service';
import { UserStore } from '../state/user.store';
import { User } from '../interfaces/user';
import { of, throwError } from 'rxjs';
import { Post } from '../interfaces/post';
import { HttpClient } from '@angular/common/http';

describe('UserService', () => {
  let service: UserService;
  let httpTestingController: any;
  let httpClientMock: jest.Mocked<HttpClient>;
  let userStoreMock: jest.Mocked<UserStore>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule
      ]
    });

    httpClientMock = {
      get: jest.fn(),
      put: jest.fn(),
      post: jest.fn(),
    } as any;

    userStoreMock = {
      setUsers: jest.fn(),
      setSelectedUser: jest.fn(),
      updateUser: jest.fn(),
      addUser: jest.fn(),
      setPostsForUser: jest.fn(),
      getValue: jest.fn(),
    } as any;

    service = TestBed.inject(UserService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch users list and update the store', (done) => {
    const users: User[] = [{ id: 1, name: 'John' } as User];
    httpClientMock.get.mockReturnValue(of(users));

    service.getUsersList().subscribe(result => {
      expect(result).toEqual(users);
      expect(userStoreMock.setUsers).toHaveBeenCalledWith(users);
      done();
    });
  });

  it('should fetch user by ID and set selected user', (done) => {
    const user: User = { id: 1, name: 'Jane' } as User;
    httpClientMock.get.mockReturnValue(of(user));

    service.getUserById(1).subscribe(result => {
      expect(result).toEqual(user);
      expect(userStoreMock.setSelectedUser).toHaveBeenCalledWith(user);
      done();
    });
  });

  it('should update user via API if id <= 10', (done) => {
    const user: User = { id: 5, name: 'Alice' } as User;
    httpClientMock.put.mockReturnValue(of(user));

    service.updateUser(user).subscribe(result => {
      expect(result).toEqual(user);
      expect(userStoreMock.updateUser).toHaveBeenCalledWith(user);
      done();
    });
  });

  it('should handle update error when user.id <= 10', (done) => {
    const user: User = { id: 2, name: 'ErrorUser' } as User;
    const error = new Error('Update failed');
    httpClientMock.put.mockReturnValue(throwError(() => error));

    service.updateUser(user).subscribe({
      error: (err) => {
        expect(err).toBe(error);
        expect(userStoreMock.updateUser).not.toHaveBeenCalled();
        done();
      }
    });
  });

  it('should update store directly if user.id > 10', (done) => {
    const user: User = { id: 15, name: 'LocalOnly' } as User;

    service.updateUser(user).subscribe(result => {
      expect(result).toEqual(user);
      expect(userStoreMock.updateUser).toHaveBeenCalledWith(user);
      expect(httpClientMock.put).not.toHaveBeenCalled();
      done();
    });
  });

  it('should add a new user and assign new ID', (done) => {
    const user: User = { id: 0, name: 'Newbie' } as User;
    const responseUser: User = { ...user, id: 0 };
    const existingUsers: User[] = [
      { id: 5, name: 'Old' } as User,
      { id: 9, name: 'Older' } as User
    ];

    httpClientMock.post.mockReturnValue(of(responseUser));
    userStoreMock.getValue.mockReturnValue({
      users: existingUsers,
      selectedUser: null,
      postsByUserId: {}
    });

    service.addUser(user).subscribe(result => {
      expect(result.id).toBe(10);
      expect(userStoreMock.addUser).toHaveBeenCalledWith(result);
      done();
    });
  });

  it('should fetch posts for a user and set them in store', (done) => {
    const posts: Post[] = [{ id: 1, title: 'Test', body: '', userId: 1 } as Post];
    httpClientMock.get.mockReturnValue(of(posts));

    service.getUserPosts(1).subscribe(result => {
      expect(result).toEqual(posts);
      expect(userStoreMock.setPostsForUser).toHaveBeenCalledWith(1, posts);
      done();
    });
  });

});
