import { ref, computed } from "vue";
import { defineStore } from "pinia";
import { useRouter } from "vue-router";
import { useDocument, useFirestore, useCollection } from "vuefire";
import {
  collection,
  doc,
  setDoc,
  updateDoc,
  runTransaction,
  type DocumentReference,
} from "firebase/firestore";

export interface PollOption {
  id: string;
  text: string;
  votes: number;
}

export interface Poll {
  name: string;
  options: PollOption[];
  status: "configuring" | "voting" | "closed";
  totalVotes: number;
  closeCode: string; // Added a code to close the poll
}

export const usePollStore = defineStore("poll", () => {
  const db = useFirestore();
  const router = useRouter();
  const pollRef = ref<DocumentReference<Poll> | null>(null);
  const pollData = useDocument<Poll>(pollRef);
  const pollsCollection = collection(db, "polls");
  const pollsList = useCollection(pollsCollection);

  const sortedOptions = computed(() => {
    if (!pollData.value) return [];
    return [...pollData.value.options].sort((a, b) => b.votes - a.votes);
  });

  // --- CHANGE 2: Update createPoll to generate a closeCode ---
  async function createPoll(name: string) {
    if (!name.trim()) {
      alert("Please provide a name for the poll.");
      return;
    }

    // Generate a simple 6-character alphanumeric code
    const newCloseCode = Math.random()
      .toString(36)
      .substring(2, 8)
      .toUpperCase();

    const newPollRef = doc(collection(db, "polls"));
    await setDoc(newPollRef, {
      name: name.trim(),
      options: [],
      status: "configuring",
      totalVotes: 0,
      closeCode: newCloseCode, // Save the code on creation
    });
    router.push({ name: "manage-poll", params: { id: newPollRef.id } });
  }

  // --- CHANGE 3: Add a new action to close the poll using the code ---
  async function closePollWithCode(providedCode: string): Promise<boolean> {
    if (!pollRef.value || !pollData.value || !providedCode) {
      alert("Invalid request.");
      return false;
    }
    if (pollData.value.status !== "voting") {
      alert("This poll is not currently active for voting.");
      return false;
    }
    if (providedCode.trim().toUpperCase() === pollData.value.closeCode) {
      await updateDoc(pollRef.value, { status: "closed" });
      alert("Poll has been successfully closed.");
      return true;
    } else {
      alert("Incorrect closing code.");
      return false;
    }
  }

  // --- No changes to the functions below this line ---
  function bindToPoll(id: string) {
    pollRef.value = doc(db, "polls", id) as DocumentReference<Poll>;
  }

  async function updatePollName(newName: string) {
    if (!pollRef.value || !newName.trim()) return;
    await updateDoc(pollRef.value, { name: newName.trim() });
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

    const firestoreInstance = pollRef.value.firestore;
    await runTransaction(firestoreInstance, async (transaction) => {
      const pollDoc = await transaction.get(pollRef.value!);
      // This check now correctly prevents votes on 'configuring' or 'closed' polls
      if (!pollDoc.exists() || pollDoc.data().status !== "voting") {
        throw "Poll is not active for voting.";
      }

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
    updatePollName,
    updateOptionText,
    updateOptionsOrder,
    startVoting,
    closePollWithCode, // Expose the new action
    castVote,
  };
});
