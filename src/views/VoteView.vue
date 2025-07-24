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
          {{ pollData?.name || "Cast Your Vote" }}
        </h1>
      </header>

      <div v-if="!pollData" class="animate-fade-up text-gray-400">
        <p>Loading poll...</p>
      </div>
      <div v-else-if="pollData.status !== 'voting'" class="animate-fade-up">
        <p class="text-xl text-yellow-400">
          Voting for this poll is not currently active.
        </p>
      </div>
      <div v-else-if="hasVoted" class="animate-fade-up">
        <p class="mt-2 text-2xl font-semibold text-green-400">
          Thank you for your vote!
        </p>
      </div>
      <div v-else class="animate-fade-left space-y-4">
        <button
          v-for="option in pollData.options"
          :key="option.id"
          @click="handleVote(option.id)"
          :disabled="isSubmitting"
          :class="[
            'flex w-full transform items-center justify-center rounded-lg bg-indigo-500 py-4 text-xl font-semibold text-white shadow-lg transition-transform focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-indigo-500',
            {
              'pointer-events-none opacity-50': isSubmitting,
              'hover:scale-105 hover:bg-indigo-400': !isSubmitting,
            },
          ]"
        >
          <ArrowPathIcon
            v-if="isSubmitting && option.id === submittingOptionId"
            class="h-6 w-6 animate-spin"
          />
          <span v-else>{{ option.text }}</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { storeToRefs } from "pinia";
import { usePollStore } from "@/stores/poll";
import { ArrowPathIcon } from "@heroicons/vue/20/solid";

const pollStore = usePollStore();
const { pollData } = storeToRefs(pollStore);
const route = useRoute();
const router = useRouter();

const hasVoted = ref(false);
const isSubmitting = ref(false);
const submittingOptionId = ref<string | null>(null);

const pollId = route.params.id as string;
const storageKey = `voted_poll_${pollId}`;

// This watch still handles the case where the admin closes the poll while you're on the page
watch(pollData, (newData) => {
  if (newData?.status === "closed") {
    router.push({ name: "results", params: { id: pollId } });
  }
});

onMounted(() => {
  if (localStorage.getItem(storageKey)) {
    hasVoted.value = true;
  }
  pollStore.bindToPoll(pollId);
});

async function handleVote(optionId: string) {
  if (isSubmitting.value) return;

  isSubmitting.value = true;
  submittingOptionId.value = optionId;

  try {
    await pollStore.castVote(optionId);
    localStorage.setItem(storageKey, "true");

    hasVoted.value = true;
  } catch (error) {
    console.error(error);
    alert(
      "Sorry, your vote could not be cast. The poll may have been deleted or closed.",
    );
  } finally {
    isSubmitting.value = false;
    submittingOptionId.value = null;
  }
}
</script>
