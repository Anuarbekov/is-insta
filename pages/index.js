import { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";
import { firebaseConfig } from "../utils/connectFirebase";
import { DropzoneArea } from "material-ui-dropzone";
import Head from "next/head";
import useClipboard from "react-use-clipboard";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import { initializeApp } from "firebase/app";
import Description from "../components/Description";
import UrlCard from "../components/UrlCard";
import Box from "@mui/material/Box";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { getContextSize } from "../components/ContextSize";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const Index = () => {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    document.body.style.height = "100vh";
  });
  const { resolution, handleSizeChange } = getContextSize();
  const [images, setImages] = useState([]);
  const [urlToFriends, setUrlToFriends] = useState("");
  const [urlAnim, seturlAnim] = useState("Url to share will be here");
  const [isUrlExist, setIsUrlExist] = useState(false);
  const collection_name = uuidv4();
  const [isCopied, setCopied] = useClipboard(urlToFriends);
  const customId = "custom-id-yes";
  const handleChange = (uploadFiles) => {
    if (uploadFiles) {
      const files = [...uploadFiles];
      files.map((file) => {
        setImages((prevImages) => [...prevImages, file]);
      });
    }
  };
  const handleUpload = async () => {
    if (images.length >= 1) {
      images.map(async (image) => {
        initializeApp(firebaseConfig);
        const name = image.name;
        const storage = getStorage();
        const storageRef = ref(storage, `images/${name}`);
        const uploadTask = uploadBytesResumable(storageRef, image);
        uploadTask.on(
          "state_changed",
          (snapshot) => {},
          (error) => {
            console.log(error);
          },
          async () => {
            const headers = {
              "Content-Type": "application/json",
            };
            await getDownloadURL(uploadTask.snapshot.ref).then(
              async (downloadURL) => {
                const data = {
                  name: name,
                  url: downloadURL,
                };
                await axios.post(`api/add/${collection_name}`, data, headers);
              }
            );
          }
        );
      });
      toast.loading("Uploading...", {
        position: "top-right",
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: false,
        progress: undefined,
        toastId: customId,
      });
      function closeToast() {
        toast.dismiss();
      }
      setTimeout(closeToast, 4600);
      function uploadedToast() {
        toast.success("Photos uploaded, copy the URL!", {
          position: "top-right",
          autoClose: 2500,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: false,
          progress: undefined,
        });
      }
      setTimeout(uploadedToast, 4800);
      setTimeout(setUrlToSend, 5500);
    } else {
      toast.warn("Upload at least one image !", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: false,
        progress: undefined,
        toastId: customId,
      });
    }
  };
  const setUrlToSend = () => {
    setUrlToFriends("/photos/" + collection_name);
    seturlAnim("Click here to copy URL.");
    setIsUrlExist(true);
  };
  const copyUrl = (e, callback) => {
    e.preventDefault();
    if (isUrlExist) {
      toast.success("Copied to clipboard!", {
        position: "top-right",
        autoClose: 1000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: false,
        progress: undefined,
        toastId: customId,
      });
      callback();
    } else {
      toast.warn("Upload at least one image!", {
        position: "top-right",
        autoClose: 1000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: false,
        progress: undefined,
        toastId: customId,
      });
    }
  };
  return (
    <>
      <Head>
        <title>IsInsta</title>
        <script
          src="https://kit.fontawesome.com/e35f419637.js"
          crossOrigin="anonymous"
        ></script>
      </Head>
      <div className="body">
        <div className="main-text">
          <h1>IsInsta</h1>
        </div>
        <div className="description">
          <ToastContainer theme="dark" />
          <Description />
        </div>
        <div className="upload-zone">
          <DropzoneArea
            dropzoneParagraphClass="dropzone-text"
            dropzoneClass="dropzone"
            dropzoneText={"Drag and drop images here or click"}
            onChange={handleChange}
            filesLimit={15}
            showPreviews={false}
            maxFileSize={10000000}
            showPreviewsInDropzone={false}
          />

          <Box sx={{ marginTop: "1.4em" }}>
            <FormControl fullWidth>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={resolution}
                onChange={handleSizeChange}
                sx={{ color: "white" }}
              >
                <MenuItem value={"square"}>1x1 (Square)</MenuItem>
                <MenuItem value={"vertical"}>4x5 (Vertical)</MenuItem>
              </Select>
            </FormControl>
          </Box>
          <button onClick={handleUpload} className="upload-button">
            Upload
          </button>
        </div>
        <div
          className="url-zone"
          onClick={(e) => {
            copyUrl(e, setCopied);
          }}
        >
          <UrlCard urlToFriend={urlAnim} isUrlExist={isUrlExist} />
        </div>
      </div>
    </>
  );
};

export default Index;
