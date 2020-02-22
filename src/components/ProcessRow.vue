<template>
	<div class="process-row noselect" :class="matchedClass">
		<Drag
			:draggable="process_tree_mode == 'ptree-edit'"
			:transfer-data="{ data: { type:'process' , data : this.row_data }}" >
			<div class="process-info" :class="{expanded: show_children}">
				<div class="expander"
					v-if="hasChildren"
					@click.prevent="toggleChildren"><i class="fas fa-caret-right blue"></i></div>
				<span class="process-number">{{ this.row_data.ClientProcess.process_number }}</span> <span class="process-name"> {{ this.row_data.ClientProcess.name }}</span>
				<i class="fas fa-expand-arrows-alt" v-if="process_tree_mode == 'ptree-edit'"></i>
			</div>
			<div slot="image" class='draggable-container'>
				<div class="draggable-item noselect" id="draggableProcess">{{ this.row_data.ClientProcess.name }}</div>
			</div>
		</Drag>
		<slide-up-down :active="show_children">
			<div class="children" v-if="hasChildren">
				<process-row
						v-for="(row,index) in row_data.children"
						:key="row.ClientProcess.id"
						:index="index"
						:row_data="row" />
			</div>
		</slide-up-down>
	</div>	
</template>

<script>
	import SlideUpDown from 'vue-slide-up-down'
	import ProcessRow from '@/components/ProcessRow.vue';
	import {Drag} from 'vue-drag-drop';
	import {mapState} from 'vuex';

	export default {
		name: 'process-row',
		components: {
			'process-row' : ProcessRow,
			'slide-up-down' : SlideUpDown,
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
			/**
			 * show/hide children
			 * @return {[type]} [description]
			 */
			toggleChildren(){
				if(!this.hasChildren) return;
				this.show_children = !this.show_children;
			}
		},
		data(){
			return {
				show_children: true
			}
		},
		computed: {
			hasChildren(){
				return (this.row_data.children.length > 0);
			},
			// check if it has a search result match
			matchedClass(){
				if(this.row_data.name_match == undefined) return "";
				return (this.row_data.name_match || this.row_data.tag_match)? "matched" : "not-matched";
			},
			...mapState({
				process_tree_mode : state => state.process_tree_mode
			})
		}
	}
</script>