import { FormContainer, MinuteAmountInput, TaskInput } from "./styles";
import { useContext } from "react";
import { CyclesContext } from "../../../context/CyclesContext";
import { useFormContext } from "react-hook-form";

export function NewCycleForm() {
  const { activeCycle } = useContext(CyclesContext);
  const { register } = useFormContext();

  return (
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
  );
}
