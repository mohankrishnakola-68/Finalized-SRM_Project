/**
 * ps4-controller.js 
 * Standalone Advanced PS4 Controller Driver for Surgical Simulation
 * 
 * Features: 
 * - Dual-Joystick Surgical Manipulation
 * - D-Pad Organ Rotation (80ms Debounce)
 * - L1: Haptic Toggle (activateHaptics)
 * - L2: Push-to-Talk Intercom
 * - R1/R2: Snapshot & DVR Recording
 */

export default class PS4Controller {
    constructor(callbacks = {}) {
        this.callbacks = callbacks;
        this.prevButtons = Array(20).fill(false);
        this.lastDpadTime = 0;
        this.frameId = null;
        this.active = false;
        
        // Internal States
        this.hapticsEngaged = false;
        this.isRecording = false;

        this.startPolling();
    }

    startPolling() {
        this.active = true;
        const poll = () => {
            if (!this.active) return;
            const gamepads = navigator.getGamepads ? navigator.getGamepads() : [];
            const gp = gamepads[0];

            if (gp) {
                this.handleJoysticks(gp);
                this.handleButtons(gp);
                this.handleDPad(gp);
            }
            this.frameId = requestAnimationFrame(poll);
        };
        this.frameId = requestAnimationFrame(poll);
    }

    handleJoysticks(gp) {
        const axisX = gp.axes[0];
        const axisY = gp.axes[1];
        if (Math.abs(axisX) > 0.1 || Math.abs(axisY) > 0.1) {
            if (this.callbacks.onMove) this.callbacks.onMove(axisX, axisY);
        }
    }

    handleDPad(gp) {
        const now = performance.now();
        if (now - this.lastDpadTime > 80) { // 80ms Debounce Check
            let moved = false;
            // 12: Up, 13: Down, 14: Left, 15: Right
            if (gp.buttons[12]?.pressed) { if (this.callbacks.onRotate) this.callbacks.onRotate('x', 0.1); moved = true; }
            if (gp.buttons[13]?.pressed) { if (this.callbacks.onRotate) this.callbacks.onRotate('x', -0.1); moved = true; }
            if (gp.buttons[14]?.pressed) { if (this.callbacks.onRotate) this.callbacks.onRotate('y', 0.1); moved = true; }
            if (gp.buttons[15]?.pressed) { if (this.callbacks.onRotate) this.callbacks.onRotate('y', -0.1); moved = true; }
            
            if (moved) this.lastDpadTime = now;
        }
    }

    handleButtons(gp) {
        // L1: Haptic Activation (Button 4)
        const isL1 = gp.buttons[4]?.pressed;
        if (isL1 && !this.prevButtons[4]) {
            this.hapticsEngaged = !this.hapticsEngaged;
            if (this.callbacks.activateHaptics) this.callbacks.activateHaptics(this.hapticsEngaged);
        }
        this.prevButtons[4] = isL1;

        // L2: Push-to-Talk (Button 6)
        const isL2 = gp.buttons[6]?.pressed;
        if (isL2 && !this.prevButtons[6]) {
            if (this.callbacks.onPTTStart) this.callbacks.onPTTStart();
        } else if (!isL2 && this.prevButtons[6]) {
            if (this.callbacks.onPTTStop) this.callbacks.onPTTStop();
        }
        this.prevButtons[6] = isL2;

        // X Button: Cutting Action (Button 0)
        const isX = gp.buttons[0]?.pressed;
        if (isX !== this.prevButtons[0]) {
            if (this.callbacks.onAction) this.callbacks.onAction(isX);
        }
        this.prevButtons[0] = isX;

        // R1: Snapshot (Button 5)
        const isR1 = gp.buttons[5]?.pressed;
        if (isR1 && !this.prevButtons[5]) {
            if (this.callbacks.onCapture) this.callbacks.onCapture();
        }
        this.prevButtons[5] = isR1;

        // R2: Video Toggle (Button 7)
        const isR2 = gp.buttons[7]?.pressed;
        if (isR2 && !this.prevButtons[7]) {
            this.isRecording = !this.isRecording;
            if (this.callbacks.onVideoToggle) this.callbacks.onVideoToggle(this.isRecording);
        }
        this.prevButtons[7] = isR2;
    }

    stop() {
        this.active = false;
        cancelAnimationFrame(this.frameId);
    }
}
