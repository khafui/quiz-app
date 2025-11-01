// 'use client';
// import { useState } from 'react';
// import { useRouter } from 'next/navigation';
//
// export default function BulkUpload() {
//   const [fileName, setFileName] = useState('');
//   const [status, setStatus] = useState('');
//   const router = useRouter();
//
//   function parseCSV(content: string) {
//     const lines = content.split('\n').map(l => l.trim()).filter(Boolean);
//     const rows = [];
//     for (const line of lines) {
//       const parts = splitCSVLine(line);
//       const [text, isMultiple, optionsStr, correctStr] = parts;
//       const options = optionsStr.split('|').map(s => ({ text: s.trim() }));
//       const correctIndexes = correctStr ? correctStr.split('|').map(s => parseInt(s,10)) : [];
//       rows.push({ text, isMultiple: isMultiple==='true', options, correctIndexes });
//     }
//     return rows;
//   }
//
//   function splitCSVLine(line: string) {
//     const res = [];
//     let cur = '';
//     let inQuotes = false;
//     for (let i=0;i<line.length;i++) {
//       const ch = line[i];
//       if (ch === '"') { inQuotes = !inQuotes; continue; }
//       if (ch === ',' && !inQuotes) { res.push(cur); cur=''; continue; }
//       cur += ch;
//     }
//     res.push(cur);
//     return res.map(s => s.trim());
//   }
//
//   async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
//     const f = e.target.files?.[0];
//     if (!f) return;
//     setFileName(f.name);
//     const text = await f.text();
//     const rows = parseCSV(text);
//     setStatus(`Parsed ${rows.length} rows — uploading...`);
//     const res = await fetch('/api/questions/bulk', {
//       method: 'POST',
//       headers: { 'Content-Type': 'src/application/json' },
//       body: JSON.stringify({ rows })
//     });
//     if (res.ok) {
//       setStatus('Upload successful');
//       router.refresh();
//     } else {
//       const err = await res.json().catch(()=>({error:'Unknown'}));
//       setStatus('Upload failed: ' + (err.error || JSON.stringify(err)));
//     }
//   }
//
//   return (
//     <div className="bg-white p-4 rounded shadow">
//       <label className="block text-sm font-medium mb-2">Bulk upload CSV</label>
//       <input type="file" accept=".csv" onChange={handleFile} />
//       <div className="mt-2 text-sm text-slate-600">{fileName}</div>
//       <div className="mt-2 text-sm">{status}</div>
//       <p className="text-xs text-slate-500 mt-2">CSV columns: text,isMultiple (true/false),options (| separated),correctIndexes (| separated indexes)</p>
//     </div>
//   );
// }


// 'use client';
// import { useState, useEffect } from 'react';
// import { useRouter } from 'next/navigation';
//
// type Course = { id: string; name: string };
// type Quiz = { id: string; title: string };
//
// export default function BulkUpload() {
//   const [fileName, setFileName] = useState('');
//   const [status, setStatus] = useState('');
//   const [courses, setCourses] = useState<Course[]>([]);
//   const [quizzes, setQuizzes] = useState<Quiz[]>([]);
//   const [selectedCourse, setSelectedCourse] = useState('');
//   const [selectedQuiz, setSelectedQuiz] = useState('');
//   const router = useRouter();
//
//   useEffect(() => {
//     (async () => {
//       const res = await fetch('/api/courses');
//       const data = await res.json();
//       setCourses(data || []);
//     })();
//   }, []);
//
//   useEffect(() => {
//     if (!selectedCourse) return;
//     (async () => {
//       const res = await fetch(`/api/courses/${selectedCourse}/quizzes`);
//       const data = await res.json();
//       setQuizzes(data || []);
//     })();
//   }, [selectedCourse]);
//
//   function parseCSV(content: string) {
//     const lines = content.split('\n').map((l) => l.trim()).filter(Boolean);
//     const rows = [];
//     for (const line of lines) {
//       const parts = splitCSVLine(line);
//       const [text, isMultiple, optionsStr, correctStr] = parts;
//       const options = optionsStr.split('|').map((s) => ({ text: s.trim() }));
//       const correctIndexes = correctStr
//           ? correctStr.split('|').map((s) => parseInt(s, 10))
//           : [];
//       rows.push({ text, isMultiple: isMultiple === 'true', options, correctIndexes });
//     }
//     return rows;
//   }
//
//   function splitCSVLine(line: string) {
//     const res = [];
//     let cur = '';
//     let inQuotes = false;
//     for (let i = 0; i < line.length; i++) {
//       const ch = line[i];
//       if (ch === '"') {
//         inQuotes = !inQuotes;
//         continue;
//       }
//       if (ch === ',' && !inQuotes) {
//         res.push(cur);
//         cur = '';
//         continue;
//       }
//       cur += ch;
//     }
//     res.push(cur);
//     return res.map((s) => s.trim());
//   }
//
//   async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
//     const f = e.target.files?.[0];
//     if (!f) return;
//
//     if (!selectedCourse || !selectedQuiz) {
//       alert('Please select a course and quiz before uploading.');
//       e.target.value = '';
//       return;
//     }
//
//     setFileName(f.name);
//     const text = await f.text();
//     const rows = parseCSV(text);
//     setStatus(`Parsed ${rows.length} rows — uploading...`);
//
//     const res = await fetch('/api/questions/bulk', {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({
//         rows,
//         quizId: selectedQuiz,
//       }),
//     });
//
//     if (res.ok) {
//       setStatus('✅ Upload successful');
//       router.refresh();
//     } else {
//       const err = await res.json().catch(() => ({ error: 'Unknown' }));
//       setStatus('❌ Upload failed: ' + (err.error || JSON.stringify(err)));
//     }
//   }
//
//   return (
//       <div className="bg-white p-4 rounded shadow space-y-4">
//         <h3 className="font-semibold text-lg">Bulk Upload CSV</h3>
//
//         {/* COURSE SELECT */}
//         <div>
//           <label className="block text-sm font-medium mb-1">Select Course</label>
//           <select
//               value={selectedCourse}
//               onChange={(e) => {
//                 setSelectedCourse(e.target.value);
//                 setSelectedQuiz('');
//               }}
//               className="border rounded p-2 w-full"
//           >
//             <option value="">-- Choose Course --</option>
//             {courses.map((c) => (
//                 <option key={c.id} value={c.id}>
//                   {c.name}
//                 </option>
//             ))}
//           </select>
//         </div>
//
//         {/* QUIZ SELECT */}
//         {selectedCourse && (
//             <div>
//               <label className="block text-sm font-medium mb-1">Select Quiz</label>
//               <select
//                   value={selectedQuiz}
//                   onChange={(e) => setSelectedQuiz(e.target.value)}
//                   className="border rounded p-2 w-full"
//               >
//                 <option value="">-- Choose Quiz --</option>
//                 {quizzes.map((q) => (
//                     <option key={q.id} value={q.id}>
//                       {q.title}
//                     </option>
//                 ))}
//               </select>
//             </div>
//         )}
//
//         {/* FILE UPLOAD */}
//         <div>
//           <input type="file" accept=".csv" onChange={handleFile} />
//           <div className="mt-2 text-sm text-slate-600">{fileName}</div>
//           <div className="mt-2 text-sm">{status}</div>
//           <p className="text-xs text-slate-500 mt-2">
//             CSV columns: text,isMultiple (true/false),options (| separated),correctIndexes (|
//             separated indexes)
//           </p>
//         </div>
//       </div>
//   );
// }

//
// 'use client';
// import { useState, useEffect } from 'react';
// import { useRouter } from 'next/navigation';
//
// type Course = { id: string; name: string };
//
// export default function BulkUpload() {
//   const [fileName, setFileName] = useState('');
//   const [status, setStatus] = useState('');
//   const [courses, setCourses] = useState<Course[]>([]);
//   const [selectedCourse, setSelectedCourse] = useState('');
//   const [quizTitle, setQuizTitle] = useState('');
//   const [quizDescription, setQuizDescription] = useState('');
//   const [csvRows, setCsvRows] = useState<any[]>([]);
//   const router = useRouter();
//
//   useEffect(() => {
//     (async () => {
//       const res = await fetch('/api/courses');
//       const data = await res.json();
//       setCourses(data || []);
//     })();
//   }, []);
//
//   function parseCSV(content: string) {
//     const lines = content.split('\n').map((l) => l.trim()).filter(Boolean);
//     const rows = [];
//     for (const line of lines) {
//       const parts = splitCSVLine(line);
//       const [text, isMultiple, optionsStr, correctStr] = parts;
//       const options = optionsStr.split('|').map((s) => ({ text: s.trim() }));
//       const correctIndexes = correctStr
//           ? correctStr.split('|').map((s) => parseInt(s, 10))
//           : [];
//       rows.push({ text, isMultiple: isMultiple === 'true', options, correctIndexes });
//     }
//     return rows;
//   }
//
//   function splitCSVLine(line: string) {
//     const res = [];
//     let cur = '';
//     let inQuotes = false;
//     for (let i = 0; i < line.length; i++) {
//       const ch = line[i];
//       if (ch === '"') {
//         inQuotes = !inQuotes;
//         continue;
//       }
//       if (ch === ',' && !inQuotes) {
//         res.push(cur);
//         cur = '';
//         continue;
//       }
//       cur += ch;
//     }
//     res.push(cur);
//     return res.map((s) => s.trim());
//   }
//
//   async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
//     const f = e.target.files?.[0];
//     if (!f) return;
//
//     setFileName(f.name);
//     const text = await f.text();
//     const rows = parseCSV(text);
//     setCsvRows(rows);
//     setStatus(`Parsed ${rows.length} questions`);
//   }
//
//   async function handleSubmit() {
//     if (!selectedCourse || !quizTitle || !csvRows.length) {
//       alert('Please select a course, enter quiz details, and upload CSV.');
//       return;
//     }
//
//     setStatus('Uploading quiz and questions...');
//
//     const res = await fetch('/api/questions/bulk', {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({
//         courseId: selectedCourse,
//         title: quizTitle,
//         description: quizDescription,
//         questions: csvRows,
//       }),
//     });
//
//     if (res.ok) {
//       const data = await res.json();
//       setStatus(`✅ Created quiz "${data.quiz.title}" with ${data.createdCount} questions.`);
//       setQuizTitle('');
//       setQuizDescription('');
//       setFileName('');
//       setCsvRows([]);
//       router.refresh();
//     } else {
//       const err = await res.json().catch(() => ({ error: 'Unknown error' }));
//       setStatus(`❌ Upload failed: ${err.error || JSON.stringify(err)}`);
//     }
//   }
//
//   return (
//       <div className="bg-white p-6 rounded shadow space-y-4">
//         <h3 className="font-semibold text-lg">Bulk Upload New Quiz</h3>
//
//         {/* COURSE SELECT */}
//         <div>
//           <label className="block text-sm font-medium mb-1">Select Course</label>
//           <select
//               value={selectedCourse}
//               onChange={(e) => setSelectedCourse(e.target.value)}
//               className="border rounded p-2 w-full"
//           >
//             <option value="">-- Choose Course --</option>
//             {courses.map((c) => (
//                 <option key={c.id} value={c.id}>
//                   {c.name}
//                 </option>
//             ))}
//           </select>
//         </div>
//
//         {/* QUIZ DETAILS */}
//         <div>
//           <label className="block text-sm font-medium mb-1">Quiz Title</label>
//           <input
//               value={quizTitle}
//               onChange={(e) => setQuizTitle(e.target.value)}
//               className="border rounded p-2 w-full"
//               placeholder="Enter quiz title"
//           />
//
//           <label className="block text-sm font-medium mt-3 mb-1">Description</label>
//           <textarea
//               value={quizDescription}
//               onChange={(e) => setQuizDescription(e.target.value)}
//               className="border rounded p-2 w-full"
//               rows={3}
//               placeholder="Short quiz description"
//           />
//         </div>
//
//         {/* FILE UPLOAD */}
//         <div>
//           <input type="file" accept=".csv" onChange={handleFile} />
//           <div className="mt-2 text-sm text-slate-600">{fileName}</div>
//           <div className="mt-2 text-sm">{status}</div>
//           <p className="text-xs text-slate-500 mt-2">
//             CSV columns: text,isMultiple (true/false),options (| separated),correctIndexes (|
//             separated indexes)
//           </p>
//         </div>
//
//         <button
//             onClick={handleSubmit}
//             className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
//         >
//           Submit
//         </button>
//       </div>
//   );
// }


'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {Loader2} from "lucide-react";

type Course = { id: string; name: string };

export default function BulkUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState('');
  const [status, setStatus] = useState('');
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [disabled, setDisabled] = useState<boolean>(false);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [quizTitle, setQuizTitle] = useState('');
  const [quizDescription, setQuizDescription] = useState('');
  const router = useRouter();

  // Fetch all courses for dropdown
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch('/api/courses');
        const data = await res.json();
        setCourses(data || []);
      } catch {
        setStatus('❌ Failed to load courses.');
      }
    })();
  }, []);

  // Handle CSV file selection
  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    setFile(f);
    setFileName(f.name);
    setStatus(`Selected: ${f.name}`);
  }

  // Submit form data to backend
  async function handleSubmit() {
    if (!selectedCourse || !quizTitle || !file) {
      alert('Please select a course, enter quiz details, and upload a CSV file.');
      return;
    }
    setLoading(true)
    setDisabled(true);
    setStatus('Uploading quiz and questions...');

    const formData = new FormData();
    formData.append('file', file);
    formData.append('title', quizTitle);
    formData.append('description', quizDescription);
    formData.append('courseId', selectedCourse);
    // formData.append('createdBy', 'user-id-here'); // 🔁 Replace with current user ID if available

    const res = await fetch('/api/questions/bulkupload', {
      method: 'POST',
      body: formData,
    });

    if (res.ok) {
      const data = await res.json();
      setStatus(`✅ Created quiz "${quizTitle}" successfully with linked questions.`);
      setQuizTitle('');
      setQuizDescription('');
      setFileName('');
      setFile(null);
      setLoading(false);
      setDisabled(false);
      router.refresh();
    } else {
      const err = await res.json().catch(() => ({ error: 'Unknown error' }));
      setStatus(`❌ Upload failed: ${err.error || JSON.stringify(err)}`);
    }
    setLoading(false);
    setDisabled(false);
  }

  return (
      <div className="bg-white p-6 rounded-xl shadow space-y-4 mx-auto mt-8">
        <h3 className="font-semibold text-lg">📘 Bulk Upload New Quiz</h3>

        {/* COURSE SELECT */}
        <div>
          <label className="block text-sm font-medium mb-1">Select Course</label>
          <select
              value={selectedCourse}
              onChange={(e) => setSelectedCourse(e.target.value)}
              className="border rounded p-2 w-full"
          >
            <option value="">-- Choose Course --</option>
            {courses.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
            ))}
          </select>
        </div>

        {/* QUIZ DETAILS */}
        <div>
          <label className="block text-sm font-medium mb-1">Quiz Title</label>
          <input
              value={quizTitle}
              onChange={(e) => setQuizTitle(e.target.value)}
              className="border rounded p-2 w-full"
              placeholder="Enter quiz title"
          />

          <label className="block text-sm font-medium mt-3 mb-1">Description</label>
          <textarea
              value={quizDescription}
              onChange={(e) => setQuizDescription(e.target.value)}
              className="border rounded p-2 w-full"
              rows={3}
              placeholder="Short quiz description"
          />
        </div>

        {/* FILE UPLOAD */}
        <div>
          <input type="file" accept=".csv" onChange={handleFile} />
          {fileName && <div className="mt-2 text-sm text-slate-700">{fileName}</div>}
          <p className="text-xs text-slate-500 mt-2">
            CSV columns: <b>text,isMultiple,options,correctIndexes</b>
            <br />
            Example:
            <code>
              What is 2+2?,false,3|4|5,1
            </code>
          </p>
        </div>

        {/* STATUS */}
        <div className="text-sm mt-2 text-slate-600">{status}</div>

        {/* SUBMIT */}
        <button
            disabled={disabled}
            onClick={handleSubmit}
            // className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            className="px-4 py-2 flex items-center gap-2 rounded shad-primary-btn text-white"
        >
          {loading && <Loader2 className="size-5 animate-spin"/>}
          Upload
        </button>
      </div>
  );
}
