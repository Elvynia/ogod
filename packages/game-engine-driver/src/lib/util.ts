import { FrameData } from "./frame.data";

/**
 * clampTo30FPS(frame)
 *
 * @param frame - {FrameData} the frame data to check if we need to clamp to max of
 *  30fps time.
 *
 * If we get sporadic LONG frames (browser was navigated away or some other reason the frame takes a while) we want to throttle that so we don't JUMP ahead in any deltaTime calculations too far.
 */
export const clampTo30FPS = (frame: FrameData) => {
    if (frame.deltaTime > (1 / 30)) {
        frame.deltaTime = 1 / 30;
    }
    return frame;
}
