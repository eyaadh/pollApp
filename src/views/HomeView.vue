<template>
  <div class="relative isolate min-h-screen overflow-hidden bg-gray-900">
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
      <svg x="50%" y="-1" class="overflow-visible fill-gray-800/20">
        <path
          d="M-200 0h201v201h-201Z M600 0h201v201h-201Z M-400 600h201v201h-201Z M200 800h201v201h-201Z"
          stroke-width="0"
        />
      </svg>
      <rect
        width="100%"
        height="100%"
        stroke-width="0"
        fill="url(#983e3e4c-de6d-4c3f-8d64-b9761d1534cc)"
      />
    </svg>
    <div
      class="absolute top-10 left-[calc(50%-4rem)] -z-10 transform-gpu blur-3xl sm:left-[calc(50%-18rem)] lg:top-[calc(50%-30rem)] lg:left-48 xl:left-[calc(50%-24rem)]"
      aria-hidden="true"
    >
      <div
        class="aspect-1108/632 w-277 bg-linear-to-r from-[#80caff] to-[#4f46e5] opacity-20"
        style="
          clip-path: polygon(
            73.6% 51.7%,
            91.7% 11.8%,
            100% 46.4%,
            97.4% 82.2%,
            92.5% 84.9%,
            75.7% 64%,
            55.3% 47.5%,
            46.5% 49.4%,
            45% 62.9%,
            50.3% 87.2%,
            21.3% 64.1%,
            0.1% 100%,
            5.4% 51.1%,
            21.4% 63.9%,
            58.9% 0.2%,
            73.6% 51.7%
          );
        "
      />
    </div>

    <div
      class="mx-auto max-w-7xl px-6 pt-10 pb-24 sm:pb-32 lg:flex lg:px-8 lg:py-40"
    >
      <div class="mx-auto max-w-2xl shrink-0 lg:mx-0 lg:pt-8">
        <h1
          class="animate-fade-down mt-10 text-5xl font-semibold tracking-tight text-pretty text-white sm:text-7xl"
        >
          Live Polls, Instantly.
        </h1>
        <p
          class="animate-fade-right mt-8 text-lg font-medium text-pretty text-gray-400 sm:text-xl/8"
        >
          Create and share real-time polls with anyone, anywhere. No accounts,
          no hassle. Just instant results.
        </p>
        <div class="animate-fade-up mt-10 flex items-center gap-x-6">
          <button
            @click="pollStore.createPoll"
            class="rounded-md bg-indigo-500 px-3.5 py-2.5 text-sm font-semibold text-white shadow-xs hover:bg-indigo-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
          >
            Create a New Poll
          </button>
        </div>

        <div class="animate-fade-up mt-16 w-full">
          <h2 class="text-xl font-bold tracking-tight text-white sm:text-2xl">
            Or manage an existing poll
          </h2>
          <div v-if="pollsList.length > 0" class="mt-6 space-y-3">
            <RouterLink
              v-for="poll in pollsList"
              :key="poll.id"
              :to="{ name: 'manage-poll', params: { id: poll.id } }"
              class="block rounded-lg border border-white/10 bg-white/5 p-4 shadow-lg transition-all hover:bg-white/10 hover:ring-2 hover:ring-indigo-400"
            >
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-sm font-semibold text-white">
                    Poll ID:
                    <span class="font-mono text-gray-400">{{ poll.id }}</span>
                  </p>
                  <p class="text-xs text-gray-400">
                    {{ poll.options.length }} options
                  </p>
                </div>
                <span
                  :class="{
                    'bg-yellow-400/10 text-yellow-400 ring-yellow-400/20':
                      poll.status === 'configuring',
                    'bg-green-400/10 text-green-400 ring-green-400/20':
                      poll.status === 'voting',
                  }"
                  class="rounded-full px-3 py-1 text-xs font-medium capitalize ring-1 ring-inset"
                >
                  {{ poll.status }}
                </span>
              </div>
            </RouterLink>
          </div>
          <div v-else class="mt-6 text-left text-gray-500">
            <p>No polls found. Create one to get started!</p>
          </div>
        </div>
      </div>

      <div
        class="mx-auto mt-16 flex h-[450px] max-w-2xl sm:mt-24 lg:mt-0 lg:mr-0 lg:ml-10 lg:max-w-none lg:flex-none xl:ml-32"
      >
        <div class="max-w-3xl flex-none sm:max-w-5xl lg:max-w-none">
          <img
            src="@/assets/vote.jpg"
            alt="App screenshot"
            class="w-full rounded-md bg-white/5 shadow-2xl ring-1 ring-white/10"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { usePollStore } from "@/stores/poll";
import { storeToRefs } from "pinia";
import { RouterLink } from "vue-router";

const pollStore = usePollStore();
const { pollsList } = storeToRefs(pollStore);
</script>
