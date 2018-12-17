import {Command} from "./Command";
import {Facade} from "../facade/Facade";
import {INotifier} from "../interfaces/INotifier";
import {Notification} from "../notification/Notification";

export class BaseCommand extends Command {
    async sendNotficationToModule <T extends Notification<any>>(module: Notification<any>, notification: T, notificationBody?: T[keyof T], notificationType?: string) {
        let moduleName: string = module.name;
        if (Facade.hasCore(moduleName)) {
            return await (Facade.getInstance(moduleName) as INotifier).sendNotification(notification, notificationBody, notificationType as string);
        }
    }

    async sendNotificationToModules <T extends Notification<any>>(modules: Notification<any>[], notification: T, notificationBody?: T[keyof T], notificationType?: string) {
        let executionPromises = modules.map((module: Notification<any>) => {
            return this.sendNotficationToModule(module, notification, notificationBody, notificationType);
        });

        return await Promise.all(executionPromises);
    }

    async sendNotificationToAll <T extends Notification<any>>(notification: T, notificationBody?: T[keyof T], notificationType?: string) {
        let facadeKeys: Notification<any> [] = [];
        for (let key in Facade.instancesMap) {
            facadeKeys.push(new Notification(key));
        }

        return await this.sendNotificationToModules(facadeKeys, notification, notificationBody, notificationType);
    }
}
