import { Injectable } from "@angular/core";
import {  Observable } from "rxjs";
import {HttpClient} from '@angular/common/http'
import {AngularFireAuth} from "@angular/fire/auth";
import * as firebase from "firebase";

@Injectable({providedIn : "root"})
export class AuthService{
    userData : Observable<firebase.User>;
    
    constructor(private http : HttpClient , private angularFireAuth : AngularFireAuth)
    {
        this.userData = angularFireAuth.authState; 
    };

    SignUp (email : string , password : string )
    {
        this.angularFireAuth.auth.createUserWithEmailAndPassword(email , password).then( res => {
            console.log("Success" ,res); 
        }).catch(err => { console.log("Something is wrong", err.message) ;});
    }
    SignIn( email : string , password : string )
    {
        if (this.isLoggedIn){
            return true
        }
        this.angularFireAuth.auth.signInWithEmailAndPassword(email , password)
        .then(res => {
            console.log("Success", res);
        }).catch(err => {console.log("Problem", err.message);});
    
    }

    SignOut()
    {
        this.angularFireAuth.auth.signOut();
    }
// Write the isAuthenticated Function for the Service then test whether it works or not
    isAuthenticated()
    {
        this.angularFireAuth.authState.subscribe(user => {
            if (user != null) 
            {
                localStorage.setItem("User" , JSON.stringify(user));
            }
            else {
                localStorage.setItem("User", null);
            }
        })
    }
    get isLoggedIn ()
    {
        const user = JSON.parse(localStorage.getItem("User"));
        return user !== null;
    }

    passwordReset (email : string)
    {
        this.angularFireAuth.auth.sendPasswordResetEmail(email);
    }

}