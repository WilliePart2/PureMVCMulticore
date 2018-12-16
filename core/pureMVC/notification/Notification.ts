import {INotification} from "../interfaces/INotification";
import { getValue } from "../utils/get.value";

/**
 * Typed notifications implemented as singleton.
 * Notification type determined by notification body type and functions which works with notification must capture type from notification through generic
 * Example <T>(notification: T, notificationBody?: T[keyof T], notificationType?: string)
 */
export class Notification<T> implements INotification {
    private readonly _name: string;
    get name (): string {
        return this._name;
    }

    private _body: T;
    get body (): T {
        return this._body;
    }
    set body (data: T) {
        this._body = data;
    }

    private readonly _type: string;
    get type (): string {
        return this._type;
    }

    /**
     *
     * @param {string} notificationName
     * @param {T} notificationBody
     * @param {string} notificationType - subname for more flexible using
     */
    static getInstance <T>(notificationName: string, notificationBody?: T, notificationType?: string): Notification<T> {
        return new this<T>(notificationName, notificationBody, notificationType);
    }

    constructor (name: string, body: T, type: string) {
        this._name = name;
        this._body = getValue(body);
        this._type = type;
    }
}
