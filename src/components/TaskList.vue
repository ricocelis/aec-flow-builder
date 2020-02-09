<template>
	<div class="task-list">
		<div class="flow-items">
			<Draggable v-model="flow_items">
				<TaskListItem
					v-for="(item,index) in flow_items"
					:key="index"
					:index="index"
					:item="item" />
			</Draggable>
		</div>
		<div class="list-footer">
			<a href="#" @click.prevent="addTask" class="pull-left"><i class="fas fa-plus"></i> Task</a>
			<a href="#" @click.prevent="addHeader" class="pull-right"><i class="fas fa-plus"></i> Header</a>
		</div>
	</div>
</template>

<script>
	import Draggable from 'vuedraggable';
	import TaskListItem from '@/components/TaskListItem.vue';
	export default {
		name: "task-list",
		components: {
			TaskListItem,
			Draggable
		},
		data(){
			return {

			};
		},
		methods: {
			/**
			 * send request to store to add a new item to the task list
			 */
			addTask(){
				this.$store.commit('addFlowItem',{
					type: 'task',
					name: "",
					assigned: {}
				});
			},
			/**
			 * send request to store to add new header to task list
			 */
			addHeader(){
				this.$store.commit('addFlowItem',{
					type: 'header',
					name: "",
				});
			}
		},
		computed: {
				flow_items: {
					get() { return this.$store.state.flow_items },
				set(value) { this.$store.commit('updateTaskListOrder', value); }
			}
		}
	}
</script>