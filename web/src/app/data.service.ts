import { AngularFire, FirebaseApp, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2';
import { Inject, Injectable } from '@angular/core';

@Injectable()
export class DataService {

    fbApp: any;
    
    constructor(
        public af: AngularFire,
        @Inject(FirebaseApp) fbApp: any,) {
        this.fbApp = fbApp;
    }

    getQuestions(): Promise<FirebaseListObservable<any> >  {
        return Promise.resolve(this.af.database.list('/questions', {
            query: {
                limitToLast: 12
            }
        }));
    }

    getQuestion(key: string): Promise<FirebaseObjectObservable<any> > {
        return Promise.resolve(this.af.database.object('/questions/'+key));
    }
    
    getUserResponses(uid: string, qid: string): Promise<FirebaseListObservable<any> > {
        return Promise.resolve(this.af.database.list('/responses/'+uid, {
            query: {
                orderByChild: 'question',
                equalTo: qid,
                limitToLast: 12,
            }
        }));
    }

    saveAudioResponse(uid: string, qid: string, file: File) {
        console.log("saveAudioResponse audio uid = "+uid+", filename ="+file.name);
        var d = new Date();
        const responses = this.af.database.list('/responses/'+uid);
        responses.push({
            audioUrl: 'https://www.google.com/images/spin-32.gif',
            createdAt: d.toJSON(),
            question: qid
        }).then((data) => {
            // Upload the audio file to Cloud Storage.
            const filePath = `${uid}/${data.key}/${file.name}`;
            return this.fbApp.storage().ref(filePath).put(file)
                .then((snapshot) => {
                    // Get the file's Storage URI
                    const fullPath = snapshot.metadata.fullPath;
                    const audioUrl = this.fbApp.storage().ref(fullPath).toString();
                    return this.fbApp.storage().refFromURL(audioUrl).getMetadata();
                }).then((metadata) => {
                    // TODO: Instead of saving the download URL, save the GCS URI and
                    //       dynamically load the download URL when displaying the image
                    //       message.
                    return data.update({
                        audioUrl: metadata.downloadURLs[0]
                    });
                });
        });
    }
}
