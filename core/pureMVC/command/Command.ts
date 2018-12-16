import {IExecutable} from "../interfaces/IExecutable";
import {INotification} from "../interfaces/INotification";
import {FacadeMember} from "../core/FacadeMember";
import {Notification} from "../notification/Notification";

export class Command extends FacadeMember implements IExecutable {
    /**
     * @abstract
     * @param notification
     */
    async execute (notification: Notification<any>): Promise<any> {

    }
}
