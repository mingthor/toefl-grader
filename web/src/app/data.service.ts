import { AngularFire, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2';
import { Injectable } from '@angular/core';

@Injectable()
export class DataService {
    
    constructor(public af: AngularFire) {}

    getUserResponses(uid: string): Promise<FirebaseListObservable<any> > {
        return Promise.resolve(this.af.database.list('/responses/'+uid, {
            query: {
                limitToLast: 12
            }
        }));
    }
}
