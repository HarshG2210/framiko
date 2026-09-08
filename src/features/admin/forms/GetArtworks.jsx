import "react-toastify/dist/ReactToastify.css";

import {
  AdminPage,
  AdminTableShell,
  AdminTableWithPagination,
  useAdminTable,
} from "../../../layout/AdminUI";
import {
  Badge,
  Box,
  Checkbox,
  Flex,
  IconButton,
  Image,
  Spinner,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tooltip,
  Tr,
} from "@chakra-ui/react";
import { ToastContainer, toast } from "react-toastify";
import {
  bulkDeleteArtworks,
  deleteArtwork,
  fetchArtworks,
} from "../../../redux/slices/artworksSlice";
import { useDispatch, useSelector } from "react-redux";

import { DeleteIcon } from "@chakra-ui/icons";
import { useEffect } from "react";

const GetArtworks = () => {
  const dispatch = useDispatch();

  const {
    artworks = [],
    loading,
    error,
  } = useSelector((state) => state.artworks || {});

  // 🔥 Pagination + selection (5 rows per page)
  const table = useAdminTable(artworks, 5);

  useEffect(() => {
    dispatch(fetchArtworks());
  }, [dispatch]);

  /* ---------------- DELETE ---------------- */

  const handleDelete = async (id) => {
    try {
      await dispatch(deleteArtwork(id)).unwrap();
      toast.success("Artwork deleted");
      dispatch(fetchArtworks());
    } catch (e) {
      console.log(e);
      toast.error("Failed to delete artwork");
    }
  };

  const handleBulkDelete = async () => {
    if (table.selected.size === 0) {
      toast.info("No artworks selected for bulk delete.");
      return;
    }

    try {
      await dispatch(bulkDeleteArtworks([...table.selected])).unwrap();
      table.clearAll();
      toast.success("Selected artworks deleted");
    } catch (e) {
      console.log(e);
      toast.error("Bulk delete failed");
    }
  };

  return (
    <AdminPage
      title="Artworks"
      description="Review all artworks available in the system."
    >
      <AdminTableShell title="Artwork List">
        {loading ? (
          <Flex justify="center" py={8}>
            <Spinner />
          </Flex>
        ) : error ? (
          <Text color="red.400">{error}</Text>
        ) : artworks.length === 0 ? (
          <Text>No artworks found.</Text>
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
              <Table size="sm">
                <Thead>
                  <Tr>
                    <Th>
                      <Checkbox
                        isChecked={
                          table.paginatedData.length > 0 &&
                          table.paginatedData.every((r) =>
                            table.selected.has(r.id)
                          )
                        }
                        onChange={table.selectAllCurrentPage}
                      />
                    </Th>
                    <Th>ID</Th>
                    <Th>Preview</Th>
                    <Th>Image URL</Th>
                    <Th>Source</Th>
                    <Th>Actions</Th>
                  </Tr>
                </Thead>

                <Tbody>
                  {table.paginatedData.map((art) => {
                    const previewSrc = art.image_file || art.image_url || "";

                    return (
                      <Tr key={art.id} _hover={{ bg: "whiteAlpha.50" }}>
                        <Td>
                          <Checkbox
                            isChecked={table.selected.has(art.id)}
                            onChange={() => table.toggleRow(art.id)}
                          />
                        </Td>

                        <Td>{art.id}</Td>

                        <Td>
                          {previewSrc ? (
                            <Image
                              src={previewSrc}
                              alt={`Artwork ${art.id}`}
                              boxSize="64px"
                              objectFit="cover"
                              borderRadius="md"
                            />
                          ) : (
                            <Text fontSize="xs" color="whiteAlpha.500">
                              No image
                            </Text>
                          )}
                        </Td>

                        <Td maxW="260px">
                          <Text fontSize="xs" noOfLines={2}>
                            {art.image_url || art.image_file || "—"}
                          </Text>
                        </Td>

                        <Td>
                          <Badge
                            variant="subtle"
                            colorScheme={
                              art.is_user_uploaded ? "purple" : "gray"
                            }
                          >
                            {art.is_user_uploaded ? "User Uploaded" : "System"}
                          </Badge>
                        </Td>

                        <Td>
                          <Tooltip label="Delete Artwork">
                            <IconButton
                              size="sm"
                              colorScheme="red"
                              icon={<DeleteIcon />}
                              aria-label="Delete artwork"
                              onClick={() => handleDelete(art.id)}
                            />
                          </Tooltip>
                        </Td>
                      </Tr>
                    );
                  })}
                </Tbody>
              </Table>
            </Box>
          </AdminTableWithPagination>
        )}
      </AdminTableShell>

      <ToastContainer style={{ top: "70px" }} />
    </AdminPage>
  );
};

export default GetArtworks;
