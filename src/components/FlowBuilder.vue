<template>
	<div class="flow-builder">
		<div class="flow-header">
			PROCESS FLOW <i class="fas fa-angle-right"></i> 
			<input
				placeholder="Enter Flow Name"
				v-model="flow_name"
				@focus="onFlowNameFocus"
				@blur="onFlowNameBlur" />
		</div>
		<div class="flow-windows">
			<TaskList />
			<TaskWidgets />
		</div>
	</div>
</template>

<script>
	
	import TaskList from "@/components/TaskList.vue";
	import TaskWidgets from '@/components/TaskWidgets.vue';
	export default {
		name: "flow-builder",
		components: {
			TaskList,
			TaskWidgets
		},
		props: {
		},
		data(){
			return {

			};
		},
		mounted(){
			this.loadFormData();
		},
		methods: {
			/**
			 * load any data needed to display dropdown,etc
			 * @return {[type]} [description]
			 */
			loadFormData(){
				const url = document.getElementById("data_url").getAttribute('data_route');
				//eslint-disable-next-line
				axios.get(url)
				.then(response => this.handleLoadFormData(response.data))
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

			}
		},
		computed: {
			flow_name: {
				get() { return this.$store.state.flow_name},
				set(value){ 
					this.$store.commit('setFlowName',value);
				}
			}
		},
		watch: {

		}
	}
</script>