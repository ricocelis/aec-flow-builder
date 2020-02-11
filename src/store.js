import Vue from 'vue';
import Vuex from 'vuex';
//import _ from 'lodash';

Vue.use(Vuex)

export default new Vuex.Store({
	state: {
		flow_name: "",
		flow_items: [],
		users: [],
		groups: [],
		active_index: 0
	},
	mutations: {
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
		 * user is typing content on text editor
		 * save it to the correct object
		 * @param  {[type]} state   [description]
		 * @param  {[type]} payload [description]
		 * @return {[type]}         [description]
		 */
		updateWidgetTextContent(state,payload){
			state.flow_items[state.active_index].widgets[payload.index].content = payload.value;
		},
		/**
		 * remove widget using index from active item in flow items list
		 * @param  {[type]} state   [description]
		 * @param  {[type]} payload [description]
		 * @return {[type]}         [description]
		 */
		deleteWidget(state,payload){
			state.flow_items[state.active_index].widgets.splice(payload,1);
		}
	}
});