import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserFormComponent } from './user-form.component';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { UserQuery } from '../../state/user.query';
import { UserStore } from '../../state/user.store';
import { UserService } from '../../services/user.service';
import { of, throwError } from 'rxjs';

describe('UserFormComponent', () => {
  let component: UserFormComponent;
  let fixture: ComponentFixture<UserFormComponent>;

  const mockRouter = {
    navigate: jest.fn()
  };

  const mockActivatedRoute = {
    snapshot: {
      paramMap: {
        get: jest.fn()
      }
    }
  };

  const mockUserQuery = {
    select: jest.fn()
  };

  const mockUserStore = {
    update: jest.fn()
  };

  const mockUserService = {
    updateUser: jest.fn(),
    addUser: jest.fn()
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserFormComponent],
      providers: [
        FormBuilder,
        { provide: Router, useValue: mockRouter },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: UserQuery, useValue: mockUserQuery },
        { provide: UserStore, useValue: mockUserStore },
        { provide: UserService, useValue: mockUserService }
      ]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UserFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should init form when userId is set', () => {
    const user = {
      id: 1,
      name: 'Ludo PEPIN',
      username: 'ludo',
      email: 'ludo@yahoo.fr',
      phone: '123456789',
      website: 'web.com',
      address: {
        street: 'allée popot',
        suite: '6',
        city: 'auneau',
        zipcode: '28700',
        geo: { lat: '-21.333', lng: '66.666' }
      },
      company: {
        name: 'tiime',
        catchPhrase: 'Catchy',
        bs: 'bs'
      }
    };

    mockActivatedRoute.snapshot.paramMap.get.mockReturnValue('1');
    mockUserQuery.select.mockReturnValue(of(user));

    component.ngOnInit();

    component.user$.subscribe(() => {
      expect(component.userForm.value.name).toEqual(user.name);
    });
  });

  it('should call updateUser and navigate to detail page', () => {
    component.userId = 1;
    component.formValue = { id: 1, name: 'Updated User' };

    mockUserService.updateUser.mockReturnValue(of({ id: 1, name: 'Updated User' }));

    component.callUpdateUser();

    expect(mockUserService.updateUser).toHaveBeenCalledWith(component.formValue);
    expect(mockUserStore.update).toHaveBeenCalled();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['details', 1]);
  });

  it('should handle error in updateUser', () => {
    component.userId = 1;
    component.formValue = { id: 1, name: 'User' };

    mockUserService.updateUser.mockReturnValue(throwError(() => new Error('update error')));

    component.callUpdateUser();

    expect(component.errorMessage).toBe('Erreur lors de la modification.');
    expect(component.loading).toBe(false);
  });

  it('should call addUser and navigate to new user detail', () => {
    const createdUser = { id: 31, name: 'New User' };
    component.formValue = { name: 'New User' };

    mockUserService.addUser.mockReturnValue(of(createdUser));

    component.callAddUser();

    expect(mockUserService.addUser).toHaveBeenCalledWith(component.formValue);
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/details', 31]);
  });

  it('should handle error in addUser', () => {
    component.formValue = { name: 'Ludo' };

    mockUserService.addUser.mockReturnValue(throwError(() => new Error('add error')));

    component.callAddUser();

    expect(component.errorMessage).toBe('Erreur lors de la création');
  });

  it('should set formValue correctly on preparePayload (edit)', () => {
    component.userId = 1;
    component.userForm.setValue({
      name: 'Ludo PEPIN',
      username: 'ludoPep',
      email: 'ludo@yahoo.fr',
      phone: '123',
      website: 'web.com',
      address: {
        street: 'allée popot',
        suite: '6',
        city: 'auneau',
        zipcode: '28700',
        geo: { lat: '-34.555', lng: '45.555' }
      },
      company: {
        name: 'tiime',
        catchPhrase: 'catch',
        bs: 'bs'
      }
    });

    component.preparePayload();
    expect(component.formValue.id).toBe(1);
  });

  it('should not prepare payload if form is invalid', () => {
    component.userForm.controls['name'].setValue('');
    component.preparePayload();
    expect(component.formValue).toBeUndefined();
  });

  it('should call update or add depending on userId in onSubmit', () => {
    const prepareSpy = jest.spyOn(component, 'preparePayload');
    const updateSpy = jest.spyOn(component, 'callUpdateUser');
    const addSpy = jest.spyOn(component, 'callAddUser');

    component.userId = 1;
    component.userForm.setErrors(null);
    component.formValue = { id: 1, name: 'Existing User' };

    component.onSubmit();
    expect(prepareSpy).toHaveBeenCalled();
  });

  it('should reset form on onReset', () => {
    component.userForm.patchValue({ name: 'TestName' });
    component.onReset();
    expect(component.userForm.value.name).toBeNull();
  });

  it('should navigate back correctly on goBack (edit)', () => {
    component.userId = 1;
    component.goBack();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['details', 1]);
  });

  it('should navigate back correctly on goBack (create)', () => {
    component.userId = null;
    component.goBack();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['']);
  });
});
