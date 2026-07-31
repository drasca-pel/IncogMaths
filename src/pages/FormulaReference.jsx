import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";

import "mathlive";
import "mathlive/static.css";

function FormulaReference() {
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);

  const formulaDb = {
    Calculus: [
      {
        name: "Product Rule",
        formula:
          "\\frac{d}{dx}[u \\cdot v] = u \\frac{dv}{dx} + v \\frac{du}{dx}"
      },
      {
        name: "Quotient Rule",
        formula:
          "\\frac{d}{dx}\\left[\\frac{u}{v}\\right] = \\frac{v \\frac{du}{dx} - u \\frac{dv}{dx}}{v^2}"
      },
      {
        name: "Chain Rule",
        formula:
          "\\frac{dy}{dx} = \\frac{dy}{du} \\cdot \\frac{du}{dx}"
      },
      {
        name: "Fundamental Theorem of Calculus",
        formula:
          "\\int_{a}^{b} f(x)\\,dx = F(b) - F(a)"
      },
      {
        name: "Integration by Parts",
        formula:
          "\\int u\\,dv = uv - \\int v\\,du"
      },
      {
        name: "Arc Length of a Curve",
        formula:
          "L = \\int_{a}^{b} \\sqrt{1 + \\left(\\frac{dy}{dx}\\right)^2}\\,dx"
      }
    ],

    "Differential Equations": [
      {
        name: "First-Order Linear DE",
        formula:
          "\\frac{dy}{dx} + P(x)y = Q(x)"
      },
      {
        name: "Integrating Factor (I.F.)",
        formula:
          "I.F. = e^{\\int P(x)\\,dx}"
      },
      {
        name: "General Solution of Linear DE",
        formula:
          "y \\cdot (I.F.) = \\int Q(x) \\cdot (I.F.)\\,dx + C"
      },
      {
        name: "Homogeneous 2nd Order (Real Roots)",
        formula:
          "y = C_1 e^{m_1 x} + C_2 e^{m_2 x}"
      },
      {
        name: "Homogeneous 2nd Order (Complex Roots)",
        formula:
          "y = e^{\\alpha x}(C_1 \\cos(\\beta x) + C_2 \\sin(\\beta x))"
      },
      {
        name: "Bernoulli's Equation",
        formula:
          "\\frac{dy}{dx} + P(x)y = Q(x)y^n"
      }
    ],

    "Complex Numbers": [
      {
        name: "Euler's Formula",
        formula:
          "e^{i\\theta} = \\cos\\theta + i\\sin\\theta"
      },
      {
        name: "De Moivre's Theorem",
        formula:
          "(\\cos\\theta + i\\sin\\theta)^n = \\cos(n\\theta) + i\\sin(n\\theta)"
      },
      {
        name: "Polar Form",
        formula:
          "z = r(\\cos\\theta + i\\sin\\theta) = re^{i\\theta}"
      },
      {
        name: "Cauchy-Riemann Equations",
        formula:
          "\\frac{\\partial u}{\\partial x} = \\frac{\\partial v}{\\partial y} \\quad \\text{and} \\quad \\frac{\\partial u}{\\partial y} = -\\frac{\\partial v}{\\partial x}"
      },
      {
        name: "Logarithm of Complex Number",
        formula:
          "\\ln(z) = \\ln|z| + i(\\arg z + 2k\\pi)"
      }
    ],

    "Vector Calculus": [
      {
        name: "Gradient of a Scalar Field",
        formula:
          "\\nabla f = \\frac{\\partial f}{\\partial x}\\mathbf{i} + \\frac{\\partial f}{\\partial y}\\mathbf{j} + \\frac{\\partial f}{\\partial z}\\mathbf{k}"
      },
      {
        name: "Divergence of a Vector Field",
        formula:
          "\\nabla \\cdot \\mathbf{F} = \\frac{\\partial P}{\\partial x} + \\frac{\\partial Q}{\\partial y} + \\frac{\\partial R}{\\partial z}"
      },
      {
        name: "Curl of a Vector Field",
        formula:
          "\\nabla \\times \\mathbf{F} = \\begin{vmatrix} \\mathbf{i} & \\mathbf{j} & \\mathbf{k} \\\\ \\frac{\\partial}{\\partial x} & \\frac{\\partial}{\\partial y} & \\frac{\\partial}{\\partial z} \\\\ P & Q & R \\end{vmatrix}"
      },
      {
        name: "Gauss's Divergence Theorem",
        formula:
          "\\iint_{S} \\mathbf{F} \\cdot d\\mathbf{S} = \\iiint_{V} (\\nabla \\cdot \\mathbf{F})\\,dV"
      },
      {
        name: "Stokes' Theorem",
        formula:
          "\\oint_{C} \\mathbf{F} \\cdot d\\mathbf{r} = \\iint_{S} (\\nabla \\times \\mathbf{F}) \\cdot d\\mathbf{S}"
      }
    ],

    "Infinite Series": [
      {
        name: "Taylor Series Expansion",
        formula:
          "f(x) = \\sum_{n=0}^{\\infty} \\frac{f^{(n)}(a)}{n!}(x-a)^n"
      },
      {
        name: "Maclaurin Series for e^x",
        formula:
          "e^x = \\sum_{n=0}^{\\infty} \\frac{x^n}{n!} = 1 + x + \\frac{x^2}{2!} + \\frac{x^3}{3!} + \\dots"
      },
      {
        name: "Fourier Series Representation",
        formula:
          "f(x) = \\frac{a_0}{2} + \\sum_{n=1}^{\\infty} \\left(a_n \\cos\\frac{n\\pi x}{L} + b_n \\sin\\frac{n\\pi x}{L}\\right)"
      },
      {
        name: "Geometric Series Sum",
        formula:
          "S_\\infty = \\frac{a}{1-r} \\quad \\text{for } |r| < 1"
      }
    ],

    "Laplace Transform": [
      {
        name: "Laplace Integral Definition",
        formula:
          "\\mathcal{L}\\{f(t)\\} = \\int_{0}^{\\infty} e^{-st}f(t)\\,dt = F(s)"
      },
      {
        name: "Transform of Polynomial t^n",
        formula:
          "\\mathcal{L}\\{t^n\\} = \\frac{n!}{s^{n+1}}"
      },
      {
        name: "Transform of Exponential e^{at}",
        formula:
          "\\mathcal{L}\\{e^{at}\\} = \\frac{1}{s-a}"
      },
      {
        name: "First Shifting Theorem",
        formula:
          "\\mathcal{L}\\{e^{at}f(t)\\} = F(s-a)"
      },
      {
        name: "Transform of Derivative f'(t)",
        formula:
          "\\mathcal{L}\\{f'(t)\\} = sF(s) - f(0)"
      },
      {
        name: "Convolution Theorem",
        formula:
          "\\mathcal{L}\\{f(t) * g(t)\\} = F(s) \\cdot G(s)"
      }
    ],

    "Numerical Methods": [
      {
        name: "Newton-Raphson Method",
        formula:
          "x_{n+1} = x_n - \\frac{f(x_n)}{f'(x_n)}"
      },
      {
        name: "Runge-Kutta 4th Order (RK4)",
        formula:
          "y_{n+1} = y_n + \\frac{h}{6}(k_1 + 2k_2 + 2k_3 + k_4)"
      },
      {
        name: "Simpson's 1/3 Rule",
        formula:
          "\\int_{a}^{b} f(x)\\,dx \\approx \\frac{h}{3}\\left[y_0 + y_n + 4\\sum y_{\\text{odd}} + 2\\sum y_{\\text{even}}\\right]"
      },
      {
        name: "Trapezoidal Rule",
        formula:
          "\\int_{a}^{b} f(x)\\,dx \\approx \\frac{h}{2}\\left[y_0 + y_n + 2(y_1 + y_2 + \\dots + y_{n-1})\\right]"
      }
    ],

    "Coordinate Geometry": [
      {
        name: "Distance Form (3D)",
        formula:
          "d = \\sqrt{(x_2-x_1)^2 + (y_2-y_1)^2 + (z_2-z_1)^2}"
      },
      {
        name: "Perpendicular Distance to Line",
        formula:
          "d = \\frac{|Ax_1 + By_1 + C|}{\\sqrt{A^2 + B^2}}"
      },
      {
        name: "General Equation of Conic",
        formula:
          "Ax^2 + Bxy + Cy^2 + Dx + Ey + F = 0"
      },
      {
        name: "Angle Between Two Lines",
        formula:
          "\\tan\\theta = \\left|\\frac{m_2 - m_1}{1 + m_1 m_2}\\right|"
      }
    ]
  };

  const categories = Object.keys(formulaDb);

  const filteredCategories = categories.filter((category) => {
    const query = searchQuery.toLowerCase();

    const matchesCategory =
      category.toLowerCase().includes(query);

    const matchesFormula =
      formulaDb[category].some((formula) =>
        formula.name.toLowerCase().includes(query) ||
        formula.formula.toLowerCase().includes(query)
      );

    return matchesCategory || matchesFormula;
  });

  return (
    <div className="min-h-screen bg-[#05070c] text-[#e6ebf5] font-['Inter',system-ui,sans-serif] antialiased">

      {/* ================================
          HEADER
      ================================= */}

      <header className="flex items-center gap-4 px-6 py-5 border-b border-[#1e2836] bg-[#0d121b]">

        <button
          onClick={() =>
            selectedCategory
              ? setSelectedCategory(null)
              : navigate("/")
          }
          className="w-10 h-10 flex items-center justify-center rounded-[8px] bg-[#131a26] border border-[#1e2836] hover:border-[#3b82f6] text-[#8592a6] hover:text-[#60a5fa] text-xl transition"
        >
          ←
        </button>

        <div>
          <h1 className="text-xl font-bold font-['Space_Grotesk'] bg-gradient-to-r from-[#e6ebf5] to-[#60a5fa] bg-clip-text text-transparent">
            {selectedCategory || "Formula Reference"}
          </h1>

          <p className="text-[#8592a6] text-xs font-['JetBrains_Mono'] mt-0.5">
            {selectedCategory
              ? "Core Mathematical Formulations"
              : "Engineering Mathematics Library"}
          </p>
        </div>

      </header>

      {/* ================================
          MAIN
      ================================= */}

      <main className="p-6 max-w-4xl mx-auto space-y-6">

        {!selectedCategory ? (

          <>
            {/* SEARCH */}

            <input
              type="text"
              placeholder="Search equations, rules, or mathematical categories..."
              value={searchQuery}
              onChange={(e) =>
                setSearchQuery(e.target.value)
              }
              className="
                w-full
                rounded-[8px]
                bg-[#0d121b]
                border border-[#1e2836]
                px-5 py-3.5
                text-sm
                text-[#e6ebf5]
                outline-none
                focus:border-[#3b82f6]
                focus:ring-2
                focus:ring-[#3b82f6]/20
                transition
                placeholder-[#566173]
              "
            />

            {/* CATEGORY LIST */}

            <div className="space-y-3">

              {filteredCategories.map(
                (category) => (

                  <button
                    key={category}
                    onClick={() =>
                      setSelectedCategory(category)
                    }
                    className="
                      w-full
                      flex
                      items-center
                      justify-between
                      rounded-[14px]
                      bg-[#0d121b]
                      border border-[#1e2836]
                      p-5
                      hover:border-[#3b82f6]
                      hover:bg-[#131a26]
                      text-left
                      transition
                      group
                    "
                  >

                    <div>

                      <h2 className="
                        font-['Space_Grotesk']
                        font-semibold
                        text-base
                        text-[#e6ebf5]
                        group-hover:text-[#60a5fa]
                        transition
                      ">
                        {category}
                      </h2>

                      <p className="
                        text-xs
                        text-[#8592a6]
                        mt-1
                      ">
                        Contains{" "}
                        {formulaDb[category].length}{" "}
                        verified high-order formulas.
                      </p>

                    </div>

                    <span className="
                      text-xl
                      text-[#566173]
                      group-hover:text-[#3b82f6]
                      transition
                    ">
                      ›
                    </span>

                  </button>

                )
              )}

              {filteredCategories.length === 0 && (

                <div className="
                  text-center
                  py-12
                  text-[#566173]
                  text-sm
                  font-['JetBrains_Mono']
                ">
                  No matching parameters inside the directory.
                </div>

              )}

            </div>
          </>

        ) : (

          /* ================================
             FORMULA LIST
          ================================= */

          <div className="space-y-4">

            <button
              onClick={() =>
                setSelectedCategory(null)
              }
              className="
                text-[#60a5fa]
                hover:underline
                text-xs
                font-['JetBrains_Mono']
                flex
                items-center
                gap-1
                mb-2
              "
            >
              ← Back to reference modules
            </button>

            {formulaDb[selectedCategory].map(
              (formula, index) => (

                <FormulaCard
                  key={index}
                  formula={formula}
                  index={index}
                />

              )
            )}

          </div>

        )}

      </main>

      <div className="h-10" />

    </div>
  );
}


/* ============================================================
   FORMULA CARD
============================================================ */

function FormulaCard({ formula, index }) {

  const viewportRef = useRef(null);

  const SCROLL_AMOUNT = 180;

  function scrollFormula(direction) {

    if (!viewportRef.current) return;

    viewportRef.current.scrollBy({
      left:
        direction * SCROLL_AMOUNT,
      behavior: "smooth"
    });

  }

  return (

    <div className="
      p-5
      rounded-[14px]
      bg-[#0d121b]
      border border-[#1e2836]
      space-y-3
    ">

      {/* FORMULA TITLE */}

      <h3 className="
        font-['Space_Grotesk']
        text-xs
        font-semibold
        uppercase
        tracking-wider
        text-[#60a5fa]
      ">
        {formula.name}
      </h3>


      {/* FORMULA VIEWPORT */}

      <div className="relative">

        <div
          ref={viewportRef}
          className="
            w-full
            overflow-x-auto
            overflow-y-hidden
            rounded-[8px]
            border border-[#29374a]
            bg-[#05070c]
            px-4
            py-5

            /* Important:
               the scrollbar remains available */
            overscroll-x-contain
          "
        >

          <div
            className="
              min-w-max
              flex
              items-center
              min-h-[55px]
            "
          >

            <math-field
              read-only
              value={formula.formula}
              className="
                block
                w-max
                min-w-max
                border-none
                outline-none
                bg-transparent
                text-[#e6ebf5]
              "
              style={{
                fontSize: "1.35rem",
                width: "max-content",
                minWidth: "max-content",
                whiteSpace: "nowrap",
                display: "block",
                color: "#e6ebf5",
                background: "transparent",
                border: "none",
                outline: "none",
                padding: 0
              }}
            />

          </div>

        </div>


        {/* SCROLL BUTTONS */}

        <div className="
          absolute
          right-2
          bottom-2
          flex
          gap-1
        ">

          <button
            type="button"
            aria-label="Scroll formula left"
            onClick={() =>
              scrollFormula(-1)
            }
            className="
              w-8
              h-8
              rounded-[7px]
              bg-[#131a26]
              border border-[#29374a]
              text-[#8592a6]
              hover:text-[#60a5fa]
              hover:border-[#3b82f6]
              transition
              flex
              items-center
              justify-center
              text-sm
            "
          >
            ←
          </button>

          <button
            type="button"
            aria-label="Scroll formula right"
            onClick={() =>
              scrollFormula(1)
            }
            className="
              w-8
              h-8
              rounded-[7px]
              bg-[#131a26]
              border border-[#29374a]
              text-[#8592a6]
              hover:text-[#60a5fa]
              hover:border-[#3b82f6]
              transition
              flex
              items-center
              justify-center
              text-sm
            "
          >
            →
          </button>

        </div>

      </div>

    </div>
  );
}


export default FormulaReference;