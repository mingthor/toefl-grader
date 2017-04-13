import { Component, Input } from '@angular/core';
import { FirebaseObjectObservable } from 'angularfire2';

@Component({
  selector: 'question-detail',
  template: `
    <div *ngIf="question">
      <h2>Question {{question.id}} details!</h2>
      <div><label>category: </label>{{question.category}}</div>
      <div>
        <label>text: </label>
        <input [(ngModel)]="question.text" placeholder="text"/>
      </div>
    </div>
  `
})
export class QuestionDetailComponent {
  @Input() question: FirebaseObjectObservable<any>;
}