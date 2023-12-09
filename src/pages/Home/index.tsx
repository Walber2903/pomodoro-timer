import { Play } from "phosphor-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as zod from "zod";

import {
  CountdownContainer,
  FormContainer,
  HomeContainer,
  MinuteAmountInput,
  Separator,
  StartCountdownButton,
  TaskInput,
} from "./styles";

const newCycleFormValidationSchema = zod.object({
  task: zod.string().min(3, "Inform the task!"),
  minutesAmount: zod
    .number()
    .min(5, "The cycle must be a minimum of 60 minutes")
    .max(60, "The cycle must be a maximum of 60 minutes"),
});

interface newCycleFormData {
  task: string;
  minutesAmount: number;
}

export function Home() {
  const { register, handleSubmit, watch } = useForm<newCycleFormData>({
    resolver: zodResolver(newCycleFormValidationSchema),
    defaultValues: {
      task: "",
      minutesAmount: 0,
    },
  });

  function handleCreateNewTimer(data: newCycleFormData) {
    console.log(data);
  }

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
            min={5}
            max={60}
            {...register("minutesAmount", { valueAsNumber: true })}
          />

          <span>minute(s).</span>
        </FormContainer>

        <CountdownContainer>
          <span>0</span>
          <span>0</span>
          <Separator>:</Separator>
          <span>0</span>
          <span>0</span>
        </CountdownContainer>

        <StartCountdownButton
          disabled={haveTaskToDisable || haveMinutesToDisable}
          type="submit"
        >
          <Play size={24} />
          Start
        </StartCountdownButton>
      </form>
    </HomeContainer>
  );
}
