import React, { useState } from 'react';
import { UploadCloud, CheckCircle2, AlertCircle, FileSpreadsheet } from 'lucide-react';

export const DataUpload: React.FC = () => {
  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile.name.endsWith('.xlsx') || droppedFile.name.endsWith('.xls') || droppedFile.name.endsWith('.csv')) {
        setFile(droppedFile);
        setUploadStatus('idle');
      } else {
        alert('Por favor, envie apenas arquivos de planilha (.xlsx, .xls, .csv).');
      }
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      setUploadStatus('idle');
    }
  };

  const startUpload = () => {
    if (!file) return;
    
    // Simulando processo de processamento dos dados
    setTimeout(() => {
      setUploadStatus('success');
    }, 1500);
  };

  return (
    <div className="flex-grow overflow-hidden p-5 bg-[#F8F9FA] flex flex-col h-full max-h-screen">
      <header className="mb-6 shrink-0">
        <h1 className="text-3xl font-bold text-gray-800">Envio de Dados</h1>
        <p className="text-sm text-gray-500 mt-1">
          Importe as planilhas consolidadas do ERP para alimentar o dashboard automaticamente.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 flex-grow overflow-y-auto pr-1">
        {/* Bloco de Drag and Drop (Span 2) */}
        <div className="md:col-span-2 bg-white rounded-3xl border border-gray-100 card-shadow p-6 flex flex-col h-fit">
          <div className="flex items-center gap-2 mb-6 border-b border-gray-50 pb-4">
            <UploadCloud className="w-6 h-6 text-pink-700" />
            <h2 className="text-lg font-bold text-gray-800 font-sans">Carregar Planilha ERP</h2>
          </div>

          {/* Área Drag & Drop */}
          <div
            onDragEnter={handleDrag}
            onDragOver={handleDrag}
            onDragLeave={handleDrag}
            onDrop={handleDrop}
            className={`w-full min-h-[220px] rounded-2xl border-2 border-dashed flex flex-col items-center justify-center p-8 text-center transition-all duration-300 relative select-none ${
              dragActive
                ? 'border-pink-500 bg-pink-50/30'
                : file
                ? 'border-green-500 bg-green-50/10'
                : 'border-gray-200 hover:border-pink-300 hover:bg-pink-50/10'
            }`}
          >
            <input
              type="file"
              onChange={handleFileInput}
              accept=".xlsx, .xls, .csv"
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
            />
            
            {file ? (
              <div className="flex flex-col items-center z-10">
                <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center text-green-600 mb-4 shadow-sm">
                  <FileSpreadsheet className="w-7 h-7" />
                </div>
                <h3 className="text-sm font-bold text-gray-800">{file.name}</h3>
                <p className="text-xs text-gray-400 mt-1">
                  {(file.size / 1024).toFixed(1)} KB
                </p>
                
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setFile(null);
                    setUploadStatus('idle');
                  }}
                  className="mt-3 text-xs text-red-500 hover:underline cursor-pointer z-30 font-medium"
                >
                  Remover arquivo
                </button>
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <div className="w-14 h-14 bg-pink-100 rounded-full flex items-center justify-center text-pink-700 mb-4 shadow-sm">
                  <UploadCloud className="w-7 h-7" />
                </div>
                <h3 className="text-sm font-bold text-gray-800">Arraste seu arquivo aqui</h3>
                <p className="text-xs text-gray-400 mt-1">
                  ou clique para selecionar do computador
                </p>
                <span className="text-[10px] text-gray-300 mt-4 block">
                  Formatos aceitos: Microsoft Excel (.xlsx, .xls) ou Comma Separated Values (.csv)
                </span>
              </div>
            )}
          </div>

          {file && uploadStatus === 'idle' && (
            <button
              onClick={startUpload}
              className="w-full mt-6 py-3 bg-pink-700 text-white font-bold rounded-xl shadow-md hover:scale-102 transition-transform duration-200 cursor-pointer text-sm"
            >
              Processar Dados da Planilha
            </button>
          )}

          {/* Feedbacks de Status */}
          {uploadStatus === 'success' && (
            <div className="mt-6 p-4 bg-green-50 border border-green-100 rounded-xl flex items-center gap-3">
              <CheckCircle2 className="w-6 h-6 text-green-500 shrink-0" />
              <div>
                <h4 className="text-xs font-bold text-green-800 uppercase">Processamento concluído!</h4>
                <p className="text-xs text-green-700 mt-0.5">
                  Os dados foram auditados e integrados com sucesso no banco de dados. Os gráficos do dashboard já foram atualizados.
                </p>
              </div>
            </div>
          )}

          {uploadStatus === 'error' && (
            <div className="mt-6 p-4 bg-red-50 border border-red-100 rounded-xl flex items-center gap-3">
              <AlertCircle className="w-6 h-6 text-red-500 shrink-0" />
              <div>
                <h4 className="text-xs font-bold text-red-800 uppercase">Erro na importação</h4>
                <p className="text-xs text-red-700 mt-0.5">
                  Não foi possível ler as colunas "Beneficiários PF". Verifique se o arquivo segue o layout correto e envie novamente.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Informações Auxiliares */}
        <div className="bg-white rounded-3xl border border-gray-100 card-shadow p-6 h-fit">
          <h2 className="text-md font-bold text-gray-800 mb-3 border-b border-gray-50 pb-2">Instruções</h2>
          <ul className="space-y-3 text-xs text-gray-500 list-disc pl-4 leading-relaxed font-sans">
            <li>Exporte a planilha de "Beneficiários por Categoria" no ERP da cooperativa.</li>
            <li>Certifique-se de que a planilha possui as abas com os nomes <b>"PF"</b> e <b>"PJ"</b>.</li>
            <li>O tamanho limite para envio de arquivos é de <b>15MB</b>.</li>
            <li>Evite enviar planilhas com fórmulas abertas ou referências externas.</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default DataUpload;
