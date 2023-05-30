<template>
  <q-btn @click="loginPopup">Sign in Popup</q-btn>
  <q-btn @click="loginRedirect">Sign in Redirect</q-btn>
</template>

<script setup lang="ts">
import { useMsal } from '../composables/useMsal';
import { loginRequest } from '../authConfig';

const { instance } = useMsal();

const loginPopup = () => {
  instance.loginPopup(loginRequest);
};

const loginRedirect = () => {
  instance.loginRedirect(loginRequest);
};
</script>
