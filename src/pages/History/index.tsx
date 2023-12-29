import { useContext } from "react";
import { formatDistanceToNow } from "date-fns";
import { HistoryContainer, HistoryList, StatusWithBadge } from "./styles";
import { CyclesContext } from "../../context/CyclesContext";

export function History() {
  const { cycles } = useContext(CyclesContext);

  return (
    <HistoryContainer>
      <h1>My History</h1>

      <HistoryList>
        <table>
          <thead>
            <tr>
              <th>Task</th>
              <th>Duration</th>
              <th>Start</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {cycles.map((cycle) => {
              return (
                <tr key={cycle.id}>
                  <td>{cycle.task}</td>
                  <td>{cycle.minutesAmount} minutes</td>
                  <td>
                    {formatDistanceToNow(cycle.startDate, {
                      addSuffix: true,
                    })}
                  </td>
                  <td>
                    {cycle.finishedDate && (
                      <StatusWithBadge statusColor="green">
                        Complete
                      </StatusWithBadge>
                    )}
                    {cycle.interruptedDate && (
                      <StatusWithBadge statusColor="red">
                        Interrupeted
                      </StatusWithBadge>
                    )}
                    {!cycle.finishedDate && !cycle.interruptedDate && (
                      <StatusWithBadge statusColor="yellow">
                        In progress
                      </StatusWithBadge>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </HistoryList>
    </HistoryContainer>
  );
}
