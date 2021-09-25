export default {
  template: `
<div class="center-screen">
  <h1 class="title is-6">Hyottoko.club</h1>

  <div class="field has-background-success-light has-text-success-dark" v-if="success">
    Account registered. Please check your mail.
    Click <a href="/login">here</a> to login.
  </div>
  <div v-else>
    <div class="field has-background-danger-light has-text-danger-dark" v-if="error">
      <div v-if="error === 'verified_mail_already_exists'">
        A user with this email is already registered. <br />
        <a href="/forgot-password">Request a password reset</span>
      </div>
      <div v-else-if="error === 'unverified_mail_already_exists'">
        A user with this email is already registered. <br />
        <span class="button is-small" @click="onRequestVerificationEmail">Resend verification email</span>
      </div>
      <div v-else-if="error === 'verified_name_already_exists'">
        A user with this name is already registered.
      </div>
      <div v-else-if="error === 'unverified_name_already_exists'">
        A user with this name is already registered.
      </div>
      <span v-else>{{error}}</span>
    </div>
    <div class="field">
      <div class="control has-icons-left">
        <input class="input is-small" type="text" placeholder="User" v-model="user" @input="error=''" />
        <span class="icon is-small is-left">
          <i class="fa fa-user"></i>
        </span>
      </div>
    </div>
    <div class="field">
      <div class="control has-icons-left">
        <input class="input is-small" type="email" placeholder="Email" v-model="email" @input="error=''" />
        <span class="icon is-small is-left">
          <i class="fa fa-envelope"></i>
        </span>
      </div>
    </div>
    <div class="field">
      <div class="control has-icons-left">
        <input class="input is-small" type="password" placeholder="Password" v-model="pass" @input="error=''" @keyup.enter="submit"/>
        <span class="icon is-small is-left">
          <i class="fa fa-lock"></i>
        </span>
      </div>
    </div>
    <div class="field">
      <button class="button is-small is-primary" :disabled="canRegister ? null : true" @click="submit">Register</button>
    </div>
  </div>
</div>
`,
  data() {
    return {
      user: '',
      pass: '',
      email: '',
      error: '',
      success: false,
    }
  },
  computed: {
    canRegister() {
      return (this.user && this.pass && this.email)
        && (!this.error)
    },
  },
  methods: {
    async onRequestVerificationEmail() {
      this.success = false
      this.error = ''
      const res = await fetch('/api/user/_resend_verification_mail', {
        method: 'post',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email: this.email }),
      })
      if (res.status === 200) {
        this.success = true
      } else {
        try {
          this.error = (await res.json()).reason
        } catch (e) {
          this.error = 'Unknown error'
        }
      }
    },
    async submit() {
      this.success = false
      this.error = ''
      const res = await fetch('/api/user/_register', {
        method: 'post',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ user: this.user, pass: this.pass, email: this.email }),
      })
      if (res.status === 200) {
        this.success = true
      } else {
        try {
          this.error = (await res.json()).reason
        } catch (e) {
          this.error = 'Unknown error'
        }
      }
    },
  },
}