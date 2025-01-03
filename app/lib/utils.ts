import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function asJweKey(secret: string) {
  if (!/^[a-fA-F0-9]{64}$/.test(secret)) {
    throw new Error('Secret must be a 64 character hex string');
  }
  return new Uint8Array(Buffer.from(secret, 'hex'));
}