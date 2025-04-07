import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { catchError, Observable, of, take } from 'rxjs';
import { User } from '../../interfaces/user';

import { UserService } from '../../services/user.service';
import { UserQuery } from '../../state/user.query';
import { CommonModule } from '@angular/common';
import { UserStore } from '../../state/user.store';

@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    CommonModule
  ],
  templateUrl: './user-form.component.html',
  styleUrl: './user-form.component.scss'
})
export class UserFormComponent implements OnInit {

  userForm: FormGroup;
  userId!: number | null;
  user$!: Observable<User | undefined>;
  isLoading: boolean = true;
  formValue!: any;
  errorMessage = '';
  loading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private userQuery: UserQuery,
    private userStore: UserStore,
    private userService: UserService,
  ) {
    this.userForm = this.fb.group({
      name: [null, [Validators.required, Validators.pattern('^[A-Za-z ]+$')]],
      username: [null, Validators.required],
      email: [null, [Validators.required, Validators.email]],
      phone: [null, Validators.required],
      website: [null, Validators.required],
    
      address: this.fb.group({
        street: [null, Validators.required],
        suite: [null, Validators.required],
        city: [null, Validators.required],
        zipcode: [null, [Validators.required, Validators.pattern('^[0-9-]+$')]],
        geo: this.fb.group({
          lat: [null, [Validators.required, Validators.pattern('^-?\\d+(\\.\\d+)?$')]],
          lng: [null, [Validators.required, Validators.pattern('^-?\\d+(\\.\\d+)?$')]]
        })
      }),
    
      company: this.fb.group({
        name: [null, Validators.required],
        catchPhrase: [null, Validators.required],
        bs: [null, Validators.required]
      })
    });
  }

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    this.userId = idParam ? Number(idParam) : null;
    
    if (this.userId) {
      this.initFormFieldsFromUserId(this.userId);
    } else {
      this.isLoading = false;
    }
  }

  initFormFieldsFromUserId(userId: number) {
    this.user$ = this.userQuery.select(state => state.users.find(user => user.id === userId));

    this.user$.subscribe(user => {
      console.log(user);
      if (user) {
        this.userForm.patchValue({
          name: user.name,
          username: user.username,
          email: user.email,
          phone: user.phone,
          website: user.website,
          address: {
            street: user.address.street,
            suite: user.address.suite,
            city: user.address.city,
            zipcode: user.address.zipcode,
            geo: {
              lat: user.address.geo.lat,
              lng: user.address.geo.lng
            }
          },
          company: {
            name: user.company.name,
            catchPhrase: user.company.catchPhrase,
            bs: user.company.bs
          }
        });
      }
      this.isLoading = false;
    });
  }

  preparePayload() {
    if (this.userForm.invalid) {
      this.userForm.markAllAsTouched();
      return;
    }
  
    if (this.userId) {
      this.formValue = {
        ...this.userForm.value,
        id: this.userId,
      };
    } else {
      const usersCount = this.userQuery.getValue().users?.length || 0;
      const newId = usersCount + 1;

      this.formValue = {
        id: newId,
        ...this.userForm.value,
      };
    }
    
  }

  callUpdateUser() {
    this.userService.updateUser(this.formValue).pipe(
      take(1),
      catchError((error) => {
        this.errorMessage = 'Erreur lors de la modification.';
        this.loading = false;
        return of(null);
      })
    ).subscribe(user => {
      if (user) {
        this.userStore.update(state => {
          return {
            users: state.users.map(existingUser =>
              existingUser.id === user.id ? user : existingUser
            )
          };
        });
      }
      this.loading = false;
      this.router.navigate(['details', this.userId]);
    });
  }

  callAddUser() {
    this.userService.addUser(this.formValue).pipe(
      take(1),
      catchError((error) => {
        this.errorMessage = 'Erreur lors de la création.';
        this.loading = false;
        return of(null);
      })
    ).subscribe(user => {
      if (user?.id) {
        this.userStore.update(state => {
          const alreadyExists = state.users.some(u => u.id === user.id);
          if (!alreadyExists) {
            return {
              users: [...state.users, user]
            };
          }
          return state;
        });
    
        this.router.navigate(['details', user.id]);
      }
      this.loading = false;
    });
  }

  onSubmit() {
    this.preparePayload();
    this.loading = true;
  
    if (this.userId) {
      this.callUpdateUser();
    } else {
      this.callAddUser();
    }
  }

  onReset() {
    this.userForm.reset();
  }

  goBack() {
    if (this.userId) {
      this.router.navigate(['details', this.userId]);
    } else {
      this.router.navigate(['']); 
    }
  }
}
