<template>
	<div class="flow-widget form-field textarea"  :class="altClass">
		<div class="edit-view" v-if="mode == 'edit'">
			<input type="text" v-model="local_data.field_name" placeholder="Enter Field Label" class="label" ref="label">
			<textarea :disabled="true" :placeholder="placeholder" class="field" rows="3"></textarea>
			<input type="text" v-model="local_data.field_instructions" class="instructions" placeholder="Enter Field Instructions. Leave blank if not needed" />
			<!-- save changes -->
			<div class="save-button"><a href="#" class="flow-button secondary" @click.prevent="saveChanges">Save</a></div>
			<!-- delete widget -->
			<div class="delete-widget" @click.prevent="deleteWidget">
				<i class="fas fa-times-circle"></i>
			</div>
		</div>
		<div class="list-view" v-if="mode == 'view'">
			<div class="widget-type"><i class="fas fa-paragraph"></i></div>
			<div class="content">
				<label>{{ local_data.field_name }}</label>
				<textarea :disabled="true" :placeholder="placeholder" class="field" rows="3"></textarea>
				<div class="field-instructions" v-if="local_data.field_instructions.length > 0">{{ local_data.field_instructions }}</div>
			</div>
			<div class="edit-widget" @click="editWidget" v-if="process_tree_mode == 'ptree-edit'"><i class="fas fa-edit"></i></div>
		</div>
	</div>
</template>

<script>
	import {mapState} from 'vuex';
	import _ from 'lodash';
	export default {

		name : "process-textarea-widget",
		components: {

		},
		props: {
			/** @type {Number} index in process content list. */
			index: {
				type: Number,
				default: 0
			},
			row_data : {
                type : Object,
                default : () => {}
            }
		},
		data(){
			return {
				local_data: {
					field_name : "",
					field_instructions : ""
				},
				mode : "view"
			};
		},
		mounted(){
			this.local_data = _.cloneDeep(this.row_data);
			if(this.local_data.id == undefined){
				this.mode = "edit";
				this.$refs.label.focus();
			}
		},
		methods: {
			/**
			 * send request to store to delete current widget
			 * @return {[type]} [description]
			 */
			deleteWidget(){
				this.$store.commit('deleteWidget',this.index);
			},
			/**
			 * set edit mode to true.
			 * @return {[type]} [description]
			 */
			editWidget(){
				this.mode = "edit";
			},
			/**
			 * user wants to save the changes made to the text editor.
			 * @return {[type]} [description]
			 */
			saveChanges(){
				this.mode = "view";
			}
		},
		computed : {
			altClass(){
				return (this.index % 2) == 0 ? "" : "alt-row";
			},
			placeholder(){
				return this.local_data.field_name.length > 0 ? `Enter ${this.local_data.field_name}` : "";
			},
			...mapState({
				/** active index in task list */
				active_index : state => state.active_index,
				process_tree_mode : state => state.process_tree_mode
			})
		}
	}
</script>