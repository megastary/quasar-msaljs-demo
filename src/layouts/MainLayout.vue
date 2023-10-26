<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-toolbar-title>
          Elektronický rezervační systém elektrokol
        </q-toolbar-title>

        <SignOutButton v-if="isAuthenticated"></SignOutButton>
        <SignInButton v-else></SignInButton>
      </q-toolbar>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import SignInButton from 'components/SignInButton.vue';
import SignOutButton from 'components/SignOutButton.vue';
import { useIsAuthenticated } from '../composables/useIsAuthenticated';

const isAuthenticated = useIsAuthenticated();
</script>
