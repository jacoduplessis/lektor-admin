CMS.store = new Vuex.Store({
    state: {
      title: 'Administration',
      site: 'http://localhost:5000',
      records: {},
      recordinfo: {},
      pathinfo: {},
      rawrecord: {},
      recordToolbarActions: [],
    },
    mutations: {
      setTitle(state, {title}) {
        state.title = title
      },
      setField(state, {recordPath, fieldName, fieldValue}) {
        if (!state.records[recordPath]) Vue.set(state.records, recordPath, {})
        Vue.set(state.records[recordPath], fieldName, fieldValue)
      },
      setRecord(state, {recordPath, data}) {
        Vue.set(state.records, recordPath, data)
      },
      setRecordToolbarAction(state, {key, action}) {
        Vue.set(state.recordToolbarActions, key, action)
      }
    },
    getters: {
      fieldValue: (state) => (recordPath, fieldName) => {
        const record = state.records[recordPath]
        if (record) return record[fieldName]
        return null
      }
    },
    actions: {
      loadPath({commit, state}, {path}) {
        const params = {path}
        CMS.api.get('pathinfo', {params})
          .then(r => this.state.pathinfo = r.data)
        CMS.api.get('rawrecord', {params})
          .then(r => {
            const rawrecord = r.data
            this.state.rawrecord = rawrecord
            commit('setRecord', {
             recordPath: rawrecord.record_info.path,
             data: rawrecord.data
            })
          })
        CMS.api.get('recordinfo', {params})
          .then(r => state.recordinfo = r.data)

      }
    }

  })