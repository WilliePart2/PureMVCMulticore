import {Controller} from "../controller/Controller";
import {Model} from "../model/Model";
import {View} from "../view/View";
import {IExecutable} from "../interfaces/IExecutable";
import {INotifier} from "../interfaces/INotifier";
import {IFacadeMap} from "../interfaces/IInstancesMap";
import {Notification} from "../notification/Notification";
import {Command} from "../command/Command";
import {Mediator} from "../mediator/Mediator";
import {Proxy} from "../Proxy";
import {Observer} from "../observer/Observer";

export class Facade implements IExecutable, INotifier {
    static instancesMap: IFacadeMap = {} as IFacadeMap;
    facadeKey: string;
    observer: Observer<any> = null;
    controller: Controller = null;
    model: Model = null;
    view: View = null;

    static getInstance (facadeKey: string) {
        if (Facade.instancesMap[facadeKey]) {
            return Facade.instancesMap[facadeKey];
        }
        Facade.instancesMap[facadeKey] = new this(facadeKey);
        return Facade.instancesMap[facadeKey];
    }

    static hasCore (facadeKey: string) {
        return !!this.instancesMap[facadeKey];
    }

    constructor (key: string) {
        this.facadeKey = key;

        this.initObserver();
        this.initController();
        this.initModel();
        this.initView();
        this.execute();
    }
    protected initObserver () {
        this.observer = Observer.getInstance(this.facadeKey);
    }

    protected initController () {
        this.controller = new Controller(this.facadeKey);
    }

    protected initModel () {
        this.model = new Model();
    }

    protected initView () {
        this.view = new View(this.facadeKey);
    }

    /**
     * @abstract
     * I think that we should not use it
     */
    execute (arg?: any): any {

    }

    registerCommand (triggerNotification: Notification<any>, command: typeof Command) {
        this.controller.registerCommand(triggerNotification.name, command);
    }

    async sendNotification <T extends Notification<any>>(notification: T, body?: T[keyof T], type?: string): Promise<any> {
        notification.body = body;
        let notificationObserver = this.observer.getListener(notification.name);
        if (notificationObserver.isActive) {
            return await notificationObserver.notifyObserver(notification);
        }
    }

    registerMediator (key: string, mediator: Mediator) {
        mediator.setMediatorKey(key);
        mediator.onInit();
        this.view.registerMediator(key, mediator);
    }

    retrieveMediator (key: string) {
        return this.view.retrieveMediator(key);
    }

    registerProxy (key: string, proxy: typeof Proxy, initialData?: any) {
        this.model.registerProxy(key, new proxy(this.facadeKey, initialData));
    }

    retrieveProxy (key: string) {
        return this.model.retrieveProxy(key);
    }
}
