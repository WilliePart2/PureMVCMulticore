export function getValue <T = any>(value: T): T {
    let result;

    if (Array.isArray(value)) {
        result = [...value];
    } else if (typeof value === 'object') {
        result = {...(value as Object)};
    } else {
        result = value;
    }

    return result as T;
}
