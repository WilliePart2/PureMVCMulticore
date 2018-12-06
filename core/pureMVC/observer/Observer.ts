import {INotification} from "../interfaces/INotification";
import {INotificationMap, IObserverMap} from "../interfaces/IInstancesMap";

export class Observer<T> {
    static observersMap: IObserverMap = {} as IObserverMap;
    multitonKey: string;
    notificationList: INotificationMap = {} as INotificationMap;
    private notificationContext: T;
    private notificationMethod: any;
    isActive: boolean = false;

    static getInstance<T>(key: any) {
        if (!Observer.observersMap[key]) {
            Observer.observersMap[key] = new this<T>(key);
        }
        return Observer.observersMap[key];
    }

    constructor (key: string) {
        this.multitonKey = key;
    }

    listenNotification (notificationName: string, notificationMethod: Function, notificationContext: any) {
        let _notificationName: string = this.getObserverName(notificationName);
        let observer: Observer<any> = Observer.getInstance<any>(_notificationName);
        observer.setNotificationMethod(notificationMethod);
        observer.setNotificationContext(notificationContext);
        observer.isActive = true;
    }

    getListener (eventName: string) {
        return Observer.getInstance(this.getObserverName(eventName));
    }

    private setNotificationContext (ctx: T) {
        this.notificationContext = ctx
    }

    private setNotificationMethod (method: any) {
        this.notificationMethod = method;
    }

    notifyObserver (notification: INotification): Promise<any> {
        return this.notificationMethod.call(this.notificationContext, notification);
    }

    private getObserverName (namePart: string): string {
        return [this.multitonKey, "_", namePart].join();
    }
}
