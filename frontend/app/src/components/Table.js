'use client';
import { DataGrid } from '../../../node_modules/@mui/x-data-grid';



export function Table(props) {
  const rows = [
    { id: 1, col1: 'Hello', col2: 'World' },
    { id: 2, col1: 'Hi this is a table', col2: 'this table is cool' },
    { id: 3, col1: 'MUI', col2: 'is Amazing' },
  ];
  const columns = [
    { field: 'col1', headerName: 'Column 1', width: 150 },
    { field: 'col2', headerName: 'Column 2', width: 150 },
  ];
  return (
    <div style={{ height: 300, width: '100%' }}>
      <DataGrid rows={rows} columns={columns} />
    </div>
  );
}