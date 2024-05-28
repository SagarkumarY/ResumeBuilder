import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import React, { useEffect, useState } from "react";
import { FaTrash, FaUpload } from "react-icons/fa";
import { PuffLoader } from "react-spinners";
import { toast } from "react-toastify";
import { db, storage } from "../config/firebase.config";
import { adminIds, initialTags } from "../utils/helpers";
import { serverTimestamp, setDoc, doc, deleteDoc } from "firebase/firestore";
import useTemplates from "../hooks/userTemplates";
import useUser from "../hooks/useUser";
import { useNavigate } from "react-router-dom";

function CreateTemplate() {
  const [formData, setFormData] = useState({
    title: "",
    imageURL: "",
  });

  const [imageAsset, setImageAsset] = useState({
    isImageLoading: false,
    url: null,
    progress: 0,
  });

  const [selectedTags, setSelectedTags] = useState([]);

  const {
    data: template,
    isLoading: templateIsLoading,
    isError: templateIsError,
    refetch: templateReFatch,
  } = useTemplates();

  const {data: user, isLoading} = useUser();
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileSelect = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImageAsset((prevState) => ({ ...prevState, isImageLoading: true }));

    if (file && isAllowed(file)) {
      const storageRef = ref(storage, `tamplate/${Date.now()}-${file.name}`);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          setImageAsset((prevState) => ({
            ...prevState,
            progress: (snapshot.bytesTransferred / snapshot.totalBytes) * 100,
          }));
        },
        (error) => {
          if (error.message.includes("storage/unauthorized")) {
            toast.error("You don't have permission to upload this file");
          } else {
            toast.error(`Error : ${error.message}`);
          }
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            setImageAsset((prevState) => ({ ...prevState, url: downloadURL }));
          });
          toast.success("Image uploaded successfully");

          setTimeout(() => {
            setImageAsset((prevState) => ({
              ...prevState,
              isImageLoading: false,
              progress: 0,
            }));
          }, [2000]);
        }
      );
    } else {
      toast.info("Invalid file format");
    }
  };

  const deleteAnImageObject = async () => {
    if (!imageAsset.url) return;

    const storageRef = ref(storage, imageAsset.url);

    deleteObject(storageRef)
      .then(() => {
        setImageAsset({
          isImageLoading: false,
          url: null,
          progress: 0,
        });
        setFormData((prevData) => ({ ...prevData, imageURL: "" }));
        toast.success("Image deleted successfully");
      })
      .catch((error) => {
        toast.error(`Error: ${error.message}`);
      });
  };

  const isAllowed = (file) => {
    const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
    return allowedTypes.includes(file.type);
  };

  const hanldeSelectedTags = (Tag) => {
    // Check if the selected tag is selected or not

    if (selectedTags.includes(Tag)) {
      // if selected than remove
      setSelectedTags(selectedTags.filter((tag) => tag !== Tag));
    } else {
      setSelectedTags([...selectedTags, Tag]);
    }
  };

  const pushToCloud = async () => {
    const timestamp = serverTimestamp();
    const id = `${Date.now()}`;
    const _doc = {
      _id: id,
      title: formData.title,
      imageURL: imageAsset.url,
      tags: selectedTags,
      name:
        template && template.length > 0
          ? `${template.length + 1} `
          : "Template1",
      timestamp: timestamp,
    };
    await setDoc(doc(db, "templates", id), _doc)
      .then(() => {
        setFormData((prevData) => ({ ...prevData, title: "", imageURL: "" }));
        setImageAsset((prevAsset) => ({ ...prevAsset, url: null }));
        setSelectedTags([]);
        templateReFatch();
        toast.success("Data push to the cloud!");
      })
      .catch((error) => {
        toast.error(`Error: ${error.message}`);
      });
  };

  const removeTemplate = async (template) => {
    try {
      const deleteRef = ref(storage, template?.imageURL);
      await deleteObject(deleteRef)
        .then(async () => {
          await deleteDoc(doc(db, "templates", template?._id));
          toast.success("Template deleted successfully");
          templateReFatch();
        })
        .catch((error) => {
          toast.error(`Error: ${error.message}`);
        });
    } catch (error) {
      console.log(`Error deleting template ${error.message}`);
    }
  };

  useEffect(() => {
   if(!isLoading && !adminIds.includes(user?.uid)){
    navigate("/" , {replace:true})
   }
  }, [user, isLoading])
  

  return (
    <div className=" w-full px-4 lg:px-10 2xl:px-32 py-4 grid grid-cols-1 lg:grid-cols-12">
      {/* {"Left Container"} */}
      <div className=" col-span-12 lg:col-span-4 2xl:col-span-3 w-full flex-1 flex flex-col items-center justify-start gap-4 px-2">
        <div className="w-full">
          <p className=" text-lg text-textPrimary">Create a new Template</p>
        </div>
        {/* {"Template Id section"} */}
        <div className="w-full flex items-center justify-end ">
          <p className=" text-base text-textLight uppercase font-semibold">
            TempID: {""}
          </p>
          <p className=" text-sm text-textDark  capitalize font-bold">
            {template && template.length > 0
              ? `${template.length + 1} `
              : "Template1"}
          </p>
        </div>
        {/* {"Template Title section"} */}
        <input
          type="text"
          placeholder="Template Title"
          className="w-full px-4 py-3 rounded-md bg-transparent border border-gray-300 text-lg text-textPrimary focus:text-textDark focus:shadow-md outline-none "
          name="title"
          value={formData.title}
          onChange={handleInputChange}
        />

        {/* {"File uploader section"} */}
        <div className="w-full bg-gray-100 backdrop-blur-md h-[420px] lg:h-[620px] 2xl:h-[730px] rounded-md border-2 border-dotted border-gray-300 cursor-pointer flex items-center justify-center">
          {imageAsset.isImageLoading ? (
            <React.Fragment>
              <div className="flex flex-col items-center justify-center gap-4">
                <PuffLoader color="#498FCD" size={40} />
                <p>{imageAsset?.progress.toFixed(2)}%</p>
              </div>
            </React.Fragment>
          ) : (
            <React.Fragment>
              {!imageAsset?.url ? (
                <React.Fragment>
                  <label
                    htmlFor="fileUpload"
                    className=" cursor-pointer w-full h-full"
                  >
                    <div className=" h-full w-full flex items-center justify-center flex-col">
                      <div className=" flex items-center justify-center cursor-pointer flex-col gap-4">
                        <FaUpload className="text-2xl" />
                        <p className=" text-lg text-textPrimary">
                          Click To Upload
                        </p>
                      </div>
                    </div>
                    {/* <input className="w-0 h-0" type="file"  accept=".png, .jpg, .jpeg" id="" onChange={handleFileSelect}/> */}
                    <input
                      id="fileUpload"
                      type="file"
                      accept=".png, .jpg, .jpeg"
                      className="hidden"
                      onChange={handleFileSelect}
                    />
                  </label>
                </React.Fragment>
              ) : (
                <React.Fragment>
                  <div className=" relative w-full h-full overflow-hidden rounded-md">
                    <img
                      src={imageAsset?.url}
                      alt=""
                      className=" w-full h-full  object-contain"
                      loading="lazy"
                    />

                    {/* {"Delete Action"} */}
                    <div
                      onClick={deleteAnImageObject}
                      className=" absolute top-4 right-4 w-8 h-8 rounded-md flex justify-center items-center bg-red-500 cursor-pointer"
                    >
                      <FaTrash className=" text-sm text-white" />
                    </div>
                  </div>
                </React.Fragment>
              )}
            </React.Fragment>
          )}
        </div>

        {/* {"Tags"} */}
        <div className="w-full flex items-center flex-wrap gap-2">
          {initialTags.map((tag, i) => (
            <div
              key={i}
              onClick={() => hanldeSelectedTags(tag)}
              className={`border border-gray-300 py-1 px-2  rounded-md cursor-pointer ${
                selectedTags.includes(tag) ? "bg-blue-500 text-white" : " "
              } `}
            >
              <p className=" text-sm">{tag}</p>
            </div>
          ))}
        </div>

        {/* {'Button Action'} */}
        <button
          type="button"
          className=" w-full bg-blue-700 text-white rounded-md py-3"
          onClick={pushToCloud}
        >
          Save
        </button>
      </div>

      {/* {"right Container"} */}
      <div className="col-span-12 lg:col-span-8 2xl:col-span-9 w-full px-2 py-4 flex-1">
        {templateIsLoading ? (
          <React.Fragment>
            <div className=" w-full h-full flex items-center justify-center">
              <PuffLoader color="#498FCD" size={40} />
            </div>
          </React.Fragment>
        ) : (
          <React.Fragment>
            {template && template.length > 0 ? (
              <React.Fragment>
                <div className=" w-full h-full grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-4 gap-4">
                  {template?.map((template) => (
                    <div
                      key={template._id}
                      className="w-full h-[500px] rounded-md relative overflow-hidden bg-red-800 "
                    >
                      <img
                        src={template?.imageURL}
                        alt=""
                        className=" w-full h-full  object-cover "
                      />
                      <div
                        onClick={() => removeTemplate(template)}
                        className=" absolute top-4 right-4 w-8 h-8 rounded-md flex justify-center items-center bg-red-500 cursor-pointer"
                      >
                        <FaTrash className=" text-sm text-white" />
                      </div>
                    </div>
                  ))}
                </div>
              </React.Fragment>
            ) : (
              <React.Fragment>
                <div className=" w-full h-[100vh] flex justify-center items-center">
                  <PuffLoader color="#498FCD" size={40} />
                  <p className=" text-xl tracking-wider capitalize text-textPrimary">
                    No data
                  </p>
                </div>
              </React.Fragment>
            )}
          </React.Fragment>
        )}
      </div>
    </div>
  );
}

export default CreateTemplate;
