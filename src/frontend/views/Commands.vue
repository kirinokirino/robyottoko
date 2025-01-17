<template>
  <div class="view">
    <div id="top" ref="top">
      <navbar />
    </div>
    <div id="main" ref="main">
      <div class="tabs">
        <ul>
          <li
            v-for="(def, idx) in tabDefinitions"
            :key="idx"
            :class="{ 'is-active': tab === def.tab }"
            @click="tab = def.tab"
          >
            <a>{{ def.title }}</a>
          </li>
          <li>
            <a class="button is-small mr-1" :href="widgetUrl" target="_blank"
              >Open Media widget</a
            >
          </li>
        </ul>
      </div>
      <commands-editor
        v-if="inited && tab === 'commands'"
        v-model="commands"
        @update:modelValue="sendSave"
        :globalVariables="globalVariables"
        :channelPointsCustomRewards="channelPointsCustomRewards"
        :possibleActions="possibleActions"
        :baseVolume="baseVolume"
        :showToggleImages="true"
        :showFilterActions="true"
        :widgetUrl="widgetUrl"
        :showImages="adminSettings.showImages"
        @showImagesChange="updateShowImages"
      />
      <div v-if="inited && tab === 'settings'">
        <table class="table is-striped" ref="table" v-if="settings">
          <tbody>
            <tr>
              <td><code>settings.volume</code></td>
              <td>
                <volume-slider
                  v-model="settings.volume"
                  @update:modelValue="sendSave"
                />
              </td>
              <td>Base volume for all media playing from commands</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent } from "vue";

import WsClient from "../WsClient";
import {
  default_admin_settings,
  default_settings,
  GeneralModuleAdminSettings,
  GeneralModuleSettings,
  GeneralModuleWsEventData,
  GeneralSaveEventData,
} from "../../mod/modules/GeneralModuleCommon";
import { Command, CommandAction, GlobalVariable } from "../../types";
import util from "../util";

interface TabDefinition {
  tab: string;
  title: string;
}

interface ComponentData {
  commands: Command[];
  settings: GeneralModuleSettings;
  adminSettings: GeneralModuleAdminSettings;
  globalVariables: GlobalVariable[];
  channelPointsCustomRewards: Record<string, string[]>;
  ws: WsClient | null;
  inited: boolean;
  possibleActions: CommandAction[];
  tabDefinitions: TabDefinition[];
  tab: "commands" | "settings";
  widgetUrl: string;
}

export default defineComponent({
  data: (): ComponentData => ({
    commands: [],
    settings: default_settings(),
    adminSettings: default_admin_settings(),
    globalVariables: [],
    channelPointsCustomRewards: {},
    ws: null,

    possibleActions: [
      "text",
      "media",
      "media_volume",
      "countdown",
      "dict_lookup",
      "madochan_createword",
      "chatters",
      "set_channel_title",
      "set_channel_game_id",
      "add_stream_tags",
      "remove_stream_tags",
    ],

    tabDefinitions: [
      { tab: "commands", title: "Commands" },
      { tab: "settings", title: "Settings" },
    ],

    inited: false,

    tab: "commands",

    widgetUrl: "",
  }),
  computed: {
    baseVolume() {
      return this.settings.volume;
    },
  },
  methods: {
    updateShowImages(showImages: boolean) {
      this.adminSettings.showImages = showImages;
      this.sendSave();
    },
    sendSave() {
      this.sendMsg({
        event: "save",
        commands: this.commands,
        settings: this.settings,
        adminSettings: this.adminSettings,
      });
    },
    sendMsg(data: GeneralSaveEventData) {
      if (!this.ws) {
        console.warn("sendMsg: this.ws not initialized");
        return;
      }
      this.ws.send(JSON.stringify(data));
    },
  },
  async mounted() {
    this.ws = util.wsClient("general");
    this.ws.onMessage("init", (data: GeneralModuleWsEventData) => {
      this.commands = data.commands;
      this.settings = data.settings;
      this.widgetUrl = data.mediaWidgetUrl;
      this.adminSettings = data.adminSettings;
      this.globalVariables = data.globalVariables;
      this.channelPointsCustomRewards = data.channelPointsCustomRewards;
      this.inited = true;
    });
    this.ws.connect();
  },
  unmounted() {
    if (this.ws) {
      this.ws.disconnect();
    }
  },
});
</script>
