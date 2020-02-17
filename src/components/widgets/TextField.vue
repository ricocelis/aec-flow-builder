<template>
	<div class="flow-widget form-field textfield"  :class="altClass">
		<div class="edit">
			<input type="text" v-model="field_name" placeholder="Enter Field Label" class="label" ref="label">
			<input type="text" :disabled="true" :placeholder="placeholder" class="field">
			<input type="text" v-model="instructions" class="instructions" placeholder="Enter Field Instructions. Leave blank if not needed" />
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

		name : "textfield-widget",
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
			}
		},
		computed : {
			altClass(){
				return (this.index % 2) == 0 ? "" : "alt-row";
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