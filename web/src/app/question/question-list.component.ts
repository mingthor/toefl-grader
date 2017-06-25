import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { FirebaseListObservable } from 'angularfire2';
import { DataService }  from '../data.service';
import { MdListModule } from '@angular/material';

@Component({
  templateUrl: './question-list.component.html',
  styleUrls: ['./question-list.component.css']
})
export class QuestionListComponent implements OnInit {

  questions: FirebaseListObservable<any>;
  selectedKey: string;
  section: string;

  constructor(
    private dataService: DataService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
        this.selectedKey = params['key'];
        this.section = params['section'];
        console.log("init key = " + this.selectedKey);
    });
    
    this.dataService.getQuestions(this.section).then(questions => this.questions = questions);
  }

  isSelected(key: string ) {
    return key === this.selectedKey;
  }

  onSelect(key: string) {
    console.log("key = " + key);
    this.router.navigate(['/problemsets/'+this.section, key]);
  }
}
