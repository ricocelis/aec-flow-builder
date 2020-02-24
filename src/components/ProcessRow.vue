<template>
	<div class="process-row noselect" :class="matchedClass">
		<div class="process-info" :class="{expanded: show_children}">
			<div class="expander"
				v-if="hasChildren"
				@click.prevent="toggleChildren"><i class="fas fa-caret-right blue"></i></div>
			<div class="name">
				<span class="process-number" v-if="mode == 'view'">{{ this.row_data.ClientProcess.process_number }}</span>
				<span class="process-name" v-if="mode == 'view'"> {{ this.row_data.ClientProcess.name }}</span>
				<!-- edit name -->
				<a href="#"
					v-tooltip.top-center="`Edit Section Name`"
					@click.prevent="editProcessName" v-if="process_tree_mode == 'ptree-edit' && mode == 'view'"><i class="fas green fa-edit"></i></a>
				<!-- process tags -->
				<ProcessTags :process="row_data" v-if="process_tree_mode == 'ptree-edit' && mode == 'view'" />
				<!-- edit process name -->
				<div class="edit-name" v-show="mode == 'edit'">
					<input type="text" v-model="process_number" placeholder="Enter Process Number" v-if="level === 0"  @keyup="checkEnter">
					<input type="text" v-model="process_name" placeholder="Enter Section Name" ref="procesNameInput"  @keyup="checkEnter">
					<a href="#" v-tooltip.top-center="`Save Changes`" class="save-process-name"
						@click.prevent="saveChanges">
						<i class="fas green fa-check"></i>
					</a>
					<a href="#" v-tooltip.top-center="`Cancel`" class="cancel-save-process-name"
						@click.prevent="cancelSaveChanges">
						<i class="fas red fa-times" aria-hidden="true"></i>
					</a>
				</div>
			</div>
			<!-- drag icon -->
			<div class="tools" v-if="process_tree_mode == 'ptree-edit'">
				<i class="fas fa-plus add-section" v-tooltip.top-center="`Add Section`"></i>
				<i class="fas fa-trash-alt delete-section" v-tooltip.top-center="`Delete Section`"></i>
				<i class="fas fa-sort sort-section"></i>
			</div>
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
							:level="level + 1"
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
	import ProcessTags from '@/components/ProcessTags.vue';

	export default {
		name: 'process-row',
		components: {
			'process-row' : ProcessRow,
			'slide-up-down' : SlideUpDown,
			Draggable,
			ProcessTags
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
			/**
			 * where in the process tree is this node
			 * @type {Object}
			 */
			level : {
				type : Number,
				default : 0
			}
		},
		data(){
			return {
				show_children: true,
				mode : "view",
				process_name : "",
				process_number : ""
			}
		},
		mounted() {
			this.process_name  = this.row_data.ClientProcess.name;
			this.process_number = this.row_data.ClientProcess.process_number;
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
			/**
			 * let store know that changes were made and needs to renumber items
			 * @return {[type]} [description]
			 */
			onUpdateSorting(){
				this.$store.commit('setNewProcessNumbers');
			},
			/**
			 * set name mode to edit
			 * @return {[type]} [description]
			 */
			editProcessName(){
				this.mode = "edit";
				setTimeout(() => {
					this.$refs.procesNameInput.focus();
				},100);	
			},
			/**
			 * send server request to edit name.
			 * @return {[type]} [description]
			 */
			saveChanges(){
				this.$store.commit('saveProcessName',{
					process : this.row_data,
					name : this.process_name,
					process_number : this.process_number,
					level : this.level
				});
				this.mode = "view";

				// renumber of neccesary
				this.$store.commit('setNewProcessNumbers');
			},
			/**
			 * reset edit textfields
			 * change mode back to view
			 * @return {[type]} [description]
			 */
			cancelSaveChanges(){
				this.mode = "view";
				this.process_name  = this.row_data.ClientProcess.name;
				this.process_number = this.row_data.ClientProcess.process_number;
			},
			/**
			 * if user clicked enter key.
			 * @param  {[type]} e [description]
			 * @return {[type]}       [description]
			 */
			checkEnter(e){
				const code = (e.keyCode ? e.keyCode : e.which);
				if(code == 13) this.saveChanges();
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