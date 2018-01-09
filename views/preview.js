(function () {
  const component = {
    name: 'preview-view',
    props: ['path'],
    template: `
      <v-flex pa-3>
      <pre>URL: {{src}}</pre>
      <iframe :src="src" style="width: 100%; height: 80vh" frameborder="0"></iframe>   
      </v-flex>  
    `,
    computed: {
      src() {
        return this.$store.state.site + this.path
      }
    }

  }

  CMS.routes.record.push({component, path: 'preview'})
})()