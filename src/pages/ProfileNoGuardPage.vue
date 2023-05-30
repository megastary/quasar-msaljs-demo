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
import { useMsalAuthentication } from '../composables/useMsalAuthentication';
import { InteractionType } from '@azure/msal-browser';
import { reactive, watch } from 'vue';
import { loginRequest, graphConfig } from '../authConfig';
import { useMsGraphApiCall } from '../composables/useMsGraphApiCall';
import { UserInfo, UserPhoto } from '../components/models';
import { useMsGraphApiCallPhoto } from 'src/composables/useMsGraphApiCallPhoto';

const { result, acquireToken } = useMsalAuthentication(
  InteractionType.Redirect,
  loginRequest
);

const state = reactive({
  resolved: false,
  me_data: {} as UserInfo,
  photo_data: {} as UserPhoto,
});

async function getGraphData() {
  if (result.value) {
    // User profile
    const graphData = await useMsGraphApiCall(
      result.value.accessToken,
      graphConfig.graphMeEndpoint
    ).catch(() => acquireToken());
    state.me_data = graphData;

    // User photo
    const graphPhotoData = await useMsGraphApiCallPhoto(
      result.value.accessToken,
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
  }
}

getGraphData();

watch(result, () => {
  getGraphData();
});
</script>
