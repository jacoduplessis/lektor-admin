(function() {

  const component = {
    name: 'attachments-view',
    mixins: [CMS.mixins.record],
    template: `
        <v-container fluid grid-list-md class="grey lighten-4">
        <v-layout row wrap>
        <v-flex xs3 v-for="attachment in attachments" :key="attachment.id">
        <v-card>
        <v-card-media
          v-if="attachment.type === 'image'"
          :src="$store.state.site + attachment.path"
          height="200px"
        ></v-card-media>
      <v-container fluid fill-height style="height: 200px" class="grey lighten-4" v-else>
        <v-layout justify-center align-center>
            <span style="font-size: 4rem">.{{attachment.extension}}</span>
        </v-layout>
      </v-container>
       <v-card-title primary-title>
          <div>
            <div class="headline">{{attachment.id}}</div>
            <span class="grey--text">{{attachment.path}}</span>
          </div>
        </v-card-title>
        <v-card-actions>
          <v-btn flat>Share</v-btn>
          <v-btn flat color="purple">Explore</v-btn>
        </v-card-actions>
      </v-card>
      </v-flex>
      </v-layout>
      </v-container>
    `,
    computed: {
      attachments() {
        if (this.recordinfo && this.recordinfo.attachments) return this.recordinfo.attachments.map(a => {
          const parts = a.path.split('.')
          if (parts.length === 0) return '---'
          a.extension = parts[parts.length-1].toUpperCase()
          return a
        })
        return []
      }
    },
    data() {
      return {
        expanded: {}
      }
    }
  }
  CMS.routes.record.push({component, path: 'attachments'})
})()