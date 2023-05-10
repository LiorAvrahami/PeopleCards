let g_names_images_tuples = [];

async function getText(file) {
  let x = await fetch(file);
  let y = await x.text();
  return y;
}

async function load(){
	let people_txt = await getText("people.txt");
	people_txt = people_txt.replaceAll("\r","")
	people_lines = people_txt.split("\n");
	for(let i = 0; i < people_lines.length-2; i+=3){
		g_names_images_tuples.push([people_lines[i],people_lines[i+1]]);
		if(people_lines[i+2].length != 0){
			throw "file not in correct format";
		}
	}
}

let current_people_index = 0;
let is_name_shown = false;

function redraw(){
	document.getElementById("img").src=g_names_images_tuples[current_people_index][1];
	if(is_name_shown){
		document.getElementById("name").innerHTML=g_names_images_tuples[current_people_index][0];
	}else{
		document.getElementById("name").innerHTML="";
	}
}

function roll_new(){
	is_name_shown = false;
	current_people_index = Math.floor(Math.random() * g_names_images_tuples.length);
}

async function onloadfn(){
	await load()
	document.body.addEventListener('click', onclickfn, true); 
	document.addEventListener("keydown", onclickfn, true);
	roll_new();
	redraw();
	
}

function onclickfn(){
	if(is_name_shown){
		roll_new();
	}else{
		is_name_shown = true;
	}
	redraw();
}