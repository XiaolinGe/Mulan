import {Observable} from 'rxjs/Observable';

export class HttpErrorHaddle {
    static handleError(error: Response) {
        console.error(error);
        if (error.status === 404 || error.status >= 500) {
            return Observable.throw({error: 'Our server is experiencing some error, please try again later.'});
        } else if (error.status === 401 ) {
            return Observable.throw({error: 'Login Id or password is wrong, please try again later.'});
        }else if (error.status === 403) {
            return Observable.throw({error: 'Your login is expired, please logout and re-login.'});
        } else {
            return Observable.throw({error: 'Something wrong happens, please logout and re-login.'});
        }
    }
}