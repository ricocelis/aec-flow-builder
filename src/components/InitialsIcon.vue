<template>
	<div class="initials-icon" @click="onClick"><span>{{ initials }}</span></div>
</template>
<script>
	export default {
		name : "initials-icon",
		components: {

		},
		props: {
			name: {
				type: String,
				default: () => {}
			}
		},
		methods: {
			onClick(e){
				this.$emit('click',e);
			}
		},
		computed: {
			initials(){
				let arr = this.name.toUpperCase().split(" ");
				if(arr.length > 1){ 
					return arr[0].substring(0,1)  + arr[arr.length -1].substring(0,1);
				}else{
					return arr[0].substring(0,2);
				}
			}
		}
	}
</script>