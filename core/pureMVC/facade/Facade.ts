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
import {getValue} from "../../../../src/game.core/utils/get.value";

export class Facade implements IExecutable, INotifier {
    static instancesMap: IFacadeMap = {} as IFacadeMap;
    facadeKey: string;
    observer: Observer<any> = null;
    controller: Controller = null;
    model: Model = null;
    view: View = null;

    static getInstance (facadeKey: string): Facade {
        if (Facade.instancesMap[facadeKey]) {
            return Facade.instancesMap[facadeKey];
        }
        Facade.instancesMap[facadeKey] = new this(facadeKey);
        return Facade.instancesMap[facadeKey];
    }

    static hasCore (facadeKey: string): boolean {
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

    registerCommand (triggerNotification: Notification<any>, command: typeof Command): void {
        this.controller.registerCommand(triggerNotification.name, command);
    }

    async sendNotification <T extends Notification<any>>(notification: T, body?: T[keyof T], type?: string): Promise<any> {
        let _notification: Notification<T> = new Notification(
            notification.name,
            getValue(body || notification.body),
            type || notification.type
        );
        let notificationObserver = this.observer.getListener(_notification.name);
        if (notificationObserver.isActive) {
            return await notificationObserver.notifyObserver(_notification);
        }
    }

    registerMediator (key: string, mediator: Mediator): void {
        mediator.setMediatorKey(key);
        mediator.onInit();
        this.view.registerMediator(key, mediator);
    }

    retrieveMediator (key: string): Mediator {
        return this.view.retrieveMediator(key);
    }

    dropMediator (key: string): void {
        this.view.dropMediator(key);
    }

    registerProxy (key: string, proxy: typeof Proxy, initialData?: any): void {
        this.model.registerProxy(key, new proxy(this.facadeKey, initialData));
    }

    retrieveProxy (key: string): Proxy {
        return this.model.retrieveProxy(key);
    }
}
