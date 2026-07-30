import {
  useEffect,
  useRef,
  forwardRef,
  useImperativeHandle
} from "react";

import "mathlive";


const MathEditor = forwardRef(
({ value, onChange }, ref) => {


  const mathFieldRef = useRef(null);



  useImperativeHandle(ref, () => ({

    insertFormula(latex){

      const field =
      mathFieldRef.current;


      if(!field) return;


      field.focus();


      field.insert(latex);


      onChange(field.value);

    }


  }));




  useEffect(()=>{


    const field =
    mathFieldRef.current;


    if(!field) return;



    // Disable the large popup keyboard
    field.virtualKeyboardMode =
    "manual";


    // Prevent smart text conversion
    field.smartMode = false;



    // Remove menu/popup behaviour
    field.menuItems = [];



    const handleInput = ()=>{

      onChange(
        field.value
      );

    };



    field.addEventListener(
      "input",
      handleInput
    );



    return ()=>{

      field.removeEventListener(
        "input",
        handleInput
      );

    };


  },[]);






  useEffect(()=>{


    const field =
    mathFieldRef.current;


    if(!field) return;



    if(field.value !== value){

      field.value =
      value || "";

    }



  },[value]);






return (

<div className="
w-full
rounded-3xl
bg-[#141A22]
border
border-zinc-800
">


<div className="
px-5
py-4
border-b
border-zinc-800
">


<h2 className="
font-semibold
text-lg
">

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


export default MathEditor;