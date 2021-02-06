import { ogodFactoryInstanceBoolean, ogodFactoryInstanceChildren, ogodFactoryInstanceProperty } from "@ogod/element-core";
import { html, render } from "hybrids";

export function threeHybridControlFly() {
    return {
        keys: ogodFactoryInstanceChildren('keys'),
        mouseDown: ogodFactoryInstanceBoolean(false),
        movementSpeed: ogodFactoryInstanceProperty(1),
        rollSpeed: ogodFactoryInstanceProperty(0.005),
        dragToLook: ogodFactoryInstanceBoolean(false),
        autoForward: ogodFactoryInstanceBoolean(false),
        speedMultiplier: ogodFactoryInstanceProperty(10),
        render: render((host) => html`
            <ogod-keys active>
                <ogod-key code="ShiftLeft" name="shift"></ogod-key>
                <ogod-key code="Space" name="up"></ogod-key>
                <ogod-key code="KeyC" name="down"></ogod-key>
                <ogod-key code="KeyA" name="left"></ogod-key>
                <ogod-key code="KeyD" name="right"></ogod-key>
                <ogod-key code="KeyW" name="forward"></ogod-key>
                <ogod-key code="KeyS" name="back"></ogod-key>
                <ogod-key code="ArrowUp" name="pitchUp"></ogod-key>
                <ogod-key code="ArrowDown" name="pitchDown"></ogod-key>
                <ogod-key code="ArrowLeft" name="yawLeft"></ogod-key>
                <ogod-key code="ArrowRight" name="yawRight"></ogod-key>
                <ogod-key code="KeyQ" name="rollLeft"></ogod-key>
                <ogod-key code="KeyE" name="rollRight"></ogod-key>
            </ogod-keys>
            <slot></slot>
        `)
    }
}
