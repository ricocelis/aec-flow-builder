<template>
	<div class="process-row noselect" :class="matchedClass" ref="processRow">
		<div class="process-info" :class="{expanded: show_children}">
			<div class="expander"
				v-if="hasChildren"
				@click.prevent="toggleChildren"><i class="fas fa-caret-right blue"></i></div>
			<div class="name">
				<span class="process-number" v-if="mode == 'view'">{{ processNumber }}</span>
				<span class="process-name" v-if="mode == 'view'"> {{ processName }}</span>
				<!-- edit name -->
				<a href="#"
					v-tooltip.top-center="`Edit Section Name`"
					@click.prevent="editProcessName" v-if="process_tree_mode == 'ptree-edit' && mode == 'view'"><i class="fas green fa-edit"></i></a>
				<!-- process tags -->
				<ProcessTags
					:process="row_data"
					v-if="process_tree_mode == 'ptree-edit' && mode == 'view' && !new_process" />
				<!-- edit process name -->
				<div class="edit-name" v-show="mode == 'edit'">
					<input type="text" v-model="process_number" placeholder="Enter Process Number" v-if="level === 0" ref="processNumberInput"  @keyup="checkEnter">
					<input type="text" v-model="process_name" placeholder="Enter Section Name" ref="processNameInput"  @keyup="checkEnter">
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
				<div class="add-content">
					<i class="fas fa-plus add-section" v-tooltip.top-center="`Add Content/Section`" @click.prevent="toggleAddOptions"></i>
					<div class="add-content-options tools-window right" v-show="add_options">
						<div class="icons">
							<div class="widget-icon" v-tooltip.top-center="`+ New Section`" @click.prevent="addSection">
								<i class="fas fa-stream"></i>
							</div>
							<div class="divider"></div>
							<div class="widget-icon" v-tooltip.top-center="`+ Text Editor`" @click.prevent="addTextEditor">
								<i class="fas fa-font"></i>
							</div>
							<div class="divider"></div>
							<!-- file upload -->
							<div class="widget-icon" v-tooltip.top-center="`+ File Upload`"  @click.prevent="addUpload">
								<i class="fas fa-file-alt"></i>
							</div>
							<div class="divider"></div>
							<!-- form -->
							<small style="margin-right: 10px;">form:</small>
							<!-- textfield -->
							<div class="widget-icon" @click.prevent="addTextField" v-tooltip.top-center="`+ Text Field`">
								<i class="far fa-square"></i>
							</div>
							<div class="divider"></div>
							<!-- textarea -->
							<div class="widget-icon" @click.prevent="addTextArea" v-tooltip.top-center="`+ Text Area`">
								<i class="fas fa-paragraph"></i>
							</div>
							<div class="divider"></div>
							<!-- dropdown -->
							<div class="widget-icon" @click.prevent="addSelect" v-tooltip.top-center="`+ DropDown`">
								<i class="far fa-caret-square-down"></i>
							</div>
							<div class="divider"></div>
							<!-- checkbox -->
							<div class="widget-icon" @click.prevent="addCheckbox" v-tooltip.top-center="`+ Checkbox`">
								<i class="far fa-check-square"></i>
							</div>
							<div class="divider"></div>
							<!-- date picker -->
							<div class="widget-icon" @click.prevent="addDatePicker" v-tooltip.top-center="`+ Date Picker`">
								<i class="far fa-calendar-alt"></i>
							</div>
						</div>
					</div>
				</div>
				<i class="fas fa-trash-alt delete-section" v-tooltip.top-center="`Delete Section`" @click.prevent="deleteRow"></i>
				<i class="fas fa-sort sort-section"></i>
			</div>
		</div>
		<slide-up-down :active="show_children">
			<div class="content">
				<component
					v-for="(data,index) in local_content"
					:is="handleContentTypeComponent(data)"
					:key="index"
					:index="index"
					:row_data="data" />
			</div>
			<div class="children" v-if="hasChildren || add_new">
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
							:row_data="row"
							@delete="deleteContentRow"
							@input="onContentUpdate" />
				</Draggable>
				<process-row
					v-if="add_new"
					:level="level + 1"
					:parent_process="row_data.ClientProcess"
					@cancel="cancelAddNewSection"
					:new_process="true" />
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
	import VueScrollTo from 'vue-scrollto';
	import ProcessTextEditor from '@/components/widgets/ProcessTextEditor.vue';
	import ProcessFileUpload from '@/components/widgets/ProcessFileUpload.vue';
	// form fields
	import ProcessTextField from '@/components/widgets/ProcessTextField.vue';
	import ProcessTextArea from '@/components/widgets/ProcessTextArea.vue';

	import _ from 'lodash';

	export default {
		name: 'process-row',
		components: {
			'process-row' : ProcessRow,
			'slide-up-down' : SlideUpDown,
			Draggable,
			ProcessTags,
			ProcessTextEditor,
			ProcessFileUpload,
			ProcessTextField,
			ProcessTextArea
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
			},
			new_process: {
				type : Boolean,
				default: false
			},
			parent_process : {
				type : Object,
				default : () => {}
			},
		},
		data(){
			return {
				show_children: true,
				mode : "view",
				process_name : "",
				process_number : "",
				add_new :  false,
				add_options : false,
				local_content: []
			}
		},
		mounted() {
			if(!this.new_process){
				this.process_name  = this.row_data.ClientProcess.name;
				this.process_number = this.row_data.ClientProcess.process_number;
			}else{
				this.setupNewProcess();
			}
			if(this.row_data != undefined) this.local_content = _.cloneDeep(this.row_data.ClientProcessContent);
		},
		methods: {
			setupNewProcess(){
				this.mode = "edit";
				VueScrollTo.scrollTo(this.$refs.processRow,500,{
					container: "#processList",
					easing: 'ease-in',
					offset: -60,
					force: true,
				});
				
				setTimeout( () => {
					// if level 0
					if(this.level == 0){
						// focus on process number
						this.$refs.processNumberInput.focus();
					}else{
						this.$refs.processNameInput.focus();
					}
				},500);
			},
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
				if(this.new_process){
					// let parent know to cancel adding new section
					this.process_number = "";
					this.process_name = "";
					this.$emit('cancel');
				}else{
					this.mode = "view";
					this.process_name  = this.row_data.ClientProcess.name;
					this.process_number = this.row_data.ClientProcess.process_number;
				}
			},
			/**
			 * if user clicked enter key.
			 * @param  {[type]} e [description]
			 * @return {[type]}       [description]
			 */
			checkEnter(e){
				const code = (e.keyCode ? e.keyCode : e.which);
				if(code == 13) this.saveChanges();
			},
			deleteRow(){
				const confirmation = confirm(`Are you want to delete ${this.row_data.ClientProcess.name} and all the subsections?`);
				if(confirmation){
					this.$store.commit('deleteProcess',this.row_data);
					this.$store.commit('setNewProcessNumbers');
				}
			},
			/**
			 * add new section to the children
			 */
			addSection(){
				this.add_new = true;
				this.toggleAddOptions();
			},
			cancelAddNewSection(){
				this.add_new = false;
			},
			/**
			 * show/hide window to add content or sections
			 * @return {[type]} [description]
			 */
			toggleAddOptions(){
				this.add_options = ! this.add_options;
			},
			/**
			 * add text editor widget
			 */
			addTextEditor(){
				this.local_content.push({
					content_type: "text",
					content : ""
				});
				this.toggleAddOptions();
			},
			/**
			 * add upload widget
			 */
			addUpload(){
				this.local_content.push({
					content_type: "file",
					filename : "",
					original_filename : "",
					file_extension : "",
					file_size : 0
				});
				this.toggleAddOptions();
			},
			/**
			 * add form widget
			 */
			addForm(){
				this.toggleAddOptions();
			},
			/**
			 * determine component type based data.type
			 * @param  {[type]} data [description]
			 * @return {[type]}      [description]
			 */
			handleContentTypeComponent(data){
				let component = null;
				switch(data.content_type){
					case "text":
						component = "ProcessTextEditor";
					break;
					case "file":
						component = "ProcessFileUpload";
					break;
					case "textfield":
						component = "ProcessTextField";
					break;
					case "textarea":
						component = "ProcessTextArea";
					break;
				}
				return component;
			},
			/**
			 * confirm that user wants to delete this content
			 * @param  {[type]} index [description]
			 * @return {[type]}      [description]
			 */
			deleteContentRow(index){
				this.local_content.split(index,1);
			},
			/**
			 * content on widget component changed.
			 * @param  {[type]} data [description]
			 * @return {[type]}      [description]
			 */
			onContentUpdate(data){
				this.local_content[data.index] = data.data;
			},
			/**
			 * add text field widget to content list
			 */
			addTextField(){
				this.local_content.push({
					content_type: "textfield",
					field_name : "",
					field_instructions : ""
				});
				this.toggleAddOptions();
				this.show_form_tools = false;
			},
			addSelect(){
				this.$store.commit('addSelectFieldWidget');
				this.show_form_tools = false;
			},
			addCheckbox(){
				this.$store.commit('addCheckboxWidget');
				this.show_form_tools = false;
			},
			addDatePicker(){
				this.$store.commit('addDatePickerWidget');
				this.show_form_tools = false;
			},
			/**
			 * add text area widget to content list
			 */
			addTextArea(){
				this.local_content.push({
					content_type: "textarea",
					field_name : "",
					field_instructions : ""
				});
				this.toggleAddOptions();
				this.show_form_tools = false;
			},
		},
		computed: {
			processNumber(){
				if(this.row_data == undefined) return "";
				return this.row_data.ClientProcess.process_number;
			},
			processName(){
				if(this.row_data == undefined) return "";
				return this.row_data.ClientProcess.name;
			},
			hasChildren(){
				if(this.row_data == undefined) return false;
				return (this.row_data.children.length > 0);
			},
			// check if it has a search result match
			matchedClass(){
				if(this.row_data == undefined) return "";

				if(this.row_data.name_match == undefined) return "";
				return (this.row_data.name_match || this.row_data.tag_match)? "matched" : "not-matched";
			},
			...mapState({
				process_tree_mode : state => state.process_tree_mode
			})
		},
		watch : {
			/**
			 * copy content locally if row_data changes.
			 * @return {[type]} [description]
			 */
			row_data() {
				this.local_content = _.cloneDeep(this.row_data.ClientProcessContent);
			}
		}
	}
</script>