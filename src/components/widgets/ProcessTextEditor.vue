<template>
	<div class="flow-widget editor" :class="altClass">
		<div class="edit-view" v-if="mode == 'edit'">
			<editor
				v-model="content"
				:api-key="apiKey"
				:init="tiny_options" />
			<div class="save-button"><a href="#" class="flow-button secondary" @click.prevent="saveChanges">Save</a></div>
			<div class="delete-widget" @click.prevent="deleteWidget">
				<i class="fas fa-times-circle"></i>
			</div>
		</div>
		<div class="list-view" v-if="mode == 'view'">
			<div class="widget-type"><i class="fas fa-font"></i></div>
			<div class="content"  v-html="this.content"></div>
			<div class="edit-widget" @click="editWidget" v-if="process_tree_mode == 'ptree-edit'"><i class="fas fa-edit"></i></div>
		</div>
	</div>
</template>

<script>
	import Editor from '@tinymce/tinymce-vue';
	import _ from 'lodash';
	import {mapState} from 'vuex';

	export default {
		name: "widget-text-editor",
		props: {
			index: {
				type: Number,
				default: 0
			},
			row_data : {
				type : Object,
				default : () => {}
			}
		},
		components: {
			Editor
		},
		data(){
			return {
				/**
				 * options for tinymce editor
				 * @type {Object}
				 */
				tiny_options : {
					//selector: selector,
					/*plugins: 'powerpaste casechange importcss searchreplace autolink autosave save directionality advcode visualblocks visualchars fullscreen image link media mediaembed template codesample table charmap hr pagebreak nonbreaking anchor toc insertdatetime advlist lists checklist wordcount tinymcespellchecker a11ychecker imagetools textpattern noneditable help formatpainter permanentpen pageembed charmap quickbars linkchecker emoticons',*/
					imagetools_cors_hosts: ['picsum.photos'],
					menubar: 'file edit view insert format tools table tc help',
					toolbar: 'undo redo | bold italic underline strikethrough | fontselect fontsizeselect formatselect | alignleft aligncenter alignright alignjustify | outdent indent |  numlist bullist checklist | forecolor backcolor casechange permanentpen formatpainter removeformat | pagebreak | charmap emoticons | fullscreen  preview save print | insertfile image media pageembed template link anchor codesample | a11ycheck ltr rtl | showcomments addcomment',
					autosave_ask_before_unload: true,
					autosave_interval: "30s",
					autosave_prefix: "{path}{query}-{id}-",
					autosave_restore_when_empty: false,
					autosave_retention: "2m",
					image_advtab: true,
					content_css: [
					'//fonts.googleapis.com/css?family=Lato:300,300i,400,400i',
					'//www.tiny.cloud/css/codepen.min.css'
					],
					importcss_append: true,
					height: 400,
					templates: [
					{ title: 'New Table', description: 'creates a new table', content: '<div class="mceTmpl"><table width="98%%"  border="0" cellspacing="0" cellpadding="0"><tr><th scope="col"> </th><th scope="col"> </th></tr><tr><td> </td><td> </td></tr></table></div>' },
					{ title: 'Starting my story', description: 'A cure for writers block', content: 'Once upon a time...' },
					{ title: 'New list with dates', description: 'New List with dates', content: '<div class="mceTmpl"><span class="cdate">cdate</span><br /><span class="mdate">mdate</span><h2>My List</h2><ul><li></li><li></li></ul></div>' }
					],
					template_cdate_format: '[Date Created (CDATE): %m/%d/%Y : %H:%M:%S]',
					template_mdate_format: '[Date Modified (MDATE): %m/%d/%Y : %H:%M:%S]',
					image_caption: true,
					quickbars_selection_toolbar: 'bold italic | quicklink h2 h3 blockquote quickimage quicktable',
					noneditable_noneditable_class: "mceNonEditable",
					toolbar_drawer: 'sliding',
					spellchecker_dialog: true,
					spellchecker_whitelist: ['Ephox', 'Moxiecode'],
					tinycomments_mode: 'embedded',
					contextmenu: "link image imagetools table configurepermanentpen",
					content_style: '.mce-annotation { background: #fff0b7; } .tc-active-annotation {background: #ffe168; color: black; }',
					// image uplaoder
					images_upload_url: '',
					images_upload_credentials: true
				},
				content : "",
				local_data: {},
				mode: "view"
			}
		},
		mounted(){
			this.local_data = _.cloneDeep(this.row_data);
			this.content = this.local_data.content;
		},
		methods: {
			/**
			 * send request to store to delete current widget
			 * @return {[type]} [description]
			 */
			deleteWidget(){
				this.$emit('delete',this.index);
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
		watch: {
			content() {
				this.local_data.content = this.content;
				this.$emit('input',{
					type : "text",
					index : this.index,
					data : this.local_data
				});
			},
			process_tree_mode(){
				if(this.process_tree_mode != "ptree-edit") this.mode = "view";
			}
		},
		computed: {
			altClass(){
				return (this.index % 2) == 0 ? "" : "alt-row";
			},
			apiKey() {
				return process.env.VUE_APP_TINY_API_KEY;
			},
			...mapState({
				process_tree_mode : state => state.process_tree_mode
			})
		}
	}
</script>