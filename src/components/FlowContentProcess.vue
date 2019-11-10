<template>
	<div class="process-content-row">
		<div class="process-info">
			<span class="process-number">{{ this.row_data.ClientProcess.process_number }}</span> <span class="process-name"> {{ this.row_data.ClientProcess.name }}</span>
		</div>
		<div class="process-content" v-html="processContent" v-if="processContent.length > 0" />
		<div class="children" v-if="row_data.children.length > 0">
			<flow-content-process
					v-for="(row,index) in row_data.children"
					:key="row.ClientProcess.id"
					:index="index"
					:row_data="row" />
		</div>
	</div>	
</template>

<script>
	import FlowContentProcess from '@/components/FlowContentProcess.vue';

	export default {
		name: 'flow-content-process',
		components: {
			'flow-content-process' : FlowContentProcess,
		},
		props: {
			row_data: {
				type: Object,
				default: () => {}
			},
			index: {
				type: Number,
				default: 0
			},
		},
		methods: {
		},
		data(){
			return {}
		},
		computed: {
			processContent(){
				if(this.row_data.ClientProcessContent.length == 0) return "";
				let content = "";
				for(let i in this.row_data.ClientProcessContent){
					content += this.row_data.ClientProcessContent[i].content;
				}
				return content;
			}
		}
	}
</script>