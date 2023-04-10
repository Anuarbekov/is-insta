import Box from "@mui/material/Box";
import FormControl from "@mui/material/FormControl";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import axios from "axios";
import { DropzoneArea } from "material-ui-dropzone";
import Head from "next/head";
import { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { v4 as uuidv4 } from "uuid";
import { GetContextSize } from "../components/ContextSize";
import Description from "../components/Description";
import { firebaseConfig } from "../utils/connectFirebase";
import Script from "next/script";
const Index = () => {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    document.body.style.height = "100vh";
  });
  const { resolution, handleSizeChange } = GetContextSize();
  const [images, setImages] = useState([]);
  const collection_name = uuidv4();
  const customId = "custom-id-yes";

  const uploadImages = async () => {
    await axios.post(
      `api/add-resol/${collection_name}`,
      { resolution: resolution },
      {
        "Content-Type": "application/json",
      }
    );
    const closeToast = async () => {
      toast.dismiss();
    };
    let promise = images.map((image) => {
      initializeApp(firebaseConfig);
      const name = image.name;
      const storage = getStorage();
      const storageRef = ref(storage, `images/${name}`);
      const uploadTask = uploadBytesResumable(storageRef, image);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          var progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log("Upload is " + progress + "% done");
        },
        (err) => {
          console.log("error", err);
          reject();
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            const data = {
              name: name,
              url: downloadURL,
            };
            axios.post(`api/add/${collection_name}`, data, {
              "Content-Type": "application/json",
            });
          });
        }
      );
    });
    Promise.all(promise).then(() => {
      console.log("UPLOADFIREBASE IS ENDED");
      closeToast();
      navigator.clipboard.writeText(
        "http:/localhost:3000/photos/" + collection_name
      );
      toast.success("URL copied to your clipboard!", {
        position: "top-right",
        autoClose: 2500,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: false,
        progress: undefined,
      });
    });
  };
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
        toast.loading("Uploading...", {
          position: "top-right",
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: false,
          progress: undefined,
          toastId: customId,
        });
        await uploadImages();
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
        <Script
          src="https://kit.fontawesome.com/e35f419637.js"
          crossOrigin="anonymous"
          async
        />
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
