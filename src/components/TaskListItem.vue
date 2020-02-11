<template>
	<div :class="`task-list-item ${item.type} ${activeClass}`">
		<h3 v-if="item.type == 'header'">
			<input 
				ref="header_input"
				:id="`task_item-${this.index}`"
				type="text"
				v-model="item_name"
				placeholder="Enter Header Title..."
				@focus="onFocus"
				@keydown="onKeyDown"
				@keyup="onKeyUp"></h3>
		<div class="task" v-if="item.type=='task'">
			<checkbox :disabled="true" />
			<input 
				ref="task_input"
				type="text"
				v-model="item_name"
				placeholder="Enter Task Item..."
				:id="`task_item-${this.index}`"
				@focus="onFocus"
				@keydown="onKeyDown"
				@keyup="onKeyUp">
			<TaskAssignment :item="item" @assign="onResourceSelected" />
		</div>
	</div>
</template>

<script>
	import TaskAssignment from '@/components/TaskAssignment.vue';
	import {mapState} from 'vuex';
	export default {
		name: 'task-list-item',
		components: {
			TaskAssignment
		},
		props: {
			index: {
				type: Number,
				default: 0
			},
			item: {
				type: Object,
				default: () => {}
			},
		},
		data(){
			return {
				is_active: false
			};
		},
		mounted(){
			if(this.item.type == "task"){
				this.$refs.task_input.focus();
			}else{
				this.$refs.header_input.focus();
			}
			this.$bus.$on('active_task', (index) => {
				this.handleActiveTask(index);
			});
		},
		methods: {
			onFocus(){ 
				this.is_active = true;
				this.$bus.$emit('active_task', this.index);
				this.$store.commit('setActiveIndex',this.index);
			},
			/**
			 * event for when a task is set to active
			 * check if the index matches. If not set task to inactive
			 * @param  {[type]} index [description]
			 * @return {[type]}       [description]
			 */
			handleActiveTask(index){
				if(this.index !== index) this.is_active = false;
			},
			/**
			 * user has selected a resource to assign to this task item
			 * @param  {[type]} resource [description]
			 * @return {[type]}          [description]
			 */
			onResourceSelected(resource){
				this.$store.commit('taskAssigned',{
					index: this.index,
					resource: resource
				});
			},
			/**
			 * capture keyup event
			 * if TAB key add new task
			 * if BACKSPACE delete item
			 */
			onKeyDown(event){
				const TABKEY = 9;
				// tab key on last task ? 
				if((event.keyCode == TABKEY && ! event.shiftKey) && (this.flow_items.length - 1) == this.index) {
					event.preventDefault();
					// add new task
					this.$store.commit('addNewTask');
					return false;
				}
			},
			/**
			 * if backspace is clicked then delete item
			 * @param  {[type]} event [description]
			 * @return {[type]}       [description]
			 */
			onKeyUp(event){

				const BACKSPACEKEY = 8;
				// backspace and empty name
				if(event.keyCode == BACKSPACEKEY && this.item_name.length === 0) {
					event.preventDefault();
					// not the last item in the list
					if(this.index !== 0 && this.flow_items.length !== 1){
						const prevIndex = this.index - 1;
						const prevInput = document.getElementById(`task_item-${prevIndex}`);
						prevInput.focus();
					}
					// delete this task
					this.$store.commit('deleteFlowItem',this.index);
					return false;
				}
			}
		},
		computed: {
			activeClass(){
				return this.is_active ? "active" : "";
			},
			item_name: {
				get() { return this.$store.state.flow_items[this.index].name },
				set(value){ 
					this.$store.commit('updateItemName',{
						index: this.index,
						value: value
					});
				}
			},
			...mapState({
				flow_items: state => state.flow_items
			})
		},
	}
</script>