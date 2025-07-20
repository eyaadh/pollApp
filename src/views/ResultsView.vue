<template>
  <div
    class="relative isolate min-h-screen overflow-hidden bg-gray-900 p-4 sm:p-8"
  >
    <svg
      class="absolute inset-0 -z-10 size-full mask-[radial-gradient(100%_100%_at_top_right,white,transparent)] stroke-white/10"
      aria-hidden="true"
    >
      <defs>
        <pattern
          id="983e3e4c-de6d-4c3f-8d64-b9761d1534cc"
          width="200"
          height="200"
          x="50%"
          y="-1"
          patternUnits="userSpaceOnUse"
        >
          <path d="M.5 200V.5H200" fill="none" />
        </pattern>
      </defs>
      <rect
        width="100%"
        height="100%"
        stroke-width="0"
        fill="url(#983e3e4c-de6d-4c3f-8d64-b9761d1534cc)"
      />
    </svg>

    <div class="mx-auto max-w-7xl">
      <header class="mb-10 text-center">
        <h1 class="text-4xl font-bold text-white sm:text-5xl">
          {{ pollData?.name || "Live Poll Results" }}
        </h1>
        <p class="mt-4 text-xl text-gray-400">
          Total Votes:
          <span class="font-bold text-white">{{ totalVotes }}</span>
        </p>

        <p
          v-if="pollData?.status === 'closed'"
          class="mt-4 rounded-md bg-red-500/10 px-4 py-2 text-lg font-semibold text-red-400"
        >
          This poll is now closed.
        </p>

        <div
          v-if="pollData?.status !== 'closed'"
          class="mt-6 flex flex-col items-center md:hidden"
        >
          <button
            @click="showQrCode = !showQrCode"
            class="rounded-md bg-white/10 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-white/20"
          >
            {{ showQrCode ? "Hide" : "Show" }} Voting QR Code
          </button>
          <div
            v-if="showQrCode"
            class="mt-6 w-full max-w-xs rounded-lg bg-white p-4 shadow-2xl"
          >
            <QrcodeVue
              :value="`${siteUrl}/poll/${route.params.id}/vote`"
              :size="200"
              level="H"
            />
          </div>
        </div>
      </header>

      <div class="grid grid-cols-1 items-start gap-x-12 md:grid-cols-3">
        <div
          v-if="pollData?.status !== 'closed'"
          class="animate-fade-right hidden md:col-span-1 md:block"
        >
          <div
            class="sticky top-8 rounded-lg border border-white/10 bg-white/5 p-6 text-center shadow-xl"
          >
            <h2 class="text-2xl font-semibold text-white">Scan to Vote</h2>
            <p class="mt-2 mb-6 text-sm text-gray-400">
              Point your camera at the code below to cast your vote.
            </p>
            <div class="inline-block rounded-lg bg-white p-4">
              <QrcodeVue
                :value="`${siteUrl}/poll/${route.params.id}/vote`"
                :size="200"
                level="H"
              />
            </div>
          </div>
        </div>

        <div
          :class="[
            'col-span-1',
            pollData?.status === 'closed' ? 'md:col-span-3' : 'md:col-span-2',
          ]"
        >
          <div v-if="!pollData" class="text-center text-gray-400">
            <p>Loading results...</p>
          </div>
          <div v-else class="space-y-5">
            <div
              v-for="option in sortedOptions"
              :key="option.id"
              class="rounded-lg border border-white/10 bg-white/5 p-4 shadow-xl"
            >
              <div class="mb-2 flex items-center justify-between">
                <span class="text-xl font-semibold text-gray-200">{{
                  option.text
                }}</span>
                <span class="text-lg font-bold text-indigo-400"
                  >{{ option.votes }} votes</span
                >
              </div>
              <div class="h-8 w-full rounded-full bg-black/20">
                <div
                  :class="[
                    'flex h-8 items-center justify-end rounded-full bg-indigo-500 text-white transition-all duration-500 ease-out',
                    { 'pr-2': getVotePercentage(option.votes) > 0 },
                  ]"
                  :style="{ width: getVotePercentage(option.votes) + '%' }"
                >
                  <span
                    v-if="getVotePercentage(option.votes) > 0"
                    class="text-sm font-semibold whitespace-nowrap"
                  >
                    {{ getVotePercentage(option.votes).toFixed(0) }}%
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import { storeToRefs } from "pinia";
import { usePollStore } from "@/stores/poll";
import QrcodeVue from "qrcode.vue";

const pollStore = usePollStore();
const { pollData, sortedOptions } = storeToRefs(pollStore);
const route = useRoute();

// This is now only used for small screens
const showQrCode = ref(false);
const siteUrl = window.location.origin;

onMounted(() => {
  pollStore.bindToPoll(route.params.id as string);
});

const totalVotes = computed(() => pollData.value?.totalVotes || 0);

function getVotePercentage(votes: number) {
  if (totalVotes.value === 0) return 0;
  return (votes / totalVotes.value) * 100;
}
</script>
