import React, { useState, useEffect } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement,
  ArcElement,
  RadialLinearScale,
} from 'chart.js';
import { Bar, Line, Pie, Radar } from 'react-chartjs-2';
import { Download, Share2 } from 'lucide-react';
import * as XLSX from 'xlsx';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  RadialLinearScale,
  Title,
  Tooltip,
  Legend
);

interface DataVisualizerProps {
  data: any[];
}

type ChartType = 'bar' | 'line' | 'pie' | 'radar';

function DataVisualizer({ data }: DataVisualizerProps) {
  const [chartType, setChartType] = useState<ChartType>('bar');
  const [chartData, setChartData] = useState<any>(null);

  useEffect(() => {
    if (data.length > 0) {
      const numericColumns = Object.keys(data[0]).filter(key => 
        !isNaN(Number(data[0][key]))
      );
      
      const labels = data.map((_, index) => `Data Point ${index + 1}`);
      const datasets = numericColumns.map((column, index) => ({
        label: column,
        data: data.map(row => Number(row[column])),
        backgroundColor: `hsla(${index * 60}, 70%, 50%, 0.5)`,
        borderColor: `hsla(${index * 60}, 70%, 50%, 1)`,
        borderWidth: 1,
      }));

      setChartData({
        labels,
        datasets,
      });
    }
  }, [data]);

  const handleExport = () => {
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Data');
    XLSX.writeFile(wb, 'analytics_export.xlsx');
  };

  const handleShare = async () => {
    try {
      // Create a shareable object with the current state
      const shareableData = {
        data: data,
        chartType: chartType,
        timestamp: new Date().toISOString()
      };

      // Convert to JSON string
      const jsonStr = JSON.stringify(shareableData);
      
      // Create a Blob and generate a local URL
      const blob = new Blob([jsonStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      
      // Copy to clipboard
      await navigator.clipboard.writeText(url);
      alert('Share URL copied to clipboard! Note: This URL is temporary and will only work in this browser session.');
    } catch (error) {
      console.error('Error creating share URL:', error);
      alert('Failed to create share URL. Please try again.');
    }
  };

  if (data.length === 0) {
    return (
      <div className="bg-white p-8 rounded-lg shadow text-center">
        <p className="text-gray-600">
          Upload a CSV file to visualize your data
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900">Data Visualization</h2>
        <div className="flex gap-2">
          {['bar', 'line', 'pie', 'radar'].map((type) => (
            <button
              key={type}
              onClick={() => setChartType(type as ChartType)}
              className={`px-4 py-2 rounded ${
                chartType === type
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {chartData && (
        <div className="h-[400px]">
          {chartType === 'bar' && (
            <Bar
              data={chartData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: { position: 'top' },
                },
              }}
            />
          )}
          {chartType === 'line' && (
            <Line
              data={chartData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: { position: 'top' },
                },
              }}
            />
          )}
          {chartType === 'pie' && (
            <Pie
              data={chartData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: { position: 'top' },
                },
              }}
            />
          )}
          {chartType === 'radar' && (
            <Radar
              data={chartData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: { position: 'top' },
                },
              }}
            />
          )}
        </div>
      )}

      <div className="mt-6 flex justify-end gap-4 mb-6">
        <button
          onClick={handleShare}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
        >
          <Share2 className="w-4 h-4" />
          Share Report
        </button>
        <button
          onClick={handleExport}
          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          <Download className="w-4 h-4" />
          Export to Excel
        </button>
      </div>

      <div className="mt-6">
        <h3 className="text-lg font-semibold mb-4">Raw Data</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {Object.keys(data[0]).map((header) => (
                  <th
                    key={header}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {data.slice(0, 5).map((row, index) => (
                <tr key={index}>
                  {Object.values(row).map((value: any, cellIndex) => (
                    <td
                      key={cellIndex}
                      className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
                    >
                      {value}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
          {data.length > 5 && (
            <p className="text-sm text-gray-500 mt-2 text-center">
              Showing 5 of {data.length} rows
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default DataVisualizer;