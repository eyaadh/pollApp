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

    <div class="mx-auto max-w-4xl">
      <header class="mb-10 text-center">
        <h1 class="text-4xl font-bold text-white sm:text-5xl">
          {{ pollData?.name || "Poll Results" }}
        </h1>
        <p class="mt-4 text-xl text-gray-400">
          Total Votes:
          <span class="font-bold text-white">{{ totalVotes }}</span>
        </p>
      </header>

      <div>
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
</template>

<script setup lang="ts">
import { computed, onMounted, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { storeToRefs } from "pinia";
import { usePollStore } from "@/stores/poll";

const pollStore = usePollStore();
const { pollData, sortedOptions } = storeToRefs(pollStore);
const route = useRoute();
const router = useRouter();

onMounted(() => {
  pollStore.bindToPoll(route.params.id as string);
});

// The script correctly handles all authorization and redirection logic
watch(pollData, (newData) => {
  if (newData) {
    if (newData.status === "closed") {
      return;
    }
    if (newData.visibility === "open") {
      return;
    }
    if (newData.status === "voting" && newData.visibility === "private") {
      const codeFromQuery = (route.query.code as string) || "";
      if (codeFromQuery.toUpperCase() === newData.closeCode) {
        return;
      }
    }
    router.push({ name: "manage-poll", params: { id: route.params.id } });
  }
});

const totalVotes = computed(() => pollData.value?.totalVotes || 0);

function getVotePercentage(votes: number) {
  if (totalVotes.value === 0) return 0;
  return (votes / totalVotes.value) * 100;
}
</script>
