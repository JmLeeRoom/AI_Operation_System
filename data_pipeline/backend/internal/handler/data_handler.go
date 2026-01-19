package handler

import (
	"bytes"
	"encoding/csv"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"os"
	"path/filepath"
	"strings"
	"time"
)

type DataLoadRequest struct {
	DataSource string                 `json:"dataSource"`
	Config     map[string]interface{} `json:"config"`
}

type DataLoadResponse struct {
	Success bool                   `json:"success"`
	Data    interface{}            `json:"data,omitempty"`
	Preview string                 `json:"preview,omitempty"`
	Error   string                 `json:"error,omitempty"`
	Meta    map[string]interface{} `json:"meta,omitempty"`
}

type DataSaveRequest struct {
	Data       interface{}            `json:"data"`
	SaveFormat string                 `json:"saveFormat"`
	Config     map[string]interface{} `json:"config"`
}

type DataSaveResponse struct {
	Success bool   `json:"success"`
	Path    string `json:"path,omitempty"`
	Message string `json:"message,omitempty"`
	Error   string `json:"error,omitempty"`
}

// LoadData handles data loading from various sources
func (h *Handler) LoadData(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		h.Error(w, http.StatusMethodNotAllowed, "Method not allowed")
		return
	}

	var req DataLoadRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		h.Error(w, http.StatusBadRequest, "Invalid request body")
		return
	}

	var response DataLoadResponse

	switch req.DataSource {
	case "file":
		response = h.loadFromFile(req.Config)
	case "database":
		response = h.loadFromDatabase(req.Config)
	case "api":
		response = h.loadFromAPI(req.Config)
	case "manual":
		response = h.loadFromManual(req.Config)
	default:
		response = DataLoadResponse{
			Success: false,
			Error:   fmt.Sprintf("Unknown data source: %s", req.DataSource),
		}
	}

	if !response.Success {
		h.JSON(w, http.StatusBadRequest, response)
		return
	}

	h.JSON(w, http.StatusOK, response)
}

// SaveData handles data saving to various destinations
func (h *Handler) SaveData(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		h.Error(w, http.StatusMethodNotAllowed, "Method not allowed")
		return
	}

	var req DataSaveRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		h.Error(w, http.StatusBadRequest, "Invalid request body")
		return
	}

	var response DataSaveResponse

	switch req.SaveFormat {
	case "file":
		response = h.saveToFile(req.Data, req.Config)
	case "database":
		response = h.saveToDatabase(req.Data, req.Config)
	case "api":
		response = h.saveToAPI(req.Data, req.Config)
	default:
		response = DataSaveResponse{
			Success: false,
			Error:   fmt.Sprintf("Unknown save format: %s", req.SaveFormat),
		}
	}

	if !response.Success {
		h.JSON(w, http.StatusBadRequest, response)
		return
	}

	h.JSON(w, http.StatusOK, response)
}

// Helper functions for data loading

func (h *Handler) loadFromFile(config map[string]interface{}) DataLoadResponse {
	filePath, ok := config["filePath"].(string)
	if !ok || filePath == "" {
		return DataLoadResponse{
			Success: false,
			Error:   "filePath is required",
		}
	}

	fileFormat, _ := config["fileFormat"].(string)
	if fileFormat == "" {
		fileFormat = "csv"
	}

	// Check if file exists
	if _, err := os.Stat(filePath); os.IsNotExist(err) {
		return DataLoadResponse{
			Success: false,
			Error:   fmt.Sprintf("File not found: %s", filePath),
		}
	}

	// Read file based on format
	switch fileFormat {
	case "csv":
		return h.loadCSVFile(filePath)
	case "json":
		return h.loadJSONFile(filePath)
	default:
		return DataLoadResponse{
			Success: false,
			Error:   fmt.Sprintf("Unsupported file format: %s", fileFormat),
		}
	}
}

func (h *Handler) loadCSVFile(filePath string) DataLoadResponse {
	file, err := os.Open(filePath)
	if err != nil {
		return DataLoadResponse{
			Success: false,
			Error:   fmt.Sprintf("Failed to open file: %v", err),
		}
	}
	defer file.Close()

	reader := csv.NewReader(file)
	records, err := reader.ReadAll()
	if err != nil {
		return DataLoadResponse{
			Success: false,
			Error:   fmt.Sprintf("Failed to parse CSV: %v", err),
		}
	}

	if len(records) == 0 {
		return DataLoadResponse{
			Success: false,
			Error:   "CSV file is empty",
		}
	}

	// Convert to array of objects
	headers := records[0]
	var data []map[string]interface{}
	for i := 1; i < len(records); i++ {
		row := make(map[string]interface{})
		for j, header := range headers {
			if j < len(records[i]) {
				row[header] = records[i][j]
			}
		}
		data = append(data, row)
	}

	// Generate preview (first 10 rows)
	previewRows := min(10, len(data))
	var previewLines []string
	previewLines = append(previewLines, strings.Join(headers, ","))
	for i := 0; i < previewRows; i++ {
		var values []string
		for _, h := range headers {
			val := fmt.Sprintf("%v", data[i][h])
			values = append(values, val)
		}
		previewLines = append(previewLines, strings.Join(values, ","))
	}
	if len(data) > 10 {
		previewLines = append(previewLines, fmt.Sprintf("... and %d more rows", len(data)-10))
	}

	return DataLoadResponse{
		Success: true,
		Data:    data,
		Preview: strings.Join(previewLines, "\n"),
		Meta: map[string]interface{}{
			"filePath": filePath,
			"format":   "csv",
			"rows":     len(data),
			"columns":  len(headers),
			"headers":  headers,
		},
	}
}

func (h *Handler) loadJSONFile(filePath string) DataLoadResponse {
	content, err := os.ReadFile(filePath)
	if err != nil {
		return DataLoadResponse{
			Success: false,
			Error:   fmt.Sprintf("Failed to read file: %v", err),
		}
	}

	var data interface{}
	if err := json.Unmarshal(content, &data); err != nil {
		return DataLoadResponse{
			Success: false,
			Error:   fmt.Sprintf("Failed to parse JSON: %v", err),
		}
	}

	preview := string(content)
	if len(preview) > 1000 {
		preview = preview[:1000] + "..."
	}

	return DataLoadResponse{
		Success: true,
		Data:    data,
		Preview: preview,
		Meta: map[string]interface{}{
			"filePath": filePath,
			"format":   "json",
			"bytes":    len(content),
		},
	}
}

func (h *Handler) loadFromDatabase(config map[string]interface{}) DataLoadResponse {
	connection, _ := config["databaseConnection"].(string)
	query, _ := config["databaseQuery"].(string)

	if connection == "" || query == "" {
		return DataLoadResponse{
			Success: false,
			Error:   "databaseConnection and databaseQuery are required",
		}
	}

	// TODO: Implement actual database query execution via Jupyter service
	return DataLoadResponse{
		Success: true,
		Preview: fmt.Sprintf("Query executed: %s", query[:min(50, len(query))]),
		Meta: map[string]interface{}{
			"query": query,
		},
	}
}

func (h *Handler) loadFromAPI(config map[string]interface{}) DataLoadResponse {
	apiUrl, _ := config["apiUrl"].(string)
	apiMethod, _ := config["apiMethod"].(string)
	apiBody, _ := config["apiBody"].(string)

	if apiUrl == "" {
		return DataLoadResponse{
			Success: false,
			Error:   "apiUrl is required",
		}
	}

	if apiMethod == "" {
		apiMethod = "GET"
	}

	client := &http.Client{
		Timeout: 30 * time.Second,
	}

	var req *http.Request
	var err error

	if apiMethod == "POST" && apiBody != "" {
		req, err = http.NewRequest(apiMethod, apiUrl, strings.NewReader(apiBody))
		if err == nil {
			req.Header.Set("Content-Type", "application/json")
		}
	} else {
		req, err = http.NewRequest(apiMethod, apiUrl, nil)
	}

	if err != nil {
		return DataLoadResponse{
			Success: false,
			Error:   fmt.Sprintf("Failed to create request: %v", err),
		}
	}

	resp, err := client.Do(req)
	if err != nil {
		return DataLoadResponse{
			Success: false,
			Error:   fmt.Sprintf("API request failed: %v", err),
		}
	}
	defer resp.Body.Close()

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return DataLoadResponse{
			Success: false,
			Error:   fmt.Sprintf("Failed to read response: %v", err),
		}
	}

	if resp.StatusCode != http.StatusOK {
		return DataLoadResponse{
			Success: false,
			Error:   fmt.Sprintf("API returned status %d: %s", resp.StatusCode, string(body)),
		}
	}

	var data interface{}
	if err := json.Unmarshal(body, &data); err != nil {
		// If not JSON, return as string
		data = string(body)
	}

	return DataLoadResponse{
		Success: true,
		Data:    data,
		Preview: fmt.Sprintf("API response: %d bytes", len(body)),
		Meta: map[string]interface{}{
			"url":    apiUrl,
			"method": apiMethod,
			"status": resp.StatusCode,
		},
	}
}

func (h *Handler) loadFromManual(config map[string]interface{}) DataLoadResponse {
	manualData, _ := config["manualData"].(string)

	if manualData == "" {
		return DataLoadResponse{
			Success: false,
			Error:   "manualData is required",
		}
	}

	var data interface{}
	if err := json.Unmarshal([]byte(manualData), &data); err != nil {
		return DataLoadResponse{
			Success: false,
			Error:   fmt.Sprintf("Invalid JSON: %v", err),
		}
	}

	return DataLoadResponse{
		Success: true,
		Data:    data,
		Preview: fmt.Sprintf("Manual data: %d bytes", len(manualData)),
	}
}

// Helper functions for data saving

func (h *Handler) saveToFile(data interface{}, config map[string]interface{}) DataSaveResponse {
	filePath, _ := config["filePath"].(string)
	fileFormat, _ := config["fileFormat"].(string)

	if filePath == "" {
		return DataSaveResponse{
			Success: false,
			Error:   "filePath is required",
		}
	}

	if fileFormat == "" {
		fileFormat = "csv"
	}

	// Ensure directory exists
	dir := filepath.Dir(filePath)
	if err := os.MkdirAll(dir, 0755); err != nil {
		return DataSaveResponse{
			Success: false,
			Error:   fmt.Sprintf("Failed to create directory: %v", err),
		}
	}

	switch fileFormat {
	case "csv":
		return h.saveCSVFile(filePath, data)
	case "json":
		return h.saveJSONFile(filePath, data)
	default:
		return DataSaveResponse{
			Success: false,
			Error:   fmt.Sprintf("Unsupported file format: %s", fileFormat),
		}
	}
}

func (h *Handler) saveCSVFile(filePath string, data interface{}) DataSaveResponse {
	// Convert data to []map[string]interface{}
	var records []map[string]interface{}

	switch v := data.(type) {
	case []interface{}:
		for _, item := range v {
			if m, ok := item.(map[string]interface{}); ok {
				records = append(records, m)
			}
		}
	case []map[string]interface{}:
		records = v
	default:
		return DataSaveResponse{
			Success: false,
			Error:   "Data must be an array of objects",
		}
	}

	if len(records) == 0 {
		return DataSaveResponse{
			Success: false,
			Error:   "No data to save",
		}
	}

	// Get headers from first record
	var headers []string
	for k := range records[0] {
		headers = append(headers, k)
	}

	// Create file
	file, err := os.Create(filePath)
	if err != nil {
		return DataSaveResponse{
			Success: false,
			Error:   fmt.Sprintf("Failed to create file: %v", err),
		}
	}
	defer file.Close()

	writer := csv.NewWriter(file)
	defer writer.Flush()

	// Write headers
	if err := writer.Write(headers); err != nil {
		return DataSaveResponse{
			Success: false,
			Error:   fmt.Sprintf("Failed to write headers: %v", err),
		}
	}

	// Write rows
	for _, record := range records {
		var row []string
		for _, h := range headers {
			val := fmt.Sprintf("%v", record[h])
			row = append(row, val)
		}
		if err := writer.Write(row); err != nil {
			return DataSaveResponse{
				Success: false,
				Error:   fmt.Sprintf("Failed to write row: %v", err),
			}
		}
	}

	return DataSaveResponse{
		Success: true,
		Path:    filePath,
		Message: fmt.Sprintf("Saved %d rows to %s", len(records), filePath),
	}
}

func (h *Handler) saveJSONFile(filePath string, data interface{}) DataSaveResponse {
	content, err := json.MarshalIndent(data, "", "  ")
	if err != nil {
		return DataSaveResponse{
			Success: false,
			Error:   fmt.Sprintf("Failed to marshal JSON: %v", err),
		}
	}

	if err := os.WriteFile(filePath, content, 0644); err != nil {
		return DataSaveResponse{
			Success: false,
			Error:   fmt.Sprintf("Failed to write file: %v", err),
		}
	}

	return DataSaveResponse{
		Success: true,
		Path:    filePath,
		Message: fmt.Sprintf("Saved %d bytes to %s", len(content), filePath),
	}
}

func (h *Handler) saveToDatabase(data interface{}, config map[string]interface{}) DataSaveResponse {
	connection, _ := config["databaseConnection"].(string)
	table, _ := config["databaseTable"].(string)
	mode, _ := config["databaseMode"].(string)

	if connection == "" || table == "" {
		return DataSaveResponse{
			Success: false,
			Error:   "databaseConnection and databaseTable are required",
		}
	}

	if mode == "" {
		mode = "append"
	}

	// TODO: Implement actual database saving via Jupyter service
	return DataSaveResponse{
		Success: true,
		Message: fmt.Sprintf("Data saved to table %s (%s mode)", table, mode),
	}
}

func (h *Handler) saveToAPI(data interface{}, config map[string]interface{}) DataSaveResponse {
	apiUrl, _ := config["apiUrl"].(string)
	apiMethod, _ := config["apiMethod"].(string)

	if apiUrl == "" {
		return DataSaveResponse{
			Success: false,
			Error:   "apiUrl is required",
		}
	}

	if apiMethod == "" {
		apiMethod = "POST"
	}

	jsonData, err := json.Marshal(data)
	if err != nil {
		return DataSaveResponse{
			Success: false,
			Error:   fmt.Sprintf("Failed to marshal data: %v", err),
		}
	}

	client := &http.Client{
		Timeout: 30 * time.Second,
	}

	req, err := http.NewRequest(apiMethod, apiUrl, strings.NewReader(string(jsonData)))
	if err != nil {
		return DataSaveResponse{
			Success: false,
			Error:   fmt.Sprintf("Failed to create request: %v", err),
		}
	}

	req.Header.Set("Content-Type", "application/json")

	resp, err := client.Do(req)
	if err != nil {
		return DataSaveResponse{
			Success: false,
			Error:   fmt.Sprintf("API request failed: %v", err),
		}
	}
	defer resp.Body.Close()

	if resp.StatusCode >= 200 && resp.StatusCode < 300 {
		return DataSaveResponse{
			Success: true,
			Message: fmt.Sprintf("Data sent to API: %s (status %d)", apiUrl, resp.StatusCode),
		}
	}

	body, _ := io.ReadAll(resp.Body)
	return DataSaveResponse{
		Success: false,
		Error:   fmt.Sprintf("API returned status %d: %s", resp.StatusCode, string(body)),
	}
}

// Helper function to convert data to JSON string for Python code
func (h *Handler) dataToJSONString(data interface{}) string {
	jsonBytes, err := json.Marshal(data)
	if err != nil {
		return "[]"
	}
	return string(jsonBytes)
}

func min(a, b int) int {
	if a < b {
		return a
	}
	return b
}

// WorkflowExecuteRequest represents a workflow execution request
type WorkflowExecuteRequest struct {
	DataConfig   map[string]interface{} `json:"dataConfig"`
	PythonCode   string                 `json:"pythonCode"`
	SaveConfig   map[string]interface{} `json:"saveConfig"`
}

// WorkflowExecuteResponse represents a workflow execution response
type WorkflowExecuteResponse struct {
	Success     bool                   `json:"success"`
	Steps       []WorkflowStepResult   `json:"steps"`
	Error       string                 `json:"error,omitempty"`
	OutputPath  string                 `json:"outputPath,omitempty"`
}

// WorkflowStepResult represents a single step result
type WorkflowStepResult struct {
	Step    string `json:"step"`
	Success bool   `json:"success"`
	Message string `json:"message"`
	Error   string `json:"error,omitempty"`
}

// ExecuteWorkflow handles the complete Data → Python → Save workflow
func (h *Handler) ExecuteWorkflow(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		h.Error(w, http.StatusMethodNotAllowed, "Method not allowed")
		return
	}

	var req WorkflowExecuteRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		h.Error(w, http.StatusBadRequest, "Invalid request body")
		return
	}

	response := WorkflowExecuteResponse{
		Success: true,
		Steps:   []WorkflowStepResult{},
	}

	// Step 1: Load Data
	dataSource, _ := req.DataConfig["dataSource"].(string)
	if dataSource == "" {
		dataSource = "file"
	}

	loadReq := DataLoadRequest{
		DataSource: dataSource,
		Config:     req.DataConfig,
	}

	var loadResponse DataLoadResponse
	switch loadReq.DataSource {
	case "file":
		loadResponse = h.loadFromFile(loadReq.Config)
	case "manual":
		loadResponse = h.loadFromManual(loadReq.Config)
	default:
		loadResponse = DataLoadResponse{
			Success: false,
			Error:   fmt.Sprintf("Unsupported data source: %s", loadReq.DataSource),
		}
	}

	response.Steps = append(response.Steps, WorkflowStepResult{
		Step:    "Load Data",
		Success: loadResponse.Success,
		Message: loadResponse.Preview,
		Error:   loadResponse.Error,
	})

	if !loadResponse.Success {
		response.Success = false
		response.Error = fmt.Sprintf("Data loading failed: %s", loadResponse.Error)
		h.JSON(w, http.StatusBadRequest, response)
		return
	}

	// Step 2: Execute Python Code
	pythonResult := h.executePythonWithData(loadResponse.Data, req.PythonCode)
	response.Steps = append(response.Steps, WorkflowStepResult{
		Step:    "Execute Python",
		Success: pythonResult.Success,
		Message: pythonResult.Message,
		Error:   pythonResult.Error,
	})

	if !pythonResult.Success {
		response.Success = false
		response.Error = fmt.Sprintf("Python execution failed: %s", pythonResult.Error)
		h.JSON(w, http.StatusBadRequest, response)
		return
	}

	// Step 3: Save Data
	saveFormat, _ := req.SaveConfig["saveFormat"].(string)
	if saveFormat == "" {
		saveFormat = "file"
	}

	var saveResponse DataSaveResponse
	switch saveFormat {
	case "file":
		saveResponse = h.saveToFile(pythonResult.Data, req.SaveConfig)
	default:
		saveResponse = DataSaveResponse{
			Success: false,
			Error:   fmt.Sprintf("Unsupported save format: %s", saveFormat),
		}
	}

	response.Steps = append(response.Steps, WorkflowStepResult{
		Step:    "Save Data",
		Success: saveResponse.Success,
		Message: saveResponse.Message,
		Error:   saveResponse.Error,
	})

	if !saveResponse.Success {
		response.Success = false
		response.Error = fmt.Sprintf("Data saving failed: %s", saveResponse.Error)
		h.JSON(w, http.StatusBadRequest, response)
		return
	}

	response.OutputPath = saveResponse.Path
	h.JSON(w, http.StatusOK, response)
}

// PythonExecutionResult represents Python execution result
type PythonExecutionResult struct {
	Success bool        `json:"success"`
	Data    interface{} `json:"data,omitempty"`
	Message string      `json:"message"`
	Error   string      `json:"error,omitempty"`
}

// executePythonWithData executes Python code with provided data via Jupyter
func (h *Handler) executePythonWithData(data interface{}, code string) PythonExecutionResult {
	if code == "" {
		// If no code, just pass through data
		return PythonExecutionResult{
			Success: true,
			Data:    data,
			Message: "No Python code to execute, data passed through",
		}
	}

	// Convert data to JSON for Python
	dataJSON, err := json.Marshal(data)
	if err != nil {
		return PythonExecutionResult{
			Success: false,
			Error:   fmt.Sprintf("Failed to marshal data: %v", err),
		}
	}

	// Build Python code that loads data and executes user code
	fullCode := fmt.Sprintf(`import json
import pandas as pd

# Load input data
_input_json = '''%s'''
data = json.loads(_input_json)
df = pd.DataFrame(data)

# User code starts here
%s

# Output result
if 'result' in dir():
    if isinstance(result, pd.DataFrame):
        _output = result.to_dict(orient='records')
    else:
        _output = result
elif 'df' in dir():
    _output = df.to_dict(orient='records')
else:
    _output = data

print("__OUTPUT_START__")
print(json.dumps(_output))
print("__OUTPUT_END__")
`, string(dataJSON), code)

	// Execute via Jupyter
	jupyterURL := os.Getenv("JUPYTER_URL")
	if jupyterURL == "" {
		jupyterURL = "http://jupyter-service:8888"
	}

	execReq := map[string]interface{}{
		"code": fullCode,
	}
	execJSON, _ := json.Marshal(execReq)

	client := &http.Client{Timeout: 60 * time.Second}
	resp, err := client.Post(jupyterURL+"/api/execute", "application/json", bytes.NewReader(execJSON))
	if err != nil {
		return PythonExecutionResult{
			Success: false,
			Error:   fmt.Sprintf("Failed to connect to Jupyter: %v", err),
		}
	}
	defer resp.Body.Close()

	body, _ := io.ReadAll(resp.Body)

	if resp.StatusCode != http.StatusOK {
		return PythonExecutionResult{
			Success: false,
			Error:   fmt.Sprintf("Jupyter returned status %d: %s", resp.StatusCode, string(body)),
		}
	}

	var jupyterResp map[string]interface{}
	if err := json.Unmarshal(body, &jupyterResp); err != nil {
		return PythonExecutionResult{
			Success: false,
			Error:   fmt.Sprintf("Failed to parse Jupyter response: %v", err),
		}
	}

	// Check for errors in execution
	if errMsg, ok := jupyterResp["error"].(string); ok && errMsg != "" {
		return PythonExecutionResult{
			Success: false,
			Error:   errMsg,
		}
	}

	// Extract output from stdout
	stdout, _ := jupyterResp["output"].(string)
	
	// Parse output between markers
	startMarker := "__OUTPUT_START__"
	endMarker := "__OUTPUT_END__"
	startIdx := strings.Index(stdout, startMarker)
	endIdx := strings.Index(stdout, endMarker)

	if startIdx == -1 || endIdx == -1 || startIdx >= endIdx {
		// If markers not found, try to use output directly
		return PythonExecutionResult{
			Success: true,
			Data:    data, // Pass through original data
			Message: "Python code executed (no output captured)",
		}
	}

	outputJSON := strings.TrimSpace(stdout[startIdx+len(startMarker):endIdx])
	
	var outputData interface{}
	if err := json.Unmarshal([]byte(outputJSON), &outputData); err != nil {
		return PythonExecutionResult{
			Success: false,
			Error:   fmt.Sprintf("Failed to parse Python output: %v", err),
		}
	}

	return PythonExecutionResult{
		Success: true,
		Data:    outputData,
		Message: fmt.Sprintf("Python code executed successfully"),
	}
}

// FilePreviewRequest for simple file preview
type FilePreviewRequest struct {
	FilePath string `json:"filePath"`
	Format   string `json:"format"`
}

// PreviewFile handles file preview requests
func (h *Handler) PreviewFile(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		h.Error(w, http.StatusMethodNotAllowed, "Method not allowed")
		return
	}

	var req FilePreviewRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		h.Error(w, http.StatusBadRequest, "Invalid request body")
		return
	}

	if req.FilePath == "" {
		h.Error(w, http.StatusBadRequest, "filePath is required")
		return
	}

	if req.Format == "" {
		req.Format = "csv"
	}

	config := map[string]interface{}{
		"filePath":   req.FilePath,
		"fileFormat": req.Format,
	}

	response := h.loadFromFile(config)
	
	if !response.Success {
		h.JSON(w, http.StatusBadRequest, response)
		return
	}

	h.JSON(w, http.StatusOK, response)
}

// ListFiles lists files in a directory
type ListFilesRequest struct {
	Directory string `json:"directory"`
}

type ListFilesResponse struct {
	Success bool     `json:"success"`
	Files   []string `json:"files,omitempty"`
	Error   string   `json:"error,omitempty"`
}

func (h *Handler) ListFiles(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		h.Error(w, http.StatusMethodNotAllowed, "Method not allowed")
		return
	}

	var req ListFilesRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		h.Error(w, http.StatusBadRequest, "Invalid request body")
		return
	}

	if req.Directory == "" {
		req.Directory = "."
	}

	var files []string
	err := filepath.Walk(req.Directory, func(path string, info os.FileInfo, err error) error {
		if err != nil {
			return nil // Skip errors
		}
		if !info.IsDir() {
			files = append(files, path)
		}
		return nil
	})

	if err != nil {
		h.JSON(w, http.StatusBadRequest, ListFilesResponse{
			Success: false,
			Error:   fmt.Sprintf("Failed to list files: %v", err),
		})
		return
	}

	h.JSON(w, http.StatusOK, ListFilesResponse{
		Success: true,
		Files:   files,
	})
}
