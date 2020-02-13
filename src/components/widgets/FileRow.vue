<template>
    <div class="file" :class="{'has-error' : hasError}">
    <div class="inner">
        <p class="file-name">{{ file_name }}</p>
        <p class="size">{{ fileSize }}</p>
        <a href="#" @click.prevent="deleteFile" v-if="uploaded"><i class="fas fa-times"></i></a>
    </div>
    <div class="progress" :class="{'hide': !show_progress}">
        <span :style="`width: ${upload_progress}%`"></span>
    </div>
</div>
</template>

<script>
// import any required components
// export component
export default {
    // properties that the component will receive from parent
    props: {
        record: {
            type: Object,
            default: () => {}
        },
        index: {
            type: Number,
            default: 0
        }
    },
    // components to use in template
    components:{

    },
    // component data
    data() {
        return {
            uploaded: false,
            show_progress: false,
            upload_progress: 0,
            file_name: "",
            file_size: 0,
            error: null
        };
    },
    // component was mounted
    mounted(){
    this.file_name = this.record.file.name;
    this.sendFile();
    },
    // any methods needed for this component
    methods: {
        deleteFile(){
        // delete file from server
        // send event to remove row from list.
        this.$emit('delete',this.index) 
        },
        /**
        * send file to server
        * @param  {file} file file to upload
        * @return {void}
        */
        sendFile(){
            var formData = new FormData();
            formData.append("file", this.record.file);
            this.show_progress = true;
            // upload configuration
            var config = {
                'X-CSRF-TOKEN' : document.querySelector('#token').getAttribute('content'),
                onUploadProgress: function(event){
                    var progress = Math.round( (event.loaded * 100) / event.total );
                    this.onUploadProgress(progress);
                }.bind(this)
            };
            let endpoint = `/upload/temp`;
            //eslint-disable-next-line
            axios.post(endpoint,formData,config)
                .then(response => this.fileUploadSuccess(response.data))
                .catch(error => this.handleUploadError(error.response));
        },
        /**
        * method called when as file is uploaded to track progress.
        * @param  float progress percentage
        * @return void
        */
        onUploadProgress(progress){
            this.upload_progress = progress;
        },
        /**
        * method is called once the file has uploaded.
        * @param  object response upload response from server.
        * @return void
        */
        fileUploadSuccess(response){
            this.show_progress = false;
            if(response.success){
                this.uploaded = true;
                this.file_size = response.file_size;
                this.$emit('success',{
                    uploaded : true,
                    file_name: response.name,
                    original: response.original,
                    file_size: response.file_size,
                    extension: response.extension
                });
            }else{
                this.$emit('error',response.error);
                this.uploaded = true;
                this.error = response.error;
                this.file_name = response.error;
            }
        },
        /**
        * called if there was an error with the upload.
        * @param  object error http error
        * @return void
        */
        handleUploadError(error){
            // hide upload error
            this.upload_progress = 0;
            this.show_progress = false;
            this.error = error;
        },
    },
    // computed properties
    computed:{
        hasError(){
            return this.error != null;
        },
        fileSize(){
            if(this.file_size > 0){
                return this.file_size.formatBytes(2);
            }
            return "";
        }
    },
    // property watchers
    watch:{}
}
</script>