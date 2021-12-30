<template>
  <q-page class="row items-center justify-evenly">
    <q-card>
      <q-card-section v-if="!loggedIn">
        <div class="text-h6">登录PAMS</div>
        <div class="column">
          <q-input v-model="usernameInput" label="用户名"/>
          <q-input v-model="password" type="password" label="密码"/>
          <div class="self-center login-btn">
            <q-btn color="primary" label="登录系统" @click="login"/>
          </div>
        </div>
      </q-card-section>


      <q-card-section v-if="loggedIn">
        <div class="text-h6">欢迎来到PAMS</div>
        <div class="row">
          <div class="column">
            <q-input v-model="username" disable label="用户名"/>
            <div class="self-center login-btn">
              <q-btn color="primary" label="注销" @click="logout"/>
            </div>
          </div>
        </div>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<style>
.login-btn {
  margin-top: 16px;
}
</style>

<script lang="ts">
import { defineComponent } from 'vue';
import { BACKEND } from 'src/consts';
import { getToken, setToken } from 'components/util';
import { PamsResponse, PamsResponseCode, PamsUserInfo } from 'components/models';
import { Notify } from 'quasar';

export default defineComponent({
  name: 'PageIndex',
  data() {
    return {
      loggedIn: false,
      username: '',
      usernameInput: '',
      password: '',
      role: 0,
    }
  },
  computed: {},
  methods: {
    login() {
      fetch(`${BACKEND}/api/auth/login`, {
        method: 'post',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: this.usernameInput, password: this.password })
      }).then(r => r.json()).then(d => {
        const resp = d as PamsResponse<string>;
        this.loggedIn = resp.code == PamsResponseCode.OK;
        if (this.loggedIn && resp.data) {
          this.username = this.usernameInput;
          setToken(resp.data);
          Notify.create(`欢迎回来 ${this.username}`);
        } else {
          Notify.create(`登录失败，原因: ${resp.msg}`);
        }
      }).catch(e => console.error(e));
    },
    logout() {
      this.loggedIn = false;
      this.usernameInput = '';
      this.username = '';
      this.password = '';
      setToken('');
    }
  },
  mounted() {
    fetch(`${BACKEND}/api/auth/user`, {
      method: 'post',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token: getToken() })
    }).then(r => r.json()).then(d => {
      const resp = d as PamsResponse<PamsUserInfo>;
      this.loggedIn = resp.code == PamsResponseCode.OK;
      if (this.loggedIn && resp.data) {
        this.username = resp.data.name;
      }
    }).catch(e => console.error(e));
  }
});
</script>
