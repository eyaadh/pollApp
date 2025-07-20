import { ref, computed } from "vue";
import { defineStore } from "pinia";
import { useRouter } from "vue-router";
import { useDocument, useFirestore } from "vuefire";
import {
  collection,
  doc,
  setDoc,
  updateDoc,
  runTransaction,
  type DocumentReference,
} from "firebase/firestore";
import { useCollection } from "vuefire"; // Import useCollection

// Define the data structures for type safety
export interface PollOption {
  id: string;
  text: string;
  votes: number;
}

export interface Poll {
  options: PollOption[];
  status: "configuring" | "voting";
  totalVotes: number;
}

export const usePollStore = defineStore("poll", () => {
  // --- This is the key change ---
  // Get the firestore instance provided by vuefire
  const db = useFirestore();

  const router = useRouter();

  // --- STATE ---
  const pollRef = ref<DocumentReference<Poll> | null>(null);
  const pollData = useDocument<Poll>(pollRef);

  // ... THE REST OF YOUR STORE LOGIC REMAINS EXACTLY THE SAME ...
  // All the functions like createPoll, castVote, etc., will now
  // use the correct `db` instance from useFirestore().

  const pollsCollection = collection(db, "polls");
  const pollsList = useCollection(pollsCollection); // Binds to the entire collection

  // --- GETTERS ---
  const sortedOptions = computed(() => {
    if (!pollData.value) return [];
    return [...pollData.value.options].sort((a, b) => b.votes - a.votes);
  });

  // --- ACTIONS ---
  async function createPoll() {
    const newPollRef = doc(collection(db, "polls"));
    await setDoc(newPollRef, {
      options: [],
      status: "configuring",
      totalVotes: 0,
    });
    router.push({ name: "manage-poll", params: { id: newPollRef.id } });
  }

  function bindToPoll(id: string) {
    pollRef.value = doc(db, "polls", id) as DocumentReference<Poll>;
  }

  async function addOption(text: string) {
    if (
      !pollRef.value ||
      !text.trim() ||
      pollData.value?.status !== "configuring"
    )
      return;
    const newOption: PollOption = {
      id: crypto.randomUUID(),
      text: text.trim(),
      votes: 0,
    };
    const newOptions = [...(pollData.value.options || []), newOption];
    await updateDoc(pollRef.value, { options: newOptions });
  }

  async function deleteOption(optionId: string) {
    if (!pollRef.value || pollData.value?.status !== "configuring") return;
    const newOptions = pollData.value.options.filter((o) => o.id !== optionId);
    await updateDoc(pollRef.value, { options: newOptions });
  }

  async function updateOptionText(optionId: string, newText: string) {
    if (!pollRef.value || pollData.value?.status !== "configuring") return;
    const newOptions = pollData.value.options.map((o) =>
      o.id === optionId ? { ...o, text: newText } : o,
    );
    await updateDoc(pollRef.value, { options: newOptions });
  }

  async function updateOptionsOrder(newOptions: PollOption[]) {
    if (!pollRef.value || pollData.value?.status !== "configuring") return;
    await updateDoc(pollRef.value, { options: newOptions });
  }

  async function startVoting() {
    if (!pollRef.value) return;
    await updateDoc(pollRef.value, { status: "voting" });
  }

  async function castVote(optionId: string) {
    if (!pollRef.value) return;

    // --- THIS IS THE FIX ---
    // Instead of using the 'db' variable from useFirestore(),
    // we get the instance directly from the document reference.
    const firestoreInstance = pollRef.value.firestore;

    // Now, run the transaction using that specific instance.
    await runTransaction(firestoreInstance, async (transaction) => {
      const pollDoc = await transaction.get(pollRef.value!);
      if (!pollDoc.exists()) throw "Poll does not exist!";

      const poll = pollDoc.data() as Poll;
      const newOptions = poll.options.map((o) =>
        o.id === optionId ? { ...o, votes: o.votes + 1 } : o,
      );
      const newTotalVotes = poll.totalVotes + 1;

      transaction.update(pollRef.value!, {
        options: newOptions,
        totalVotes: newTotalVotes,
      });
    });
  }

  return {
    pollData,
    pollsList,
    sortedOptions,
    createPoll,
    bindToPoll,
    addOption,
    deleteOption,
    updateOptionText,
    updateOptionsOrder,
    startVoting,
    castVote,
  };
});
