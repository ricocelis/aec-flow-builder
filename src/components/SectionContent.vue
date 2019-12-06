<template>
	<div class="section-content-row noselect" @click.prevent="onContentSelected" @mousedown="onMouseDown" ref="sectionRow">
		<div class="arrow"></div>
		<div class="content" :class="{ active: isActive }">
			<div class="process-number" v-if="this.content.type == 'process'">{{ processNumber }}</div>
			<div class="process-name">{{ contentName }}</div>
			<div class="delete"
				@click.prevent="deleteContent"
				v-if="builder_mode == 'edit'"
				><i class="far fa-trash-alt"></i></div>
			<input v-if="builder_mode == 'edit'" type="hidden" :name="typeFieldName" :value="content.type" />
			<input v-if="builder_mode == 'edit'" type="hidden" :name="foreignKeyFieldName" :value="foreignKey" />
			<input v-if="builder_mode == 'edit'" type="hidden" :name="foreignKeyFieldDisplayOrder" :value="index" />
		</div>
	</div>
</template>

<script>
	import {mapState} from 'vuex';
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
		data(){
			return {
				is_sorting: false
			}
		},
		methods: {
			deleteContent(){
				this.$store.commit('deleteSectionContent',{
					section_index: this.section_index,
					index: this.index
				});
			},
			onContentSelected(){
				if(this.builder_mode == "view") this.$store.commit("setActiveContent",{
					section_index: this.section_index,
					content: this.content
				});
			},
			onMouseDown(){
				if(this.builder_mode == "edit") this.is_sorting = true;
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
				return `data[ClientFlow][sections][${this.section_index}][content][${this.index}][foreign_id]`;
			},
			foreignKeyFieldDisplayOrder(){
				return `data[ClientFlow][sections][${this.section_index}][content][${this.index}][display_order]`;
			},
			foreignKey(){
				return (this.content.type == "process")? this.content.data.ClientProcess.id : "";
			},
			processNumber(){
				return this.content.data.ClientProcess.process_number;
			},
			isActive(){
				if(this.active_content_item.content.type == undefined) return false;
				return (this.content.type == this.active_content_item.content.type && // same type
					this.section_index == this.active_content_item.section_index && // same section
					this.active_content_item.content.data.ClientProcess.id == this.foreignKey); // same id
			},
			...mapState({
				builder_mode: state => state.mode,
				active_content_item: state => state.active_content_item
			})
		},
		watch: {
			is_sorting(){
				if(this.is_sorting){
					this.$refs.sectionRow.classList.add("sorting-row");
					setTimeout(() => { this.is_sorting = false },500);
				}else{
					this.$refs.sectionRow.classList.remove("sorting-row");
				}
			}
		}
	}
</script>