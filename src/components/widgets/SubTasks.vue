<template>
	<div class="flow-widget subtasks">
		<div class="widget-title">SubTasks:</div>
		<div class="subtask-list">
			<Draggable v-model="subtasks">
				<SubtaskItem
					v-for="(item,sindex) in subtasks"
					:key="sindex"
					:index="sindex"
					:widget_index="index"
					:item="item" />
			</Draggable>
		</div>
		<div class="delete-widget" @click.prevent="deleteWidget">
            <i class="fas fa-times-circle"></i>
        </div>
	</div>
</template>

<script>
	import Draggable from 'vuedraggable';
	import SubtaskItem from '@/components/widgets/SubtaskItem.vue';
	import {mapState} from 'vuex';
	export default {
		name: 'subtasks-widget',
		// properties that the component will receive from parent
		props: {
			index: {
				type: Number,
				default: 0
			}
		},
		components: {
			SubtaskItem,
			Draggable
		},
		methods: {
			/**
			* send request to store to delete current widget
			* @return {[type]} [description]
			*/
			deleteWidget(){
				this.$store.commit('deleteWidget',this.index);
			}
		},
		computed: {
			subtasks: {
				get() { return this.$store.state.flow_items[this.active_index].widgets[this.index].data.tasks },
				set(value) { 
					this.$store.commit('updateSubtaskListOrder', {
						index: this.index,
						tasks: value
					}); 
				}
			},
			...mapState({
				active_index : state => state.active_index
			})
		}
	}
</script>