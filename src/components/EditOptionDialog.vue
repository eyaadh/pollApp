<script setup lang="ts">
import { ref, watch } from "vue";
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  TransitionChild,
  TransitionRoot,
} from "@headlessui/vue";
import { PencilSquareIcon } from "@heroicons/vue/24/outline";

const props = defineProps<{
  open: boolean;
  initialValue: string;
}>();

const emit = defineEmits(["close", "save"]);

const newText = ref("");

watch(
  () => props.initialValue,
  (value) => {
    newText.value = value;
  },
);

function handleSave() {
  if (newText.value.trim()) {
    emit("save", newText.value.trim());
  }
}

function handleClose() {
  emit("close");
}
</script>

<template>
  <TransitionRoot as="template" :show="open">
    <Dialog class="relative z-10" @close="handleClose">
      <TransitionChild
        as="template"
        enter="ease-out duration-300"
        enter-from="opacity-0"
        enter-to="opacity-100"
        leave="ease-in duration-200"
        leave-from="opacity-100"
        leave-to="opacity-0"
      >
        <div class="fixed inset-0 bg-gray-900/80 transition-opacity" />
      </TransitionChild>

      <div class="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div
          class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0"
        >
          <TransitionChild
            as="template"
            enter="ease-out duration-300"
            enter-from="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enter-to="opacity-100 translate-y-0 sm:scale-100"
            leave="ease-in duration-200"
            leave-from="opacity-100 translate-y-0 sm:scale-100"
            leave-to="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          >
            <DialogPanel
              class="relative transform overflow-hidden rounded-lg border border-white/10 bg-gray-900 text-left shadow-2xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6"
            >
              <div class="sm:flex sm:items-start">
                <div
                  class="mx-auto flex size-12 shrink-0 items-center justify-center rounded-full bg-indigo-500/10 sm:mx-0 sm:size-10"
                >
                  <PencilSquareIcon
                    class="size-6 text-indigo-400"
                    aria-hidden="true"
                  />
                </div>
                <div
                  class="mt-3 w-full text-center sm:mt-0 sm:ml-4 sm:text-left"
                >
                  <DialogTitle
                    as="h3"
                    class="text-base leading-6 font-semibold text-white"
                  >
                    Edit Poll Option
                  </DialogTitle>
                  <div class="mt-2">
                    <input
                      v-model="newText"
                      type="text"
                      class="block w-full rounded-md border-0 bg-white/5 px-3 py-1.5 text-white shadow-sm ring-1 ring-white/10 ring-inset placeholder:text-gray-400 focus:ring-2 focus:ring-indigo-500 focus:ring-inset sm:text-sm sm:leading-6"
                      placeholder="Enter new option text"
                      @keyup.enter="handleSave"
                    />
                  </div>
                </div>
              </div>

              <div class="mt-5 sm:mt-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  class="inline-flex w-full justify-center rounded-md bg-indigo-500 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-400 sm:ml-3 sm:w-auto"
                  @click="handleSave"
                >
                  Save Changes
                </button>
                <button
                  type="button"
                  class="mt-3 inline-flex w-full justify-center rounded-md bg-white/10 px-3 py-2 text-sm font-semibold text-white shadow-sm ring-1 ring-white/20 ring-inset hover:bg-white/20 sm:mt-0 sm:w-auto"
                  @click="handleClose"
                >
                  Cancel
                </button>
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>
