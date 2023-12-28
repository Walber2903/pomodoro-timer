import { HandPalm, Play } from "phosphor-react";
import { createContext, useState } from "react";
import { NewCycleForm } from "./NewCycleForm";
import { Countdown } from "./Countdown";

import * as zod from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  HomeContainer,
  StartCountdownButton,
  StopCountdownButton,
} from "./styles";
import { FormProvider, useForm } from "react-hook-form";

interface CycleFormat {
  id: string;
  task: string;
  minutesAmount: number;
  startDate: Date;
  interruptedDate?: Date;
  finishedDate?: Date;
}

interface CyclesContextType {
  activeCycle: CycleFormat | undefined;
  activeCycleId: string | null;
  secondsPassed: number;
  markCurrentCycleAsFinished: () => void;
  markActiveCycleId: (id: string | null) => void;
  setAmountSecondsPassed: (seconds: number) => void;
}

export const CyclesContext = createContext({} as CyclesContextType);

const newCycleFormValidationSchema = zod.object({
  task: zod.string().min(3, "Inform the task!"),
  minutesAmount: zod
    .number()
    .min(1, "The cycle must be a minimum of 5 minutes")
    .max(60, "The cycle must be a maximum of 60 minutes"),
});

type newCycleFormData = zod.infer<typeof newCycleFormValidationSchema>;

export function Home() {
  const [cycles, setCycles] = useState<CycleFormat[]>([]);
  const [activeCycleId, setActiveCycleId] = useState<string | null>(null);
  const [secondsPassed, setSecondsPassed] = useState(0);

  const newCycleForm = useForm<newCycleFormData>({
    resolver: zodResolver(newCycleFormValidationSchema),
    defaultValues: {
      task: "",
      minutesAmount: 0,
    },
  });

  const { handleSubmit, watch, reset } = newCycleForm;

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

  function handleCreateNewTimer(data: newCycleFormData) {
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

    reset();
  }

  function handleInterruptCycle() {
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

  const task = watch("task");
  const haveTaskToDisable = !task;
  const minutesToDisable = watch("minutesAmount");
  const haveMinutesToDisable = !minutesToDisable;

  return (
    <HomeContainer>
      <form onSubmit={handleSubmit(handleCreateNewTimer)} action="">
        <CyclesContext.Provider
          value={{
            activeCycle,
            activeCycleId,
            markCurrentCycleAsFinished,
            markActiveCycleId,
            secondsPassed,
            setAmountSecondsPassed,
          }}
        >
          <FormProvider {...newCycleForm}>
            <NewCycleForm />
          </FormProvider>
          <Countdown />
        </CyclesContext.Provider>

        {activeCycle ? (
          <StopCountdownButton onClick={handleInterruptCycle} type="button">
            <HandPalm size={24} />
            Finish
          </StopCountdownButton>
        ) : (
          <StartCountdownButton
            disabled={haveTaskToDisable || haveMinutesToDisable}
            type="submit"
          >
            <Play size={24} />
            Start
          </StartCountdownButton>
        )}
      </form>
    </HomeContainer>
  );
}
