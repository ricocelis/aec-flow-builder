<template>
	<div class="task-widgets">
		<div class="sidenav">
			<div  v-show="isTask">
				<!-- text editor -->
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
				<div class="widget-icon">
					<i class="fas fa-clipboard-list" v-tooltip.top-center="`+ Form Fields`" @click.prevent="toggleFormWidgets"></i>
					<!-- form fields icons -->
					<div class="form-widgets tools-window left" v-show="show_form_tools">
						<div class="icons">
							<div class="widget-icon" @click.prevent="addTextField" v-tooltip.top-center="`+ Text Field`">
								<i class="far fa-square"></i>
							</div>
							<div class="h-divider"></div>
							<div class="widget-icon" @click.prevent="addTextArea" v-tooltip.top-center="`+ Text Area`">
								<i class="fas fa-paragraph"></i>
							</div>
							<div class="h-divider"></div>
							<div class="widget-icon" @click.prevent="addSelect" v-tooltip.top-center="`+ DropDown`">
								<i class="far fa-caret-square-down"></i>
							</div>
							<div class="h-divider"></div>
							<div class="widget-icon" @click.prevent="addCheckbox" v-tooltip.top-center="`+ Checkbox`">
								<i class="far fa-check-square"></i>
							</div>
						</div>
					</div>
				</div>
				<div class="divider"></div>
				<!-- tasks -->
				<div class="widget-icon" v-tooltip.top-center="`+ Subtasks`" @click.prevent="addSubtasks">
					<i class="fas fa-tasks"></i>
				</div>
			</div>
		</div>
		<div class="widgets-list">
			<component
				v-for="(widget,index) in widgets"
				:key="index"
				:is="widget.component"
				:index="index" />
		</div>
	</div>
</template>

<script>
	import {mapState} from 'vuex';
	import TextEditor from '@/components/widgets/TextEditor.vue';
	import FileUpload from '@/components/widgets/FileUpload.vue';
	import SubTasks from '@/components/widgets/SubTasks.vue';
	import TextField from '@/components/widgets/TextField.vue';
	import TextArea from '@/components/widgets/TextArea.vue';
	import SelectField from '@/components/widgets/SelectField.vue';
	import CheckboxField from '@/components/widgets/CheckboxField.vue';
	export default {
		name: "task-widgets",
		components: {
			TextEditor,
			FileUpload,
			SubTasks,
			TextField,
			TextArea,
			SelectField,
			CheckboxField
		},
		data(){
			return {
				show_form_tools: false,
				icon_hover_color: "#6f6f6f",
			}
		},
		methods: {
			addTextEditor(){
				this.$store.commit('addTextEditorWidget');
			},
			addUpload(){
				this.$store.commit('addUploadWidget');
			},
			addSubtasks(){
				this.$store.commit('addSubtasksWidget');
			},
			addTextField(){
				this.$store.commit('addTextFieldWidget');
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
			addTextArea(){
				this.$store.commit('addTextAreaWidget');
				this.show_form_tools = false;
			},
			toggleFormWidgets(){
				this.show_form_tools = ! this.show_form_tools;
			},
			overIcon(){
				this.icon_hover_color = "#DD9737";
			},
			leaveIcon(){
				this.icon_hover_color = "#6f6f6f";
			}
		},
		computed: {
			/**
			 * check if the current active item is a task and not a header
			 * @return {Boolean} [description]
			 */
			isTask(){ 
				if(this.flow_items[this.active_index] === undefined) return false;
				return this.flow_items[this.active_index].type == "task";
			},
			widgets(){
				if(this.flow_items[this.active_index] == undefined) return [];
				return this.flow_items[this.active_index].widgets;
			},
			...mapState({
				active_index : state => state.active_index,
				flow_items : state => state.flow_items
			})
		}
	}
</script>