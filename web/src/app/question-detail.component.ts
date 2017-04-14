import { Component, OnInit, HostBinding } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { FirebaseObjectObservable } from 'angularfire2';

import { slideInDownAnimation } from './animations';
import { QuestionService } from './question.service';

@Component({
  template: `
    <div *ngIf="question">
      <h2>Question {{question.id}} details!</h2>
      <div><label>category: </label>{{question.category}}</div>
      <div>
        <label>text: </label>
        <input [(ngModel)]="question.text" placeholder="text"/>
        Hello
      </div>
      <p>
        <button (click)="gotoQuestions()">Back</button>
      </p>
    </div>
  `,
  animations: [ slideInDownAnimation ]
})
export class QuestionDetailComponent implements OnInit {
  @HostBinding('@routeAnimation') routeAnimation = true;
  
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