import { HandPalm, Play } from "phosphor-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { differenceInSeconds } from "date-fns";
import * as zod from "zod";

import {
  CountdownContainer,
  FormContainer,
  HomeContainer,
  MinuteAmountInput,
  Separator,
  StartCountdownButton,
  StopCountdownButton,
  TaskInput,
} from "./styles";

const newCycleFormValidationSchema = zod.object({
  task: zod.string().min(3, "Inform the task!"),
  minutesAmount: zod
    .number()
    .min(1, "The cycle must be a minimum of 5 minutes")
    .max(60, "The cycle must be a maximum of 60 minutes"),
});

type newCycleFormData = zod.infer<typeof newCycleFormValidationSchema>;

interface CycleFormat {
  id: string;
  task: string;
  minutesAmount: number;
  startDate: Date;
  interruptedDate?: Date;
  finishedDate?: Date;
}

export function Home() {
  const [cycles, setCycles] = useState<CycleFormat[]>([]);
  const [activeCycleId, setActiveCycleId] = useState<string | null>(null);
  const [secondsPassed, setSecondsPassed] = useState(0);

  const { register, handleSubmit, watch, reset } = useForm<newCycleFormData>({
    resolver: zodResolver(newCycleFormValidationSchema),
    defaultValues: {
      task: "",
      minutesAmount: 0,
    },
  });

  const activeCycle = cycles.find((cycle) => cycle.id === activeCycleId);

  const totalSeconds = activeCycle ? activeCycle.minutesAmount * 60 : 0;
  const currentSeconds = activeCycle ? totalSeconds - secondsPassed : 0;

  const minutesAmountToDisplay = Math.floor(currentSeconds / 60);
  const secondsAmountToDisplay = currentSeconds % 60;

  const minutes = String(minutesAmountToDisplay).padStart(2, "0");
  const seconds = String(secondsAmountToDisplay).padStart(2, "0");

  useEffect(() => {
    let interval: number;

    if (activeCycle) {
      interval = setInterval(() => {
        const differenceToCompleteCycle = differenceInSeconds(
          new Date(),
          activeCycle.startDate,
        );

        if (differenceToCompleteCycle >= totalSeconds) {
          setCycles((state) =>
            state.map((cycle) => {
              if (cycle.id === activeCycleId) {
                return { ...cycle, finishedDate: new Date() };
              }
              return cycle;
            }),
          );
          setSecondsPassed(totalSeconds);
          clearInterval(interval);
          setActiveCycleId(null);
        } else {
          setSecondsPassed(differenceToCompleteCycle);
        }
      }, 1000);
    }

    return () => {
      clearInterval(interval);
    };
  }, [activeCycle, totalSeconds, activeCycleId]);

  function handleCreateNewTimer(data: newCycleFormData) {
    const id = String(new Date().getTime());

    const newCycle: CycleFormat = {
      id,
      task: data.task,
      minutesAmount: data.minutesAmount,
      startDate: new Date(),
    };

    setCycles((state) => [...state, newCycle]);
    setActiveCycleId(id);
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

  useEffect(() => {
    if (activeCycle) {
      document.title = `${minutes}:${seconds}`;
    }
  }, [minutes, seconds, activeCycle]);

  const task = watch("task");
  const haveTaskToDisable = !task;
  const minutesToDisable = watch("minutesAmount");
  const haveMinutesToDisable = !minutesToDisable;

  return (
    <HomeContainer>
      <form onSubmit={handleSubmit(handleCreateNewTimer)} action="">
        <FormContainer>
          <label htmlFor="task">I will work on</label>
          <TaskInput
            id="task"
            list="task-suggestions"
            placeholder="Give your project a name"
            disabled={!!activeCycle}
            {...register("task")}
          />

          <datalist id="task-suggestions">
            <option value="Project one" />
            <option value="Project two" />
            <option value="Project three" />
            <option value="Project four" />
          </datalist>

          <label htmlFor="minutesAmount">during</label>
          <MinuteAmountInput
            type="number"
            id="minutesAmount"
            placeholder="00"
            step={5}
            min={1}
            max={60}
            disabled={!!activeCycle}
            {...register("minutesAmount", { valueAsNumber: true })}
          />

          <span>minute(s).</span>
        </FormContainer>

        <CountdownContainer>
          <span>{minutes[0]}</span>
          <span>{minutes[1]}</span>
          <Separator>:</Separator>
          <span>{seconds[0]}</span>
          <span>{seconds[1]}</span>
        </CountdownContainer>

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
