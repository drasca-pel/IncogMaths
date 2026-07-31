import React, {
  useEffect,
  useRef,
  useState,
  forwardRef,
  useImperativeHandle
} from "react";

import "mathlive";

const BREAKPOINT = 640;
const STEP = 2;
const SCROLL_AMOUNT = 80; // px per arrow tap

function getFontBounds() {
  const isPhone = window.innerWidth < BREAKPOINT;
  return {
    max: isPhone ? 26 : 32,
    min: isPhone ? 20 : 24
  };
}

const MathEditor = forwardRef(({ value, onChange }, ref) => {
  const mathFieldRef = useRef(null);
  const viewportRef = useRef(null);

  const [fontSize, setFontSize] = useState(getFontBounds().max);

  function fitFont() {
    const field = mathFieldRef.current;
    const viewport = viewportRef.current;
    if (!field || !viewport) return;

    const { max, min } = getFontBounds();
    let size = max;
    field.style.fontSize = `${size}px`;

    requestAnimationFrame(() => {
      while (field.scrollWidth > viewport.clientWidth && size > min) {
        size -= STEP;
        field.style.fontSize = `${size}px`;
      }
      setFontSize(size);
    });
  }

  function toggleKeyboard() {
    mathFieldRef.current?.executeCommand("toggleVirtualKeyboard");
  }

  // Scroll the equation left/right without touching the caret or
  // triggering a selection — this only moves the viewport's scroll
  // position, it never calls focus() or any editing command.
  function scrollEquation(direction) {
    const viewport = viewportRef.current;
    if (!viewport) return;

    viewport.scrollBy({
      left: direction * SCROLL_AMOUNT,
      behavior: "smooth"
    });
  }

  useImperativeHandle(ref, () => ({
    insertFormula(latex) {
      const field = mathFieldRef.current;
      if (!field) return;

      field.focus();
      field.insert(latex);

      onChange(field.value);

      requestAnimationFrame(() => {
        fitFont();
      });
    }
  }));

  useEffect(() => {
    const field = mathFieldRef.current;
    if (!field) return;

    field.virtualKeyboardMode = "manual";
    field.smartMode = false;

    const handleInput = () => {
      onChange(field.value);
      requestAnimationFrame(() => {
        fitFont();
      });
    };

    const handleResize = () => {
      requestAnimationFrame(() => {
        fitFont();
      });
    };

    field.addEventListener("input", handleInput);
    window.addEventListener("resize", handleResize);

    requestAnimationFrame(() => {
      fitFont();
    });

    return () => {
      field.removeEventListener("input", handleInput);
      window.removeEventListener("resize", handleResize);
    };
  }, [onChange]);

  useEffect(() => {
    const field = mathFieldRef.current;
    if (!field) return;

    if (field.value !== value) {
      field.value = value || "";
    }

    requestAnimationFrame(() => {
      fitFont();
    });
  }, [value]);

  return (
    <div className="w-full min-w-0 rounded-[var(--radius)] bg-[var(--bg-panel)] border border-[var(--border)] overflow-hidden">
      <style>{`
        math-field::part(virtual-keyboard-toggle) {
          display: none;
        }
        /* Softer selection color — a subtle blue tint instead of the
           default bright highlight, so selecting inside the equation
           doesn't read as "about to cut/delete this". */
        math-field {
          --selection-background-color: rgba(96, 165, 250, 0.18);
          --selection-color: var(--text-primary);
        }
      `}</style>

      {/* Header */}
      <div className="px-5 py-4 border-b border-[var(--border)]">
        <h2 className="font-['Space_Grotesk'] font-semibold text-lg text-[var(--text-primary)]">Equation Editor</h2>
      </div>

      {/* Equation area */}
      <div className="p-3 sm:p-5 min-w-0">
        <div
          ref={viewportRef}
          className="
            w-full
            min-w-0
            rounded-[var(--radius-sm)]
            bg-[var(--bg-void)]
            border
            border-[var(--border-strong)]
            overflow-x-auto
            overflow-y-hidden
          "
        >
          <math-field
            ref={mathFieldRef}
            className="
              block
              min-w-full
              h-[140px]
              sm:h-[170px]
              p-4
              sm:p-5
              text-[var(--blue-glow)]
              outline-none
              bg-transparent
            "
            style={{
              fontSize: `${fontSize}px`,
              whiteSpace: "nowrap"
            }}
          />
        </div>

        {/* Controls row */}
        <div className="mt-3 min-h-[44px] flex items-center justify-between gap-2">
          <button
            onClick={toggleKeyboard}
            className="px-4 py-2 rounded-[var(--radius-sm)] bg-[var(--bg-elevated)] border border-[var(--border-strong)] hover:border-[var(--blue-primary)] text-[var(--text-primary)] hover:text-[var(--blue-glow)] text-sm font-medium transition cursor-pointer"
          >
            Keyboard
          </button>

          {/* Left/right scroll — lets the user look back at an
              earlier part of a long equation without losing their
              place in the input or disturbing the caret */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => scrollEquation(-1)}
              aria-label="Scroll equation left"
              className="w-9 h-9 flex items-center justify-center rounded-[var(--radius-sm)] bg-[var(--bg-elevated)] border border-[var(--border-strong)] hover:border-[var(--blue-primary)] text-[var(--text-primary)] hover:text-[var(--blue-glow)] transition cursor-pointer"
            >
              ←
            </button>
            <button
              onClick={() => scrollEquation(1)}
              aria-label="Scroll equation right"
              className="w-9 h-9 flex items-center justify-center rounded-[var(--radius-sm)] bg-[var(--bg-elevated)] border border-[var(--border-strong)] hover:border-[var(--blue-primary)] text-[var(--text-primary)] hover:text-[var(--blue-glow)] transition cursor-pointer"
            >
              →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
});

MathEditor.displayName = "MathEditor";

export default MathEditor;