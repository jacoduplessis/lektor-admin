(function () {
  const component = {
    template: `
<v-container fluid grid-list-md pa-2 pt-3>
    <v-layout row wrap>
      <v-flex xs9>
        <h2>Fields</h2>
        <template v-for="field in dataFields">
          <p>{{field.name}} - {{field.type.widget}}</p>
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
    props: ['recordinfo', 'rawrecord'],
    computed: {
      dataFields() {
        if (this.rawrecord && this.rawrecord.datamodel) {
          return this.rawrecord.datamodel.fields.filter(f => f.name.charAt(0) !== '_')
        }
        return []
      },
    },
  }

  CMS.routes.record.push({component, path: 'edit'})
})()

