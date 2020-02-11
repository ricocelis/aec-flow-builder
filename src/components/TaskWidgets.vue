<template>
	<div class="task-widgets">
		<div class="sidenav">
			<div  v-show="isTask">
				<!-- text editor -->
				<div class="widget-icon" v-tooltip.top-center="`+ Text Editor`" @click.prevent="addTextEditor">
					<i class="fas fa-font"></i>
				</div>
				<div class="divider"></div>
				<!-- file upload -->
				<div class="widget-icon" v-tooltip.top-center="`+ File Upload`">
					<i class="fas fa-file-alt"></i>
				</div>
				<div class="divider"></div>
				<!-- form -->
				<div class="widget-icon" v-tooltip.top-center="`+ Form Fields`">
					<i class="fas fa-clipboard-list"></i>
				</div>
				<div class="divider"></div>
				<!-- tasks -->
				<div class="widget-icon" v-tooltip.top-center="`+ Subtasks`">
					<i class="fas fa-tasks"></i>
				</div>
			</div>
		</div>
		<div class="widgets-list">
			<component
				v-for="(widget,index) in widgets"
				:key="index"
				:is="widget.component"
				:index="index" />
		</div>
	</div>
</template>

<script>
	import {mapState} from 'vuex';
	import TextEditor from '@/components/widgets/TextEditor.vue';
	export default {
		name: "task-widgets",
		components: {
			TextEditor
		},
		data(){
			return {

			}
		},
		methods: {
			addTextEditor(){
				this.$store.commit('addTextEditorWidget');
			}
		},
		computed: {
			/**
			 * check if the current active item is a task and not a header
			 * @return {Boolean} [description]
			 */
			isTask(){ 
				if(this.flow_items[this.active_index] === undefined) return false;
				return this.flow_items[this.active_index].type == "task";
			},
			widgets(){
				if(this.flow_items[this.active_index] == undefined) return [];
				return this.flow_items[this.active_index].widgets;
			},
			...mapState({
				active_index : state => state.active_index,
				flow_items : state => state.flow_items
			})
		}
	}
</script>