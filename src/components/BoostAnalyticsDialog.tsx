'use client';

import { useQuery } from '@tanstack/react-query';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Avatar,
  Card,
  CardContent,
  CardHeader,
  Select,
  MenuItem,
  FormControl,
  Divider,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import InsightsIcon from '@mui/icons-material/Insights';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { formatCurrency, formatNumber, formatMindshare } from '@/lib/formatters';
import TimelineIcon from '@mui/icons-material/Timeline';
import PieChartOutlineIcon from '@mui/icons-material/PieChartOutline';
import {
  fetchCampaignAnalytics,
  fetchBoostRecastRecords,
  type RecastRecord,
} from '@/lib/campaignAnalytics';
import { useState, useEffect } from 'react';

const INTERVAL_OPTIONS = [
  { value: '10m', label: '10M' },
  { value: '30m', label: '30M' },
  { value: '1h', label: '1H' },
  { value: '3h', label: '3H' },
  { value: '6h', label: '6H' },
  { value: '1d', label: '1D' },
];

interface BoostAnalyticsDialogProps {
  open: boolean;
  onClose: () => void;
  boostId: string;
}

export function BoostAnalyticsDialog({
  open,
  onClose,
  boostId,
}: BoostAnalyticsDialogProps) {
  const [tabValue, setTabValue] = useState(0);
  const [interval, setInterval] = useState('30m');

  const {
    data: analyticsResponse,
    isLoading: analyticsLoading,
    refetch: refetchAnalytics,
  } = useQuery({
    queryKey: ['campaignAnalytics', boostId, interval],
    queryFn: () => fetchCampaignAnalytics(boostId, interval),
    enabled: !!boostId && open,
  });

  const { data: recastRecords = [], isLoading: recastsLoading } = useQuery({
    queryKey: ['boostRecastRecords', boostId],
    queryFn: () => fetchBoostRecastRecords(boostId, 100, 0),
    enabled: !!boostId && open,
  });

  useEffect(() => {
    if (boostId && open) {
      refetchAnalytics();
    }
  }, [interval, boostId, open, refetchAnalytics]);

  const analyticsData = analyticsResponse?.getCampaignAnalytics;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          background: '#121212',
          color: 'white',
          maxHeight: '90vh',
        },
      }}
    >
      <DialogTitle
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: '1px solid rgba(255,255,255,0.1)',
          color: 'white',
        }}
      >
        <Typography variant="h6">Campaign Analytics</Typography>
        <IconButton onClick={onClose} sx={{ color: 'white' }} aria-label="Close">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent
        sx={{
          p: 0,
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          minHeight: 400,
          maxHeight: '70vh',
        }}
      >
        <TabContext value={tabValue}>
          <Box
            sx={{
              borderBottom: 1,
              borderColor: 'divider',
              backgroundColor: '#121212',
              flexShrink: 0,
            }}
          >
            <TabList
              onChange={(_, v) => setTabValue(v)}
              sx={{
                width: '100%',
                color: 'white',
                '.Mui-selected': { color: 'white' },
              }}
              variant="fullWidth"
            >
              <Tab label="Analytics" value={0} sx={{ fontWeight: 600, fontSize: 14 }} />
              <Tab label="Participants" value={1} sx={{ fontWeight: 600, fontSize: 14 }} />
            </TabList>
          </Box>

          <Box sx={{ flex: 1, overflow: 'auto', minHeight: 0 }}>
          <TabPanel
            value={0}
            sx={{ height: '100%', p: 1, overflow: 'auto' }}
          >
            <AnalyticsContent
              data={analyticsData}
              isLoading={analyticsLoading}
              interval={interval}
              onIntervalChange={setInterval}
            />
          </TabPanel>
          <TabPanel
            value={1}
            sx={{ height: '100%', p: 1, overflow: 'auto' }}
          >
            <ParticipantsContent
              records={recastRecords}
              isLoading={recastsLoading}
            />
          </TabPanel>
        </Box>
      </TabContext>
      </DialogContent>
    </Dialog>
  );
}

function AnalyticsContent({
  data,
  isLoading,
  interval,
  onIntervalChange,
}: {
  data: Record<string, unknown> | undefined;
  isLoading: boolean;
  interval: string;
  onIntervalChange: (v: string) => void;
}) {
  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height={200}>
        <Typography>Loading analytics...</Typography>
      </Box>
    );
  }

  if (!data) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height={200}>
        <Typography>No analytics data available</Typography>
      </Box>
    );
  }

  const overview = data.overview as Record<string, unknown>;
  const performance = data.performance as Record<string, unknown>;
  const cumulativeSpending = (data.cumulativeSpending ?? []) as Array<{
    timestamp: string;
    cumulativeSpending: number;
    hourlySpending: number;
  }>;
  const mindshareDistribution = data.mindshareDistribution as {
    tiers: Array<{
      tier: string;
      count: number;
      percentage: number;
      avgMindshare: number;
      avgPayment: number;
    }>;
  };

  const totalSpent = (overview?.totalSpent as number) ?? 0;
  const totalRecasts = (performance?.totalRecasts as number) ?? 0;
  const hasData = totalSpent > 0 || totalRecasts > 0;

  if (!hasData) {
    return (
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        height={200}
        gap={2}
      >
        <Typography variant="h6" color="text.secondary">
          No Activity Yet
        </Typography>
        <Typography variant="body2" color="text.secondary" textAlign="center">
          Analytics will appear here once users start engaging with your campaign.
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      {/* Overview Cards */}
      <Box
        display="grid"
        gridTemplateColumns="1fr 1fr"
        gap={1}
        mb={2}
      >
        <Card sx={{ backgroundColor: '#1e1e1e', color: 'white' }}>
          <CardContent sx={{ py: 2, px: 1, textAlign: 'center' }}>
            <Typography variant="h6" sx={{ color: '#ff7300', fontWeight: 700 }}>
              {formatCurrency(totalSpent)}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Total Spending
            </Typography>
          </CardContent>
        </Card>
        <Card sx={{ backgroundColor: '#1e1e1e', color: 'white' }}>
          <CardContent sx={{ py: 2, px: 1, textAlign: 'center' }}>
            <Typography variant="h6" sx={{ color: '#ff7300', fontWeight: 700 }}>
              {formatNumber((overview?.paidEngagement as number) ?? 0)}/
              {formatNumber((overview?.totalEngagement as number) ?? 0)}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Paid/Total Engagement
            </Typography>
          </CardContent>
        </Card>
        <Card sx={{ backgroundColor: '#1e1e1e', color: 'white' }}>
          <CardContent sx={{ py: 2, px: 1, textAlign: 'center' }}>
            <Typography variant="h6" sx={{ color: '#ff7300', fontWeight: 700 }}>
              {formatMindshare((performance?.avgMindshare as number) ?? 0)}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Avg. Mindshare
            </Typography>
          </CardContent>
        </Card>
        <Card sx={{ backgroundColor: '#1e1e1e', color: 'white' }}>
          <CardContent sx={{ py: 2, px: 1, textAlign: 'center' }}>
            <Typography variant="h6" sx={{ color: '#ff7300', fontWeight: 700 }}>
              {formatCurrency((overview?.cpc as number) ?? 0)}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Cost Per Click
            </Typography>
          </CardContent>
        </Card>
      </Box>

      <Divider sx={{ my: 2 }}>
        <Box display="flex" alignItems="center" gap={1}>
          <InsightsIcon sx={{ fontSize: 20 }} />
          <Typography variant="body2" fontWeight={600}>
            Analytics
          </Typography>
        </Box>
      </Divider>

      {/* Spending Timeline */}
      <Card sx={{ backgroundColor: '#1e1e1e', color: 'white', mb: 2 }}>
        <CardHeader
          avatar={<TimelineIcon sx={{ color: '#FF6B00' }} />}
          title="Spending Timeline"
          action={
            <FormControl size="small" sx={{ minWidth: 80 }}>
              <Select
                value={interval}
                onChange={(e) => onIntervalChange(e.target.value)}
                size="small"
                sx={{ color: 'white' }}
              >
                {INTERVAL_OPTIONS.map((opt) => (
                  <MenuItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          }
        />
        <CardContent sx={{ px: 0 }}>
          <Box height={280} width="100%">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={cumulativeSpending}
                margin={{ top: 0, right: 10, left: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
                <XAxis
                  dataKey="timestamp"
                  stroke="rgba(255,255,255,0.7)"
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(v) =>
                    new Date(v).toLocaleString('en-US', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })
                  }
                />
                <YAxis
                  stroke="rgba(255,255,255,0.7)"
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(v) => `$${Number(v).toFixed(0)}`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1a1a1a',
                    border: '1px solid #333',
                    borderRadius: 8,
                    color: 'white',
                  }}
                  formatter={(value, name) => [
                    `$${Number(value ?? 0).toFixed(2)}`,
                    name === 'cumulativeSpending' ? 'Cumulative' : 'Hourly',
                  ]}
                  labelFormatter={(v) =>
                    new Date(v).toLocaleString('en-US', {
                      weekday: 'short',
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })
                  }
                />
                <Line
                  type="monotone"
                  dataKey="cumulativeSpending"
                  stroke="#FF6B00"
                  strokeWidth={3}
                  dot={{ fill: '#FF6B00', r: 4 }}
                  connectNulls={false}
                />
                <Line
                  type="monotone"
                  dataKey="hourlySpending"
                  stroke="#82ca9d"
                  strokeWidth={3}
                  dot={{ fill: '#82ca9d', r: 4 }}
                  connectNulls={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </Box>
          <Box display="flex" justifyContent="center" gap={3} mt={2}>
            <Box display="flex" alignItems="center" gap={1}>
              <Box width={12} height={3} sx={{ bgcolor: '#FF6B00', borderRadius: 1 }} />
              <Typography variant="caption" color="text.secondary">
                Cumulative
              </Typography>
            </Box>
            <Box display="flex" alignItems="center" gap={1}>
              <Box width={12} height={3} sx={{ bgcolor: '#82ca9d', borderRadius: 1 }} />
              <Typography variant="caption" color="text.secondary">
                Hourly
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* Mindshare Distribution */}
      <Card sx={{ backgroundColor: '#1e1e1e', color: 'white', mb: 2 }}>
        <CardHeader
          avatar={<PieChartOutlineIcon sx={{ color: 'primary.main' }} />}
          title="Mindshare Distribution"
        />
        <CardContent>
          <Box height={220} display="flex" justifyContent="center" mb={1}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={(mindshareDistribution?.tiers ?? []).filter(
                    (t: { count: number }) => t.count > 0
                  )}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={(props) => {
                    const pct = (props as { percentage?: number }).percentage ?? 0;
                    return pct > 5 ? `${pct.toFixed(1)}%` : '';
                  }}
                  outerRadius={80}
                  innerRadius={30}
                  dataKey="count"
                  stroke="#1e1e1e"
                  strokeWidth={2}
                >
                  {(mindshareDistribution?.tiers ?? [])
                    .filter((t: { count: number }) => t.count > 0)
                    .map((_: unknown, index: number) => (
                      <Cell
                        key={index}
                        fill={`hsl(${index * 45 + 200}, 70%, 60%)`}
                        stroke="#1e1e1e"
                        strokeWidth={2}
                      />
                    ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1a1a1a',
                    border: '1px solid #333',
                    borderRadius: 8,
                    color: 'white',
                  }}
                  formatter={(value, _, props) => {
                    const p = (props as { payload?: { percentage?: number } })?.payload;
                    return [
                      `${value ?? 0} users`,
                      p?.percentage != null ? `${p.percentage.toFixed(1)}% of total` : '',
                    ];
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </Box>
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ color: 'rgba(255,255,255,0.7)', fontSize: 11 }}>
                    Tier
                  </TableCell>
                  <TableCell
                    align="right"
                    sx={{ color: 'rgba(255,255,255,0.7)', fontSize: 11 }}
                  >
                    Users
                  </TableCell>
                  <TableCell
                    align="right"
                    sx={{ color: 'rgba(255,255,255,0.7)', fontSize: 11 }}
                  >
                    %
                  </TableCell>
                  <TableCell
                    align="right"
                    sx={{ color: 'rgba(255,255,255,0.7)', fontSize: 11 }}
                  >
                    Cost
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {(mindshareDistribution?.tiers ?? []).map(
                  (
                    tier: {
                      tier: string;
                      count: number;
                      percentage: number;
                      avgPayment: number;
                    },
                    index: number
                  ) => (
                    <TableRow key={index}>
                      <TableCell sx={{ fontSize: 12 }}>
                        {tier.tier.replace(/_/g, ' ').toUpperCase()}
                      </TableCell>
                      <TableCell align="right" sx={{ fontSize: 12 }}>
                        {tier.count}
                      </TableCell>
                      <TableCell align="right" sx={{ fontSize: 12 }}>
                        {tier.percentage.toFixed(1)}%
                      </TableCell>
                      <TableCell align="right" sx={{ fontSize: 12 }}>
                        {formatCurrency(tier.avgPayment * tier.count)}
                      </TableCell>
                    </TableRow>
                  )
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
    </Box>
  );
}

function ParticipantsContent({
  records,
  isLoading,
}: {
  records: RecastRecord[];
  isLoading: boolean;
}) {
  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height={200}>
        <Typography>Loading participants...</Typography>
      </Box>
    );
  }

  if (records.length === 0) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height={200}>
        <Typography>No participants yet</Typography>
      </Box>
    );
  }

  return (
    <TableContainer>
      <Table size="small" sx={{ tableLayout: 'fixed' }}>
        <TableHead>
          <TableRow>
            <TableCell sx={{ width: 40, padding: 1 }} />
            <TableCell sx={{ padding: 1, fontSize: 12, width: '35%' }}>
              User
            </TableCell>
            <TableCell sx={{ padding: 1, fontSize: 12, width: '20%' }}>
              Mindshare
            </TableCell>
            <TableCell sx={{ padding: 1, fontSize: 12, width: '20%' }}>
              Earning
            </TableCell>
            <TableCell sx={{ padding: 1, fontSize: 12, width: '25%' }}>
              Time
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {records.map((r) => (
            <TableRow key={r.id}>
              <TableCell sx={{ width: 36, padding: 1 }}>
                <Avatar
                  src={r.user?.pfpUrl ?? ''}
                  alt={r.user?.displayName ?? ''}
                  sx={{ width: 24, height: 24 }}
                />
              </TableCell>
              <TableCell sx={{ padding: 1 }}>
                <Typography variant="body2" fontSize={11} noWrap>
                  {r.user?.displayName ?? '—'}
                </Typography>
                <Typography variant="body2" fontSize={9} noWrap color="text.secondary">
                  @{r.user?.username ?? '—'}
                </Typography>
              </TableCell>
              <TableCell sx={{ fontSize: 11, padding: 1 }}>
                {formatMindshare(parseFloat(r.mindshare ?? '0'))}
              </TableCell>
              <TableCell sx={{ fontSize: 11, padding: 1 }}>
                ${r.netRewardAmount ?? r.earnedAmount ?? '0'}
              </TableCell>
              <TableCell sx={{ fontSize: 10, padding: 1 }}>
                {new Date(r.createdAt).toLocaleString('en-US', {
                  year: 'numeric',
                  month: '2-digit',
                  day: '2-digit',
                  hour: '2-digit',
                  minute: '2-digit',
                  hour12: false,
                })}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
