import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';


//http://www.ebenmonney.com/blog/how-to-implement-remember-me-functionality-using-token-based-authentication-and-localstorage-in-a-web-application#toggleComments
@Injectable()
/**
 * saveSessionData: Save data into a single tab. Stuff you save with this is not available in other tabs
saveSyncedSessionData: Whatever you save with this function is available in all opened tabs. This is what you’ll use to save a user's Authentication Token when the user chooses not to "Remember Me"
savePermanentData: Whatever you save with this is permanently saved on disk and is available in all opened tabs. This is what you’ll use to save the Authentication token of a user who chooses to "Remember Me"
moveDataToSessionStorage: Moves data that is in other storage locations (i.e. permanent storage, synced session storage) to session storage. In session storage each tab has its data independent of other tabs
moveDataToSyncedSessionStorage: Moves data in other storage locations (i.e. permanent storage, session storage) to SyncedSessionStorage. Whatever is saved here is available in all opened tabs
moveDataToPermanentStorage: Moves data in other storage locations (i.e. session storage, synced session storage) to permanent storage
getData: Used to retrieve data from the data store
getDataObject<T>: Used to retrieve data from the data store. This method returns an object of type T. Use this when you saved an object to the data store, to have it return the object back to you
deleteData: Deletes data from the data store
raiseDBEvent: Ummm I'm not gonna talk about this. Just ignore it for the most part
getDBEventListener: Same as above. Ignore, or let me know in the comments if you’re interested in raising events in other tabs on data save
Critical! initialiseStorageSyncListener: This is the first thing you have to call before you use any functionality in this library. You can call this on Page Load. This hooks tab synchronization up
deinitialiseStorageSyncListener : You don’t really have to call this method, but call this when you want to unhook tab synchronization for some reason
IMPORTANT: Call initialiseStorageSyncListener once to setup this library. This will hook up synchronizing your data between multiple opened browser tabs. One place to do this is when the page loads for the first time.


Extra utility methods. Note that using the core methods above is enough, you don’t have to call any of these yourself

clearAllStorage: Clears everything in all data stores
clearAllSessionsStorage: Clears all session storage in all opened browser tabs. Permanent storage is not affected
clearInstanceSessionStorage: Clears all storage in the current browser tab only
clearLocalStorage: Clear permanent storage only. Session storage are not affected
 */
export class LocalStoreService {

    private static syncListenerInitialised = false;
    private syncKeys: string[] = [];
    private _dbEvent = new Subject<string>();

    private reservedKeys: string[] = ['sync_keys', 'addToSyncKeys', 'removeFromSyncKeys',
        'getSessionStorage', 'setSessionStorage', 'addToSessionStorage', 'removeFromSessionStorage', 'clearAllSessionsStorage', 'raiseDBEvent'];

    public static readonly DBKEY_USER_DATA = "user_data";
    private static readonly DBKEY_SYNC_KEYS = "sync_keys";


    //Todo: Implement EventListeners for the various event operations and a SessionStorageEvent for specific data keys

    public initialiseStorageSyncListener() {
        if (LocalStoreService.syncListenerInitialised == true)
            return;

        LocalStoreService.syncListenerInitialised = true;
        window.addEventListener("storage", this.sessionStorageTransferHandler, false);
        this.syncSessionStorage();
    }



    public deinitialiseStorageSyncListener() {

        window.removeEventListener("storage", this.sessionStorageTransferHandler, false);

        LocalStoreService.syncListenerInitialised = false;
    }




    private sessionStorageTransferHandler = (event: StorageEvent) => {

        if (!event.newValue)
            return;

        if (event.key == 'getSessionStorage') {

            if (sessionStorage.length) {
                localStorage.setItem('setSessionStorage', JSON.stringify(sessionStorage));
                localStorage.removeItem('setSessionStorage');
            }
        }
        else if (event.key == 'setSessionStorage') {

            if (!this.syncKeys.length)
                this.loadSyncKeys();

            let data = JSON.parse(event.newValue);

            for (let key in data) {

                if (this.syncKeysContains(key))
                    sessionStorage.setItem(key, data[key]);
            }

        }
        else if (event.key == 'addToSessionStorage') {

            let data = JSON.parse(event.newValue);
            this.addToSessionStorageHelper(data["data"], data["key"]);
        }
        else if (event.key == 'removeFromSessionStorage') {

            this.removeFromSessionStorageHelper(event.newValue);
        }
        else if (event.key == 'clearAllSessionsStorage' && sessionStorage.length) {

            this.clearInstanceSessionStorage();
        }
        else if (event.key == 'addToSyncKeys') {

            this.addToSyncKeysHelper(event.newValue);
        }
        else if (event.key == 'removeFromSyncKeys') {

            this.removeFromSyncKeysHelper(event.newValue);
        }
        else if (event.key == 'raiseDBEvent') {

            this.raiseDBEventHelper(event.newValue);
        }
    }





    private syncSessionStorage() {

        localStorage.setItem('getSessionStorage', '_dummy');
        localStorage.removeItem('getSessionStorage');
    }


    public clearAllStorage() {

        this.clearAllSessionsStorage();
        this.clearLocalStorage();
    }


    public clearAllSessionsStorage() {

        this.clearInstanceSessionStorage();
        localStorage.removeItem(LocalStoreService.DBKEY_SYNC_KEYS);

        localStorage.setItem('clearAllSessionsStorage', '_dummy');
        localStorage.removeItem('clearAllSessionsStorage');
    }


    public clearInstanceSessionStorage() {

        sessionStorage.clear();
        this.syncKeys = [];
    }


    public clearLocalStorage() {
        localStorage.clear();
    }




    private addToSessionStorage(data: string, key: string) {

        this.addToSessionStorageHelper(data, key);
        this.addToSyncKeysBackup(key);

        localStorage.setItem('addToSessionStorage', JSON.stringify({ key: key, data: data }));
        localStorage.removeItem('addToSessionStorage');
    }

    private addToSessionStorageHelper(data: string, key: string) {

        this.addToSyncKeysHelper(key);
        sessionStorage.setItem(key, data);
    }


    private removeFromSessionStorage(keyToRemove: string) {

        this.removeFromSessionStorageHelper(keyToRemove);
        this.removeFromSyncKeysBackup(keyToRemove);

        localStorage.setItem('removeFromSessionStorage', keyToRemove);
        localStorage.removeItem('removeFromSessionStorage');
    }


    private removeFromSessionStorageHelper(keyToRemove: string) {

        sessionStorage.removeItem(keyToRemove);
        this.removeFromSyncKeysHelper(keyToRemove);
    }


    private testForInvalidKeys(key: string) {

        if (!key)
            throw new Error("key cannot be empty")

        if (this.reservedKeys.some(x => x == key))
            throw new Error(`The storage key "${key}" is reserved and cannot be used. Please use a different key`);
    }


    private syncKeysContains(key: string) {

        return this.syncKeys.some(x => x == key);
    }


    private loadSyncKeys() {

        if (this.syncKeys.length)
            return;

        this.syncKeys = this.getSyncKeysFromStorage();
    }


    private getSyncKeysFromStorage(defaultValue: string[] = []): string[] {

        let data = localStorage.getItem(LocalStoreService.DBKEY_SYNC_KEYS);

        if (data == null)
            return defaultValue;
        else
            return <string[]>JSON.parse(data);
    }


    private addToSyncKeys(key: string) {

        this.addToSyncKeysHelper(key);
        this.addToSyncKeysBackup(key);

        localStorage.setItem('addToSyncKeys', key);
        localStorage.removeItem('addToSyncKeys');
    }


    private addToSyncKeysBackup(key: string) {

        let storedSyncKeys = this.getSyncKeysFromStorage();

        if (!storedSyncKeys.some(x => x == key)) {

            storedSyncKeys.push(key);
            localStorage.setItem(LocalStoreService.DBKEY_SYNC_KEYS, JSON.stringify(storedSyncKeys));
        }
    }

    private removeFromSyncKeysBackup(key: string) {

        let storedSyncKeys = this.getSyncKeysFromStorage();

        let index = storedSyncKeys.indexOf(key);

        if (index > -1) {
            storedSyncKeys.splice(index, 1);
            localStorage.setItem(LocalStoreService.DBKEY_SYNC_KEYS, JSON.stringify(storedSyncKeys));
        }
    }


    private addToSyncKeysHelper(key: string) {

        if (!this.syncKeysContains(key))
            this.syncKeys.push(key);
    }



    private removeFromSyncKeys(key: string) {

        this.removeFromSyncKeysHelper(key);
        this.removeFromSyncKeysBackup(key);

        localStorage.setItem('removeFromSyncKeys', key);
        localStorage.removeItem('removeFromSyncKeys');
    }


    private removeFromSyncKeysHelper(key: string) {

        let index = this.syncKeys.indexOf(key);

        if (index > -1) {
            this.syncKeys.splice(index, 1);
        }
    }


    public saveSessionData(data: string, key = LocalStoreService.DBKEY_USER_DATA) {

        this.testForInvalidKeys(key);

        this.removeFromSyncKeys(key);
        localStorage.removeItem(key);
        sessionStorage.setItem(key, data);
    }


    public saveSyncedSessionData(data: string, key = LocalStoreService.DBKEY_USER_DATA) {

        this.testForInvalidKeys(key);

        localStorage.removeItem(key);
        this.addToSessionStorage(data, key);
    }


    public savePermanentData(data: string, key = LocalStoreService.DBKEY_USER_DATA) {

        this.testForInvalidKeys(key);

        this.removeFromSessionStorage(key);
        localStorage.setItem(key, data);
    }



    public moveDataToSessionStorage(key = LocalStoreService.DBKEY_USER_DATA) {

        this.testForInvalidKeys(key);

        let data = this.getData(key);

        if (data == null)
            return;

        this.saveSessionData(data, key);
    }


    public moveDataToSyncedSessionStorage(key = LocalStoreService.DBKEY_USER_DATA) {

        this.testForInvalidKeys(key);

        let data = this.getData(key);

        if (data == null)
            return;

        this.saveSyncedSessionData(data, key);
    }


    public moveDataToPermanentStorage(key = LocalStoreService.DBKEY_USER_DATA) {

        this.testForInvalidKeys(key);

        let data = this.getData(key);

        if (data == null)
            return;

        this.savePermanentData(data, key);
    }


    public getData(key = LocalStoreService.DBKEY_USER_DATA) {

        this.testForInvalidKeys(key);

        let data = sessionStorage.getItem(key);

        if (data == null)
            data = localStorage.getItem(key);

        return data;
    }


    public getDataObject<T>(key = LocalStoreService.DBKEY_USER_DATA): T {

        let data = this.getData(key);

        if (data != null)
            return <T>JSON.parse(data);
        else
            return null;
    }


    public deleteData(key = LocalStoreService.DBKEY_USER_DATA) {

        this.testForInvalidKeys(key);

        this.removeFromSessionStorage(key);
        localStorage.removeItem(key);
    }



    raiseDBEvent(event: string) {
        this.raiseDBEventHelper(event);

        localStorage.setItem('raiseDBEvent', event);
        localStorage.removeItem('raiseDBEvent');
    }

    private raiseDBEventHelper(event: string) {
        this._dbEvent.next(event);
    }


    getDBEventListener(): Observable<string> {
        return this._dbEvent.asObservable();
    }
}