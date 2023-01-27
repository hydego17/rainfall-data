import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { Button } from '@mantine/core';
import { http } from '@/lib/http';

function download(payload: any) {
  return http.post('https://dataonline.bmkg.go.id/data_iklim/download', payload);
}

const useDownloadData = () => {
  return useMutation(download);
};

export default function Home() {
  const [response, setResponse] = useState<any>(null);

  const [form, setForm] = useState({
    ['station-name']: 'Stasiun Meteorologi Aji Pangeran Tumenggung Pranoto',
    ['from']: '01-01-2021',
    ['to']: '31-01-2021',
    ['parameter[]']: 'rainfall',
    ['type']: 'mkg',
    ['format']: 'xls',
  });

  const downloadData = useDownloadData();

  const handleCheckData = async () => {
    setResponse(null);

    let formData = new FormData();

    Object.entries(form).forEach(([key, value]) => {
      formData.set(key, value);
    });

    await downloadData.mutateAsync(formData).then((res) => {
      console.log(res.data);
      let resp = res.data;

      var downloadLink = window.document.createElement('a');
      downloadLink.href = window.URL.createObjectURL(new Blob([resp]));
      downloadLink.download = 'test.xlsx';
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
    });
  };

  const isLoading = downloadData.isLoading;

  return (
    <main className='py-8 container'>
      <h1 className='text-4xl'>Data BMKG</h1>

      <div className='border p-4'>
        <Button onClick={handleCheckData} loading={isLoading}>
          Check
        </Button>
      </div>
    </main>
  );
}
