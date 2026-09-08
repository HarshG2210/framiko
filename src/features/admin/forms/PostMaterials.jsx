// src/components/admin/PostMaterials.jsx

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
  Tr,
} from "@chakra-ui/react";
import { DeleteIcon, EditIcon } from "@chakra-ui/icons";
import { ToastContainer, toast } from "react-toastify";
import {
  deleteMaterial,
  fetchMaterials,
  postMaterial,
  updateMaterial,
} from "../../../redux/slices/materialsSlice";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";

const PostMaterials = () => {
  const dispatch = useDispatch();
  const {
    materials = [],
    loading,
    error,
  } = useSelector((state) => state.materials || {});

  /* 🔥 pagination + selection */
  const table = useAdminTable(materials, 5);

  const [tabIndex, setTabIndex] = useState(0);
  const [editing, setEditing] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    image: null,
  });

  useEffect(() => {
    dispatch(fetchMaterials());
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.description) {
      toast.error("Please fill all required fields.");
      return;
    }

    try {
      if (editing) {
        await dispatch(
          updateMaterial({
            id: editing.id,
            name: formData.name,
            description: formData.description,
            image: formData.image,
          }),
        ).unwrap();
        toast.success("Material updated");
      } else {
        const fd = new FormData();
        fd.append("name", formData.name);
        fd.append("description", formData.description);
        if (formData.image instanceof File) fd.append("image", formData.image);

        await dispatch(postMaterial(fd)).unwrap();
        toast.success("Material added");
      }

      dispatch(fetchMaterials());
      resetForm();
      setTabIndex(0);
    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = (m) => {
    setEditing(m);
    setFormData({
      name: m.name || "",
      description: m.description || "",
      image: m.image || null,
    });
    setTabIndex(1);
  };

  const handleDelete = async (id) => {
    await dispatch(deleteMaterial(id)).unwrap();
    dispatch(fetchMaterials());
    toast.success("Material deleted");
  };

  const handleBulkDelete = async () => {
    await Promise.all(
      [...table.selected].map((id) => dispatch(deleteMaterial(id))),
    );
    table.clearAll();
    dispatch(fetchMaterials());
    toast.success("Selected materials deleted");
  };

  return (
    <AdminPage
      title="Material Management"
      description="Control the materials used in frames and their pricing impact."
    >
      <Tabs index={tabIndex} onChange={setTabIndex} variant="unstyled" isFitted>
        <TabList mb={4} bg="whiteAlpha.50" borderRadius="full" p="2px">
          <Tab _selected={{ bg: "white", color: "black" }}>Materials</Tab>
          <Tab _selected={{ bg: "white", color: "black" }}>
            {editing ? "Edit Material" : "Add Material"}
          </Tab>
        </TabList>

        <TabPanels>
          {/* ================= TABLE ================= */}
          <TabPanel px={0}>
            <AdminTableShell title="All Materials">
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
                        <Th>Image</Th>
                        <Th>Actions</Th>
                      </Tr>
                    </Thead>

                    <Tbody>
                      {table.paginatedData.map((m) => (
                        <Tr key={m.id}>
                          <Td>
                            <Checkbox
                              isChecked={table.selected.has(m.id)}
                              onChange={() => table.toggleRow(m.id)}
                            />
                          </Td>
                          <Td>{m.id}</Td>
                          <Td>{m.name}</Td>
                          <Td>
                            <Text noOfLines={2}>{m.description}</Text>
                          </Td>
                          <Td>
                            {m.image && (
                              <Image
                                src={m.image}
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
                              onClick={() => handleEdit(m)}
                            />
                            <IconButton
                              size="xs"
                              colorScheme="red"
                              icon={<DeleteIcon />}
                              onClick={() => handleDelete(m.id)}
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
              title={editing ? "Edit Material" : "Add Material"}
              description="Define frame materials and how they affect the price."
              footer={
                <Flex gap={3}>
                  <Button
                    type="submit"
                    form="material-form"
                    // bg="white"
                    // color="black"
                    // _hover={{ bg: "whiteAlpha.800" }}
                    isLoading={loading}
                  >
                    {editing ? "Update Material" : "Create Material"}
                  </Button>
                  {editing && (
                    <Button variant="ghost" onClick={resetForm}>
                      Cancel
                    </Button>
                  )}
                </Flex>
              }
            >
              <form id="material-form" onSubmit={handleSubmit}>
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

                    <FormControl>
                      <FormLabel>Image</FormLabel>
                      <Input
                        type="file"
                        name="image"
                        accept="image/*"
                        onChange={handleChange}
                      />
                      {formData.image && formData.image instanceof File && (
                        <Image
                          mt={2}
                          src={URL.createObjectURL(formData.image)}
                          alt="Preview"
                          boxSize="80px"
                          objectFit="cover"
                          borderRadius="md"
                        />
                      )}
                      {!formData.image && editing?.image && (
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

                  <Flex flex="1" direction="column" gap={3}>
                    <FormControl isRequired>
                      <FormLabel>Description</FormLabel>
                      <Input
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                      />
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

export default PostMaterials;
