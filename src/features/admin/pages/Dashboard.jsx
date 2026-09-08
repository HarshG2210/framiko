import { AdminCard, AdminPage, AdminSection } from "../../../layout/AdminUI";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  Badge,
  Box,
  Divider,
  Flex,
  Image,
  SimpleGrid,
  Text,
} from "@chakra-ui/react";
import { useDispatch, useSelector } from "react-redux";

import { fetchArtworkCategories } from "../../../redux/slices/artworkCategoriesSlice";
import { fetchArtworkImageInventory } from "../../../redux/slices/artworkImageInventorySlice";
import { fetchArtworks } from "../../../redux/slices/artworksSlice";
import { fetchBackgrounds } from "../../../redux/slices/backgroundsSlice";
import { fetchDashboardUserStats } from "../../../redux/slices/userDetailsSlice";
import { fetchFrameInventory } from "../../../redux/slices/frameInventorySlice";
import { fetchFrames } from "../../../redux/slices/framesSlice";
import { fetchMaterials } from "../../../redux/slices/materialsSlice";
import { fetchSizes } from "../../../redux/slices/sizesSlice";
// src/components/admin/AdminDashboard.jsx
import { useEffect } from "react";

/* ---------------- KPI CARD ---------------- */
const StatCard = ({ label, value, hint }) => (
  <AdminCard>
    <Text
      fontSize="xs"
      opacity={0.6}
      letterSpacing="0.15em"
      textTransform="uppercase"
    >
      {label}
    </Text>
    <Text fontSize="2xl" fontWeight="bold" mt={1}>
      {value}
    </Text>
    {hint && (
      <Text fontSize="xs" opacity={0.5}>
        {hint}
      </Text>
    )}
  </AdminCard>
);

const AdminDashboard = () => {
  const dispatch = useDispatch();

  const { artworks = [] } = useSelector((s) => s.artworks || {});
  const { artworkCategories = [] } = useSelector(
    (s) => s.artworkCategories || {}
  );
  const { frames = [] } = useSelector((s) => s.frames || {});
  const { materials = [] } = useSelector((s) => s.materials || {});
  const { backgrounds = [] } = useSelector((s) => s.backgrounds || {});
  const { sizes = [] } = useSelector((s) => s.sizes || {});
  const { items: frameInventory = [] } = useSelector(
    (s) => s.frameInventory || {}
  );
  const { items: artworkInventory = [] } = useSelector(
    (s) => s.artworkImageInventory || {}
  );

  const { dashboardStats } = useSelector((s) => s.userDetails || {});

  useEffect(() => {
    dispatch(fetchArtworks());
    dispatch(fetchArtworkCategories());
    dispatch(fetchFrames());
    dispatch(fetchMaterials());
    dispatch(fetchBackgrounds());
    dispatch(fetchSizes());
    dispatch(fetchFrameInventory());
    dispatch(fetchArtworkImageInventory());
    dispatch(fetchDashboardUserStats());
  }, [dispatch]);

  /* ---------------- DERIVED DATA ---------------- */
  const lowStockFrames = frameInventory.filter((i) => i.quantity < 10);
  const lowStockArtworks = artworkInventory.filter((i) => i.quantity < 10);

  const fastSellingFrames = [...frameInventory]
    .sort((a, b) => a.quantity - b.quantity)
    .slice(0, 3);

  const deadStockFrames = [...frameInventory]
    .sort((a, b) => b.quantity - a.quantity)
    .slice(0, 3);

  /* ---------------- CHART DATA ---------------- */
  const userGrowthData = [
    { name: "This Week", users: dashboardStats.this_week || 0 },
    { name: "This Month", users: dashboardStats.this_month || 0 },
    { name: "This Year", users: dashboardStats.this_year || 0 },
    { name: "Total", users: dashboardStats.total_users || 0 },
  ];

  const userDistributionData = [
    { name: "This Week", value: dashboardStats.this_week || 0 },
    { name: "This Month", value: dashboardStats.this_month || 0 },
    { name: "This Year", value: dashboardStats.this_year || 0 },
  ];

  const COLORS = ["#3B82F6", "#8B5CF6", "#EC4899", "#F59E0B"];

  return (
    <AdminPage
      title="Dashboard"
      description="Live overview of store performance & inventory health."
    >
      {/* ================= KPI ROW ================= */}
      <SimpleGrid columns={{ base: 2, md: 4 }} spacing={4} mb={10}>
        <StatCard label="Total Users" value={dashboardStats.total_users} />
        <StatCard label="Users This Week" value={dashboardStats.this_week} />
        <StatCard label="Users This Month" value={dashboardStats.this_month} />
        <StatCard label="Users This Year" value={dashboardStats.this_year} />
        <StatCard label="Artworks" value={artworks.length} />
        <StatCard label="Categories" value={artworkCategories.length} />
        <StatCard label="Frames" value={frames.length} />
        <StatCard label="Materials" value={materials.length} />
        <StatCard label="Backgrounds" value={backgrounds.length} />
        <StatCard label="Sizes" value={sizes.length} />
        <StatCard
          label="Low Stock Frames"
          value={lowStockFrames.length}
          hint="< 10"
        />
        <StatCard
          label="Low Stock Artworks"
          value={lowStockArtworks.length}
          hint="< 10"
        />
      </SimpleGrid>

      {/* ================= USER ANALYTICS CHARTS ================= */}
      <AdminSection title="User Analytics">
        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
          {/* Line Chart */}
          <AdminCard>
            <Text fontWeight="bold" mb={4}>
              User Growth Trend
            </Text>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={userGrowthData}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                <XAxis dataKey="name" fontSize={12} />
                <YAxis fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1a1a1a",
                    border: "1px solid #333",
                    borderRadius: "8px",
                  }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="users"
                  stroke="#3B82F6"
                  strokeWidth={2}
                  dot={{ fill: "#3B82F6", r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </AdminCard>

          {/* Bar Chart */}
          <AdminCard>
            <Text fontWeight="bold" mb={4}>
              User Comparison
            </Text>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={userGrowthData}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                <XAxis dataKey="name" fontSize={12} />
                <YAxis fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1a1a1a",
                    border: "1px solid #333",
                    borderRadius: "8px",
                  }}
                />
                <Legend />
                <Bar dataKey="users" fill="#8B5CF6" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </AdminCard>

          {/* Area Chart */}
          <AdminCard>
            <Text fontWeight="bold" mb={4}>
              User Growth Area
            </Text>
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={userGrowthData}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                <XAxis dataKey="name" fontSize={12} />
                <YAxis fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1a1a1a",
                    border: "1px solid #333",
                    borderRadius: "8px",
                  }}
                />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="users"
                  stroke="#EC4899"
                  fill="#EC4899"
                  fillOpacity={0.6}
                />
              </AreaChart>
            </ResponsiveContainer>
          </AdminCard>

          {/* Pie Chart */}
          <AdminCard>
            <Text fontWeight="bold" mb={4}>
              User Distribution
            </Text>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={userDistributionData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) =>
                    `${name}: ${(percent * 100).toFixed(0)}%`
                  }
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {userDistributionData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1a1a1a",
                    border: "1px solid #333",
                    borderRadius: "8px",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </AdminCard>
        </SimpleGrid>
      </AdminSection>

      <Divider my={10} />

      {/* ================= FAST SELLING ================= */}
      <AdminSection title="Fast Selling Frames">
        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
          {fastSellingFrames.map((f, idx) => (
            <AdminCard key={f.id}>
              <Flex justify="space-between" mb={2}>
                <Badge colorScheme="red">FAST #{idx + 1}</Badge>
                <Badge variant="outline">Stock {f.quantity}</Badge>
              </Flex>

              <Flex gap={4} align="center">
                <Image
                  src={f.frame_image}
                  boxSize="64px"
                  borderRadius="lg"
                  objectFit="cover"
                />
                <Box>
                  <Text fontWeight="bold">{f.frame_name}</Text>
                  <Text fontSize="xs" opacity={0.6}>
                    {f.size_name} • {f.orientation}
                  </Text>
                </Box>
              </Flex>
            </AdminCard>
          ))}
        </SimpleGrid>
      </AdminSection>

      <Divider my={10} />

      {/* ================= DEAD STOCK ================= */}
      <AdminSection title="Dead Stock (Slow Moving)">
        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
          {deadStockFrames.map((f) => (
            <AdminCard key={f.id}>
              <Badge mb={2} colorScheme="orange">
                High Stock
              </Badge>
              <Text fontWeight="bold">{f.frame_name}</Text>
              <Text fontSize="xs" opacity={0.6}>
                Quantity: {f.quantity}
              </Text>
            </AdminCard>
          ))}
        </SimpleGrid>
      </AdminSection>

      <Divider my={10} />

      {/* ================= RECENT FRAMES ================= */}
      <AdminSection title="Recent Frames">
        <SimpleGrid columns={{ base: 2, md: 4 }} spacing={4}>
          {frames.slice(0, 4).map((f) => (
            <AdminCard key={f.id} hover>
              <Image
                src={f.image}
                boxSize="120px"
                objectFit="cover"
                borderRadius="md"
                mx="auto"
              />
              <Text mt={2} fontWeight="bold" textAlign="center">
                {f.name}
              </Text>
              <Text fontSize="xs" textAlign="center" opacity={0.6}>
                Thickness: {f.thickness}
              </Text>
            </AdminCard>
          ))}
        </SimpleGrid>
      </AdminSection>

      <Divider my={10} />

      {/* ================= INVENTORY ALERTS ================= */}
      <AdminSection title="Inventory Alerts">
        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
          <AdminCard>
            <Text fontWeight="bold" mb={2}>
              Low Stock Frames
            </Text>
            {lowStockFrames.length === 0 ? (
              <Text fontSize="sm" opacity={0.6}>
                All frames sufficiently stocked
              </Text>
            ) : (
              lowStockFrames.map((i) => (
                <Flex key={i.id} justify="space-between" py={1}>
                  <Text fontSize="sm">{i.frame_name}</Text>
                  <Badge colorScheme="red">{i.quantity}</Badge>
                </Flex>
              ))
            )}
          </AdminCard>

          <AdminCard>
            <Text fontWeight="bold" mb={2}>
              Low Stock Artwork Images
            </Text>
            {lowStockArtworks.length === 0 ? (
              <Text fontSize="sm" opacity={0.6}>
                All artwork images stocked
              </Text>
            ) : (
              lowStockArtworks.map((i) => (
                <Flex key={i.id} justify="space-between" py={1}>
                  <Text fontSize="sm">{i.category_name}</Text>
                  <Badge colorScheme="red">{i.quantity}</Badge>
                </Flex>
              ))
            )}
          </AdminCard>
        </SimpleGrid>
      </AdminSection>

      <Divider my={10} />

      {/* ================= SIZE INSIGHTS ================= */}
      <AdminSection title="Available Sizes">
        <SimpleGrid columns={{ base: 2, md: 4 }} spacing={4}>
          {sizes.map((s) => (
            <AdminCard key={s.id}>
              <Text fontWeight="bold">{s.name}</Text>
              <Text fontSize="xs">
                {s.width_cm} × {s.height_cm} cm
              </Text>
              <Badge mt={2}>{s.orientation}</Badge>
            </AdminCard>
          ))}
        </SimpleGrid>
      </AdminSection>
    </AdminPage>
  );
};

export default AdminDashboard;
