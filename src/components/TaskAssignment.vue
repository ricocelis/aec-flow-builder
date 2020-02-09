<template>
	<div :class="`task-assignment ${item.assigned.item_type}`">
		<i class="fas fa-user"
			v-if="item.assigned.item_id == undefined"
			@click.prevent="showAssignmentWindow"></i>
		<InitialsIcon
			v-if="item.assigned.item_id != undefined"
			:name="item.assigned.item"
			@click="showAssignmentWindow" />
		<ResourcesList
			@selected="onResourceSelected"
			v-show="show_window" />
	</div>
</template>

<script>
	import ResourcesList from '@/components/ResourcesList.vue';
	import InitialsIcon from '@/components/InitialsIcon.vue';
	export default {
		name: "task-assignment",
		components: {
			ResourcesList,
			InitialsIcon
		},
		props: {
			item: {
				type: Object,
				default: () => {}
			}
		},
		data(){
			return {
				show_window : false
			};
		},
		methods: {
			showAssignmentWindow(){
				this.show_window = true;	
			},
			/**
			 * user has selected a resource to assign to the item
			 * @param  {[type]} selected [description]
			 * @return {[type]}          [description]
			 */
			onResourceSelected(selected){
				this.show_window = false;
				this.$emit('assign',selected);
			}
		}
	}
</script>