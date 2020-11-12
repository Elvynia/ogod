import { instanceChanges } from "@ogod/common";

export const configurePlayer = (ww: Worker) => {
    const keys = {
        left: false,
        right: false,
        jump: false
    };
    let previousVelocity, velocity = 0;
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
            velocity = -8;
        } else if (keys.right) {
            velocity = 8;
        } else {
            velocity = 0;
        }
        const changes: any = {};
        if (previousVelocity !== velocity) {
            previousVelocity = velocity;
            changes.velocity = velocity;
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