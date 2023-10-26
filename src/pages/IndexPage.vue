<template>
  <q-page class="row items-center justify-evenly">
    <q-btn color="primary" size="xl" label="Nemám firemní účet" to="/form" />
    <q-btn
      color="primary"
      size="xl"
      label="Mám firemní účet"
      @click="getGraphData"
    />
  </q-page>
</template>

<script setup lang="ts">
import { useMsal } from '../composables/useMsal';
import {
  BrowserAuthError,
  InteractionRequiredAuthError,
  InteractionStatus,
} from '@azure/msal-browser';
import { reactive } from 'vue';
import { loginRequest, graphConfig } from '../authConfig';
import { useMsGraphApiCall } from '../composables/useMsGraphApiCall';
import { useRouter } from 'vue-router';

const { instance, inProgress } = useMsal();

const router = useRouter();

const state = reactive({
  resolved: false,
});

async function getGraphData() {
  const response = await instance
    .acquireTokenSilent({
      ...loginRequest,
    })
    .catch(async (e) => {
      if (
        e instanceof InteractionRequiredAuthError ||
        e instanceof BrowserAuthError
      ) {
        await instance.acquireTokenRedirect(loginRequest);
      }
      throw e;
    });
  if (inProgress.value === InteractionStatus.None) {
    // User profile
    const graphData = await useMsGraphApiCall(
      response.accessToken,
      graphConfig.graphMeEndpoint
    );
    localStorage.setItem('displayNameGraph', graphData.displayName);
    localStorage.setItem('extensionAttribute11Graph', graphData.displayName);
    localStorage.setItem('extensionAttribute14Graph', graphData.displayName);

    state.resolved = true;
    router.push({ path: 'form' });
  }
}

// async function getGraphData() {
//   if (result.value) {
//     // User profile
//     const graphData = await useMsGraphApiCall(
//       result.value.accessToken,
//       graphConfig.graphMeDetailsEndpoint
//     ).catch(() => acquireToken());
//     localStorage.setItem('displayNameGraph', graphData.displayName);
//     localStorage.setItem('extensionAttribute11Graph', graphData.displayName);
//     localStorage.setItem('extensionAttribute14Graph', graphData.displayName);
//     router.push({
//       path: 'form',
//     });
//     state.resolved = true;
//   }
// }
</script>
