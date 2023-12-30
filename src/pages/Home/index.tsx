import { HandPalm, Play } from "phosphor-react";
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
import { useContext } from "react";
import { CyclesContext } from "../../context/CyclesContext";

const newCycleFormValidationSchema = zod.object({
  task: zod.string().min(3, "Inform the task!"),
  minutesAmount: zod
    .number()
    .min(5, "The cycle must be a minimum of 5 minutes")
    .max(60, "The cycle must be a maximum of 60 minutes"),
});

type newCycleFormData = zod.infer<typeof newCycleFormValidationSchema>;

export function Home() {
  const { activeCycle, createNewTimer, interruptCycle } =
    useContext(CyclesContext);

  const newCycleForm = useForm<newCycleFormData>({
    resolver: zodResolver(newCycleFormValidationSchema),
    defaultValues: {
      task: "",
      minutesAmount: 0,
    },
  });

  const { handleSubmit, watch, reset } = newCycleForm;

  function handleCreateNewCycle(data: newCycleFormData) {
    createNewTimer(data);
    reset();
  }

  const task = watch("task");
  const haveTaskToDisable = !task;
  const minutesToDisable = watch("minutesAmount");
  const haveMinutesToDisable = !minutesToDisable;

  return (
    <HomeContainer>
      <form onSubmit={handleSubmit(handleCreateNewCycle)} action="">
        <FormProvider {...newCycleForm}>
          <NewCycleForm />
        </FormProvider>
        <Countdown />

        {activeCycle ? (
          <StopCountdownButton onClick={interruptCycle} type="button">
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
