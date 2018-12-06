import {BaseCommand} from "../../../core/pureMVC/command/BaseCommand";
import {INotification} from "../../../core/pureMVC/interfaces/INotification";
import {Notification} from "../../../core/pureMVC/notification/Notification";

export class ExampleModule extends BaseCommand {
    async execute(notification: Notification<any>): Promise<any> {
        super.execute(notification);

        this.registerCommands();
        this.registerProxies();
        this.registerMediators();
    }

    registerCommands () {

    }

    registerProxies () {

    }

    registerMediators () {

    }
}
