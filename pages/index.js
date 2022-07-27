import { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";
import { firebaseConfig } from "../utils/connectFirebase";
import { DropzoneArea } from "material-ui-dropzone";
import Head from "next/head";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import { initializeApp } from "firebase/app";
import Description from "../components/Description";
import Box from "@mui/material/Box";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { GetContextSize } from "../components/ContextSize";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const Index = () => {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    document.body.style.height = "100vh";
  });
  const { resolution, handleSizeChange } = GetContextSize();
  const [images, setImages] = useState([]);
  const collection_name = uuidv4();
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
    if (resolution.length < 2) {
      toast.warn("Choose resolution please !", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: false,
        progress: undefined,
        toastId: customId,
      });
    } else {
      if (images.length >= 1) {
        const headers = {
          "Content-Type": "application/json",
        };
        axios.post(
          `api/add-resol/${collection_name}`,
          { resolution: resolution },
          headers
        );
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
            () => {
              getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                const data = {
                  name: name,
                  url: downloadURL,
                };
                axios.post(`api/add/${collection_name}`, data, headers);
              });
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
        async function closeToast() {
          toast.dismiss();
        }
        setTimeout(() => {
          closeToast().then(
            navigator.clipboard
              .writeText(
                "https://is-insta.vercel.app/photos/" + collection_name
              )
              .then(
                toast.success("URL copied to your clipboard!", {
                  position: "top-right",
                  autoClose: 2500,
                  hideProgressBar: true,
                  closeOnClick: true,
                  pauseOnHover: false,
                  draggable: false,
                  progress: undefined,
                })
              )
              .catch(() => {
                alert("Something gone wrong");
              })
          );
        }, 9000);
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
    }
  };

  return (
    <>
      <Head>
        <title>IsInsta</title>
        <script
          src="https://kit.fontawesome.com/e35f419637.js"
          crossOrigin="anonymous"
          async
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
            dropzoneText={"Drag images here or click"}
            onChange={handleChange}
            filesLimit={15}
            showPreviews={false}
            maxFileSize={10000000}
            showPreviewsInDropzone={false}
          />
          <h4>Choose resolution:</h4>
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
            Get a link
          </button>
        </div>
      </div>
    </>
  );
};

export default Index;
