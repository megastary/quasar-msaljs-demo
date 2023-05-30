<template>
  <q-page div v-if="state.resolved" class="row items-center justify-evenly">
    <q-card class="my-card col-6">
      <q-item>
        <q-item-section avatar>
          <q-avatar>
            <img
              :src="state.photo_data.base64Image"
              v-if="state.photo_data.base64Image"
            />
            <q-skeleton v-else type="QAvatar" />
          </q-avatar>
        </q-item-section>

        <q-item-section>
          <q-item-label>{{ state.me_data.displayName }}</q-item-label>
          <q-item-label caption>User profile details below</q-item-label>
        </q-item-section>
      </q-item>

      <q-list bordered separator>
        <q-item clickable v-ripple>
          <q-item-section>
            <q-item-label overline>Title</q-item-label>
            <q-item-label>{{ state.me_data.jobTitle }}</q-item-label>
          </q-item-section>
        </q-item>

        <q-item clickable v-ripple>
          <q-item-section>
            <q-item-label overline>Mail</q-item-label>
            <q-item-label>{{ state.me_data.mail }}</q-item-label>
          </q-item-section>
        </q-item>

        <q-item clickable v-ripple>
          <q-item-section>
            <q-item-label overline>Phone</q-item-label>
            <q-item-label>{{
              state.me_data.businessPhones
                ? state.me_data.businessPhones[0]
                : ''
            }}</q-item-label>
          </q-item-section>
        </q-item>

        <q-item clickable v-ripple>
          <q-item-section>
            <q-item-label overline>Location</q-item-label>
            <q-item-label>{{ state.me_data.officeLocation }}</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </q-card>
  </q-page>
</template>

<script setup lang="ts">
import { useMsal } from '../composables/useMsal';
import {
  InteractionRequiredAuthError,
  InteractionStatus,
} from '@azure/msal-browser';
import { reactive, onMounted, watch, ref } from 'vue';
import { loginRequest, graphConfig } from '../authConfig';
import { useMsGraphApiCall } from '../composables/useMsGraphApiCall';
import { useMsGraphApiCallPhoto } from '../composables/useMsGraphApiCallPhoto';
import { UserInfo, UserPhoto } from '../components/models';

const { instance, inProgress } = useMsal();

const state = reactive({
  resolved: false,
  me_data: {} as UserInfo,
  photo_data: {} as UserPhoto,
});

async function getGraphData() {
  const response = await instance
    .acquireTokenSilent({
      ...loginRequest,
    })
    .catch(async (e) => {
      if (e instanceof InteractionRequiredAuthError) {
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
    state.me_data = graphData;

    // User photo
    const graphPhotoData = await useMsGraphApiCallPhoto(
      response.accessToken,
      graphConfig.graphMePhoto
    );
    let reader = new FileReader();
    reader.readAsDataURL(graphPhotoData);
    reader.onload = () => {
      Promise.resolve(reader.result).then((value) => {
        state.photo_data.base64Image = value?.toString();
      });
    };

    state.resolved = true;
    stopWatcher();
  }
}

onMounted(() => {
  getGraphData();
});

const stopWatcher = watch(inProgress, () => {
  if (!state.resolved) {
    getGraphData();
  }
});
</script>
