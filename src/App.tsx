import { useState, useEffect } from 'react';
import './App.css';

interface QuadraticRecord {
  id: string;
  a: number;
  b: number;
  c: number;
  x1?: number;
  x2?: number;
  solutionType: string;
  solvedAt: string;
  note?: string;
}

interface Solution {
  x1?: number;
  x2?: number;
  message: string;
  type: 'success' | 'error' | 'info';
  solutionType: string;
}

// Google Apps Script URL - project mới GPTB2 với code fix CORS
const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxR-WOi8nIVCKO4iCYX2IRcG29wGcchKWrNsaI-fnM31i9LBDt23x-t0qjzM2-qRQfWmQ/exec';
const USE_GOOGLE_SHEETS = true; // Đặt true để sử dụng Google Sheets

function App() {
  const [a, setA] = useState<string>('');
  const [b, setB] = useState<string>('');
  const [c, setC] = useState<string>('');
  const [note, setNote] = useState<string>('');
  const [solution, setSolution] = useState<Solution | null>(null);
  const [records, setRecords] = useState<QuadraticRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'solver' | 'history'>('solver');

  // Giải phương trình bậc 2
  const solveQuadratic = (numA: number, numB: number, numC: number): Solution => {
    if (numA === 0) {
      if (numB === 0) {
        if (numC === 0) {
          return {
            message: 'Phương trình có vô số nghiệm',
            type: 'info',
            solutionType: 'infinite'
          };
        } else {
          return {
            message: 'Phương trình vô nghiệm',
            type: 'error',
            solutionType: 'none'
          };
        }
      } else {
        const x = -numC / numB;
        return {
          x1: x,
          message: `Phương trình bậc nhất có nghiệm: x = ${x.toFixed(4)}`,
          type: 'success',
          solutionType: 'linear'
        };
      }
    }

    const delta = numB * numB - 4 * numA * numC;

    if (delta < 0) {
      return {
        message: 'Phương trình vô nghiệm (Δ < 0)',
        type: 'error',
        solutionType: 'none'
      };
    } else if (delta === 0) {
      const x = -numB / (2 * numA);
      return {
        x1: x,
        message: `Phương trình có nghiệm kép: x = ${x.toFixed(4)}`,
        type: 'success',
        solutionType: 'double'
      };
    } else {
      const x1 = (-numB + Math.sqrt(delta)) / (2 * numA);
      const x2 = (-numB - Math.sqrt(delta)) / (2 * numA);
      return {
        x1,
        x2,
        message: `Phương trình có 2 nghiệm phân biệt:`,
        type: 'success',
        solutionType: 'distinct'
      };
    }
  };

  // Xử lý giải phương trình và lưu
  const handleSolve = async () => {
    const numA = parseFloat(a);
    const numB = parseFloat(b);
    const numC = parseFloat(c);

    if (isNaN(numA) || isNaN(numB) || isNaN(numC)) {
      setSolution({
        message: 'Vui lòng nhập các số hợp lệ!',
        type: 'error',
        solutionType: 'error'
      });
      return;
    }

    const result = solveQuadratic(numA, numB, numC);
    setSolution(result);

    // Lưu vào Google Sheets
    if (result.type === 'success' || result.type === 'info') {
      await saveToGoogleSheets({
        a: numA,
        b: numB,
        c: numC,
        x1: result.x1,
        x2: result.x2,
        solutionType: result.solutionType,
        note: note.trim()
      });
    }
  };

  // Lưu vào Google Sheets hoặc localStorage
  const saveToGoogleSheets = async (data: Omit<QuadraticRecord, 'id' | 'solvedAt'>) => {
    try {
      setLoading(true);
      
      if (USE_GOOGLE_SHEETS) {
        // Tạo data object thay vì FormData để fix CORS
        const postData = {
          action: 'add',
          a: data.a.toString(),
          b: data.b.toString(),
          c: data.c.toString(),
          x1: data.x1?.toString() || '',
          x2: data.x2?.toString() || '',
          solutionType: data.solutionType,
          solvedAt: new Date().toLocaleString('vi-VN'),
          note: data.note || ''
        };
        
        const response = await fetch(GOOGLE_SCRIPT_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'text/plain;charset=utf-8',
          },
          body: JSON.stringify(postData)
        });
        
        const responseText = await response.text();
        
        try {
          const result = JSON.parse(responseText);
          
          if (result.success) {
            await loadRecords();
            console.log('Đã lưu thành công vào Google Sheets!');
          } else {
            console.error('Lưu thất bại:', result.error);
          }
        } catch (parseError) {
          console.error('Không parse được JSON:', parseError);
        }
      } else {
        // Lưu vào localStorage
        const newRecord: QuadraticRecord = {
          id: Date.now().toString(),
          ...data,
          solvedAt: new Date().toLocaleString('vi-VN')
        };
        
        const existingRecords = JSON.parse(localStorage.getItem('quadraticRecords') || '[]');
        existingRecords.push(newRecord);
        localStorage.setItem('quadraticRecords', JSON.stringify(existingRecords));
        
        await loadRecords();
      }
    } catch (error) {
      console.error('Error saving:', error);
    } finally {
      setLoading(false);
    }
  };

  // Tải danh sách records
  const loadRecords = async () => {
    try {
      setLoading(true);
      
      if (USE_GOOGLE_SHEETS) {
        const response = await fetch(GOOGLE_SCRIPT_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'text/plain;charset=utf-8',
          },
          body: JSON.stringify({ action: 'getAll' })
        });
        const result = await response.json();
        
        if (result.success) {
          setRecords(result.data || []);
        } else {
          console.error('Error loading records:', result.error);
        }
      } else {
        // Load từ localStorage
        const existingRecords = JSON.parse(localStorage.getItem('quadraticRecords') || '[]');
        setRecords(existingRecords);
      }
    } catch (error) {
      console.error('Error loading records:', error);
    } finally {
      setLoading(false);
    }
  };

  // Xóa record
  const deleteRecord = async (id: string) => {
    try {
      setLoading(true);
      const response = await fetch(`${GOOGLE_SCRIPT_URL}?action=delete&id=${id}`);
      const result = await response.json();
      
      if (result.success) {
        await loadRecords();
      } else {
        console.error('Error deleting record:', result.error);
      }
    } catch (error) {
      console.error('Error deleting record:', error);
    } finally {
      setLoading(false);
    }
  };

  // Reset form
  const reset = () => {
    setA('');
    setB('');
    setC('');
    setNote('');
    setSolution(null);
  };

  // Load records khi component mount
  useEffect(() => {
    loadRecords();
  }, []);

  return (
    <div className="app">
      <div className="container">
        <h1>🧮 Quản lý Phương Trình Bậc 2</h1>
        
        {/* Tab Navigation */}
        <div className="tabs">
          <button 
            className={`tab ${activeTab === 'solver' ? 'active' : ''}`}
            onClick={() => setActiveTab('solver')}
          >
            Giải Phương Trình
          </button>
          <button 
            className={`tab ${activeTab === 'history' ? 'active' : ''}`}
            onClick={() => setActiveTab('history')}
          >
            Lịch Sử ({records.length})
          </button>
        </div>

        {/* Solver Tab */}
        {activeTab === 'solver' && (
          <div className="solver-section">
            <p className="subtitle">ax² + bx + c = 0</p>
            
            <div className="form">
              <div className="input-row">
                <div className="input-group">
                  <label htmlFor="a">Hệ số a:</label>
                  <input
                    id="a"
                    type="number"
                    value={a}
                    onChange={(e) => setA(e.target.value)}
                    placeholder="Nhập a"
                    step="any"
                  />
                </div>
                
                <div className="input-group">
                  <label htmlFor="b">Hệ số b:</label>
                  <input
                    id="b"
                    type="number"
                    value={b}
                    onChange={(e) => setB(e.target.value)}
                    placeholder="Nhập b"
                    step="any"
                  />
                </div>
                
                <div className="input-group">
                  <label htmlFor="c">Hệ số c:</label>
                  <input
                    id="c"
                    type="number"
                    value={c}
                    onChange={(e) => setC(e.target.value)}
                    placeholder="Nhập c"
                    step="any"
                  />
                </div>
              </div>

              <div className="input-group">
                <label htmlFor="note">Ghi chú (tùy chọn):</label>
                <input
                  id="note"
                  type="text"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Ví dụ: Bài tập 1, Đề thi cuối kỳ..."
                />
              </div>
              
              <div className="buttons">
                <button onClick={handleSolve} className="solve-btn" disabled={loading}>
                  {loading ? 'Đang xử lý...' : 'Giải & Lưu'}
                </button>
                <button onClick={reset} className="reset-btn">
                  Làm Mới
                </button>
              </div>
            </div>

            {solution && (
              <div className={`result ${solution.type}`}>
                <h3>Kết Quả:</h3>
                <p>{solution.message}</p>
                {solution.x1 !== undefined && solution.x2 !== undefined && (
                  <div className="solutions">
                    <p>x₁ = {solution.x1.toFixed(4)}</p>
                    <p>x₂ = {solution.x2.toFixed(4)}</p>
                  </div>
                )}
                {solution.x1 !== undefined && solution.x2 === undefined && (
                  <div className="solutions">
                    <p>x = {solution.x1.toFixed(4)}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* History Tab */}
        {activeTab === 'history' && (
          <div className="history-section">
            <div className="history-header">
              <h3>Lịch Sử Giải Phương Trình</h3>
              <button onClick={loadRecords} className="refresh-btn" disabled={loading}>
                {loading ? 'Đang tải...' : '🔄 Tải lại'}
              </button>
            </div>

            {records.length === 0 ? (
              <div className="empty-state">
                <p>Chưa có phương trình nào được giải.</p>
                <p>Hãy chuyển sang tab "Giải Phương Trình" để bắt đầu!</p>
              </div>
            ) : (
              <div className="records-grid">
                {records.map((record) => (
                  <div key={record.id} className="record-card">
                    <div className="record-header">
                      <h4>{record.a}x² + {record.b}x + {record.c} = 0</h4>
                      <div className="record-actions">
                        <button 
                          onClick={() => deleteRecord(record.id)}
                          className="delete-btn"
                          title="Xóa"
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                    
                    <div className="record-content">
                      <p><strong>Loại nghiệm:</strong> {
                        record.solutionType === 'distinct' ? 'Hai nghiệm phân biệt' :
                        record.solutionType === 'double' ? 'Nghiệm kép' :
                        record.solutionType === 'linear' ? 'Phương trình bậc nhất' :
                        record.solutionType === 'none' ? 'Vô nghiệm' :
                        'Vô số nghiệm'
                      }</p>
                      
                      {record.x1 !== undefined && (
                        <p><strong>Nghiệm:</strong> 
                          {record.x2 !== undefined 
                            ? ` x₁ = ${record.x1.toFixed(4)}, x₂ = ${record.x2.toFixed(4)}`
                            : ` x = ${record.x1.toFixed(4)}`
                          }
                        </p>
                      )}
                      
                      {record.note && (
                        <p><strong>Ghi chú:</strong> {record.note}</p>
                      )}
                      
                      <p className="record-date">
                        <strong>Thời gian:</strong> {record.solvedAt}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Google Sheets Connected */}
        <div className="google-sheets-notice">
          <h3>✅ Kết nối Google Sheets</h3>
          <p>Ứng dụng đã được kết nối với Google Sheets thành công!</p>
          <p>Tất cả dữ liệu sẽ được lưu trữ và đồng bộ qua Google Sheets.</p>
        </div>
      </div>
    </div>
  );
}

export default App;
