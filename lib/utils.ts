import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
 
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function setLocal(key: string, value: string) {
  localStorage.setItem('ttpro.'+key, value);
}


export function getLocal(key: string) {
  localStorage.getItem('ttpro.'+key);
}

export function removeLocal(key: string) {
  localStorage.removeItem('ttpro.'+key);
}

export function clearLocal() {
  localStorage.clear();
}