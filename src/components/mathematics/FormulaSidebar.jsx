import { useState } from "react";
import {
  FiSearch,
  FiX,
  FiChevronDown,
  FiChevronRight,
} from "react-icons/fi";

import "mathlive";


function FormulaSidebar({
  open,
  onClose,
  onSelectFormula,
}) {


  const [search,setSearch] = useState("");

  const [activeCategory,setActiveCategory] =
  useState("Calculus");



  const formulaLibrary = {


    Calculus:[


      {
        name:"Power Rule",
        latex:"\\frac{d}{dx}x^n=nx^{n-1}"
      },


      {
        name:"Constant Rule",
        latex:"\\frac{d}{dx}c=0"
      },


      {
        name:"Sum Rule",
        latex:"\\frac{d}{dx}(f+g)=f'+g'"
      },


      {
        name:"Product Rule",
        latex:"\\frac{d}{dx}(uv)=u'v+uv'"
      },


      {
        name:"Quotient Rule",
        latex:"\\frac{d}{dx}\\frac{u}{v}=\\frac{vu'-uv'}{v^2}"
      },


      {
        name:"Chain Rule",
        latex:"\\frac{dy}{dx}=\\frac{dy}{du}\\frac{du}{dx}"
      },


      {
        name:"Basic Integral",
        latex:"\\int x^n dx=\\frac{x^{n+1}}{n+1}+C"
      },


      {
        name:"Integration By Parts",
        latex:"\\int u dv=uv-\\int vdu"
      },


      {
        name:"Limit Definition",
        latex:"\\lim_{x\\to a}f(x)"
      },


      {
        name:"Fundamental Theorem",
        latex:"\\int_a^b f(x)dx=F(b)-F(a)"
      }


    ],




    "Trigonometry":[


      {
        name:"Sine Function",
        latex:"\\sin(x)"
      },


      {
        name:"Cosine Function",
        latex:"\\cos(x)"
      },


      {
        name:"Tangent Function",
        latex:"\\tan(x)"
      },


      {
        name:"Secant Function",
        latex:"\\sec(x)"
      },


      {
        name:"Cosecant Function",
        latex:"\\csc(x)"
      },


      {
        name:"Cotangent Function",
        latex:"\\cot(x)"
      },


      {
        name:"Inverse Sine",
        latex:"\\sin^{-1}(x)"
      },


      {
        name:"Inverse Cosine",
        latex:"\\cos^{-1}(x)"
      },


      {
        name:"Inverse Tangent",
        latex:"\\tan^{-1}(x)"
      },


      {
        name:"Pythagorean Identity",
        latex:"\\sin^2(x)+\\cos^2(x)=1"
      }


    ],




    "Calculus II":[


      {
        name:"Taylor Series",
        latex:"f(x)=\\sum_{n=0}^{\\infty}\\frac{f^{(n)}(a)}{n!}(x-a)^n"
      },


      {
        name:"Maclaurin Series",
        latex:"f(x)=\\sum_{n=0}^{\\infty}\\frac{f^{(n)}(0)}{n!}x^n"
      },


      {
        name:"Geometric Series",
        latex:"\\sum ar^n=\\frac{a}{1-r}"
      },


      {
        name:"Partial Derivative",
        latex:"\\frac{\\partial f}{\\partial x}"
      },


      {
        name:"Double Integral",
        latex:"\\int\\int f(x,y)dxdy"
      },


      {
        name:"Gradient",
        latex:"\\nabla f"
      }


    ],




    "Differential Equations":[


      {
        name:"First Order Equation",
        latex:"\\frac{dy}{dx}+P(x)y=Q(x)"
      },


      {
        name:"Second Order Equation",
        latex:"\\frac{d^2y}{dx^2}+a\\frac{dy}{dx}+by=0"
      },


      {
        name:"Exponential Growth",
        latex:"y=Ce^{kt}"
      }


    ],




    "Complex Numbers":[


      {
        name:"Euler Formula",
        latex:"e^{i\\theta}=\\cos(\\theta)+i\\sin(\\theta)"
      },


      {
        name:"Complex Polar Form",
        latex:"z=r(\\cos\\theta+i\\sin\\theta)"
      },


      {
        name:"Magnitude",
        latex:"|z|=\\sqrt{a^2+b^2}"
      }


    ],




    "Common Functions":[


      {
        name:"Exponential",
        latex:"e^x"
      },


      {
        name:"Natural Log",
        latex:"\\ln(x)"
      },


      {
        name:"Logarithm",
        latex:"\\log(x)"
      },


      {
        name:"Square Root",
        latex:"\\sqrt{x}"
      }


    ]


  };





const filtered = Object.entries(formulaLibrary)

.map(([category,items])=>[

category,

items.filter(item=>

item.name
.toLowerCase()
.includes(
search.toLowerCase()
)

)

])

.filter(([_,items])=>items.length);






return (

<>


{
open &&

<div

onClick={onClose}

className="
fixed
inset-0
bg-black/60
z-40
"

/>
}





<aside

className={`
fixed
top-0
left-0
h-screen
w-[390px]
bg-[#141A22]
border-r
border-zinc-800
z-50
flex
flex-col
transition-transform
duration-300

${open
?"translate-x-0"
:"-translate-x-full"}

`}


>



<div className="
flex
items-center
justify-between
p-5
border-b
border-zinc-800
">


<h2 className="
font-bold
text-xl
">

Formula Library

</h2>


<button
onClick={onClose}
>

<FiX size={22}/>

</button>


</div>





<div className="p-5">


<input

value={search}

onChange={(e)=>setSearch(e.target.value)}

placeholder="Search formula..."

className="
w-full
rounded-xl
bg-[#0B0F14]
border
border-zinc-700
p-3
outline-none
"

/>


</div>





<div className="
flex-1
overflow-y-auto
pb-10
">


{

filtered.map(([category,items])=>(


<div key={category}>


<button

onClick={()=>setActiveCategory(

activeCategory===category
?""
:category

)}

className="
w-full
flex
justify-between
px-5
py-4
hover:bg-zinc-800
"

>


<span className="font-semibold">

{category}

</span>


{
activeCategory===category
?<FiChevronDown/>
:<FiChevronRight/>
}


</button>





{
activeCategory===category &&

<div className="bg-[#0B0F14]">


{
items.map(item=>(


<button

key={item.name}

onClick={()=>onSelectFormula(item.latex)}

className="
w-full
text-left
px-6
py-5
border-b
border-zinc-800
hover:bg-[#1B2330]
"

>


<p className="mb-3 font-medium">

{item.name}

</p>



<math-field

read-only

value={item.latex}

className="
pointer-events-none
text-blue-400
text-xl
bg-transparent
"

/>


</button>


))

}


</div>

}



</div>


))

}


</div>


</aside>


</>

);


}


export default FormulaSidebar;