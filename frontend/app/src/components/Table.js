'use client';
import { DataGrid } from '../../../node_modules/@mui/x-data-grid';

import styles from './styles/Table.module.css'


export function Table(props) {
  const rows = props.rows
  const columns = props.columns
  return (
    <div className={styles.Table}>
      <DataGrid rows={rows} columns={columns} />
    </div>
  );
}