<template>
    <v-container fluid>
        <v-layout row wrap>
            <v-flex xs10 sm1 class="text-right text-sm-center">
                <img class="provider-logo" :src="require('@/assets/integrations/gcp-logo.png')" />
            </v-flex>
            <v-flex xs12 sm5 style="align-self: center" class="text-center text-sm-left">
                <header class="alias-name title" style="font-family: 'Montserrat', sans-serif !important;">{{ account.aliasName }}</header>
            </v-flex>
            <v-flex xs12 sm6 class="text-center text-sm-right" style="align-self: center">
                <i class="clickable-icon el-icon-video-play primary-color" title="Start Aggregation" role="button"/>
                <i class="clickable-icon el-icon-edit-outline primary-color" title="Edit Integration" role="button"/>
                <i class="clickable-icon el-icon-delete primary-color" title="Delete Integration" role="button"/>
            </v-flex>
        </v-layout>
    </v-container>
</template>

<script>
import { mapActions } from 'vuex';

export default {
    props: {
        account: {
            required: true
        }
    },
    methods: {
        ...mapActions('gcpIntegrations', [
            'DELETE_GCP_ACCOUNT',
        ])
    }
}
</script>

<style lang="scss" scoped>
    .provider-logo {
        width: 75%;
        vertical-align: middle;
    }
    .alias-name {
        vertical-align: middle;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }
</style>