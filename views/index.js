(function () {
  const component = {
    template: `
<div>
  <h1>Index</h1>
  
  <div v-for="child in children">
    <span>{{child.label}}</span>
    <router-link :to="child.path + '/edit'">Edit</router-link>
    <router-link :to="child.path + '/preview'">Preview</router-link>
  </div>
   
  <pre>pathinfo = {{ pathinfo }}</pre>
  <hr>
  <pre>recordinfo = {{ recordinfo }}</pre>
  <hr>
  <pre>rawrecord = {{ rawrecord }}</pre>
</div>  
`,
    created() {
      const path = '/'
      const params = {path}
      this.$api.get('pathinfo', {params})
        .then(r => this.pathinfo = r.data)
      this.$api.get('rawrecord', {params})
        .then(r => this.rawrecord = r.data)
      this.$api.get('recordinfo', {params})
        .then(r => this.recordinfo = r.data)
    },
    data() {
      return {
        pathinfo: '',
        rawrecord: '',
        recordinfo: '',
      }
    },
    computed: {
      children() {
        if (this.recordinfo) return this.recordinfo.children
        return []
      }
    }
  }
  CMS.routes.top.push({component, path: '/',})
})()
