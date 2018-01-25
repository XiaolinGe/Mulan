
import {Component, ViewEncapsulation} from '@angular/core';
import {AuthenticationService} from "../../../services/authentication.service";
import {MessageService} from "../../../services/message.service";
import {User} from "../../../models/user.model";
import {Constants} from "../../../constants/app.constant";

@Component({
  selector: 'az-navbar',
  encapsulation: ViewEncapsulation.None,
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
  providers: []
})

export class NavbarComponent {
  public isCollapsed = true;
  public user: User;
  public isBroker: boolean;

  constructor(public authService: AuthenticationService,
              public messageService: MessageService) {
    this.isCollapsed = true;
    this.messageService.getUser().subscribe(resp => {
      this.checkIsBroker();
    });

    this.checkIsBroker();

  }

  checkIsBroker(){
    this.user = this.authService.getUserInfo();
    if (this.user && this.user.userType === Constants.USER.broker) {
      this.isBroker = true;
    } else {
      this.isBroker = false;
    }
  }

  public isIn = false;

  public toggleState() { // click handler for navbar toggle
    const bool = this.isIn;
    this.isIn = bool === false ? true : false;
  }

  public logout() {
    this.authService.logout();
    // this.router.navigate(['/login']);
  }
}
