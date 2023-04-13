import dynamic from "next/dynamic";
const Box = dynamic(() => import("@mui/material/Box"));
const FormControl = dynamic(() => import("@mui/material/FormControl"));
const MenuItem = dynamic(() => import("@mui/material/MenuItem"));
const Select = dynamic(() => import("@mui/material/Select"));
const Description = dynamic(() => import("../components/Description"));
const Head = dynamic(() => import("next/head"));
import { DropzoneArea } from "material-ui-dropzone";
import axios from "axios";
import { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { v4 as uuidv4 } from "uuid";
import { convertToBase64 } from "../utils/utils";

const Index = () => {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    document.body.style.height = "100vh";
  });
  const [resolution, setResolution] = useState("");

  const [images, setImages] = useState([]);
  const customId = "custom-id-yes";

  const handleSizeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setResolution(event.target.value);
  };

  const uploadImages = async () => {
    const collection_id = uuidv4();
    const promiseArray = images.map((item) => {
      return new Promise(async (resolve, reject) => {
        return resolve(await convertToBase64(item));
      });
    });

    Promise.all(promiseArray).then((base64Images) => {
      axios
        .post(`http://localhost:8080/uploads`, {
          base64Images: base64Images,
          collection_id,
          resolution: resolution,
        })
        .then((res) => {
          console.log(res);
          toast.dismiss();
          navigator.clipboard.writeText(
            "http://localhost:3000/photos/" + collection_id
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
    });
  };

  const handleChange = (uploadFiles: File[]) => {
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
      </Head>
      <div className="body">
        <div className="main-text">
          <h1>IsInsta</h1>
        </div>
        <div className="description">
          <ToastContainer theme="dark" />
          <Description />
        </div>
        {images.map((image) => image.name)}
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
