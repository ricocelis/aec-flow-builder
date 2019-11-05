<template>
	<div class="flow-builder">
		<!-- flow builder -->
		<div class="flow">
			<div class="flow-name">{{ flowName }}</div>
			<div class="flow-sections">
				<FlowSection
					v-for="(section,index) in flow_sections"
					:key="index"
					:section="section"
					:index="index" />
				<div class="add-section" @click.prevent="addSection"><i class="fas fa-plus"></i></div>
			</div>
		</div>
		<!-- processes and flows to drag -->
		<div class="processes">
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
			<div class="process-list" v-show="isActiveTab('processes')">
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
	import {mapState} from 'vuex';
	export default {
		name: "flow-builder",
		components: {
			ProcessRow,
			FlowSection,
		},
		data(){
			return {
				active_tab: "processes",
				term: "",
			}
		},
		mounted(){
			this.loadProcesses();
		},
		methods: {
			loadProcesses(){
				let url = document.getElementById('content').getAttribute("processes_url");
				//eslint-disable-next-line
				console.log(url);
				//eslint-disable-next-line
				axios.get(url)
				.then(response => this.handleLoadProcesses(response.data))
				//eslint-disable-next-line
				.catch(error => console.log(error));
			},
			handleLoadProcesses(response){
				this.$store.commit('setProcesses',response);
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
			flowName(){
				return "Payroll Flow";
			},
			...mapState({
				processes : state => state.filtered_processes,
				process_object: state => state.process_object,
				flow_sections: state => state.flow_sections
			})
		},
		watch: {
			term(){
				this.$store.commit("setFilterProcesses",this.term);
			},
		}
	}
</script>