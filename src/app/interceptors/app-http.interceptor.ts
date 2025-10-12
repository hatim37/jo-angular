import {HttpEvent, HttpHandler, HttpInterceptor, HttpInterceptorFn, HttpRequest} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {AuthService} from '../services/auth.service';
import {catchError, Observable, throwError} from 'rxjs';
import {Router} from '@angular/router';

@Injectable()
export class AppHttpInterceptor implements HttpInterceptor {

  constructor(private authenticationService: AuthService, private router: Router) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    if(!req.url.includes("api/signin") &&
      !req.url.includes("api/registration") &&
      !req.url.includes("api/activation-send")&&
      !req.url.includes("api/validation-newSend")&&
      !req.url.includes("api/products")){

      let newRequest = req.clone({
        headers: req.headers.set('Authorization', `Bearer `+this.authenticationService.jwtToken)
      });
      return next.handle(newRequest).pipe(
        catchError(err => {
          if (err.status === 401) {
            this.authenticationService.logout();
            this.router.navigate(['/login']);
          }
          return throwError(() => err);
        })
      );
    } else
      return next.handle(req);
  }
}
