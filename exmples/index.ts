import {BaseCommand} from "../core/pureMVC/command/BaseCommand";
import {INotification} from "../core/pureMVC/interfaces/INotification";
import {Facade} from "../core/pureMVC/facade/Facade";
import {Notification} from "../core/pureMVC/notification/Notification";

export class Module extends Facade {
    async execute(notification: INotification): Promise<any> {
        super.execute(notification);

        this.registerCommands();
        this.registerProxy();
        this.registerMediators();
    }

    registerCommands () {
        this.registerCommand(UserActions.CREATE_ACCOUNT, UserResponsiveComand)
    }

    registerProxy () {

    }

    registerMediators () {

    }
}

class UserResponsiveComand extends BaseCommand {
    async execute(notification: INotification): Promise<any> {
        super.execute(notification);
        let nBody: any = notification.getBody();

        // console.log('Executed');
        this.sendNotficationToModule(ModuleNames.USER_MODULE, UserActions.CREATE_ACCOUNT, {username: 'Vasia'});
    }

    doSomething () {

    }

    andSomithing () {

    }
}

class UserActions {
    static CREATE_ACCOUNT =  Notification.getInstance<string>('CREATE_ACCOUNT');
    static DROP_ACCOUNT = Notification.getInstance<number>('DROP_ACCOUNT');
    static EDIT_ACCOUT = Notification.getInstance<boolean>('DROP_ACCOUNT');
}

const enum ModuleNames {
    USER_MODULE = 'DROP_ACCOUNT'
}

function registerModule (facadeKey: string, moduleRef: typeof Facade): Facade {
    return moduleRef.getInstance(facadeKey);
}

(async () => {
    let userModule: Facade = registerModule(ModuleNames.USER_MODULE, Module);
    let returnValue = await userModule.sendNotification(UserActions.CREATE_ACCOUNT, 'some');
})();