let g_names_images_tuples = [];
let g_current_indexes = [];

async function getText(file) {
  let x = await fetch(file);
  let y = await x.text();
  return y;
}

async function load(){
	// load all people list
	let people_txt = await getText("people.txt");
	people_txt = people_txt.replaceAll("\r","")
	people_lines = people_txt.split("\n");
	for(let i = 0; i < people_lines.length-2; i+=3){
		g_names_images_tuples.push([people_lines[i],people_lines[i+1]]);
		if(people_lines[i+2].length != 0){
			throw "file not in correct format";
		}
	}
	
	// load personal people list
	try {
		g_current_indexes = localStorage['indexes']
		if(!Array.isArray(g_current_indexes)){
			throw "error";
		}
    } catch (error) {
		g_current_indexes = [];
		for(let i = 0; i < 5; i++){
			onAddClicked();
		}
	}
	
}

let current_people_index = 0;
let is_name_shown = false;

function normalize_name(name){
		name = name.toLowerCase();
		name = name.replace("mr.","");
		if(name[0] == " "){
			name = name.substring(1);
		}
		name = name[0].toUpperCase() + name.substring(1);
		return name;
}

function redraw(){
	let current_repository_index = g_current_indexes[current_people_index]
	let person = g_names_images_tuples[current_repository_index];
	document.getElementById("img").src = person[1];
	let name;
	if(is_name_shown){
		name = normalize_name(person[0]);
	}else{
		name = "";
	}
	document.getElementById("name").innerHTML=name;
}

function roll_new(){
	is_name_shown = false;
	let new_index = 0;
	while(true){
		new_index = Math.floor(Math.random() * g_current_indexes.length);
		if(new_index != current_people_index || g_current_indexes.length == 1){
			break;
		}
	}
	current_people_index = new_index;
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

function onAddClicked(){
	let new_people_index;
	while(true){
		new_people_index = Math.floor(Math.random() * g_names_images_tuples.length);
		if(!g_current_indexes.includes(new_people_index)){
			break;
		}
	}
	g_current_indexes.push(new_people_index);
	localStorage['indexes'] = g_current_indexes;
	
}

function onRemoveClicked(){
	g_current_indexes.splice(current_people_index,1);
	localStorage['indexes'] = g_current_indexes;
	roll_new();
	redraw();
}