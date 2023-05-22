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
		g_current_indexes = JSON.parse(localStorage['indexes']);
		if(!Array.isArray(g_current_indexes)){
			throw "error";
		}
    } catch (error) {
		g_current_indexes = [];
		for(let i = 0; i < 5; i++){
			onAddClicked();
		}
	}

	reset_were_people_chosen_array();
}

let current_people_index = 0;
let is_name_shown = false;

function normalize_name(name){
		name = name.toLowerCase();
		name = name.replace("mr.","");
		name = name.replace("ms.","");
		if(name[0] == " "){
			name = name.substring(1);
		}
		name = name.split(" ")[0];
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
	document.getElementById("name").innerHTML = name;
	document.getElementById("num_people").innerHTML = get_number_of_were_chosen().toString() + "/" + g_current_indexes.length.toString();
}

/*the rolling algorithem:
	was_person_chosen is a binary array. it's value is true at the indexes of the people that were chosen more times then the others.
	when a new person is rolled, this is done by rolling a large number (1000 times number of people), and iterating over the people array
	every time a person which has not yet been chosen is passed, the number is reduced by 1. when the number hits 0 that person is chosen.
*/
let was_person_chosen = [];
function roll_new(){
	is_name_shown = false;
	let new_index = 0;
	
	let num_not_chosen = was_person_chosen.length - get_number_of_were_chosen();
	if(num_not_chosen == 0)
	{
		reset_were_people_chosen_array();
		num_not_chosen = was_person_chosen.length - get_number_of_were_chosen();
	}
	
	rand_travle = Math.floor(Math.random() * g_current_indexes.length * 1000);
	rand_travle = rand_travle % (num_not_chosen)
	let current_index = 0
	while(true){
		if(!was_person_chosen[current_index]){
			if(rand_travle == 0){
				break;
			}else{
			rand_travle -= 1;
			}
		}
		current_index++
	}
	
	if(current_people_index != current_index){
		current_people_index = current_index
		was_person_chosen[current_people_index] = true;
	}else{
		/* same person was chosen twice, roll again */
		roll_new();
	}
}

function get_number_of_were_chosen(){
	let ret = 0;
	for(let i = 0; i < was_person_chosen.length; i++){
		if(was_person_chosen[i])
			ret += 1;
	}
	return ret;
}

function reset_were_people_chosen_array(){
	was_person_chosen = [];
	for(let i = 0; i < g_current_indexes.length; i++){
		was_person_chosen.push(false);
	}
}

function append_to_were_people_chosen_array(){
	was_person_chosen.push(false);
}

function remove_from_were_people_chosen_array(index){
	was_person_chosen.splice(index,1);
}

async function onloadfn(){
	await load()
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
	localStorage['indexes'] = JSON.stringify(g_current_indexes);
	current_people_index = g_current_indexes.length - 1;
	append_to_were_people_chosen_array();
	redraw();
}

function onRemoveClicked(){
	g_current_indexes.splice(current_people_index,1);
	remove_from_were_people_chosen_array(current_people_index);
	localStorage['indexes'] = JSON.stringify(g_current_indexes);
	roll_new();
	redraw();
}