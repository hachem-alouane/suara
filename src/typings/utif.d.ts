declare module 'utif' {
  export function decode(buf: ArrayBuffer | Uint8Array): any[];
  export function decodeImage(buf: ArrayBuffer | Uint8Array, ifd: any): void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  export function toRGBA8(ifd: any): Uint8ClampedArray;
}
