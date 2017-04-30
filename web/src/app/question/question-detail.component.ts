import { Component, OnInit, HostBinding } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { AngularFire, FirebaseObjectObservable } from 'angularfire2';

import { AuthService } from '../auth.service';
import { DataService } from '../data.service';
import { MdSnackBar } from '@angular/material';

@Component({
  templateUrl: './question-detail.component.html'
})
export class QuestionDetailComponent implements OnInit {

    question: FirebaseObjectObservable<any>;
    questionKey: string;

    constructor(
        public af: AngularFire,
        private route: ActivatedRoute,
        private router: Router,
        private authService: AuthService,
        private dataService: DataService,
        public snackBar: MdSnackBar
    ) {}

    ngOnInit() {
        this.route.params.subscribe(params => {
            this.questionKey = params['key'];
            console.log("question-detail questionKey = " + this.questionKey);
        });
        
        this.dataService.getQuestion(this.questionKey).then(question => this.question = question);
    }

    // upload audio file to server for grading
    uploadAudio(event: any) {
        event.preventDefault();
        const file = event.target.files[0];
        console.log(file);
        // Clear the selection in the file picker input.
        const audioForm = <HTMLFormElement>document.getElementById('audio-form');
        audioForm.reset();
        console.log(file.type);
        // Check if the file is audio ogg file.
        if (!file.type.match('(video|audio)/ogg')) {
            this.snackBar.open('You can only upload audio ogg files', null, {
                duration: 5000
            });
            return;
        }
        
        if (this.authService.currentUser) {
            // We add a message with a loading icon that will get updated with the shared image.
            const uid = this.authService.currentUser.uid;
            try {
                this.dataService.saveAudioResponse(uid, this.questionKey, file);
            }
            catch(err) {
                this.snackBar.open('There was an error uploading a file to Cloud Storage.', null, {
                    duration: 5000
                });
                console.error(err);
            }
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
