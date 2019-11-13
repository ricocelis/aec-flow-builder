<template>
	<div class="flow-builder">
		<!-- flow builder -->
		<div class="flow">
			<div class="flow-name">{{ flow_name }}</div>
			<div class="flow-sections">
				<FlowSection
					v-for="(section,index) in flow_sections"
					:key="index"
					:section="section"
					:index="index" />
				<div class="add-section"
					v-if="builder_mode == 'edit'"
					@click.prevent="addSection"><i class="fas fa-plus"></i></div>
			</div>
		</div>
		<!-- process content viewer -->
		<FlowContentViewer v-if="builder_mode == 'view'" />
		<!-- processes and flows to drag -->
		<div class="processes" v-if="builder_mode == 'edit'">
			<div class="tabs-and-search">
				<div class="tabs">
					<a href="#" :class="activeTabClass('processes')" @click.prevent="setActiveTab('processes')">Processes</a>
					<a href="#"
						:class="activeTabClass('flows')"
						@click.prevent="setActiveTab('flows')">Flows</a>
				</div>
				<div class="search">
					<i class="fas fa-search"></i>
					<input type="text" class="search-box" placeholder="Search" v-model="term">
				</div>
			</div>
			<div class="process-list" v-show="isActiveTab('processes')" v-if="builder_mode == 'edit'">
				<ProcessRow
					v-for="(row,index) in processes"
					:key="row.ClientProcess.id"
					:index="index"
					:row_data="row" />
			</div>
			<div class="flows-list" v-show="isActiveTab('flows')">
				<h2>Flows</h2>
			</div>
		</div>
	</div>
</template>

<script>
	import ProcessRow from '@/components/ProcessRow.vue';
	import FlowSection from '@/components/FlowSection.vue';
	import FlowContentViewer from '@/components/FlowContentViewer.vue';
	import {mapState} from 'vuex';
	export default {
		name: "flow-builder",
		components: {
			ProcessRow,
			FlowSection,
			FlowContentViewer
		},
		data(){
			return {
				active_tab: "processes",
				term: "",
				flow_name: ""
			}
		},
		mounted(){
			this.loadProcesses();
			let flowNameField = document.getElementById("ClientFlowName");
			flowNameField.addEventListener("change",() => this.updateFlowName());
			this.updateFlowName();
		},
		methods: {
			updateFlowName(){
				this.flow_name = document.getElementById("ClientFlowName").value;
			},
			loadProcesses(){
				let url = document.getElementById('processes_url').getAttribute("processes_url");
				//eslint-disable-next-line
				axios.get(url)
				.then(response => this.handleLoadProcesses(response.data))
				//eslint-disable-next-line
				.catch(error => console.log(error));
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
				const dataElement = document.getElementById('processes_url');
				// check if we have a flow id
				const client_flow_id = dataElement.getAttribute('client_flow_id');

				// get mode
				this.$store.commit('setBuilderMode',dataElement.getAttribute('mode'));

				this.$store.commit('setGetPathUrl',dataElement.getAttribute('path_url'));

				// editing a flow
				if(client_flow_id.length > 0){
					const flow_url = dataElement.getAttribute('flow_url');
					//eslint-disable-next-line
					axios.get(flow_url)
					.then(response => this.handleGetFlow(response.data))
					//eslint-disable-next-line
					.catch(error => console.log(error));
				}
			},
			/**
			 * save flow data to store
			 * @param  {[type]} response [description]
			 * @return {[type]}          [description]
			 */
			handleGetFlow(response){
				this.$store.commit('setFlowData',response);
			},
			activeTabClass(tab){
				return (tab == this.active_tab)? "active" : "";
			},
			setActiveTab(tab){
				this.active_tab = tab;
			},
			isActiveTab(tab){
				return (tab == this.active_tab);
			},
			addSection(){
				this.$store.commit('addFlowSection');
			}

		},
		computed: {
			/*flowName(){
				return "Payroll Flow";
			},*/
			...mapState({
				processes : state => state.filtered_processes,
				process_object: state => state.process_object,
				flow_sections: state => state.flow_sections,
				builder_mode: state => state.mode
			})
		},
		watch: {
			term(){
				this.$store.commit("setFilterProcesses",this.term);
			},
		}
	}
</script>