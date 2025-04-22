import React, { useState } from 'react';
import { BarChart3, Upload } from 'lucide-react';
import DataVisualizer from './components/DataVisualizer';
import FileUploader from './components/FileUploader';
import Sidebar from './components/Sidebar';

function App() {
  const [activeTab, setActiveTab] = useState('visualize');
  const [data, setData] = useState<any[]>([]);

  const handleDataUpload = (newData: any[]) => {
    setData(newData);
    setActiveTab('visualize');
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main className="flex-1 p-8">
        <div className="max-w-7xl mx-auto">
          {activeTab === 'visualize' && (
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-8 flex items-center gap-2">
                <BarChart3 className="w-8 h-8 text-indigo-600" />
                Data Visualization
              </h1>
              <DataVisualizer data={data} />
            </div>
          )}

          {activeTab === 'upload' && (
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-8 flex items-center gap-2">
                <Upload className="w-8 h-8 text-indigo-600" />
                Upload Data
              </h1>
              <FileUploader onDataUpload={handleDataUpload} />
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;