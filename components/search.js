`
<v-select
          class="hidden-sm-and-down"
          label="Search..."
          prepend-icon="search"
          append-icon=""
          clearable
          autocomplete
          :loading="searchLoading"
          cache-items
          solo
          light
          chips
          :items="searchResults"
          :search-input.sync="searchQuery"
          v-model="searchSelect"
      ></v-select>
      
`

performSearch(val) {
        this.searchLoading = true
        // Simulated ajax query
        setTimeout(() => {
          this.searchResults = ['One', 'Two', 'Three']
          this.searchLoading = false
        }, 500)
      }