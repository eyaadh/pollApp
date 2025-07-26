<template>
  <div class="relative isolate bg-gray-900">
    <!-- Background SVG -->
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

    <div class="mx-auto max-w-7xl px-6 py-24 sm:pt-32 lg:px-8 lg:py-40">
      <div class="lg:grid lg:grid-cols-12 lg:gap-8">
        <div class="animate-fade-left lg:col-span-5">
          <h2
            class="text-3xl font-semibold tracking-tight text-pretty text-white sm:text-4xl"
          >
            How It Works
          </h2>
          <p class="mt-4 text-base/7 text-pretty text-gray-300">
            A quick guide to creating and managing your real-time polls. Can’t
            find the answer you’re looking for? Feel free to explore the code on
            GitHub!
          </p>
          <div class="mt-10">
            <RouterLink
              :to="{ name: 'home' }"
              class="rounded-md bg-indigo-500 px-5 py-3 text-base font-semibold text-white shadow-sm hover:bg-indigo-400"
            >
              &larr; Back to Homepage
            </RouterLink>
          </div>
        </div>
        <div class="animate-fade-right mt-10 lg:col-span-7 lg:mt-0">
          <dl class="space-y-10">
            <div v-for="faq in helpTopics" :key="faq.question">
              <!-- Each question now has an icon -->
              <dt
                class="flex items-center gap-x-3 text-base/7 font-semibold text-white"
              >
                <component
                  :is="faq.icon"
                  class="h-6 w-6 flex-none text-indigo-400"
                  aria-hidden="true"
                />
                <span>{{ faq.question }}</span>
              </dt>
              <dd class="mt-2 text-base/7 text-gray-300">{{ faq.answer }}</dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { RouterLink } from "vue-router";
// Import the icons from Heroicons
import {
  PlusCircleIcon,
  Cog6ToothIcon,
  ListBulletIcon,
  PlayCircleIcon,
  QrCodeIcon,
  TrashIcon,
} from "@heroicons/vue/24/outline";

const helpTopics = [
  {
    question: "How do I create a poll?",
    answer:
      'From the homepage, simply enter a name for your poll and click the "Create Poll" button. You will be automatically taken to the management page for your new poll to continue setting it up.',
    icon: PlusCircleIcon,
  },
  {
    question: "What are the 'Poll Details' settings?",
    answer:
      "On the manage page, you can configure your poll's name, set the results visibility ('Open' or 'Private'), decide if the poll should be 'Listed' on the homepage, and view your secret 'Closing Code'.",
    icon: Cog6ToothIcon,
  },
  {
    question: "How do I manage the poll options?",
    answer:
      'In the "Add & Arrange Options" section, you can add new options, delete existing ones, edit their text via a pop-up dialog, and re-order them by simply dragging and dropping them into your preferred sequence.',
    icon: ListBulletIcon,
  },
  {
    question: "How do I start the voting?",
    answer:
      "Once you have added at least two options to your poll, the 'Finalize & Start Voting' button will become active. Clicking this will lock in the poll's settings and move it to the 'Voting' state.",
    icon: PlayCircleIcon,
  },
  {
    question: 'What happens when a poll is "Voting"?',
    answer:
      "The management page will display a QR code for you to share with your audience. You can no longer edit the poll's details. This page is now where you will use your closing code to either view private results or to close the poll for good.",
    icon: QrCodeIcon,
  },
  {
    question: "How do I delete a poll?",
    answer:
      "A poll can only be deleted after it has been closed. Once a poll's status is 'Closed', the management page will show a 'Danger Zone' where you must re-enter your closing code to confirm and permanently delete the poll.",
    icon: TrashIcon,
  },
];
</script>
