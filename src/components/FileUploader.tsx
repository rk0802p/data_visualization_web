import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload } from 'lucide-react';

interface FileUploaderProps {
  onDataUpload: (data: any[]) => void;
}

function FileUploader({ onDataUpload }: FileUploaderProps) {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    const reader = new FileReader();

    reader.onload = (event) => {
      try {
        const csvData = event.target?.result as string;
        const rows = csvData.split('\n');
        const headers = rows[0].split(',');
        
        const parsedData = rows.slice(1).map(row => {
          const values = row.split(',');
          return headers.reduce((obj: any, header, index) => {
            obj[header.trim()] = values[index]?.trim();
            return obj;
          }, {});
        });

        onDataUpload(parsedData);
      } catch (error) {
        console.error('Error parsing CSV:', error);
      }
    };

    reader.readAsText(file);
  }, [onDataUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv']
    },
    multiple: false
  });

  return (
    <div className="max-w-2xl mx-auto">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-colors
          ${isDragActive ? 'border-indigo-500 bg-indigo-50' : 'border-gray-300 hover:border-indigo-400'}`}
      >
        <input {...getInputProps()} />
        <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
        {isDragActive ? (
          <p className="text-lg text-gray-600">Drop your CSV file here</p>
        ) : (
          <div>
            <p className="text-lg text-gray-600 mb-2">
              Drag & drop your CSV file here, or click to select
            </p>
            <p className="text-sm text-gray-500">
              Only CSV files are supported
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default FileUploader;