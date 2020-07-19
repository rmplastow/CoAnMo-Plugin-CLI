interface String {
  padEnd(targetLength: number, padString?: string): string;
}

interface Array<T> {
  find(
    predicate: (value: T, index: number, obj: Array<T>) => boolean,
    thisArg?: any
  ): T | undefined;
}
