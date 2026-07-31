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

      // Insert ordinary text with proper spaces.
      field.insert(`\\text{${word}}`);

      onChange(field.value);
    }
  }));

  useEffect(() => {
    const field = mathFieldRef.current;
    if (!field) return;

    field.virtualKeyboardMode = "manual";

    /*
      smartMode allows MathLive to switch between
      mathematical input and ordinary words.

      Example:

      Find the value of x

      becomes readable text instead of:

      F i n d t h e v a l u e o f x
    */
    field.smartMode = true;

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
      <div className="px-5 py-4 border-b border-zinc-800">
        <h2 className="font-semibold text-lg">
          Equation Editor
        </h2>
      </div>

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