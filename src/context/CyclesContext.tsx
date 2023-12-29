import {
  ReactNode,
  createContext,
  useState,
  useReducer,
  useEffect,
} from "react";
import { CycleFormat, cyclesReducer } from "../reducers/cycles/reducer";
import {
  addNewCycleAction,
  interruptCurrentCycleAction,
  markCurrentCycleAsFinishedAction,
} from "../reducers/cycles/actions";

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
  const [cyclesState, dispatch] = useReducer(
    cyclesReducer,
    {
      cycles: [],
      activeCycleId: null,
    },
    (initialState) => {
      const storedStateAsJSON = localStorage.getItem(
        "@pomodoro-timer:cycles-state-1.0.0",
      );

      if (storedStateAsJSON) {
        return JSON.parse(storedStateAsJSON);
      }

      return initialState;
    },
  );

  const [secondsPassed, setSecondsPassed] = useState(0);

  useEffect(() => {
    const stateJSON = JSON.stringify(cyclesState);

    localStorage.setItem("@pomodoro-timer:cycles-state-1.0.0", stateJSON);
  }, [cyclesState]);

  const { cycles, activeCycleId } = cyclesState;

  const activeCycle = cycles.find((cycle) => cycle.id === activeCycleId);

  function setAmountSecondsPassed(seconds: number) {
    setSecondsPassed(seconds);
  }

  function markCurrentCycleAsFinished() {
    dispatch(markCurrentCycleAsFinishedAction());
  }

  function createNewTimer(data: CreateNewTimerData) {
    const id = String(new Date().getTime());

    const newCycle: CycleFormat = {
      id,
      task: data.task,
      minutesAmount: data.minutesAmount,
      startDate: new Date(),
    };

    dispatch(addNewCycleAction(newCycle));
    setSecondsPassed(0);
  }

  function interruptCycle() {
    dispatch(interruptCurrentCycleAction());
  }

  return (
    <CyclesContext.Provider
      value={{
        cycles,
        activeCycle,
        activeCycleId,
        markCurrentCycleAsFinished,
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
