<template>
  <div class="view center-screen mt-2">
    <h1 class="title is-4">Hyottoko.club</h1>

    <div class="field has-background-success-light has-text-success-dark" v-if="success">
      Password successfully set. Click
      <router-link :to="{ name: 'login' }">here</router-link>
      to login.
    </div>
    <div v-else>
      <div class="field has-background-danger-light has-text-danger-dark" v-if="error">
        {{ error }}
      </div>
      <div class="field">
        <div class="control has-icons-left">
          <input class="input" type="password" placeholder="New Password" v-model="pass" @keyup="error = ''"
            @keyup.enter="submit" />
          <span class="icon is-left">
            <i class="fa fa-lock"></i>
          </span>
        </div>
      </div>
      <div class="field">
        <button class="button is-primary is-fullwidth" :disabled="canSubmit ? null : true" @click="submit">
          Save Password
        </button>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent } from "vue";
import api from "../api";
import util from "../util";

export default defineComponent({
  data: () => ({
    pass: "",
    error: "",
    success: false,
  }),
  computed: {
    canSubmit() {
      return this.pass && !this.error;
    },
  },
  methods: {
    async submit() {
      const token = util.getParam('t')
      this.success = false;
      this.error = "";
      const res = await api.resetPassword({ pass: this.pass, token });
      if (res.status === 200) {
        this.success = true;
      } else {
        try {
          this.error = (await res.json()).reason;
        } catch (e) {
          this.error = "Unknown error";
        }
      }
    },
  },
});
</script>
