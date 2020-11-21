import { instanceChanges } from "@ogod/common";

export const configurePlayer = (ww: Worker) => {
    const keys = {
        left: false,
        right: false,
        jump: false
    };
    let previousTx, tx = 0;
    let previousJump = false;
    const onKeyDown = (e) => {
        if (e.code === 'KeyD' && !keys.right) {
            keys.right = true;
        } else if (e.code === 'KeyA' && !keys.left) {
            keys.left = true;
        } else if (e.code === 'Space' && !keys.jump) {
            keys.jump = true;
        }
        checkState();
    }
    const onKeyUp = (e) => {
        if (e.code === 'KeyD' && keys.right) {
            keys.right = false;
        } else if (e.code === 'KeyA' && keys.left) {
            keys.left = false;
        } else if (e.code === 'Space') {
            keys.jump = false;
        }
        checkState();
    }
    const checkState = () => {
        if (keys.left) {
            tx = -20;
        } else if (keys.right) {
            tx = 20;
        } else {
            tx = 0;
        }
        const changes: any = {};
        if (previousTx !== tx) {
            previousTx = tx;
            changes.tx = tx;
        }
        if (keys.jump  !== previousJump) {
            previousJump = keys.jump;
            changes.jumping = keys.jump;
        }
        if (Object.keys(changes).length > 0) {
            ww.postMessage(instanceChanges({
                id: 'finn',
                changes
            }));
        }
    };
    window.addEventListener("keydown", onKeyDown, false);
    window.addEventListener("keyup", onKeyUp, false);
};