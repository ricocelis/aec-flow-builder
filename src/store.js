import Vue from 'vue';
import Vuex from 'vuex';
import _ from 'lodash';

Vue.use(Vuex)

export default new Vuex.Store({
	state: {
		processes: [],
		process_object: {},
		filtered_processes: [],
		draggable_process : {},
		flow_sections: [
			{ name: '', content: [] }
		]
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
			//eslint-disable-next-line
			console.log("delete");
			//eslint-disable-next-line
			console.log(payload);
			state.flow_sections[payload.section_index].content.splice(payload.index, 1);
		},
		addFlowSection(state){
			state.flow_sections.push({ name: '', content: [] });
		},
		setFlowData(state,payload){
			state.flow_sections = payload;
		}
	}
});
	
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