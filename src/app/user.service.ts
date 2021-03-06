import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import jwtDecode from 'jwt-decode';
import { ToastrService } from 'ngx-toastr';
import { ReplaySubject, Subscription } from 'rxjs';
import { HttpService } from './http.service';
import {
  ILoginResp,
  ITokenRefresh,
  IUSer,
  IUserLogin,
} from './Interfaces/app-interface';
import { TokenService } from './token.service';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private Token = new ReplaySubject<ILoginResp>(1);
  private currentUserSource = new ReplaySubject<IUSer>(1);
  currentToken$ = this.Token.asObservable();
  currentUser$ = this.currentUserSource.asObservable();

  constructor(
    private http: HttpClient,
    private tokenService: TokenService,
    private router: Router,
    private route: ActivatedRoute,
    private httpService: HttpService,
    private toaster: ToastrService
  ) {}
  baseUrl = this.httpService.baseUrl;

  public login(model: IUserLogin): Subscription {
    return this.http.post(this.baseUrl + 'api/login', model).subscribe(
      (response: ILoginResp) => {
        if (response.success) {
          localStorage.setItem('user', JSON.stringify(response));
          this.currentUserSource.next(this.tokenService.toUser(response));
          this.Token.next(response);
          this.router.navigate(['']);
        } else {
          this.toaster.error('username or password is not correct', 'invalid');
        }
      },
      (error) => {
        console.log(error.message);
      }
    );
  }

  setCurrentUser(resp: ILoginResp): void {
    this.Token.next(resp);
    this.currentUserSource.next(this.tokenService.toUser(resp));
  }

  refreshToken(user: ILoginResp): ILoginResp {
    let res = null;
    const temp: ITokenRefresh = {
      refreshToken: user.refreshToken,
      token: user.token,
    };
    this.http
      .post(this.baseUrl + 'api/refreshToken', temp)
      .subscribe((response: ILoginResp) => {
        console.log(response);
        res = response;
      });
    return res;
  }

  logout(): void {
    this.Token.next(null);
    this.currentUserSource.next(null);
    localStorage.removeItem('user');
  }

  public decode_jwt(): IUSer | null {
    let user: IUSer | null = null;
    this.currentToken$.subscribe((res: ILoginResp) => {
      if (res != null) {
        if (!this.tokenService.tokenExpired(res.token)) {
          const temp = this.tokenService.getUserId(res.token);
          user = {
            id: temp?.id,
            name: temp?.name,
            role: temp?.role[0],
          };
        } else {
          console.log('token has expired');
        }
      }
    });
    return user;
  }
}
