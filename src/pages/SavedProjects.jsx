import { useState } from "react";
import { useNavigate } from "react-router-dom";


function SavedProjects(){


const navigate = useNavigate();



const [projects,setProjects] = useState(()=>{


return JSON.parse(

localStorage.getItem("incog_projects")
||
"[]"

);


});



const [deleteTarget,setDeleteTarget] = useState(null);








function openProject(project){


navigate("/workspace",{

state:{
project:project
}

});


}







function deleteProject(){


if(!deleteTarget)
return;



const updatedProjects = projects.filter(

(project)=>

project.id !== deleteTarget.id

);



setProjects(updatedProjects);



localStorage.setItem(

"incog_projects",

JSON.stringify(updatedProjects)

);



setDeleteTarget(null);


}







return (

<div className="
min-h-screen
bg-[#0B0F14]
text-white
p-5
">






<header className="
flex
items-center
justify-between
mb-6
">


<button

onClick={()=>navigate(-1)}

className="
w-10
h-10
rounded-xl
bg-zinc-800
"

>

←

</button>




<h1 className="
text-xl
font-bold
">

Saved Projects

</h1>



<div className="w-10"/>


</header>









{

projects.length === 0

?

<div className="
text-center
text-gray-400
mt-20
">

No saved projects yet

</div>


:

<div className="
space-y-4
">


{

projects.map((project)=>(


<div

key={project.id}

onClick={()=>openProject(project)}

onContextMenu={(e)=>{

e.preventDefault();

setDeleteTarget(project);

}}

className="
bg-[#141A22]
border
border-zinc-800
rounded-2xl
p-5
cursor-pointer
active:scale-95
transition
select-none
"

>


<h2 className="
font-bold
text-lg
">

{project.name}

</h2>



<p className="
text-gray-400
mt-2
line-clamp-2
">

{project.equation}

</p>



<p className="
text-xs
text-gray-500
mt-3
">

{

project.updatedAt
||
project.createdAt

}

</p>



</div>


))


}


</div>


}










{

deleteTarget &&


<div className="
fixed
inset-0
bg-black/70
flex
items-center
justify-center
z-50
">


<div className="
bg-[#141A22]
rounded-3xl
p-6
w-[90%]
max-w-md
">



<h2 className="
text-xl
font-bold
mb-3
">

Delete Project?

</h2>



<p className="
text-gray-400
mb-6
">

{deleteTarget.name}

</p>





<div className="
flex
gap-3
">


<button

onClick={()=>setDeleteTarget(null)}

className="
flex-1
bg-zinc-800
py-3
rounded-xl
"

>

Cancel

</button>




<button

onClick={deleteProject}

className="
flex-1
bg-red-600
py-3
rounded-xl
"

>

Delete

</button>



</div>




</div>


</div>


}





</div>

);


}


export default SavedProjects;