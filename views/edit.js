(function () {
  const component = {
    template: `
<v-container fluid grid-list-md pa-2 pt-3>
    <v-layout row wrap>
      <v-flex xs9>
          <template v-for="field in dataFields">
            <v-chip label disabled color="secondary" text-color="white">{{field.label}}</v-chip>
            <component v-if="recordinfo.path" :is="fieldWidget(field)" :field="field" :path="recordinfo.path" :key="field.name"></component>
          </template>
          
      </v-flex>
      <v-flex xs3>
      <cms-page-attachments></cms-page-attachments>
      <cms-custom-widget></cms-custom-widget>    
    </v-flex>
    </v-layout>
   </v-container>
  `,

    name: 'edit-record-view',
    computed: {
      recordinfo() {
        return this.$store.state.recordinfo
      },
      rawrecord() {
        return this.$store.state.rawrecord
      },
      dataFields() {
        if (this.rawrecord && this.rawrecord.datamodel) {
          return this.rawrecord.datamodel.fields.filter(f => f.name.charAt(0) !== '_')
        }
        return []
      },
    },
    created() {
      this.$store.commit('setRecordToolbarAction', {
        key: 'save',
        action: {
          text: 'Save',
          props: {
            color: 'primary',
            small: true,
            dark: true,
            flat: false,
          },
          order: 5,
          onclick() { alert("Whoohoo")}
        }})
    },

    methods: {
      fieldWidget(field) {
        const widget = field.type.widget
        if (CMS.widgets.hasOwnProperty(widget)) return CMS.widgets[widget]
        return CMS.widgets['fallback']
      }
    }
  }

  CMS.routes.record.push({component, path: 'edit'})
})()

