<template>
	<div class="process-row noselect" :class="matchedClass">
		<Drag
			:transfer-data="{ data: { type:'process' , data : this.row_data }}" >
			<div class="process-info">
				<span class="process-number">{{ processNumber }}</span> <span class="process-name"> {{ processName }}</span>
				<i class="fas fa-expand-arrows-alt"></i>
			</div>
			<div slot="image" class='draggable-container'>
				<div class="draggable-item noselect" id="draggableProcess">{{processName}}</div>
			</div>
		</Drag>
		<div class="children" v-if="row_data.children.length > 0">
			<process-row
					v-for="(row,index) in row_data.children"
					:key="row.ClientProcess.id"
					:index="index"
					:row_data="row"
					:parent_process_number="processNumber" />
		</div>

	</div>	
</template>

<script>
	import ProcessRow from '@/components/ProcessRow.vue';
	import {Drag} from 'vue-drag-drop';

	export default {
		name: 'process-row',
		components: {
			'process-row' : ProcessRow,
			Drag
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
			parent_process_number: {
				type: String,
				default: ""
			}
		},
		methods: {
			/**
			 * trigger on mouse down
			 * duplicate row info for a draggable item
			 * @param  {[type]} e [description]
			 * @return {[type]}   [description]
			 */
			onTouchStart(e){
				e.preventDefault();
				// set current drag item
				this.$store.commit('setDraggableProcess',this.row_data.ClientProcess);
				// show draggable item
				document.getElementById('draggableProcess').classList.add('dragging');
			},
		},
		data(){
			return {}
		},
		computed: {
			processNumber(){
				// if parent process doesn't has a number ?
				if(this.parent_process_number == ""){
					// use my own
					return this.row_data.ClientProcess.process_number;
				}else{
					return `${this.parent_process_number}.${this.index +1}`;
				}
			},
			processName(){
				return this.row_data.ClientProcess.name;	
			},
			// check if it has a search result match
			matchedClass(){
				if(this.row_data.name_match == undefined) return "";
				return (this.row_data.name_match || this.row_data.tag_match)? "matched" : "not-matched";
			}
		}
	}
</script>