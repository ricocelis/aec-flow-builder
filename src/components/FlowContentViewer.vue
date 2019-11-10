<template>
	<div class="flow-content-viewer">
		<div class="breadcrumb" v-html="breadcrumbs"></div>
		<div class="flow-content">
			<FlowContentProcess :row_data="active_content" v-if="active_content.ClientProcess != undefined" />
		</div>
	</div>
</template>
<script>
	import {mapState} from 'vuex';
	import FlowContentProcess from '@/components/FlowContentProcess.vue';
	export default {
		name: "process-content-viewer",
		props: {

		},
		components: {
			FlowContentProcess
		},
		mounted(){

		},
		data(){
			return {

			};
		},
		computed: {
			breadcrumbs(){
				let breadcrumb = [];
				for(let i in this.active_content_breadcrumb){
					if(i == 0) continue;
					breadcrumb.push(this.active_content_breadcrumb[i].ClientProcess.name);
				}
				return breadcrumb.join(" > ");
			},
			...mapState({
				processes: state => state.processes,
				active_content: state => state.active_content,
				active_content_breadcrumb: state => state.active_content_breadcrumb
			})
		}
	}
</script>