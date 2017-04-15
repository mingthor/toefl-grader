import { Injectable } from '@angular/core';

import { AngularFire, FirebaseAuthState } from 'angularfire2';

@Injectable()
export class AuthService {
  currentUser: FirebaseAuthState;

  constructor(public af: AngularFire) {
    this.af.auth.subscribe((user: FirebaseAuthState) => {
      this.currentUser = user;
    });
  }
  
  login() {
    this.af.auth.login();
  }

  logout() {
     this.af.auth.logout();
  }
}
