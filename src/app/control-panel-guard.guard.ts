import { Injectable } from '@angular/core';
import {
  CanActivate,
  CanActivateChild,
  CanLoad,
  Route,
  UrlSegment,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
  Router,
} from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { UserService } from './user.service';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ControlPanelGuardGuard
  implements CanActivate, CanActivateChild, CanLoad {
  constructor(
    private userService: UserService,
    private toaster: ToastrService,
    private router: Router
  ) {}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    return this.userService.currentUser$.pipe(
      map((user) => {
        if (user) {
          return true;
        }
        this.toaster.info('you are not allowed');
        this.router.navigate(['']);
      })
    );
  }
  canActivateChild(
    childRoute: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    return this.userService.currentUser$.pipe(
      map((user) => {
        if (user) {
          return true;
        }
        this.toaster.info('you are not allowed');
      })
    );
  }
  canLoad(
    route: Route,
    segments: UrlSegment[]
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    return this.userService.currentUser$.pipe(
      map((user) => {
        if (user) {
          return true;
        }
        this.toaster.info('you are not allowed');
      })
    );
  }
}
