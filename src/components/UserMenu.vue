<script setup lang="ts">
import { mergeProps } from 'vue'

const logout = async () => {
    await useLogout();
    await navigateTo("/account/login", { replace: true });
}

</script>
<template>
    <div class="text-center">
        <v-menu>
            <template v-slot:activator="{ props: menu }">
                <v-btn prepend-icon="manage_accounts" variant="outlined" color="primary" v-bind="mergeProps(menu)"
                    width="200">
                    USER MENU
                </v-btn>
            </template>
            <v-list>
                <v-list-item href="/chat/profile">
                    <v-list-item-title>
                        Profile
                    </v-list-item-title>
                </v-list-item>
                <v-list-item href="/chat/change_password">
                    <v-list-item-title>Change Password</v-list-item-title>
                </v-list-item>
                <v-list-item>
                    <v-list-item-title @click="logout" class="cursor-pointer">Logout</v-list-item-title>
                </v-list-item>
            </v-list>
        </v-menu>
    </div>
</template>
<style scoped>
.cursor-pointer {
    cursor: pointer;
}
</style>