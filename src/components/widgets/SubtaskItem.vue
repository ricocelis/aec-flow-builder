<template>
	<div :class="`task-list-item ${activeClass}`">
		<div class="task">
			<checkbox :disabled="true" />
			<input 
				ref="task_input"
				type="text"
				v-model="item_name"
				placeholder="Enter Task Item..."
				:id="`subtask_item-${widget_index}-${this.index}`"
				@focus="onFocus"
				@keydown="onKeyDown"
				@keyup="onKeyUp">
		</div>
	</div>
</template>

<script>
	import {mapState} from 'vuex';
	export default {
		name: 'task-list-item',
		components: {
		},
		props: {
			widget_index:{
				type: Number,
				default: 0
			},
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
			this.$refs.task_input.focus();

			this.$bus.$on('active_subtask', (index) => {
				this.handleActiveTask(index);
			});
		},
		methods: {
			onFocus(){ 
				this.is_active = true;
				this.$bus.$emit('active_subtask', this.index);
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
			 * capture keyup event
			 * if TAB key add new task
			 * if BACKSPACE delete item
			 */
			onKeyDown(event){
				const TABKEY = 9;
				// tab key on last task ? 
				if((event.keyCode == TABKEY && ! event.shiftKey) && (this.subtasks.length - 1) == this.index) {
					event.preventDefault();
					// add new task
					this.$store.commit('addNewSubtask',this.widget_index);
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
					if(this.index !== 0 && this.subtasks.length !== 1){
						const prevIndex = this.index - 1;
						const prevInput = document.getElementById(`subtask_item-${this.widget_index}-${prevIndex}`);
						prevInput.focus();
					}
					// if not the first item in list
					if(this.index !== 0){
						// delete this task
						this.$store.commit('deleteSubTask',{
							widget_index: this.widget_index,
							index: this.index
						});
					}
					return false;
				}
			}
		},
		computed: {
			activeClass(){
				return this.is_active ? "active" : "";
			},
			item_name: {
				get() { return this.$store.state.flow_items[this.active_index].widgets[this.widget_index].data.tasks[this.index].name },
				set(value){ 
					this.$store.commit('updateSubtaskName',{
						widget_index: this.widget_index,
						index: this.index,
						value: value,
					});
				}
			},
			subtasks: {
				get() { return this.$store.state.flow_items[this.active_index].widgets[this.widget_index].data.tasks },
			},
			...mapState({
				active_index: state => state.active_index,
			})
		},
	}
</script>