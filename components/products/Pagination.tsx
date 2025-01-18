import * as React from 'react';
import Pagination from '@mui/material/Pagination';

interface PaginationProps {
  count: number;
  page: number;
  onChange: (event: React.ChangeEvent<unknown>, value: number) => void;
}

export default function PaginationRounded({ count, page, onChange }: PaginationProps) {
  return (
    <Pagination 
      count={count} 
      page={page} 
      onChange={onChange}
      shape="rounded" 
      sx={{
        '& .MuiPaginationItem-root': {
          color: 'black',
          '&.Mui-selected': {
            backgroundColor: 'black',
            color: 'white',
            '&:hover': {
              backgroundColor: 'rgba(0, 0, 0, 0.8)',
            },
          },
          '&:hover': {
            backgroundColor: 'rgba(0, 0, 0, 0.1)',
          },
        },
      }}
    />
  );
}

