import React, { useRef, useState } from 'react';
import { UploadCloud, X } from 'lucide-react';

/**
 * ImagePickerField - chọn 1 file ảnh, hiển thị preview.
 * Nếu có currentUrl (ảnh đã lưu), hiển thị preview đó cho tới khi người dùng chọn ảnh mới.
 */
export default function ImagePickerField({ file, onChange, currentUrl, label = 'Chọn hình ảnh' }) {
  const inputRef = useRef(null);
  const [preview, setPreview] = useState(null);

  const handleFile = (f) => {
    if (!f) return;
    onChange(f);
    setPreview(URL.createObjectURL(f));
  };

  const displayUrl = preview || currentUrl;

  return (
    <div>
      <label className="label">{label}</label>
      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          handleFile(e.dataTransfer.files[0]);
        }}
        className="relative flex cursor-pointer flex-col items-center justify-center gap-2 rounded-md border-2 border-dashed border-line bg-ink-50 px-4 py-6 text-center hover:border-union-300"
      >
        {displayUrl ? (
          <>
            <img src={displayUrl} alt="preview" className="max-h-40 rounded-md object-contain" />
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setPreview(null);
                onChange(null);
              }}
              className="absolute right-2 top-2 rounded-full bg-white p-1 shadow-card hover:bg-union-50"
            >
              <X className="h-3.5 w-3.5 text-union-600" />
            </button>
          </>
        ) : (
          <>
            <UploadCloud className="h-7 w-7 text-ink-400" />
            <p className="text-sm text-ink-500">Nhấn hoặc kéo thả ảnh vào đây</p>
          </>
        )}
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => handleFile(e.target.files[0])}
        />
      </div>
    </div>
  );
}
