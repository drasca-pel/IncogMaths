import {
  useEffect,
  useRef,
  useState,
  forwardRef,
  useImperativeHandle
} from "react";

import "mathlive";

const BREAKPOINT = 640; // matches Tailwind's `sm`
const STEP = 2;

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

  // Shrinks font step by step until the equation fits inside the
  // visible viewport, or the min bound is hit — at which point we
  // stop shrinking and let the viewport's own horizontal scroll
  // take over. Measured against viewportRef (not the field itself),
  // since the field's own box can grow with its content.
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

  useImperativeHandle(ref, () => ({
    insertFormula(latex) {
      const field = mathFieldRef.current;
      if (!field) return;

      field.focus();
      field.insert(latex);

      // Keep the complete MathLive value — resizing never touches this.
      onChange(field.value);

      requestAnimationFrame(() => {
        fitFont();
      });
    }
  }));

  useEffect(() => {
    const field = mathFieldRef.current;
    if (!field) return;

    // Manual means MathLive won't automatically open the large
    // virtual keyboard on focus — we control it via the button below.
    field.virtualKeyboardMode = "manual";
    field.smartMode = false;
    // Note: menuItems is intentionally left untouched (not set to []),
    // since we want to keep MathLive's native menu available.

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
    <div className="w-full min-w-0 rounded-3xl bg-[#141A22] border border-zinc-800 overflow-hidden">
      {/* Hides only the native keyboard-toggle icon inside the field —
          it's rebuilt as the "Keyboard" button below. The native
          menu-toggle icon is left alone since there's no confirmed
          public command yet to relocate it safely. */}
      <style>{`
        math-field::part(virtual-keyboard-toggle) {
          display: none;
        }
      `}</style>

      {/* Header */}
      <div className="px-5 py-4 border-b border-zinc-800">
        <h2 className="font-semibold text-lg">Equation Editor</h2>
      </div>

      {/* Equation area */}
      <div className="p-3 sm:p-5 min-w-0">
        <div
          ref={viewportRef}
          className="
            w-full
            min-w-0
            rounded-2xl
            bg-[#0B0F14]
            border
            border-zinc-700
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
              text-white
              outline-none
              bg-transparent
            "
            style={{
              fontSize: `${fontSize}px`,
              whiteSpace: "nowrap"
            }}
          />
        </div>

        {/* Controls row — keyboard toggle relocated here */}
        <div className="mt-3 min-h-[44px] flex items-center justify-between">
          <button
            onClick={toggleKeyboard}
            className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 active:scale-95 text-sm font-medium transition"
          >
            Keyboard
          </button>
          {/* Native menu-toggle icon still renders inside the field
              for now — see note above the <style> block */}
        </div>
      </div>
    </div>
  );
});

MathEditor.displayName = "MathEditor";

export default MathEditor;