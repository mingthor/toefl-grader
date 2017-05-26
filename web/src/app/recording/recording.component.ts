import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Observable } from 'rxjs/Observable';

import { AuthService } from '../auth.service';
import { DataService } from '../data.service';

@Component({
  selector: 'recording',
  templateUrl: './recording.component.html'
})

export class RecordingComponent {

  questionKey: string;
  recorderStatus: string;
  recordingCountdown: number = 5;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private dataService: DataService
  ) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.questionKey = params['key'];
    });
  }

  startRecording() {
    console.log("startRecording function in recording.html");
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({ audio: true }).then((mediaStream) => {
        this.initializeRecorder(mediaStream);
      });
    }
  }

  initializeRecorder(mediaStream) {
    console.log(mediaStream);

    var recorder = new VorbisMediaRecorder(mediaStream, { audioBitsPerSecond: 32000 });

    console.log(recorder);
    this.recorderStatus = recorder.state;

    let countdown = setInterval(() => {
      this.recordingCountdown--;
      if (this.recordingCountdown <= 0) {
        recorder.start();
        clearInterval(countdown);
      }
    }, 1000);

    var chunks = [];

    recorder.ondataavailable = (ev) => {
      console.log(ev.data);
      this.recorderStatus = recorder.state;
      chunks.push(ev.data);
    };

    recorder.onstart = () => {
      console.log('start');
      this.recorderStatus = recorder.state;
    };

    recorder.onstop = () => {
      console.log('stop');
      this.recorderStatus = recorder.state;
      var blob = new Blob(chunks, { type: chunks[0].type });
      chunks = [];

      if (this.authService.currentUser) {
        const uid = this.authService.currentUser.uid;
        try {
          this.dataService.saveAudioResponse(uid, this.questionKey, blob);
        }
        catch (err) {
          console.error(err);
        }
      }
    };

    var stopBtn = document.getElementById('stopBtn');
    stopBtn.addEventListener('click', function () {
      if (recorder.state === 'recording') {
        recorder.stop();
      }
      console.log('recorder.state=' + recorder.state);
    });
  }
}