import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {AccountService} from "../../../services/account.service";
import {User} from "../../../models/user.model";
import {AuthenticationService} from "../../../services/authentication.service";

@Component({
  selector: 'mrp-profile',
  encapsulation: ViewEncapsulation.None,
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  providers: []
})
export class ProfileComponent implements OnInit {
  user: User = new User();
  constructor(public authService: AuthenticationService) {
  }

  ngOnInit() {
    this.getUser();
  }

  getUser() {
    this.user = this.authService.getUserInfo();
    console.log(this.user);
  }

}
