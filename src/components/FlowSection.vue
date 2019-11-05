<template>
	<div class="flow-section">
		<div class="section-name">
			<span>{{ sectionNumber }})</span>
			<input type="text" placeholder="Title" v-model="section_name">
			<input type="hidden" :name="fieldName" :value="section_name" />
		</div>
		<div class="section-content">
			<!-- add at the beginning -->
			<Drop 
				@drop="onDropAbove"
				@dragover="over_above = true"
				@dragleave="over_above = false">
				<div class="section-content-row">
					<div class="arrow"></div>
					<div class="add-content" :class="{ active: over_above }"><i class="fas fa-plus"></i></div>
				</div>
			</Drop>
			<!-- list of all content -->
			<SectionContent
				v-for="(content,cindex) in section.content"
				:key="contentKey(content)"
				:index="cindex"
				:section_index="index"
				:content="content" />
			<!-- add at the end -->
			<Drop
				@drop="onDropBelow"
				@dragover="over_below = true"
				@dragleave="over_below = false">
				<div class="section-content-row" v-show="section.content.length > 0">
					<div class="arrow"></div>
					<div class="add-content" :class="{ active: over_below }"><i class="fas fa-plus"></i></div>
				</div>
			</Drop>
		</div>
	</div>
</template>

<script>
	import SectionContent from '@/components/SectionContent.vue';
	import {Drop} from 'vue-drag-drop';
	export default {
		name: "flow-section",
		components: {
			SectionContent,
			Drop
		},
		props: {
			section: {
				type: Object,
				default: () => {}
			},
			index: {
				type: Number,
				default: 0
			}
		},
		data(){
			return {
				section_name: "",
				over_above: false,
				over_below: false
			}
		},
		methods: {
			/**
			 * user dropped process above
			 * @param  {[type]} event [description]
			 * @return {[type]}       [description]
			 */
			onDropAbove(event){
				this.over_above = false;
				this.$store.commit("addContentToSection",{
					'index': this.index,
					'location': "start",
					'data' : event.data
				});
			},
			/**
			 * user dropped process below
			 * @param  {[type]} event [description]
			 * @return {[type]}       [description]
			 */
			onDropBelow(event){
				this.over_below = false;
				this.$store.commit("addContentToSection",{
					'index': this.index,
					'location': "end",
					'data' : event.data
				});
			},
			/**
			 * get content key based on if item is a process or a flow.
			 * @param  {[type]} content [description]
			 * @return {[type]}         [description]
			 */
			contentKey(content){
				if(content.type == "process"){
					return `process-${content.data.ClientProcess.id}`;
				}else{
					return `flow-${content.data.ClientFlow.id}`;
				}
			}
		},
		computed:{
			sectionNumber(){
				return this.index + 1;
			},
			fieldName(){
				return `sections[${this.index}][name]`;
			}
		}
	}
</script>