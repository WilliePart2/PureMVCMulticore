import {FacadeMember} from "../core/FacadeMember";
import {IInstancesMap} from "../interfaces/IInstancesMap";
import {INotifier} from "../interfaces/INotifier";
import {Notification} from "../notification/Notification";

export class Mediator<T = any> extends FacadeMember {
    static NAME: string;
    static ITEM_KEY = 0;
    static ITEM_PAYLOAD = 1;
    protected mediatorKey: string;
    clientProxiesMap: IInstancesMap<T> = {} as IInstancesMap<T>;

    setMediatorKey (mediatorKey: string): void {
        this.mediatorKey = mediatorKey;
    }

    init () {}

    registerClientObject (key: string, object: any) {
        this.clientProxiesMap[key] = object;
    }

    retrieveClientObject (key: string) {
        return this.clientProxiesMap[key];
    }

    /**
     * Mediator cat listen inner and outer notification
     * We could build relation as Notifier -> Mediator
     * @abstract
     */
    listNotificationInterests (): Notification<any>[] {
        return [] as Notification<any>[];
    };

    /**
     * We should register only distinct notification in module wide address space
     * @abstract
     * @param {Notification} notification
     */
    async handleNotification (notification: Notification<any>): Promise<any> {};

    async sendNotification <T extends Notification<any>>(notification: T, body?: T[keyof T], type?: string) {
        return await (this.facade() as INotifier).sendNotification(notification, body, type);
    }

    protected findItem <T>(storage: Array<[string, T]>, itemName: string): T | null {
        let item = storage.find((item: [string, T]) => {
            return item[Mediator.ITEM_KEY] === itemName;
        });

        if (item) {
            return item[Mediator.ITEM_PAYLOAD] as T;
        }

        return null;
    }
}
