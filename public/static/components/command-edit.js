import fn from '../fn.js'
import Player from '../components/player.js'
import VolumeSlider from '../components/volume-slider.js'
import ResponsiveImage from '../components/responsive-image.js'
import DurationInput from '../components/duration-input.js'
import CountdownEdit from '../components/countdown-edit.js'
import Upload from '../components/upload.js'
import commands from '../commands.js'

export default {
  components: {
    CountdownEdit,
    Player,
    VolumeSlider,
    ResponsiveImage,
    DurationInput,
    Upload,
  },
  props: {
    modelValue: {
      type: Object,
      required: true,
    },
    mode: {
      type: String,
      required: true,
    },
  },
  emits: [
    'update:modelValue',
    'cancel',
  ],
  data() {
    return {
      item: null,
      newtrigger: 'command',
    }
  },
  mounted() {
    this.item = JSON.parse(JSON.stringify(this.modelValue))
    this.$nextTick(() => {
      const el = this.$el.querySelector('input[type="text"]')
      el.focus()
    })
  },
  watch: {
    modelValue: {
      handler(v) {
        this.item = JSON.parse(JSON.stringify(v))
      },
    },
  },
  template: `
  <div class="modal is-active" v-if="item">
    <div class="modal-background" @click="onOverlayClick"></div>
    <div class="modal-card">
      <header class="modal-card-head">
        <p class="modal-card-title">{{ title }}</p>
        <button class="delete" aria-label="close" @click="onCloseClick"></button>
      </header>
      <section class="modal-card-body">

        <table class="table is-striped">
          <tbody>
            <tr>
              <td>
                Triggers:
              </td>
              <td>
                <div v-for="(trigger, idx2) in item.triggers" :key="idx2" class="spacerow">
                  <div class="field has-addons" v-if="item.triggers[idx2].type === 'command'">
                    <div class="control has-icons-left">
                      <input
                        class="input is-small"
                        :class="{'has-background-danger-light': !item.triggers[idx2].data.command, 'has-text-danger-dark': !item.triggers[idx2].data.command}"
                        type="text"
                        v-model="item.triggers[idx2].data.command"
                        />
                      <span class="icon is-small is-left">
                        <i class="fa fa-comments-o"></i>
                      </span>
                    </div>
                    <div class="control">
                      <button class="button is-small" :disabled="item.triggers.length <= 1" @click="rmtrigger(idx2)"><i class="fa fa-remove" /></button>
                    </div>
                  </div>

                  <div v-if="item.triggers[idx2].type === 'timer'" class="timer-trigger">
                    <div class="control">
                      <button class="button is-small" :disabled="item.triggers.length <= 1" @click="rmtrigger(idx2)"><i class="fa fa-remove" /></button>
                    </div>
                    <div class="columns">
                      <div class="column is-one-third">
                        <label>Min. Lines</label>
                      </div>
                      <div class="column is-two-third">
                        <div class="control has-icons-left">
                          <input class="input is-small spaceinput" v-model="item.triggers[idx2].data.minLines" />
                          <span class="icon is-small is-left">
                            <i class="fa fa-comments-o"></i>
                          </span>
                        </div>
                      </div>
                    </div>
                    <div class="columns">
                      <div class="column is-one-third">
                        <label>Min. Interval</label>
                      </div>
                      <div class="column is-two-third">
                        <div class="control has-icons-left has-icons-right">
                          <duration-input
                            :modelValue="item.triggers[idx2].data.minInterval"
                            @update:modelValue="item.triggers[idx2].data.minInterval = $event"
                            />
                          <span class="icon is-small is-left">
                            <i class="fa fa-hourglass"></i>
                          </span>
                        </div>
                      </div>
                    </div>
                    <p class="help">
                      Command will be triggered when at least min. lines chat
                      messages arrived AND time interval have passed.
                    </p>
                  </div>
                </div>
                <div class="field has-addons mr-1">
                  <div class="control has-icons-left">
                    <div v-if="item.action !== 'jisho_org_lookup'" class="select is-small">
                      <select v-model="newtrigger">
                        <option value="command">Command</option>
                        <option value="timer">Timer</option>
                      </select>
                    </div>
                  </div>
                  <button
                    class="button is-small"
                    @click="addtrigger()"><i class="fa fa-plus mr-1" /> Add</button>
                </div>
              </td>
            </tr>
            <tr v-if="item.action === 'jisho_org_lookup'">
              <td>Response:</td>
              <td>
                Outputs the translation for the searched word.
              </td>
            </tr>
            <tr v-if="item.action === 'madochan_createword'">
              <td>Response:</td>
              <td>Creates a word for a definition.</td>
            </tr>
            <tr v-if="item.action === 'madochan_createword'">
              <td>Model:</td>
              <td>
                <div class="control">
                  <input class="input is-small spaceinput" v-model="item.data.model" />
                </div>
                <div class="help">For possible values refer to <a href="https://madochan.hyottoko.club/" target="_blank">madochan</a></div>
              </td>
            </tr>
            <tr v-if="item.action === 'madochan_createword'">
              <td>Weirdness:</td>
              <td>
                <div class="control">
                  <input class="input is-small spaceinput" v-model="item.data.weirdness" />
                </div>
                <div class="help">For possible values refer to <a href="https://madochan.hyottoko.club/" target="_blank">madochan</a></div>
              </td>
            </tr>
            <tr v-if="item.action === 'chatters'">
              <td>Response:</td>
              <td>
                Outputs the people who chatted during the stream.
              </td>
            </tr>
            <tr v-if="item.action === 'text'">
              <td>Response:</td>
              <td>
                <div v-for="(txt, idx2) in item.data.text" :key="idx2" class="field textarea-holder">
                  <textarea
                    class="textarea"
                    type="text"
                    v-model="item.data.text[idx2]"
                    :class="{'has-background-danger-light': !item.data.text[idx2], 'has-text-danger-dark': !item.data.text[idx2]}"
                    />
                  <button class="button is-small" :disabled="item.data.text.length <= 1" @click="rmtxt(idx2)"><i class="fa fa-remove" /></button>
                </div>
                <div class="field"><button class="button is-small" @click="addtxt"><i class="fa fa-plus mr-1" /> Add response</button></div>
                <div><p class="help">If multiple responses exist, a random one will be used when the command is triggered.</p></div>
              </td>
            </tr>
            <tr v-if="item.action === 'media'">
              <td>Image:</td>
              <td>
                <responsive-image v-if="item.data.image.file" :src="item.data.image.file" :title="item.data.image.filename" width="100%" height="90" style="display:block;" />
                <button v-if="item.data.image.file" class="button is-small" @click="item.data.image.file = null"><i class="fa fa-remove mr-1" /> Remove</button>
                <br v-if="item.data.image.file" />
                <upload
                  @uploaded="mediaImgUploaded"
                  accept="image/*"
                  label="Upload Image"
                  :class="{'mt-1': item.data.image.file}" />
              </td>
            </tr>
            <tr v-if="item.action === 'media'">
              <td>Sound:</td>
              <td>
                <player v-if="item.data.sound.file" :src="item.data.sound.file" :name="item.data.sound.filename" :volume="item.data.sound.volume" class="button is-small" />
                <volume-slider v-if="item.data.sound.file" v-model="item.data.sound.volume" />
                <button v-if="item.data.sound.file" class="button is-small" @click="item.data.sound.file = null"><i class="fa fa-remove mr-1" /> Remove</button>
                <br v-if="item.data.sound.file" />
                <upload
                  @uploaded="mediaSndUploaded"
                  accept="audio/*"
                  label="Upload Sound"
                  :class="{'mt-1': item.data.sound.file}" />
              </td>
            </tr>
            <tr v-if="item.action === 'media'">
              <td>Duration:</td>
              <td>
                <div class="control has-icons-left">
                  <duration-input
                    :modelValue="item.data.minDurationMs"
                    @update:modelValue="item.data.minDurationMs = $event"
                    />
                  <span class="icon is-small is-left">
                    <i class="fa fa-hourglass"></i>
                  </span>
                </div>
              </td>
            </tr>
            <tr v-if="item.action === 'countdown'">
              <td>Settings</td>
              <td>
                <countdown-edit v-model="item.data" />
              </td>
            </tr>
            <tr>
              <td>
                Variables:
              </td>
              <td>
                <table v-if="item.variables.length > 0">
                  <thead>
                    <tr>
                      <td>Name</td>
                      <td>Value</td>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(v,idx) in item.variables">
                      <td>
                        <input type="text" class="input is-small" v-model="v.name" />
                      </td>
                      <td>
                        <input type="text" class="input is-small" v-model="v.value" />
                      </td>
                      <td>
                        <button class="button is-small" @click="rmVariable(idx)"><i class="fa fa-remove" /></button>
                      </td>
                    </tr>
                  </tbody>
                </table>
                <span class="button is-small" @click="onAddVariable">Add Variable</span>
                <div class="help">
                  Variables can be used from the command with <code>$var(variable_name)</code>.
                  If the referenced variable is not defined here,
                  <a href="/variables/" target="_blank">global variables</a> are used.
                </div>
              </td>
            </tr>
            <tr>
              <td>
                Variable changes:
              </td>
              <td>
                <table v-if="item.variableChanges.length > 0">
                  <thead>
                    <tr>
                      <td>Name</td>
                      <td>Change</td>
                      <td>Value</td>
                      <td></td>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(v,idx) in item.variableChanges">
                      <td>
                        <input type="text" class="input is-small" v-model="v.name" />
                      </td>
                      <td>
                        <div class="select is-small">
                          <select v-model="v.change">
                            <option value="set">set</option>
                            <option value="increase_by">increase by</option>
                            <option value="decrease_by">decrease by</option>
                          </select>
                        </div>
                      </td>
                      <td>
                        <input type="text" class="input is-small" v-model="v.value" />
                      </td>
                      <td>
                        <button class="button is-small" @click="rmVariableChange(idx)"><i class="fa fa-remove" /></button>
                      </td>
                    </tr>
                  </tbody>
                </table>
                <span class="button is-small" @click="onAddVariableChange">Add Variable Change</span>
                <div class="help">
                  Variable changes are performed when the command is executed, before anything else.
                </div>
              </td>
            </tr>
            <tr>
              <td>
                Permissions:
              </td>
              <td>
                <label>
                  <input type="checkbox" v-model="item.restrict_to" value="broadcaster" />
                  Broadcaster
                </label>
                <label>
                  <input type="checkbox" v-model="item.restrict_to" value="mod" />
                  Moderators
                </label>
                <label>
                  <input type="checkbox" v-model="item.restrict_to" value="sub" />
                  Subscribers
                </label>
              </td>
            </tr>
          </tbody>
        </table>
      </section>
      <footer class="modal-card-foot">
        <button class="button is-small is-primary" :disabled="!valid" @click="onSaveClick">Save changes</button>
        <button class="button is-small" @click="onCancelClick">Cancel</button>
      </footer>
    </div>
  </div>
  `,
  methods: {
    addtxt() {
      this.item.data.text.push(commands.newText())
    },
    addtrigger() {
      this.item.triggers.push(commands.newTrigger(this.newtrigger))
    },
    onAddVariableChange() {
      this.item.variableChanges.push({
        name: '',
        change: 'set',
        value: '',
      })
    },
    rmVariableChange(idx) {
      this.item.variableChanges = this.item.variableChanges.filter((val, index) => index !== idx)
    },
    onAddVariable() {
      this.item.variables.push({
        name: '',
        value: '',
      })
    },
    rmVariable(idx) {
      this.item.variables = this.item.variables.filter((val, index) => index !== idx)
    },
    onSaveClick() {
      this.$emit('update:modelValue', this.item)
    },
    onCancelClick() {
      this.$emit('cancel')
    },
    onCloseClick() {
      this.$emit('cancel')
    },
    onOverlayClick() {
      this.$emit('cancel')
    },
    mediaSndUploaded(data) {
      this.item.data.sound.filename = data.originalname
      this.item.data.sound.file = data.filename
    },
    mediaImgUploaded(data) {
      this.item.data.image.filename = data.originalname
      this.item.data.image.file = data.filename
    },
    rmtxt(idx) {
      this.item.data.text = this.item.data.text.filter((val, index) => index !== idx)
    },
    rmtrigger(idx) {
      this.item.triggers = this.item.triggers.filter((val, index) => index !== idx)
    },
  },
  computed: {
    valid() {
      // check if all triggers are correct
      for (const trigger of this.item.triggers) {
        if (trigger.type === 'command') {
          if (!trigger.data.command) {
            return false
          }
        } else if (trigger.type === 'timer') {
          try {
            fn.mustParseHumanDuration(trigger.data.minInterval)
          } catch (e) {
            return false
          }
          const l = parseInt(trigger.data.minLines, 10)
          if (isNaN(l)) {
            return false
          }
        }
      }

      // check if settings are correct
      if (this.item.action === 'text') {
        for (const t of this.item.data.text) {
          if (t === '') {
            return false
          }
        }
      }

      return true
    },
    title() {
      const verb = {
        create: 'Create new ',
        edit: 'Edit ',
      }
      const map = {
        jisho_org_lookup: 'jisho.org lookup',
        madochan_createword: 'madochan',
        chatters: 'chatters command',
        media: 'media command',
        countdown: 'countdown',
        text: 'command',
      }
      return `${verb[this.mode]}${map[this.item.action]}`
    },
  },
}