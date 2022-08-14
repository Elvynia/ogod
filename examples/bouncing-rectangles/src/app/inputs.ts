import { buffer, filter, fromEvent, map } from "rxjs";

export class KeyUtil {

    /**
     * keyToCode(keyName: string)
     *
     * @param keyName {string} - The keyName of the key you wish to get the code for.
     *
     * @return {number} - Will be the keycode of the given keyName, or -1 if it does not exist in
     *  the set of known keys.
     */
    public static keyToCode(keyName: string): number {
        if (KeyUtil.keyNames.hasOwnProperty(keyName)) {
            return KeyUtil.keyNames[keyName];
        } else {
            return -1;
        }
    };

    /**
     * codeToKey(code: string)
     *
     * @param code {string} - The key code to lookup the keyname for
     *
     * @reaturn {string} - Will be the keyname of the given Code or '' if it does not
     * exist on the set of known codes.
     */
    public static codeToKey(code: string): string {
        if (KeyUtil.keyCodes.hasOwnProperty(code)) {
            return KeyUtil.keyCodes[code];
        } else {
            return '';
        }
    };

    private static keyNames = {
        "0": 48,
        "1": 49,
        "2": 50,
        "3": 51,
        "4": 52,
        "5": 53,
        "6": 54,
        "7": 55,
        "8": 56,
        "9": 57,
        "spacebar": 32,
        "backspace": 8,
        "tab": 9,
        "enter": 13,
        "shift": 16,
        "ctrl": 17,
        "alt": 18,
        "pause_break": 19,
        "caps_lock": 20,
        "escape": 27,
        "page_up": 33,
        "page_down": 34,
        "end": 35,
        "home": 36,
        "left_arrow": 37,
        "up_arrow": 38,
        "right_arrow": 39,
        "down_arrow": 40,
        "insert": 45,
        "delete": 46,
        "a": 65,
        "b": 66,
        "c": 67,
        "d": 68,
        "e": 69,
        "f": 70,
        "g": 71,
        "h": 72,
        "i": 73,
        "j": 74,
        "k": 75,
        "l": 76,
        "m": 77,
        "n": 78,
        "o": 79,
        "p": 80,
        "q": 81,
        "r": 82,
        "s": 83,
        "t": 84,
        "u": 85,
        "v": 86,
        "w": 87,
        "x": 88,
        "y": 89,
        "z": 90,
        "left_window_key": 91,
        "right_window_key": 92,
        "select_key": 93,
        "numpad_0": 96,
        "numpad_1": 97,
        "numpad_2": 98,
        "numpad_3": 99,
        "numpad_4": 100,
        "numpad_5": 101,
        "numpad_6": 102,
        "numpad_7": 103,
        "numpad_8": 104,
        "numpad_9": 105,
        "multiply": 106,
        "add": 107,
        "subtract": 109,
        "decimal_point": 110,
        "divide": 111,
        "f1": 112,
        "f2": 113,
        "f3": 114,
        "f4": 115,
        "f5": 116,
        "f6": 117,
        "f7": 118,
        "f8": 119,
        "f9": 120,
        "f10": 121,
        "f11": 122,
        "f12": 123,
        "num_lock": 144,
        "scroll_lock": 145,
        "semi_colon": 186,
        "equal_sign": 187,
        "comma": 188,
        "dash": 189,
        "period": 190,
        "forward_slash": 191,
        "grave_accent": 192,
        "open_bracket": 219,
        "back_slash": 220,
        "close_braket": 221,
        "single_quote": 222
    };

    private static keyCodes = {
        "8": "backspace",
        "9": "tab",
        "13": "enter",
        "16": "shift",
        "17": "ctrl",
        "18": "alt",
        "19": "pause_break",
        "20": "caps_lock",
        "27": "escape",
        "32": "spacebar",
        "33": "page_up",
        "34": "page_down",
        "35": "end",
        "36": "home",
        "37": "left_arrow",
        "38": "up_arrow",
        "39": "right_arrow",
        "40": "down_arrow",
        "45": "insert",
        "46": "delete",
        "48": "0",
        "49": "1",
        "50": "2",
        "51": "3",
        "52": "4",
        "53": "5",
        "54": "6",
        "55": "7",
        "56": "8",
        "57": "9",
        "65": "a",
        "66": "b",
        "67": "c",
        "68": "d",
        "69": "e",
        "70": "f",
        "71": "g",
        "72": "h",
        "73": "i",
        "74": "j",
        "75": "k",
        "76": "l",
        "77": "m",
        "78": "n",
        "79": "o",
        "80": "p",
        "81": "q",
        "82": "r",
        "83": "s",
        "84": "t",
        "85": "u",
        "86": "v",
        "87": "w",
        "88": "x",
        "89": "y",
        "90": "z",
        "91": "left_window_key",
        "92": "right_window_key",
        "93": "select_key",
        "96": "numpad_0",
        "97": "numpad_1",
        "98": "numpad_2",
        "99": "numpad_3",
        "100": "numpad_4",
        "101": "numpad_5",
        "102": "numpad_6",
        "103": "numpad_7",
        "104": "numpad_8",
        "105": "numpad_9",
        "106": "multiply",
        "107": "add",
        "109": "subtract",
        "110": "decimal_point",
        "111": "divide",
        "112": "f1",
        "113": "f2",
        "114": "f3",
        "115": "f4",
        "116": "f5",
        "117": "f6",
        "118": "f7",
        "119": "f8",
        "120": "f9",
        "121": "f10",
        "122": "f11",
        "123": "f12",
        "144": "num_lock",
        "145": "scroll_lock",
        "186": "semi_colon",
        "187": "equal_sign",
        "188": "comma",
        "189": "dash",
        "190": "period",
        "191": "forward_slash",
        "192": "grave_accent",
        "219": "open_bracket",
        "220": "back_slash",
        "221": "close_braket",
        "222": "single_quote"
    };
}

export const keysDown$ = fromEvent(document, 'keydown').pipe(
    map((event: KeyboardEvent) => {
        const name = KeyUtil.codeToKey('' + event.keyCode);
        if (name !== '') {
            let keyMap = {};
            keyMap[name] = event.code;
            return keyMap;
        } else {
            return undefined;
        }
    }),
    filter((keyMap) => keyMap !== undefined)
);

export const makeKeysDownPerFrame = (frames$) => keysDown$.pipe(
    buffer(frames$),
    map((frames: Array<any>) => {
        return frames.reduce((acc, curr) => {
            return Object.assign(acc, curr);
        }, {});
    })
);
