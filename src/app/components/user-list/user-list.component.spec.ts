import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserListComponent } from './user-list.component';
import { UserService } from '../../services/user.service';
import { UserQuery } from '../../state/user.query';
import { ActivatedRoute, Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { User } from '../../interfaces/user';

describe('UserListComponent', () => {
  let component: UserListComponent;
  let fixture: ComponentFixture<UserListComponent>;

  const mockUserService = {
    getUsersList: jest.fn()
  };

  const mockUserQuery = {
    getValue: jest.fn().mockReturnValue({ users: [] }),
    select: jest.fn(),
    saveState: jest.fn()
  };

  const mockRouter = {
    navigate: jest.fn()
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserListComponent],
      providers: [
        { provide: ActivatedRoute, useValue: { snapshot: { paramMap: { get: () => null } } } },
        { provide: UserService, useValue: mockUserService },
        { provide: UserQuery, useValue: mockUserQuery },
        { provide: Router, useValue: mockRouter },
      ]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UserListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch users from API if no users in state', (done) => {
    const users: User[] = [{ id: 1, name: 'Test User' } as User];

    mockUserQuery.getValue.mockReturnValue({ users: [] });
    mockUserService.getUsersList.mockReturnValue(of(users));

    component.ngOnInit();

    component.users$.subscribe(data => {
      expect(data).toEqual(users);
      expect(mockUserService.getUsersList).toHaveBeenCalled();
      expect(mockUserQuery.saveState).toHaveBeenCalled();
      expect(component.loading).toBe(true);
      done();
    });
  });

  it('should use cached users if available in state', () => {
    const cachedUsers: User[] = [{ id: 2, name: 'Cached User' } as User];

    mockUserQuery.getValue.mockReturnValue({ users: cachedUsers });
    mockUserQuery.select.mockReturnValue(of(cachedUsers));

    component.ngOnInit();

    expect(component.loading).toBe(false);
    expect(mockUserService.getUsersList).not.toHaveBeenCalled();
    expect(mockUserQuery.select).toHaveBeenCalled();
    expect(mockUserQuery.saveState).toHaveBeenCalled();
  });

  it('should set errorMessage if API call fails', (done) => {
    const errorResponse = new Error('Failed to load users');
    mockUserService.getUsersList.mockReturnValue(throwError(() => errorResponse));
    component.getUsersList();
    component.users$.subscribe(() => {
      expect(component.errorMessage).toBe('Failed to load users. Please try again later.');
      done();
    });
  });

  it('trackByUserId should return user ID', () => {
    const user = { id: 42, name: 'User' };
    const result = component.trackByUserId(0, user);
    expect(result).toBe(42);
  });
});
