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
          {{ pollData?.name || "Manage Your Poll" }}
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
          <h2 class="mb-4 text-2xl font-semibold text-white">Poll Details</h2>
          <div class="mb-6">
            <label
              for="poll-name"
              class="block text-sm leading-6 font-medium text-gray-300"
              >Poll Name</label
            >
            <div class="mt-2">
              <input
                v-model="editablePollName"
                id="poll-name"
                type="text"
                class="block w-full rounded-md border-0 bg-white/5 px-3 py-1.5 text-white shadow-sm ring-1 ring-white/10 ring-inset placeholder:text-gray-400 focus:ring-2 focus:ring-indigo-500 focus:ring-inset sm:text-sm sm:leading-6"
              />
            </div>
          </div>
          <div>
            <label
              for="close-code"
              class="block text-sm leading-6 font-medium text-gray-300"
              >Closing Code</label
            >
            <p class="mt-1 text-xs text-gray-500">
              Save this code. You'll need it to close the poll later.
            </p>
            <div class="mt-2 flex gap-2">
              <input
                :type="closeCodeInputType"
                :value="pollData.closeCode"
                readonly
                class="block w-full rounded-md border-0 bg-black/20 px-3 py-1.5 font-mono text-gray-300 shadow-sm ring-1 ring-white/10 ring-inset"
              />
              <button
                @click="toggleCloseCodeVisibility"
                class="rounded-md p-2 text-sm font-semibold text-gray-300 ring-1 ring-white/20 ring-inset hover:bg-white/10"
              >
                <EyeIcon
                  v-if="closeCodeInputType === 'password'"
                  class="h-5 w-5"
                />
                <EyeSlashIcon v-else class="h-5 w-5" />
              </button>
              <button
                @click="copy(pollData.closeCode)"
                class="rounded-md bg-indigo-500 p-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-400"
              >
                <ClipboardDocumentCheckIcon v-if="copied" class="h-5 w-5" />
                <ClipboardDocumentIcon v-else class="h-5 w-5" />
              </button>
            </div>
          </div>
        </section>

        <section
          class="mb-8 rounded-lg border border-white/10 bg-white/5 p-6 shadow-xl"
        >
          <h2 class="mb-4 text-2xl font-semibold text-white">
            Add & Arrange Options
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
            Finalize & Start Voting
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
        <div class="mb-12">
          <button
            @click="
              router.push({ name: 'results', params: { id: route.params.id } })
            "
            class="rounded-md bg-indigo-500 px-5 py-3 text-base font-semibold text-white shadow-sm hover:bg-indigo-400"
          >
            View Live Results
          </button>
        </div>

        <section
          class="rounded-lg border border-red-500/30 bg-red-500/5 p-6 shadow-xl"
        >
          <h2 class="mb-4 text-xl font-semibold text-white">Close This Poll</h2>
          <p class="mb-4 text-sm text-gray-400">
            Once closed, no more votes can be cast. Enter the closing code to
            proceed.
          </p>
          <form
            @submit.prevent="handleClosePoll"
            class="flex justify-center gap-3"
          >
            <input
              v-model="enteredCloseCode"
              type="text"
              placeholder="Enter code..."
              class="rounded-md border-white/10 bg-white/5 px-3 py-2 text-white shadow-sm ring-1 ring-white/10 ring-inset focus:ring-2 focus:ring-red-500 focus:ring-inset"
            />
            <button
              type="submit"
              class="rounded-md bg-red-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500"
            >
              Close Poll
            </button>
          </form>
        </section>
      </div>

      <div
        v-else-if="pollData.status === 'closed'"
        class="animate-fade-up text-center"
      >
        <h2 class="mb-4 text-3xl font-bold text-gray-400">Poll Closed</h2>
        <p class="mb-6 text-gray-300">
          This poll is no longer accepting votes.
        </p>
        <div>
          <button
            @click="
              router.push({ name: 'results', params: { id: route.params.id } })
            "
            class="rounded-md bg-indigo-500 px-5 py-3 text-base font-semibold text-white shadow-sm hover:bg-indigo-400"
          >
            View Final Results
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
import { ref, watch, onMounted, nextTick } from "vue";
import { useRoute, useRouter } from "vue-router";
import { storeToRefs } from "pinia";
import { usePollStore, type PollOption } from "@/stores/poll";
import QrcodeVue from "qrcode.vue";
import { useSortable } from "@vueuse/integrations/useSortable";
import { watchDebounced, useClipboard } from "@vueuse/core";
import EditOptionDialog from "@/components/EditOptionDialog.vue";
import {
  EyeIcon,
  EyeSlashIcon,
  ClipboardDocumentIcon,
  ClipboardDocumentCheckIcon,
} from "@heroicons/vue/24/outline";

const pollStore = usePollStore();
const { pollData } = storeToRefs(pollStore);
const route = useRoute();
const router = useRouter();

const editablePollName = ref("");
const closeCodeInputType = ref<"password" | "text">("password");
const enteredCloseCode = ref("");
const { copy, copied } = useClipboard();

const newOptionText = ref("");
const editableOptions = ref<PollOption[]>([]);
const siteUrl = window.location.origin;

const listEl = ref<HTMLElement | null>(null);
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
      editablePollName.value = newData.name;
      const newOptions = JSON.parse(JSON.stringify(newData.options));
      editableOptions.value.splice(
        0,
        editableOptions.value.length,
        ...newOptions,
      );

      if (!isSortableInitialized.value && newOptions.length > 0) {
        nextTick(() => {
          if (listEl.value) {
            useSortable(listEl, editableOptions, {
              animation: 150,
              onUpdate: () => {
                pollStore.updateOptionsOrder(editableOptions.value);
              },
            });
            isSortableInitialized.value = true;
          }
        });
      }
    }
  },
  { deep: true, immediate: true },
);

watchDebounced(
  editablePollName,
  (newName) => {
    if (newName && newName !== pollData.value?.name) {
      pollStore.updatePollName(newName);
    }
  },
  { debounce: 500, maxWait: 2000 },
);

function toggleCloseCodeVisibility() {
  closeCodeInputType.value =
    closeCodeInputType.value === "password" ? "text" : "password";
}

async function handleClosePoll() {
  await pollStore.closePollWithCode(enteredCloseCode.value);
  enteredCloseCode.value = "";
}

async function handleAddOption() {
  await pollStore.addOption(newOptionText.value);
  newOptionText.value = "";
}

function startEditing(option: PollOption) {
  optionToEdit.value = option;
  isEditDialogOpen.value = true;
}

function handleSave(newText: string) {
  if (optionToEdit.value) {
    pollStore.updateOptionText(optionToEdit.value.id, newText);
  }
  isEditDialogOpen.value = false;
}
</script>
