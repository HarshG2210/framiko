// src/components/admin/GetCustomizedFinalImage.jsx

import "react-toastify/dist/ReactToastify.css";

import {
  AdminPage,
  AdminTableShell,
  AdminTableWithPagination,
  useAdminTable,
} from "../../../layout/AdminUI";
import {
  Box,
  Checkbox,
  Flex,
  Image,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Spinner,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useDisclosure,
} from "@chakra-ui/react";
import { ToastContainer, toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";

import { fetchCustomizedFinalImage } from "../../../redux/slices/customizedFinalImageSlice";

const GetCustomizedFinalImage = () => {
  const dispatch = useDispatch();

  const { isOpen, onOpen, onClose } = useDisclosure();

  const [selectedImage, setSelectedImage] = useState(null);

  const handleImagePreview = (imageUrl) => {
    setSelectedImage(imageUrl);
    onOpen();
  };

  const {
    customizedImage = [],
    loading,
    error,
  } = useSelector((state) => state.customizedFinalImage);

  const items = Array.isArray(customizedImage)
    ? customizedImage
    : customizedImage
    ? [customizedImage]
    : [];

  const table = useAdminTable(items, 5);

  useEffect(() => {
    dispatch(fetchCustomizedFinalImage());
  }, [dispatch]);

  const handleBulkDelete = async () => {
    try {
      table.clearAll();
      toast.success("Selected images deleted");
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete selected images");
    }
  };

  return (
    <AdminPage
      title="Customized Final Images"
      description="View all finalized customized frame previews."
    >
      <AdminTableShell title="Customized Images">
        {loading ? (
          <Flex justify="center" py={8}>
            <Spinner />
          </Flex>
        ) : error ? (
          <Text color="red.400" p={4}>
            {typeof error === "string" ? error : JSON.stringify(error)}
          </Text>
        ) : items.length === 0 ? (
          <Text p={4}>No customized images found.</Text>
        ) : (
          <AdminTableWithPagination
            table={table}
            selectedCount={table.selected.size}
            onDeleteSelected={handleBulkDelete}
            page={table.page}
            setPage={table.setPage}
            totalPages={table.totalPages}
          >
            <Box overflowX="auto">
              <Table variant="simple" size="sm">
                <Thead>
                  <Tr>
                    <Th>
                      <Checkbox
                        isChecked={table.isAllCurrentPageSelected}
                        onChange={table.selectAllCurrentPage}
                      />
                    </Th>

                    <Th>ID</Th>
                    <Th>Preview</Th>
                    <Th>Completed</Th>
                    <Th>Created At</Th>
                  </Tr>
                </Thead>

                <Tbody>
                  {table.paginatedData.map((it) => (
                    <Tr key={it.id}>
                      <Td>
                        <Checkbox
                          isChecked={table.selected.has(it.id)}
                          onChange={() => table.toggleRow(it.id)}
                        />
                      </Td>

                      <Td>{it.id}</Td>
                      <Td>
                        {it.final_image ? (
                          <Image
                            src={it.final_image}
                            alt={`Final ${it.id}`}
                            boxSize="64px"
                            objectFit="cover"
                            borderRadius="md"
                            cursor="pointer"
                            onClick={() => handleImagePreview(it.final_image)}
                            fallback={<Text fontSize="xs">Loading...</Text>}
                          />
                        ) : (
                          <Text fontSize="xs">No Image</Text>
                        )}
                      </Td>

                      <Td>{it.is_completed ? "Yes" : "No"}</Td>

                      <Td>{it.created_at}</Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </Box>
          </AdminTableWithPagination>
        )}
      </AdminTableShell>
      <Modal isOpen={isOpen} onClose={onClose} size="6xl" isCentered>
        <ModalOverlay />

        <ModalContent>
          <ModalHeader>Image Preview</ModalHeader>

          <ModalCloseButton />

          <ModalBody pb={6}>
            {selectedImage && (
              <Image
                src={selectedImage}
                alt="Preview"
                width="100%"
                maxH="80vh"
                objectFit="contain"
              />
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
      <ToastContainer style={{ top: "70px" }} />
    </AdminPage>
  );
};

export default GetCustomizedFinalImage;
