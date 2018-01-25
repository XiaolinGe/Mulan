import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {Subject} from 'rxjs/Subject';
import {User} from "../models/user.model";

@Injectable()
export class MessageService {
  private subject = new Subject<any>();

  sendUser(user: User) {
    this.subject.next(user);
  }

  clear() {
    this.subject.next();
  }

  getUser(): Observable<User> {
    return this.subject.asObservable();
  }
}
