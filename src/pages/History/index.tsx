import { useContext } from "react";
import { HistoryContainer, HistoryList, StatusWithBadge } from "./styles";
import { CyclesContext } from "../../context/CyclesContext";

export function History() {
  const { cycles } = useContext(CyclesContext);

  return (
    <HistoryContainer>
      <h1>My History</h1>

      <pre>{JSON.stringify(cycles, null, 2)}</pre>

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
            <tr>
              <td>Task 1</td>
              <td>20 minutes</td>
              <td>Two months ago</td>
              <td>
                <StatusWithBadge statusColor="green">Complete</StatusWithBadge>
              </td>
            </tr>
            <tr>
              <td>Task 1</td>
              <td>20 minutes</td>
              <td>Two months ago</td>
              <td>
                <StatusWithBadge statusColor="red">Stoped</StatusWithBadge>
              </td>
            </tr>
            <tr>
              <td>Task 1</td>
              <td>20 minutes</td>
              <td>Two months ago</td>
              <td>
                <StatusWithBadge statusColor="yellow">
                  In Progress
                </StatusWithBadge>
              </td>
            </tr>
            <tr>
              <td>Task 1</td>
              <td>20 minutes</td>
              <td>Two months ago</td>
              <td>
                <StatusWithBadge statusColor="green">Complete</StatusWithBadge>
              </td>
            </tr>
          </tbody>
        </table>
      </HistoryList>
    </HistoryContainer>
  );
}
