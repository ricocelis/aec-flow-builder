<template>
	<div class="tag-manager">
		<div class="flex-container">
			<a href="#" class="tooltip add-tag with-badge">
				<i class="fas fa-tag" @click.prevent="toggleTagWindow"  v-tooltip.top-center="`Add Tags`"></i>
				<span class="badge" v-if="!add_tags && hasTags" @click.prevent='toggleTagWindow'>{{ tagCount }}</span> 
			</a>
			<div class="selected-tags" v-if="add_tags">
				<div class="tag"
					v-for="(linkage,index) in this.process.ClientProcessTagLinkage"
					:key="index"
					:class="linkage.color">
						{{ linkage.tag }}
						<a href="#" class="delete-selected-tag" @click.prevent="deleteTagLinkage(linkage)">X</a>
				</div>
			</div>
			<div class="tag-window" v-if="add_tags">
				<div class="arrow-up"></div>
				<div class="uk-card uk-card-default uk-card-body">
					<div class="field">
						<div class="icon"><i class="fas fa-tag" aria-hidden="true"></i></div>
						<div class="input">
							<input
								type="text" name="tag"
								placeholder="Enter Tag Name"
								class="tag-autocomplete"
								v-model="term">
						</div>
					</div>
					<div class="tag-results" v-show="hasResults">
						<div class="tag-result"
							v-for="(row,index) in search_results"
							:key="index"
							@click.prevent="addSelectedTag(row)">
							<div :class="`color ${row.ClientProcessTag.color}`">
								<div class="circle"></div>
							</div>
							<div class="tag-name">{{ row.ClientProcessTag.tag }}</div>
						</div>
					</div>
					<div class="create-new-tag" v-show="!hasResults && term.length > 0">
						<div class="colors">
							<div
								v-for="(color,index) in colors"
								:key="index"
								:class="`color ${color} ${selectedColorClass(color)}`"
								@click.prevent="selectColor(color)">
									<div class="circle"></div>
							</div>
						</div>
						<div class="footer"><button @click.prevent="createNewTag" :disabled="term.length === 0">Create New Tag</button></div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	import {mapState} from 'vuex';
	export default {
		name : 'process-tags',
		props : {
			process: {
				type : Object,
				default : () => {}
			}
		},
		data(){
			return {
				add_tags : false,
				colors: [
					'light-blue',
					'blue',
					'dark-blue',
					'purple',
					'light-purple',
					'red',
					'orange',
					'lime',
					'green',
					'teal'
				],
				selected_color : 'light-blue',
				search_results : [],
				// search term to add tag.
				term : ""
			};
		},
		methods : {
			/**
			 * show/hide tag window
			 * @return {[type]} [description]
			 */
			toggleTagWindow(){
				this.add_tags = ! this.add_tags; 
			},
			/**
			 * user wants to add the selected tag.
			 * @param {[type]} tag [description]
			 */
			addSelectedTag(tag){
				this.$store.commit('addSelectedTag',{
					process : this.process,
					tag : tag
				})
				this.search_results = [];
				this.term = "";
				this.add_tags = false;
			},
			/**
			 * check if the curent color is the same as the selected color
			 * @param  {[type]} color [description]
			 * @return {[type]}       [description]
			 */
			selectedColorClass(color) {
				return (this.selected_color == color)? "selected" : "";
			},
			/**
			 * user has selected a color
			 * make it be the selected color
			 * @param  {[type]} color [description]
			 * @return {[type]}       [description]
			 */
			selectColor(color){
				this.selected_color = color;
			},
			searchTags(){
				const encoded = encodeURI(this.term)
				//eslint-disable-next-line
				axios.get(`${process.env.VUE_APP_API_URL}client_processes/tag_autocomplete/${this.client_id}/term:${encoded}`)
					.then(response => this.handleSearchTags(response.data))
					//eslint-disable-next-line
				    .catch(error => console.log(error));
			},
			handleSearchTags(response){
				this.search_results = response;
			},
			createNewTag(){
				// temp
				this.addSelectedTag({
					ClientProcessTag : {
						client_id: process.env.VUE_APP_CLIENT_ID,
						color: this.selected_color,
						id:"8",
						tag: this.term,
					}
				})
			}
		},
		computed : {
			/**
			 * if current process has any selected tags
			 * @return {Boolean} [description]
			 */
			hasTags(){
				return this.tagCount > 0;
			},
			/**
			 * return the number of tags for the current process
			 * @return {[type]} [description]
			 */
			tagCount(){
				return this.process.ClientProcessTagLinkage.length;
			},
			/**
			 * check if we have search results.
			 * @return {Boolean} [description]
			 */
			hasResults(){
				return this.search_results.length > 0;
			},
			...mapState({
				client_id : state => state.client_id
			})
		},
		watch : {
			term(){ 
				if(this.term.length == 0){
					this.search_results = [];
				}else{
					this.searchTags();
				}
			}
		}
	}
</script>