import { Component, OnInit, HostBinding } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { FirebaseObjectObservable } from 'angularfire2';

import { QuestionService } from './question.service';

@Component({
  template: `
    <div *ngIf="question">
      <h2>Question {{(question | async)?.id}} details!</h2>
      <div><label>category: </label>{{(question | async)?.category}}</div>
      <div>
        <label>text: </label>
        {{(question | async)?.text}}
      </div>
      <p>
        <button (click)="gotoQuestions()">Back</button>
      </p>
    </div>
  `
})
export class QuestionDetailComponent implements OnInit {
  
  question: FirebaseObjectObservable<any>;
  questionKey: string;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private service: QuestionService
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.questionKey = params['key'];
      console.log("question-detail questionKey = " + this.questionKey);
    });
    
    this.service.getQuestion(this.questionKey).then(question => this.question = question);
  }

  gotoQuestions() {
    this.router.navigate(['/questions', {key: this.questionKey}]);
  }
}