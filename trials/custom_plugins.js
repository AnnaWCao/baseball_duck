// trials/custom_plugins.js
// Shared drag-input helper, ported from CFL1/star_farm/trials/custom_plugins.js.
//
// Unlike star_farm (where this file existed but the shipped index.html reimplemented
// pointer handling inline instead of using it), baseball_duck actually wires this
// helper up: every draggable sprite (apple, duck) in index.html is driven by
// attachUnifiedInput() so the drag/release/re-drag/lock logic is written once.
//
// INPUT COMPATIBILITY: prefers pointer events (mouse, touch, pen in one code path,
// all modern browsers + iPadOS 13+); falls back to paired mouse+touch listeners
// otherwise. Ignores extra simultaneous touches (e.g. a resting palm) so only the
// first active finger drives the drag.

function attachUnifiedInput(element, handlers) {
    const usePointerEvents = window.PointerEvent !== undefined;

    // Track the current active pointer/touch so we can ignore multi-touch.
    let activePointerId = null;

    const normalizeEvent = (e) => {
        if (e.touches !== undefined) {
            const t = e.changedTouches[0] || e.touches[0];
            return {
                clientX: t.clientX,
                clientY: t.clientY,
                pointerId: t.identifier,
                originalEvent: e,
                preventDefault: () => e.preventDefault()
            };
        } else {
            return {
                clientX: e.clientX,
                clientY: e.clientY,
                pointerId: e.pointerId !== undefined ? e.pointerId : 0,
                originalEvent: e,
                preventDefault: () => e.preventDefault()
            };
        }
    };

    const cleanup = [];

    if (usePointerEvents) {
        const onDown = (e) => {
            if (activePointerId !== null) return;
            activePointerId = e.pointerId;
            try { element.setPointerCapture(e.pointerId); } catch (err) {}
            handlers.down(normalizeEvent(e));
        };
        const onMove = (e) => {
            if (e.pointerId !== activePointerId) return;
            handlers.move(normalizeEvent(e));
        };
        const onUp = (e) => {
            if (e.pointerId !== activePointerId) return;
            try { element.releasePointerCapture(e.pointerId); } catch (err) {}
            activePointerId = null;
            handlers.up(normalizeEvent(e));
        };

        element.addEventListener('pointerdown', onDown);
        element.addEventListener('pointermove', onMove);
        element.addEventListener('pointerup', onUp);
        element.addEventListener('pointercancel', onUp);

        cleanup.push(() => {
            element.removeEventListener('pointerdown', onDown);
            element.removeEventListener('pointermove', onMove);
            element.removeEventListener('pointerup', onUp);
            element.removeEventListener('pointercancel', onUp);
        });
    } else {
        let isDown = false;

        const onMouseDown = (e) => {
            if (e.button !== 0) return;
            isDown = true;
            handlers.down(normalizeEvent(e));
        };
        const onMouseMove = (e) => {
            if (!isDown) return;
            handlers.move(normalizeEvent(e));
        };
        const onMouseUp = (e) => {
            if (!isDown) return;
            isDown = false;
            handlers.up(normalizeEvent(e));
        };

        const onTouchStart = (e) => {
            if (activePointerId !== null) return;
            activePointerId = e.changedTouches[0].identifier;
            handlers.down(normalizeEvent(e));
        };
        const onTouchMove = (e) => {
            for (const t of e.changedTouches) {
                if (t.identifier === activePointerId) {
                    handlers.move(normalizeEvent(e));
                    break;
                }
            }
        };
        const onTouchEnd = (e) => {
            for (const t of e.changedTouches) {
                if (t.identifier === activePointerId) {
                    activePointerId = null;
                    handlers.up(normalizeEvent(e));
                    break;
                }
            }
        };

        element.addEventListener('mousedown', onMouseDown);
        window.addEventListener('mousemove', onMouseMove);
        window.addEventListener('mouseup', onMouseUp);

        element.addEventListener('touchstart', onTouchStart, { passive: false });
        element.addEventListener('touchmove', onTouchMove, { passive: false });
        element.addEventListener('touchend', onTouchEnd);
        element.addEventListener('touchcancel', onTouchEnd);

        cleanup.push(() => {
            element.removeEventListener('mousedown', onMouseDown);
            window.removeEventListener('mousemove', onMouseMove);
            window.removeEventListener('mouseup', onMouseUp);
            element.removeEventListener('touchstart', onTouchStart);
            element.removeEventListener('touchmove', onTouchMove);
            element.removeEventListener('touchend', onTouchEnd);
            element.removeEventListener('touchcancel', onTouchEnd);
        });
    }

    element.addEventListener('contextmenu', (e) => e.preventDefault());

    return {
        destroy: () => cleanup.forEach(fn => fn())
    };
}
