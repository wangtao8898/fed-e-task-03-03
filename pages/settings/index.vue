<template>
  <div class="settings-page">
    <div class="container page">
      <div class="row">

        <div class="col-md-6 offset-md-3 col-xs-12">
          <h1 class="text-xs-center">Your Settings</h1>

          <form @submit.prevent="onSubmit">
            <fieldset>
              <fieldset class="form-group">
                <input v-model="user.image" class="form-control" type="text" placeholder="URL of profile picture">
              </fieldset>
              <fieldset class="form-group">
                <input v-model="user.username" class="form-control form-control-lg" type="text" placeholder="Your Name" required>
              </fieldset>
              <fieldset class="form-group">
                <textarea v-model="user.bio" class="form-control form-control-lg" rows="8" placeholder="Short bio about you"></textarea>
              </fieldset>
              <fieldset class="form-group">
                <input v-model="user.email" class="form-control form-control-lg" type="email" placeholder="Email" required>
              </fieldset>
              <fieldset class="form-group">
                <input v-model="user.password" class="form-control form-control-lg" type="password" placeholder="Password" minlength="8">
              </fieldset>
              <button class="btn btn-lg btn-primary pull-xs-right" :disabled="isDisabled">
                Update Settings
              </button>
            </fieldset>
          </form>
          <hr/>
          <button class="btn btn-outline-danger" @click="logout">
            Or click here to logout.
          </button>
        </div>

      </div>
    </div>
  </div>
</template>

<script>
import { getCurrentUser, updateUser } from '@/api/user'
import { mapMutations } from 'vuex'
const Cookie = process.client ? require('js-cookie') : undefined

export default {
  name: "Settings",
  middleware: 'notLoginAuth',
  data() {
    return {
      user: {},
      isDisabled: false
    }
  },
  async created () {
    const { data } = await getCurrentUser()
    this.user = data.user
  },
  methods: {
    ...mapMutations(['setUser']),
    async onSubmit () {
      this.isDisabled = true
      const { data } = await updateUser(this.user)
      this.setUser(data.user)
      this.$router.push({ name: 'profile', params: { username: data.user.username }})
    },
    logout () {
      this.setUser(null)
      Cookie.remove('user')
      this.$router.push('/login')
    }
  }
}
</script>

<style scoped>

</style>