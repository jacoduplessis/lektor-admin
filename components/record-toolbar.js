(function () {

  const component = {
    template: `
    <v-toolbar light dense>
    <v-toolbar-title>{{ recordinfo.label_i18n.en || '---' }}</v-toolbar-title>
    <v-spacer></v-spacer>
    <v-toolbar-items v-for="action in actions" :key="action.text">
      <v-btn @click="action.onclick" v-bind="buttonProps(action)">{{ action.text }}</v-btn>      
    </v-toolbar-items>
  </v-toolbar>
  `,
    computed: {
      recordinfo() { return this.$store.state.recordinfo},
      actions() {
        const subroute = (to) => { this.$router.push(this.recordinfo.path + '/' + to) }

        return Object.values(this.$store.state.recordToolbarActions).concat([
          {text: 'Edit', order: 10, onclick() { subroute('edit')}},
          {text: 'Settings', order: 20, onclick() { subroute('settings')}},
          {text: 'Delete', order: 30, onclick() { subroute('delete')}},
          {text: 'Preview', order: 40, onclick() { subroute('preview')}},
          {text: 'Attachments', order: 50, onclick() { subroute('attachments')}},
          {text: 'Open File', order: 60, onclick() { subroute('open')}},
          {text: 'Add Page', order: 70, onclick() { subroute('add')}},
        ]).sort((a,b) => a.order - b.order)
      }
    },

    methods: {
      callback(action) {
        action.onclick({path: this.path, recordinfo: this.recordinfo, rawrecord: this.rawrecord})
      },
      buttonProps(action) {
        return Object.assign({
          flat: true,
          light: true,
        }, action.props)
      }
    },
    data() {
      return {
        title: 'placeholder',
        defaultButtonProps: {
          flat: true
        }
      }
    }
  }

  Vue.component('cms-record-toolbar', component)
})()