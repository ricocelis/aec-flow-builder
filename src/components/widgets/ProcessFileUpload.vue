<template>
    <div class="flow-widget upload"
         :class="altClass">
        <div class="drag-and-drop"
            :class="{
                'has-drag-and-drop' : isAdvancedUpload,
                'dragging-over' : drag_over }">
            <div class="drop-container"
                @drop.prevent="dropHandler"
                @drag.prevent="blankMethod"
                @dragstart.prevent="blankMethod"
                @dragend.prevent="blankMethod"
                @dragenter.prevent="blankMethod"
                @dragover.prevent="onDragOver"
                @dragleave.prevent="onDragLeave"
                v-show="files.length == 0"
                ref="uploader">
                <div class="upload-message" v-if="files.length == 0">
                    <i class="fas fa-cloud-upload-alt"></i> Drap and Drop
                </div>
                <div class="drop-footer uk-text-center" v-show="files.length == 0">
                    <p style="margin: 5px 0 0 0">OR</p>
                    <p style="margin: 5px 0 0 0"><a href="#" class="" @click.prevent="chooseFiles">Browse All Files</a></p>
                    <p style="margin: 10px 0 0 0">Allowed Documents: {{ allowedDocuments }}</p>
                    <p style="margin: 0 0 10px 0">Allowed Images: {{ allowedImages }}</p>
                </div>
            </div>
            <div class="drop-files" v-show="files.length > 0">
                <FileRow v-for="(file,index) in files"
                :record="file"
                @success="onFileUploaded"
                @delete="onFileDelete"
                :key="index"
                :index="index" />
            </div>
            <div class="file-input"><input type="file" ref="fileInput" @change="uploadFile($event)" /></div>
        </div>
        <div class="delete-widget" @click.prevent="deleteWidget">
            <i class="fas fa-times-circle"></i>
        </div>
    </div>
</template>

<script>
    // import any required components
    import FileRow from './FileRow.vue';
    import {mapState} from 'vuex';
    import _ from 'lodash';

    // export component
    export default {
        // properties that the component will receive from parent
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
        // components to use in template
        components:{
            FileRow
        },
        // component data
        data() {
            return {
                drag_over: false,
                local_data: {},
                files: []
            };
        },
        // component was mounted
        mounted(){
            this.local_data = _.cloneDeep(this.row_data);
            this.$bus.$on('clear_files', () => {
                this.clearFiles();
            });
        },
        // any methods needed for this component
        methods: {
            /**
            * trigger default browser choose file.
            * @return {[type]} [description]
            */
            chooseFiles(){
                this.$refs.fileInput.click();
            },
            /**
            * clear all files.
            * @return {[type]} [description]
            */
            clearFiles(){
                // clear local list of files
                this.files = [];
                // clear selected files in file input
                this.$refs.fileInput.value = null;
            },
            /**
            * event handler when user selectes file(s)
            * @param  {[type]} e [description]
            * @return {[type]}   [description]
            */
            uploadFile(event){
                for(let i in event.target.files){
                    const file = event.target.files[i];
                    if (typeof file == "object") this.sendFile(file);
                }
            },
            /**
            * add file to array of files to be uploaded.
            * @param  {[type]} file [description]
            * @return {[type]}      [description]
            */
            sendFile(file){
                this.files.push({
                    uploaded: false,
                    file: file
                });
            },
            /**
            * handle user dropping file
            * @param  {object} event Event object
            * @return {void}
            */
            dropHandler(event){
                event.stopPropagation();
                event.preventDefault();
                let file;
                if(event.dataTransfer.files == undefined){
                    file = event.dataTransfer.items[0].getAsFile();
                }else{
                    file = event.dataTransfer.files[0];
                }
                this.sendFile(file);
            },
            blankMethod(event){
                event.preventDefault();
                event.stopPropagation();
            },
            onDragOver(event){
                event.preventDefault();
                event.stopPropagation();
                this.drag_over = true;
            },
            onDragLeave(event){
                event.preventDefault();
                event.stopPropagation();
                this.drag_over = false;
            },
            /**
            * event listener to when a file was uploaded.
            * @param  {[type]} index  [description]
            * @param  {[type]} record [description]
            * @return {[type]}        [description]
            */
            onFileUploaded(record){
                // save local data.
                this.local_data.filename = record.file_name;
                this.local_data.original_filename = record.original;
                this.local_data.file_size = record.file_size;
                this.local_data.file_extension = record.extension;
                // overwrite
                this.files = [record];
                // let parent component know content changed.
                this.$emit('input',{
                    type : "text",
                    index : this.index,
                    data : this.local_data
                });
            },
            /**
            * user wants to delete uploaded file.
            * @param  {[type]} index [description]
            * @return {[type]}       [description]
            */
            onFileDelete(index){
                // remove row
                this.files.splice(index,1);
            },
            /**
             * send request to store to delete current widget
             * @return {[type]} [description]
             */
            deleteWidget(){
                this.$emit('delete',this.index);
            }
        },
        // computed properties
        computed:{
            /**
             * alerternate class for row highlight
             * @return {[type]} [description]
             */
            altClass(){
                return (this.index % 2) == 0 ? "" : "alt-row";
            },
            /**
            * check wether browser can handle drag and drop
            * @return {Boolean} [description]
            */
            isAdvancedUpload(){
                var div = document.createElement('div');
                return (('draggable' in div) || ('ondragstart' in div && 'ondrop' in div)) && 'FormData' in window && 'FileReader' in window;
            },
            /**
             * list of allowed extensions to display
             * @return {[type]} [description]
             */
            allowedDocuments(){
                let extensions = [];
                for(let i in this.allowed_documents){
                    extensions.push("." + this.allowed_documents[i]);
                }
                return extensions.join(", ");
            },
            /**
             * list of allowed image uploads
             * @return {[type]} [description]
             */
            allowedImages(){
                let extensions = [];
                for(let i in this.allowed_images){
                    extensions.push("." + this.allowed_images[i]);
                }
                return extensions.join(", ");
            },
            /**
             * mapped properties
             * @param  {[type]} state [description]
             * @return {[type]}       [description]
             */
            ...mapState({
                process_tree_mode : state => state.process_tree_mode,
                allowed_documents: state => state.allowed_extensions.documents,
                allowed_images: state => state.allowed_extensions.images
            })
        },
        // property watchers
        watch:{
        }
    }
</script>