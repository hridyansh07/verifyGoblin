import {Component} from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import {AuthService} from "../../Services/auth.service";

@Component({
    selector : 'app-auth',
    templateUrl: './auth.component.html',
    styleUrls: ['./auth.component.css']
})
export class AuthComponent
{

    constructor(public router  : Router  , private AuthService : AuthService) {}
    
    onSubmit(form : NgForm)
    { 
        this.AuthService.SignIn( form.value.email ,form.value.password);
        form.resetForm();
    }

    
    onSignUp()
    {
        this.router.navigateByUrl("/signup")
    }

    SignOut()
    {
        this.AuthService.SignOut();
    }

}