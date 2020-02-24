import Vue from 'vue';
import Vuex from 'vuex';
import _ from 'lodash';

Vue.use(Vuex)

export default new Vuex.Store({
	state: {
		flow_name: "",
		flow_items: [],
		users: [],
		groups: [],
		active_index: 0,
		allowed_extensions : {
			/* for image uploads */
			images : ['jpg','jpeg','gif','png'],
			/* spreadsheets */
			documents : ['xls','xlsx','doc','docx','pdf','txt','pptx','ppt']
		},
		/** PROCESS TREE STATE VARIABLES */
		process_tree_mode: "ptree-minimized",
		processes_list: [], // full response from processes request
		filtered_processes: [],  // if user is searching these are the filtered results (used for display)
		processes: [],
		process_object: {},
		processes_backup: [] // when user clicks edit the tree create a backup so the can cancel.
	},
	mutations: {
		/**
		 * process data has been loaded and it needs to be saved to the store.
		 * @param {[type]} state   [description]
		 * @param {[type]} payload [description]
		 */
		setProcesses(state,payload){
			state.processes_list = payload;
			state.process_object = payload[0].ClientProcess;
			state.processes = payload[0].children;
			state.filtered_processes = payload[0].children;
		},
		/**
		 * update flow name
		 * @param {[type]} state   [description]
		 * @param {[type]} payload [description]
		 */
		setFlowName(state,payload){
			state.flow_name = payload;
		},
		/**
		 * add new item to flow items array
		 * @param {[type]} state   [description]
		 */
		addNewHeader(state){
			state.flow_items.push({
				type: 'header',
				name: "",
			});
		},
		/**
		 * add new empty task to list
		 * @param {[type]} state [description]
		 */
		addNewTask(state){
			state.flow_items.push({
				type: 'task',
				name: "",
				assigned: {},
				widgets: []
			});
		},
		/**
		 * update the title/name of a flow item
		 * @param  {[type]} state   [description]
		 * @param  {[type]} payload [description]
		 * @return {[type]}         [description]
		 */
		updateItemName(state,payload){
			state.flow_items[payload.index].name = payload.value;
		},
		/**
		 * save form data to state
		 * users list and groups list
		 * @param {[type]} state   [description]
		 * @param {[type]} payload [description]
		 */
		setFormData(state,payload){
			state.users = payload.users;
			state.groups = payload.groups;
		},
		/**
		 * a task was assigned a group or a user
		 * @param  {[type]} state   [description]
		 * @param  {[type]} payload [description]
		 * @return {[type]}         [description]
		 */
		taskAssigned(state,payload){
			state.flow_items[payload.index].assigned = payload.resource;
		},
		/**
		 * delete flow item from array
		 * @param  {[type]} state   [description]
		 * @param  {[type]} payload [description]
		 * @return {[type]}         [description]
		 */
		deleteFlowItem(state,payload){
			state.flow_items.splice(payload,1);
		},
		/**
		 * after sorting a new list will be sent
		 * @param  {[type]} state   [description]
		 * @param  {[type]} payload [description]
		 * @return {[type]}         [description]
		 */
		updateTaskListOrder(state,payload){
			state.flow_items = payload;
		},
		/**
		 * set active index
		 * @param {[type]} state   [description]
		 * @param {[type]} payload [description]
		 */
		setActiveIndex(state,payload){
			state.active_index = payload;
		},
		/**
		 * add new text editor widget
		 * @param {[type]} state [description]
		 */
		addTextEditorWidget(state){
			state.flow_items[state.active_index].widgets.push({
				component : "TextEditor",
				data: {
					content: ""
				}
			})
		},
		/**
		 * add a upload widget to the current task
		 * @param {[type]} state [description]
		 */
		addUploadWidget(state){
			state.flow_items[state.active_index].widgets.push({
				component : "FileUpload",
				data: {
					files: []
				}
			})
		},
		/**
		 * add a subtasks widget to the current task
		 * @param {[type]} state [description]
		 */
		addSubtasksWidget(state){
			state.flow_items[state.active_index].widgets.push({
				component : "SubTasks",
				data: {
					tasks: [
						{ name: "" }
					]
				}
			});
		},
		/**
		 * add a form textfield widget to the current task
		 * @param {[type]} state [description]
		 */
		addTextFieldWidget(state){
			state.flow_items[state.active_index].widgets.push({
				component: "TextField",
				data : {
					name: "",
					instructions: ""
				}
			})
		},
		/**
		 * add a form textarea widget to the current task
		 * @param {[type]} state [description]
		 */
		addTextAreaWidget(state){
			state.flow_items[state.active_index].widgets.push({
				component: "TextArea",
				data : {
					name: "",
					instructions: ""
				}
			})
		},
		/**
		 * add a form select widget to the current task
		 * @param {[type]} state [description]
		 */
		addSelectFieldWidget(state){
			state.flow_items[state.active_index].widgets.push({
				component: "SelectField",
				data : {
					name: "",
					instructions: "",
					options: []
				}
			})
		},
		/**
		 * add a form textfield widget to the current task
		 * @param {[type]} state [description]
		 */
		addCheckboxWidget(state){
			state.flow_items[state.active_index].widgets.push({
				component: "CheckboxField",
				data : {
					name: "",
					instructions: "",
					multiple: true,
					options: []
				}
			})
		},
		/**
		 * add a form DatePicker widget to the current task
		 * @param {[type]} state [description]
		 */
		addDatePickerWidget(state){
			state.flow_items[state.active_index].widgets.push({
				component: "DatePickerField",
				data : {
					name: "",
					instructions: "",
					multiple: true,
					options: []
				}
			})
		},
		/**
		 * user is typing content on text editor
		 * save it to the correct object
		 * @param  {[type]} state   [description]
		 * @param  {[type]} payload [description]
		 * @return {[type]}         [description]
		 */
		updateWidgetTextContent(state,payload){
			state.flow_items[state.active_index].widgets[payload.index].data.content = payload.value;
		},
		/**
		 * user is uploading a file
		 * @param  {[type]} state   [description]
		 * @param  {[type]} payload [description]
		 * @return {[type]}         [description]
		 */
		updateWidgetFiles(state,payload){
			state.flow_items[state.active_index].widgets[payload.index].data.files = payload.value;
		},
		/**
		 * remove widget using index from active item in flow items list
		 * @param  {[type]} state   [description]
		 * @param  {[type]} payload [description]
		 * @return {[type]}         [description]
		 */
		deleteWidget(state,payload){
			state.flow_items[state.active_index].widgets.splice(payload,1);
		},
		/**
		 * file was uploaded add to state.
		 * @param  {[type]} state   [description]
		 * @param  {[type]} payload [description]
		 * @return {[type]}         [description]
		 */
		fileUploaded(state,payload){
			state.flow_items[state.active_index].widgets[payload.index].data.files = [payload.file];
		},
		/**
		 * add new subtask to subtask widget
		 * @param {[type]} state   [description]
		 * @param {[type]} payload [description]
		 */
		addNewSubtask(state,payload){
			state.flow_items[state.active_index].widgets[payload].data.tasks.push({ name: "" });
		},
		/**
		 * delete a subtask from a widget row.
		 * @param  {[type]} state   [description]
		 * @param  {[type]} payload [description]
		 * @return {[type]}         [description]
		 */
		deleteSubTask(state,payload){
			state.flow_items[state.active_index].widgets[payload.widget_index].data.tasks.splice(payload.index,1);
		},
		/**
		 * update the title of a subtask
		 * @param  {[type]} state   [description]
		 * @param  {[type]} payload [description]
		 * @return {[type]}         [description]
		 */
		updateSubtaskName(state,payload){
			state.flow_items[state.active_index].widgets[payload.widget_index].data.tasks[payload.index].name = payload.value;
		},
		/**
		 * update name of a textfield widget.
		 * @param  {[type]} state   [description]
		 * @param  {[type]} payload [description]
		 * @return {[type]}         [description]
		 */
		updateTextFieldName(state,payload){
			state.flow_items[state.active_index].widgets[payload.index].data.name = payload.value;
		},
		updateFormFieldInstructions(state,payload){
			state.flow_items[state.active_index].widgets[payload.index].data.instructions = payload.value;
		},
		updateFormFieldOptions(state,payload){
			state.flow_items[state.active_index].widgets[payload.index].data.options = payload.value;
		},
		updateCheckboxMultipleOption(state,payload){
			state.flow_items[state.active_index].widgets[payload.index].data.multiple = payload.value;
		},
		/** PROCESS TREE MUTATIONS */
		/**
		 * [setProcessIndex description]
		 * @param {[type]} state   [description]
		 * @param {[type]} payload [description]
		 */
		setProcessIndex(state,payload){
			// save index
			state.process_index = payload;
			// extract process object from tree
			state.process_object = state.processes_list[state.process_index].ClientProcess;
			// list of all processes for the tree.
			state.processes = state.processes_list[state.process_index].children;
			// duplicate for filtered list.
			state.filtered_processes = state.processes_list[state.process_index].children;
		},
		/**
		 * change the state of the process editing tree
		 * if edit clone filter_processes to make a backup if user cancels instead of saves.
		 * @param  {[type]} state   [description]
		 * @param  {[type]} payload [description]
		 * @return {[type]}         [description]
		 */
		updateProcessTreeDisplay(state, payload){
			state.process_tree_mode = payload;
			// editing?
			if(payload == 'ptree-edit'){
				state.processes_backup = _.cloneDeep(state.filtered_processes);
			}
		},
		/**
		 * set edit view to expanded
		 * set filter processes back to backup one.
		 * reset backup.
		 * @param  {[type]} state   [description]
		 * @param  {[type]} payload [description]
		 * @return {[type]}         [description]
		 */
		cancelEditProcessTree(state){
			state.process_tree_mode = "ptree-expanded";
			//state.filtered_processes = _.cloneDeep(state.processes_backup);
			state.processes_backup = [];
		},
		/**
		 * user dragged items and we need to update the row numbers.
		 * @param {[type]} state [description]
		 */
		setNewProcessNumbers(state){
			state.filtered_processes.forEach( row => {
				let processNumber = row.ClientProcess.process_number;
				if(row.children.length > 0){
					row.children = renumberChildrenProcessNumbers(row.children,processNumber);
				}
			})
		},
		/**
		 * user changed the name of a process
		 * loop through to find it in tree and update it.
		 * @param  {[type]} state   [description]
		 * @param  {[type]} payload [description]
		 * @return {[type]}         [description]
		 */
		saveProcessName(state, payload){
			// eslint-disable-next-line
			state.filtered_processes.forEach( row => {
				if(row.ClientProcess.id == payload.process.ClientProcess.id){
					row.ClientProcess.name = payload.name;
					if(payload.level === 0) row.ClientProcess.process_number = payload.process_number;
				}else{
					// loop through children to see if node is there.
					if(row.children.length > 0){
						row.children = renameProcessInChildren(row.children,payload);
					}
				}
			});
		}
	}
});
	
/**
 * use parent number to set correct child number
 * @param  {[type]} children [description]
 * @return {[type]}          [description]
 */
function renumberChildrenProcessNumbers(children,parent_number){
	let counter = 1;
	children.forEach( child => {
		let newNumber = `${parent_number}.${counter}`;
		// if the current one is different. (change).
		if(child.ClientProcess.process_number != newNumber){
			//let parts = child.ClientProcess.process_number.split('.');
			//let current = parseInt(parts[parts.length - 1]);
			// change the position in database.
		}
		child.ClientProcess.process_number = newNumber
		counter ++;
		if(child.children.length > 0) child.children = renumberChildrenProcessNumbers(child.children,newNumber);
	});
	return children;
}

/**
 * loop through process children and rename the one found.
 * @param  {[type]} children [description]
 * @param  {[type]} payload  [description]
 * @return {[type]}          [description]
 */
function renameProcessInChildren(children,payload){
	children.forEach( row => {
		if(row.ClientProcess.id == payload.process.ClientProcess.id){
			row.ClientProcess.name = payload.name;
			if(payload.level === 0) row.ClientProcess.process_number = payload.process_number;
		}else{
			// loop through children to see if node is there.
			if(row.children.length > 0){
				row.children = renameProcessInChildren(row.children,payload);
			}
		}
	});
	return children;
}