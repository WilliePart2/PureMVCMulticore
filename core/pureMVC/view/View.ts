import {INotifier} from "../interfaces/INotifier";
import {INotification} from "../interfaces/INotification";
import {Mediator} from "../mediator/Mediator";
import {IMediatorMap} from "../interfaces/IInstancesMap";
import {Notification} from "../notification/Notification";
import {Observer} from "../observer/Observer";

type ListenItem = [Mediator, string];

export class View {
    facadeKey: string;
    mediatorsMap: IMediatorMap = {} as IMediatorMap;
    listenNotification: ListenItem[] = [] as ListenItem[];
    moduleWideObserver: Observer<View> = null;

    constructor (key: string) {
        this.facadeKey = key;
        this.moduleWideObserver = Observer.getInstance(this.facadeKey);
    }

    registerMediator (key: string, instance: Mediator) {
        instance.facadeKey = this.facadeKey;
        this.mediatorsMap[key] = instance;

        let listenNotification: Notification<any>[] = instance.listNotificationInterests();
        listenNotification.forEach((notification: Notification<any>) => {
            this.listenNotification.push([instance, notification.name]);

            /**
             * Create observer as general communication point
             */
            this.moduleWideObserver.listenNotification(notification.name, this.notifyMediator, this);
        });
    }

    retrieveMediator (key: string) {
        return this.mediatorsMap[key];
    }

    /**
     * Think about do we need to register several handlers for one notification?
     * For now we could not register several handlers!
     * @param notification
     */
    async notifyMediator (notification: Notification<any>): Promise<any> {
        let nName: string = notification.name;

        if (this.mediatorsMap[nName]) {
            let handlersList: Mediator[] = [];
            this.listenNotification.forEach((listenItem: ListenItem) => {
                if (listenItem[1] === nName) {
                    handlersList.push(listenItem[0]);
                }
            });

            /**
             * I think that it is impossible case
             */
            if (handlersList.length > 1) {
                return [
                    handlersList.map((mediator: Mediator) => mediator.handleNotification(notification))
                ];
            }
            let handler = handlersList.shift();
            return handler.handleNotification(notification);
        }
    }
}
