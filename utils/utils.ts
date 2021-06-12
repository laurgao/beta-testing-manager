import { useEffect, useRef } from "react";

export const fetcher = url => fetch(url).then(res => res.json());

export function cleanForJSON(input: any): any {
    return JSON.parse(JSON.stringify(input));
}

export function useKey(key, cb) {
    const callbackRef = useRef(cb);

    useEffect(() => {
        callbackRef.current = cb;
    })

    useEffect(() => {
      const handleKeyPress = (e) => {
        if(e.code === key) {
            callbackRef.current(e)
        }
      }

      document.addEventListener("keypress", handleKeyPress)
      return () => document.removeEventListener("keypress", handleKeyPress)
    }, [key])
}

export function waitForEl(selector) {
    const input = document.getElementById(selector);
    if (input) {
        input.focus();
    } else {
        setTimeout(function() {
            waitForEl(selector);
        }, 100);
    }
};