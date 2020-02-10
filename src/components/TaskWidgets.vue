<template>
	<div class="task-widgets">
		<div class="sidenav">
			<!-- text editor -->
			<div class="widget-icon" v-tooltip.top-center="`+ Text Editor`">
				<i class="fas fa-font"></i>
			</div>
			<div class="divider"></div>
			<!-- file upload -->
			<div class="widget-icon" v-tooltip.top-center="`+ File Upload`">
				<i class="fas fa-file-alt"></i>
			</div>
			<div class="divider"></div>
			<!-- form -->
			<div class="widget-icon" v-tooltip.top-center="`+ Form Fields`">
				<i class="fas fa-clipboard-list"></i>
			</div>
			<div class="divider"></div>
			<!-- tasks -->
			<div class="widget-icon" v-tooltip.top-center="`+ Subtasks`">
				<i class="fas fa-tasks"></i>
			</div>
		</div>
	</div>
</template>

<script>
	export default {
		name: "task-widgets",
		components: {

		},
		data(){
			return {

			}
		}
	}
</script>