'use client';
import { useEffect, useState } from 'react';
import RuningText from '@/component/RunningText';
import { storage } from '@/lib/firebase';
import { ref, uploadBytes, getDownloadURL, listAll, getStorage, deleteObject } from 'firebase/storage';
import { toast } from 'react-toastify';
import { FaDownload, FaPrint, FaTrash } from 'react-icons/fa6';
import Swal from 'sweetalert2';

const PrintPdf = () => {
  //state for upload pdf
  const [fileCode, setFileCode] = useState<string>('');
  const [fileList, setFileList] = useState<[] | Array<File>>([]);
  const [doneUpload, setdoneUpload] = useState<string[]>([]);

  //state for search pdf
  const [searchCode, setsearchCode] = useState<string>('');
  const [listFiles, setListFiles] = useState<string[]>([]);

  useEffect(() => {
    const showTips = JSON.parse(localStorage.getItem('showTipsTransShare') || '{}');
    if (!showTips.expire || showTips.expire < Date.now()) {
      Swal.fire({
        title: 'Welcome to TransShare! 🚀',
        text: 'This is a beta version of TransShare, please report any bugs or issues to us. Thank you for using TransShare!',
        background: localStorage.getItem('theme') === 'dark' ? '#27292C' : '#fff',
        color: localStorage.getItem('theme') === 'dark' ? '#fff' : '#000',
        confirmButtonText: "Don't show again",
        confirmButtonColor: '#774FE9',
        showCancelButton: true,
        cancelButtonText: 'Close',
        cancelButtonColor: '#6C757D',
      }).then((result) => {
        if (result.isConfirmed) {
          localStorage.setItem('showTipsTransShare', JSON.stringify({ expire: Date.now() + 86400000 }));
        }
      });
    }
  }, []);

  const onFileUpload = (input: FileList | null) => {
    if (!input || input.length === 0) {
      return console.log('No file input or FileList is empty');
    }
    setFileList(Array.from(input));
  };

  const UploadPdf = async () => {
    if (!fileList || fileList.length === 0) {
      toast.error('No file selected yet ! 🤔');
      return;
    }

    let random5code = Math.random().toString(36).substring(7);
    setFileCode(random5code);
    let expire1day = new Date().setDate(new Date().getDate() + 1);

    for (let filess of fileList) {
      let name = filess.name;
      if (filess.size > 10 * 1024 * 1024) {
        toast.error(`File ${name} exceeds 10MB limit and will not be uploaded! 🤔`);
        continue;
      }
      try {
        await uploadBytes(ref(storage, `cinc/${random5code}-${expire1day}-${name}`), filess);
        setdoneUpload((prev) => [...prev, name]);
      } catch (error: any) {
        toast.error(`Failed to upload file ${name}: ${error.message}`);
      }
    }

    toast.success('File uploaded successfully ! 🚀');
  };

  const search = async () => {
    if (!searchCode || searchCode.trim() === '') {
      toast.error('No search code provided! 🤔');
      return;
    }

    const storagee = getStorage();
    const listRef = ref(storagee, 'cinc');

    try {
      const res = await listAll(listRef);
      let fileFound = false;

      for (let itemRef of res.items) {
        // ${random5code}-${expire1day}-${name}
        let fileNamee = itemRef.name;
        let fileCode = fileNamee.split('-')[0];
        let fileExpire = parseInt(fileNamee.split('-')[1]);

        if (new Date().getTime() > fileExpire) {
          await deleteObject(itemRef);
        } else if (fileCode === searchCode && (!listFiles || !listFiles.includes(fileNamee))) {
          setListFiles((prev) => [...prev, fileNamee]);
          fileFound = true;
        }
      }

      if (!fileFound) {
        toast.error('No file found ! 🤔');
      }
    } catch (error: any) {
      toast.error(`Error getting list files: ${error.message}`);
    }
  };

  const print = async (printFileName: string) => {
    const storagee = getStorage();
    try {
      const url = await getDownloadURL(ref(storagee, `cinc/${printFileName}`));
      console.log('url', url);
      window.open(url, '_blank', 'location=yes,height=570,width=520,scrollbars=yes,status=yes');
    } catch (error: any) {
      console.error(`Failed to get download URL for ${printFileName}: ${error.message}`);
    }
  };

  const download = async (downloadFileName: string) => {
    if (!downloadFileName || downloadFileName.trim() === '') {
      console.error('No download file name provided!');
      return;
    }

    try {
      const storage = getStorage();
      const urll = await getDownloadURL(ref(storage, `cinc/${downloadFileName}`));
      let xhr = new XMLHttpRequest();
      xhr.responseType = 'blob';
      xhr.onload = function () {
        let blob = xhr.response;
        if (blob) {
          let link = document.createElement('a');
          link.href = window.URL.createObjectURL(blob);
          link.download = downloadFileName + '.' + downloadFileName.split('.').pop();
          link.click();
        } else {
          console.error('No response from XMLHttpRequest');
        }
      };
      xhr.onerror = function () {
        console.error('Error occurred during XMLHttpRequest');
      };
      xhr.open('GET', urll);
      xhr.send();
    } catch (error: any) {
      console.error(`Failed to download file ${downloadFileName}: ${error.message}`);
      toast.error('Error downloading file ! 🤔');
    }
  };

  const deleteFile = async (deleteFileName: string) => {
    if (!deleteFileName || deleteFileName.trim() === '') {
      console.error('No delete file name provided!');
      return;
    }

    const storagee = getStorage();
    const desertRef = ref(storagee, `cinc/${deleteFileName}`);

    try {
      await deleteObject(desertRef);
      toast.success('File deleted successfully ! 🚀');
    } catch (error: any) {
      console.error(`Failed to delete file ${deleteFileName}: ${error.message}`);
      toast.error('Error deleting file ! 🤔');
    }

    if (listFiles && listFiles.length > 0) {
      const newList = listFiles.filter((item) => item !== deleteFileName);
      setListFiles(newList);
    } else {
      setListFiles([]);
      setsearchCode('');
    }
  };

  return (
    <>
      <div className="flex flex-wrap p-12">
        <div className="w-full md:w-1/2 p-3">
          <div className="mx-auto w-full max-w-[850px] bg-white py-6 px-9 dark:bg-[#27292C] rounded-md duration-200 shadow-md dark:shadow-none">
            <div className="mb-6 pt-4">
              <RuningText text="TransShare Uploader" />
              <div className="mb-8">
                <input type="file" onChange={(e) => onFileUpload(e.target.files)} onClick={(e) => (e.currentTarget.value = '')} name="file" id="file" className="sr-only" multiple accept="application/pdf" />
                <label htmlFor="file" className="relative flex min-h-[200px] items-center justify-center rounded-md border border-dashed border-[#e0e0e0] p-12 text-center">
                  <div>
                    <span className="mb-2 block text-xl font-semibold">Drop files here</span>
                    <span className="mb-2 block text-base font-medium">Or</span>
                    <span className="inline-flex rounded border border-[#e0e0e0] py-2 px-7 text-base font-medium">Browse</span>
                  </div>
                </label>
              </div>
              {doneUpload.length > 0
                ? doneUpload.map((file, index) => (
                    <div className="flex justify-between items-center mb-2" key={index}>
                      <div className="text-base font-medium">{file}</div>
                      <div className="text-base font-medium">
                        <button className="mr-4 hover:shadow-form rounded-md bg-red-500 py-2 px-6 text-center text-base font-semibold text-white outline-none" onClick={() => setdoneUpload(doneUpload.filter((item) => item !== file))}>
                          <FaTrash />
                        </button>
                        <button className="mr-4 hover:shadow-form rounded-md bg-[#774FE9] py-2 px-6 text-center text-base font-semibold text-white outline-none" onClick={() => download(file)}>
                          <FaDownload />
                        </button>
                        <button className="mr-4 hover:shadow-form rounded-md bg-[#774FE9] py-2 px-6 text-center text-base font-semibold text-white outline-none" onClick={() => print(file)}>
                          <FaPrint />
                        </button>
                      </div>
                    </div>
                  ))
                : fileList.map((file, index) => (
                    <div className="flex justify-between items-center mb-2" key={index}>
                      <div className="text-base font-medium">{file.name}</div>
                      <div className="text-base font-medium">
                        <button className="mr-4 hover:shadow-form rounded-md bg-red-500 py-2 px-6 text-center text-base font-semibold text-white outline-none" onClick={() => setFileList(fileList.filter((item) => item !== file))}>
                          <FaTrash />
                        </button>
                        <button className="mr-4 hover:shadow-form rounded-md bg-[#774FE9] py-2 px-6 text-center text-base font-semibold text-white outline-none" onClick={() => download(file.name)}>
                          <FaDownload />
                        </button>
                        <button className="mr-4 hover:shadow-form rounded-md bg-[#774FE9] py-2 px-6 text-center text-base font-semibold text-white outline-none" onClick={() => print(file.name)}>
                          <FaPrint />
                        </button>
                      </div>
                    </div>
                  ))}

              <div className="mb-5">
                <label htmlFor="text" className="mb-3 block text-base font-medium">
                  File Code
                </label>
                <input type="text" readOnly name="text" id="text" placeholder="CinC" className="w-full rounded-md border border- bg-[#c0c0c0] py-3 px-6 text-base font-medium outline-none focus:border-[#6A64F1] focus:shadow-md dark:text-black duration-200" onChange={(e) => setFileCode(e.target.value)} value={fileCode} />
              </div>
              <div>
                <button onClick={UploadPdf} className="hover:shadow-form w-full rounded-md bg-[#774FE9] py-3 px-8 text-center text-base font-semibold text-white outline-none">
                  Upload
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="w-full md:w-1/2 p-3">
          <div className="mx-auto w-full max-w-[850px] bg-white py-6 px-9 dark:bg-[#27292C] rounded-md duration-200 shadow-md dark:shadow-none">
            <div className="mb-6 pt-4">
              <RuningText text="TransShare Searcher" />
              <div className="mb-5">
                <label htmlFor="text" className="mb-3 block text-base font-medium">
                  File Code
                </label>
                <input type="text" name="text" id="text" placeholder="CinC" className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium outline-none focus:border-[#6A64F1] focus:shadow-md dark:text-black duration-200" onChange={(e) => setsearchCode(e.target.value)} value={searchCode} />
              </div>
              <div id="listFiles overflow-y-auto h-96">
                {listFiles.map((file, index) => (
                  <div className="flex justify-between items-center mb-2" key={index}>
                    <div className="text-base font-medium">{file}</div>
                    <div className="text-base font-medium">
                      <button className="mr-4 hover:shadow-form rounded-md bg-[#774FE9] py-2 px-6 text-center text-base font-semibold text-white outline-none" onClick={() => deleteFile(file)}>
                        <FaTrash />
                      </button>
                      <button className="mr-4 hover:shadow-form rounded-md bg-[#774FE9] py-2 px-6 text-center text-base font-semibold text-white outline-none" onClick={() => download(file)}>
                        <FaDownload />
                      </button>
                      <button className="mr-4 hover:shadow-form rounded-md bg-[#774FE9] py-2 px-6 text-center text-base font-semibold text-white outline-none" onClick={() => print(file)}>
                        <FaPrint />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              <div>
                <button onClick={search} className="hover:shadow-form w-full rounded-md bg-[#774FE9] py-3 px-8 text-center text-base font-semibold text-white outline-none">
                  Search
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PrintPdf;
