import {Command} from "./Command";
import {Facade} from "../facade/Facade";
import {INotifier} from "../interfaces/INotifier";
import {Notification} from "../notification/Notification";

export class BaseCommand extends Command {
    async sendNotficationToModule <T extends Notification<any>>(moduleName: string, notification: T, notificationBody?: T[keyof T], notificationType?: string) {
        if (Facade.hasCore(moduleName)) {
            return await (Facade.getInstance(moduleName) as INotifier).sendNotification(notification, notificationBody, notificationType as string);
        }
    }

    async sendNotificationToModules <T extends Notification<any>>(modulesNames: string[], notification: T, notificationBody?: T[keyof T], notificationType?: string) {
        let executionPromises = modulesNames.map((moduleName: string) => {
            return this.sendNotficationToModule(moduleName, notification, notificationBody, notificationType);
        });

        return await Promise.all(executionPromises);
    }

    async sendNotificationToAll <T extends Notification<any>>(notification: T, notificationBody?: T[keyof T], notificationType?: string) {
        let facadeKeys: string [] = [];
        for (let key in Facade.instancesMap) {
            facadeKeys.push(key);
        }

        return await this.sendNotificationToModules(facadeKeys, notification, notificationBody, notificationType);
    }
}
