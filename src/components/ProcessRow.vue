<template>
	<div class="process-row noselect" :class="matchedClass">
		<div class="process-info" :class="{expanded: show_children}">
			<div class="expander"
				v-if="hasChildren"
				@click.prevent="toggleChildren"><i class="fas fa-caret-right blue"></i></div>
			<span class="process-number">{{ this.row_data.ClientProcess.process_number }}</span> <span class="process-name"> {{ this.row_data.ClientProcess.name }}</span>
			<i class="fas fa-expand-arrows-alt" v-if="process_tree_mode == 'ptree-edit'"></i>
		</div>
		<slide-up-down :active="show_children">
			<div class="children" v-if="hasChildren">
				<Draggable
					:options="{disabled : process_tree_mode != 'ptree-edit'}"
					v-model="row_data.children"
					@update="onUpdateSorting"
					ghost-class="sorting">
					<process-row
							v-for="(row,index) in row_data.children"
							:key="row.ClientProcess.id"
							:index="index"
							:row_data="row" />
				</Draggable>
			</div>
		</slide-up-down>
	</div>	
</template>

<script>
	import SlideUpDown from 'vue-slide-up-down'
	import ProcessRow from '@/components/ProcessRow.vue';
	import {mapState} from 'vuex';
	import Draggable from 'vuedraggable';

	export default {
		name: 'process-row',
		components: {
			'process-row' : ProcessRow,
			'slide-up-down' : SlideUpDown,
			Draggable
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
			},
		},
		data(){
			return {
				show_children: true
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
			},
			onUpdateSorting(){
				this.$store.commit('setNewProcessNumbers');
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