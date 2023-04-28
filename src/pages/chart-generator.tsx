import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useAtom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';
import { Button } from '@mantine/core';
import HighchartsReact from '@/lib/highcharts';
import { useRouter } from 'next/router';

type Data = {
  label: string;
  value: (string | number)[];
}[];

const chartDataAtom = atomWithStorage<Data>('chartData', [
  {
    label: 'N',
    value: [1.81, 1.78, 0.16, 0.0, 0.0, 0.0, 0.0],
  },
  {
    label: 'NNE',
    value: [0.62, 1.09, 0.0, 0.0, 0.0, 0.0, 0.0],
  },
  {
    label: 'NE',
    value: [0.82, 0.82, 0.07, 0.0, 0.0, 0.0, 0.0],
  },
  {
    label: 'ENE',
    value: [0.59, 1.22, 0.07, 0.0, 0.0, 0.0, 0.0],
  },
  {
    label: 'E',
    value: [0.62, 2.2, 0.49, 0.0, 0.0, 0.0, 0.0],
  },
  {
    label: 'ESE',
    value: [1.22, 2.01, 1.55, 0.3, 0.13, 0.0, 0],
  },
  {
    label: 'SE',
    value: [1.61, 3.06, 2.37, 2.14, 1.74, 0.39, 0.13],
  },
  {
    label: 'SSE',
    value: [2.04, 3.42, 1.97, 0.86, 0.53, 0.49, 0.0],
  },
  {
    label: 'S',
    value: [2.66, 4.74, 0.43, 0.0, 0.0, 0.0, 0.0],
  },
  {
    label: 'SSW',
    value: [2.96, 4.14, 0.26, 0.0, 0.0, 0.0, 0.0],
  },
  {
    label: 'SW',
    value: [2.53, 4.01, 1.22, 0.49, 0.13, 0.0, 0.0],
  },
  {
    label: 'WSW',
    value: [1.97, 2.66, 1.97, 0.79, 0.3, 0.0, 0],
  },
  {
    label: 'W',
    value: [1.64, 1.71, 0.92, 1.45, 0.26, 0.1, 0.0],
  },
  {
    label: 'WNW',
    value: [1.32, 2.4, 0.99, 1.61, 0.33, 0.0, 0.0],
  },
  {
    label: 'NW',
    value: [1.58, 4.28, 1.28, 0.76, 0.66, 0.69, 0.03],
  },
  {
    label: 'NNW',
    value: [1.51, 5.0, 1.32, 0.13, 0.23, 0.13, 0.07],
  },
]);

const chartOptionsAtom = {
  data: {
    table: 'freq',
    startRow: 1,
    endRow: 17,
    endColumn: 7,
  },
  chart: {
    styledMode: true,
    polar: true,
    type: 'column',
  },
  title: {
    text: 'Graph Title',
    align: 'left',
  },
  subtitle: {
    text: 'Source: trustmebro',
    align: 'left',
  },
  pane: {
    size: '85%',
  },
  legend: {
    align: 'right',
    verticalAlign: 'top',
    y: 100,
    layout: 'vertical',
  },
  xAxis: {
    tickmarkPlacement: 'on',
  },
  yAxis: {
    min: 0,
    endOnTick: false,
    showLastLabel: true,
    title: {
      text: 'Frequency (%)',
    },
    labels: {
      formatter: function () {
        // @ts-ignore
        return this.value + '%';
      },
    },
    reversedStacks: false,
  },
  tooltip: {
    valueSuffix: '%',
  },
  plotOptions: {
    series: {
      stacking: 'normal',
      shadow: false,
      groupPadding: 0,
      pointPlacement: 'on',
    },
  },
};

const rangeDataAtom = {
  0: {
    label: '< 0.5 m/s',
    color: '#7cb5ec',
  },
  1: {
    label: '0.5-2 m/s',
    color: '#f7a35c',
  },
  2: {
    label: '2-4 m/s',
    color: '#90ed7d',
  },
  3: {
    label: '4-6 m/s',
    color: '#7798bf',
  },
  4: {
    label: '6-8 m/s',
    color: '#aaeeee',
  },
  5: {
    label: '8-10 m/s',
    color: '#ff0066',
  },
  6: {
    label: '> 10 m/s',
    color: '#eeaaee',
  },
};

const ChartGenerator = () => {
  const [chartOptions, setChartOptions] = useState(chartOptionsAtom);
  const [chartData, setChartData] = useAtom(chartDataAtom);
  const [rangeData, setRangeData] = useState(rangeDataAtom);

  const chartComponentRef = useRef<any>(null);
  const [mounted, setMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleUpdateChart = () => {
    setIsLoading(true);
    setChartOptions((prev) => prev);
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  };

  const handleUpdateCell = (dataIdx, idx, val: string) => {
    let newValue = val;
    let updatedData = chartData;
    updatedData[dataIdx].value[idx] = Number(newValue);
    setChartData([...updatedData]);
  };

  const totalRange = useMemo(() => {
    return chartData.reduce((acc: number[], curr) => {
      curr.value.forEach((num, index) => {
        acc[index] = Number(Number((acc[index] || 0) + Number(num)).toFixed(2));
      });
      return acc;
    }, []);
  }, [chartData]);

  const EditableRange = ({ color, label, key }) => {
    return (
      <th role='button' style={{ backgroundColor: color }}>
        {label}
      </th>
    );
  };

  return (
    <div className='p-4'>
      <div className='mt-10 bg-white p-8 shadow rounded'>
        <div className='flex items-center justify-between'>
          <h1 className='text-2xl font-bold'>Nadhira Chart Generator</h1>
          <Button onClick={handleUpdateChart}>Update Chart</Button>
        </div>

        <div className='mt-4'>
          <pre className='p-2 bg-slate-50 text-sm'>
            <div>- Each table is editable</div>
            <div>- Each range color is customizable</div>
          </pre>
        </div>

        <hr className='my-6' />

        {mounted && (
          <section className='flex flex-col lg:flex-row gap-8'>
            {isLoading ? (
              <div className='animate-pulse flex-1 flex-shrink-0 h-[400px] bg-slate-200 rounded-lg'></div>
            ) : (
              <div className='flex-1 lg:basis-[52%] animate-show table-container'>
                <table id='freq' className='table'>
                  <tbody>
                    <tr>
                      <th colSpan={9} className='text-center'>
                        <div className='text-center'>Table of Frequencies (percent)</div>
                      </th>
                    </tr>

                    <tr>
                      <th>Direction</th>
                      {Object.entries(rangeData).map(([key, range]) => (
                        <EditableRange key={key} label={range.label} color={range.color} />
                      ))}
                      <th>
                        <div className='font-bold'>Total</div>
                      </th>
                    </tr>

                    {chartData.map((data, dataIdx) => {
                      const total = Number(data.value.reduce((prev, curr) => Number(prev) + Number(curr), 0)).toFixed(
                        2
                      );
                      return (
                        <tr key={data.label}>
                          <td>
                            <div className='pl-2 text-left font-medium'>{data.label}</div>
                          </td>

                          {data.value.map((value, idx) => {
                            return (
                              <EditableCell
                                key={idx}
                                value={value}
                                onChange={(val) => handleUpdateCell(dataIdx, idx, val)}
                              />
                            );
                          })}

                          <td className='text-center font-semibold'>{total}</td>
                        </tr>
                      );
                    })}

                    <tr>
                      <td className='font-bold'>
                        <div className='pl-2 text-left'>Total</div>
                      </td>

                      {totalRange.map((val, i) => (
                        <td key={i} className='text-center font-semibold'>
                          {val}
                        </td>
                      ))}

                      <td className='bg-gray-200'>&nbsp;</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}

            {isLoading ? (
              <div className='animate-pulse flex-1 bg-slate-200 h-[400px] rounded-lg'></div>
            ) : (
              <div className='flex-1 lg:basis-[48%] animate-show h-fit '>
                <div className='space-y-4 w-full'>
                  <div>
                    <label className='text-sm font-semibold'>Title</label>
                    <div>
                      <input
                        value={chartOptions.title.text}
                        onChange={(e) =>
                          setChartOptions((prev) => ({
                            ...prev,
                            title: {
                              ...prev.title,
                              text: e.target.value,
                            },
                          }))
                        }
                        className='text-mini border rounded px-2 py-1 w-full'
                      />
                    </div>
                  </div>

                  <div>
                    <label className='text-sm font-semibold'>Subtitle</label>
                    <textarea
                      value={chartOptions.subtitle.text}
                      onChange={(e) =>
                        setChartOptions((prev) => ({
                          ...prev,
                          subtitle: {
                            ...prev.subtitle,
                            text: e.target.value,
                          },
                        }))
                      }
                      className='text-mini border rounded px-2 py-1 w-full'
                    />
                  </div>
                </div>

                <div className='mt-4 bg-slate-200 p-2'>
                  <div className='p-4 bg-white'>
                    <HighchartsReact options={chartOptions} ref={chartComponentRef} />
                  </div>
                </div>
              </div>
            )}
          </section>
        )}
      </div>
    </div>
  );
};

const EditableCell = ({ value, onChange }) => {
  const [isEdit, setIsEdit] = useState(false);

  const handleToggle = () => {
    if (isEdit) return;
    setIsEdit(true);
  };

  const handleInput = (e) => {
    let start = e.target.selectionStart;
    let val = e.target.value;

    let newValue = val;

    val = val.replace(/([^0-9.]+)/, '');
    val = val.replace(/^(0|\.)/, '');
    const match = /(\d{0,7})[^.]*((?:\.\d{0,2})?)/g.exec(val);
    const value = Number(match?.[1]) + Number(match?.[2]);
    e.target.value = value;
    newValue = value;

    if (val.length > 0) {
      e.target.value = Number(value).toFixed(2);
      e.target.setSelectionRange(start, start);
      newValue = Number(value).toFixed(2);
    }

    onChange(newValue);
  };

  return (
    <td className='editable td-data text-center cursor-text' onClick={handleToggle}>
      {isEdit ? (
        <input autoFocus value={value} onChange={handleInput} className='h-[90%] w-[90%] m-1 text-center' />
      ) : (
        value
      )}
    </td>
  );
};

export default ChartGenerator;
