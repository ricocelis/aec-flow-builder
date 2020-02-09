<template>
	<div :class="`task-list-item ${item.type} ${activeClass}`">
		<h3 v-if="item.type == 'header'">
			<input 
				type="text"
				v-model="item_name"
				placeholder="Enter Header Title..."
				@focus="onFocus"
				@blur="onBlur"></h3>
		<div class="task" v-if="item.type=='task'">
			<checkbox :disabled="true" />
			<input 
				type="text"
				v-model="item_name"
				placeholder="Enter Header Title..."
				@focus="onFocus"
				@blur="onBlur">
			<TaskAssignment :item="item" @assign="onResourceSelected" />
		</div>
	</div>
</template>

<script>
	import TaskAssignment from '@/components/TaskAssignment.vue';
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
		methods: {
			onFocus(){
				this.is_active = true;
			},
			onBlur(){
				this.is_active = false;
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
			}
		},
	}
</script>