import {FacadeMember} from "../core/FacadeMember";
import {IClientProxiesMap} from "../interfaces/IInstancesMap";
import {Proxy} from "../Proxy";
import {INotifier} from "../interfaces/INotifier";
import {Notification} from "../notification/Notification";

export class Mediator extends FacadeMember {
    clientProxiesMap: IClientProxiesMap = {} as IClientProxiesMap;

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
}
