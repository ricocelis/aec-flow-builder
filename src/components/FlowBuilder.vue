<template>
	<div class="flow-builder" :class="process_tree_mode">
		<div class="flow-header">
			PROCESS FLOW <i class="fas fa-angle-right breadcrumb-divider"></i> 
			<input
				placeholder="Enter Flow Name"
				v-model="flow_name"
				@focus="onFlowNameFocus"
				@blur="onFlowNameBlur" />
			<i class="fas fa-caret-left tree-expander" @click.prevent="toggleTreeDisplay"></i>
			<div class="process-header">
				<span>Process Documents</span>
				<i class="fas fa-edit" v-show="process_tree_mode == 'ptree-expanded'"></i>
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
				const dataElement = document.getElementById("data_url");
				const formDataUrl = dataElement.getAttribute('data_route');
				const processesUrl = dataElement.getAttribute("processes_url");
				//eslint-disable-next-line
				axios.all([
					//eslint-disable-next-line
					axios.get(formDataUrl),
					//eslint-disable-next-line
					axios.get(processesUrl)
				])
				//eslint-disable-next-line
				.then(axios.spread((form_data_response, processes_response ) => {
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
				process_tree_mode : state => state.process_tree_mode
			})
		},
		watch: {

		}
	}
</script>	