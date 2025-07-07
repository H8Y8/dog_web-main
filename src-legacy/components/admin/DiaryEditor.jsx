import { useState, useEffect } from 'react';

const DiaryEditor = ({ diary, onSave, onCancel }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [image, setImage] = useState(null);
  const [tags, setTags] = useState([]);
  const [newTag, setNewTag] = useState('');

  useEffect(() => {
    if (diary) {
      setTitle(diary.title);
      setContent(diary.content);
      setTags(diary.tags);
    }
  }, [diary]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('title', title);
    formData.append('content', content);
    formData.append('tags', JSON.stringify(tags));
    if (image) {
      formData.append('image', image);
    }

    // 這裡應該調用API保存數據
    console.log('Save diary:', formData);
    onSave();
  };

  const handleAddTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h2 className="text-2xl font-bold text-earth-900 mb-6">
        {diary ? '編輯日誌' : '新增日誌'}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="title" className="block text-earth-700 mb-2">
            標題
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3 py-2 border border-earth-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            required
          />
        </div>

        <div>
          <label htmlFor="content" className="block text-earth-700 mb-2">
            內容
          </label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows="6"
            className="w-full px-3 py-2 border border-earth-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            required
          />
        </div>

        <div>
          <label htmlFor="image" className="block text-earth-700 mb-2">
            圖片
          </label>
          <input
            type="file"
            id="image"
            accept="image/*"
            onChange={(e) => setImage(e.target.files[0])}
            className="w-full"
          />
          {diary?.image && (
            <img
              src={diary.image}
              alt="目前圖片"
              className="mt-2 h-32 w-auto object-cover rounded-lg"
            />
          )}
        </div>

        <div>
          <label className="block text-earth-700 mb-2">標籤</label>
          <div className="flex flex-wrap gap-2 mb-2">
            {tags.map((tag, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-earth-100 text-earth-600 rounded-full text-sm flex items-center"
              >
                {tag}
                <button
                  type="button"
                  onClick={() => handleRemoveTag(tag)}
                  className="ml-2 text-earth-400 hover:text-earth-600"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              className="flex-1 px-3 py-2 border border-earth-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="輸入新標籤"
            />
            <button
              type="button"
              onClick={handleAddTag}
              className="px-4 py-2 bg-earth-600 text-white rounded-lg hover:bg-earth-700 transition-colors"
            >
              新增標籤
            </button>
          </div>
        </div>

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-earth-300 text-earth-700 rounded-lg hover:bg-earth-50 transition-colors"
          >
            取消
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            儲存
          </button>
        </div>
      </form>
    </div>
  );
};

export default DiaryEditor; 