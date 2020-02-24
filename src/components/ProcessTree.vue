<template>
	<div class="process-tree">
		<div class="tree-container">
			<div class="process-dropdown">
				<label>Choose Process:</label>
				<div class="input select">
					<div class="selector">
						<span style="user-select: none;">{{ activeProcessName }}</span>
						<select name="" style="opacity: 0;" v-model="process_index" ignore_uniform="true" :disabled="dropDownDisabled">
							<option v-for="(p,index) in processes_list"
								:key="index"
								:value="index" >{{ p.ClientProcess.name }}</option>
						</select>
					</div>
				</div>
			</div>
			<div class="process-list" id="processList">
				<ProcessRow
					v-for="(row,index) in processes"
					:key="row.ClientProcess.id"
					:index="index"
					:level="0"
					:row_data="row" />
			</div>
		</div>
		<div class="gradient-overlay"></div>
	</div>
</template>

<script>
	import {mapState} from "vuex";
	import ProcessRow from '@/components/ProcessRow.vue';
	export default {
		name : "process-tree",
		components : {
			ProcessRow
		},
		data(){
			return {
				process_index: 0
			};
		},
		computed : {
			dropDownDisabled(){
				return this.process_tree_mode == 'ptree-minimized';
			},
			/**
			 * get name from the active process
			 * @return {[type]} [description]
			 */
			activeProcessName(){
				if(this.processes_list.length === 0) return "";
				return this.processes_list[this.process_index].ClientProcess.name;
			},
			...mapState({
				process_tree_mode: state => state.process_tree_mode,
				processes : state => state.filtered_processes,
				process_object: state => state.process_object,
				processes_list: state => state.processes_list
			})
		},
		watch : {
			process_index(){
				this.$store.commit("setProcessIndex",this.process_index);
			},
		}
	}
</script>