import { ReactNode, createContext, useState } from "react";

interface CycleFormat {
  id: string;
  task: string;
  minutesAmount: number;
  startDate: Date;
  interruptedDate?: Date;
  finishedDate?: Date;
}

interface CreateNewTimerData {
  task: string;
  minutesAmount: number;
}

interface CyclesContextType {
  cycles: CycleFormat[];
  activeCycle: CycleFormat | undefined;
  activeCycleId: string | null;
  secondsPassed: number;
  markCurrentCycleAsFinished: () => void;
  markActiveCycleId: (id: string | null) => void;
  setAmountSecondsPassed: (seconds: number) => void;
  createNewTimer: (data: CreateNewTimerData) => void;
  interruptCycle: () => void;
}

export const CyclesContext = createContext({} as CyclesContextType);

interface CyclesContextProviderProps {
  children: ReactNode;
}

export function CyclesContextProvider({
  children,
}: CyclesContextProviderProps) {
  const [cycles, setCycles] = useState<CycleFormat[]>([]);
  const [activeCycleId, setActiveCycleId] = useState<string | null>(null);
  const [secondsPassed, setSecondsPassed] = useState(0);

  const activeCycle = cycles.find((cycle) => cycle.id === activeCycleId);

  function setAmountSecondsPassed(seconds: number) {
    setSecondsPassed(seconds);
  }

  function markCurrentCycleAsFinished() {
    setCycles((state) =>
      state.map((cycle) => {
        if (cycle.id === activeCycleId) {
          return { ...cycle, finishedDate: new Date() };
        }
        return cycle;
      }),
    );
  }

  function markActiveCycleId(id: string | null) {
    setActiveCycleId(id);
  }

  function createNewTimer(data: CreateNewTimerData) {
    const id = String(new Date().getTime());

    const newCycle: CycleFormat = {
      id,
      task: data.task,
      minutesAmount: data.minutesAmount,
      startDate: new Date(),
    };

    setCycles((state) => [...state, newCycle]);
    markActiveCycleId(id);
    setSecondsPassed(0);
  }

  function interruptCycle() {
    setCycles((state) =>
      state.map((cycle) => {
        if (cycle.id === activeCycleId) {
          return { ...cycle, interruptedDate: new Date() };
        }
        return cycle;
      }),
    );

    setActiveCycleId(null);
  }

  return (
    <CyclesContext.Provider
      value={{
        cycles,
        activeCycle,
        activeCycleId,
        markCurrentCycleAsFinished,
        markActiveCycleId,
        secondsPassed,
        setAmountSecondsPassed,
        createNewTimer,
        interruptCycle,
      }}
    >
      {children}
    </CyclesContext.Provider>
  );
}
