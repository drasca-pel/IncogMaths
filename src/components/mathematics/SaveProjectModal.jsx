import { useState } from "react";


function SaveProjectModal({
  open,
  onClose,
  onSave
}) {


  const [name,setName] = useState("");



  if(!open)
  return null;



  function handleSave(){


    if(!name.trim())
    return;


    onSave(name);


    setName("");

    onClose();

  }




  return (

    <div className="
    fixed
    inset-0
    bg-black/60
    flex
    items-center
    justify-center
    z-50
    ">


      <div className="
      w-[90%]
      max-w-md
      bg-[#141A22]
      border
      border-zinc-800
      rounded-3xl
      p-6
      ">


        <h2 className="
        text-xl
        font-bold
        mb-5
        ">

        Save Project

        </h2>



        <input

        value={name}

        onChange={(e)=>setName(e.target.value)}

        placeholder="Project name"

        className="
        w-full
        bg-[#0B0F14]
        border
        border-zinc-700
        rounded-xl
        px-4
        py-3
        outline-none
        "

        />



        <div className="
        flex
        gap-3
        mt-6
        ">


          <button

          onClick={onClose}

          className="
          flex-1
          py-3
          rounded-xl
          bg-zinc-800
          "

          >

          Cancel

          </button>




          <button

          onClick={handleSave}

          className="
          flex-1
          py-3
          rounded-xl
          bg-blue-600
          "

          >

          Save

          </button>


        </div>



      </div>


    </div>

  );

}


export default SaveProjectModal;