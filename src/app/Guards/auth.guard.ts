import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from "@angular/router";
import { Observable } from "rxjs";
import { AuthService } from "../Services/auth.service";


@Injectable({providedIn : "root"})
export class AuthGuard implements CanActivate
{
    constructor(private _authService : AuthService , private router : Router)
    {}

    canActivate(next :ActivatedRouteSnapshot , state : RouterStateSnapshot ) : Observable<boolean> | Promise<boolean> | boolean
    {
        if (this._authService.isLoggedIn)
        {
            return true ; 
        }
        this.router.navigate(["/"]);
        return false;
    }
}