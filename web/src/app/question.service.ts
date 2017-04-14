import { AngularFire, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2';
import { Injectable } from '@angular/core';

@Injectable()
export class QuestionService {
   
  constructor(public af: AngularFire) {}
  
  getQuestions(): Promise<FirebaseListObservable<any> >  {
    return Promise.resolve(this.af.database.list('/questions', {
          query: {
            limitToLast: 12
          }
        }));
  }

  getQuestion(key: string): Promise<FirebaseObjectObservable<any> > {
    console.log("QuestionService getQuestion at "+'/questions/'+key);
    return Promise.resolve(this.af.database.object('/questions/'+key));
  }
}