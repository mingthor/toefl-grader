import { Component, Inject} from '@angular/core';
import { AngularFire, FirebaseApp } from 'angularfire2';
import { AuthService } from './auth.service';
import { MdSnackBar } from '@angular/material';

const PROFILE_PLACEHOLDER_IMAGE_URL = '/assets/images/profile_placeholder.png';

@Component({
  selector: 'login',
  template: `
  <div id="user-container">
    <div *ngIf="authService.currentUser" id="user-pic" [ngStyle]="profilePicStyles"></div>
    <div *ngIf="authService.currentUser" id="user-name">{{ (af.auth | async)?.auth.displayName }}</div>
    <button *ngIf="authService.currentUser" id="sign-out" (click)="authService.logout()" class="mdl-button mdl-js-button mdl-js-ripple-effect mdl-color-text--white">Sign-out</button>
    <button *ngIf="!authService.currentUser" id="sign-in" (click)="authService.login()" class="mdl-button mdl-js-button mdl-js-ripple-effect mdl-color-text--white">
      <i class="material-icons">account_circle</i>Sign-in with Google
    </button>
  </div>
    `,
  styleUrls: ['./app.component.css']
})
export class LoginComponent {
  fbApp: any;
  profilePicStyles: {};

  constructor(public af: AngularFire, @Inject(FirebaseApp) fbApp: any, public snackBar: MdSnackBar, public authService: AuthService,) {
    this.fbApp = fbApp;

    if (this.authService.currentUser) { // User is signed in!
      this.profilePicStyles = {
        'background-image':  `url(${this.authService.currentUser.auth.photoURL})`
      };

      // We save the Firebase Messaging Device token and enable notifications.
      this.saveMessagingDeviceToken();
    } else { // User is signed out!
      this.profilePicStyles = {
        'background-image':  PROFILE_PLACEHOLDER_IMAGE_URL
      };
    }
  }

  login() { this.authService.login(); }

  logout() { this.authService.logout(); }

  // Saves the messaging device token to the datastore.
  saveMessagingDeviceToken() {
    return this.fbApp.messaging().getToken()
      .then((currentToken) => {
        if (currentToken) {
          console.log('Got FCM device token:', currentToken);
          // Save the Device Token to the datastore.
          this.fbApp.database()
            .ref('/fcmTokens')
            .child(currentToken)
            .set(this.authService.currentUser.uid);
        } else {
          // Need to request permissions to show notifications.
          return this.requestNotificationsPermissions();
        }
      }).catch((err) => {
        this.snackBar.open('Unable to get messaging token.', null, {
          duration: 5000
        });
        console.error(err);
      });
  };

  // Requests permissions to show notifications.
  requestNotificationsPermissions() {
    console.log('Requesting notifications permission...');
    return this.fbApp.messaging().requestPermission()
      // Notification permission granted.
      .then(() => this.saveMessagingDeviceToken())
      .catch((err) => {
        this.snackBar.open('Unable to get permission to notify.', null, {
          duration: 5000
        });
        console.error(err);
      });
  };
}