'use client';
import { useEffect, useState } from 'react';
import { PDFDocument, PageSizes, PDFPage } from 'pdf-lib';
import download from 'downloadjs';
import DraggableList from '@/component/Droppable';
import Image from 'next/image';
import { toast } from 'react-toastify';
import RuningText from '@/component/RunningText';
import Swal from 'sweetalert2';

enum FileOrientation {
  Potrait,
  Landscape,
}
const PdfMarge = () => {
  const [fileList, setFileList] = useState<File[]>([]);
  const [fileName, setFileName] = useState<string>('');
  const [pageSize, setPageSize] = useState<string>('A4');
  const [orientation, setOrientation] = useState(FileOrientation.Potrait);
  const [pdf, setPdf] = useState<PDFDocument | null>(null);
  useEffect(() => {
    async function initPdf() {
      const pdfDoc = await PDFDocument.create();
      setPdf(pdfDoc);
    }
    initPdf().then((r) => {
      console.log('@man.zip_');
    });
    const showTips = JSON.parse(localStorage.getItem('showTipsPdfMarge') || '{}');
    if (!showTips.expire || showTips.expire < Date.now()) {
      Swal.fire({
        title: 'Tips',
        text: 'You can drag and drop the file to change the order of the file',
        imageUrl: '/tipspdfmarge.gif',
        imageWidth: 400,
        imageHeight: 200,
        background: localStorage.getItem('theme') === 'dark' ? '#27292C' : '#fff',
        color: localStorage.getItem('theme') === 'dark' ? '#fff' : '#000',
        imageAlt: 'Custom image',
        confirmButtonText: "Don't show again",
        confirmButtonColor: '#774FE9',
        showCancelButton: true,
        cancelButtonText: 'Close',
        cancelButtonColor: '#6C757D',
      }).then((result) => {
        if (result.isConfirmed) {
          localStorage.setItem('showTipsPdfMarge', JSON.stringify({ expire: Date.now() + 86400000 }));
        }
      });
    }
  }, []);
  const CreatePdf = async () => {
    if (fileList.length === 0) {
      toast.error('No file selected yet ! 🤔');
      return;
    }
    if (pdf == null) {
      toast.error('Pdf not ready yet ! 🤔');
      return;
    }
    const fileDataArray = await Promise.all(
      Array.from(fileList).map((file, index) => {
        return new Promise<{ file: File; buffer: ArrayBuffer | string }>((resolve, reject) => {
          console.log('reading', file.name);
          const reader = new FileReader();
          reader.onerror = () => {
            toast.error('Error reading file ! 🤔');
            reject();
          };
          reader.onload = () => {
            if (reader.result == null) {
              console.error('file result is null', file, reader.error);
              reject();
              return;
            }

            resolve({
              file: file,
              buffer: reader.result,
            });
          };
          reader.readAsArrayBuffer(file);
        });
      }),
    );

    let pdfPagesArray: Array<PDFPage | undefined | PDFPage[]> = [];

    await Promise.all(
      fileDataArray.map(async (data, index) => {
        const fileType = data.file.type;
        if (fileType === 'application/pdf') {
          console.log('embedding pdf', data.file.name, index);
          const newPDF = await PDFDocument.load(data.buffer);
          const copiedPages = await pdf.copyPages(newPDF, newPDF.getPageIndices());
          while (index > pdf.getPageCount()) {
            pdf.addPage([1, 1]);
          }

          while (index < pdf.getPageCount() && pdf.getPage(index).getSize().width > 1 && pdf.getPage(index).getSize().height > 1) {
            index++;
            console.log('increment index to', index);
          }

          if (index < pdf.getPageCount() && pdf.getPage(index).getSize().width == 1 && pdf.getPage(index).getSize().height == 1) {
            console.log('removing page', index);
            pdf.removePage(index);
          }

          copiedPages.forEach((copiedPage) => {
            let pageW, pageH;
            let page = copiedPage;
            if (pageSize === 'Fit') {
              pageW = page.getWidth();
              pageH = page.getHeight();
            } else {
              if (orientation === FileOrientation.Potrait) {
                pageW = PageSizes[pageSize as keyof typeof PageSizes][0];
                pageH = PageSizes[pageSize as keyof typeof PageSizes][1];
              } else {
                pageW = PageSizes[pageSize as keyof typeof PageSizes][1];
                pageH = PageSizes[pageSize as keyof typeof PageSizes][0];
              }
            }
            let scaleW = (pageW / page.getWidth()) * 1.0;
            let scaleH = (pageH / page.getHeight()) * 1.0;

            if (scaleW < scaleH) {
              let newH = (page.getHeight() / page.getWidth()) * pageW;
              scaleH = (newH / page.getHeight()) * 1.0;
            } else {
              let newW = (page.getWidth() / page.getHeight()) * pageH;
              scaleW = (newW / page.getWidth()) * 1.0;
            }

            page.scale(scaleW, scaleH);
            page.setMediaBox(-(pageW / 2 - page.getWidth() / 2), -(pageH / 2 - page.getHeight() / 2), pageW, pageH);
            const scaledPage = page;
            pdf.insertPage(index, scaledPage);
            index++;
          });

          pdfPagesArray.push(copiedPages);
        }
      }),
    );
    if (pdfPagesArray.length > 0) {
      const pdfBytes = await pdf.save();
      console.log('download', pdfBytes);
      download(pdfBytes, fileName + '.pdf', 'application/pdf');
      toast.dismiss();
      toast.success('File successfully converted ! 🎉');
      await resetPDF();
    }
  };
  function onFileUpload(input: FileList | null) {
    if (!input) {
      return console.log('no file input');
    }
    setFileList(Array.from(input));
    setFileName(input[0].name.replace(/\.[^\/.]+$/, ''));
  }
  async function resetPDF() {
    setFileList([]);
    const pdfDoc = await PDFDocument.create();
    setPdf(pdfDoc);
    setFileName('');
  }
  return (
    <>
      <div className="flex items-center justify-center p-12">
        <div className="mx-auto w-full max-w-[850px] bg-white py-6 px-9 dark:bg-[#27292C] rounded-md duration-200 shadow-md dark:shadow-none">
          <div className="mb-6 pt-4">
            <RuningText text="PDF MARGE" />
            <div className="mb-8">
              <input type="file" onChange={(e) => onFileUpload(e.target.files)} onClick={(e) => (e.currentTarget.value = '')} multiple name="file" id="file" className="sr-only" accept="application/pdf" />
              <label htmlFor="file" className="relative flex min-h-[200px] items-center justify-center rounded-md border border-dashed border-[#e0e0e0] p-12 text-center">
                <div>
                  <span className="mb-2 block text-xl font-semibold">Drop files here</span>
                  <span className="mb-2 block text-base font-medium">Or</span>
                  <span className="inline-flex rounded border border-[#e0e0e0] py-2 px-7 text-base font-medium">Browse</span>
                </div>
              </label>
            </div>
            <div className="mb-5">
              <label htmlFor="text" className="mb-3 block text-base font-medium">
                File Name
              </label>
              <input type="text" name="text" id="text" placeholder="CinC" className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium outline-none focus:border-[#6A64F1] focus:shadow-md dark:text-black duration-200" onChange={(e) => setFileName(e.target.value)} value={fileName} />
            </div>
            <div className="mb-5">
              <label htmlFor="text" className="mb-3 block text-base font-medium">
                Page Size
              </label>
              <select
                name="pageSize"
                id="pageSize"
                className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium outline-none focus:border-[#6A64F1] focus:shadow-md dark:text-black duration-200 cursor-not-allowed"
                onChange={(e) => {
                  setPageSize(e.target.value);
                }}
                value={pageSize}
              >
                <option value="A4">A4</option>
                <option value="Letter">Letter</option>
                <option value="Legal">Legal</option>
                <option value="Fit">Fit</option>
              </select>
            </div>
            <div className="mb-5">
              <label htmlFor="text" className="mb-3 block text-base font-medium">
                Orientation
              </label>
              <select
                name="orientation"
                id="orientation"
                className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium outline-none focus:border-[#6A64F1] focus:shadow-md dark:text-black duration-200"
                onChange={(e) => {
                  setOrientation(parseInt(e.target.value));
                }}
              >
                <option value="0">Potrait</option>
                <option value="1">Landscape</option>
              </select>
            </div>
            <div className="rounded-md bg-white shadow-md py-4 px-8 text-base font-medium dark:white dark:bg-[#343A40] duration-200">
              <span className="block text-xl font-semibold mb-3 text text-center">{fileList.length ? 'GOOD LUCK ! 🧠' : 'NO FILE SELECTED YET ! 🤔'}</span>
              <div className="flex items-center justify-center">
                {fileList.length === 0 && (
                  <div id="text no-file" className="text-center">
                    <Image src="/giphy.webp" width={500} height={500} alt="NOT FOUND" />
                  </div>
                )}
              </div>
              <div className="flex items-center justify-between">
                {fileList.length > 0 && (
                  <div id="text no-file" className="text-center">
                    <DraggableList type="" fileList={fileList} setFileList={setFileList} />
                  </div>
                )}
              </div>
            </div>
          </div>

          <div>
            <button onClick={CreatePdf} className="hover:shadow-form w-full rounded-md bg-[#774FE9] py-3 px-8 text-center text-base font-semibold text-white outline-none">
              Convert File
            </button>
            <button onClick={resetPDF} className="hover:shadow-form w-full rounded-md bg-[#E0E1E6] py-3 px-8 text-center text-base font-semibold text-black outline-none mt-3">
              Reset
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default PdfMarge;
