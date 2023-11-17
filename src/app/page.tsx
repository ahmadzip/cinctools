"use client";
import { useEffect, useState } from "react";
import { PDFDocument, PageSizes, PDFPage } from "pdf-lib";
import download from "downloadjs";
import DraggableList from "@/app/component/Droppable";
import Image from "next/image";
import { toast } from "react-toastify";

enum ImageFormats {
  PNG,
  JPG,
}

enum FileOrientation {
  Potrait,
  Landscape,
}

export default function PDFMerger() {
  const [pdf, setPdf] = useState<null | PDFDocument>(null);
  const [fileList, setFileList] = useState<[] | Array<File>>([]);
  const [pageSize, setPageSize] = useState<string>("A4");
  const [orientation, setOrientation] = useState(FileOrientation.Potrait);
  const [fileName, setFileName] = useState<string>("");

  useEffect(() => {
    async function initPdf() {
      const pdfDoc = await PDFDocument.create();
      setPdf(pdfDoc);
    }
    initPdf().then((r) => {
      console.log("@man.zip_");
    });
  }, []);

  async function insertImage(
    index: number,
    imageBytes: string | ArrayBuffer,
    type: ImageFormats
  ) {
    if (pdf == null) {
      console.log("pdf is not init");
      return;
    }
    let image;
    switch (type) {
      case ImageFormats.JPG:
        image = await getJpgImage(imageBytes);
        break;
      case ImageFormats.PNG:
        image = await getPngImage(imageBytes);
        break;
      default:
        return;
    }

    if (image) {
      let pageW, pageH;
      if (pageSize === "Fit") {
        pageW = image.width;
        pageH = image.height;
      } else {
        if (orientation === FileOrientation.Potrait) {
          pageW = PageSizes[pageSize as keyof typeof PageSizes][0];
          pageH = PageSizes[pageSize as keyof typeof PageSizes][1];
        } else {
          pageW = PageSizes[pageSize as keyof typeof PageSizes][1];
          pageH = PageSizes[pageSize as keyof typeof PageSizes][0];
        }
      }
      const dims = image.scaleToFit(pageW, pageH);
      index = getNewPageIndex(index);
      const page = pdf.insertPage(index, [pageW, pageH]);

      page.drawImage(image, {
        x: pageW / 2 - dims.width / 2,
        y: pageH / 2 - dims.height / 2,
        width: dims.width,
        height: dims.height,
      });

      return page;
    } else {
      console.log("failed to get image");
    }
  }

  function scaleToFitPage(page: PDFPage) {
    let pageW, pageH;
    if (pageSize === "Fit") {
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
    page.setMediaBox(
      -(pageW / 2 - page.getWidth() / 2),
      -(pageH / 2 - page.getHeight() / 2),
      pageW,
      pageH
    );

    return page;
  }

  async function insertPdf(index: number, pdfByte: string | ArrayBuffer) {
    const newPDF = await PDFDocument.load(pdfByte);
    if (pdf) {
      const copiedPages = await pdf.copyPages(newPDF, newPDF.getPageIndices());
      index = getNewPageIndex(index);

      copiedPages.forEach((page) => {
        page = scaleToFitPage(page);
        pdf.insertPage(index, page);
        index++;
      });

      return copiedPages;
    } else {
      console.log("PDF File is not init");
    }
  }

  function getNewPageIndex(index: number) {
    if (pdf) {
      while (index > pdf.getPageCount()) {
        pdf.addPage([1, 1]);
      }

      while (
        index < pdf.getPageCount() &&
        pdf.getPage(index).getSize().width > 1 &&
        pdf.getPage(index).getSize().height > 1
      ) {
        index++;
        console.log("increment index to", index);
      }

      if (
        index < pdf.getPageCount() &&
        pdf.getPage(index).getSize().width == 1 &&
        pdf.getPage(index).getSize().height == 1
      ) {
        console.log("removing page", index);
        pdf.removePage(index);
      }

      return index;
    } else {
      console.log("pdf not init");
      return -1;
    }
  }

  async function getJpgImage(imageBytes: string | ArrayBuffer) {
    if (pdf == null) {
      return;
    }

    return await pdf.embedJpg(imageBytes);
  }

  async function getPngImage(imageBytes: string | ArrayBuffer) {
    if (pdf == null) {
      return;
    }

    return await pdf.embedPng(imageBytes);
  }

  async function downloadPdf() {
    if (fileList.length === 0) {
      toast.error("No file selected yet ! 🤔");
      return;
    }
    if (pdf == null) {
      console.log("pdf is not initiated");
      return;
    }

    const fileDataArray: { file: File; buffer: ArrayBuffer | string }[] =
      await readFile();
    const pdfPagesArray: Array<PDFPage | PDFPage[] | undefined> =
      await addPages(fileDataArray);

    if (pdfPagesArray.length > 0) {
      const pdfBytes = await pdf.save();
      console.log("download", pdfBytes);
      download(pdfBytes, fileName + ".pdf", "application/pdf");
      toast.dismiss();
      toast.success("File successfully converted ! 🎉");
      await resetPDF();
    }
  }

  function addPages(
    fileDataArray: { file: File; buffer: ArrayBuffer | string }[]
  ): Promise<Array<PDFPage | undefined | PDFPage[]>> {
    return new Promise((resolve, reject) => {
      let pdfPages: Array<PDFPage | undefined | PDFPage[]> = [];

      Array.from(fileDataArray).forEach(async (data, index) => {
        const fileType = data.file.type;
        if (fileType === "image/jpeg") {
          console.log("embedding jpeg", data.file.name, index);
          const page = await insertImage(index, data.buffer, ImageFormats.JPG);
          pdfPages.push(page);
        } else if (fileType === "image/png") {
          console.log("embedding png", data.file.name, index);
          const page = await insertImage(index, data.buffer, ImageFormats.PNG);
          pdfPages.push(page);
        } else if (fileType === "application/pdf") {
          console.log("embedding pdf", data.file.name, index);
          const page = await insertPdf(index, data.buffer);
          pdfPages.push(page);
        }

        if (pdfPages.length == fileDataArray.length) {
          resolve(pdfPages);
        }
      });
    });
  }

  function readFile(): Promise<{ file: File; buffer: ArrayBuffer | string }[]> {
    console.log("file list", fileList);
    return new Promise((resolve, reject) => {
      let fileDataArray: { file: File; buffer: ArrayBuffer | string }[] = [];

      Array.from(fileList).forEach((file, index) => {
        console.log("reading", file.name);
        const reader = new FileReader();
        reader.onerror = () => {
          console.error("failed to read file to buffer", file, reader.error);
          reject();
        };

        reader.onload = () => {
          if (reader.result == null) {
            console.error("file result is null", file, reader.error);
            return;
          }

          if (fileDataArray[index] != null) {
            fileDataArray.splice(index, 0, {
              file: file,
              buffer: reader.result,
            });
          } else {
            fileDataArray.push({ file: file, buffer: reader.result });
          }
          console.info("successfully read file", file);

          if (fileDataArray.length == fileList.length) {
            resolve(fileDataArray);
          }
        };

        reader.readAsArrayBuffer(file);
      });
    });
  }

  function onFileUpload(input: FileList | null) {
    if (!input) {
      return console.log("no file input");
    }
    setFileList(Array.from(input));
    setFileName(input[0].name.replace(/\.[^\/.]+$/, ""));
  }

  async function resetPDF() {
    setFileList([]);
    const pdfDoc = await PDFDocument.create();
    setPdf(pdfDoc);
  }
  return (
    <>
      <div className="flex items-center justify-center p-12">
        <div className="mx-auto w-full max-w-[550px] bg-white py-6 px-9 dark:bg-[#27292C] rounded-md shadow-for duration-200">
          <div className="mb-6 pt-4">
            <label className="mb-5 block text-xl font-semibold">
              Upload File
            </label>

            <div className="mb-8">
              <input
                type="file"
                accept=".jpg,.jpeg,.png"
                onChange={(e) => onFileUpload(e.target.files)}
                onClick={(e) => (e.currentTarget.value = "")}
                multiple
                name="file"
                id="file"
                className="sr-only"
              />
              <label
                htmlFor="file"
                className="relative flex min-h-[200px] items-center justify-center rounded-md border border-dashed border-[#e0e0e0] p-12 text-center"
              >
                <div>
                  <span className="mb-2 block text-xl font-semibold">
                    Drop files here
                  </span>
                  <span className="mb-2 block text-base font-medium">Or</span>
                  <span className="inline-flex rounded border border-[#e0e0e0] py-2 px-7 text-base font-medium">
                    Browse
                  </span>
                </div>
              </label>
            </div>
            <div className="mb-5">
              <label
                htmlFor="text"
                className="mb-3 block text-base font-medium"
              >
                File Name
              </label>
              <input
                type="text"
                name="text"
                id="text"
                placeholder="@man.zip_"
                className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium outline-none focus:border-[#6A64F1] focus:shadow-md dark:text-black duration-200"
                onChange={(e) => setFileName(e.target.value)}
              />
            </div>
            <div className="mb-5">
              <label
                htmlFor="text"
                className="mb-3 block text-base font-medium"
              >
                Page Size (Under Development)
              </label>
              <select
                name="pageSize"
                id="pageSize"
                className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium outline-none focus:border-[#6A64F1] focus:shadow-md dark:text-black duration-200 cursor-not-allowed"
                onChange={(e) => {
                  setPageSize(e.target.value);
                }}
                disabled
              >
                <option value="A4">A4</option>
                <option value="Letter">Letter</option>
                <option value="Legal">Legal</option>
                <option value="Fit">Fit</option>
              </select>
            </div>
            <div className="mb-5">
              <label
                htmlFor="text"
                className="mb-3 block text-base font-medium"
              >
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
              <div className="flex items-center justify-between">
                {fileList.length > 0 && (
                  <div id="text no-file" className="text-center">
                    <span className="block text-xl font-semibold mb-3">
                      GOOD LUCK ! 🧠
                    </span>
                    <DraggableList
                      fileList={fileList}
                      setFileList={setFileList}
                    />
                  </div>
                )}
                {fileList.length === 0 && (
                  <div id="text no-file" className="text-center">
                    <span className="block text-xl font-semibold mb-3">
                      NO FILE SELECTED YET ! 🤔
                    </span>
                    <Image
                      src="/giphy.webp"
                      width={500}
                      height={500}
                      alt="NOT FOUND"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          <div>
            <button
              onClick={downloadPdf}
              className="hover:shadow-form w-full rounded-md bg-[#774FE9] py-3 px-8 text-center text-base font-semibold text-white outline-none"
            >
              Convert File
            </button>
          </div>
        </div>
      </div>
      <footer className="flex items-center justify-center py-4">
        <span className="text-base font-medium text-gray-400">
          Made with ❤️ by{" "}
          <a
            href="https://www.instagram.com/man.zip_/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#774FE9]"
          >
            @man.zip_
          </a>
        </span>
      </footer>
    </>
  );
}
