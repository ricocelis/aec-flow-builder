<template>
	<div class="resources-list">
		<div class="links">
			<a href="#" @click.prevent="setActive('users')" class="pull-left" :class="{active: active_tab == 'users'}">Users</a>
			<a href="#" @click.prevent="setActive('groups')" class="pull-right" :class="{active: active_tab == 'groups'}">Groups</a>
		</div>
		<div class="tabs">
			<div v-if="active_tab == 'users'">
				<ResourceListItem
					v-for="(user,user_id) in users"
					:key="user_id"
					:item="user"
					:item_id="user_id"
					item_type="user"
					@selected="onResourceSelected" />
			</div>
			<div v-if="active_tab == 'groups'">
				<ResourceListItem
					v-for="(group,group_id) in groups"
					:key="group_id"
					:item="group"
					:item_id="group_id"
					item_type="group"
					@selected="onResourceSelected" />
			</div>
		</div>
	</div>
</template>

<script>
	import {mapState} from 'vuex';
	import ResourceListItem from "@/components/ResourceListItem.vue";
	export default {
		name: "resources-list",
		components: {
			ResourceListItem
		},
		data(){
			return {
				active_tab: "users"
			}
		},
		methods: {
			setActive(tab) {
				this.active_tab = tab;
			},
			onResourceSelected(resource){
				this.$emit('selected',resource);
			}
		},
		computed: {
			...mapState({
				users: state  => state.users,
				groups: state => state.groups
			})
		}
	}
</script>