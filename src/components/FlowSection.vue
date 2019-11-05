<template>
	<div class="flow-section">
		<div class="section-name">
			<span>{{ sectionNumber }})</span>
			<input type="text" placeholder="Title" v-model="section_name">
			<input type="hidden" :name="fieldName" :value="section_name" />
		</div>
		<div class="section-content">
			<div class="section-content-row">
				<div class="arrow"></div>
				<div class="add-content active"><i class="fas fa-plus"></i></div>
			</div>
			<SectionContent />
			<div class="section-content-row">
				<div class="arrow"></div>
				<div class="add-content"><i class="fas fa-plus"></i></div>
			</div>
		</div>
	</div>
</template>

<script>
	import SectionContent from '@/components/SectionContent.vue';
	export default {
		name: "flow-section",
		components: {
			SectionContent
		},
		props: {
			index: {
				type: Number,
				default: 0
			}
		},
		data(){
			return {
				section_name: ""
			}
		},
		computed:{
			sectionNumber(){
				return this.index + 1;
			},
			fieldName(){
				return `flow[${this.index}][name]`;
			}
		}
	}
</script>