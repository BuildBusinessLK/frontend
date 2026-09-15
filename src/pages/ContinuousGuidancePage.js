import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Container,
  Divider,
  Grid,
  IconButton,
  MenuItem,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
  Typography,
  Alert,
  useTheme,
} from '@mui/material';
import CloudUploadRoundedIcon from '@mui/icons-material/CloudUploadRounded';
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded';
import DownloadRoundedIcon from '@mui/icons-material/DownloadRounded';
import SmartToyRoundedIcon from '@mui/icons-material/SmartToyRounded';
import DescriptionRoundedIcon from '@mui/icons-material/DescriptionRounded';
import InsertDriveFileRoundedIcon from '@mui/icons-material/InsertDriveFileRounded';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import HelpOutlineRoundedIcon from '@mui/icons-material/HelpOutlineRounded';
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';
import RefreshRoundedIcon from '@mui/icons-material/RefreshRounded';

import { useAuth } from '../contexts/AuthContext';
import { useThemeMode } from '../contexts/ThemeContext';
import { ROUTES } from '../constants/routes';
import { alpha, brand, getThemeColors, gradients, shadows } from '../theme';
import {
  fetchDocuments,
  uploadDocument,
  deleteDocument,
  downloadDocument,
} from '../services/guidanceService';

const CATEGORIES = [
  { value: 'HARVEST_YIELD', label: 'Harvest & Yield Log (Nuts, Sap, Copra, Leaf)', icon: '🌴' },
  { value: 'EXPENSES_COSTS', label: 'Operational Costs & Expenses (Labor, Fuel, Bottles)', icon: '💰' },
  { value: 'SALES_INVOICES', label: 'Sales Invoices & Buyer Receipts (Wholesale / Retail)', icon: '🏷️' },
  { value: 'COMPLIANCE_CERTIFICATES', label: 'Certifications & Permits (CDA, SLS, PDB, Organic)', icon: '📜' },
  { value: 'PRODUCT_SPECS', label: 'Product Specs & Recipes (Brix %, Extraction ratios)', icon: '📋' },
  { value: 'GENERAL_NOTES', label: 'General Notes & Business Records', icon: '📝' },
];

function formatBytes(bytes) {
  if (!bytes || bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

export default function ContinuousGuidancePage() {
  const theme = useTheme();
  const { mode } = useThemeMode();
  const { token } = useAuth();
  const navigate = useNavigate();
  const colors = getThemeColors(mode);

  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Form State
  const [selectedFile, setSelectedFile] = useState(null);
  const [category, setCategory] = useState('HARVEST_YIELD');
  const [description, setDescription] = useState('');
  const fileInputRef = useRef(null);

  const loadDocs = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchDocuments(token);
      setDocuments(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || 'Failed to load documents');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDocs();
  }, [token]);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
      setError(null);
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!selectedFile) {
      setError('Please select a file to upload');
      return;
    }

    setUploading(true);
    setError(null);
    setSuccess(null);

    try {
      await uploadDocument(token, selectedFile, category, description);
      setSuccess(`"${selectedFile.name}" uploaded and made available for AI guidance.`);
      setSelectedFile(null);
      setDescription('');
      if (fileInputRef.current) fileInputRef.current.value = '';
      await loadDocs();
    } catch (err) {
      setError(err.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (doc) => {
    if (!window.confirm(`Are you sure you want to remove "${doc.fileName}"?`)) {
      return;
    }
    try {
      await deleteDocument(token, doc.id);
      setSuccess(`Removed "${doc.fileName}".`);
      setDocuments((prev) => prev.filter((d) => d.id !== doc.id));
    } catch (err) {
      setError(err.message || 'Failed to delete document');
    }
  };

  const handleDownload = async (doc) => {
    try {
      await downloadDocument(token, doc.id, doc.fileName);
    } catch (err) {
      setError(err.message || 'Download failed');
    }
  };

  const handleAskAiAboutDoc = (doc) => {
    const prompt = `Based on my uploaded business record "${doc.fileName}" (${doc.category}${doc.description ? `: ${doc.description}` : ''}), please analyze the numbers and give me specific guidance for my enterprise.`;
    navigate(ROUTES.dashboardAi, { state: { initialPrompt: prompt } });
  };

  const handlePromptClick = (question) => {
    navigate(ROUTES.dashboardAi, { state: { initialPrompt: question } });
  };

  return (
    <Container maxWidth="lg" disableGutters>
      <Stack spacing={3.5}>
        {/* Header Section */}
        <Box>
          <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 1 }}>
            <Chip
              label="Pillar 3 · Continuous Guidance"
              size="small"
              sx={{
                fontWeight: 700,
                color: brand.orange.primary,
                background: alpha.orange[10],
                border: `1px solid ${alpha.orange[25]}`,
              }}
            />
            <Chip
              label="Coconut · Kithul · Thal Focus"
              size="small"
              sx={{
                fontWeight: 600,
                color: brand.green.light,
                background: alpha.green[10],
                border: `1px solid ${alpha.green[25]}`,
              }}
            />
          </Stack>

          <Typography variant="h4" sx={{ fontWeight: 900, letterSpacing: '-0.03em', mb: 1 }}>
            Continuous Business Guidance
          </Typography>
          <Typography sx={{ maxWidth: 840, color: theme.palette.text.secondary, lineHeight: 1.7 }}>
            Upload your production sheets, harvest records, expense logs, or compliance documents.
            BuildBusinessLK’s AI reads your records so you receive continuous, personalized guidance grounded
            in your real business figures.
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" onClose={() => setError(null)} sx={{ borderRadius: 2 }}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" onClose={() => setSuccess(null)} sx={{ borderRadius: 2 }}>
            {success}
          </Alert>
        )}

        {/* Upload Card */}
        <Card
          elevation={0}
          sx={{
            borderRadius: 3,
            border: `1px solid ${colors.border.primary}`,
            background: mode === 'dark' ? alpha.white['04'] : colors.background.paper,
            boxShadow: shadows.light.sm,
          }}
        >
          <CardContent sx={{ p: { xs: 2.5, sm: 3 } }}>
            <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 2 }}>
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: 2,
                  background: gradients.primary,
                  color: '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <CloudUploadRoundedIcon />
              </Box>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 800 }}>
                  Upload Business Record
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Supported formats: PDF, CSV, Excel (XLSX), Word (DOCX), TXT, or Image receipts
                </Typography>
              </Box>
            </Stack>

            <Box component="form" onSubmit={handleUpload}>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <Box
                    onClick={() => fileInputRef.current?.click()}
                    sx={{
                      p: 3,
                      border: `2px dashed ${selectedFile ? brand.green.light : alpha.orange[30]}`,
                      borderRadius: 2.5,
                      textAlign: 'center',
                      cursor: 'pointer',
                      background: mode === 'dark' ? alpha.white['02'] : alpha.black['02'],
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        borderColor: brand.orange.primary,
                        background: alpha.orange['04'],
                      },
                    }}
                  >
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileChange}
                      style={{ display: 'none' }}
                      accept=".pdf,.csv,.xlsx,.xls,.doc,.docx,.txt,image/*"
                    />
                    <DescriptionRoundedIcon sx={{ fontSize: 38, color: selectedFile ? brand.green.light : brand.orange.primary, mb: 1 }} />
                    <Typography sx={{ fontWeight: 700, fontSize: '0.95rem' }}>
                      {selectedFile ? selectedFile.name : 'Click or Drag file to upload'}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {selectedFile ? `${formatBytes(selectedFile.size)} selected` : 'Harvest sheets, cost notes, SLS certificates'}
                    </Typography>
                  </Box>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Stack spacing={2}>
                    <TextField
                      select
                      fullWidth
                      size="small"
                      label="Document Category"
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                    >
                      {CATEGORIES.map((cat) => (
                        <MenuItem key={cat.value} value={cat.value}>
                          <span style={{ marginRight: 8 }}>{cat.icon}</span> {cat.label}
                        </MenuItem>
                      ))}
                    </TextField>

                    <TextField
                      fullWidth
                      size="small"
                      multiline
                      rows={2.5}
                      label="Notes / Description for AI (Optional)"
                      placeholder="e.g. August 2026 raw kithul sap tapping logs from Deniyaya farm"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                    />

                    <Button
                      type="submit"
                      variant="contained"
                      disabled={!selectedFile || uploading}
                      startIcon={uploading ? <CircularProgress size={18} color="inherit" /> : <CloudUploadRoundedIcon />}
                      sx={{
                        borderRadius: 2,
                        py: 1,
                        background: gradients.primary,
                        fontWeight: 700,
                        boxShadow: shadows.colored.amber,
                        '&:hover': { background: gradients.warm },
                      }}
                    >
                      {uploading ? 'Processing File...' : 'Upload & Enable for AI'}
                    </Button>
                  </Stack>
                </Grid>
              </Grid>
            </Box>
          </CardContent>
        </Card>

        {/* Document Library Section */}
        <Card
          elevation={0}
          sx={{
            borderRadius: 3,
            border: `1px solid ${colors.border.primary}`,
            background: mode === 'dark' ? alpha.white['04'] : colors.background.paper,
            boxShadow: shadows.light.sm,
          }}
        >
          <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
            <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 800 }}>
                  Business Document Memory ({documents.length})
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Files currently in active memory for your personalized AI assistant
                </Typography>
              </Box>
              <IconButton size="small" onClick={loadDocs} title="Refresh documents">
                <RefreshRoundedIcon fontSize="small" />
              </IconButton>
            </Stack>

            {loading ? (
              <Box sx={{ py: 6, display: 'flex', justifyContent: 'center' }}>
                <CircularProgress size={32} />
              </Box>
            ) : documents.length === 0 ? (
              <Paper
                elevation={0}
                sx={{
                  p: 4,
                  textAlign: 'center',
                  borderRadius: 2.5,
                  background: mode === 'dark' ? alpha.white['02'] : alpha.black['02'],
                  border: `1px dashed ${colors.border.secondary}`,
                }}
              >
                <InsertDriveFileRoundedIcon sx={{ fontSize: 44, color: theme.palette.text.disabled, mb: 1 }} />
                <Typography sx={{ fontWeight: 700, mb: 0.5 }}>No business files uploaded yet</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 480, mx: 'auto', mb: 2 }}>
                  Upload your monthly coconut harvest, kithul treacle batch logs, or production cost sheets above to enable personalized AI guidance.
                </Typography>
              </Paper>
            ) : (
              <TableContainer sx={{ borderRadius: 2, border: `1px solid ${colors.border.secondary}` }}>
                <Table size="small">
                  <TableHead sx={{ bgcolor: mode === 'dark' ? alpha.white['04'] : alpha.black['03'] }}>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 700 }}>Document</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Category</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Size</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>AI Status</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 700 }}>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {documents.map((doc) => {
                      const catObj = CATEGORIES.find((c) => c.value === doc.category) || { label: doc.category, icon: '📄' };
                      return (
                        <TableRow key={doc.id} hover>
                          <TableCell>
                            <Stack direction="row" alignItems="center" spacing={1.5}>
                              <DescriptionRoundedIcon sx={{ color: brand.orange.primary, fontSize: 22 }} />
                              <Box>
                                <Typography sx={{ fontWeight: 700, fontSize: '0.88rem' }}>
                                  {doc.fileName}
                                </Typography>
                                {doc.description && (
                                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                                    {doc.description}
                                  </Typography>
                                )}
                              </Box>
                            </Stack>
                          </TableCell>
                          <TableCell>
                            <Chip
                              size="small"
                              label={`${catObj.icon} ${catObj.label.split('(')[0].trim()}`}
                              sx={{
                                fontSize: '0.75rem',
                                fontWeight: 600,
                                bgcolor: mode === 'dark' ? alpha.white['06'] : alpha.black['04'],
                              }}
                            />
                          </TableCell>
                          <TableCell>
                            <Typography variant="caption" color="text.secondary">
                              {formatBytes(doc.fileSize)}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Chip
                              icon={<CheckCircleRoundedIcon sx={{ fontSize: '14px !important', color: `${brand.green.light} !important` }} />}
                              label="Active in AI"
                              size="small"
                              sx={{
                                fontSize: '0.72rem',
                                fontWeight: 700,
                                color: brand.green.light,
                                bgcolor: alpha.green[10],
                                border: `1px solid ${alpha.green[25]}`,
                              }}
                            />
                          </TableCell>
                          <TableCell align="right">
                            <Stack direction="row" spacing={0.5} justifyContent="flex-end">
                              <Tooltip title="Ask AI about this document">
                                <Button
                                  size="small"
                                  variant="outlined"
                                  startIcon={<SmartToyRoundedIcon sx={{ fontSize: 16 }} />}
                                  onClick={() => handleAskAiAboutDoc(doc)}
                                  sx={{
                                    fontSize: '0.75rem',
                                    fontWeight: 700,
                                    borderRadius: 1.5,
                                    color: brand.green.light,
                                    borderColor: alpha.green[30],
                                    '&:hover': {
                                      borderColor: brand.green.light,
                                      bgcolor: alpha.green[10],
                                    },
                                  }}
                                >
                                  Ask AI
                                </Button>
                              </Tooltip>
                              <Tooltip title="Download file">
                                <IconButton size="small" onClick={() => handleDownload(doc)}>
                                  <DownloadRoundedIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Delete file">
                                <IconButton size="small" color="error" onClick={() => handleDelete(doc)}>
                                  <DeleteOutlineRoundedIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                            </Stack>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </CardContent>
        </Card>

        {/* AI Insight Shortcuts */}
        <Box>
          <Typography variant="subtitle1" sx={{ fontWeight: 800, mb: 1.5 }}>
            Personalized Guidance Prompts for Your Business
          </Typography>
          <Grid container spacing={2}>
            {[
              {
                title: 'Calculate Optimal Pricing & Margins',
                desc: 'Analyze my raw coconut / sap harvest cost and advise what wholesale and retail price I should set.',
                prompt: 'Based on my uploaded harvest and cost records, calculate my production cost per unit and suggest optimal wholesale and retail prices for Sri Lankan buyers.',
              },
              {
                title: 'Detect Cost Inefficiencies',
                desc: 'Examine my operational expense sheets to find where money is leaking in processing or packaging.',
                prompt: 'Review my uploaded expense notes and identify the top areas where my rural enterprise can reduce production and packaging costs.',
              },
              {
                title: 'SLS / CDA Compliance Review',
                desc: 'Check if my production batches and recipes match Coconut Development Authority or SLS treacle standards.',
                prompt: 'Compare my product specs and batch records against Sri Lankan regulatory standards (CDA / Kithul Board / SLS) and list any gaps I need to fix.',
              },
            ].map((q, idx) => (
              <Grid item xs={12} md={4} key={idx}>
                <Paper
                  onClick={() => handlePromptClick(q.prompt)}
                  elevation={0}
                  sx={{
                    p: 2.5,
                    height: '100%',
                    borderRadius: 2.5,
                    cursor: 'pointer',
                    border: `1px solid ${colors.border.secondary}`,
                    background: mode === 'dark' ? alpha.white['02'] : colors.background.paper,
                    transition: 'all 0.2s ease',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    '&:hover': {
                      transform: 'translateY(-3px)',
                      borderColor: brand.orange.primary,
                      boxShadow: shadows.colored.amber,
                    },
                  }}
                >
                  <Box>
                    <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
                      <HelpOutlineRoundedIcon sx={{ color: brand.orange.primary, fontSize: 20 }} />
                      <Typography sx={{ fontWeight: 700, fontSize: '0.92rem' }}>
                        {q.title}
                      </Typography>
                    </Stack>
                    <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                      {q.desc}
                    </Typography>
                  </Box>
                  <Button
                    size="small"
                    endIcon={<ArrowForwardRoundedIcon sx={{ fontSize: 16 }} />}
                    sx={{
                      alignSelf: 'flex-start',
                      mt: 2,
                      px: 0,
                      fontWeight: 700,
                      color: brand.green.light,
                    }}
                  >
                    Consult AI Assistant
                  </Button>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Stack>
    </Container>
  );
}
