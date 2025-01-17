<template>
  <div class="base" v-if="initialized">
    <div class="avatar" :style="{
      width: `${tuberDef.width}px`,
      height: `${tuberDef.height}px`,
    }">
      <avatar-animation v-for="(anim, idx) in animations" :key="idx" :frames="anim.frames" :width="tuberDef.width"
        :height="tuberDef.height" />
    </div>

    <table v-if="controls && showControls">
      <tr v-if="!avatarFixed">
        <td>Tubers:</td>
        <td>
          <button v-for="(avatarDef, idx) in settings.avatarDefinitions" :key="idx" @click="setTuber(idx, true)"
            :class="{ active: tuberIdx === idx }">
            {{ avatarDef.name }}
          </button>
        </td>
      </tr>
      <tr v-if="!avatarFixed">
        <td colspan="2">
          <hr />
        </td>
      </tr>
      <tr>
        <td>Start Mic</td>
        <td><button @click="startMic">Start</button></td>
      </tr>
      <tr>
        <td colspan="2">
          <hr />
        </td>
      </tr>
      <tr v-for="(def, idx) in tuberDef.slotDefinitions" :key="idx">
        <td>{{ def.slot }}:</td>
        <td>
          <button v-for="(item, idx2) in def.items" :key="idx2" @click="setSlot(def.slot, idx2, true)"
            :class="{ active: slots[def.slot] === idx2 }">
            {{ item.title }}
          </button>
        </td>
      </tr>
      <tr>
        <td>State:</td>
        <td>
          <button v-for="(def, idx) in tuberDef.stateDefinitions" :key="idx" @click="lockState(def.value, true)"
            :class="{ active: lockedState === def.value }">
            {{ def.value }}
          </button>
        </td>
      </tr>
    </table>
    <div class="toggle-controls" v-if="controls">
      <button @click="showControls = !showControls">Toggle controls</button>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent } from "vue";

import AvatarAnimation from "../../frontend/components/Avatar/AvatarAnimation.vue";
import SoundMeter from "./soundmeter";
import util from "../util";
import WsClient from "../../frontend/WsClient";
import {
  AvatarModuleAvatarSlotDefinition,
  AvatarModuleAvatarSlotItem,
  AvatarModuleSettings,
  AvatarModuleSlotItemStateDefinition,
  AvatarModuleWsInitData,
  default_settings,
} from "../../mod/modules/AvatarModuleCommon";
import { logger } from "../../common/fn";

const log = logger("Page.vue");

const DEFAULT_STATE = "default";
const SPEAKING_STATE = "speaking";

const DEFAULT_ITEM_STATE_DEFINITION = { state: DEFAULT_STATE, frames: [] };

const SPEAKING_THRESHOLD = 0.05;
// in ff enable for usage with localhost (and no https):
// about:config
//   media.devices.insecure.enabled
//   media.getusermedia.insecure.enabled

interface ComponentData {
  ws: null | WsClient;
  speaking: boolean;
  initialized: boolean;
  audioInitialized: boolean;
  tuberIdx: number;
  avatarFixed: string;
  settings: AvatarModuleSettings;
  showControls: boolean;
}

export default defineComponent({
  components: {
    AvatarAnimation,
  },
  props: {
    controls: { type: Boolean, required: true },
    widget: { type: String, required: true },
  },
  data(): ComponentData {
    return {
      ws: null,
      speaking: false,
      initialized: false,
      audioInitialized: false,
      tuberIdx: -1,
      avatarFixed: "",
      settings: default_settings(),
      showControls: true,
    };
  },
  computed: {
    tuberDef() {
      if (
        this.tuberIdx < 0 ||
        this.tuberIdx >= this.settings.avatarDefinitions.length
      ) {
        return null;
      }
      return this.settings.avatarDefinitions[this.tuberIdx];
    },
    slots() {
      const tuberDef = this.tuberDef;
      return tuberDef ? tuberDef.state.slots : {};
    },
    lockedState() {
      return this.tuberDef?.state.lockedState || DEFAULT_STATE;
    },
    animationName() {
      if (this.lockedState !== DEFAULT_STATE) {
        return this.lockedState;
      }
      return this.speaking ? SPEAKING_STATE : DEFAULT_STATE;
    },
    animations() {
      if (!this.tuberDef) {
        return [];
      }
      return this.tuberDef.slotDefinitions.map(this.getSlotStateDefinition);
    },
  },
  methods: {
    getSlotStateDefinition(
      slotDef: AvatarModuleAvatarSlotDefinition
    ): AvatarModuleSlotItemStateDefinition {
      const item = this.getItem(slotDef);
      if (!item) {
        return DEFAULT_ITEM_STATE_DEFINITION;
      }
      const stateDef = item.states.find(
        ({ state }) => state === this.animationName
      );
      if (stateDef && stateDef.frames.length > 0) {
        return stateDef;
      }
      return (
        item.states.find(({ state }) => state === DEFAULT_STATE) ||
        DEFAULT_ITEM_STATE_DEFINITION
      );
    },
    getItem(
      slotDef: AvatarModuleAvatarSlotDefinition
    ): AvatarModuleAvatarSlotItem | null {
      if (slotDef.items.length === 0) {
        return null;
      }
      let itemIdx = this.slots[slotDef.slot];
      if (typeof itemIdx === "undefined") {
        itemIdx = slotDef.defaultItemIndex;
      }
      if (itemIdx < 0 || itemIdx >= slotDef.items.length) {
        itemIdx = 0;
      }
      return slotDef.items[itemIdx];
    },
    ctrl(ctrl: string, args: any[]) {
      if (!this.ws) {
        log.error("ctrl: this.ws not initialized");
        return;
      }
      this.ws.send(JSON.stringify({ event: "ctrl", data: { ctrl, args } }));
    },
    setSlot(slotName: string, itemIdx: number, sendCtrl: boolean = false) {
      if (this.slots[slotName] === itemIdx) {
        return;
      }
      this.settings.avatarDefinitions[this.tuberIdx].state.slots[slotName] =
        itemIdx;
      if (sendCtrl) {
        this.ctrl("setSlot", [this.tuberIdx, slotName, itemIdx]);
      }
    },
    setSpeaking(speaking: boolean, sendCtrl: boolean = false) {
      if (this.speaking === speaking) {
        return;
      }
      this.speaking = speaking;
      if (sendCtrl) {
        this.ctrl("setSpeaking", [this.tuberIdx, speaking]);
      }
    },
    lockState(lockedState: string, sendCtrl: boolean = false) {
      if (this.lockedState === lockedState) {
        return;
      }
      this.settings.avatarDefinitions[this.tuberIdx].state.lockedState =
        lockedState;
      if (sendCtrl) {
        this.ctrl("lockState", [this.tuberIdx, lockedState]);
      }
    },
    setTuber(tuberIdx: number, sendCtrl: boolean = false) {
      if (!this.settings) {
        log.error("setTuber: this.settings not initialized");
        return;
      }
      if (this.avatarFixed) {
        tuberIdx = this.settings.avatarDefinitions.findIndex(
          (def) => def.name === this.avatarFixed
        );
      }
      if (tuberIdx >= this.settings.avatarDefinitions.length) {
        log.info("setTuber: index out of bounds. using index 0");
        tuberIdx = 0;
      }
      if (tuberIdx < 0 || tuberIdx >= this.settings.avatarDefinitions.length) {
        log.error("setTuber: index out of bounds");
        return;
      }
      const newTuber = this.settings.avatarDefinitions[tuberIdx];
      const newTuberDefStr = JSON.stringify(newTuber);
      const thisTuberDefStr = JSON.stringify(this.tuberDef);
      if (newTuberDefStr === thisTuberDefStr) {
        return;
      }
      this.tuberIdx = tuberIdx;
      if (sendCtrl) {
        this.ctrl("setTuber", [this.tuberIdx]);
      }
    },
    startMic() {
      if (this.audioInitialized) {
        return;
      }
      this.audioInitialized = true;
      if (!navigator.mediaDevices.getUserMedia) {
        alert(
          "navigator.mediaDevices.getUserMedia not supported in this browser."
        );
        return;
      }

      // ignore because of the webkitAudioContext fallback
      // @ts-ignore
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      const audioContext = new AudioContextClass();
      navigator.mediaDevices
        .getUserMedia({ audio: true })
        .then((stream) => {
          const soundMeter = new SoundMeter(audioContext);
          soundMeter.connectToSource(stream, (e: any | null) => {
            if (e) {
              log.error(e);
              return;
            }
            setInterval(() => {
              const threshold = this.speaking
                ? SPEAKING_THRESHOLD / 2
                : SPEAKING_THRESHOLD;
              this.setSpeaking(soundMeter.instant > threshold, true);
            }, 100);
          });
        })
        .catch((e) => {
          log.error(e);
          alert("Error capturing audio.");
        });
    },
    applyStyles() {
      if (!this.settings) {
        log.error("applyStyles: this.settings not initialized");
        return;
      }
      const styles = this.settings.styles;

      if (styles.bgColorEnabled && styles.bgColor != null) {
        document.body.style.backgroundColor = styles.bgColor;
      } else {
        document.body.style.backgroundColor = "";
      }
    },
  },
  created() {
    // @ts-ignore
    import('./main.css');
    this.avatarFixed = util.getParam('avatar')
  },
  mounted() {
    this.ws = util.wsClient(this.widget);
    this.ws.onMessage("init", (data: AvatarModuleWsInitData) => {
      this.settings = data.settings;
      this.$nextTick(() => {
        this.applyStyles();
      });
      let tuberIdx = data.state.tuberIdx;
      if (this.avatarFixed) {
        tuberIdx = this.settings.avatarDefinitions.findIndex(
          (def) => def.name === this.avatarFixed
        );
      }
      this.setTuber(tuberIdx === -1 ? 0 : tuberIdx);
      this.initialized = true;
    });
    this.ws.onMessage("ctrl", ({ data }) => {
      if (data.ctrl === "setSlot") {
        const tuberIdx = data.args[0];
        if (this.tuberIdx === tuberIdx) {
          const slotName = data.args[1];
          const itemIdx = data.args[2];
          this.setSlot(slotName, itemIdx);
        }
      } else if (data.ctrl === "setSpeaking") {
        const tuberIdx = data.args[0];
        if (this.tuberIdx === tuberIdx) {
          const speaking = data.args[1];
          this.setSpeaking(speaking);
        }
      } else if (data.ctrl === "lockState") {
        const tuberIdx = data.args[0];
        if (this.tuberIdx === tuberIdx) {
          const lockedState = data.args[1];
          this.lockState(lockedState);
        }
      } else if (data.ctrl === "setTuber") {
        const tuberIdx = data.args[0];
        this.setTuber(tuberIdx);
      }
    });
    this.ws.connect();
  },
  unmounted() {
    if (this.ws) {
      this.ws.disconnect()
    }
  },
});
</script>
