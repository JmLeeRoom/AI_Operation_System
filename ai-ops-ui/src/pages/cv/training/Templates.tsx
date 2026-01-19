import { 
  Box,
  Target,
  Layers,
  User,
  FileText,
  Video,
  Cuboid,
  Waves,
  Sparkles,
  ArrowRight,
  CheckCircle,
  AlertCircle,
  Info
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function CVTrainingTemplates() {
  const navigate = useNavigate();

  const templates = [
    {
      id: 'classification',
      name: 'Image Classification',
      description: 'Classify images into predefined categories',
      icon: Box,
      color: 'from-cyan-500 to-blue-500',
      requirements: ['Labeled images with class tags'],
      models: ['ResNet', 'EfficientNet', 'ViT', 'ConvNeXt'],
      metrics: ['Accuracy', 'F1-Score', 'Top-5 Acc'],
      status: 'ready'
    },
    {
      id: 'detection',
      name: 'Object Detection',
      description: 'Detect and localize objects with bounding boxes',
      icon: Target,
      color: 'from-violet-500 to-purple-500',
      requirements: ['Images with bbox annotations', 'Class labels per bbox'],
      models: ['YOLOv8', 'YOLO11', 'RT-DETR', 'Faster R-CNN'],
      metrics: ['mAP@0.5', 'mAP@0.5:0.95', 'Precision', 'Recall'],
      status: 'ready'
    },
    {
      id: 'segmentation',
      name: 'Semantic Segmentation',
      description: 'Pixel-level classification for image regions',
      icon: Layers,
      color: 'from-emerald-500 to-green-500',
      requirements: ['Images with pixel masks', 'Class labels per pixel'],
      models: ['UNet', 'DeepLabV3+', 'SegFormer', 'Mask2Former'],
      metrics: ['mIoU', 'Dice Score', 'Pixel Accuracy'],
      status: 'ready'
    },
    {
      id: 'instance',
      name: 'Instance Segmentation',
      description: 'Detect and segment individual object instances',
      icon: Layers,
      color: 'from-rose-500 to-pink-500',
      requirements: ['Images with instance masks', 'Class labels per instance'],
      models: ['Mask R-CNN', 'YOLACT', 'SOLOv2', 'YOLOv8-seg'],
      metrics: ['mAP (mask)', 'mAP (bbox)', 'AP per class'],
      status: 'ready'
    },
    {
      id: 'pose',
      name: 'Pose Estimation',
      description: 'Detect human body keypoints and skeleton',
      icon: User,
      color: 'from-amber-500 to-orange-500',
      requirements: ['Images with keypoint annotations', '17+ keypoints per person'],
      models: ['HRNet', 'ViTPose', 'RTMPose', 'YOLOv8-pose'],
      metrics: ['OKS', 'AP', 'PCK'],
      status: 'ready'
    },
    {
      id: 'ocr',
      name: 'OCR / Text Detection',
      description: 'Detect and recognize text in images',
      icon: FileText,
      color: 'from-sky-500 to-cyan-500',
      requirements: ['Images with text regions', 'Text transcriptions'],
      models: ['PaddleOCR', 'EasyOCR', 'TrOCR', 'CRAFT'],
      metrics: ['CER', 'WER', 'Detection F1'],
      status: 'ready'
    },
    {
      id: 'tracking',
      name: 'Multi-Object Tracking',
      description: 'Track objects across video frames',
      icon: Video,
      color: 'from-indigo-500 to-blue-500',
      requirements: ['Video sequences', 'Track ID annotations'],
      models: ['ByteTrack', 'BoT-SORT', 'DeepSORT', 'OC-SORT'],
      metrics: ['MOTA', 'IDF1', 'HOTA', 'ID Switches'],
      status: 'beta'
    },
    {
      id: '3d',
      name: '3D Object Detection',
      description: 'Detect objects in 3D space from point clouds or images',
      icon: Cuboid,
      color: 'from-slate-500 to-gray-500',
      requirements: ['Point cloud / RGBD data', '3D bbox annotations'],
      models: ['PointPillars', 'SECOND', 'CenterPoint'],
      metrics: ['3D mAP', 'BEV mAP'],
      status: 'coming_soon'
    },
    {
      id: 'depth',
      name: 'Depth Estimation',
      description: 'Estimate depth from monocular images',
      icon: Waves,
      color: 'from-teal-500 to-cyan-500',
      requirements: ['Images with depth maps or LiDAR'],
      models: ['MiDaS', 'DPT', 'AdaBins', 'DepthAnything'],
      metrics: ['RMSE', 'AbsRel', 'SILog'],
      status: 'beta'
    },
    {
      id: 'generative',
      name: 'Image Generation',
      description: 'Generate or enhance images using AI',
      icon: Sparkles,
      color: 'from-fuchsia-500 to-pink-500',
      requirements: ['Training images', 'Optional: text descriptions'],
      models: ['Stable Diffusion', 'ControlNet', 'SDXL'],
      metrics: ['FID', 'LPIPS', 'Human Eval'],
      status: 'coming_soon'
    },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'ready':
        return <span className="badge badge-emerald flex items-center gap-1"><CheckCircle className="w-3 h-3" /> Ready</span>;
      case 'beta':
        return <span className="badge badge-amber flex items-center gap-1"><AlertCircle className="w-3 h-3" /> Beta</span>;
      case 'coming_soon':
        return <span className="badge badge-slate flex items-center gap-1"><Info className="w-3 h-3" /> Coming Soon</span>;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Training Templates</h1>
          <p className="text-slate-400 mt-1">CV 태스크별 학습 템플릿 선택</p>
        </div>
      </div>

      {/* 안내 메시지 */}
      <div className="glass-card p-4 border-brand-500/30 bg-brand-500/5">
        <div className="flex items-start gap-3">
          <Info className="w-5 h-5 text-brand-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm text-slate-200">
              템플릿을 선택하면 해당 태스크에 최적화된 DAG 파이프라인이 자동 구성됩니다.
            </p>
            <p className="text-xs text-slate-400 mt-1">
              각 템플릿은 데이터 전처리, 학습, 평가 노드가 포함된 기본 파이프라인을 제공합니다.
            </p>
          </div>
        </div>
      </div>

      {/* 템플릿 그리드 */}
      <div className="grid grid-cols-2 gap-4">
        {templates.map((template, index) => (
          <div
            key={template.id}
            className={`glass-card p-6 cursor-pointer group transition-all hover:border-brand-500/30 ${
              template.status === 'coming_soon' ? 'opacity-60 cursor-not-allowed' : ''
            }`}
            style={{ animationDelay: `${index * 50}ms` }}
            onClick={() => template.status !== 'coming_soon' && navigate('/cv/training/config')}
          >
            <div className="flex items-start gap-4">
              {/* 아이콘 */}
              <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${template.color} flex items-center justify-center shadow-lg flex-shrink-0`}>
                <template.icon className="w-7 h-7 text-white" />
              </div>

              {/* 내용 */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-lg font-semibold text-white group-hover:text-brand-400 transition-colors">
                    {template.name}
                  </h3>
                  {getStatusBadge(template.status)}
                </div>
                <p className="text-sm text-slate-400 mb-4">{template.description}</p>

                {/* 요구사항 */}
                <div className="mb-3">
                  <p className="text-xs text-slate-500 mb-1">Requirements:</p>
                  <div className="flex flex-wrap gap-1">
                    {template.requirements.map((req, i) => (
                      <span key={i} className="px-2 py-0.5 bg-slate-800/50 text-slate-400 text-xs rounded">
                        {req}
                      </span>
                    ))}
                  </div>
                </div>

                {/* 모델 & 메트릭 */}
                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <p className="text-slate-500 mb-1">Supported Models:</p>
                    <p className="text-slate-300">{template.models.join(', ')}</p>
                  </div>
                  <div>
                    <p className="text-slate-500 mb-1">Metrics:</p>
                    <p className="text-slate-300">{template.metrics.join(', ')}</p>
                  </div>
                </div>
              </div>

              {/* 화살표 */}
              {template.status !== 'coming_soon' && (
                <ArrowRight className="w-5 h-5 text-slate-500 group-hover:text-brand-400 group-hover:translate-x-1 transition-all flex-shrink-0" />
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
