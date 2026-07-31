import {
  useEffect,
  useRef,
  forwardRef,
  useImperativeHandle
} from "react";

import "mathlive";

const MathEditor = forwardRef(({ value, onChange }, ref) => {
  const mathFieldRef = useRef(null);

  useImperativeHandle(ref, () => ({
    insertFormula(latex) {
      const field = mathFieldRef.current;
      if (!field) return;

      field.focus();
      field.insert(latex);

      onChange(field.value);
    },

    insertText(word) {
      const field = mathFieldRef.current;
      if (!field) return;

      field.focus();

      field.insert(`\\text{${word}}`);

      onChange(field.value);
    }
  }));

  useEffect(() => {
    const field = mathFieldRef.current;
    if (!field) return;

    // Do not automatically open the virtual keyboard.
    field.virtualKeyboardMode = "manual";

    /*
      Smart mode lets MathLive understand mixed input such as:

      Find the value of x

      and:

      If x > 0, then 2x + 5 = 15

      It automatically switches between text and
      mathematical modes when appropriate.
    */
    field.smartMode = true;

    /*
      IMPORTANT:

      Space in math mode normally has no effect or can
      be interpreted as navigation, especially inside
      superscripts/fractions.

      Give MathLive an actual mathematical spacing command
      instead of leaving the space completely empty.

      Medium mathematical spacing is used here.
    */
    field.mathModeSpace = "\\:";

    // Disable the MathLive menu.
    field.menuItems = [];

    const handleInput = () => {
      onChange(field.value);
    };

    field.addEventListener("input", handleInput);

    return () => {
      field.removeEventListener("input", handleInput);
    };
  }, [onChange]);

  useEffect(() => {
    const field = mathFieldRef.current;
    if (!field) return;

    if (field.value !== value) {
      field.value = value || "";
    }
  }, [value]);

  return (
    <div className="w-full rounded-3xl bg-[#141A22] border border-zinc-800">

      {/* Header */}
      <div className="px-5 py-4 border-b border-zinc-800">
        <h2 className="font-semibold text-lg">
          Equation Editor
        </h2>
      </div>

      {/* Editor */}
      <div className="p-5">
        <math-field
          ref={mathFieldRef}
          className="
            w-full
            h-[160px]
            overflow-hidden
            rounded-2xl
            bg-[#0B0F14]
            border
            border-zinc-700
            p-5
            text-white
            text-3xl
            outline-none
          "
        />
      </div>

    </div>
  );
});

MathEditor.displayName = "MathEditor";

export default MathEditor;