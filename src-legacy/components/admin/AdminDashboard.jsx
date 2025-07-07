import { useState } from 'react';
import DiaryEditor from './DiaryEditor';
import DiaryList from './DiaryList';

const AdminDashboard = () => {
  const [selectedDiary, setSelectedDiary] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  return (
    <div className="min-h-screen bg-earth-50">
      <nav className="bg-earth-800 text-white px-4 py-3">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold">雷歐犬舍訓練工作室後台管理</h1>
          <button
            onClick={() => {
              setSelectedDiary(null);
              setIsEditing(true);
            }}
            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            新增日誌
          </button>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {isEditing ? (
          <DiaryEditor
            diary={selectedDiary}
            onSave={() => {
              setIsEditing(false);
              setSelectedDiary(null);
            }}
            onCancel={() => {
              setIsEditing(false);
              setSelectedDiary(null);
            }}
          />
        ) : (
          <DiaryList
            onEdit={(diary) => {
              setSelectedDiary(diary);
              setIsEditing(true);
            }}
            onDelete={(id) => {
              // 實作刪除功能
              console.log('Delete diary:', id);
            }}
          />
        )}
      </main>
    </div>
  );
};

export default AdminDashboard; 