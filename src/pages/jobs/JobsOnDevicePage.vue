<template>
  <PageLayout :title="t('job.job_history')">
    <JobStable :jobs="jobs.data" :loading="jobs.isLoading" />
  </PageLayout>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router';
import JobService from '@/services/JobService';
import { useI18n } from 'vue-i18n';
import PageLayout from '@/layouts/PageLayout.vue';
import { useAsyncData } from '@/composables/useAsyncData';
import { reactive } from 'vue';

const { t } = useI18n();

const route = useRoute();

const jobs = reactive(
  useAsyncData(() => JobService.getJobsOnDevice(route.params.id.toString()), t('job.toasts.load_failed')),
);
</script>

<style lang="scss" scoped></style>
