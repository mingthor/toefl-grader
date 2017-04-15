import { Component, Inject, OnInit, HostBinding } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { AngularFire, FirebaseApp, FirebaseObjectObservable } from 'angularfire2';

import { QuestionService } from './question.service';
import { AuthService } from '../auth.service';
import { MdSnackBar } from '@angular/material';

@Component({
  templateUrl: './question-detail.component.html'
})
export class QuestionDetailComponent implements OnInit {

  fbApp: any;
  question: FirebaseObjectObservable<any>;
  questionKey: string;

  constructor(
    public af: AngularFire,
    @Inject(FirebaseApp) fbApp: any,
    private route: ActivatedRoute,
    private router: Router,
    private questionService: QuestionService,
    private authService: AuthService,
    public snackBar: MdSnackBar
  ) {
    this.fbApp = fbApp;
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.questionKey = params['key'];
      console.log("question-detail questionKey = " + this.questionKey);
    });
    
    this.questionService.getQuestion(this.questionKey).then(question => this.question = question);
  }

  // upload audio file to server for grading
  uploadAudio(event: any) {
    event.preventDefault();
    const file = event.target.files[0];

    // Clear the selection in the file picker input.
    const audioForm = <HTMLFormElement>document.getElementById('audio-form');
    audioForm.reset();

    // Check if the file is audio.
    if (!file.type.match('audio.*')) {
      this.snackBar.open('You can only upload audio files', null, {
        duration: 5000
      });
      return;
    }

    if (this.authService.currentUser) {
      // We add a message with a loading icon that will get updated with the shared image.
      const uid = this.authService.currentUser.uid;
      console.log("upload audio uid = "+uid);
      const responses = this.af.database.list('/users/'+uid+'/responses');
      responses.push({
        audioUrl: 'https://www.google.com/images/spin-32.gif',
        question: this.questionKey
      }).then((data) => {
        // Upload the audio file to Cloud Storage.
        const filePath = `${this.authService.currentUser.uid}/${data.key}/${file.name}`;
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
      }).catch((err) => {
        this.snackBar.open('There was an error uploading a file to Cloud Storage.', null, {
          duration: 5000
        });
        console.error(err);
      });
    } else {
      this.snackBar.open('You must sign in first', null, {
        duration: 5000
      });
      return;
    }
  }
  
  onAudioClick(event: any) {
    event.preventDefault();
    document.getElementById('audioCapture').click();
  }

  gotoQuestions() {
    this.router.navigate(['/questions', {key: this.questionKey}]);
  }
}