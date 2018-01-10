(function () {


  function lineIsDashes(line) {
    line = line.match(/^\s*(.*?)\s*$/)[1];
    return line.length >= 3 && line == (new Array(line.length + 1)).join('-');
  }

  function processBuf(buf) {
    var lines = buf.map(function (line) {
      if (lineIsDashes(line)) {
        line = line.substr(1);
      }
      return line;
    });

    if (lines.length > 0) {
      var lastLine = lines[lines.length - 1];
      if (lastLine.substr(lastLine.length - 1) == '\n') {
        lines[lines.length - 1] = lastLine.substr(0, lastLine.length - 1);
      }
    }

    return lines;
  }

  function tokenize(lines) {
    var key = null;
    var buf = [];
    var wantNewline = false;
    var rv = [];

    function flushItem() {
      rv.push([key, processBuf(buf)]);
      key = null;
      buf = [];
    }

    for (var i = 0; i < lines.length; i++) {
      var line = lines[i].match(/^(.*?)(\r?\n)*$/m)[1] + '\n';

      if (line.match(/^(.*?)\s*$/m)[1] == '---') {
        wantNewline = false;
        if (key !== null) {
          flushItem();
        }
      } else if (key !== null) {
        if (wantNewline) {
          wantNewline = false;
          if (line.match(/^\s*$/)) {
            continue;
          }
        }
        buf.push(line);
      } else {
        var bits = line.split(':');
        if (bits.length >= 2) {
          key = bits.shift().match(/^\s*(.*?)\s*$/m)[1];
          var firstBit = bits.join(':').match(/^[\t ]*(.*?)[\t ]*$/m)[1];
          if (!firstBit.match(/^\s*$/)) {
            buf = [firstBit];
          } else {
            buf = [];
            wantNewline = true;
          }
        }
      }
    }

    if (key !== null) {
      flushItem();
    }

    return rv;
  }

  function serialize(blocks) {
    var rv = [];

    blocks.forEach(function (item, idx) {
      var [key, value] = item;
      if (idx > 0) {
        rv.push('---\n');
      }
      if (value.match(/([\r\n]|(^[\t ])|([\t ]$))/m)) {
        rv.push(key + ':\n');
        rv.push('\n');
        var lines = value.split(/\n/);
        if (lines[lines.length - 1] === '') {
          lines.pop();
        }
        lines.forEach(function (line, idx, arr) {
          if (lineIsDashes(line)) {
            line = '-' + line;
          }
          rv.push(line + '\n');
        });
      } else {
        rv.push(key + ': ' + value + '\n');
      }
    });

    return rv;
  }


  function parseFlowFormat(value) {
    var blocks = [];
    var buf = [];
    var lines = value.split(/\r?\n/);
    var block = null;

    for (var i = 0; i < lines.length; i++) {
      var line = lines[i];

      // leading whitespace is ignored.
      if (block === null && line.match(/^\s*$/)) {
        continue;
      }

      var blockStart = line.match(/^####\s*([^#]*?)\s*####\s*$/);
      if (!blockStart) {
        if (block === null) {
          // bad format :(
          return null;
        }
      } else {
        if (block !== null) {
          blocks.push([block, buf]);
          buf = [];
        }
        block = blockStart[1];
        continue;
      }

      buf.push(line.replace(/^#####(.*?)#####$/, '####$1####'));
    }

    if (block !== null) {
      blocks.push([block, buf]);
    }

    return blocks;
  }

  function serializeFlowFormat(blocks) {
    var rv = [];
    blocks.forEach(function (block) {
      var [blockName, lines] = block;
      rv.push('#### ' + blockName + ' ####\n');
      lines.forEach((line) => {
        rv.push(line.replace(/^(####(.*)####)(\r?\n)?$/, '#$1#$3'));
      });
    });

    rv = rv.join('');

    /* we need to chop of the last newline if it exists because this would
       otherwise add a newline to the last block.  This is just a side effect
       of how we serialize the meta format internally */
    if (rv[rv.length - 1] === '\n') {
      rv = rv.substr(0, rv.length - 1);
    }

    return rv;
  }

  function deserializeFlowBlock(flowBlockModel, lines, localId) {
    var data = {};
    var rawData = {};

    tokenize(lines).forEach(function (item) {
      var [key, lines] = item;
      var value = lines.join('');
      rawData[key] = value;
    });

    flowBlockModel.fields.forEach((field) => {
      var value = rawData[field.name] || '';
      var Widget = CMS.widgets[field.type.widget];
      if (!value && field['default']) {
        value = field['default'];
      }
      if (Widget && Widget.deserializeValue) {
        value = Widget.deserializeValue(value, field.type);
      }
      data[field.name] = value;
    });

    return {
      localId: localId || null,
      flowBlockModel: flowBlockModel,
      data: data
    }
  }

  function serializeFlowBlock(flockBlockModel, data) {
    var rv = [];
    flockBlockModel.fields.forEach(function (field) {
      var Widget = CMS.widgets[field.type.widget];
      if (Widget === null) {
        return;
      }

      var value = data[field.name];
      if (value === undefined || value === null) {
        return;
      }

      if (Widget.serializeValue) {
        value = Widget.serializeValue(value, field.type);
      }

      rv.push([field.name, value]);
    });
    return serialize(rv);
  }


  CMS.widgets['flow'] = {
    name: 'cms-widget-flow',
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
    template: `  
      <div>
        {{value}}
        <p>Add Blocks: 
          <v-btn v-for="block in field.type.flowblocks" color="primary">{{block.button_label}}</v-btn>
        </p>
        <component v-for="field in field.type.flowblocks.comment.fields" :is="blockFieldWidget(field)" :key="field.name" :field="field" :path="path"></component>
        <pre>{{field}}</pre>
      </div>
    `,
    methods: {
      blockFieldWidget(field) {
        const widget = field.type.widget
        if (CMS.widgets.hasOwnProperty(widget)) return CMS.widgets[widget]
        return CMS.widgets['fallback']
      }
    },
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
})()