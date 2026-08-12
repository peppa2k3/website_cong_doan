import React from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import api from '../../services/api';

const modules = {
  toolbar: {
    container: [
      [{ header: [2, 3, false] }],
      ['bold', 'italic', 'underline'],
      [{ list: 'ordered' }, { list: 'bullet' }],
      ['link', 'image'],
      ['clean'],
    ],
    handlers: {},
  },
};

export default function RichTextEditor({ value, onChange, placeholder }) {
  const quillRef = React.useRef(null);

  React.useEffect(() => {
    const editor = quillRef.current?.getEditor?.();
    if (!editor) return;
    const toolbar = editor.getModule('toolbar');
    toolbar.addHandler('image', () => {
      const input = document.createElement('input');
      input.setAttribute('type', 'file');
      input.setAttribute('accept', 'image/*');
      input.click();
      input.onchange = async () => {
        const file = input.files[0];
        if (!file) return;
        const formData = new FormData();
        formData.append('image', file);
        try {
          const { data } = await api.post('/uploads/image', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
          });
          const range = editor.getSelection(true);
          editor.insertEmbed(range.index, 'image', data.data.url);
        } catch (err) {
          // eslint-disable-next-line no-alert
          alert('Tải ảnh lên thất bại.');
        }
      };
    });
  }, []);

  return (
    <ReactQuill
      ref={quillRef}
      theme="snow"
      value={value}
      onChange={onChange}
      modules={modules}
      placeholder={placeholder}
    />
  );
}
