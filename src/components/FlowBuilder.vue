<template>
	<div class="flow-builder" :class="process_tree_mode">
		<div class="flow-header">
			<span>PROCESS FLOW </span>
			<i class="fas fa-angle-right breadcrumb-divider"></i>
			<input
				placeholder="Enter Flow Name"
				v-model="flow_name"
				@focus="onFlowNameFocus"
				@blur="onFlowNameBlur" />
			<i class="fas fa-caret-left tree-expander" @click.prevent="toggleTreeDisplay"></i>
			<div class="process-header">
				<span>Process Documents</span>
				<i class="fas fa-edit" v-show="process_tree_mode == 'ptree-expanded'" @click.prevent="editProcessTree"></i>
				<a href="#" @click.prevent="cancelEditProcessTree" class="flow-button">Done</a>
				<!--a href="#" @click.prevent="cancelEditProcessTree" class="flow-button danger">cancel</a-->
			</div>
		</div>
		<div class="windows-container">
			<div class="flow-windows">
				<TaskList />
				<TaskWidgets />
			</div>
			<ProcessTree />
		</div>
	</div>
</template>

<script>
	
	import TaskList from "@/components/TaskList.vue";
	import TaskWidgets from '@/components/TaskWidgets.vue';
	import ProcessTree from '@/components/ProcessTree.vue';
	
	import {mapState} from 'vuex';
	export default {
		name: "flow-builder",
		components: {
			TaskList,
			TaskWidgets,
			ProcessTree
		},
		props: {
		},
		data(){
			return {
			};
		},
		mounted(){
			this.loadViewData();
		},
		methods: {
			loadViewData(){
				//const dataElement = document.getElementById("transfer_element");
				this.$store.commit('setClientId',process.env.VUE_APP_CLIENT_ID);

				//eslint-disable-next-line
				axios.all([
					//eslint-disable-next-line
					axios.get(`${process.env.VUE_APP_API_URL}client_processes/get_static/${this.client_id}`),
					//eslint-disable-next-line
					axios.get(`${process.env.VUE_APP_API_URL}client_flows/get_users_and_groups/${this.client_id}`),
				])
				//eslint-disable-next-line
				.then(axios.spread((processes_response,form_data_response ) => {
					this.handleLoadFormData(form_data_response.data);
					this.handleLoadProcesses(processes_response.data);
				}))
				//eslint-disable-next-line
				.catch(error => console.log(error));
			},
			/**
			 * send data to store
			 * @param  {[type]} response [description]
			 * @return {[type]}          [description]
			 */
			handleLoadFormData(response){
				this.$store.commit('setFormData',response);
			},
			/**
			 * save client processes to store
			 * check if editing a flow
			 * trigger flow load if editing
			 * @param  {[type]} response [description]
			 * @return {[type]}          [description]
			 */
			handleLoadProcesses(response){
				this.$store.commit('setProcesses',response);
			},
			/**
			 * user placed cursor on flow name
			 * @return {[type]} [description]
			 */
			onFlowNameFocus(){
			},
			/**
			 * focus no longer on flow name
			 * @return {[type]} [description]
			 */
			onFlowNameBlur(){

			},
			toggleTreeDisplay(){
				const mode = (this.process_tree_mode == "ptree-minimized")?  "ptree-expanded" : "ptree-minimized";
				this.$store.commit('updateProcessTreeDisplay',mode);
			},
			/**
			 * edit process tree
			 * @return {[type]} [description]
			 */
			editProcessTree(){
				this.$store.commit('updateProcessTreeDisplay',"ptree-edit");
			},
			/**
			 * set process tree back to mininized
			 * @return {[type]} [description]
			 */
			cancelEditProcessTree(){
				this.$store.commit('cancelEditProcessTree');
			}
		},
		computed: {
			flow_name: {
				get() { return this.$store.state.flow_name},
				set(value){ 
					this.$store.commit('setFlowName',value);
				}
			},
			...mapState({
				process_tree_mode : state => state.process_tree_mode,
				client_id : state => state.client_id
			})
		},
		watch: {

		}
	}
</script>	