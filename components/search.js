(function () {


  Vue.component('cms-search-input', {
    name: 'cms-search-input',
    data() {
      return {
        searchResults: [],
        searchLoading: false,
        searchQuery: '',
        searchSelect: null,
      }
    },
    template: `
        <v-select
          label="Search..."
          append-icon=""
          clearable
          autocomplete
          :loading="searchLoading"
          cache-items
          light
          item-value="path"
          item-text="title"
          :items="searchResults"
          :search-input.sync="searchQuery"
          v-model="searchSelect"
          autofocus
      >
     
</v-select>        
    `,
    methods: {
      performSearch(val) {
        this.searchLoading = true
        const payload = new FormData()
        payload.append('q', val)
        this.$api.post('find', payload).then(r => {
          console.log("Search Results", r.data)
          this.searchResults = r.data.results
          this.searchLoading = false
        })

      }
    },
    watch: {
      searchQuery(val) {
        val && this.performSearch(val)
      },
      searchSelect(val) {
        if (!val) return
        this.$emit('resultChosen', val)
        this.searchSelect = ''
      }
    }
  })


  Vue.component('cms-search-dialog', {
    name: 'cms-search-dialog',
    data() {
      return {
        show: false
      }
    },
    template: `
      <v-dialog v-model="show" max-width="500px">
        <v-btn icon title="Publish" slot="activator">
          <v-icon>search</v-icon>
        </v-btn>
        <v-card>
          <v-card-title>Search</v-card-title>
          <v-card-text>
            <cms-search-input @resultChosen="show = false"></cms-search-input>
          </v-card-text>
        <v-card-actions>
          <v-btn color="primary" flat @click.stop="show = false">Close</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    `
  })
})()


// `
//  <template slot="item" slot-scope="data">
//         <v-list-tile-content>
//         <v-list-tile-title>{{data.item.title}}</v-list-tile-title>
//         <v-list-tile-sub-title>{{data.item.type}} ==> {{data.item.path}}</v-list-tile-sub-title>
//         </v-list-tile-content>
//         </template>
// `