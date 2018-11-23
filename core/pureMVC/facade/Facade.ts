import {Controller} from "../controller/Controller";
import {Model} from "../model/Model";
import {View} from "../view/View";
import {IExecutable} from "../interfaces/IExecutable";
import {INotifier} from "../interfaces/INotifier";
import {IFacadeMap} from "../interfaces/IInstancesMap";
import {INotification} from "../interfaces/INotification";
import {Notification} from "../notification/Notification";
import {Command} from "../command/Command";
import {Mediator} from "../mediator/Mediator";
import {Proxy} from "../Proxy";
import {Observer} from "../observer/Observer";

export class Facade implements IExecutable, INotifier {
    // static instancesMap: IFacadeMap = new Map<string, Facade>() as any;
    static instancesMap: any;
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

    registerCommand (key: string, command: typeof Command) {
        this.controller.registerCommand(key, command);
    }


    // async sendNotification (notification: INotification): Promise<any>;
    async sendNotification <T extends Notification<any>>(notification: T, body?: T[keyof T], type?: string): Promise<any> {
        notification.body = body;
        // return await this.controller.sendNotification(notification);
        let notificationObserver = this.observer.getListener(notification.name);
        return await notificationObserver.notifyObserver(notification);
    }

    // protected createNotification <T>(name: string, body: any, type: string): Notification<T> {
    //     return new Notification<T>(name, body, type);
    // }

    registerMediator (key: string, mediator: typeof Mediator) {
        this.view.registerMediator(key, new mediator(this.facadeKey));
    }

    retrieveMediator (key: string) {
        return this.view.retrieveMediator(key);
    }

    registerProxy (key: string, proxy: typeof Proxy, initialData: any) {
        this.model.registerProxy(key, new proxy(this.facadeKey, initialData));
    }

    retrieveProxy (key: string) {
        return this.model.retrieveProxy(key);
    }
}
