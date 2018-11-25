import {INotification} from "../interfaces/INotification";
import {ICommandMap} from "../interfaces/IInstancesMap";
import {Command} from "../command/Command";
import {Observer} from "../observer/Observer";

export class Controller {
    facadeKey: string;
    commandsMap: ICommandMap = {} as ICommandMap;
    moduleWideObserver: Observer<Controller>;

    constructor (facadeKey: string) {
        this.facadeKey = facadeKey;
        this.moduleWideObserver = Observer.getInstance<Controller>(this.facadeKey);
    }

    async notifyCommand (notification: INotification) {
        let nName: string = notification.name;

        if (this.commandsMap[nName]) {
            let command: typeof Command = this.commandsMap[nName] as typeof Command;
            let commandInstance: Command = new command(this.facadeKey);
            return await commandInstance.execute(notification as INotification);
        }
    }

    registerCommand (key: string, command: typeof Command): void {
        this.commandsMap[key] = command;
        this.moduleWideObserver.listenNotification(key, this.notifyCommand, this);
    }
}
