import { create } from "zustand";

export const controllerStore = create((set) => ({
//   textRandomList: ["Alex", "Jon", "Doe", "Jane","Alice", "Bob", "Charlie"],
//   textRandomListColorBase: ["#009925", "#D61024", "#EEB212", "#3369E8","#009925", "#D61024", "#EEB212"],
  textRandomList: [],
  spining: false,
  duration: 10,
  setDuration: (duration) => set({ duration }),
  setSpining: (spining) => set({ spining }),
  textRandomListColorBase: [],
  setTextRandomList: (textRandomList) => {
    set({ textRandomList }),
      //set textRandomListColorBase not random but index 0 1 2 3 from listColors by step by step
      set((state) => {
        const textRandomListColorBase = textRandomList.map((_, i) => {
          return listColors[i % listColors.length];
        });
        return { textRandomListColorBase };
      });
  },
}));

const listColors = ["#009925", "#D61024", "#EEB212", "#3369E8"];
