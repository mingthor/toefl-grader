import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { AngularFire, FirebaseListObservable } from 'angularfire2';

import { AuthService } from '../auth.service';
import { DataService } from '../data.service';

@Component({
    selector: 'response-list',
    templateUrl: './response-list.component.html',
    styleUrls: ['../app.component.css']
})
export class ResponseListComponent implements OnInit {

    responses: FirebaseListObservable<any>;
    selectedKey: string;

    constructor(
        public af: AngularFire,
        private route: ActivatedRoute,
        private router: Router,
        private authService: AuthService,
        private dataService: DataService
    ) {}

    ngOnInit() {
        this.route.params.subscribe(params => {
            this.selectedKey = params['key'];
        });
        const uid = this.authService.currentUser.uid;
        console.log("ResponseList getUserResponses question: "+ this.selectedKey);
        this.dataService.getUserResponses(uid, this.selectedKey).then(responses =>this.responses = responses);
    }

    isSelected(key: string ) {
        return key === this.selectedKey;
    }

    onSelect(key: string) {
        this.selectedKey = key;
    }
}
