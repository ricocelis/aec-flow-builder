import Vue from 'vue';
import Vuex from 'vuex';
//import _ from 'lodash';

Vue.use(Vuex)

export default new Vuex.Store({
	state: {
		processes: [],
		process_object: {}
	},
	mutations: {
		setProcesses(state,payload){
			state.process_object = payload.ClientProcess;
			state.processes = payload.children;
		},
	}
});