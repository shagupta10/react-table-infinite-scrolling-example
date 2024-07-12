import * as React from 'react';
import { CssBaseline } from '@mui/material';
import Table from './Table';
import makeData from './makeData';

export default function App() {
  const columns = React.useMemo(
    () => [
      {
        Header: 'Name',
        columns: [
          {
            Header: 'First Name',
            accessor: 'firstName',
          },
          {
            Header: 'Last Name',
            accessor: 'lastName',
          },
        ],
      },
      {
        Header: 'Info',
        columns: [
          {
            Header: 'Age',
            accessor: 'age',
          },
          {
            Header: 'Visits',
            accessor: 'visits',
          },
          {
            Header: 'Status',
            accessor: 'status',
          },
        ],
      },
    ],
    []
  );

  const [data, setData] = React.useState(makeData(50));
  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
  const loadNextPage = () =>
    sleep(1000).then(() => setData(data.concat(makeData(50))));

  const memoizedData = React.useMemo(() => data, [data]);
  return (
    <div>
      <CssBaseline />
      <Table
        columns={columns}
        data={memoizedData}
        loadNextPage={loadNextPage}
      />
    </div>
  );
}
