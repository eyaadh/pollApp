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

    <div class="mx-auto max-w-3xl">
      <header class="animate-fade-down mb-10 text-center">
        <h1 class="text-4xl font-bold text-white sm:text-5xl">
          Manage Your Poll
        </h1>
        <p v-if="pollData" class="mt-4 font-mono text-sm text-gray-500">
          Poll ID: {{ route.params.id }}
        </p>
      </header>

      <div
        v-if="!pollData"
        class="animate-fade-right text-center text-gray-400"
      >
        <p>Loading poll data...</p>
      </div>

      <div
        v-else-if="pollData.status === 'configuring'"
        class="animate-fade-right"
      >
        <section
          class="mb-8 rounded-lg border border-white/10 bg-white/5 p-6 shadow-xl"
        >
          <h2 class="mb-4 text-2xl font-semibold text-white">
            1. Add & Arrange Options
          </h2>
          <form @submit.prevent="handleAddOption" class="mb-4 flex gap-3">
            <input
              v-model="newOptionText"
              type="text"
              placeholder="e.g., Project Alpha"
              class="flex-grow rounded-md border-white/10 bg-white/5 px-3 py-2 text-white shadow-sm ring-1 ring-white/10 ring-inset focus:ring-2 focus:ring-indigo-500 focus:ring-inset"
            />
            <button
              type="submit"
              class="rounded-md bg-indigo-500 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
            >
              Add
            </button>
          </form>

          <div ref="listEl" class="space-y-2">
            <div
              v-for="option in editableOptions"
              :key="option.id"
              class="flex cursor-grab items-center justify-between rounded-md bg-white/10 p-3"
            >
              <span class="font-medium text-gray-200">{{ option.text }}</span>
              <div class="space-x-4">
                <button
                  @click="startEditing(option)"
                  class="text-sm font-semibold text-indigo-400 hover:text-indigo-300"
                >
                  Edit
                </button>
                <button
                  @click="pollStore.deleteOption(option.id)"
                  class="text-sm font-semibold text-red-400 hover:text-red-300"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
          <p
            v-if="editableOptions.length === 0"
            class="mt-4 text-center text-sm text-gray-500"
          >
            Add some options to get started.
          </p>
        </section>

        <section class="text-center">
          <button
            @click="pollStore.startVoting()"
            :disabled="pollData.options.length < 2"
            class="rounded-md bg-green-500 px-5 py-3 text-base font-semibold text-white shadow-sm hover:bg-green-400 focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-green-500 disabled:cursor-not-allowed disabled:bg-gray-600"
          >
            2. Finalize & Start Voting
          </button>
          <p
            v-if="pollData.options.length < 2"
            class="mt-2 text-center text-sm text-gray-500"
          >
            Add at least two options to start voting.
          </p>
        </section>
      </div>

      <div
        v-else-if="pollData.status === 'voting'"
        class="animate-fade-left text-center"
      >
        <h2 class="mb-4 text-3xl font-bold text-green-400">Voting is Live!</h2>
        <p class="mb-6 text-gray-300">
          Share this QR code or link with your participants.
        </p>
        <div class="mb-8 inline-block rounded-lg bg-white p-4 shadow-2xl">
          <QrcodeVue
            :value="`${siteUrl}/poll/${route.params.id}/vote`"
            :size="250"
            level="H"
          />
        </div>
        <div>
          <button
            @click="
              router.push({ name: 'results', params: { id: route.params.id } })
            "
            class="rounded-md bg-indigo-500 px-5 py-3 text-base font-semibold text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
          >
            View Live Results
          </button>
        </div>
      </div>
    </div>

    <EditOptionDialog
      :open="isEditDialogOpen"
      :initial-value="optionToEdit?.text || ''"
      @close="isEditDialogOpen = false"
      @save="handleSave"
    />
  </div>
</template>

<script setup lang="ts">
// Make sure to import nextTick from 'vue'
import { ref, watch, onMounted, nextTick } from "vue";
import { useRoute, useRouter } from "vue-router";
import { storeToRefs } from "pinia";
import { usePollStore, type PollOption } from "@/stores/poll";
import QrcodeVue from "qrcode.vue";
import { useSortable } from "@vueuse/integrations/useSortable";
import EditOptionDialog from "@/components/EditOptionDialog.vue";

const pollStore = usePollStore();
const { pollData } = storeToRefs(pollStore);
const route = useRoute();
const router = useRouter();

const newOptionText = ref("");
const editableOptions = ref<PollOption[]>([]);
const siteUrl = window.location.origin;

const listEl = ref<HTMLElement | null>(null);
// A flag to ensure we only initialize the sortable logic once
const isSortableInitialized = ref(false);

const isEditDialogOpen = ref(false);
const optionToEdit = ref<PollOption | null>(null);

onMounted(() => {
  pollStore.bindToPoll(route.params.id as string);
});

watch(
  pollData,
  (newData) => {
    if (newData) {
      // First, update the local array's content. The splice method is still correct.
      const newOptions = JSON.parse(JSON.stringify(newData.options));
      editableOptions.value.splice(
        0,
        editableOptions.value.length,
        ...newOptions,
      );

      // --- THIS IS THE NEW LOGIC ---
      // We only initialize useSortable ONE TIME, after the data has loaded.
      if (!isSortableInitialized.value && newOptions.length > 0) {
        // nextTick waits for Vue to update the DOM with the v-for list
        nextTick(() => {
          if (listEl.value) {
            // Ensure the element is mounted
            // Now we initialize useSortable, confident that the data and DOM are ready
            useSortable(listEl, editableOptions, {
              animation: 150,
              onUpdate: () => {
                pollStore.updateOptionsOrder(editableOptions.value);
              },
            });
            // Set the flag so this block never runs again
            isSortableInitialized.value = true;
          }
        });
      }
    }
  },
  { deep: true, immediate: true },
);

async function handleAddOption() {
  await pollStore.addOption(newOptionText.value);
  newOptionText.value = "";
}

function startEditing(option: PollOption) {
  optionToEdit.value = option; // Store the option we want to edit
  isEditDialogOpen.value = true; // Open the dialog
}

function handleSave(newText: string) {
  if (optionToEdit.value) {
    pollStore.updateOptionText(optionToEdit.value.id, newText);
  }
  isEditDialogOpen.value = false; // Close the dialog
}
</script>
