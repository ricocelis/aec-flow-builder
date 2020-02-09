import Vue from 'vue';
import Vuex from 'vuex';
//import _ from 'lodash';

Vue.use(Vuex)

export default new Vuex.Store({
	state: {
		flow_name: "",
		flow_items: [],
		users: [],
		groups: []
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
		 * @param {[type]} payload [description]
		 */
		addFlowItem(state,payload){
			//console.log(state);
			state.flow_items.push(payload);
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
		}
	}
});