import {BaseCommand} from "../../../core/pureMVC/command/BaseCommand";
import {INotification} from "../../../core/pureMVC/interfaces/INotification";

export class ExampleModule extends BaseCommand {
    async execute(notification: INotification): Promise<any> {
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
