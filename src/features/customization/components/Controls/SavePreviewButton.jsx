import { Button } from "@chakra-ui/react";
import { submitCustomizedFinalImage } from "../../../../redux/slices/customizedFinalImageSlice";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";

const SavePreviewButton = () => {
  const dispatch = useDispatch();

  const handleSave = async () => {
    try {
      const canvas = document.querySelector("#export-stage canvas");

      if (!canvas) {
        toast.error("Preview not ready");
        return;
      }

      const dataUrl = canvas.toDataURL("image/png", 1.0);

      const response = await dispatch(
        submitCustomizedFinalImage({
          final_image: dataUrl,
          is_completed: true,
        })
      ).unwrap();

      console.log("Saved Customized Artwork:", response);

      toast.success("Preview saved successfully");
    } catch (error) {
      console.error(error);
      toast.error("Failed to save preview");
    }
  };

  return (
    <Button colorScheme="purple" onClick={handleSave}>
      Save Preview
    </Button>
  );
};

export default SavePreviewButton;
