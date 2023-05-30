<template>
  <q-btn icon="person" v-if="!!name" v-bind:label="name">
    <q-menu>
      <q-list style="min-width: 100px">
        <q-item clickable to="/profile">
          <q-item-section>Profile Route Guard</q-item-section>
        </q-item>
        <q-item clickable v-close-popup to="/profilenoguard">
          <q-item-section>Profile No Guard</q-item-section>
        </q-item>
      </q-list>
    </q-menu>
  </q-btn>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useMsal } from '../composables/useMsal';

const { accounts } = useMsal();

const name = computed(() => {
  if (accounts.value.length > 0) {
    const name = accounts.value[0].name;
    if (name) {
      return name;
    }
  }
  return 'Cannot read name';
});
</script>
