import { AngularFire, FirebaseListObservable, FirebaseAuthState } from 'angularfire2';
import { Injectable } from '@angular/core';

@Injectable()
export class QuestionService {
  currentUser: FirebaseAuthState;
   
  constructor(public af: AngularFire) {
    this.af.auth.subscribe((user: FirebaseAuthState) => {
      this.currentUser = user;
      console.log("currentUser ");
    });
  }
  
  getQuestions(): Promise<FirebaseListObservable<any> >  {
    console.log("QuestionService getQuestions called");
    return Promise.resolve(this.af.database.list('/questions', {
          query: {
            limitToLast: 12
          }
        }));
  }
}