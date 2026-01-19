import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/layout/Layout';

// Common Pages
import { Home } from './pages/Home';
import { PipelineList } from './pages/pipelines/PipelineList';
import { PipelineBuilder } from './pages/pipelines/PipelineBuilder';
import { Templates } from './pages/pipelines/Templates';
import { RunList } from './pages/runs/RunList';
import { RunDetail } from './pages/runs/RunDetail';
import { Connections } from './pages/data/Connections';
import { Datasets } from './pages/data/Datasets';
import { Versions } from './pages/data/Versions';
import { Validation } from './pages/data/Validation';
import { Lineage } from './pages/data/Lineage';
import { ExperimentList } from './pages/experiments/ExperimentList';
import { CompareView } from './pages/experiments/CompareView';
import { ModelRegistry } from './pages/models/ModelRegistry';
import { Evaluations } from './pages/models/Evaluations';
import { Endpoints } from './pages/deployments/Endpoints';
import { Releases } from './pages/deployments/Releases';
import { Dashboard as MonitoringDashboard } from './pages/monitoring/Dashboard';
import { Drift } from './pages/monitoring/Drift';
import { Alerts } from './pages/monitoring/Alerts';
import { Feedback } from './pages/monitoring/Feedback';
import { ComputeTargets } from './pages/resources/ComputeTargets';
import { Queues } from './pages/resources/Queues';
import { ResourceProfiles } from './pages/resources/ResourceProfiles';
import { CostBudget } from './pages/resources/CostBudget';
import { UsersRoles } from './pages/governance/UsersRoles';
import { AuditLog } from './pages/governance/AuditLog';
import { Secrets } from './pages/governance/Secrets';
import { Policies } from './pages/governance/Policies';

// CV Domain Pages
import { CVDashboard } from './pages/cv/Dashboard';
import { CVDataSources } from './pages/cv/data/Sources';
import { CVDatasets } from './pages/cv/data/Datasets';
import { CVDatasetDetail } from './pages/cv/data/DatasetDetail';
import { AnnotationJobs } from './pages/cv/labeling/AnnotationJobs';
import { LabelQA } from './pages/cv/labeling/LabelQA';
import { ActiveLearning } from './pages/cv/labeling/ActiveLearning';
import { Augmentation } from './pages/cv/Augmentation';
import { CVTrainingTemplates } from './pages/cv/training/Templates';
import { TrainConfig } from './pages/cv/training/TrainConfig';
import { CVMetrics } from './pages/cv/evaluation/Metrics';
import { ErrorAnalysis } from './pages/cv/evaluation/ErrorAnalysis';
import { CVModelRegistry } from './pages/cv/models/Registry';
import { CVModelExport } from './pages/cv/models/Export';

// LLM Domain Pages
import { LLMDashboard } from './pages/llm/Dashboard';
import { LLMDataSources } from './pages/llm/data/Sources';
import { LLMDataProcessing } from './pages/llm/data/Processing';
import { LLMDataLabeling } from './pages/llm/data/Labeling';
import { LLMTrainingTemplates } from './pages/llm/training/Templates';
import { LLMTrainingConfig } from './pages/llm/training/Config';
import { LLMEvalSuites } from './pages/llm/evaluation/Suites';
import { LLMSafetyTesting } from './pages/llm/evaluation/Safety';
import { LLMRegressionTesting } from './pages/llm/evaluation/Regression';
import { RAGDocuments } from './pages/llm/rag/Documents';
import { RAGChunking } from './pages/llm/rag/Chunking';
import { RAGEmbeddings } from './pages/llm/rag/Embeddings';
import { RAGPlayground } from './pages/llm/rag/Playground';
import { AgentTools } from './pages/llm/agents/Tools';
import { AgentBuilder } from './pages/llm/agents/Builder';
import { AgentTraces } from './pages/llm/agents/Traces';
import { LLMEndpoints } from './pages/llm/deployment/Endpoints';
import { LLMPrompts } from './pages/llm/deployment/Prompts';

// Audio Domain Pages
import { AudioDashboard } from './pages/audio/Dashboard';
import { AudioDataSources } from './pages/audio/data/Sources';
import { AudioProcessing } from './pages/audio/data/Processing';
import { AudioQAReport } from './pages/audio/data/QA';
import { ASRTranscripts } from './pages/audio/asr/Transcripts';
import { ASRAlignment } from './pages/audio/asr/Alignment';
import { ASRTraining } from './pages/audio/asr/Training';
import { ASREval } from './pages/audio/asr/Eval';
import { ASRPlayground } from './pages/audio/asr/Playground';
import { TTSNormalization } from './pages/audio/tts/Normalization';
import { TTSDataset } from './pages/audio/tts/Dataset';
import { TTSTraining } from './pages/audio/tts/Training';
import { TTSEval } from './pages/audio/tts/Eval';
import { VCSpeakers } from './pages/audio/vc/Speakers';
import { VCTraining } from './pages/audio/vc/Training';
import { MusicDataset } from './pages/audio/music/Dataset';
import { MusicPlayground } from './pages/audio/music/Playground';
import { MusicEval } from './pages/audio/music/Eval';
import { AudioEndpoints } from './pages/audio/deployment/Endpoints';
import { AudioMonitoring } from './pages/audio/deployment/Monitoring';

// Multimodal Domain Pages
import { Dashboard as MMDashboard } from './pages/multimodal/Dashboard';
import { Sources as MMSources } from './pages/multimodal/data/Sources';
import { Datasets as MMDatasets } from './pages/multimodal/data/Datasets';
import { DatasetDetail as MMDatasetDetail } from './pages/multimodal/data/DatasetDetail';
import { Pairing as MMPairing } from './pages/multimodal/data/Pairing';
import { Alignment as MMAlignment } from './pages/multimodal/data/Alignment';
import { Preprocess as MMPreprocess } from './pages/multimodal/data/Preprocess';
import { Labeling as MMLabeling } from './pages/multimodal/data/Labeling';
import { Embedding as MMEmbedding } from './pages/multimodal/data/Embedding';
import { Templates as MMTemplates } from './pages/multimodal/training/Templates';
import { Config as MMConfig } from './pages/multimodal/training/Config';
import { RunDetail as MMRunDetail } from './pages/multimodal/training/RunDetail';
import { TaskEval as MMTaskEval } from './pages/multimodal/evaluation/TaskEval';
import { Grounding as MMGrounding } from './pages/multimodal/evaluation/Grounding';
import { Regression as MMRegression } from './pages/multimodal/evaluation/Regression';
import { HumanReview as MMHumanReview } from './pages/multimodal/evaluation/HumanReview';
import { Playground as MMPlayground } from './pages/multimodal/serving/Playground';
import { Tools as MMTools } from './pages/multimodal/serving/Tools';
import { AgentBuilder as MMAgentBuilder } from './pages/multimodal/serving/AgentBuilder';
import { Traces as MMTraces } from './pages/multimodal/serving/Traces';
import { Registry as MMRegistry } from './pages/multimodal/deployment/Registry';
import { Endpoints as MMEndpoints } from './pages/multimodal/deployment/Endpoints';
import { Monitoring as MMMonitoring } from './pages/multimodal/deployment/Monitoring';

// Time Series / Tabular Domain Pages
import { Dashboard as TSDashboard } from './pages/timeseries/Dashboard';
import { Connections as TSConnections } from './pages/timeseries/data/Connections';
import { Datasets as TSDatasets } from './pages/timeseries/data/Datasets';
import { DatasetDetail as TSDatasetDetail } from './pages/timeseries/data/DatasetDetail';
import { Quality as TSQuality } from './pages/timeseries/data/Quality';
import { FeaturePipeline as TSFeaturePipeline } from './pages/timeseries/data/FeaturePipeline';
import { FeatureStore as TSFeatureStore } from './pages/timeseries/data/FeatureStore';
import { Targets as TSTargets } from './pages/timeseries/data/Targets';
import { Templates as TSTemplates } from './pages/timeseries/modeling/Templates';
import { Config as TSConfig } from './pages/timeseries/modeling/Config';
import { RunDetail as TSRunDetail } from './pages/timeseries/modeling/RunDetail';
import { Backtest as TSBacktest } from './pages/timeseries/evaluation/Backtest';
import { BacktestReport as TSBacktestReport } from './pages/timeseries/evaluation/BacktestReport';
import { Metrics as TSMetrics } from './pages/timeseries/evaluation/Metrics';
import { ErrorAnalysis as TSErrorAnalysis } from './pages/timeseries/evaluation/ErrorAnalysis';
import { Benchmark as TSBenchmark } from './pages/timeseries/evaluation/Benchmark';
import { ThresholdTuning as TSThresholdTuning } from './pages/timeseries/anomaly/ThresholdTuning';
import { AlertTriage as TSAlertTriage } from './pages/timeseries/anomaly/AlertTriage';
import { Registry as TSRegistry } from './pages/timeseries/deployment/Registry';
import { Endpoints as TSEndpoints } from './pages/timeseries/deployment/Endpoints';
import { Rollout as TSRollout } from './pages/timeseries/deployment/Rollout';
import { Monitoring as TSMonitoring } from './pages/timeseries/monitoring/Monitoring';
import { Alerts as TSAlerts } from './pages/timeseries/monitoring/Alerts';
import { Feedback as TSFeedback } from './pages/timeseries/monitoring/Feedback';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          {/* Home */}
          <Route index element={<Home />} />

          {/* Pipelines */}
          <Route path="pipelines" element={<PipelineList />} />
          <Route path="pipelines/builder" element={<PipelineBuilder />} />
          <Route path="pipelines/templates" element={<Templates />} />

          {/* Runs */}
          <Route path="runs" element={<RunList />} />
          <Route path="runs/detail" element={<RunDetail />} />

          {/* Data */}
          <Route path="data/connections" element={<Connections />} />
          <Route path="data/datasets" element={<Datasets />} />
          <Route path="data/versions" element={<Versions />} />
          <Route path="data/validation" element={<Validation />} />
          <Route path="data/lineage" element={<Lineage />} />
          <Route path="data" element={<Navigate to="/data/connections" replace />} />

          {/* Experiments */}
          <Route path="experiments" element={<ExperimentList />} />
          <Route path="experiments/compare" element={<CompareView />} />

          {/* Models */}
          <Route path="models/registry" element={<ModelRegistry />} />
          <Route path="models/evaluations" element={<Evaluations />} />

          {/* Deployments */}
          <Route path="deployments/endpoints" element={<Endpoints />} />
          <Route path="deployments/releases" element={<Releases />} />

          {/* Monitoring */}
          <Route path="monitoring/dashboard" element={<MonitoringDashboard />} />
          <Route path="monitoring/drift" element={<Drift />} />
          <Route path="monitoring/alerts" element={<Alerts />} />
          <Route path="monitoring/feedback" element={<Feedback />} />

          {/* Resources */}
          <Route path="resources/compute" element={<ComputeTargets />} />
          <Route path="resources/queues" element={<Queues />} />
          <Route path="resources/profiles" element={<ResourceProfiles />} />
          <Route path="resources/cost" element={<CostBudget />} />

          {/* Governance */}
          <Route path="governance/users" element={<UsersRoles />} />
          <Route path="governance/audit" element={<AuditLog />} />
          <Route path="governance/secrets" element={<Secrets />} />
          <Route path="governance/policies" element={<Policies />} />

          {/* ==================== CV Domain ==================== */}
          {/* CV Dashboard */}
          <Route path="cv" element={<CVDashboard />} />
          <Route path="cv/pipeline" element={<Navigate to="/pipelines/builder?domain=cv" replace />} />

          {/* CV Data */}
          <Route path="cv/data/sources" element={<CVDataSources />} />
          <Route path="cv/data/datasets" element={<CVDatasets />} />
          <Route path="cv/data/datasets/detail" element={<CVDatasetDetail />} />

          {/* CV Labeling */}
          <Route path="cv/labeling/jobs" element={<AnnotationJobs />} />
          <Route path="cv/labeling/qa" element={<LabelQA />} />
          <Route path="cv/labeling/active-learning" element={<ActiveLearning />} />

          {/* CV Augmentation */}
          <Route path="cv/augmentation" element={<Augmentation />} />

          {/* CV Training */}
          <Route path="cv/training/templates" element={<CVTrainingTemplates />} />
          <Route path="cv/training/config" element={<TrainConfig />} />

          {/* CV Evaluation */}
          <Route path="cv/evaluation/metrics" element={<CVMetrics />} />
          <Route path="cv/evaluation/errors" element={<ErrorAnalysis />} />

          {/* CV Models */}
          <Route path="cv/models/registry" element={<CVModelRegistry />} />
          <Route path="cv/models/export" element={<CVModelExport />} />

          {/* ==================== LLM Domain ==================== */}
          {/* LLM Dashboard */}
          <Route path="llm" element={<LLMDashboard />} />
          <Route path="llm/pipeline" element={<Navigate to="/pipelines/builder?domain=llm" replace />} />

          {/* LLM Data Pipeline */}
          <Route path="llm/data/sources" element={<LLMDataSources />} />
          <Route path="llm/data/processing" element={<LLMDataProcessing />} />
          <Route path="llm/data/labeling" element={<LLMDataLabeling />} />

          {/* LLM Training */}
          <Route path="llm/training/templates" element={<LLMTrainingTemplates />} />
          <Route path="llm/training/config" element={<LLMTrainingConfig />} />

          {/* LLM Evaluation */}
          <Route path="llm/evaluation/suites" element={<LLMEvalSuites />} />
          <Route path="llm/evaluation/safety" element={<LLMSafetyTesting />} />
          <Route path="llm/evaluation/regression" element={<LLMRegressionTesting />} />

          {/* RAG */}
          <Route path="llm/rag/documents" element={<RAGDocuments />} />
          <Route path="llm/rag/chunking" element={<RAGChunking />} />
          <Route path="llm/rag/embeddings" element={<RAGEmbeddings />} />
          <Route path="llm/rag/playground" element={<RAGPlayground />} />

          {/* Agents */}
          <Route path="llm/agents/tools" element={<AgentTools />} />
          <Route path="llm/agents/builder" element={<AgentBuilder />} />
          <Route path="llm/agents/traces" element={<AgentTraces />} />

          {/* LLM Deployment */}
          <Route path="llm/deployment/endpoints" element={<LLMEndpoints />} />
          <Route path="llm/deployment/prompts" element={<LLMPrompts />} />

          {/* ==================== Audio Domain ==================== */}
          {/* Audio Dashboard */}
          <Route path="audio" element={<AudioDashboard />} />
          <Route path="audio/pipeline" element={<Navigate to="/pipelines/builder?domain=audio" replace />} />

          {/* Audio Data Pipeline */}
          <Route path="audio/data/sources" element={<AudioDataSources />} />
          <Route path="audio/data/processing" element={<AudioProcessing />} />
          <Route path="audio/data/qa" element={<AudioQAReport />} />

          {/* ASR */}
          <Route path="audio/asr/transcripts" element={<ASRTranscripts />} />
          <Route path="audio/asr/alignment" element={<ASRAlignment />} />
          <Route path="audio/asr/training" element={<ASRTraining />} />
          <Route path="audio/asr/eval" element={<ASREval />} />
          <Route path="audio/asr/playground" element={<ASRPlayground />} />

          {/* TTS */}
          <Route path="audio/tts/normalization" element={<TTSNormalization />} />
          <Route path="audio/tts/dataset" element={<TTSDataset />} />
          <Route path="audio/tts/training" element={<TTSTraining />} />
          <Route path="audio/tts/eval" element={<TTSEval />} />

          {/* Voice Conversion */}
          <Route path="audio/vc/speakers" element={<VCSpeakers />} />
          <Route path="audio/vc/training" element={<VCTraining />} />

          {/* Music Generation */}
          <Route path="audio/music/dataset" element={<MusicDataset />} />
          <Route path="audio/music/playground" element={<MusicPlayground />} />
          <Route path="audio/music/eval" element={<MusicEval />} />

          {/* Audio Deployment */}
          <Route path="audio/deployment/endpoints" element={<AudioEndpoints />} />
          <Route path="audio/deployment/monitoring" element={<AudioMonitoring />} />

          {/* ==================== Multimodal Domain ==================== */}
          {/* Multimodal Dashboard */}
          <Route path="multimodal" element={<MMDashboard />} />
          <Route path="multimodal/pipeline" element={<Navigate to="/pipelines/builder?domain=multimodal" replace />} />

          {/* Multimodal Data */}
          <Route path="multimodal/data/sources" element={<MMSources />} />
          <Route path="multimodal/data/datasets" element={<MMDatasets />} />
          <Route path="multimodal/data/datasets/:id" element={<MMDatasetDetail />} />
          <Route path="multimodal/data/pairing" element={<MMPairing />} />
          <Route path="multimodal/data/alignment" element={<MMAlignment />} />
          <Route path="multimodal/data/preprocess" element={<MMPreprocess />} />
          <Route path="multimodal/data/labeling" element={<MMLabeling />} />
          <Route path="multimodal/data/embedding" element={<MMEmbedding />} />

          {/* Multimodal Training */}
          <Route path="multimodal/training/templates" element={<MMTemplates />} />
          <Route path="multimodal/training/config" element={<MMConfig />} />
          <Route path="multimodal/training/runs" element={<MMRunDetail />} />

          {/* Multimodal Evaluation */}
          <Route path="multimodal/evaluation/tasks" element={<MMTaskEval />} />
          <Route path="multimodal/evaluation/grounding" element={<MMGrounding />} />
          <Route path="multimodal/evaluation/regression" element={<MMRegression />} />
          <Route path="multimodal/evaluation/review" element={<MMHumanReview />} />

          {/* Multimodal Serving & Agents */}
          <Route path="multimodal/serving/playground" element={<MMPlayground />} />
          <Route path="multimodal/serving/tools" element={<MMTools />} />
          <Route path="multimodal/serving/agent-builder" element={<MMAgentBuilder />} />
          <Route path="multimodal/serving/traces" element={<MMTraces />} />

          {/* Multimodal Deployment */}
          <Route path="multimodal/deployment/registry" element={<MMRegistry />} />
          <Route path="multimodal/deployment/endpoints" element={<MMEndpoints />} />
          <Route path="multimodal/deployment/monitoring" element={<MMMonitoring />} />

          {/* ==================== Time Series / Tabular Domain ==================== */}
          {/* TS Dashboard */}
          <Route path="timeseries" element={<TSDashboard />} />
          <Route path="timeseries/pipeline" element={<Navigate to="/pipelines/builder?domain=timeseries" replace />} />

          {/* TS Data */}
          <Route path="timeseries/data/connections" element={<TSConnections />} />
          <Route path="timeseries/data/datasets" element={<TSDatasets />} />
          <Route path="timeseries/data/datasets/:id" element={<TSDatasetDetail />} />
          <Route path="timeseries/data/quality" element={<TSQuality />} />
          <Route path="timeseries/data/features" element={<TSFeaturePipeline />} />
          <Route path="timeseries/data/store" element={<TSFeatureStore />} />
          <Route path="timeseries/data/targets" element={<TSTargets />} />

          {/* TS Modeling */}
          <Route path="timeseries/modeling/templates" element={<TSTemplates />} />
          <Route path="timeseries/modeling/config" element={<TSConfig />} />
          <Route path="timeseries/modeling/run" element={<TSRunDetail />} />

          {/* TS Evaluation */}
          <Route path="timeseries/evaluation/backtest" element={<TSBacktest />} />
          <Route path="timeseries/evaluation/report" element={<TSBacktestReport />} />
          <Route path="timeseries/evaluation/metrics" element={<TSMetrics />} />
          <Route path="timeseries/evaluation/errors" element={<TSErrorAnalysis />} />
          <Route path="timeseries/evaluation/benchmark" element={<TSBenchmark />} />

          {/* Anomaly Detection Ops */}
          <Route path="timeseries/anomaly/threshold" element={<TSThresholdTuning />} />
          <Route path="timeseries/anomaly/triage" element={<TSAlertTriage />} />

          {/* TS Deployment */}
          <Route path="timeseries/deployment/registry" element={<TSRegistry />} />
          <Route path="timeseries/deployment/endpoints" element={<TSEndpoints />} />
          <Route path="timeseries/deployment/rollout" element={<TSRollout />} />

          {/* TS Monitoring */}
          <Route path="timeseries/monitoring/dashboard" element={<TSMonitoring />} />
          <Route path="timeseries/monitoring/alerts" element={<TSAlerts />} />
          <Route path="timeseries/monitoring/feedback" element={<TSFeedback />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
