
import { Component, Inject } from '@angular/core';
import { AngularFire, FirebaseApp, FirebaseListObservable, FirebaseAuthState } from 'angularfire2';
import { MdSnackBar } from '@angular/material';

const LOADING_IMAGE_URL = 'https://www.google.com/images/spin-32.gif';
const PROFILE_PLACEHOLDER_IMAGE_URL = '/assets/images/profile_placeholder.png';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  currentUser: FirebaseAuthState;
  fbApp: any;
  questions: FirebaseListObservable<any>;
  profilePicStyles: {};
  topics = '';
  value = '';

  constructor(public af: AngularFire, @Inject(FirebaseApp) fbApp: any, public snackBar: MdSnackBar) {
    this.fbApp = fbApp;
    this.af.auth.subscribe((user: FirebaseAuthState) => {
      this.currentUser = user;

      if (user) { // User is signed in!
        this.profilePicStyles = {
          'background-image':  `url(${this.currentUser.auth.photoURL})`
        };

        // We load currently existing questions.
        this.questions = this.af.database.list('/questions', {
          query: {
            limitToLast: 12
          }
        });
        this.questions.subscribe((questions) => {
          // Calculate list of recently discussed topics
          const topicsMap = {};
          const topics = [];
          let hasEntities = false;
          questions.forEach((question) => {
            if (question.entities) {
              for (let entity of question.entities) {
                if (!topicsMap.hasOwnProperty(entity.name)) {
                  topicsMap[entity.name] = 0
                }
                topicsMap[entity.name] += entity.salience;
                hasEntities = true;
              }
            }
          });
          if (hasEntities) {
            for (let name in topicsMap) {
              topics.push({ name, score: topicsMap[name] });
            }
            topics.sort((a, b) => b.score - a.score);
            this.topics = topics.map((topic) => topic.name).join(', ');
          }

          // Make sure new question scroll into view
          setTimeout(() => {
            const questionList = document.getElementById('questions');
            questionList.scrollTop = questionList.scrollHeight;
            document.getElementById('question').focus();
          }, 500);
        });

        // We save the Firebase Messaging Device token and enable notifications.
        this.saveMessagingDeviceToken();
      } else { // User is signed out!
        this.profilePicStyles = {
          'background-image':  PROFILE_PLACEHOLDER_IMAGE_URL
        };
        this.topics = '';
      }
    });
  }

  login() {
    this.af.auth.login();
  }

  logout() {
     this.af.auth.logout();
  }

  // TODO: Refactor into text message form component
  update(value: string) {
    this.value = value;
  }

  // Returns true if user is signed-in. Otherwise false and displays a message.
  checkSignedInWithMessage() {
    // Return true if the user is signed in Firebase
    if (this.currentUser) {
      return true;
    }

    this.snackBar
      .open('You must sign-in first', 'Sign in', {
        duration: 5000
      })
      .onAction()
      .subscribe(() => this.login());

    return false;
  };

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
            .set(this.currentUser.uid);
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
