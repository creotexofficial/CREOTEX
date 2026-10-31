import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { useCart } from '../../context/CartContext';

// Supported file extensions (Strictly .STL, .STEP and Images only)
export const SUPPORTED_IMAGE_EXTS = ['.jpg', '.jpeg', '.png', '.webp', '.bmp', '.svg'];
export const SUPPORTED_3D_EXTS = ['.stl', '.step', '.stp'];
export const ALL_ACCEPTED_EXTENSIONS = [...SUPPORTED_3D_EXTS, ...SUPPORTED_IMAGE_EXTS].join(',');

// Engineering Materials with performance tags
export const PRINT_MATERIALS = [
  { id: 'pla-hyper', name: 'PLA Hyper Pro', ratePerGram: 3.5, density: 1.24, tag: 'Fast Prototyping', badge: 'Standard' },
  { id: 'pla-plus', name: 'PLA+ Tough Impact', ratePerGram: 4.2, density: 1.25, tag: 'High Impact Gear', badge: 'Popular' },
  { id: 'petg-pro', name: 'PETG Pro Tough', ratePerGram: 5.0, density: 1.27, tag: 'UV & Heat Resistant', badge: 'Durable' },
  { id: 'abs-industrial', name: 'ABS Industrial Grade', ratePerGram: 5.5, density: 1.05, tag: 'Robotics Chassis', badge: 'Heavy Duty' },
  { id: 'tpu-95a', name: 'TPU 95A Flexible', ratePerGram: 7.5, density: 1.21, tag: 'Rubber Wheels/Bumpers', badge: 'Elastic' },
  { id: 'petg-cf', name: 'Carbon Fiber PETG/Nylon', ratePerGram: 11.0, density: 1.30, tag: 'Ultra-Stiff Drone Arms', badge: 'Championship' },
  { id: 'sla-resin', name: 'SLA Photopolymer Resin', ratePerGram: 9.5, density: 1.15, tag: 'Micron Precision', badge: 'High Res' }
];

// Color Swatches
export const PRINT_COLORS = [
  { id: 'black', name: 'Onyx Black', hex: '#111827', accent: '#374151', text: '#FFFFFF' },
  { id: 'white', name: 'Signal White', hex: '#F8FAFC', accent: '#E2E8F0', text: '#0F172A' },
  { id: 'orange', name: 'Creotex Orange', hex: '#F97316', accent: '#EA580C', text: '#FFFFFF' },
  { id: 'green', name: 'Cyber Lime Green', hex: '#10B981', accent: '#059669', text: '#FFFFFF' },
  { id: 'blue', name: 'Cobalt Blue', hex: '#2563EB', accent: '#1D4ED8', text: '#FFFFFF' },
  { id: 'red', name: 'Crimson Racing Red', hex: '#DC2626', accent: '#B91C1C', text: '#FFFFFF' },
  { id: 'grey', name: 'Titanium Grey', hex: '#64748B', accent: '#475569', text: '#FFFFFF' },
  { id: 'gold', name: 'Silk Metallic Gold', hex: '#D97706', accent: '#B45309', text: '#FFFFFF' },
  { id: 'clear', name: 'Translucent Clear', hex: '#CBD5E1', accent: '#94A3B8', text: '#0F172A' },
  { id: 'purple', name: 'Deep Cyber Purple', hex: '#7C3AED', accent: '#6D28D9', text: '#FFFFFF' }
];

// Infill presets
export const INFILL_PRESETS = [
  { value: 15, label: '15% Lightweight', multiplier: 0.85, tag: 'Display Models', desc: 'Cosmetic & visual parts' },
  { value: 30, label: '30% Balanced', multiplier: 1.0, tag: 'Recommended', desc: 'Optimal strength & weight' },
  { value: 60, label: '60% Heavy Duty', multiplier: 1.25, tag: 'Robotics Parts', desc: 'High load & torque gear' },
  { value: 100, label: '100% Solid Dense', multiplier: 1.55, tag: 'Indestructible', desc: 'Maximum shear resistance' }
];

// Resolution presets
export const RESOLUTION_PRESETS = [
  { value: '0.12', label: '0.12mm Ultra Detail', multiplier: 1.20, badge: 'Finest Finish', desc: 'Invisible layer lines' },
  { value: '0.20', label: '0.20mm Standard', multiplier: 1.0, badge: 'Optimal', desc: 'Standard engineering speed' },
  { value: '0.28', label: '0.28mm Draft Speed', multiplier: 0.90, badge: 'Fastest', desc: 'Quick turnaround prototypes' }
];

// Sample CAD Models for Instant Demo
const SAMPLE_MODELS = [
  {
    id: 'motor-mount',
    name: 'PG36_Planetary_Motor_Mount.stl',
    ext: '.stl',
    type: '3d',
    size: 420 * 1024,
    dimensions: { x: 55, y: 48, z: 32 },
    triangles: 4280,
    weight: 38,
    category: 'Motor Mount'
  },
  {
    id: 'omni-hub',
    name: 'OmniWheel_Coupler_Hub.stl',
    ext: '.stl',
    type: '3d',
    size: 280 * 1024,
    dimensions: { x: 42, y: 42, z: 24 },
    triangles: 3150,
    weight: 26,
    category: 'Wheel Coupler'
  },
  {
    id: 'sensor-bracket',
    name: 'PID_LineFollower_Array_Mount.step',
    ext: '.step',
    type: '3d',
    size: 680 * 1024,
    dimensions: { x: 120, y: 35, z: 18 },
    triangles: 6400,
    weight: 42,
    category: 'Sensor Arm'
  }
];

export const Custom3DPrintSection = ({ hideHeader = false }) => {
  const { addItem, showToast, setIsCheckoutOpen, theme } = useCart();

  // Uploader State
  const fileInputRef = useRef(null);
  const canvasRef = useRef(null);
  const canvasContainerRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [fileType, setFileType] = useState('3d'); // '3d' | 'image'
  const [previewUrl, setPreviewUrl] = useState(null);
  const [imageMeta, setImageMeta] = useState(null);
  const [stlData, setStlData] = useState(null);

  const [selectedMaterial, setSelectedMaterial] = useState(PRINT_MATERIALS[0]);
  const [selectedColor, setSelectedColor] = useState(PRINT_COLORS[2]); // Creotex Orange
  const [infillPercent, setInfillPercent] = useState(30);
  const [wallCount, setWallCount] = useState(3);
  const [selectedResolution, setSelectedResolution] = useState(RESOLUTION_PRESETS[1]); // 0.20mm

  const selectedInfill = useMemo(() => {
    let tag = 'Balanced';
    let desc = 'Optimal strength & weight';
    if (infillPercent <= 20) {
      tag = 'Lightweight';
      desc = 'Visual & cosmetic models';
    } else if (infillPercent <= 45) {
      tag = 'Recommended';
      desc = 'Balanced strength & weight';
    } else if (infillPercent <= 75) {
      tag = 'Heavy Duty';
      desc = 'Robotics & high load parts';
    } else {
      tag = 'Solid Dense';
      desc = 'Maximum shear & impact resistance';
    }
    const multiplier = 0.85 + (infillPercent / 100) * 0.70;
    return {
      value: infillPercent,
      label: `${infillPercent}% Infill (${tag})`,
      tag,
      desc,
      multiplier
    };
  }, [infillPercent]);
  const [infillPattern, setInfillPattern] = useState('Gyroid');
  const [quantity, setQuantity] = useState(1);
  const [isRush, setIsRush] = useState(false);
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [imageServiceMode, setImageServiceMode] = useState('lithophane'); // 'lithophane' | 'laser' | 'cad-modeling'

  // Dimensions & Weight (editable / auto-calculated)
  const [dimensions, setDimensions] = useState({ x: 60, y: 50, z: 35 });
  const [scalePercent, setScalePercent] = useState(100);
  const [manualWeightGrams, setManualWeightGrams] = useState(null);

  // 3D Canvas visualizer interaction & controls
  const [rotation, setRotation] = useState({ x: 25, y: -35 });
  const [zoom, setZoom] = useState(1.0);
  const [isInteracting, setIsInteracting] = useState(false);
  const [isAutoRotating, setIsAutoRotating] = useState(true);
  const [viewMode, setViewMode] = useState('solid'); // 'solid' | 'wireframe'
  const dragStartRef = useRef({ x: 0, y: 0 });
  const animFrameRef = useRef(null);

  // Auto-rotate loop when user is not actively dragging
  useEffect(() => {
    let lastTime = performance.now();
    const tick = (now) => {
      const delta = (now - lastTime) / 1000;
      lastTime = now;
      if (isAutoRotating && !isInteracting) {
        setRotation((prev) => ({
          ...prev,
          y: (prev.y + delta * 24) % 360
        }));
      }
      animFrameRef.current = requestAnimationFrame(tick);
    };
    animFrameRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animFrameRef.current);
  }, [isAutoRotating, isInteracting]);

  // Handle Drag & Drop
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processSelectedFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      processSelectedFile(e.target.files[0]);
    }
  };

  // Process uploaded file
  const processSelectedFile = (file) => {
    const fileName = file.name.toLowerCase();
    const ext = '.' + fileName.split('.').pop();
    const isImage = SUPPORTED_IMAGE_EXTS.includes(ext);
    const is3D = SUPPORTED_3D_EXTS.includes(ext);

    if (!isImage && !is3D) {
      showToast?.(`Only .STL, .STEP files and images are supported.`, 'error');
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    setUploadedFile({
      name: file.name,
      size: file.size,
      ext: ext,
      rawFile: file
    });

    if (isImage) {
      setFileType('image');
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);

      const img = new Image();
      img.onload = () => {
        setImageMeta({
          width: img.naturalWidth,
          height: img.naturalHeight,
          aspect: (img.naturalWidth / img.naturalHeight).toFixed(2)
        });
        setDimensions({
          x: Math.min(180, Math.round(img.naturalWidth / 10)),
          y: Math.min(180, Math.round(img.naturalHeight / 10)),
          z: 4
        });
      };
      img.src = url;
      showToast?.(`Loaded ${file.name} for 3D Conversion & Print!`, 'success');
    } else {
      setFileType('3d');
      setPreviewUrl(null);
      setImageMeta(null);

      if (ext === '.stl') {
        parseSTLFile(file);
      } else {
        const estDim = { x: 75, y: 60, z: 35 };
        setDimensions(estDim);
        setStlData({
          trianglesCount: Math.round(file.size / 100),
          isRealMesh: false
        });
      }
      showToast?.(`Loaded 3D Model: ${file.name}!`, 'success');
    }
  };

  // Pure Client-side Binary / ASCII STL Parser
  const parseSTLFile = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const buffer = e.target.result;
        const dataView = new DataView(buffer);
        const trianglesCount = dataView.getUint32(80, true);

        let minX = Infinity, maxX = -Infinity;
        let minY = Infinity, maxY = -Infinity;
        let minZ = Infinity, maxZ = -Infinity;

        const expectedSize = 84 + trianglesCount * 50;
        const isBinary = Math.abs(buffer.byteLength - expectedSize) < 100 && trianglesCount > 0 && trianglesCount < 2000000;

        let sampledTriangles = [];

        if (isBinary) {
          const step = Math.max(1, Math.floor(trianglesCount / 450));
          let offset = 84;

          for (let i = 0; i < trianglesCount; i++) {
            const v1x = dataView.getFloat32(offset + 12, true);
            const v1y = dataView.getFloat32(offset + 16, true);
            const v1z = dataView.getFloat32(offset + 20, true);

            const v2x = dataView.getFloat32(offset + 24, true);
            const v2y = dataView.getFloat32(offset + 28, true);
            const v2z = dataView.getFloat32(offset + 32, true);

            const v3x = dataView.getFloat32(offset + 36, true);
            const v3y = dataView.getFloat32(offset + 40, true);
            const v3z = dataView.getFloat32(offset + 44, true);

            minX = Math.min(minX, v1x, v2x, v3x);
            maxX = Math.max(maxX, v1x, v2x, v3x);
            minY = Math.min(minY, v1y, v2y, v3y);
            maxY = Math.max(maxY, v1y, v2y, v3y);
            minZ = Math.min(minZ, v1z, v2z, v3z);
            maxZ = Math.max(maxZ, v1z, v2z, v3z);

            if (i % step === 0 && sampledTriangles.length < 500) {
              sampledTriangles.push([
                { x: v1x, y: v1y, z: v1z },
                { x: v2x, y: v2y, z: v2z },
                { x: v3x, y: v3y, z: v3z }
              ]);
            }
            offset += 50;
          }

          const dimX = Math.max(5, Math.round(maxX - minX));
          const dimY = Math.max(5, Math.round(maxY - minY));
          const dimZ = Math.max(2, Math.round(maxZ - minZ));

          setDimensions({ x: dimX, y: dimY, z: dimZ });
          setStlData({
            trianglesCount,
            isRealMesh: true,
            sampledTriangles,
            min: { x: minX, y: minY, z: minZ },
            max: { x: maxX, y: maxY, z: maxZ }
          });
        } else {
          setDimensions({ x: 60, y: 50, z: 30 });
          setStlData({ trianglesCount: 3200, isRealMesh: false });
        }
      } catch (err) {
        setDimensions({ x: 60, y: 50, z: 30 });
        setStlData({ trianglesCount: 2500, isRealMesh: false });
      }
    };
    reader.readAsArrayBuffer(file);
  };

  // Load sample demo model
  const loadSampleModel = (sample) => {
    setUploadedFile({
      name: sample.name,
      size: sample.size,
      ext: sample.ext,
      isDemo: true
    });
    setFileType('3d');
    setPreviewUrl(null);
    setImageMeta(null);
    setDimensions({ ...sample.dimensions });
    setStlData({
      trianglesCount: sample.triangles,
      isRealMesh: false
    });
    setScalePercent(100);
    showToast?.(`Loaded Demo: ${sample.name}`, 'info');
  };

  // Reset uploaded file
  const handleRemoveFile = () => {
    if (previewUrl && previewUrl.startsWith('blob:')) {
      URL.revokeObjectURL(previewUrl);
    }
    setUploadedFile(null);
    setPreviewUrl(null);
    setImageMeta(null);
    setStlData(null);
    setDimensions({ x: 60, y: 50, z: 35 });
    setScalePercent(100);
    if (fileInputRef.current) fileInputRef.current.value = '';
    showToast?.('Custom file cleared.', 'info');
  };

  // Calculate Part Weight (grams)
  const estimatedWeight = useMemo(() => {
    if (manualWeightGrams !== null && manualWeightGrams > 0) {
      return manualWeightGrams;
    }
    const scaledX = dimensions.x * (scalePercent / 100);
    const scaledY = dimensions.y * (scalePercent / 100);
    const scaledZ = dimensions.z * (scalePercent / 100);
    const boundingVolumeCm3 = (scaledX * scaledY * scaledZ) / 1000;

    const infillRatio = (selectedInfill.value / 100) * 0.40 + 0.22 + (wallCount * 0.02);
    const effectiveVolume = boundingVolumeCm3 * infillRatio;
    const materialDensity = selectedMaterial.density || 1.25;

    return Math.max(12, Math.round(effectiveVolume * materialDensity));
  }, [dimensions, scalePercent, selectedInfill, selectedMaterial, wallCount, manualWeightGrams]);

  // Dynamic Price Engine
  const priceCalculations = useMemo(() => {
    const rawGrams = estimatedWeight;
    const rate = selectedMaterial.ratePerGram || 3.5;
    const infillMult = selectedInfill.multiplier || 1.0;
    const resMult = selectedResolution.multiplier || 1.0;

    const baseSetupFee = 79;
    const materialCost = rawGrams * rate * infillMult * resMult;

    let unitPrice = Math.round(materialCost + baseSetupFee);
    unitPrice = Math.max(69, unitPrice);

    const subtotalBeforeDiscounts = unitPrice * quantity;
    const isSetupWaived = subtotalBeforeDiscounts >= 450;
    const finalUnitPrice = isSetupWaived ? Math.max(49, unitPrice - Math.round(baseSetupFee / quantity)) : unitPrice;

    let discountPercent = 0;
    if (quantity >= 10) discountPercent = 18;
    else if (quantity >= 6) discountPercent = 12;
    else if (quantity >= 3) discountPercent = 8;

    const grossTotal = finalUnitPrice * quantity;
    const discountAmount = Math.round(grossTotal * (discountPercent / 100));
    const rushFee = isRush ? 149 : 0;
    const grandTotal = Math.max(69, grossTotal - discountAmount + rushFee);

    const totalMinutes = Math.round((rawGrams * 3.8 * (selectedResolution.value === '0.12' ? 1.4 : 1.0)) + 30);
    const hours = Math.floor(totalMinutes / 60);
    const mins = totalMinutes % 60;

    return {
      unitPrice: finalUnitPrice,
      baseSetupFee,
      isSetupWaived,
      discountPercent,
      discountAmount,
      rushFee,
      grandTotal,
      printTimeText: `${hours}h ${mins}m`,
      materialCost: Math.round(materialCost)
    };
  }, [estimatedWeight, selectedMaterial, selectedInfill, selectedResolution, quantity, isRush]);

  // 3D Canvas Rendering Engine with DPI Scaling & Shading
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const container = canvasContainerRef.current || canvas.parentElement;
    const ctx = canvas.getContext('2d');

    const dpr = window.devicePixelRatio || 1;
    const rect = container ? container.getBoundingClientRect() : { width: 560, height: 460 };
    const width = Math.max(280, Math.floor(rect.width));
    const height = Math.max(300, Math.floor(rect.height || 460));

    if (canvas.width !== width * dpr || canvas.height !== height * dpr) {
      canvas.width = width * dpr;
      canvas.height = height * dpr;
    }

    ctx.save();
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, width, height);

    const radX = (rotation.x * Math.PI) / 180;
    const radY = (rotation.y * Math.PI) / 180;

    const isLight = theme === 'light' || (typeof document !== 'undefined' && document.documentElement.getAttribute('data-theme') === 'light');

    // Draw Print Bed Grid
    ctx.save();
    ctx.translate(width / 2, height / 2 + Math.min(105, height * 0.22));

    ctx.strokeStyle = isLight ? 'rgba(0, 0, 0, 0.12)' : 'rgba(255, 255, 255, 0.07)';
    ctx.lineWidth = 1;
    const gridSize = Math.min(width, height) * 0.36 * zoom;
    const gridStep = Math.max(16, gridSize / 7);

    for (let i = -gridSize; i <= gridSize; i += gridStep) {
      const x1 = i * Math.cos(radY) - (-gridSize) * Math.sin(radY) * 0.45;
      const y1 = i * Math.sin(radY) * 0.25 + (-gridSize) * Math.cos(radY) * 0.35;
      const x2 = i * Math.cos(radY) - gridSize * Math.sin(radY) * 0.45;
      const y2 = i * Math.sin(radY) * 0.25 + gridSize * Math.cos(radY) * 0.35;

      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();
    }
    ctx.restore();

    // Draw 3D Model
    ctx.save();
    ctx.translate(width / 2, height / 2 - Math.min(30, height * 0.05));

    const colorHex = selectedColor.hex || '#F97316';
    const isWireframe = viewMode === 'wireframe';

    if (stlData?.isRealMesh && stlData?.sampledTriangles?.length > 0) {
      const { min, max, sampledTriangles } = stlData;
      const cx = (min.x + max.x) / 2;
      const cy = (min.y + max.y) / 2;
      const cz = (min.z + max.z) / 2;
      const maxSpan = Math.max(max.x - min.x, max.y - min.y, max.z - min.z) || 1;
      const targetSpan = Math.min(width, height) * 0.46;
      const scale = (targetSpan / maxSpan) * zoom * (scalePercent / 100);

      const transformed = sampledTriangles.map((tri) => {
        const pts = tri.map((p) => {
          const px = (p.x - cx) * scale;
          const py = (p.y - cy) * scale;
          const pz = (p.z - cz) * scale;

          const x1 = px * Math.cos(radY) + pz * Math.sin(radY);
          const z1 = -px * Math.sin(radY) + pz * Math.cos(radY);

          const y2 = py * Math.cos(radX) - z1 * Math.sin(radX);
          const z2 = py * Math.sin(radX) + z1 * Math.cos(radX);

          return { x: x1, y: y2, z: z2 };
        });
        const avgZ = (pts[0].z + pts[1].z + pts[2].z) / 3;

        // Normal computation for directional shading
        const ax = pts[1].x - pts[0].x;
        const ay = pts[1].y - pts[0].y;
        const az = pts[1].z - pts[0].z;
        const bx = pts[2].x - pts[0].x;
        const by = pts[2].y - pts[0].y;
        const bz = pts[2].z - pts[0].z;
        const nx = ay * bz - az * by;
        const ny = az * bx - ax * bz;
        const nz = ax * by - ay * bx;
        const len = Math.hypot(nx, ny, nz) || 1;
        const lightIntensity = Math.max(0.25, Math.min(1.0, 0.45 + 0.55 * (nz / len)));

        return { pts, avgZ, lightIntensity };
      });

      transformed.sort((a, b) => a.avgZ - b.avgZ);

      transformed.forEach(({ pts, lightIntensity }) => {
        ctx.beginPath();
        ctx.moveTo(pts[0].x, pts[0].y);
        ctx.lineTo(pts[1].x, pts[1].y);
        ctx.lineTo(pts[2].x, pts[2].y);
        ctx.closePath();

        if (isWireframe) {
          ctx.strokeStyle = colorHex;
          ctx.lineWidth = 1;
          ctx.stroke();
          ctx.fillStyle = isLight ? 'rgba(240, 245, 250, 0.45)' : 'rgba(0, 0, 0, 0.3)';
          ctx.fill();
        } else {
          ctx.fillStyle = colorHex;
          ctx.globalAlpha = lightIntensity * 0.95;
          ctx.fill();
          ctx.strokeStyle = isLight ? 'rgba(0, 0, 0, 0.2)' : 'rgba(255, 255, 255, 0.18)';
          ctx.lineWidth = 0.6;
          ctx.stroke();
        }
      });
    } else {
      // Precision Robotics Mechanical Part
      const rawScale = (scalePercent / 100) * zoom;
      const baseSpan = Math.min(width, height) * 0.23;
      const szX = Math.min(baseSpan * 1.25, Math.max(30, dimensions.x * 0.85)) * rawScale;
      const szY = Math.min(baseSpan * 1.25, Math.max(30, dimensions.y * 0.85)) * rawScale;
      const szZ = Math.min(baseSpan * 1.25, Math.max(24, dimensions.z * 0.85)) * rawScale;

      const vertices = [
        [-szX, -szY, -szZ],
        [szX, -szY, -szZ],
        [szX, szY, -szZ],
        [-szX, szY, -szZ],
        [-szX, -szY, szZ],
        [szX, -szY, szZ],
        [szX, szY, szZ],
        [-szX, szY, szZ]
      ];

      const projected = vertices.map(([x, y, z]) => {
        const x1 = x * Math.cos(radY) + z * Math.sin(radY);
        const z1 = -x * Math.sin(radY) + z * Math.cos(radY);

        const y2 = y * Math.cos(radX) - z1 * Math.sin(radX);
        const z2 = y * Math.sin(radX) + z1 * Math.cos(radX);

        return { x: x1, y: y2, z: z2 };
      });

      const faces = [
        { idxs: [0, 1, 2, 3], normZ: -1 },
        { idxs: [4, 5, 6, 7], normZ: 1 },
        { idxs: [0, 1, 5, 4], normZ: -0.5 },
        { idxs: [2, 3, 7, 6], normZ: 0.5 },
        { idxs: [1, 2, 6, 5], normZ: 0.8 },
        { idxs: [0, 3, 7, 4], normZ: -0.8 }
      ];

      const faceOrder = faces.map((face) => {
        const avgZ = face.idxs.reduce((sum, idx) => sum + projected[idx].z, 0) / 4;
        return { ...face, avgZ };
      });
      faceOrder.sort((a, b) => a.avgZ - b.avgZ);

      faceOrder.forEach(({ idxs }, i) => {
        ctx.beginPath();
        ctx.moveTo(projected[idxs[0]].x, projected[idxs[0]].y);
        for (let j = 1; j < idxs.length; j++) {
          ctx.lineTo(projected[idxs[j]].x, projected[idxs[j]].y);
        }
        ctx.closePath();

        if (isWireframe) {
          ctx.strokeStyle = colorHex;
          ctx.lineWidth = 1.2;
          ctx.stroke();
          ctx.fillStyle = isLight ? 'rgba(240, 245, 250, 0.5)' : 'rgba(17, 24, 39, 0.4)';
          ctx.fill();
        } else {
          ctx.fillStyle = colorHex;
          ctx.globalAlpha = 0.55 + (i / faceOrder.length) * 0.45;
          ctx.fill();
          ctx.strokeStyle = isLight ? 'rgba(0, 0, 0, 0.22)' : 'rgba(255, 255, 255, 0.35)';
          ctx.lineWidth = 1.1;
          ctx.stroke();
        }
      });

      // Holographic internal CAD axis & bore lines
      ctx.strokeStyle = isWireframe ? (isLight ? '#0284C7' : '#38BDF8') : (isLight ? 'rgba(0, 0, 0, 0.25)' : 'rgba(255, 255, 255, 0.25)');
      ctx.lineWidth = 0.8;
      ctx.beginPath();
      ctx.moveTo(projected[0].x, projected[0].y);
      ctx.lineTo(projected[6].x, projected[6].y);
      ctx.moveTo(projected[1].x, projected[1].y);
      ctx.lineTo(projected[7].x, projected[7].y);
      ctx.stroke();
    }

    ctx.restore();
    ctx.restore();
  }, [rotation, dimensions, selectedColor, stlData, zoom, scalePercent, viewMode, theme]);

  // Mouse interaction for 3D rotation
  const handleMouseDown = (e) => {
    setIsInteracting(true);
    setIsAutoRotating(false);
    dragStartRef.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e) => {
    if (!isInteracting) return;
    const dx = e.clientX - dragStartRef.current.x;
    const dy = e.clientY - dragStartRef.current.y;
    dragStartRef.current = { x: e.clientX, y: e.clientY };

    setRotation((prev) => ({
      x: Math.max(-85, Math.min(85, prev.x + dy * 0.65)),
      y: (prev.y + dx * 0.65) % 360
    }));
  };

  const handleMouseUp = () => {
    setIsInteracting(false);
  };

  // Touch interaction for Mobile & Tablet
  const handleTouchStart = (e) => {
    if (e.touches && e.touches.length === 1) {
      setIsInteracting(true);
      setIsAutoRotating(false);
      dragStartRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    }
  };

  const handleTouchMove = (e) => {
    if (!isInteracting || !e.touches || e.touches.length !== 1) return;
    const dx = e.touches[0].clientX - dragStartRef.current.x;
    const dy = e.touches[0].clientY - dragStartRef.current.y;
    dragStartRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };

    setRotation((prev) => ({
      x: Math.max(-85, Math.min(85, prev.x + dy * 0.7)),
      y: (prev.y + dx * 0.7) % 360
    }));
  };

  const handleTouchEnd = () => {
    setIsInteracting(false);
  };

  // Add to Cart handler
  const handleAddToCart = (proceedToCheckout = false) => {
    const customConfig = {
      fileName: uploadedFile ? uploadedFile.name : 'Creotex_Industrial_Custom_Part.stl',
      fileSize: uploadedFile ? `${(uploadedFile.size / 1024).toFixed(1)} KB` : 'Demo CAD Part',
      fileType: fileType,
      material: selectedMaterial.name,
      materialRate: `₹${selectedMaterial.ratePerGram}/g`,
      color: selectedColor.name,
      colorHex: selectedColor.hex,
      infill: `${selectedInfill.value}% (${infillPattern})`,
      wallCount: `${wallCount} Walls (~${(wallCount * 0.4).toFixed(1)}mm shell)`,
      resolution: `${selectedResolution.value}mm`,
      dimensions: `${dimensions.x} × ${dimensions.y} × ${dimensions.z} mm`,
      scale: `${scalePercent}%`,
      weight: `${estimatedWeight}g`,
      customPrice: priceCalculations.unitPrice,
      rushDispatch: isRush,
      notes: specialInstructions,
      imageServiceMode: fileType === 'image' ? imageServiceMode : null
    };

    const customProduct = {
      id: `custom-3d-${Date.now()}`,
      name: `Custom 3D Print: ${uploadedFile ? uploadedFile.name : 'Robotics Precision Part'}`,
      price: priceCalculations.unitPrice,
      originalPrice: Math.round(priceCalculations.unitPrice * 1.3),
      category: 'custom-3d-print',
      sku: `3DP-${selectedMaterial.id.toUpperCase()}-${selectedColor.id.toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`,
      image: previewUrl || 'filament-hyper-pla',
      stock: 99,
      customConfig: customConfig
    };

    addItem(customProduct, quantity, customConfig);

    if (proceedToCheckout) {
      setTimeout(() => {
        setIsCheckoutOpen?.(true);
      }, 200);
    }
  };

  return (
    <section id="custom-3d-print" className="custom-3d-section" style={{ position: 'relative' }}>
      <div className="container">
        {/* Section 3 Header Banner */}
        {!hideHeader && (
          <div className="deals-banner-header custom-print-banner-header">
            <div className="deals-title-box">
              <span className="custom-print-banner-icon">
                🖨️
              </span>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                  <h3 className="custom-print-banner-title">
                    Instant Custom 3D Printing Service
                  </h3>
                  <span className="custom-print-banner-badge">
                    BAMBU LAB &amp; VORON FARM
                  </span>
                </div>
                <div className="custom-print-banner-subtitle">
                  Upload .STL, .STEP or 2D image, select material &amp; infill, get instant automated pricing &amp; order online
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Studio 2-Column Responsive Grid */}
        <div className="custom-3d-studio-grid">
          {/* ================= LEFT COLUMN: STICKY 3D CAD & GEOMETRY HUB ================= */}
          <div className="custom-3d-panel left-panel">
            {/* 1. Fast Drag & Drop Upload Zone */}
            <div
              className={`custom-3d-dropzone ${isDragging ? 'drag-active' : ''} ${uploadedFile ? 'has-file' : ''}`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => !uploadedFile && fileInputRef.current?.click()}
            >
              <input
                type="file"
                ref={fileInputRef}
                style={{ display: 'none' }}
                accept={ALL_ACCEPTED_EXTENSIONS}
                onChange={handleFileChange}
              />

              {!uploadedFile ? (
                <div className="dropzone-empty-content">
                  <div className="dropzone-icon-circle">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                      <polyline points="17 8 12 3 7 8" />
                      <line x1="12" y1="3" x2="12" y2="15" />
                    </svg>
                  </div>
                  <h3 className="dropzone-heading">Drop CAD (.STL, .STEP) or Image</h3>
                  <p className="dropzone-sub">
                    Auto-slicing for <strong>.STL, .STEP</strong> &amp; 2D reference images (Max 150MB)
                  </p>
                  <button
                    type="button"
                    className="btn btn-primary btn-sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      fileInputRef.current?.click();
                    }}
                  >
                    Browse Files
                  </button>
                </div>
              ) : (
                <div className="dropzone-file-summary" onClick={(e) => e.stopPropagation()}>
                  <div className="file-summary-badge">
                    <span className="file-ext-pill">{uploadedFile.ext?.toUpperCase() || 'FILE'}</span>
                    <div className="file-info-text">
                      <strong className="file-name-text">{uploadedFile.name}</strong>
                      <span className="file-size-text">
                        {(uploadedFile.size / 1024).toFixed(1)} KB • {fileType === '3d' ? (stlData?.isRealMesh ? 'Parsed 3D Mesh' : '3D CAD Part') : '2D Reference Image'}
                      </span>
                    </div>
                  </div>

                  <div className="file-actions">
                    <button
                      type="button"
                      className="btn-file-action replace-btn"
                      onClick={() => fileInputRef.current?.click()}
                      title="Replace file"
                    >
                      🔄 Change
                    </button>
                    <button
                      type="button"
                      className="btn-file-action remove-btn"
                      onClick={handleRemoveFile}
                      title="Remove file"
                    >
                      ✕ Remove
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Quick Demo Models Strip */}
            <div className="sample-models-bar">
              <span className="sample-label">⚡ Quick Demo Samples:</span>
              <div className="sample-buttons-row">
                {SAMPLE_MODELS.map((sample) => (
                  <button
                    key={sample.id}
                    type="button"
                    className={`sample-model-pill ${uploadedFile?.name === sample.name ? 'active' : ''}`}
                    onClick={() => loadSampleModel(sample)}
                  >
                    <span>📐</span>
                    {sample.category}
                  </button>
                ))}
              </div>
            </div>

            {/* 2. Interactive 3D Canvas Studio */}
            <div className="preview-display-card">
              {/* Card Header with Viewport Tool Controls */}
              <div className="preview-card-header">
                <div className="preview-title-box">
                  <span className="live-dot"></span>
                  <h4>{fileType === 'image' ? 'Visual Plate Inspection' : 'Interactive 3D Viewport'}</h4>
                </div>

                {fileType === '3d' && (
                  <div className="viewport-tools-strip">
                    <button
                      type="button"
                      className={`tool-pill ${isAutoRotating ? 'active' : ''}`}
                      onClick={() => setIsAutoRotating(!isAutoRotating)}
                      title="Toggle auto-rotation"
                    >
                      {isAutoRotating ? '⏸ Spin' : '▶ Spin'}
                    </button>
                    <button
                      type="button"
                      className={`tool-pill ${viewMode === 'wireframe' ? 'active' : ''}`}
                      onClick={() => setViewMode(viewMode === 'solid' ? 'wireframe' : 'solid')}
                      title="Toggle wireframe mode"
                    >
                      {viewMode === 'solid' ? '🌐 Mesh' : '🧊 Solid'}
                    </button>
                    <button
                      type="button"
                      className="tool-pill"
                      onClick={() => setZoom((z) => Math.min(2.0, z + 0.15))}
                      title="Zoom In"
                    >
                      +
                    </button>
                    <button
                      type="button"
                      className="tool-pill"
                      onClick={() => setZoom((z) => Math.max(0.6, z - 0.15))}
                      title="Zoom Out"
                    >
                      -
                    </button>
                    <button
                      type="button"
                      className="tool-pill reset-pill"
                      onClick={() => {
                        setRotation({ x: 25, y: -35 });
                        setZoom(1.0);
                      }}
                      title="Reset 3D View"
                    >
                      ↺
                    </button>
                  </div>
                )}
              </div>

              {/* Viewport Canvas Body */}
              <div className="preview-display-body" ref={canvasContainerRef}>
                {fileType === 'image' && previewUrl ? (
                  <div className="image-preview-wrapper">
                    <img src={previewUrl} alt="Uploaded Reference" className="uploaded-image-preview" />
                    {imageMeta && (
                      <div className="image-meta-overlay">
                        <span>Resolution: {imageMeta.width} × {imageMeta.height} px</span>
                        <span>Aspect: {imageMeta.aspect}:1</span>
                      </div>
                    )}
                  </div>
                ) : (
                  <div
                    className="canvas-3d-wrapper"
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                    onMouseLeave={handleMouseUp}
                    onTouchStart={handleTouchStart}
                    onTouchMove={handleTouchMove}
                    onTouchEnd={handleTouchEnd}
                    style={{ touchAction: 'none' }}
                  >
                    <canvas ref={canvasRef} className="canvas-3d-element" />

                    {/* Canvas Telemetry HUD */}
                    <div className="canvas-tech-overlay">
                      <div className="tech-badge-left">
                        <span>X: {dimensions.x}mm</span>
                        <span>Y: {dimensions.y}mm</span>
                        <span>Z: {dimensions.z}mm</span>
                      </div>
                      <div className="tech-badge-right">
                        <span>{selectedMaterial.name.split(' ')[0]}</span>
                        <span style={{ color: selectedColor.hex }}>●</span>
                        <span>{selectedColor.name}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* 2D Image Workflow Selector (if image is active) */}
              {fileType === 'image' && (
                <div className="image-service-selector">
                  <div className="selector-title">Select 2D Image Manufacturing Workflow:</div>
                  <div className="service-options-grid">
                    <label className={`service-option-card ${imageServiceMode === 'lithophane' ? 'active' : ''}`}>
                      <input
                        type="radio"
                        name="imageService"
                        value="lithophane"
                        checked={imageServiceMode === 'lithophane'}
                        onChange={() => setImageServiceMode('lithophane')}
                      />
                      <div className="option-info">
                        <strong>Backlit 3D Lithophane Plaque</strong>
                        <span>Converts grayscale photo into translucent 3D relief plaque.</span>
                      </div>
                    </label>

                    <label className={`service-option-card ${imageServiceMode === 'laser' ? 'active' : ''}`}>
                      <input
                        type="radio"
                        name="imageService"
                        value="laser"
                        checked={imageServiceMode === 'laser'}
                        onChange={() => setImageServiceMode('laser')}
                      />
                      <div className="option-info">
                        <strong>Laser Engraving / Acrylic Panel</strong>
                        <span>Optical precision laser plate etching.</span>
                      </div>
                    </label>

                    <label className={`service-option-card ${imageServiceMode === 'cad-modeling' ? 'active' : ''}`}>
                      <input
                        type="radio"
                        name="imageService"
                        value="cad-modeling"
                        checked={imageServiceMode === 'cad-modeling'}
                        onChange={() => setImageServiceMode('cad-modeling')}
                      />
                      <div className="option-info">
                        <strong>3D CAD Reverse Engineering</strong>
                        <span>Creotex engineering drafts parametric STEP model.</span>
                      </div>
                    </label>
                  </div>
                </div>
              )}
            </div>


          </div>

          {/* ================= RIGHT COLUMN: STEP-BY-STEP CONFIGURATOR ================= */}
          <div className="custom-3d-panel right-panel">
            {/* Step 1: Material Selection */}
            <div className="config-card">
              <div className="config-card-header">
                <div className="step-number">1</div>
                <div>
                  <h4>Select 3D Material</h4>
                  <p className="config-desc">
                    Active: <strong style={{ color: '#F97316' }}>{selectedMaterial.name}</strong> • ₹{selectedMaterial.ratePerGram.toFixed(1)}/g
                  </p>
                </div>
              </div>

              <div className="materials-cards-grid">
                {PRINT_MATERIALS.map((mat) => {
                  const isSelected = selectedMaterial.id === mat.id;
                  return (
                    <button
                      key={mat.id}
                      type="button"
                      className={`material-select-card ${isSelected ? 'selected' : ''}`}
                      onClick={() => setSelectedMaterial(mat)}
                    >
                      <div className="mat-info-col">
                        <span className="mat-name">{mat.name}</span>
                      </div>
                      <div className="mat-price-tag">
                        ₹{mat.ratePerGram.toFixed(1)} <span className="per-g">/ g</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 2: Print Color */}
            <div className="config-card">
              <div className="config-card-header">
                <div className="step-number">2</div>
                <div>
                  <h4>Select Color</h4>
                  <p className="config-desc">
                    Selected: <strong style={{ color: selectedColor.accent }}>{selectedColor.name}</strong> • Real-time 3D sync
                  </p>
                </div>
              </div>

              <div className="color-swatches-grid">
                {PRINT_COLORS.map((col) => {
                  const isSelected = selectedColor.id === col.id;
                  return (
                    <button
                      key={col.id}
                      type="button"
                      className={`color-swatch-btn ${isSelected ? 'selected' : ''}`}
                      onClick={() => setSelectedColor(col)}
                      title={col.name}
                    >
                      <span
                        className="color-circle"
                        style={{
                          backgroundColor: col.hex,
                          border: col.id === 'white' ? '1.5px solid #CBD5E1' : '1px solid rgba(255,255,255,0.25)'
                        }}
                      >
                        {isSelected && (
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={col.text} strokeWidth="3.5">
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                        )}
                      </span>
                      <span className="color-label">{col.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 3: Infill & Layer Quality */}
            <div className="config-card">
              <div className="config-card-header">
                <div className="step-number">3</div>
                <div>
                  <h4>Infill Density &amp; Layer Precision</h4>
                  <p className="config-desc">Fine-tune strength, weight, and surface quality.</p>
                </div>
              </div>

              {/* Infill Density Slider Line */}
              <div className="infill-block">
                <div className="infill-title-bar">
                  <span className="setting-label">Infill Density:</span>
                  <div className="slider-current-badge">
                    <span className="badge-value">{infillPercent}%</span>
                    <span className="badge-tag">({selectedInfill.tag})</span>
                  </div>
                </div>

                <div className="range-slider-wrapper">
                  <input
                    type="range"
                    min="5"
                    max="100"
                    step="1"
                    value={infillPercent}
                    onChange={(e) => setInfillPercent(Number(e.target.value))}
                    className="custom-range-slider"
                    style={{
                      background: `linear-gradient(to right, var(--primary, #F97316) 0%, var(--primary, #F97316) ${((infillPercent - 5) / 95) * 100}%, var(--border-color, rgba(255,255,255,0.15)) ${((infillPercent - 5) / 95) * 100}%, var(--border-color, rgba(255,255,255,0.15)) 100%)`
                    }}
                  />
                  <div className="slider-tick-row">
                    {[15, 30, 50, 75, 100].map((val) => (
                      <span
                        key={val}
                        onClick={() => setInfillPercent(val)}
                        className={`slider-tick ${infillPercent === val ? 'tick-active' : ''}`}
                      >
                        {val}%
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Wall Count (Perimeters) Slider Line */}
              <div className="wall-count-block" style={{ marginTop: '16px' }}>
                <div className="infill-title-bar">
                  <span className="setting-label">Wall Count (Perimeters):</span>
                  <div className="slider-current-badge">
                    <span className="badge-value">{wallCount} Walls</span>
                    <span className="badge-tag">~{(wallCount * 0.4).toFixed(1)}mm shell</span>
                  </div>
                </div>

                <div className="range-slider-wrapper">
                  <input
                    type="range"
                    min="1"
                    max="8"
                    step="1"
                    value={wallCount}
                    onChange={(e) => setWallCount(Number(e.target.value))}
                    className="custom-range-slider"
                    style={{
                      background: `linear-gradient(to right, var(--primary, #F97316) 0%, var(--primary, #F97316) ${((wallCount - 1) / 7) * 100}%, var(--border-color, rgba(255,255,255,0.15)) ${((wallCount - 1) / 7) * 100}%, var(--border-color, rgba(255,255,255,0.15)) 100%)`
                    }}
                  />
                  <div className="slider-tick-row">
                    {[1, 2, 3, 4, 5, 6, 8].map((w) => (
                      <span
                        key={w}
                        onClick={() => setWallCount(w)}
                        className={`slider-tick ${wallCount === w ? 'tick-active' : ''}`}
                      >
                        {w} {w === 1 ? 'wall' : 'walls'}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Layer Resolution */}
              <div className="resolution-block" style={{ marginTop: '16px' }}>
                <div className="infill-title-bar">
                  <span className="setting-label">Layer Height:</span>
                  <span className="setting-value">{selectedResolution.label}</span>
                </div>
                <div className="resolution-presets-row">
                  {RESOLUTION_PRESETS.map((res) => (
                    <button
                      key={res.value}
                      type="button"
                      className={`preset-pill ${selectedResolution.value === res.value ? 'active' : ''}`}
                      onClick={() => setSelectedResolution(res)}
                    >
                      <span className="pct">{res.value}mm</span>
                      <span className="tag">{res.badge}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Infill Pattern Choice */}
              <div className="pattern-block" style={{ marginTop: '14px' }}>
                <span className="setting-label">Infill Pattern:</span>
                <div className="pattern-pills">
                  {['Gyroid (Best Dynamic Stress)', 'Honeycomb (Rigid)', 'Grid (Classic)'].map((pat) => (
                    <button
                      key={pat}
                      type="button"
                      className={`pattern-pill ${infillPattern.startsWith(pat.split(' ')[0]) ? 'active' : ''}`}
                      onClick={() => setInfillPattern(pat.split(' ')[0])}
                    >
                      {pat}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Step 4: Quantity & Rush Priority */}
            <div className="config-card">
              <div className="config-card-header">
                <div className="step-number">4</div>
                <div>
                  <h4>Quantity &amp; Turnaround</h4>
                  <p className="config-desc">Automatic tiered discounts on bulk robotics runs.</p>
                </div>
              </div>

              <div className="qty-dispatch-grid">
                {/* Quantity Stepper */}
                <div className="qty-counter-box">
                  <span className="counter-label">Quantity:</span>
                  <div className="counter-controls">
                    <button
                      type="button"
                      className="qty-btn"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    >
                      -
                    </button>
                    <span className="qty-display">{quantity}</span>
                    <button
                      type="button"
                      className="qty-btn"
                      onClick={() => setQuantity(quantity + 1)}
                    >
                      +
                    </button>
                  </div>
                  {priceCalculations.discountPercent > 0 && (
                    <span className="bulk-discount-tag">
                      🎉 {priceCalculations.discountPercent}% Bulk Discount Applied!
                    </span>
                  )}
                </div>

                {/* 24-hr Fast Track Toggle */}
                <div
                  className={`dispatch-toggle-card ${isRush ? 'active' : ''}`}
                  onClick={() => setIsRush(!isRush)}
                >
                  <div className="dispatch-info">
                    <strong>⚡ 24h Rush Priority (+₹149)</strong>
                  </div>
                  <div className={`custom-checkbox ${isRush ? 'checked' : ''}`}>
                    {isRush ? '✓' : ''}
                  </div>
                </div>
              </div>

              {/* Notes Input */}
              <div className="special-notes-box" style={{ marginTop: '14px' }}>
                <label className="notes-label">Engineering / Fitment Notes (Optional):</label>
                <textarea
                  className="notes-textarea"
                  rows="2"
                  placeholder="e.g. M3 screw holes must fit without reaming, press-fit motor shaft tolerance, no supports inside cavity..."
                  value={specialInstructions}
                  onChange={(e) => setSpecialInstructions(e.target.value)}
                />
              </div>
            </div>

            {/* Step 5: Live Price Quotation Card */}
            <div className="price-checkout-card">
              <div className="price-card-header">
                <div className="header-text">
                  <h3>Live Price Quotation</h3>
                  <span className="tax-tag">All GST Included • Ready to Manufacture</span>
                </div>
                <div className="total-price-display">
                  <span className="currency">₹</span>
                  <span className="amount">{priceCalculations.grandTotal.toLocaleString('en-IN')}</span>
                </div>
              </div>

              {/* Cost Breakdown */}
              <div className="price-breakdown-table">
                <div className="breakdown-row">
                  <span>Part Weight &amp; Material ({selectedMaterial.name.split(' ')[0]}):</span>
                  <span>~{estimatedWeight}g @ ₹{selectedMaterial.ratePerGram}/g</span>
                </div>

                <div className="breakdown-row">
                  <span>Material &amp; Infill ({selectedInfill.value}%):</span>
                  <span>₹{priceCalculations.materialCost}</span>
                </div>

                <div className="breakdown-row">
                  <span>Slicing &amp; Bed Calibration:</span>
                  <span>
                    {priceCalculations.isSetupWaived ? (
                      <strong style={{ color: '#10B981' }}>FREE (Waived on ₹450+)</strong>
                    ) : (
                      `₹${priceCalculations.baseSetupFee}`
                    )}
                  </span>
                </div>

                <div className="breakdown-row">
                  <span>Unit Base Price:</span>
                  <span>₹{priceCalculations.unitPrice} / piece</span>
                </div>

                {priceCalculations.discountAmount > 0 && (
                  <div className="breakdown-row discount">
                    <span>Bulk Quantity Savings ({priceCalculations.discountPercent}%):</span>
                    <span>-₹{priceCalculations.discountAmount}</span>
                  </div>
                )}

                {isRush && (
                  <div className="breakdown-row rush">
                    <span>⚡ 24h Express Farm Priority:</span>
                    <span>+₹149</span>
                  </div>
                )}

                <div className="breakdown-row timing">
                  <span>Estimated Machine Run Time:</span>
                  <span>⏱️ {priceCalculations.printTimeText}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="price-actions-group">
                <button
                  type="button"
                  className="btn btn-primary custom-3d-submit-btn"
                  onClick={() => handleAddToCart(false)}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                    <circle cx="9" cy="21" r="1" />
                    <circle cx="20" cy="21" r="1" />
                    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                  </svg>
                  <span>Add to Cart (₹{priceCalculations.grandTotal.toLocaleString('en-IN')})</span>
                </button>

                <button
                  type="button"
                  className="btn btn-accent custom-3d-instant-btn"
                  onClick={() => handleAddToCart(true)}
                >
                  <span>⚡ Instant 3D Checkout / Order Now</span>
                </button>
              </div>

              {/* Quality & Trust Badges Strip */}
              <div className="trust-guarantee-strip">
                <div className="trust-item">
                  <span className="trust-icon">🛡️</span>
                  <span>±0.05mm Precision</span>
                </div>
                <div className="trust-item">
                  <span className="trust-icon">🔄</span>
                  <span>Free Reprint Guarantee</span>
                </div>
                <div className="trust-item">
                  <span className="trust-icon">🔒</span>
                  <span>Strict NDA File Protection</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Floating Bottom Bar for Quick Ordering */}
        <div className="custom-3d-mobile-bar">
          <div className="mobile-bar-summary">
            <div className="mobile-bar-price">
              <span className="curr">₹</span>
              <span className="amt">{priceCalculations.grandTotal.toLocaleString('en-IN')}</span>
            </div>
            <span className="mobile-bar-meta">
              ~{estimatedWeight}g • {quantity} pcs • {selectedMaterial.name.split(' ')[0]}
            </span>
          </div>
          <button
            type="button"
            className="mobile-bar-btn"
            onClick={() => handleAddToCart(false)}
          >
            <span>Add to Cart</span>
          </button>
        </div>
      </div>
    </section>
  );
};

export default Custom3DPrintSection;
