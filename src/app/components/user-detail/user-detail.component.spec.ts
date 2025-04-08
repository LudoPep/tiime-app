import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UserDetailComponent } from './user-detail.component';
import { of, throwError } from 'rxjs';
import { ActivatedRoute, convertToParamMap, Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { UserQuery } from '../../state/user.query';
import { UserStore } from '../../state/user.store';
import { User } from '../../interfaces/user';
import { Post } from '../../interfaces/post';

describe('UserDetailComponent', () => {
  let component: UserDetailComponent;
  let fixture: ComponentFixture<UserDetailComponent>;

  const mockUserService = {
    getUserById: jest.fn(),
    getUserPosts: jest.fn().mockReturnValue({ posts: [] })
  };

  const mockUserQuery = {
    getUserById: jest.fn(),
    getUserPostsById: jest.fn(),
    saveState: jest.fn()
  };

  const mockUserStore = {
    updateUser: jest.fn()
  };

  const mockRouter = {
    navigate: jest.fn()
  };

  const activatedRouteStub = {
    paramMap: of(convertToParamMap({ id: '1' }))
  };

  const fullMockUser: User = {
    id: 1,
    name: 'Ludovic PEPIN',
    username: 'LudoPep',
    email: 'ludo@yahoo.fr',
    phone: '123456789',
    website: 'web.com',
    address: {
      street: 'allée popot',
      suite: 'Apt 6',
      city: 'auneau',
      zipcode: '28700',
      geo: {
        lat: '-14.555',
        lng: '56.666'
      }
    },
    company: {
      name: 'Aubay',
      catchPhrase: 'none',
      bs: 'bs'
    }
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserDetailComponent],
      providers: [
        { provide: UserService, useValue: mockUserService },
        { provide: UserQuery, useValue: mockUserQuery },
        { provide: UserStore, useValue: mockUserStore },
        { provide: Router, useValue: mockRouter },
        { provide: ActivatedRoute, useValue: activatedRouteStub }
      ]
    }).compileComponents();

    window.scroll = jest.fn();

    fixture = TestBed.createComponent(UserDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load user from store if available', (done) => {
    mockUserQuery.getUserById.mockReturnValue(fullMockUser);

    component.ngOnInit();
    component.user$.subscribe(u => {
      expect(u).toEqual(fullMockUser);
      expect(mockUserQuery.getUserById).toHaveBeenCalledWith(1);
      done();
    });
  });

  it('should load user from API if not in store', (done) => {
    mockUserQuery.getUserById.mockReturnValue(undefined);
    mockUserService.getUserById.mockReturnValue(of(fullMockUser));

    component.ngOnInit();
    component.user$.subscribe(u => {
      expect(u).toEqual(fullMockUser);
      expect(mockUserService.getUserById).toHaveBeenCalledWith(1);
      done();
    });
  });

  it('should handle error if getUserById API call fails', (done) => {
    mockUserQuery.getUserById.mockReturnValue(undefined);
    mockUserService.getUserById.mockReturnValue(throwError(() => new Error('API Error')));

    component.ngOnInit();
    component.user$.subscribe(u => {
      expect(u).toBeUndefined();
      expect(component.errorMessage).toBe('Erreur lors du chargement des informations.');
      done();
    });
  });

  it('should load posts from store if available', (done) => {
    const posts: Post[] = [{ id: 1, userId: 1, title: 'Test Title', body: 'bla' }];
    mockUserQuery.getUserPostsById.mockReturnValue(posts);

    component.ngOnInit();
    component.posts$.subscribe(p => {
      expect(p).toEqual(posts);
      done();
    });
  });

  it('should fetch posts from API if not in store', (done) => {
    const posts: Post[] = [{ id: 2, userId: 1, title: 'API Title', body: 'More bla' }];
    mockUserQuery.getUserPostsById.mockReturnValue([]);
    mockUserService.getUserPosts.mockReturnValue(of(posts));

    component.ngOnInit();
    component.posts$.subscribe(p => {
      expect(p).toEqual(posts);
      expect(mockUserService.getUserPosts).toHaveBeenCalledWith(1);
      done();
    });
  });

  it('should handle error if getUserPosts API call fails', (done) => {
    mockUserQuery.getUserPostsById.mockReturnValue([]);
    mockUserService.getUserPosts.mockReturnValue(throwError(() => new Error('Fail')));

    component.ngOnInit();
    component.posts$.subscribe(p => {
      expect(p).toEqual([]);
      expect(component.errorMessage).toBe('Erreur lors du chargement des posts.');
      done();
    });
  });

  it('togglePost should toggle openedPostIndex correctly', () => {
    component.openedPostIndex = 0;
    component.togglePost(1);
    expect(component.openedPostIndex).toBe(1);

    component.togglePost(0);
    expect(component.openedPostIndex).toBe(0);
  });

  it('goBack should navigate to home', () => {
    component.goBack();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['']);
  });

  it('saveUserState should update store and save state', () => {
    component.saveUserState(fullMockUser);
    expect(mockUserQuery.saveState).toHaveBeenCalled();
    expect(mockUserStore.updateUser).toHaveBeenCalledWith(fullMockUser);
  });
});