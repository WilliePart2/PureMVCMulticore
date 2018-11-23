import {INotification} from "./INotification";
import {Notification} from "../notification/Notification";

export interface INotifier {
    // sendNotification (notification: INotification): any;
    // sendNotification <T>(name: string, body?: T[keyof T], type?: string): any;
    sendNotification <T extends Notification<any>>(notification: T, body?: T[keyof T], type?: string): any;
}