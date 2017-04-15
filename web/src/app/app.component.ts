
import { Component, Inject, OnInit } from '@angular/core';
import { AngularFire, FirebaseApp, FirebaseObjectObservable, FirebaseListObservable, FirebaseAuthState } from 'angularfire2';
import { AuthService } from './auth.service';
import { MdSnackBar } from '@angular/material';

const LOADING_IMAGE_URL = 'https://www.google.com/images/spin-32.gif';
const PROFILE_PLACEHOLDER_IMAGE_URL = '/assets/images/profile_placeholder.png';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  fbApp: any;
  profilePicStyles: {};
  value = '';

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
  
  // TODO: Refactor into text message form component
  update(value: string) {
    this.value = value;
  }

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
