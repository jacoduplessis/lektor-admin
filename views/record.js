(function () {
  const component = {
    name: 'record-view',
    props: ['path'],
    template: `
<v-flex>
    <v-toolbar light dense>
    <v-toolbar-title>{{ title }}</v-toolbar-title>
    <v-spacer></v-spacer>
    <v-toolbar-items class="hidden-sm-and-down" v-for="action in actions" :key="action.text">
      <router-link :to="path + action.to">
      <v-btn flat>{{ action.text }}</v-btn>
</router-link>      
    </v-toolbar-items>
  </v-toolbar>
   <router-view :pathinfo="pathinfo" :recordinfo="recordinfo" :rawrecord="rawrecord" :path="path"></router-view>
</v-flex>
 
  `,
    created() {
      this.fetchData()
    },
    watch: {
      // call again the method if the route changes
      '$route': 'fetchData',
      title(title) {
        this.$store.commit('setTitle', {title})
      }
    },
    computed: {
      title() {
        if (this.rawrecord && this.rawrecord.record_info) {
          return this.rawrecord.record_info.label
        }
        return "Loading..."
      }
    },
    methods: {
      fetchData() {
        const params = {path: this.path}
        this.$api.get('pathinfo', {params})
          .then(r => this.pathinfo = r.data)
        this.$api.get('rawrecord', {params})
          .then(r => this.rawrecord = r.data)
        this.$api.get('recordinfo', {params})
          .then(r => this.recordinfo = r.data)
      }
    },
    data() {
      return {
        pathinfo: null,
        rawrecord: null,
        recordinfo: null,
        actions: [
          {text: 'Edit', to: '/edit'},
          {text: 'Settings', to: '/settings'},
          {text: 'Delete', to: '/delete'},
          {text: 'Preview', to: '/preview'},
          {text: 'Attachments', to: '/attachments'},
          {text: 'Open File', to: '/open'},
          {text: 'Add Page', to: '/add'},
        ]
      }
    }
  }

  CMS.routes.top.push({component, path: '/root', children: CMS.routes.record, props: {path: '/'}})
  CMS.routes.top.push({
    component,
    path: '/:recordPath',
    children: CMS.routes.record,
    props: (route) => ({path: '/' + route.params.recordPath})
  })
})()

