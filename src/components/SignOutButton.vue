<template>
  <ProfileButton />
  <q-btn @click="logoutPopup">Sign out Popup</q-btn>
  <q-btn @click="logoutRedirect">Sign out Redirect</q-btn>
</template>

<script setup lang="ts">
import { useMsal } from '../composables/useMsal';
import ProfileButton from './ProfileButton.vue';

const { instance } = useMsal();

const logoutPopup = () => {
  instance.logoutPopup({
    mainWindowRedirectUri: '/',
  });
};

const logoutRedirect = () => {
  instance.logoutRedirect();
};
</script>
