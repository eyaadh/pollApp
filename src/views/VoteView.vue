<template>
  <div
    class="relative isolate flex min-h-screen items-center justify-center overflow-hidden bg-gray-900 p-4 sm:p-8"
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

    <div class="mx-auto w-full max-w-lg text-center">
      <header class="animate-fade-down mb-10">
        <h1 class="text-4xl font-bold text-white sm:text-5xl">
          Cast Your Vote
        </h1>
      </header>

      <div v-if="!pollData" class="animate-fade-up text-gray-400">
        <p>Loading poll...</p>
      </div>
      <div class="animate-fade-up" v-else-if="pollData.status !== 'voting'">
        <p class="text-xl text-yellow-400">
          Voting for this poll has not started yet.
        </p>
      </div>
      <div v-else-if="!hasVoted" class="animate-fade-left space-y-4">
        <button
          v-for="option in pollData.options"
          :key="option.id"
          @click="handleVote(option.id)"
          class="w-full transform rounded-lg bg-indigo-500 py-4 text-xl font-semibold text-white shadow-lg transition-transform hover:scale-105 hover:bg-indigo-400 focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
        >
          {{ option.text }}
        </button>
      </div>
      <div v-else>
        <p class="mt-2 text-2xl font-semibold text-green-400">
          Thank you for your vote!
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import { storeToRefs } from "pinia";
import { usePollStore } from "@/stores/poll";

const pollStore = usePollStore();
const { pollData } = storeToRefs(pollStore);
const route = useRoute();
const hasVoted = ref(false);

onMounted(() => {
  pollStore.bindToPoll(route.params.id as string);
});

async function handleVote(optionId: string) {
  try {
    await pollStore.castVote(optionId);
    hasVoted.value = true;
  } catch (error) {
    console.error(error);
    alert(
      "Sorry, your vote could not be cast. The poll may have been deleted.",
    );
  }
}
</script>
