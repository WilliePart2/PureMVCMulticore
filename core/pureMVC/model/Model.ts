import {IProxyMap} from "../interfaces/IInstancesMap";
import {Proxy} from "../Proxy";

export class Model {
    proxyMap: IProxyMap = {} as IProxyMap;

    registerProxy (key: string, instance: Proxy) {
        this.proxyMap[key] = instance;
    }

    retrieveProxy (key: string) {
        return this.proxyMap[key];
    }
}
