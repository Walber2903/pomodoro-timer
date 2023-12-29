import { useContext, useEffect } from "react";
import { CountdownContainer, Separator } from "./styles";
import { differenceInSeconds } from "date-fns";
import { CyclesContext } from "../../../context/CyclesContext";

export function Countdown() {
  const {
    activeCycle,
    activeCycleId,
    markCurrentCycleAsFinished,
    secondsPassed,
    setAmountSecondsPassed,
  } = useContext(CyclesContext);

  const totalSeconds = activeCycle ? activeCycle.minutesAmount * 60 : 0;

  useEffect(() => {
    let interval: number;

    if (activeCycle) {
      interval = setInterval(() => {
        const differenceToCompleteCycle = differenceInSeconds(
          new Date(),
          activeCycle.startDate,
        );

        if (differenceToCompleteCycle >= totalSeconds) {
          markCurrentCycleAsFinished();
          setAmountSecondsPassed(totalSeconds);
          clearInterval(interval);
        } else {
          setAmountSecondsPassed(differenceToCompleteCycle);
        }
      }, 1000);
    }

    return () => {
      clearInterval(interval);
    };
  }, [
    activeCycle,
    totalSeconds,
    activeCycleId,
    markCurrentCycleAsFinished,
    setAmountSecondsPassed,
  ]);

  const currentSeconds = activeCycle ? totalSeconds - secondsPassed : 0;

  const minutesAmountToDisplay = Math.floor(currentSeconds / 60);
  const secondsAmountToDisplay = currentSeconds % 60;

  const minutes = String(minutesAmountToDisplay).padStart(2, "0");
  const seconds = String(secondsAmountToDisplay).padStart(2, "0");

  useEffect(() => {
    if (activeCycle) {
      document.title = `${minutes}:${seconds}`;
    }
  }, [minutes, seconds, activeCycle]);

  return (
    <CountdownContainer>
      <span>{minutes[0]}</span>
      <span>{minutes[1]}</span>
      <Separator>:</Separator>
      <span>{seconds[0]}</span>
      <span>{seconds[1]}</span>
    </CountdownContainer>
  );
}
