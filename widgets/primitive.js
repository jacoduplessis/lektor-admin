(function () {

  const inputMixin = {
    props: {
      field: {
        type: Object,
        required: true
      },
      path: {
        type: String,
        required: true
      }
    },
    computed: {
      value: {
        get() {
          return this.$store.getters.fieldValue(this.path, this.field.name)
        },
        set(value) {
          this.$store.commit('setField', {
            recordPath: this.path,
            fieldName: this.field.name,
            fieldValue: value
          })
        }
      },
    }
  }

  CMS.widgets['fallback'] = {
    name: 'cms-widget-fallback',
    mixins: [inputMixin],
    template: '<p>[{{field.type.widget}}] Widget not yet implemented.</p>'
  }

  CMS.widgets['singleline-text'] = {
    name: 'cms-widget-singleline-text',
    mixins: [inputMixin],
    template: `
      <v-text-field
              :name="field.name"
              :label="field.label"
              :hint="field.description_i18n ? field.description_i18n.en : ''"
              persistent-hint
              v-model="value"
            ></v-text-field>
    `,

  }

  CMS.widgets['multiline-text'] = {
    name: 'cms-widget-multiline-text',
    mixins: [inputMixin],
    template: `
      <v-text-field
              :name="field.name"
              :label="field.label"
              :hint="field.description_i18n ? field.description_i18n.en : ''"
              multi-line
              persistent-hint
              auto-grow
              v-model="value"
            ></v-text-field>
    `,

  }

  CMS.widgets['integer'] = {
    name: 'cms-widget-integer',
    mixins: [inputMixin],
    template: `<v-text-field
              :name="field.name"
              :label="field.label"
              :hint="field.description_i18n ? field.description_i18n.en : ''"
              :rules="[(val) => isNaN(val) ? 'Enter a valid number' : true]"
              persistent-hint
              v-model="value"
            ></v-text-field>`,
  }

  CMS.widgets['select'] = {
    name: 'cms-widget-select',
    mixins: [inputMixin],
    template: `
            <v-select
              :name="field.name"
              :label="field.label"
              :hint="field.description_i18n ? field.description_i18n.en : ''"
              persistent-hint
              :items="field.type.choices.map(args => args[0])"
              v-model="value"
            ></v-select>
    `,
  }


  CMS.widgets['checkboxes'] = {
    name: 'cms-widget-checkboxes',
    mixins: [inputMixin],
    template: `
    <div>
      <p>{{field.label}}</p>
      <small v-if="field.description_i18n">{{field.description_i18n.en}}</small>
      <v-checkbox v-for="choice in field.type.choices" 
      :label="choice[0]" 
      hide-details
      v-model="value" 
      :value="choice[0]" 
      :key="choice[0]"></v-checkbox>
    </div>
   `,
    computed: {
      value: {
        get() {
          return this.$store.getters.fieldValue(this.path, this.field.name) || []
        },
        set(value) {
          this.$store.commit('setField', {
            recordPath: this.path,
            fieldName: this.field.name,
            fieldValue: value
          })
        }
      },
    }
  }



  // 'singleline-text': primitiveWidgets.SingleLineTextInputWidget,
  //   'multiline-text': primitiveWidgets.MultiLineTextInputWidget,
  //   'datepicker': primitiveWidgets.DateInputWidget,
  //   'integer': primitiveWidgets.IntegerInputWidget,
  //   'float': primitiveWidgets.FloatInputWidget,
  //   'checkbox': primitiveWidgets.BooleanInputWidget,
  //   'url': primitiveWidgets.UrlInputWidget,
  //   'slug': primitiveWidgets.SlugInputWidget,
})()