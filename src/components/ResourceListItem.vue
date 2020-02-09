<template>
	<div :class="`resource-list-item ${item_type}`" @click.prevent="onResourceSelected">
		<InitialsIcon :name="item" /> {{ item }}
	</div>
</template>

<script>
	import InitialsIcon from '@/components/InitialsIcon.vue';
	export default {
		name: "resource-list-item",
		components : {
			InitialsIcon
		},
		props: {
			item:  {
				type: String,
				default: ""
			},
			item_id: {
				type: String,
				default: ""
			},
			item_type: {
				type: String,
				default: ""
			}
		},
		methods: {
			onResourceSelected(){
				this.$emit('selected',{
					item: this.item,
					item_id: this.item_id,
					item_type: this.item_type
				});
			}
		}
	}
</script>