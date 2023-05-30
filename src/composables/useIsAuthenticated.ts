// Source AzureAD sample https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/samples/msal-browser-samples/vue3-sample-app/src/composition-api/useIsAuthenticated.ts

import { Ref, ref, watch } from 'vue';
import { useMsal } from './useMsal';

export function useIsAuthenticated(): Ref<boolean> {
    const { accounts } = useMsal();

    const isAuthenticated = ref(accounts.value.length > 0);

    watch(accounts, () => {
        isAuthenticated.value = accounts.value.length > 0;
    });

    return isAuthenticated;
}
