(function () {
  const component = {
    name: 'record-view',
    props: ['path'],
    template: `
<v-flex>
  <transition name="fade-transition">
   <router-view v-if="recordinfo && rawrecord && pathinfo" :path="path"></router-view>
  </transition>
</v-flex>
 
  `,
    created() {
      this.fetchData()
    },
    watch: {
      // call again the method if the route changes
      '$route'() {
        this.fetchData()
      },
      title(title) {
        this.$store.commit('setTitle', {title})
      }
    },

    methods: {
      fetchData() {
        if (!this.$store.state.records[this.path]) this.$store.dispatch('loadPath', {path: this.path})
      }
    },
    computed: {
      pathinfo() { return this.$store.state.pathinfo },
      recordinfo() { return this.$store.state.pathinfo },
      rawrecord() { return this.$store.state.rawrecord },
      title() {
        if (this.rawrecord && this.rawrecord.record_info) {
          return this.rawrecord.record_info.label
        }
        return "Loading..."
      }
    },
  }

  CMS.routes.top.push({component, path: '/root', children: CMS.routes.record, props: {path: '/'}})
  CMS.routes.top.push({
    component,
    path: '/:recordPath',
    children: CMS.routes.record,
    props: (route) => ({path: '/' + route.params.recordPath})
  })
})()

