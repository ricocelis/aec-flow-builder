import Vue from 'vue';
import Vuex from 'vuex';
import _ from 'lodash';

Vue.use(Vuex)

export default new Vuex.Store({
	state: {
		mode: "edit", // flow builder mode
		processes: [],
		process_object: {},
		filtered_processes: [],
		draggable_process : {},
		flow_sections: [
			{ name: '', content: [] }
		],
		// current active process when viewing a process
		active_content_item: {
			section_index: 0,
			content: {}
		},
		active_content: {},
		active_content_breadcrumb: [],
		get_path_route: ""
	},
	mutations: {
		setProcesses(state,payload){
			state.process_object = payload.ClientProcess;
			state.processes = payload.children;
			state.filtered_processes = payload.children;
		},
		setFilterProcesses(state,payload){
			const terms = payload.trim().toLowerCase().split(" ");
			// if not searching. set default
			if(terms.length == 0){
				state.filtered_processes = _.cloneDeep(state.processes);
			}else{
				let data = [];
				for(let i in state.processes){
					data.push(filterProcess(state.processes[i],terms));
				}
				state.filtered_processes = _.cloneDeep(data);
			}
		},
		setDraggableProcess(state,payload){
			state.draggable_process = payload;
		},
		addContentToSection(state,payload){
			if(payload.location == "start"){
				state.flow_sections[payload.index].content.unshift(payload.data);
			}else{
				state.flow_sections[payload.index].content.push(payload.data);
			}
		},
		deleteSectionContent(state,payload){
			state.flow_sections[payload.section_index].content.splice(payload.index, 1);
		},
		addFlowSection(state){
			state.flow_sections.push({ name: '', content: [] });
		},
		setFlowData(state,payload){
			state.flow_sections = payload;
			// if viewing flow
			if(state.mode == "view"){
				// show first content
				let firstContent = payload[0].content[0];
				if(firstContent.type == "process"){
					state.active_content_item = {
						section_index: 0,
						content: firstContent	
					};
					let active = null;
					let active_id = firstContent.data.ClientProcess.id;
					for(let i in state.processes){
						const p = state.processes[i];
						if(p.ClientProcess.id == active_id){
							active = p;
							break;
						}else{
							// check children
							if(p.children.length > 0){
								active = checkChildrenForActiveProcess(p.children,active_id);
								if(active) break;
							}
						}
					}
					if(active != null) state.active_content = active;

					// get the path to the current node
					//eslint-disable-next-line
					axios.get(`${state.get_path_route}/${active_id}`)
					.then(response => state.active_content_breadcrumb = response.data)
					//eslint-disable-next-line
					.catch(error => console.log(error));
				}
			}
		},
		setBuilderMode(state,payload){
			state.mode = payload;
		},
		setGetPathUrl(state,payload){
			state.get_path_route = payload;
		},
		/**
		 * set current node as active
		 * find current node in proceess tree.
		 * set breadcrumb array
		 * @param {[type]} state   [description]
		 * @param {[type]} payload [description]
		 */
		setActiveContent(state,payload){
			state.active_content_item = payload;
			// loop through processes and find active
			if(payload.content.type == "process"){
				let active = null;
				let active_id = payload.content.data.ClientProcess.id;
				for(let i in state.processes){
					const p = state.processes[i];
					if(p.ClientProcess.id == active_id){
						active = p;
						break;
					}else{
						// check children
						if(p.children.length > 0){
							active = checkChildrenForActiveProcess(p.children,active_id);
							if(active) break;
						}
					}
				}
				if(active != null) state.active_content = active;

				// get the path to the current node
				//eslint-disable-next-line
				axios.get(`${state.get_path_route}/${active_id}`)
				.then(response => state.active_content_breadcrumb = response.data)
				//eslint-disable-next-line
				.catch(error => console.log(error));
			}
		}
	}
});

/**
 * loop through process children to find active node.
 * @param  {[type]} children  [description]
 * @param  {[type]} active_id [description]
 * @return {[type]}           [description]
 */
function checkChildrenForActiveProcess(children,active_id){
	let active = null;
	for(let i in children){
		const p = children[i];
		if(parseInt(p.ClientProcess.id) == parseInt(active_id)){
			active = p;
			break;
		}else{
			// check children
			if(p.children.length > 0){
				active = checkChildrenForActiveProcess(p.children,active_id);
				if(active) break;
			}
		}
	}
	return active;
}
	
/**
 * mark each row as match if they have it
 * @param  {[type]} row  [description]
 * @param  {[type]} term [description]
 * @return {[type]}      [description]
 */
function filterProcess(row,terms){
	let nameMatch = false,
		tagMatch = false;
	// check to see if the name matches
	for(let i in terms){
		// does the name match the terms
		if(row.ClientProcess.name.toLowerCase().indexOf(terms[i]) !== -1){
			nameMatch = true;
		}
		// check if it matches any of the tags
		if(row.ClientProcessTagLinkage.length > 0){
			for(let e in row.ClientProcessTagLinkage){
				const tag = row.ClientProcessTagLinkage[e].tag;
				const value = row.ClientProcess.name.trim();
				if(value.toLowerCase().indexOf(tag) !== -1){
					tagMatch = true;
					break;
				}
			}
		}
		if(tagMatch) break;
	}
	// add match data to row.
	row.name_match = nameMatch;
	row.tag_match = tagMatch;
	if(row.children.length > 0){
		for(let c in row.children){
			row.children[c] = filterProcess(row.children[c],terms);
		}
	}

	return row;
}