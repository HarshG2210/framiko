// src/components/admin/PostBackgrounds.jsx

import "react-toastify/dist/ReactToastify.css";

import {
  AdminFormShell,
  AdminPage,
  AdminTableShell,
  AdminTableWithPagination,
  useAdminTable,
} from "../../../layout/AdminUI";
import {
  Button,
  Checkbox,
  Flex,
  FormControl,
  FormLabel,
  IconButton,
  Image,
  Input,
  Spinner,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Table,
  Tabs,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tooltip,
  Tr,
} from "@chakra-ui/react";
import { DeleteIcon, EditIcon } from "@chakra-ui/icons";
import { ToastContainer, toast } from "react-toastify";
import {
  deleteBackground,
  fetchBackgrounds,
  postBackground,
  updateBackground,
} from "../../../redux/slices/backgroundsSlice";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";

const PostBackgrounds = () => {
  const dispatch = useDispatch();
  const {
    backgrounds = [],
    loading,
    error,
  } = useSelector((state) => state.backgrounds || {});

  /* 🔥 pagination + selection */
  const table = useAdminTable(backgrounds, 5);

  const [tabIndex, setTabIndex] = useState(0);
  const [editing, setEditing] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    image: null,
  });

  useEffect(() => {
    dispatch(fetchBackgrounds());
  }, [dispatch]);

  const resetForm = () => {
    setEditing(null);
    setFormData({
      name: "",
      description: "",
      image: null,
    });
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image" && files && files[0]) {
      setFormData((p) => ({ ...p, image: files[0] }));
    } else {
      setFormData((p) => ({ ...p, [name]: value }));
    }
  };

  const buildFormData = (data) => {
    const fd = new FormData();
    fd.append("name", data.name);
    fd.append("description", data.description);
    if (data.image instanceof File) fd.append("image", data.image);
    return fd;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.description) {
      toast.error("Please fill all required fields.");
      return;
    }

    try {
      if (editing) {
        await dispatch(
          updateBackground({
            id: editing.id,
            name: formData.name,
            description: formData.description,
            image: formData.image || editing.image,
          })
        ).unwrap();
        toast.success("Background updated");
      } else {
        await dispatch(postBackground(buildFormData(formData))).unwrap();
        toast.success("Background added");
      }

      dispatch(fetchBackgrounds());
      resetForm();
      setTabIndex(0);
    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = (b) => {
    setEditing(b);
    setFormData({
      name: b.name || "",
      description: b.description || "",
      image: b.image || null,
    });
    setTabIndex(1);
  };

  const handleDelete = async (id) => {
    await dispatch(deleteBackground(id)).unwrap();
    dispatch(fetchBackgrounds());
    toast.success("Background deleted");
  };

  const handleBulkDelete = async () => {
    await Promise.all(
      [...table.selected].map((id) => dispatch(deleteBackground(id)))
    );
    table.clearAll();
    dispatch(fetchBackgrounds());
    toast.success("Selected backgrounds deleted");
  };

  return (
    <AdminPage
      title="Background Management"
      description="Define styled backgrounds customers can choose for frames."
    >
      <Tabs index={tabIndex} onChange={setTabIndex} variant="unstyled" isFitted>
        <TabList mb={4} bg="whiteAlpha.50" borderRadius="full" p="2px">
          <Tab _selected={{ bg: "white", color: "black" }}>Backgrounds</Tab>
          <Tab _selected={{ bg: "white", color: "black" }}>
            {editing ? "Edit Background" : "Add Background"}
          </Tab>
        </TabList>

        <TabPanels>
          {/* ================= TABLE ================= */}
          <TabPanel px={0}>
            <AdminTableShell title="All Backgrounds">
              {loading ? (
                <Flex justify="center" py={8}>
                  <Spinner />
                </Flex>
              ) : error ? (
                <Text color="red.400">{error}</Text>
              ) : (
                <AdminTableWithPagination
                  table={table}
                  selectedCount={table.selected.size}
                  onDeleteSelected={handleBulkDelete}
                  page={table.page}
                  setPage={table.setPage}
                  totalPages={table.totalPages}
                >
                  <Table size="sm">
                    <Thead>
                      <Tr>
                        <Th>
                          <Checkbox
                            isChecked={table.isAllCurrentPageSelected}
                            onChange={table.selectAllCurrentPage}
                          />
                        </Th>
                        <Th>ID</Th>
                        <Th>Name</Th>
                        <Th>Description</Th>
                        <Th>Preview</Th>
                        <Th>Actions</Th>
                      </Tr>
                    </Thead>

                    <Tbody>
                      {table.paginatedData.map((b) => (
                        <Tr key={b.id}>
                          <Td>
                            <Checkbox
                              isChecked={table.selected.has(b.id)}
                              onChange={() => table.toggleRow(b.id)}
                            />
                          </Td>
                          <Td>{b.id}</Td>
                          <Td>{b.name}</Td>
                          <Td maxW="220px">
                            <Text noOfLines={2}>{b.description}</Text>
                          </Td>
                          <Td>
                            {b.image && (
                              <Image
                                src={b.image}
                                boxSize="48px"
                                objectFit="cover"
                                borderRadius="md"
                              />
                            )}
                          </Td>
                          <Td>
                            <IconButton
                              size="xs"
                              icon={<EditIcon />}
                              mr={2}
                              onClick={() => handleEdit(b)}
                            />
                            <IconButton
                              size="xs"
                              colorScheme="red"
                              icon={<DeleteIcon />}
                              onClick={() => handleDelete(b.id)}
                            />
                          </Td>
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>
                </AdminTableWithPagination>
              )}
            </AdminTableShell>
          </TabPanel>

          {/* ================= FORM ================= */}
          <TabPanel px={0}>
            <AdminFormShell
              title={editing ? "Edit Background" : "Add Background"}
              description="Upload textured or solid color backgrounds."
              footer={
                <Flex gap={3}>
                  <Button
                    type="submit"
                    form="background-form"
                    // bg="white"
                    // color="black"
                    // _hover={{ bg: "whiteAlpha.800" }}
                    isLoading={loading}
                  >
                    {editing ? "Update Background" : "Create Background"}
                  </Button>
                  {editing && (
                    <Button variant="ghost" onClick={resetForm}>
                      Cancel
                    </Button>
                  )}
                </Flex>
              }
            >
              <form id="background-form" onSubmit={handleSubmit}>
                <Flex direction={{ base: "column", md: "row" }} gap={4}>
                  <Flex flex="1" direction="column" gap={3}>
                    <FormControl isRequired>
                      <FormLabel>Name</FormLabel>
                      <Input
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                      />
                    </FormControl>

                    <FormControl isRequired>
                      <FormLabel>Description</FormLabel>
                      <Input
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                      />
                    </FormControl>
                  </Flex>

                  <Flex flex="1" direction="column" gap={3}>
                    <FormControl>
                      <FormLabel>Image</FormLabel>
                      <Input
                        type="file"
                        name="image"
                        accept="image/*"
                        onChange={handleChange}
                      />
                      {editing?.image && !formData.image && (
                        <Image
                          mt={2}
                          src={editing.image}
                          alt={editing.name}
                          boxSize="80px"
                          objectFit="cover"
                          borderRadius="md"
                        />
                      )}
                    </FormControl>
                  </Flex>
                </Flex>
              </form>
            </AdminFormShell>
          </TabPanel>
        </TabPanels>
      </Tabs>

      <ToastContainer style={{ top: "70px" }} />
    </AdminPage>
  );
};

export default PostBackgrounds;
