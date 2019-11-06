<template>
	<div class="section-content-row">
		<div class="arrow"></div>
		<div class="content">
			<div class="process-number" v-if="this.content.type == 'process'">{{ processNumber }}</div>
			<div class="process-name">{{ contentName }}</div>
			<div class="delete" @click.prevent="deleteContent"><i class="far fa-trash-alt"></i></div>
			<input type="hidden" :name="typeFieldName" :value="content.type" />
			<input type="hidden" :name="foreignKeyFieldName" :value="foreignKey" />
		</div>
	</div>
</template>

<script>
	export default {
		name: "section-content",
		props: {
			content: {
				type: Object,
				default: () => {}
			},
			section_index: {
				type: Number,
				default: 0
			},
			index: {
				type: Number,
				default: 0
			}
		},
		methods: {
			deleteContent(){
				this.$store.commit('deleteSectionContent',{
					section_index: this.section_index,
					index: this.section_index
				});
			}
		},
		computed: {
			contentName(){
				return (this.content.type == "process")? this.content.data.ClientProcess.name : "";
			},
			typeFieldName(){
				return `data[ClientFlow][sections][${this.section_index}][content][${this.index}][type]`;
			},
			foreignKeyFieldName(){
				return `data[ClientFlow][sections][${this.section_index}][content][${this.index}][foreign_key]`;
			},
			foreignKey(){
				return (this.content.type == "process")? this.content.data.ClientProcess.id : "";
			},
			processNumber(){
				return this.content.data.ClientProcess.process_number;
			}
		}
	}
</script>