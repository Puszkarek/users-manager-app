import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TokenManagerService } from '@front/app/services/token-manager';
import { Observable } from 'rxjs';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  constructor(private readonly _tokenManagerService: TokenManagerService) {}

  /** Will intercept all requests that comes from angular and will put the JTW on the headers */
  public intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const requestWithToken = request.clone({
      setHeaders: {
        Authorization: `Bearer ${this._tokenManagerService.getToken()}`,
      },
    });
    return next.handle(requestWithToken);
  }
}
