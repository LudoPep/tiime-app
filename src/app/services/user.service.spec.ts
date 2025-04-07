import { inject, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { UserService } from './user.service';

describe('UserService', () => {
  let service: UserService;
  // let httpTestingController: any;
  // let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      // imports: [
      //   HttpClientTestingModule
      // ]
    });
    service = TestBed.inject(UserService);
    // httpTestingController = TestBed.inject(HttpTestingController);
    // httpMock = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  // it('should call user API and return response', inject([HttpTestingController],
  //   (httpClient: HttpTestingController) => {
  //     const mockResponse = { /* mock response data */ };
  //     const mockEndpoint = `https://jsonplaceholder.typicode.com/users`;

  //     service.getUsers().subscribe(response => {
  //       expect(response).toEqual(mockResponse);
  //     });

  //     const req = httpMock.expectOne(mockEndpoint);
  //     expect(req.request.method).toBe('GET');
  //     req.flush(mockResponse);
  //   }));

  // it('should call user details API and return response', inject([HttpTestingController],
  //   (httpClient: HttpTestingController) => {
  //     const mockUserId = '1';
  //     const mockResponse = { /* mock response data */ };
  //     const mockEndpoint = `https://jsonplaceholder.typicode.com/users/${mockUserId}`;

  //     service.getUsers().subscribe(response => {
  //       expect(response).toEqual(mockResponse);
  //     });

  //     const req = httpMock.expectOne(mockEndpoint);
  //     expect(req.request.method).toBe('GET');
  //     req.flush(mockResponse);
  //   }));
});
