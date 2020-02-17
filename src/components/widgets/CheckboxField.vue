<template>
	<div class="flow-widget form-field checkbox"  :class="altClass">
		<div class="edit">
			<div class="field">
				<input type="text" v-model="field_name" placeholder="Enter Field Label" class="label" ref="label">
				<div class="checkboxes">
					<div class="form-row checkbox"
						v-for="(option,index) in cOptions"
							:key="index">
						<checkbox
							v-model="local_options"
							:value="option"
							:disabled="true"
							@click.prevent="optionSelected(option)"> {{ option }}
						</checkbox>
					</div>
				</div>
				<input type="text" v-model="instructions" class="instructions" placeholder="Enter Field Instructions. Leave blank if not needed" />
			</div>
			<div class="options">
				<div class="form-row">
					<label>Options (One per line)</label>
					<textarea rows="5" v-model="options"></textarea>
				</div>
				<div class="form-row checkbox">
					<checkbox v-model="multiple">
						Allow Multiple Selection.
					</checkbox>
				</div>
			</div>
			
			<!-- delete widget -->
			<div class="delete-widget" @click.prevent="deleteWidget">
				<i class="fas fa-times-circle"></i>
			</div>
		</div>
	</div>
</template>

<script>
	import {mapState} from 'vuex';
	export default {

		name : "textarea-widget",
		components: {

		},
		props: {
			/** @type {Number} index in task widgets list. */
			index: {
				type: Number,
				default: 0
			}
		},
		data(){
			return {
				local_options: []
			};
		},
		mounted(){
			this.$refs.label.focus();
		},
		methods: {
			/**
			 * send request to store to delete current widget
			 * @return {[type]} [description]
			 */
			deleteWidget(){
				this.$store.commit('deleteWidget',this.index);
			},
		},
		computed : {
			altClass(){
				return (this.index % 2) == 0 ? "" : "alt-row";
			},
			emptyOption(){
				return (this.field_name.length > 0)? `Choose ${this.field_name}` : "";
			},
			/**
			 * use options text area to create array of options.
			 * @return {[type]} [description]
			 */
			cOptions(){
				let options_array = [];
				if(this.options.length > 0){
					options_array = this.options.split("\n");
				}
				return options_array;
			},
			/**
			 * map to widget fields in store
			 * @type {Object}
			 */
			field_name: {
				get() { return this.$store.state.flow_items[this.active_index].widgets[this.index].data.name },
				set(value){ 
					this.$store.commit('updateTextFieldName',{
						index: this.index,
						value: value,
					});
				}
			},
			instructions: {
				get() { return this.$store.state.flow_items[this.active_index].widgets[this.index].data.instructions },
				set(value){ 
					this.$store.commit('updateFormFieldInstructions',{
						index: this.index,
						value: value,
					});
				}
			},
			options: {
				get() { return this.$store.state.flow_items[this.active_index].widgets[this.index].data.options },
				set(value){ 
					this.$store.commit('updateFormFieldOptions',{
						index: this.index,
						value: value,
					});
				}
			},
			multiple: {
				get() { return this.$store.state.flow_items[this.active_index].widgets[this.index].data.multiple },
				set(value){ 
					this.$store.commit('updateCheckboxMultipleOption',{
						index: this.index,
						value: value,
					});
				}
			},
			placeholder(){
				return this.field_name.length > 0 ? `Enter ${this.field_name}` : "";
			},
			...mapState({
				/** active index in task list */
				active_index : state => state.active_index,
			})
		}
	}
</script>